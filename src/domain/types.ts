/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  costPerTxtIn: number; // USD per 1M tokens
  costPerTxtOut: number; // USD per 1M tokens
  avgLatencyMs: number;
  intelligenceScore: number; // 1-100 rating
  isLive: boolean; // Managed inside RouteLM
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
  totalCostSavedUsd: number; // Cost saved relative to standard route-to-pro default
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
  triggerOnLatencyMs: number; // Failover if primary latency exceeds this
  retryCount: number;
  isEnabled: boolean;
}

export interface RoutePromptRequest {
  prompt: string;
  strategy: RoutingStrategy;
  temperature?: number;
  apiKey?: string;
  customSystemInstruction?: string;
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
