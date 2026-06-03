import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { RoutingStrategy } from "./src/domain/types";
import { InMemRepositoryAdapter } from "./src/adapters/outbound/InMemRepositoryAdapter";
import { GoogleGenAIAdapter } from "./src/adapters/outbound/GoogleGenAIAdapter";
import { RoutePromptUseCase } from "./src/ports/inbound/RoutePromptUseCase";

interface FailoverUpdateBody {
  id: string;
  isEnabled: boolean;
  triggerOnError: boolean;
  triggerOnLatencyMs: number;
  retryCount: number;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Instantiate hexagonal components
  const dbAdapter = new InMemRepositoryAdapter();
  const geminiAdapter = new GoogleGenAIAdapter();
  const routeUseCase = new RoutePromptUseCase(geminiAdapter, dbAdapter);

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // System Metrics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await dbAdapter.getMetrics();
      const logs = await dbAdapter.getAll(40);
      res.json({ metrics, logs });
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Failed to load metrics" });
    }
  });

  // Prompt routing pipeline
  app.post("/api/route", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { prompt, strategy, customSystemInstruction, temperature, apiKey } = req.body;

      if (!prompt || typeof prompt !== "string") {
        res.status(400).json({ error: "Missing or invalid prompt string." });
        return;
      }

      const selectedStrategy = strategy as RoutingStrategy || RoutingStrategy.BALANCED;

      // Handle optional RouteLM authentication flow
      if (apiKey) {
        const isValid = await dbAdapter.validateKey(apiKey);
        if (!isValid) {
          res.status(401).json({ error: "Unauthorized: RouteLM API Key is invalid or expired." });
          return;
        }
        await dbAdapter.incrementKeyUsage(apiKey);
      }

      const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "127.0.0.1";
      const result = await routeUseCase.execute({
        prompt,
        strategy: selectedStrategy,
        customSystemInstruction,
        temperature,
      }, clientIp);

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: e.message || "Routing pipeline failure." });
    }
  });

  // Keys API
  app.get("/api/keys", async (req, res) => {
    try {
      const keys = await dbAdapter.getAllKeys();
      res.json({ keys });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/keys", async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string") {
        res.status(400).json({ error: "Key nickname/purpose name is required" });
        return;
      }
      const newKey = await dbAdapter.createKey(name);
      res.status(201).json(newKey);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/keys/:id/revoke", async (req, res) => {
    try {
      const { id } = req.params;
      await dbAdapter.revokeKey(id);
      res.json({ success: true, message: "API key successfully revoked." });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Failover Policies API
  app.get("/api/failovers", async (req, res) => {
    try {
      const rules = await dbAdapter.getFailoverRules();
      res.json({ rules });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/failovers", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { id, isEnabled, triggerOnError, triggerOnLatencyMs, retryCount } = req.body as FailoverUpdateBody;
      const rules = await dbAdapter.getFailoverRules();
      const existing = rules.find((r) => r.id === id);

      if (!existing) {
        res.status(404).json({ error: "Failover policy rule not found" });
        return;
      }

      existing.isEnabled = isEnabled ?? existing.isEnabled;
      existing.triggerOnError = triggerOnError ?? existing.triggerOnError;
      existing.triggerOnLatencyMs = triggerOnLatencyMs ?? existing.triggerOnLatencyMs;
      existing.retryCount = retryCount ?? existing.retryCount;

      await dbAdapter.updateFailoverRule(existing);
      res.json({ success: true, rule: existing });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Clear simulated developer logs
  app.post("/api/logs/clear", async (req, res) => {
    try {
      await dbAdapter.clearLogs();
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- VITE MIDDLEWARE BOOTSTRAPING ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RouteLM Gateway Online: Routing requests dynamically on http://localhost:${PORT}`);
  });
}

startServer();
