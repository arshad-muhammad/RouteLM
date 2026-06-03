import { RoutingStrategy, RoutePromptRequest, RoutePromptResponse, RequestLogEntry } from "../../domain/types";
import { RouterCore } from "../../domain/entity/RouterCore";
import { LLMProviderPort } from "../outbound/LLMProviderPort";
import { LogRepositoryPort } from "../outbound/LogRepositoryPort";

export class RoutePromptUseCase {
  constructor(
    private llmProvider: LLMProviderPort,
    private logRepo: LogRepositoryPort
  ) {}

  public async execute(
    request: RoutePromptRequest,
    clientIp: string = "127.0.0.1"
  ): Promise<RoutePromptResponse> {
    const timestamp = new Date().toISOString();
    const strategy = request.strategy;
    const prompt = request.prompt;

    // 1. Core routing selection
    const primaryModelId = RouterCore.selectOptimalModel(prompt, strategy);
    
    // 2. Load failover rules Configuration
    const failoverRules = await this.logRepo.getFailoverRules();
    const activeRule = failoverRules.find(r => r.primaryModel === primaryModelId && r.isEnabled);

    const attempts: RoutePromptResponse["attempts"] = [];
    let currentModelId = primaryModelId;
    let finalContent = "";
    let finalInTokens = 0;
    let finalOutTokens = 0;
    let resolvedSuccess = false;
    let triggerFailoverLogged = false;
    let runCount = 0;
    let accumulatedLatency = 0;
    let errMessage = "";

    // Maximum execution safety (e.g. max 3 retries/attempts)
    while (runCount < 3 && !resolvedSuccess) {
      runCount++;
      const currentAttemptsLimit = activeRule ? activeRule.retryCount : 1;
      
      // Let's call model
      // We can simulate an occasional virtual endpoint outage (e.g. if model is virtual and contains "Virtual")
      // to demonstrate RouteLM's instant failover capability!
      let simulatedErr = false;
      const isVirtual = currentModelId === "gpt-4o" || currentModelId === "claude-3-5-sonnet";

      if (isVirtual && Math.random() < 0.35) {
        simulatedErr = true;
      }

      let callResult;
      
      if (simulatedErr) {
        // Mock a failure to trigger failover
        await new Promise(r => setTimeout(r, 400));
        callResult = {
          content: "",
          tokensIn: 0,
          tokensOut: 0,
          latencyMs: 400,
          actualModelUsed: currentModelId,
          success: false,
          error: `Provider Endpoint Error structure: Status (503 Service Unavailable) on ${currentModelId}`,
        };
      } else {
        // Live query
        callResult = await this.llmProvider.call({
          modelId: currentModelId,
          prompt: prompt,
          systemInstruction: request.customSystemInstruction,
          temperature: request.temperature,
        });
      }

      accumulatedLatency += callResult.latencyMs;
      
      attempts.push({
        modelId: currentModelId,
        success: callResult.success,
        error: callResult.error,
        latencyMs: callResult.latencyMs,
      });

      // Check if we should failover
      const shouldTrigger = RouterCore.shouldFailover(
        callResult.latencyMs,
        !callResult.success,
        activeRule
      );

      if (shouldTrigger && activeRule && currentModelId !== activeRule.fallbackModel) {
        // Fallback transition
        triggerFailoverLogged = true;
        currentModelId = activeRule.fallbackModel;
        errMessage = callResult.error || "Latency limit threshold crossed.";
      } else {
        resolvedSuccess = callResult.success;
        finalContent = callResult.content;
        finalInTokens = callResult.tokensIn;
        finalOutTokens = callResult.tokensOut;
        errMessage = callResult.error || "";
      }
    }

    // Fallback safeguard if all fail
    if (!resolvedSuccess) {
      finalContent = `Gateway failover notice: RouteLM routed this to fallback models but encountered general timeout or credentials blocks. Original error: ${errMessage}`;
      finalInTokens = RouterCore.estimateTokens(prompt);
      finalOutTokens = RouterCore.estimateTokens(finalContent);
    }

    // Cost computation
    const totalCostUsd = RouterCore.calculateCost(currentModelId, finalInTokens, finalOutTokens);

    const responsePayload: RoutePromptResponse = {
      success: resolvedSuccess,
      routedModelId: currentModelId,
      strategyUsed: strategy,
      content: finalContent,
      latencyMs: accumulatedLatency,
      costUsd: totalCostUsd,
      tokensIn: finalInTokens,
      tokensOut: finalOutTokens,
      attempts,
      timestamp,
    };

    // 3. Save to log repository (Hexagonal Outbound Port Adapter)
    const logStatus: RequestLogEntry["status"] = !resolvedSuccess ? "error" : triggerFailoverLogged ? "failover" : "success";
    const logEntry: RequestLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      prompt,
      strategy,
      routedModelId: currentModelId,
      content: finalContent,
      latencyMs: accumulatedLatency,
      costUsd: totalCostUsd,
      tokensIn: finalInTokens,
      tokensOut: finalOutTokens,
      status: logStatus,
      clientIp,
      errorMessage: resolvedSuccess ? undefined : errMessage,
    };

    await this.logRepo.save(logEntry);

    return responsePayload;
  }
}
