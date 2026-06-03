import { RoutingStrategy, ModelMetadata, FailoverRule } from "../types";

export const SUPPORTED_MODELS: Record<string, ModelMetadata> = {
  "gemini-3.1-flash-lite": {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    provider: "google",
    costPerTxtIn: 0.075,
    costPerTxtOut: 0.30,
    avgLatencyMs: 220,
    intelligenceScore: 68,
    isLive: true,
  },
  "gemini-3.5-flash": {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "google",
    costPerTxtIn: 0.15,
    costPerTxtOut: 0.60,
    avgLatencyMs: 380,
    intelligenceScore: 84,
    isLive: true,
  },
  "gemini-3.1-pro-preview": {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro (Preview)",
    provider: "google",
    costPerTxtIn: 1.25,
    costPerTxtOut: 5.00,
    avgLatencyMs: 1050,
    intelligenceScore: 96,
    isLive: true,
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o (Virtual/OAuth)",
    provider: "openai",
    costPerTxtIn: 2.50,
    costPerTxtOut: 10.00,
    avgLatencyMs: 820,
    intelligenceScore: 93,
    isLive: true,
  },
  "claude-3-5-sonnet": {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet (Virtual/OAuth)",
    provider: "anthropic",
    costPerTxtIn: 3.00,
    costPerTxtOut: 15.00,
    avgLatencyMs: 950,
    intelligenceScore: 97,
    isLive: true,
  },
};

export class RouterCore {
  /**
   * Evaluates prompt complexity dynamically to assign a rating between 0 and 100.
   */
  public static evaluateComplexity(prompt: string): number {
    const trimmed = prompt.trim();
    if (!trimmed) return 10;

    let score = 15;

    // Length factor
    score += Math.min(25, Math.floor(trimmed.length / 45));

    // Coding keywords
    const codeKeywords = [
      "function", "class", "const", "def ", "import", "type ", "interface",
      "implement", "code", "regex", "algorithm", "database", "query", "schema"
    ];
    if (codeKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      score += 20;
    }

    // Advanced analysis request keywords
    const analyticalKeywords = [
      "analyze", "compare", "evaluate", "optimize", "contrast", "explain in detail",
      "mathematical", "derive", "staff engineer", "architecture", "solve"
    ];
    if (analyticalKeywords.some(kw => trimmed.toLowerCase().includes(kw))) {
      score += 15;
    }

    // Question marks and structure indicators
    if (trimmed.includes("?") && trimmed.split("\n").length > 3) {
      score += 15;
    }

    return Math.min(100, Math.max(10, score));
  }

  /**
   * Resolves which starting model to query based on strategy and evaluated complexity.
   */
  public static selectOptimalModel(prompt: string, strategy: RoutingStrategy): string {
    const models = Object.values(SUPPORTED_MODELS).filter(m => m.isLive);
    if (models.length === 0) return "gemini-3.5-flash"; // fallback safe

    switch (strategy) {
      case RoutingStrategy.SPEED: {
        // Find isLive with lowest latency
        const sorted = [...models].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs);
        return sorted[0].id;
      }

      case RoutingStrategy.COST: {
        // Find isLive with lowest input cost
        const sorted = [...models].sort((a, b) => a.costPerTxtIn - b.costPerTxtIn);
        return sorted[0].id;
      }

      case RoutingStrategy.INTELLIGENCE: {
        // Find isLive with highest intelligenceScore
        const sorted = [...models].sort((b, a) => a.intelligenceScore - b.intelligenceScore);
        return sorted[0].id;
      }

      case RoutingStrategy.BALANCED: {
        const complexity = this.evaluateComplexity(prompt);
        if (complexity < 35) {
          // Ultra simple prompt -> route to flash lite
          return "gemini-3.1-flash-lite";
        } else if (complexity < 65) {
          // Medium complexity -> route to flash
          return "gemini-3.5-flash";
        } else {
          // Sophisticated engineering prompts -> route to pro pro preview
          return "gemini-3.1-pro-preview";
        }
      }

      default:
        return "gemini-3.5-flash";
    }
  }

  /**
   * Estimates tokens purely for transparent, lightning-fast UI responses and routing calculations.
   */
  public static estimateTokens(text: string): number {
    if (!text) return 0;
    // Standard char-to-token ratio helper
    return Math.max(1, Math.ceil(text.length / 4));
  }

  /**
   * Calculates execution cost in USD based on input & output token rates.
   */
  public static calculateCost(modelId: string, tokensIn: number, tokensOut: number): number {
    const meta = SUPPORTED_MODELS[modelId] || SUPPORTED_MODELS["gemini-3.5-flash"];
    const inCost = (tokensIn / 1_000_000) * meta.costPerTxtIn;
    const outCost = (tokensOut / 1_000_000) * meta.costPerTxtOut;
    return parseFloat((inCost + outCost).toFixed(8));
  }

  /**
   * Determines if a failover should trigger based on actual latency or error status.
   */
  public static shouldFailover(
    latencyMs: number,
    isError: boolean,
    rule: FailoverRule | undefined
  ): boolean {
    if (!rule || !rule.isEnabled) return false;
    if (isError && rule.triggerOnError) return true;
    if (latencyMs > rule.triggerOnLatencyMs && rule.triggerOnLatencyMs > 0) return true;
    return false;
  }
}
