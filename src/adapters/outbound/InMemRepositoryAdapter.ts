import { LogRepositoryPort } from "../../ports/outbound/LogRepositoryPort";
import { KeyRepositoryPort } from "../../ports/outbound/KeyRepositoryPort";
import { RequestLogEntry, SystemMetrics, FailoverRule, RouteLMApiKey, RoutingStrategy } from "../../domain/types";
import { RouterCore } from "../../domain/entity/RouterCore";
import * as fs from "fs";
import * as path from "path";

const DATA_FILE = path.join(process.cwd(), "route_lm_data.json");

interface DataStoreSchema {
  keys: RouteLMApiKey[];
  logs: RequestLogEntry[];
  failoverRules: FailoverRule[];
}

export class InMemRepositoryAdapter implements LogRepositoryPort, KeyRepositoryPort {
  private keys: RouteLMApiKey[] = [];
  private logs: RequestLogEntry[] = [];
  private failoverRules: FailoverRule[] = [];

  constructor() {
    this.loadFromFile();
    if (this.failoverRules.length === 0) {
      this.initDefaultFailoverRules();
    }
    if (this.keys.length === 0) {
      this.initDefaultKeys();
    }
    if (this.logs.length === 0) {
      this.initDefaultLogs();
    }
    this.saveToFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(fileContent) as DataStoreSchema;
        this.keys = parsed.keys || [];
        this.logs = parsed.logs || [];
        this.failoverRules = parsed.failoverRules || [];
      }
    } catch (e) {
      console.warn("Failed to read persistence file. Starting with fallback data:", e);
    }
  }

  private saveToFile() {
    try {
      const payload: DataStoreSchema = {
        keys: this.keys,
        logs: this.logs,
        failoverRules: this.failoverRules,
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to persist data state to file:", e);
    }
  }

  private initDefaultFailoverRules() {
    this.failoverRules = [
      {
        id: "fail-gpt4o-gempro",
        primaryModel: "gpt-4o",
        fallbackModel: "gemini-3.1-pro-preview",
        triggerOnError: true,
        triggerOnLatencyMs: 2000,
        retryCount: 2,
        isEnabled: true,
      },
      {
        id: "fail-claude-gempro",
        primaryModel: "claude-3-5-sonnet",
        fallbackModel: "gemini-3.1-pro-preview",
        triggerOnError: true,
        triggerOnLatencyMs: 2500,
        retryCount: 1,
        isEnabled: true,
      },
      {
        id: "fail-gemlite-gemflash",
        primaryModel: "gemini-3.1-flash-lite",
        fallbackModel: "gemini-3.5-flash",
        triggerOnError: true,
        triggerOnLatencyMs: 1200,
        retryCount: 3,
        isEnabled: false,
      }
    ];
  }

  private initDefaultKeys() {
    this.keys = [
      {
        id: "key-1",
        key: "rlm_live_9a2f7c4b18e3d6f0c8e2",
        name: "Production Gateway Key",
        createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        status: "active",
        requestsCount: 2490,
      },
      {
        id: "key-2",
        key: "rlm_live_1d3e5f7a9c2b4d6e8f0a",
        name: "Staging Test Key",
        createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
        status: "active",
        requestsCount: 320,
      }
    ];
  }

  private initDefaultLogs() {
    // Populate high-fidelity request log history
    const defaultPrompts = [
      "Can you write a production-grade typescript decorator?",
      "Optimize this database index configuration for 10M rows...",
      "What is the difference between REST, GraphQL, and Grpc?",
      "Summarize the features of Next.js 15 App routers...",
      "What is the complexity of sorting an array of size N recursively?",
      "Validate this JWT authorization middleware function..."
    ];

    const models = ["gemini-3.1-flash-lite", "gemini-3.5-flash", "gemini-3.1-pro-preview", "gpt-4o", "claude-3-5-sonnet"];

    for (let i = 0; i < 40; i++) {
      const daysAgo = Math.floor(i / 1.5);
      const hoursAgo = (i % 24) + 1;
      const timestamp = new Date(Date.now() - (daysAgo * 24 + hoursAgo) * 3600 * 1000).toISOString();
      
      const prompt = defaultPrompts[i % defaultPrompts.length];
      const modelId = models[i % models.length];
      const strategy = [RoutingStrategy.SPEED, RoutingStrategy.COST, RoutingStrategy.INTELLIGENCE, RoutingStrategy.BALANCED][i % 4];
      
      const tokensIn = 120 + Math.floor(Math.random() * 500);
      const tokensOut = 200 + Math.floor(Math.random() * 900);
      const latencyMs = modelId.includes("pro") ? 800 + Math.floor(Math.random() * 500) : 
                        modelId.includes("lite") ? 150 + Math.floor(Math.random() * 120) : 
                        300 + Math.floor(Math.random() * 200);

      const costUsd = RouterCore.calculateCost(modelId, tokensIn, tokensOut);

      this.logs.push({
        id: `log-${i + i * 13}`,
        timestamp,
        prompt,
        strategy,
        routedModelId: modelId,
        content: `Executed routing successfully. Response generated by ${modelId}. Details were structured following RouteLM specs.`,
        latencyMs,
        costUsd,
        tokensIn,
        tokensOut,
        status: (i === 12 || i === 23) ? "failover" : "success",
        clientIp: "127.0.0.1",
      });
    }
  }

  // --- KeyRepositoryPort Implementation ---

  public async createKey(name: string): Promise<RouteLMApiKey> {
    const randomHex = Array.from({ length: 20 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const keyStr = `rlm_live_${randomHex}`;
    
    const newKey: RouteLMApiKey = {
      id: `key-${Date.now()}`,
      key: keyStr,
      name,
      createdAt: new Date().toISOString(),
      status: "active",
      requestsCount: 0,
    };
    
    this.keys.push(newKey);
    this.saveToFile();
    return newKey;
  }

  public async validateKey(key: string): Promise<boolean> {
    const found = this.keys.find((k) => k.key === key && k.status === "active");
    return !!found;
  }

  public async incrementKeyUsage(key: string): Promise<void> {
    const found = this.keys.find((k) => k.key === key);
    if (found) {
      found.requestsCount += 1;
      this.saveToFile();
    }
  }

  public async getAllKeys(): Promise<RouteLMApiKey[]> {
    return this.keys;
  }

  public async revokeKey(id: string): Promise<void> {
    const found = this.keys.find((k) => k.id === id);
    if (found) {
      found.status = "revoked";
      this.saveToFile();
    }
  }

  // --- LogRepositoryPort Implementation ---

  public async save(entry: RequestLogEntry): Promise<void> {
    this.logs.unshift(entry);
    // Maintain a clean log size limit in sandbox memory
    if (this.logs.length > 300) {
      this.logs.pop();
    }
    this.saveToFile();
  }

  public async getAll(limit: number = 100): Promise<RequestLogEntry[]> {
    return this.logs.slice(0, limit);
  }

  public async clearLogs(): Promise<void> {
    this.logs = [];
    this.saveToFile();
  }

  public async getMetrics(): Promise<SystemMetrics> {
    const totalRequests = this.logs.length;
    let successfulRequests = 0;
    let failedRequests = 0;
    let totalLatency = 0;
    let totalIn = 0;
    let totalOut = 0;
    let totalCostUsd = 0;

    const requestsByModel: Record<string, number> = {};

    this.logs.forEach((l) => {
      if (l.status === "error") {
        failedRequests++;
      } else {
        successfulRequests++;
      }
      totalLatency += l.latencyMs;
      totalIn += l.tokensIn;
      totalOut += l.tokensOut;
      totalCostUsd += l.costUsd;

      requestsByModel[l.routedModelId] = (requestsByModel[l.routedModelId] || 0) + 1;
    });

    const averageLatencyMs = totalRequests > 0 ? Math.round(totalLatency / totalRequests) : 0;

    // Calculate simulated savings (Stripe/Vercel SaaS hook). E.g. what would it cost if we always routed to Pro?
    // Cost of Pro input/output rates vs RouteLM adaptive routing rates
    const costIfAlwaysPro = this.logs.reduce((sum, log) => {
      // simulate standard gpt-4o / claude-sonnet high price
      const baselineCost = RouterCore.calculateCost("claude-3-5-sonnet", log.tokensIn, log.tokensOut);
      return sum + baselineCost;
    }, 0);
    const totalCostSavedUsd = Math.max(0, parseFloat((costIfAlwaysPro - totalCostUsd).toFixed(4)));

    // Process histories grouped into nice intervals for Recharts line chart plotting
    // Let's take the last 7 entries or group by timestamp in readable form
    const sortedLogs = [...this.logs].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    
    const latencyHistory = sortedLogs.slice(-10).map((l) => ({
      timestamp: new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      latencyMs: l.latencyMs,
    }));

    const costHistory = sortedLogs.slice(-10).map((l) => ({
      timestamp: new Date(l.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      costUsd: l.costUsd,
    }));

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
      totalCostSavedUsd,
      averageLatencyMs,
      totalTokensIn: totalIn,
      totalTokensOut: totalOut,
      requestsByModel,
      latencyHistory,
      costHistory,
    };
  }

  public async getFailoverRules(): Promise<FailoverRule[]> {
    return this.failoverRules;
  }

  public async updateFailoverRule(updated: FailoverRule): Promise<void> {
    const idx = this.failoverRules.findIndex((r) => r.id === updated.id);
    if (idx !== -1) {
      this.failoverRules[idx] = updated;
      this.saveToFile();
    }
  }
}
