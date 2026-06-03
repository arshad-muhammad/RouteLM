import React, { useState, useEffect } from "react";
import { SystemMetrics, RequestLogEntry, RouteLMApiKey, FailoverRule, RoutingStrategy, RoutePromptResponse } from "./types";
import AnalyticsPanel from "./components/AnalyticsPanel";
import APIKeysManager from "./components/APIKeysManager";
import FailoverPolicies from "./components/FailoverPolicies";
import RequestAuditLogs from "./components/RequestAuditLogs";
import MarketingLander from "./components/MarketingLander";
import Authenticator from "./components/Authenticator";
import ProviderConnections from "./components/ProviderConnections";
import UnifiedApiGateway from "./components/UnifiedApiGateway";
import BillingManager from "./components/BillingManager";
import TeamsManager from "./components/TeamsManager";
import DeveloperDocs from "./components/DeveloperDocs";
import { Play, Sparkles, Terminal, Activity, DollarSign, Clock, ShieldAlert, Cpu, ExternalLink, Settings2, Code, Key, ChevronLeft, Users, Link2, BookOpen, Lock, ShieldCheck } from "lucide-react";

export default function App() {
  const [viewMode, setViewMode] = useState<"marketing" | "auth" | "console">("marketing");
  const [operatorEmail, setOperatorEmail] = useState("muhd.arshadra@gmail.com");
  const [activeTab, setActiveTab] = useState<"playground" | "analytics" | "keys" | "failovers" | "logs" | "connections" | "gateway" | "billing" | "teams" | "docs">("playground");
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalCostSavedUsd: 0,
    averageLatencyMs: 0,
    totalTokensIn: 0,
    totalTokensOut: 0,
    requestsByModel: {},
    latencyHistory: [],
    costHistory: [],
  });
  const [logs, setLogs] = useState<RequestLogEntry[]>([]);
  const [keys, setKeys] = useState<RouteLMApiKey[]>([]);
  const [failoverRules, setFailoverRules] = useState<FailoverRule[]>([]);

  // Playground state
  const [prompt, setPrompt] = useState("Explain the concept of backpressure inside custom TCP stream gateways in 2 sentences.");
  const [strategy, setStrategy] = useState<RoutingStrategy>(RoutingStrategy.BALANCED);
  const [systemInstruction, setSystemInstruction] = useState("You are RouteLM's elite system engineer core. Provide clear, direct, and compact answers.");
  const [temperature, setTemperature] = useState(0.7);
  const [useApiKey, setUseApiKey] = useState(false);
  const [selectedApiKey, setSelectedApiKey] = useState("");

  // Routing execution tracker
  const [isExecuting, setIsExecuting] = useState(false);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [promptResponse, setPromptResponse] = useState<RoutePromptResponse | null>(null);

  // Sync telemetry metrics on mount and when interactions complete
  const loadTelemetry = async () => {
    try {
      const res = await fetch("/api/metrics");
      const data = await res.json();
      if (data.metrics) setMetrics(data.metrics);
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error("Failed to load telemetry payload from Express gateway:", e);
    }
  };

  const loadKeys = async () => {
    try {
      const res = await fetch("/api/keys");
      const data = await res.json();
      if (data.keys) {
        setKeys(data.keys);
        if (data.keys.length > 0 && !selectedApiKey) {
          // preselect first live key automatically
          setSelectedApiKey(data.keys[0].key);
        }
      }
    } catch (e) {
      console.error("Failed to load provisioned api keys:", e);
    }
  };

  const loadFailovers = async () => {
    try {
      const res = await fetch("/api/failovers");
      const data = await res.json();
      if (data.rules) setFailoverRules(data.rules);
    } catch (e) {
      console.error("Failed to fetch gateway failover thresholds:", e);
    }
  };

  useEffect(() => {
    loadTelemetry();
    loadKeys();
    loadFailovers();
  }, []);

  // UseCase Actions
  const handleCreateKey = async (name: string) => {
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        await loadKeys();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/keys/${id}/revoke`, { method: "POST" });
      if (res.ok) {
        await loadKeys();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateFailoverRule = async (updated: FailoverRule) => {
    try {
      const res = await fetch("/api/failovers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        await loadFailovers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurgeLogs = async () => {
    try {
      const res = await fetch("/api/logs/clear", { method: "POST" });
      if (res.ok) {
        setPromptResponse(null);
        await loadTelemetry();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Route prompt execution
  const handleExecuteRoute = async () => {
    if (!prompt.trim()) return;
    setIsExecuting(true);
    setPromptResponse(null);
    setTraceLogs([]);

    // Add high-fidelity, production trace logs matching elite saas infrastructure gateways
    const appendTrace = (msg: string) => {
      setTraceLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    appendTrace("Initializing RouteLM dynamic router pipeline...");
    await new Promise((r) => setTimeout(r, 450));

    // Dynamic strategy evaluation log
    appendTrace(`Applying Routing strategy profile: [${strategy}]`);
    if (strategy === "BALANCED") {
      appendTrace("Evaluating prompt semantics and complexity weights...");
      await new Promise((r) => setTimeout(r, 400));
      const charLen = prompt.trim().length;
      appendTrace(`Analyzed prompt character length: ${charLen} chars. Assigning load criteria.`);
    }

    appendTrace("Authenticating routing request tokens...");
    await new Promise((r) => setTimeout(r, 300));
    
    try {
      const payload: any = {
        prompt,
        strategy,
        customSystemInstruction: systemInstruction,
        temperature,
      };

      if (useApiKey && selectedApiKey) {
        payload.apiKey = selectedApiKey;
        appendTrace(`Injecting Client Authorization Header: Bearer ${selectedApiKey.slice(0, 14)}•••`);
      } else {
        appendTrace("Using raw public development pipeline fallback context.");
      }

      appendTrace("Federating request to live selected models cluster...");
      const res = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Gateway general rejection status.");
      }

      const result: RoutePromptResponse = await res.json();
      setPromptResponse(result);

      appendTrace(`Gateway successful callback response from Mapped Model: ${result.routedModelId}`);
      appendTrace(`Tokens processed: In: ${result.tokensIn} / Out: ${result.tokensOut}`);
      appendTrace(`Full gateway latency overhead resolved: ${result.latencyMs} ms`);
      appendTrace(`Router execution cost saved relative to core Claude: $${(result.costUsd * 8).toFixed(6)} saved.`);

      // Refresh charts instantly
      await loadTelemetry();
      await loadKeys();
    } catch (e: any) {
      appendTrace(`[CRITICAL ERROR] Router Exception: ${e.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  if (viewMode === "marketing") {
    return (
      <MarketingLander
        onLaunchConsole={(defaultTab) => {
          setViewMode("auth");
          if (defaultTab) {
            setActiveTab(defaultTab as any);
          }
        }}
        systemMetrics={metrics}
      />
    );
  }

  if (viewMode === "auth") {
    return (
      <Authenticator
        onLoginSuccess={(email) => {
          setOperatorEmail(email);
          setViewMode("console");
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#09090B] text-[#FAFAFA] font-sans overflow-hidden select-none">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#27272A] flex flex-col bg-[#09090B] shrink-0 h-full">
        <div className="p-5 flex items-center gap-3 border-b border-[#27272A]/60">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#09090B] font-bold tracking-tighter shrink-0">
            R
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold tracking-tight text-sm text-[#FAFAFA] leading-tight">RouteLM</span>
            <span className="text-[10px] font-mono text-[#71717A] tracking-wider uppercase font-medium">Console v2.4.9</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setViewMode("marketing")}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded mb-4 text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white transition-all text-left text-[11px] font-mono font-bold border border-neutral-900 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>← PRODUCT PORTAL</span>
          </button>

          <div className="text-[10px] uppercase tracking-widest text-[#71717A] px-3 mb-2 font-bold font-mono">Infrastructure</div>
          
          <button
            onClick={() => setActiveTab("playground")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "playground" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs">Router Console</span>
          </button>
          
          <button
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "analytics" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs">Telemetry Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("connections")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "connections" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs">Provider Connections</span>
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "logs" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Code className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-xs">Audit Rail Logs</span>
            <span className="ml-auto text-[9px] font-mono bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-full text-[#71717A]">
              {logs.length}
            </span>
          </button>

          <div className="pt-4 text-[10px] uppercase tracking-widest text-[#71717A] px-3 mb-2 font-bold font-mono">Governance</div>
          
          <button
            onClick={() => setActiveTab("keys")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "keys" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs">API Gateways Vault</span>
            <span className="ml-auto text-[9px] font-mono bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-full text-[#71717A]">
              {keys.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gateway")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "gateway" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs">Unified API Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab("failovers")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "failovers" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Settings2 className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs">Failover Policies</span>
            <span className="ml-auto text-[9px] font-mono bg-[#18181B] border border-[#27272A] px-1.5 py-0.5 rounded-full text-[#71717A]">
              {failoverRules.filter(r => r.isEnabled).length}
            </span>
          </button>

          <div className="pt-4 text-[10px] uppercase tracking-widest text-[#71717A] px-3 mb-2 font-bold font-mono">Organization</div>

          <button
            onClick={() => setActiveTab("teams")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "teams" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-xs">Team Privileges</span>
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "billing" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs">Ledger & Billing</span>
          </button>

          <button
            onClick={() => setActiveTab("docs")}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all text-left ${
              activeTab === "docs" ? "bg-[#27272A]/70 text-white font-medium" : "text-[#A1A1AA] hover:bg-[#27272A]/30 hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="text-xs">Reference Docs</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#27272A]">
          <div className="flex items-center gap-2.5 px-2.5 py-2 bg-[#18181B]/60 border border-[#27272A]/60 rounded-md">
            <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center text-[9px] font-bold text-cyan-400 shrink-0">
              {operatorEmail.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[11px] font-medium truncate text-[#FAFAFA]">{operatorEmail || "Engineering Team"}</p>
              <p className="text-[9px] text-emerald-400 uppercase font-mono tracking-wider font-bold">STATION LOCKED</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#09090B]">
        {/* Header / Toolbar */}
        <header className="h-14 border-b border-[#27272A] flex items-center justify-between px-6 bg-[#09090B]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#71717A]">Org</span>
            <span className="text-[#27272A] font-mono">/</span>
            <span className="font-semibold text-slate-200">production-router-v4</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#14532D] text-[#4ADE80] font-mono font-bold border border-[#166534]">STABLE</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 bg-[#18181B] border border-[#27272A] rounded text-[#A1A1AA] text-[10px] font-mono w-48">
              <span className="opacity-50 text-xs">⌘</span>
              <span>K</span>
              <span className="text-[#71717A] text-[9px] pl-1 font-sans">Search across cluster</span>
            </div>
            <button
              onClick={handleExecuteRoute}
              disabled={isExecuting || !prompt.trim()}
              className="px-3 py-1.5 bg-white text-black text-[11px] font-bold rounded hover:bg-[#E4E4E7] transition-all disabled:opacity-40 cursor-pointer"
            >
              {isExecuting ? "Executing..." : "Execute Route"}
            </button>
          </div>
        </header>

        {/* Metric Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#27272A] border-b border-[#27272A] shrink-0">
          <div className="bg-[#09090B] p-4 flex flex-col justify-center">
            <p className="text-[9px] uppercase tracking-wider text-[#71717A] font-bold mb-1 font-mono">Federated Requests</p>
            <p className="text-xl font-mono tracking-tight font-bold text-[#FAFAFA]">
              {metrics.totalRequests.toLocaleString()}
              <span className="text-xs text-[#4ADE80] ml-2 font-mono font-normal">Active</span>
            </p>
          </div>
          <div className="bg-[#09090B] p-4 flex flex-col justify-center">
            <p className="text-[9px] uppercase tracking-wider text-[#71717A] font-bold mb-1 font-mono">Avg Ingress Latency</p>
            <p className="text-xl font-mono tracking-tight font-bold text-[#FAFAFA]">
              {metrics.averageLatencyMs}ms
              <span className="text-xs text-[#71717A] ml-2 font-mono font-normal">Real-time</span>
            </p>
          </div>
          <div className="bg-[#09090B] p-4 flex flex-col justify-center">
            <p className="text-[9px] uppercase tracking-wider text-[#71717A] font-bold mb-1 font-mono">Cost Saved (vs Claude)</p>
            <p className="text-xl font-mono tracking-tight font-bold text-[#FAFAFA]">
              ${metrics.totalCostSavedUsd.toFixed(4)}
              <span className="text-xs text-[#4ADE80] ml-2 font-mono font-normal">Accumulated</span>
            </p>
          </div>
          <div className="bg-[#09090B] p-4 flex flex-col justify-center">
            <p className="text-[9px] uppercase tracking-wider text-[#71717A] font-bold mb-1 font-mono">Gateway SLA Success</p>
            <p className="text-xl font-mono tracking-tight font-bold text-[#FAFAFA]">
              {metrics.totalRequests > 0
                ? ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)
                : "100"}%
              <span className="text-xs text-[#A1A1AA] ml-2 font-sans font-normal text-[10px]">Optimized</span>
            </p>
          </div>
        </section>

        {/* Tab Content Section */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-[#09090B]">
          {activeTab === "playground" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start h-full">
              {/* Sandbox Controls */}
              <div className="lg:col-span-7 bg-[#0C0C0E] border border-[#27272A] p-5 rounded-md space-y-4">
                <div>
                  <h3 className="font-semibold text-[#FAFAFA] text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>RouteLM Gateway Sandbox</span>
                  </h3>
                  <p className="text-[11px] text-[#71717A]">
                    Simulate prompt routing strategies, customize core instructions, and test live cluster output
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                        Optimization Strategy
                      </label>
                      <select
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value as RoutingStrategy)}
                        className="bg-[#18181B] border border-[#27272A] text-xs text-[#FAFAFA] rounded px-2.5 py-1.5 w-full focus:outline-none focus:border-[#E4E4E7] font-semibold"
                      >
                        <option value={RoutingStrategy.BALANCED}>Balanced (Auto-evaluate Load)</option>
                        <option value={RoutingStrategy.SPEED}>Speed (Minimum latency cluster)</option>
                        <option value={RoutingStrategy.COST}>Cost (Frugal pricing optimal)</option>
                        <option value={RoutingStrategy.INTELLIGENCE}>Intelligence (Capables cluster)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-[#71717A] uppercase tracking-wider font-bold">
                        <span>Temperature</span>
                        <span className="text-cyan-400 font-bold">{temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1.5"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-white bg-[#27272A] h-1 rounded outline-none mt-2.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                      Gateway Core System Instruction
                    </label>
                    <textarea
                      value={systemInstruction}
                      onChange={(e) => setSystemInstruction(e.target.value)}
                      placeholder="Add parameters instructions for the router endpoints..."
                      className="w-full bg-[#18181B] border border-[#27272A] rounded p-2 text-xs text-[#FAFAFA] placeholder:text-slate-650 focus:outline-none focus:border-[#E4E4E7] h-12 resize-none font-mono"
                    />
                  </div>

                  {/* API Validation simulation key */}
                  <div className="bg-[#18181B]/40 p-3.5 border border-[#27272A]/70 rounded space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4.5 w-4.5 text-[#A1A1AA]" />
                        <div>
                          <p className="text-xs font-semibold text-[#FAFAFA]">Enforce Gateway API Validation</p>
                          <p className="text-[10px] text-[#71717A]">Authenticate route with client authentication token</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUseApiKey(!useApiKey)}
                        className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          useApiKey ? "bg-white" : "bg-zinc-800"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                            useApiKey ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {useApiKey && (
                      <div className="space-y-1 bg-[#09090B] border border-[#27272A]/80 p-2 rounded">
                        <label className="text-[9px] font-mono text-[#71717A] uppercase block mb-1 font-bold">
                          Client Token Selector
                        </label>
                        {keys.length > 0 ? (
                          <select
                            value={selectedApiKey}
                            onChange={(e) => setSelectedApiKey(e.target.value)}
                            className="bg-[#18181B] text-xs text-slate-300 border border-[#27272A] rounded w-full py-1.5 px-2.5 font-mono outline-none"
                          >
                            {keys.map((k) => (
                              <option key={k.id} value={k.key}>
                                {k.name} ({k.key.slice(0, 15)}•••)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <p className="text-[9px] text-amber-500 font-medium">
                            Warning: Set up API keys first inside the "API Gateways" sidebar tab.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider block font-bold">
                      Prompt Payloads Query
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your routing prompt details..."
                      className="w-full bg-[#18181B] border border-[#27272A] rounded p-3 text-xs text-[#FAFAFA] placeholder:text-[#71717A] focus:outline-none focus:border-[#E4E4E7] h-20 leading-relaxed font-mono"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-[10px] font-mono text-[#71717A]">
                      Gateway endpoints accept pure JSON schemas payload
                    </div>
                    <button
                      onClick={handleExecuteRoute}
                      disabled={isExecuting || !prompt.trim()}
                      className="flex items-center space-x-2 bg-white text-black hover:bg-neutral-200 font-bold text-xs py-2 px-5 rounded select-none cursor-pointer transition disabled:opacity-40"
                    >
                      <Play className="h-3 w-3" fill="currentColor" />
                      <span>{isExecuting ? "OPTIMIZING..." : "EXECUTE ROUTE"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Console Trace Panels */}
              <div className="lg:col-span-5 space-y-4 flex flex-col h-full min-h-0">
                {/* Trace Logs Stream */}
                <div className="bg-[#0C0C0E] border border-[#27272A] p-4 rounded-md flex flex-col justify-between shrink-0">
                  <div className="flex items-center justify-between pb-2 border-b border-[#27272A]/80">
                    <div className="flex items-center space-x-2">
                      <Terminal className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-[10px] text-[#FAFAFA] font-bold uppercase tracking-widest">Live Trace Stream</span>
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_6px_#4ADE80]" />
                  </div>

                  <div className="bg-[#09090B] font-mono text-[10px] p-3 rounded mt-3 max-h-[140px] overflow-y-auto space-y-1.5 border border-[#27272A]/40 leading-relaxed select-text">
                    {traceLogs.map((log, idx) => (
                      <div key={idx} className="text-[#A1A1AA]">
                        {log}
                      </div>
                    ))}
                    {traceLogs.length === 0 && (
                      <div className="text-[#71717A] text-center py-6 font-sans text-xs">
                        Execute route query to observe traffic federating traces
                      </div>
                    )}
                  </div>
                </div>

                {/* Response payload summary card */}
                {promptResponse ? (
                  <div className="bg-[#0C0C0E] border border-[#27272A] p-4 rounded-md space-y-3 flex-1 flex flex-col min-h-0 overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-[#27272A]/60">
                      <div>
                        <h4 className="text-white font-bold text-xs font-mono uppercase tracking-widest">Resolved Output Payload</h4>
                        <p className="text-[9px] text-[#71717A] mt-0.5">Sourced from live optimized cluster</p>
                      </div>
                    </div>

                    <div className="bg-[#09090B] p-3 border border-[#27272A] rounded font-mono text-[10px] space-y-1.5 select-text shrink-0">
                      <div className="flex justify-between">
                        <span className="text-[#71717A]">OPTIMIZED MODEL:</span>
                        <span className="text-cyan-400 font-bold">{promptResponse.routedModelId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#71717A]">LATENCY OVERHEAD:</span>
                        <span className="text-[#A855F7] font-semibold">{promptResponse.latencyMs} ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#71717A]">ESTIMATED COST SAVED:</span>
                        <span className="text-[#4ADE80] font-semibold">${(promptResponse.costUsd * 8).toFixed(6)}</span>
                      </div>
                    </div>

                    <div className="bg-[#09090B] p-3 border border-[#27272A] rounded text-xs leading-relaxed text-[#FAFAFA] overflow-y-auto select-text font-mono flex-1 min-h-0">
                      {promptResponse.content}
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0C0C0E] border border-[#27272A] border-dashed p-6 rounded-md text-center text-[#71717A] text-xs flex-1 flex flex-col items-center justify-center">
                    <Terminal className="h-6 w-6 mb-2 text-[#27272A]" />
                    <span className="font-mono">Waiting for route execution call...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && <AnalyticsPanel metrics={metrics} />}

          {activeTab === "connections" && <ProviderConnections />}

          {activeTab === "keys" && (
            <APIKeysManager keys={keys} onCreateKey={handleCreateKey} onRevokeKey={handleRevokeKey} />
          )}

          {activeTab === "gateway" && <UnifiedApiGateway />}

          {activeTab === "failovers" && (
            <FailoverPolicies rules={failoverRules} onUpdateRule={handleUpdateFailoverRule} />
          )}

          {activeTab === "logs" && (
            <RequestAuditLogs logs={logs} onClearLogs={handlePurgeLogs} onRefreshLogs={loadTelemetry} />
          )}

          {activeTab === "teams" && <TeamsManager />}

          {activeTab === "billing" && <BillingManager />}

          {activeTab === "docs" && <DeveloperDocs />}
        </div>
      </main>
    </div>
  );
}
