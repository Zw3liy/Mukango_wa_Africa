import { OrderRecord, CreateCheckoutSessionResponse } from "../types/order";
import { OrderStatus } from "../types/commerce";
import pg from "pg";

export interface OrderStore {
  saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }>;
  getOrderByReference(reference: string): Promise<OrderRecord | null>;
  getOrderById(id: string): Promise<OrderRecord | null>;
  updateStatus(reference: string, status: OrderStatus, note: string): Promise<boolean>;
  hasProcessedWebhookEvent(eventId: string): Promise<boolean>;
  recordWebhookEvent(eventId: string, provider: string, metadata?: Record<string, unknown>): Promise<boolean>;
  getIdempotencyRecord(key: string): Promise<CreateCheckoutSessionResponse | null>;
  recordIdempotency(key: string, response: CreateCheckoutSessionResponse): Promise<boolean>;
}

// In-memory test store used during automated test runs or explicit test fallback
export class TestMemoryOrderStore implements OrderStore {
  private orders = new Map<string, OrderRecord>();
  private webhooks = new Set<string>();
  private idempotency = new Map<string, CreateCheckoutSessionResponse>();

  public async saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
    if (!order.id || !order.reference) {
      return { success: false, error: "Order is missing mandatory ID or reference." };
    }
    this.orders.set(order.reference, order);
    this.orders.set(order.id, order);
    return { success: true };
  }

  public async getOrderByReference(reference: string): Promise<OrderRecord | null> {
    return this.orders.get(reference) || null;
  }

  public async getOrderById(id: string): Promise<OrderRecord | null> {
    return this.orders.get(id) || null;
  }

  public async updateStatus(reference: string, status: OrderStatus, note: string): Promise<boolean> {
    const order = await this.getOrderByReference(reference);
    if (!order) return false;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      timestamp: new Date().toISOString(),
      status,
      note,
    });
    this.orders.set(reference, order);
    this.orders.set(order.id, order);
    return true;
  }

  public async hasProcessedWebhookEvent(eventId: string): Promise<boolean> {
    return this.webhooks.has(eventId);
  }

  public async recordWebhookEvent(eventId: string): Promise<boolean> {
    this.webhooks.add(eventId);
    return true;
  }

  public async getIdempotencyRecord(key: string): Promise<CreateCheckoutSessionResponse | null> {
    return this.idempotency.get(key) || null;
  }

  public async recordIdempotency(key: string, response: CreateCheckoutSessionResponse): Promise<boolean> {
    this.idempotency.set(key, response);
    return true;
  }

  public clear(): void {
    this.orders.clear();
    this.webhooks.clear();
    this.idempotency.clear();
  }
}

export class ProductionOrderStore implements OrderStore {
  private static instance: ProductionOrderStore;
  private pool: pg.Pool | null = null;
  private tablesInitialized = false;
  private testStore: TestMemoryOrderStore | null = null;

  private constructor() {
    // If in test mode or explicitly allowed, initialize test memory store fallback
    if (process.env.NODE_ENV === "test" || process.env.ALLOW_TEST_MEMORY_STORE === "true") {
      this.testStore = new TestMemoryOrderStore();
    }
  }

  public static getInstance(): ProductionOrderStore {
    if (!ProductionOrderStore.instance) {
      ProductionOrderStore.instance = new ProductionOrderStore();
    }
    return ProductionOrderStore.instance;
  }

