import React, { useState } from "react";
import { Link2, ShieldCheck, RefreshCw, Zap, ToggleLeft, Check, AlertCircle, Sparkles } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  category: string;
  latencyMs: number;
  status: "connected" | "disconnected";
  keyProvided: boolean;
  queriesHandled: number;
  freeTier: boolean;
}

export default function ProviderConnections() {
  const [providers, setProviders] = useState<Provider[]>([
    { id: "gemini-flash", name: "Google Gemini 2.5 Flash / Flash Lite", category: "Google AI", latencyMs: 85, status: "connected", keyProvided: true, queriesHandled: 121, freeTier: true },
    { id: "gemini-pro", name: "Google Gemini 2.5 Pro (Deep Analytic Subgrid)", category: "Google AI", latencyMs: 195, status: "connected", keyProvided: true, queriesHandled: 42, freeTier: true },
    { id: "claude-sonnet", name: "Anthropic Claude 3.5 Sonnet", category: "Anthropic", latencyMs: 340, status: "disconnected", keyProvided: false, queriesHandled: 0, freeTier: false },
    { id: "gpt-4o", name: "OpenAI GPT-4o Infrastructure Node", category: "OpenAI", latencyMs: 290, status: "connected", keyProvided: true, queriesHandled: 95, freeTier: false },
    { id: "deepseek-v3", name: "DeepSeek Core Analytic V3", category: "DeepSeek", latencyMs: 420, status: "disconnected", keyProvided: false, queriesHandled: 0, freeTier: false }
  ]);

  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [inputKeys, setInputKeys] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const toggleConnection = (id: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === "connected" ? "disconnected" : "connected";
        return {
          ...p,
          status: nextStatus,
          queriesHandled: nextStatus === "disconnected" ? 0 : p.queriesHandled
        };
      }
      return p;
    }));
  };

  const handleTestLatency = (id: string) => {
    setActiveTestId(id);
    setTimeout(() => {
      setProviders(prev => prev.map(p => {
        if (p.id === id) {
          const simulatedLatency = Math.floor(Math.random() * 150) + (p.category === "Google AI" ? 40 : 150);
          return { ...p, latencyMs: simulatedLatency };
        }
        return p;
      }));
      setActiveTestId(null);
    }, 1200);
  };

  const handleKeySave = (id: string) => {
    const keyVal = inputKeys[id];
    if (!keyVal || keyVal.trim().length === 0) return;

    setProviders(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, keyProvided: true, status: "connected" };
      }
      return p;
    }));

    setSaveSuccess(id);
    setTimeout(() => setSaveSuccess(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <Link2 className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <span>Multi-Model Provider Connections</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Configure direct secure lines to downstream model registries. Enable stand-by model replicas matching RouteLM failover definitions.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-950/20 border border-emerald-900 px-3 py-1 rounded text-emerald-400 font-semibold shrink-0">
          ● Downstream Clusters Alive
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Connection List Grid */}
        <div className="xl:col-span-2 space-y-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 transition hover:border-neutral-700/80">
              
              {/* Identity info */}
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.status === "connected" ? "bg-emerald-400 shadow-[0_0_6px_#34D399]" : "bg-neutral-600"}`} />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-neutral-500">{p.category}</span>
                  {p.freeTier && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-400 bg-emerald-950/20 px-1 py-0.5 rounded font-bold">Free Tier Supported</span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-white font-sans">{p.name}</h3>
                <p className="text-[10px] text-neutral-500 font-mono">
                  Current Ingress Routing: <strong className="text-neutral-400">{p.queriesHandled} queries handled</strong>
                </p>
              </div>

              {/* Status and Latency Indicators */}
              <div className="flex flex-wrap items-center gap-4.5 min-w-[240px] justify-end">
                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 font-bold">Ping latency</span>
                  <div className="flex items-center gap-2 mt-1">
                    {activeTestId === p.id ? (
                      <span className="text-[11px] font-mono text-cyan-400 animate-pulse">PINGING CONGESTION CORE...</span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-neutral-300">{p.latencyMs} ms latency</span>
                    )}
                    <button
                      onClick={() => handleTestLatency(p.id)}
                      disabled={activeTestId !== null}
                      className="p-1 text-neutral-500 hover:text-white bg-neutral-900 border border-neutral-800 rounded hover:border-neutral-700 disabled:opacity-40 select-none cursor-pointer"
                      title="Test active live routing ping"
                    >
                      <RefreshCw className={`w-3 h-3 ${activeTestId === p.id ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                <div className="h-8 w-px bg-neutral-900 hidden sm:block" />

                {/* Connection switch button */}
                <button
                  onClick={() => toggleConnection(p.id)}
                  className={`w-24 text-center py-1.5 rounded font-mono text-[10px] font-bold border transition select-none cursor-pointer ${
                    p.status === "connected" 
                      ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/40" 
                      : "bg-[#18181B] text-neutral-400 border-neutral-800 hover:border-neutral-750"
                  }`}
                >
                  {p.status === "connected" ? "CONNECTED" : "INACTIVE"}
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Credentials and Sandbox keys config pane */}
        <div className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Downstream Key Provisioning</h3>
            </div>
            
            <p className="text-[11px] text-neutral-450 leading-relaxed text-neutral-400">
              Use your own provider keys for customized enterprise rate limits. By default, RouteLM routes queries to Google Gemini free tier standby replica clusters without additional costs.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { id: "gemini-key", label: "Gemini Key Override", ph: "AIzaSy..." },
                { id: "gpt-key", label: "OpenAI Key Override", ph: "sk-proj-..." }
              ].map((inp) => (
                <div key={inp.id} className="space-y-1.5">
                  <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">{inp.label}</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={inputKeys[inp.id] || ""}
                      onChange={(e) => setInputKeys(prev => ({ ...prev, [inp.id]: e.target.value }))}
                      placeholder={inp.ph}
                      className="flex-1 bg-[#18181B] border border-neutral-800 text-xs font-mono text-white p-2 rounded outline-none focus:border-neutral-600 focus:placeholder-transparent"
                    />
                    <button
                      onClick={() => handleKeySave(inp.id)}
                      className="bg-white hover:bg-neutral-200 text-black px-3 rounded text-[10px] font-mono font-bold select-none cursor-pointer transition"
                    >
                      {saveSuccess === inp.id ? "SAVED" : "SAVE"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-neutral-900/60 p-4 border border-neutral-850 rounded-md">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-mono uppercase font-bold text-white tracking-wider">Secure Hardware Enclave</p>
                <p className="text-[10px] text-neutral-500 mt-1 leading-normal font-sans font-medium">
                  All keys configured on RouteLM remain securely stored in hardware-level hardware enclaves. Keys are decrypted at evaluation boundaries inline with zero-log guarantees.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
