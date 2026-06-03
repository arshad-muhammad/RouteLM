/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LLMCallParams {
  modelId: string;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
}

export interface LLMCallResult {
  content: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  actualModelUsed: string;
  success: boolean;
  error?: string;
}

export interface LLMProviderPort {
  call(params: LLMCallParams): Promise<LLMCallResult>;
}
