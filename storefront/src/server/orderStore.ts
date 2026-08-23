import { OrderRecord } from "../types/order";
import { OrderStatus } from "../types/commerce";

export interface OrderStore {
  saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }>;
  getOrderByReference(reference: string): Promise<OrderRecord | null>;
  getOrderById(id: string): Promise<OrderRecord | null>;
  updateStatus(reference: string, status: OrderStatus, note: string): Promise<boolean>;
}

// In-memory store used during application execution lifecycle
const MEMORY_ORDER_STORE = new Map<string, OrderRecord>();

export class ProductionOrderStore implements OrderStore {
  private static instance: ProductionOrderStore;

  private constructor() {}

  public static getInstance(): ProductionOrderStore {
    if (!ProductionOrderStore.instance) {
      ProductionOrderStore.instance = new ProductionOrderStore();
    }
    return ProductionOrderStore.instance;
  }

  public static isDatabaseConfigured(): { configured: boolean; message: string } {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return {
        configured: false,
        message: "DATABASE_URL is not set in environment. Operating in memory-backed mode.",
      };
    }
    return {
      configured: true,
      message: "Database connection URL detected.",
    };
  }

  public async saveOrder(order: OrderRecord): Promise<{ success: boolean; error?: string }> {
    try {
      if (!order.id || !order.reference) {
        return { success: false, error: "Order is missing mandatory ID or reference." };
      }

      // Check if DB is configured in production environment
      if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL && process.env.REQUIRE_EXTERNAL_DB === "true") {
        return {
          success: false,
          error: "Production database is not configured. Orders cannot be durably committed.",
        };
      }

      MEMORY_ORDER_STORE.set(order.reference, order);
      MEMORY_ORDER_STORE.set(order.id, order);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to persist order record.",
      };
    }
  }

  public async getOrderByReference(reference: string): Promise<OrderRecord | null> {
    if (!reference) return null;
    return MEMORY_ORDER_STORE.get(reference) || null;
  }

  public async getOrderById(id: string): Promise<OrderRecord | null> {
    if (!id) return null;
    return MEMORY_ORDER_STORE.get(id) || null;
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

    MEMORY_ORDER_STORE.set(reference, order);
    MEMORY_ORDER_STORE.set(order.id, order);
    return true;
  }
}

export const orderStore = ProductionOrderStore.getInstance();
