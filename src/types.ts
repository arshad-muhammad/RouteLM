export enum RoutingStrategy {
  SPEED = "SPEED",
  COST = "COST",
  INTELLIGENCE = "INTELLIGENCE",
  BALANCED = "BALANCED",
}

export interface ModelMetadata {
  id: string;
  name: string;
  provider: "google" | "openai" | "anthropic" | "meta";
  costPerTxtIn: number;
  costPerTxtOut: number;
  avgLatencyMs: number;
  intelligenceScore: number;
  isLive: boolean;
}

export interface RouteLMApiKey {
  id: string;
  key: string;
  name: string;
  createdAt: string;
  status: "active" | "revoked";
  requestsCount: number;
}

export interface SystemMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalCostSavedUsd: number;
  averageLatencyMs: number;
  totalTokensIn: number;
  totalTokensOut: number;
  requestsByModel: Record<string, number>;
  latencyHistory: Array<{ timestamp: string; latencyMs: number }>;
  costHistory: Array<{ timestamp: string; costUsd: number }>;
}

export interface FailoverRule {
  id: string;
  primaryModel: string;
  fallbackModel: string;
  triggerOnError: boolean;
  triggerOnLatencyMs: number;
  retryCount: number;
  isEnabled: boolean;
}

export interface RoutePromptResponse {
  success: boolean;
  routedModelId: string;
  strategyUsed: RoutingStrategy;
  content: string;
  latencyMs: number;
  costUsd: number;
  tokensIn: number;
  tokensOut: number;
  attempts: Array<{
    modelId: string;
    success: boolean;
    error?: string;
    latencyMs: number;
  }>;
  timestamp: string;
}

export interface RequestLogEntry {
  id: string;
  timestamp: string;
  prompt: string;
  strategy: RoutingStrategy;
  routedModelId: string;
  content: string;
  latencyMs: number;
  costUsd: number;
  tokensIn: number;
  tokensOut: number;
  status: "success" | "failover" | "error";
  clientIp: string;
  errorMessage?: string;
}