  public static isDatabaseConfigured(): { configured: boolean; message: string } {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.trim()) {
      return {
        configured: false,
        message: "DATABASE_URL is not configured in server environment. Durable database persistence is unavailable.",
      };
    }
    return {
      configured: true,
      message: "DATABASE_URL configured for PostgreSQL durable storage.",
    };
  }

  /**
   * Health diagnostic check to ping the database and measure latency.
   */
  public async pingDatabase(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    const pool = this.getPool();
    if (!pool) {
      return { ok: false, error: "Database pool uninitialized (DATABASE_URL not set)." };
    }

    const start = Date.now();
    try {
      await pool.query("SELECT 1 AS health_check");
      return { ok: true, latencyMs: Date.now() - start };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : "Database ping query failed.",
      };
    }
  }

  private getPool(): pg.Pool | null {
    if (this.pool) return this.pool;
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || !dbUrl.trim()) return null;

    try {
      const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
      this.pool = new pg.Pool({
        connectionString: dbUrl,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 10,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
      });

      this.pool.on("error", (err) => {
        console.error("Unexpected error on idle PostgreSQL client pool:", err);
      });

      return this.pool;
    } catch (err) {
      console.error("Failed to initialize database pool:", err);
      return null;
    }
  }

  private async ensureTablesExist(pool: pg.Pool): Promise<boolean> {
    if (this.tablesInitialized) return true;
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS mukango_orders (
          id VARCHAR(64) PRIMARY KEY,
          reference VARCHAR(64) UNIQUE NOT NULL,
          status VARCHAR(32) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          total_amount NUMERIC(12, 2) NOT NULL,
          currency VARCHAR(8) NOT NULL DEFAULT 'ZAR',
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        -- Backward-compatibility migration if table existed previously
        DO $$
        BEGIN
          IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mukango_orders') THEN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mukango_orders' AND column_name = 'total_amount') THEN
              ALTER TABLE mukango_orders ADD COLUMN total_amount NUMERIC(12, 2) DEFAULT 0;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mukango_orders' AND column_name = 'currency') THEN
              ALTER TABLE mukango_orders ADD COLUMN currency VARCHAR(8) DEFAULT 'ZAR';
            END IF;
          END IF;
        END $$;

        CREATE TABLE IF NOT EXISTS mukango_webhook_events (
          event_id VARCHAR(128) PRIMARY KEY,
          provider VARCHAR(32) NOT NULL,
          processed_at TIMESTAMPTZ NOT NULL,
          metadata JSONB
        );

        CREATE TABLE IF NOT EXISTS mukango_checkout_idempotency (
          idempotency_key VARCHAR(128) PRIMARY KEY,
          order_reference VARCHAR(64) NOT NULL,
          response JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_mukango_orders_ref ON mukango_orders(reference);
        CREATE INDEX IF NOT EXISTS idx_mukango_orders_email ON mukango_orders(customer_email);
        CREATE INDEX IF NOT EXISTS idx_mukango_orders_status ON mukango_orders(status);
        CREATE INDEX IF NOT EXISTS idx_mukango_orders_created ON mukango_orders(created_at DESC);
      `);
      this.tablesInitialized = true;
      return true;
    } catch (err) {
      console.error("Failed to create database tables:", err);
      return false;
    }
  }

  public async saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
    if (!order.id || !order.reference) {
      return { success: false, error: "Order is missing mandatory ID or reference." };
    }

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.saveOrder(order);
      }
      return {
        success: false,
        error: "Durable database is not configured. Server requires DATABASE_URL to persist orders durably.",
      };
    }

    try {
      const initialized = await this.ensureTablesExist(pool);
      if (!initialized) {
        return { success: false, error: "Database schema verification failed." };
      }

      const totalAmount = order.pricing.total;
      const currency = order.pricing.currency || "ZAR";

      await pool.query(
        `INSERT INTO mukango_orders (id, reference, status, customer_email, total_amount, currency, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           status = EXCLUDED.status,
           total_amount = EXCLUDED.total_amount,
           currency = EXCLUDED.currency,
           data = EXCLUDED.data,
           updated_at = EXCLUDED.updated_at`,
        [
          order.id,
          order.reference,
          order.status,
          order.customer.email,
          totalAmount,
          currency,
          JSON.stringify(order),
          order.createdAt,
          order.updatedAt,
        ]
      );

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Database error persisting order record.",
      };
    }
  }

  public async getOrderByReference(reference: string): Promise<OrderRecord | null> {
    if (!reference) return null;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.getOrderByReference(reference);
      }
      return null;
    }

    try {
      await this.ensureTablesExist(pool);
      const res = await pool.query(
        `SELECT data FROM mukango_orders WHERE reference = $1 LIMIT 1`,
        [reference]
      );
      if (res.rows.length === 0) return null;
      return typeof res.rows[0].data === "string" ? JSON.parse(res.rows[0].data) : res.rows[0].data;
    } catch (err) {
      console.error("Database query error retrieving order by reference:", err);
      return null;
    }
  }

  public async getOrderById(id: string): Promise<OrderRecord | null> {
    if (!id) return null;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.getOrderById(id);
      }
      return null;
    }

    try {
      await this.ensureTablesExist(pool);
      const res = await pool.query(
        `SELECT data FROM mukango_orders WHERE id = $1 LIMIT 1`,
        [id]
      );
      if (res.rows.length === 0) return null;
      return typeof res.rows[0].data === "string" ? JSON.parse(res.rows[0].data) : res.rows[0].data;
    } catch (err) {
      console.error("Database query error retrieving order by id:", err);
      return null;
    }
  }

  public async updateStatus(reference: string, status: OrderStatus, note: string): Promise<boolean> {
    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.updateStatus(reference, status, note);
      }
      return false;
    }

    const order = await this.getOrderByReference(reference);
    if (!order) return false;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      timestamp: new Date().toISOString(),
      status,
      note,
    });

    try {
      await pool.query(
        `UPDATE mukango_orders SET status = $1, data = $2, updated_at = $3 WHERE reference = $4`,
        [status, JSON.stringify(order), order.updatedAt, reference]
      );
      return true;
    } catch (err) {
      console.error("Database query error updating order status:", err);
      return false;
    }
  }

  public async hasProcessedWebhookEvent(eventId: string): Promise<boolean> {
    if (!eventId) return false;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.hasProcessedWebhookEvent(eventId);
      }
      throw new Error("Durable webhook idempotency store is unavailable: DATABASE_URL is not configured.");
    }

    try {
      await this.ensureTablesExist(pool);
      const res = await pool.query(
        `SELECT 1 FROM mukango_webhook_events WHERE event_id = $1 LIMIT 1`,
        [eventId]
      );
      return res.rows.length > 0;
    } catch (err) {
      console.error("Database query error checking webhook idempotency:", err);
      throw err;
    }
  }

  public async recordWebhookEvent(eventId: string, provider: string, metadata?: Record<string, unknown>): Promise<boolean> {
    if (!eventId) return false;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.recordWebhookEvent(eventId);
      }
      return false;
    }

    try {
      await this.ensureTablesExist(pool);
      await pool.query(
        `INSERT INTO mukango_webhook_events (event_id, provider, processed_at, metadata)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (event_id) DO NOTHING`,
        [eventId, provider, new Date().toISOString(), metadata ? JSON.stringify(metadata) : null]
      );
      return true;
    } catch (err) {
      console.error("Database query error recording webhook event:", err);
      return false;
    }
  }

  public async getIdempotencyRecord(key: string): Promise<CreateCheckoutSessionResponse | null> {
    if (!key) return null;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.getIdempotencyRecord(key);
      }
      // Fail-closed: without durable storage we cannot guarantee duplicate
      // protection, so an idempotent replay lookup reports "no record".
      return null;
    }

    try {
      await this.ensureTablesExist(pool);
      const res = await pool.query(
        `SELECT response FROM mukango_checkout_idempotency WHERE idempotency_key = $1 LIMIT 1`,
        [key]
      );
      if (res.rows.length === 0) return null;
      return typeof res.rows[0].response === "string" ? JSON.parse(res.rows[0].response) : res.rows[0].response;
    } catch (err) {
      console.error("Database query error reading checkout idempotency record:", err);
      return null;
    }
  }

  public async recordIdempotency(key: string, response: CreateCheckoutSessionResponse): Promise<boolean> {
    if (!key || !response?.reference) return false;

    const pool = this.getPool();
    if (!pool) {
      if (this.testStore) {
        return this.testStore.recordIdempotency(key, response);
      }
      return false;
    }

    try {
      await this.ensureTablesExist(pool);
      await pool.query(
        `INSERT INTO mukango_checkout_idempotency (idempotency_key, order_reference, response, created_at)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (idempotency_key) DO NOTHING`,
        [key, response.reference, JSON.stringify(response), new Date().toISOString()]
      );
      return true;
    } catch (err) {
      console.error("Database query error recording checkout idempotency:", err);
      return false;
    }
  }
}

export const orderStore = ProductionOrderStore.getInstance();
