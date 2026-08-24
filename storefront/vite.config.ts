import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, Plugin } from "vite";
import { handleApiRequest } from "./src/server/apiRouter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiServerPlugin(): Plugin {
  return {
    name: "storefront-api-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          return next();
        }

        try {
          const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
          }
          const rawBody = Buffer.concat(chunks).toString("utf-8");

          const response = await handleApiRequest({
            method: req.method || "GET",
            pathname: url.pathname,
            searchParams: url.searchParams,
            headers: req.headers as Record<string, string | string[] | undefined>,
            rawBody,
          });

          res.statusCode = response.status;
          Object.entries(response.headers).forEach(([key, val]) => {
            res.setHeader(key, val);
          });
          res.end(response.body);
        } catch (err) {
          console.error("API error in Vite middleware:", err);
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiServerPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
