import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, Terminal, Star, Zap, Code, ShieldCheck, 
  Activity, DollarSign, Clock, Cpu, ArrowUpRight, Search,
  Check, Copy, Play, AlertTriangle, HelpCircle, HardDrive, 
  Layers, Lock, Database, ArrowRight, Sparkles, Command
} from "lucide-react";

interface MarketingLanderProps {
  onLaunchConsole: (defaultTab?: string) => void;
  systemMetrics?: any;
}

export default function MarketingLander({ onLaunchConsole, systemMetrics }: MarketingLanderProps) {
  // Navigation & interaction states
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "node" | "python" | "go">("node");
  const [copiedCodeTab, setCopiedCodeTab] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Routing Visualizer state
  const [selectedStrategy, setSelectedStrategy] = useState<"balanced" | "speed" | "cost" | "iq">("balanced");
  const [visualizerState, setVisualizerState] = useState<"idle" | "evaluating" | "routed">("idle");
  const [latencySaved, setLatencySaved] = useState(0);
  const [costSaved, setCostSaved] = useState(0);
  const [resolvedProvider, setResolvedProvider] = useState("");

  // Failover simulator states
  const [simulatedTrigger, setSimulatedTrigger] = useState<"none" | "latency" | "error">("none");
  const [failoverStep, setFailoverStep] = useState<string>("Standby readiness active");
  const [failoverLogs, setFailoverLogs] = useState<string[]>([]);
  const [failoverStatus, setFailoverStatus] = useState<"idle" | "simulating" | "resolved">("idle");

  // Command palette state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState("");

  // Handle Ctrl+K / Cmd+K search palette triggering
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerVisualizerFlow = () => {
    setVisualizerState("evaluating");
    setTimeout(() => {
      setVisualizerState("routed");
      if (selectedStrategy === "balanced") {
        setResolvedProvider("Gemini 2.5 Flash + Cost Guard");
        setLatencySaved(120);
        setCostSaved(84);
      } else if (selectedStrategy === "speed") {
        setResolvedProvider("Gemini 2.5 Flash (Ultra-low latency cluster)");
        setLatencySaved(340);
        setCostSaved(75);
      } else if (selectedStrategy === "cost") {
        setResolvedProvider("Frugal Gemini 2.5 Flash Core");
        setLatencySaved(50);
        setCostSaved(93);
      } else {
        setResolvedProvider("Gemini 2.5 Pro (Deep Analytic Subgrid)");
        setLatencySaved(0);
        setCostSaved(40);
      }
    }, 1200);
  };

  const handleRunFailoverSimulation = (type: "latency" | "error") => {
    setSimulatedTrigger(type);
    setFailoverStatus("simulating");
    setFailoverLogs([]);
    
    const steps = type === "latency" ? [
      "⚡ Inbound payload triggered on legacy model endpoint...",
      "⏱️ Timer started. Latency profile check at t=1200ms...",
      "⚠️ Timeout limit breached! [Trigger Threshold set at 1500ms]",
      "🔄 Activating failover rules: FailoverPolicies.tsx interceptor triggered.",
      "🚀 Routing traffic inline to secondary healthy stand-by node: Gemini 2.5 Flash",
      "✅ Payload answered securely. Total failover recovery time: 1.4ms."
    ] : [
      "🔥 Inbound payload processed on primary model API ingress...",
      "❌ Primary model threw raw exception: HTTP 502 Service Unavailable",
      "🔄 Error-Catcher Middleware intercepted cluster shutdown...",
      "🛡️ Validating secondary routing failover policies...",
      "⚡ Dispatching fallback route to hot standby replica: Gemini 2.5 Flash",
      "✅ Output payload established. Zero operational downtime recorded."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setFailoverStep(steps[i]);
        setFailoverLogs((prev) => [...prev, steps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setFailoverStatus("resolved");
      }
    }, 600);
  };

  const copyCodeToClipboard = () => {
    let codeStr = "";
    if (activeCodeTab === "curl") {
      codeStr = `curl -X POST "https://api.routelm.com/v1/route" \\
  -H "Authorization: Bearer rlm_live_8f3dsa901k" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Optimize transactional indexing algorithms",
    "strategy": "BALANCED"
  }'`;
    } else if (activeCodeTab === "node") {
      codeStr = `import { RouteClient } from "@routelm/sdk";

const rlm = new RouteClient({ apiKey: "rlm_live_8f3dsa901k" });

const response = await rlm.route({
  prompt: "Optimize transactional indexing algorithms",
  strategy: "BALANCED",
  temperature: 0.7
});

console.log(response.content);`;
    } else if (activeCodeTab === "python") {
      codeStr = `from routelm import RouteLM

rlm = RouteLM(api_key="rlm_live_8f3dsa901k")

response = rlm.route(
    prompt="Optimize transactional indexing algorithms",
    strategy="BALANCED"
)

print(response.content)`;
    } else {
      codeStr = `package main

import (
    "context"
    "fmt"
    "github.com/routelm/routelm-go"
)

func main() {
    client := routelm.NewClient("rlm_live_8f3dsa901k")
    resp, _ := client.Route(context.Background(), routelm.RouteParams{
        Prompt:   "Optimize transactional indexing algorithms",
        Strategy: routelm.StrategyBalanced,
    })
    fmt.Println(resp.Content)
}`;
    }
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeTab(true);
    setTimeout(() => setCopiedCodeTab(false), 2000);
  };

  // Filter commands for Cmd+K search palette
  const commands = [
    { title: "Gateway Router Demo Console", sub: "Interactive developer environment", action: () => { onLaunchConsole("playground"); setIsCommandPaletteOpen(false); } },
    { title: "Live Telemetry Analytics", sub: "Analyze ingress requests latency", action: () => { onLaunchConsole("analytics"); setIsCommandPaletteOpen(false); } },
    { title: "Manage Provisioned API Keys", sub: "Issue secure pipeline credentials", action: () => { onLaunchConsole("keys"); setIsCommandPaletteOpen(false); } },
    { title: "Configure Failover Thresholds", sub: "Define secondary backup paths", action: () => { onLaunchConsole("failovers"); setIsCommandPaletteOpen(false); } },
    { title: "View Dynamic Audit Rail Logs", sub: "Review history of routed payloads", action: () => { onLaunchConsole("logs"); setIsCommandPaletteOpen(false); } },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(commandSearch.toLowerCase()) ||
    cmd.sub.toLowerCase().includes(commandSearch.toLowerCase())
  );

  return (
    <div className="bg-[#09090B] text-[#FAFAFA] h-screen w-full font-sans selection:bg-neutral-800 selection:text-white overflow-y-auto">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onLaunchConsole("playground")}>
            <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-black font-extrabold tracking-tighter shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-shadow duration-300">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white select-all group-hover:text-neutral-200 transition-colors">RouteLM</span>
              <span className="text-[9px] font-mono tracking-wider text-cyan-500/80 uppercase font-semibold">Dual-Plane Core</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs text-neutral-400 font-medium">
            <a href="#visualizer" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Core Visualizer</a>
            <a href="#features" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Architecture Specs</a>
            <a href="#failover" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Downtime Mitigation</a>
            <a href="#integrations" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">API SDKs</a>
            <a href="#pricing" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Billing Saved</a>
            <a href="#faq" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Developer FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 bg-[#0C0C0E] border border-neutral-800 rounded-md px-3 py-1.5 text-neutral-400 text-[11px] font-mono hover:bg-neutral-900 hover:border-neutral-700 hover:text-neutral-300 transition-all cursor-pointer group"
            >
              <Command className="w-3.5 h-3.5 group-hover:text-cyan-400 transition-colors" />
              <span>Search platform</span>
              <span className="text-[9px] bg-neutral-900 px-1 py-0.5 rounded text-neutral-500 border border-neutral-800">⌘K</span>
            </button>
            <button
              onClick={() => onLaunchConsole("playground")}
              className="bg-white hover:bg-neutral-200 text-black text-[11px] font-bold px-4 py-2 rounded-md transition-all cursor-pointer select-none shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              LAUNCH CONSOLE
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40 border-b border-neutral-900 bg-black">
        {/* Abstract Background Effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 bg-[#0C0C0E] border border-neutral-800/80 px-3.5 py-1.5 rounded-full text-[11px] text-neutral-300 font-mono mb-8 hover:bg-neutral-900 transition cursor-default shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>Dual-Plane Optimization engine available on v2.4.9</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-400 max-w-5xl mx-auto leading-[1.1]"
          >
            Connect Your Free Keys. <br /> Get a Single Resilient API.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
          >
            Stop managing separate API integrations. Connect your free keys to get one unified gateway API key. If any model fails or hits its rate limit, RouteLM automatically routes requests to a healthy standby with 0ms downtime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => onLaunchConsole("playground")}
              className="w-full sm:w-auto bg-white text-black hover:bg-neutral-200 text-xs font-bold px-7 py-3.5 rounded tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)] font-mono select-none"
            >
              <span>LAUNCH CLUSTER CONSOLE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#integrations"
              className="w-full sm:w-auto bg-transparent hover:bg-[#0C0C0E] text-neutral-300 hover:text-white text-xs font-mono font-bold px-7 py-3.5 rounded border border-neutral-700 hover:border-neutral-500 transition flex items-center justify-center gap-2 select-none"
            >
              <Terminal className="w-4 h-4" />
              <span>SDK DOCUMENTATION</span>
            </a>
          </motion.div>

          {/* Micro Telemetry HUD Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20 flex flex-wrap justify-center items-center gap-8 sm:gap-12 text-[11px] font-mono text-neutral-500 max-w-3xl mx-auto pt-8 border-t border-neutral-900/50"
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight">4.1ms</span>
              <span className="uppercase text-[9px] tracking-wider font-semibold text-neutral-500">Router overhead</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-neutral-900" />
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-white font-bold text-lg sm:text-xl tracking-tight">82.3%</span>
              <span className="uppercase text-[9px] tracking-wider font-semibold text-neutral-500">Avg compute savings</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-neutral-900" />
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-emerald-400 font-bold text-lg sm:text-xl tracking-tight drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">99.999%</span>
              <span className="uppercase text-[9px] tracking-wider font-semibold text-emerald-600/80">System reliability SLA</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted-By Developer Brands Row */}
      <section className="bg-black py-12 border-b border-neutral-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-transparent to-[#09090B] pointer-events-none z-10" />
        <div className="max-w-7xl mx-auto px-6 relative z-0">
          <p className="text-center text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold mb-10">
            Engineered For Modern High-Performance Developer Stacks
          </p>
          <div className="flex flex-wrap justify-center gap-10 sm:gap-16 items-center opacity-50 hover:opacity-100 transition-opacity duration-500">
            <span className="text-white font-bold tracking-tight font-display text-base">▲ VERCEL</span>
            <span className="text-white font-bold tracking-tight font-display text-base">🗲 STRIPE</span>
            <span className="text-white font-semibold tracking-tight font-display text-base">⧉ LINEAR</span>
            <span className="text-white font-bold tracking-tight font-display text-base">□ OPENAI</span>
            <span className="text-white font-semibold tracking-tight font-display text-base">◇ HASHICORP</span>
            <span className="text-white font-bold tracking-tight font-display text-base">○ SUPABASE</span>
          </div>
        </div>
      </section>

      {/* Animated AI Provider Routing Visualization */}
      <section id="visualizer" className="py-32 max-w-7xl mx-auto px-6 border-b border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-8">
            <div className="inline-flex items-center gap-1.5 bg-cyan-950/30 text-cyan-400 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border border-cyan-900/50 shadow-sm">
              <Layers className="w-3.5 h-3.5" />
              <span>Gateway Router Mechanics</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12] font-display">
              Watch Real-Time Routing Logic in Action.
            </h2>
            <p className="text-base text-neutral-400 leading-relaxed">
              Select your preferred routing strategy. When a request comes in, RouteLM instantly evaluates your API limits, detects model slowdowns, and dynamically forwards the request to the ideal active standby model.
            </p>

            {/* Interactive Strategy Selector */}
            <div className="space-y-3 pt-2">
              {[
                { id: "balanced", title: "Smart Automatic Mode (Auto-Fallback)", desc: "Dynamically shifts requests to the best available models to prevent rate limits." },
                { id: "speed", title: "Absolute Speed Focus", desc: "Monitors response times and reroutes traffic if a model lags to guarantee speed." },
                { id: "cost", title: "Frugal Cost Optimizer", desc: "Routes lightweight prompts to free endpoints, maximizing your cost savings." },
                { id: "iq", title: "High IQ Analytic Mode", desc: "Sends highly complex prompts to Pro models, reserving simpler tasks for free tiers." }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedStrategy(item.id as any);
                    setVisualizerState("idle");
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex justify-between items-start cursor-pointer group ${
                    selectedStrategy === item.id 
                      ? "bg-neutral-900 border-neutral-700 shadow-[0_0_20px_rgba(34,211,238,0.05)]" 
                      : "bg-transparent border-neutral-900 hover:border-neutral-800 hover:bg-neutral-900/40"
                  }`}
                >
                  <div>
                    <p className={`text-sm font-bold leading-none mb-2 ${selectedStrategy === item.id ? "text-white" : "text-neutral-400 group-hover:text-neutral-300"}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-500 leading-relaxed font-sans font-medium pr-6">
                      {item.desc}
                    </p>
                  </div>
                  {selectedStrategy === item.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse mt-1 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={triggerVisualizerFlow}
              className="w-full py-4 mt-2 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold tracking-widest rounded-xl transition cursor-pointer select-none shadow-lg shadow-white/5"
            >
              RUN PIPELINE LOGIC
            </button>
          </div>

          {/* Interactive Routing Pipeline Canvas mockup */}
          <div className="lg:col-span-7 bg-[#0C0C0E] border border-neutral-800 rounded p-6 shadow-xl relative min-h-[460px] flex flex-col justify-between">
            {/* Simulation Stream */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/85">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">Gateway Resolution Stream</span>
              </div>
              <span className="text-[9px] font-mono text-neutral-500">Pipeline Node: Active</span>
            </div>

            <div className="flex-1 flex flex-col justify-center py-6 min-h-[250px]">
              {visualizerState === "idle" && (
                <div className="text-center py-10">
                  <div className="w-10 h-10 border border-neutral-800 rounded flex items-center justify-center mx-auto text-neutral-500 mb-3 animate-pulse">
                    ?
                  </div>
                  <p className="text-xs text-neutral-400 font-mono">Select a strategy and launch route parsing pipeline</p>
                </div>
              )}

              {visualizerState === "evaluating" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">Ingress state:</span>
                    <span className="text-cyan-400 animate-pulse text-[10px] font-mono font-bold">EXAMINING SEMANTICS...</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1 rounded overflow-hidden">
                    <motion.div 
                      className="bg-white h-full" 
                      initial={{ width: "0%" }} 
                      animate={{ width: "100%" }} 
                      transition={{ duration: 1.1 }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 space-y-1 pt-2 select-none">
                    <p className="text-neutral-500">🤖 [system] parsing prompt syntax profiles...</p>
                    <p className="text-neutral-500">🤖 [system] pinging backend cluster sub-nodes...</p>
                    <p className="text-neutral-500">🤖 [system] applying metrics balance tradeoffs...</p>
                  </div>
                </div>
              )}

              {visualizerState === "routed" && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-5"
                >
                  <div className="bg-[#09090B] p-4.5 border border-neutral-800 rounded">
                    <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-wider mb-2">Routing Decision Resolved</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">{resolvedProvider}</span>
                      <span className="text-[10px] bg-emerald-950/30 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-mono font-semibold">STABLE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-900/60 p-3.5 border border-neutral-850 rounded">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Computed cost savings</p>
                      <p className="text-lg font-bold text-[#4ADE80] font-mono mt-1">{costSaved}% savings</p>
                    </div>
                    <div className="bg-neutral-900/60 p-3.5 border border-neutral-850 rounded">
                      <p className="text-[9px] font-mono text-neutral-500 uppercase">Computed latency saved</p>
                      <p className="text-lg font-bold text-[#A855F7] font-mono mt-1">{latencySaved}ms faster</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* SVG Visual Flow schematic */}
            <div className="border-t border-neutral-900 pt-4 text-center">
              <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-3">Model Core Federated Grid Map</p>
              <div className="flex items-center justify-center gap-7 text-[10px] font-mono font-bold text-neutral-500 select-none pb-1">
                <span className={selectedStrategy === "cost" ? "text-emerald-400" : ""}>Gemini Flash</span>
                <span className="text-neutral-850">---</span>
                <span className={selectedStrategy === "balanced" ? "text-cyan-400 animate-pulse" : ""}>RouteLM Proxy</span>
                <span className="text-neutral-850">---</span>
                <span className={selectedStrategy === "iq" ? "text-[#C084FC]" : ""}>Gemini Pro</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-24 sm:py-32 bg-black border-b border-neutral-900 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 mb-20">
            <span className="inline-block px-3 py-1.5 bg-[#0C0C0E] text-neutral-400 border border-neutral-800 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-sm">
              Why use RouteLM?
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Simple Setup. Absolute Uptime.
            </h2>
            <p className="text-base text-neutral-400 leading-relaxed max-w-2xl mx-auto">
              Stop writing custom retry logic or handling rate limits manually. Connect your free keys once to get a single resilient API key that never fails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-cyan-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-950/30 group-hover:border-cyan-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Instant Fallback</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  If your primary model takes too long, raises an error, or hits its rate limit, RouteLM instantly reroutes the request in 1.4 milliseconds to a healthy standby.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-emerald-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-950/30 group-hover:border-emerald-500/30">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Smart Cost Optimizer</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  Save up to 80% on compute costs. RouteLM automatically routes simpler queries to free, highly-capable models like Gemini 2.5 Flash, saving premium models for advanced tasks.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-purple-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-950/30 group-hover:border-purple-500/30">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Centralized Sandbox Key</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  Receive one single API key that securely acts as front-facing gateway. Avoid exposing your personal keys in frontend apps or microservices.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-rose-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-rose-500 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-rose-950/30 group-hover:border-rose-500/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Continuous Reliability</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  Hot standby replicas remain active. Immediate failover ensures your app experiences 100% continuous runtime, even during global provider outages.
                </p>
              </div>
            </div>

            {/* Card 5 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-amber-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-amber-950/30 group-hover:border-amber-500/30">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Detailed Ingress Logging</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  Review exactly how every query got parsed. Track latency differences, fallback history triggers, and token usage inside a clear dashboard console.
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="group bg-[#09090B] border border-neutral-800 p-8 rounded-xl hover:border-blue-500/50 transition-all duration-300 space-y-5 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-neutral-900 rounded-lg border border-neutral-800 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-950/30 group-hover:border-blue-500/30">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Cache-Aside Optimization</h3>
                <p className="text-sm text-neutral-400 leading-relaxed mt-3">
                  Redis caching integrated out-of-the-box. Deliver instant duplicate prompt resolution to active systems, avoiding computing overhead and saving money over time.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive Failover Demonstration */}
      <section id="failover" className="py-32 max-w-7xl mx-auto px-6 border-b border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <span className="inline-block px-3 py-1.5 bg-red-950/20 text-red-400 border border-red-900/40 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-sm">
              Dynamic Outage Simulator
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12] font-display">
              Simulate a Model Interruption
            </h2>
            <p className="text-base text-neutral-400 leading-relaxed">
              Experience RouteLM's reliable fallback logic. Trigger a simulated API crash or high-latency spike, and watch RouteLM automatically detect the problem and rescue requests in milliseconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => handleRunFailoverSimulation("error")}
                className="flex-1 py-4 px-4 bg-[#09090B] border border-red-900/40 hover:border-red-500 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] text-red-400 hover:text-white hover:bg-red-950/30 text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer select-none"
              >
                ⚠️ CRASH PRIMARY API (502)
              </button>
              <button
                onClick={() => handleRunFailoverSimulation("latency")}
                className="flex-1 py-4 px-4 bg-[#09090B] border border-amber-900/40 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] text-amber-500 hover:text-white hover:bg-amber-950/30 text-xs font-mono font-bold tracking-wider rounded-xl transition-all cursor-pointer select-none"
              >
                ⏱️ LATENCY SPIKE (4000MS)
              </button>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7 bg-[#0C0C0E] border border-neutral-800 rounded p-6 shadow-xl relative min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest">Active Outage Controller</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
            </div>

            <div className="flex-1 my-6">
              {failoverStatus === "idle" && (
                <div className="text-center py-12">
                  <p className="text-xs text-neutral-400 font-mono">Trigger a simulation on the left panel to watch failover execution logs</p>
                </div>
              )}

              {failoverStatus === "simulating" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500">SIMULATOR ACTION RUNNING:</span>
                    <span className="text-rose-500 text-[10px] font-mono font-bold animate-pulse">RECOVERY ATTEMPTS ACTIVE</span>
                  </div>
                  <div className="bg-[#09090B] p-4 border border-neutral-800 rounded">
                    <p className="text-xs text-white font-mono animate-pulse">{failoverStep}</p>
                  </div>
                  <div className="bg-[#09090B] font-mono text-[9px] p-3 rounded text-neutral-500 space-y-1 select-none max-h-[120px] overflow-y-auto">
                    {failoverLogs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed">{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {failoverStatus === "resolved" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="space-y-4"
                >
                  <div className="p-4 bg-emerald-950/20 border border-emerald-900/60 rounded">
                    <p className="text-[9px] font-mono text-[#4ADE80] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Outage Stabilized Successfully</span>
                    </p>
                    <p className="text-xs text-white font-mono mt-1">
                      RouteLM intercepted 100% of failed packets. Traffic is operating successfully on the hot standbys.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850">
                      <span className="text-neutral-500 uppercase">Recovery latency</span>
                      <p className="text-sm font-bold text-white mt-1">1.4ms</p>
                    </div>
                    <div className="bg-neutral-900 p-3 rounded border border-neutral-850">
                      <span className="text-neutral-500 uppercase">Operational downtime</span>
                      <p className="text-sm font-bold text-emerald-400 mt-1">0.00%</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="border-t border-neutral-900 pt-3 flex justify-between items-center text-[10px] font-mono text-neutral-500 select-none">
              <span>Rule source: FailoverPolicies.tsx</span>
              <span>Replication standby: Gemini Flash Stable</span>
            </div>
          </div>

        </div>
      </section>

      {/* Developer Integration Code Blocks */}
      <section id="integrations" className="py-32 bg-[#09090B] border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-8">
              <span className="inline-block px-3 py-1.5 bg-[#121214] text-neutral-300 border border-neutral-800 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-sm">
                SDK Documentation
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.12] font-display">
                Integrates in Three Lines of Code.
              </h2>
              <p className="text-base text-neutral-400 leading-relaxed">
                Replace your complex multi-provider API clients. Initialize with a single RouteLM key to automatically protect your application from rate-limits or system crash downs.
              </p>

              {/* Language Selector */}
              <div className="flex flex-wrap gap-2 pt-4">
                {[
                  { id: "node", label: "NODEJS / TS" },
                  { id: "python", label: "PYTHON" },
                  { id: "curl", label: "CURL" },
                  { id: "go", label: "GO LANGUAGE" }
                ].map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setActiveCodeTab(lang.id as any);
                      setCopiedCodeTab(false);
                    }}
                    className={`px-4 py-2 text-[10px] font-mono rounded-lg border transition-all cursor-pointer font-bold select-none ${
                      activeCodeTab === lang.id 
                        ? "bg-white text-black border-white shadow-lg shadow-white/10" 
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Code IDE Panel */}
            <div className="lg:col-span-7 bg-[#0C0C0E] border border-neutral-850 rounded-lg overflow-hidden shadow-2xl relative min-h-[300px]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#09090B] border-b border-neutral-850">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neutral-800" />
                  <span className="w-3 h-3 rounded-full bg-neutral-800" />
                  <span className="w-3 h-3 rounded-full bg-neutral-800" />
                  <span className="text-[10px] font-mono text-neutral-500 ml-2 select-none">
                    {activeCodeTab === "node" ? "index.ts" : activeCodeTab === "python" ? "main.py" : activeCodeTab === "curl" ? "terminal" : "main.go"}
                  </span>
                </div>
                <button
                  onClick={copyCodeToClipboard}
                  className="p-1 px-3.5 flex items-center space-x-1 border border-neutral-800 bg-neutral-900 rounded font-mono text-[10px] text-neutral-400 hover:text-white transition cursor-pointer select-none"
                >
                  {copiedCodeTab ? (
                    <Check className="w-3 h-3 text-[#4ADE80]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedCodeTab ? "COPIED" : "COPY CODE"}</span>
                </button>
              </div>

              <div className="p-5 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed overflow-y-auto">
                {activeCodeTab === "curl" && (
                  <pre className="text-cyan-400 select-all">
{`curl -X POST "https://api.routelm.com/v1/route" \\
  -H "Authorization: Bearer rlm_live_8f3dsa901k" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Optimize transactional indexing algorithms",
    "strategy": "BALANCED"
  }'`}
                  </pre>
                )}

                {activeCodeTab === "node" && (
                  <pre className="text-white select-all">
                    <span className="text-emerald-400">import</span> {`{ RouteClient }`} <span className="text-emerald-400">from</span> <span className="text-neutral-500">"@routelm/sdk"</span>;<br /><br />
                    <span className="text-emerald-400">const</span> rlm = <span className="text-cyan-400">new</span> RouteClient({`{ apiKey: "rlm_live_8f3dsa901k" }`});<br /><br />
                    <span className="text-emerald-400">const</span> response = <span className="text-cyan-400">await</span> rlm.route({`{
  prompt: "Optimize transactional indexing algorithms",
  strategy: "BALANCED",
  temperature: 0.7
}`});<br /><br />
                    <span className="text-cyan-400">console</span>.log(response.content);
                  </pre>
                )}

                {activeCodeTab === "python" && (
                  <pre className="text-neutral-300 select-all">
                    <span className="text-emerald-400">from</span> routelm <span className="text-emerald-400">import</span> RouteLM<br /><br />
                    rlm = RouteLM(api_key=<span className="text-neutral-500">"rlm_live_8f3dsa901k"</span>)<br /><br />
                    response = rlm.route(<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;prompt=<span className="text-neutral-500">"Optimize transactional indexing algorithms"</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;strategy=<span className="text-neutral-500">"BALANCED"</span><br />
                    )<br /><br />
                    <span className="text-cyan-400">print</span>(response.content)
                  </pre>
                )}

                {activeCodeTab === "go" && (
                  <pre className="text-neutral-200 select-all">
                    <span className="text-emerald-400">package</span> main<br /><br />
                    <span className="text-emerald-400">import</span> (<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500">"context"</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500">"fmt"</span><br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-neutral-500">"github.com/routelm/routelm-go"</span><br />
                    )<br /><br />
                    <span className="text-emerald-400">func</span> main() {`{`}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;client := routelm.NewClient(<span className="text-neutral-500">"rlm_live_8f3dsa901k"</span>)<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;resp, _ := client.Route(context.Background(), routelm.RouteParams{`{`}<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Prompt:&nbsp;&nbsp;&nbsp;<span className="text-neutral-500">"Optimize transactional indexing algorithms"</span>,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Strategy: routelm.StrategyBalanced,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;{`}`})<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;fmt.Println(resp.Content)<br />
                    {`}`}
                  </pre>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benchmark Comparisons */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 bg-[#0C0C0E] border border-neutral-800 rounded p-6 shadow-xl relative select-none">
            <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest font-bold mb-4">RouteLM Federated Efficiency Benchmarks</p>
            <div className="space-y-4">
              
              {/* Bench 1 */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                  <span>STALWART CLAUDE 3.5 OPUS (STATIC)</span>
                  <span>$15.00 / 1M tokens</span>
                </div>
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#EF4444] h-full rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              {/* Bench 2 */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                  <span>GPT-4O INFRASTRUCTURE NODE (STATIC)</span>
                  <span>$10.00 / 1M tokens</span>
                </div>
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: "70%" }} />
                </div>
              </div>

              {/* Bench 3 */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 mb-1">
                  <span>ROUTELM CONSOLIDATED DUAL-PLANE (BALANCED)</span>
                  <span className="text-emerald-400 font-bold">$1.80 / 1M tokens</span>
                </div>
                <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-[#10B981] h-full rounded-full" style={{ width: "18%" }} />
                </div>
              </div>

            </div>

            <div className="mt-6 border-t border-neutral-900 pt-4 text-center">
                <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                  Calculated against standard developer benchmarks across production pipelines. Average RouteLM compute cost is slashed over <strong className="text-[#10B981]">82.3%</strong>.
                </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <span className="px-2.5 py-1 bg-cyan-950/20 text-cyan-400 border border-cyan-400/20 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
              Engineering Cost Studies
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Slash Operational Expenses Without Compelling IQ Reductions.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Classical direct provider calls waste up to 80% of resources processing routine queries on hyper-premium models. RouteLM intelligently routes simple request prompts down to optimized sub-modules automatically. Say goodbye to developer budget drain.
            </p>
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-black border-b border-neutral-900 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-4 font-bold">DEVELOPER TESTIMONIALS</p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto mb-16 leading-tight">
            Backed and trusted by the world's most intense model developers.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {[
              { text: "RouteLM completely fundamentally re-engineered how our machine learning operations stack functions. We saved over $80,000 in monthly direct infrastructure costs in our first quarter.", auth: "Elena V.", position: "VP of Infra, Cohere Scale" },
              { text: "We were maintaining thousands of fragile helper scripts to handle Claude rate limit failures and openai gateway timeouts. Substituting it with RouteLM gave us immediate peace of mind.", auth: "Marcus K.", position: "Head of Developer Platforms, Supabase Grid" },
              { text: "The dual-plane latency breaker is pure magic. Prompt payloads are answered continuously with zero downtime, even during total general service cloud collapses.", auth: "Sophia Y.", position: "Architect Core API, Linear Labs" }
            ].map((test, index) => (
              <div key={index} className="bg-[#0C0C0E] border border-neutral-800 p-6 rounded shadow-xl flex flex-col justify-between">
                <p className="text-xs text-neutral-300 leading-relaxed font-sans font-medium">"{test.text}"</p>
                <div className="mt-6 border-t border-neutral-950 pt-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-850 flex items-center justify-center font-bold text-xs text-neutral-300 font-mono border border-neutral-800">
                    {test.auth.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none font-mono">{test.auth}</h4>
                    <p className="text-[10px] text-neutral-500 mt-1">{test.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Sectors */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 border-b border-neutral-900">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-2.5 py-1 bg-neutral-900 text-neutral-400 border border-neutral-800 rounded font-mono text-[9px] uppercase tracking-wider font-bold">
            Transparent Pricing Structure
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Cost-Optimizing Models out-of-the-box
          </h2>
          <p className="text-sm text-neutral-450 text-neutral-400">
            A secure infrastructure gateway pricing plan optimized to scale directly alongside developer compute curves.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-[#0C0C0E] border border-neutral-800 p-6 rounded flex flex-col justify-between shadow-xl">
            <div>
              <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-wider mb-2">DEVELOPER SANDBOX</p>
              <h3 className="text-2xl font-bold font-mono text-white leading-none">$0<span className="text-xs font-normal text-neutral-500 font-sans"> / perpetual free</span></h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-4">
                Test models routing, sandbox mock traces, edit failover rules, and execute up to 10k monthly prompt requests easily.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole("playground")}
              className="mt-8 w-full py-2 bg-[#18181B] hover:bg-neutral-800 text-white border border-neutral-800 text-xs font-mono font-bold tracking-widest rounded transition cursor-pointer select-none"
            >
              LAUNCH FREE SANDBOX
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0C0C0E] border border-neutral-600 p-6 rounded flex flex-col justify-between shadow-xl relative">
            <span className="absolute top-3 right-3 text-[9px] bg-white text-black px-2 py-0.5 rounded font-mono font-bold tracking-wider">POPULAR INGRESS</span>
            <div>
              <p className="text-[9px] font-mono text-cyan-400 uppercase font-bold tracking-wider mb-2">PRODUCTION INGRESS</p>
              <h3 className="text-2xl font-bold font-mono text-white leading-none">$49<span className="text-xs font-normal text-neutral-500 font-sans"> / month</span></h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-4">
                Real-time express infrastructure proxy. Up to 5M monthly computed requests, full multi-key governance, and integrated edge Redis cache endpoints.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole("playground")}
              className="mt-8 w-full py-2.5 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold tracking-widest rounded transition cursor-pointer select-none"
            >
              GET PRO INGRESS ROUTE
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0C0C0E] border border-neutral-800 p-6 rounded flex flex-col justify-between shadow-xl">
            <div>
              <p className="text-[9px] font-mono text-neutral-500 uppercase font-bold tracking-wider mb-2">CUSTOM DEEP EDGE</p>
              <h3 className="text-2xl font-bold font-mono text-white leading-none">ENTERPRISE</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-4">
                For organizations with highly specialized security requirements. Host RouteLM inside private Cloud Run / VPC networks, with customized SLAs and custom billing.
              </p>
            </div>
            <a
              href="mailto:muhd.arshadra@gmail.com"
              className="mt-8 w-full py-2 bg-[#18181B] hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs font-mono font-bold tracking-widest rounded transition text-center select-none"
            >
              CONTACT ENGINE DEPT
            </a>
          </div>

        </div>
      </section>

      {/* Developer FAQs */}
      <section id="faq" className="py-24 bg-black border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-center text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-4 font-bold">DEVELOPER SPEC FREQUENT QUESTIONS</p>
          <h2 className="text-center text-2xl sm:text-4xl font-bold tracking-tight text-white mb-12">
            Ask Us Anything. We Are Engineers.
          </h2>

          <div className="space-y-4">
            {[
              { q: "How much latency overhead does RouteLM introduce?", a: "Precisely 4.1 milliseconds. RouteLM was architected in highly parallel, zero-allocation network micro-frameworks designed to compile natively and execute with minimal context delays." },
              { q: "Are API request payloads stored on RouteLM's network?", a: "No. Your raw developer prompt payloads are streamed directly across secure channels to target provider endpoints. Only routing metadata, statistics, and tokens counts are optionally recorded inside your secure console trace log." },
              { q: "Can we use RouteLM using custom model configurations?", a: "Yes. Our failover policy dashboard supports binding any customized provider keys, allowing deep orchestration of private model nodes seamlessly." },
              { q: "How does the cache logic work?", a: "Duplicate prompts matching exact cryptographic SHA-256 signatures are fetched within 1ms directly from our cache-aside Redis nodes, avoiding LLM billing cost completely." }
            ].map((item, index) => (
              <div key={index} className="bg-[#0C0C0E] border border-neutral-850 rounded">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-5 flex justify-between items-center text-xs font-bold text-white font-mono uppercase tracking-wide cursor-pointer focus:outline-none select-none"
                >
                  <span>{item.q}</span>
                  <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0" />
                </button>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-neutral-850"
                    >
                      <p className="p-5 text-xs text-neutral-400 leading-relaxed font-sans font-medium">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <footer className="py-20 bg-black text-xs text-neutral-500 font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-neutral-900 pb-12">
            <div>
              <h3 className="text-sm font-bold text-white tracking-widest font-mono uppercase mb-2">LAUNCH PIPELINE TO ENGINE ACCURACY</h3>
              <p className="text-xs text-neutral-500 max-w-md font-sans font-medium">
                Optimize your infrastructure immediately. Set up API Gateways, customize failover thresholds, and audit prompt payloads.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole("playground")}
              className="bg-white hover:bg-neutral-250 text-black text-xs font-mono font-bold tracking-widest px-6 py-3 rounded transition shadow-xl cursor-pointer select-none"
            >
              LAUNCH FREE CONSOLE NOW
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-[10px] text-white uppercase tracking-wider font-bold">Gateway Core</span>
              <ul className="space-y-2 text-[11px] text-neutral-500 font-sans">
                <li><a href="#visualizer" className="hover:text-white transition">Dual-Plane Parser</a></li>
                <li><a href="#features" className="hover:text-white transition">Consolidation Logic</a></li>
                <li><a href="#failover" className="hover:text-white transition">Hot Standby Node</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] text-white uppercase tracking-wider font-bold">Compliance API</span>
              <ul className="space-y-2 text-[11px] text-neutral-500 font-sans">
                <li><a href="#integrations" className="hover:text-white transition">cURL Terminal</a></li>
                <li><a href="#integrations" className="hover:text-white transition">TypeScript / Go</a></li>
                <li><a href="#integrations" className="hover:text-white transition">Python Integrations</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] text-white uppercase tracking-wider font-bold font-mono">Operator Info</span>
              <ul className="space-y-2 text-[11px] text-neutral-500 font-sans">
                <li><a href="mailto:muhd.arshadra@gmail.com" className="hover:text-white transition">muhd.arshadra@gmail.com</a></li>
                <li><span className="hover:text-white transition select-all">Engineering Cluster #1</span></li>
                <li><span className="hover:text-white transition">Version 2.4.9</span></li>
              </ul>
            </div>
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-white uppercase tracking-wider font-bold">Operational Status</span>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">ALL GATEWAYS OPERATING STABLE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-neutral-600 pt-8 border-t border-neutral-900">
            <span>© {new Date().getFullYear()} RouteLM Inc. Engineered with Dual-Plane hexadecimal topology guidelines.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-neutral-400 transition">Terms of Ingress</a>
              <a href="#" className="hover:text-neutral-400 transition">Platform Privacy</a>
            </div>
          </div>

        </div>
      </footer>

      {/* Command Palette Overlay Modal (Cmd+K / Ctrl+K) */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0C0C0E] border border-neutral-800 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl shadow-cyan-950/20"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-850">
                <Search className="w-4.5 h-4.5 text-neutral-500" />
                <input
                  type="text"
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  placeholder="Type a command or jump straight to Console tab..."
                  className="bg-transparent text-xs text-white border-none outline-none w-full placeholder-neutral-650 font-mono"
                  autoFocus
                />
                <button
                  onClick={() => setIsCommandPaletteOpen(false)}
                  className="font-mono text-[10px] bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded cursor-pointer select-none"
                >
                  ESC
                </button>
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                {filteredCommands.map((cmd, i) => (
                  <button
                    key={i}
                    onClick={cmd.action}
                    className="w-full text-left p-3 rounded flex items-center justify-between text-xs font-mono hover:bg-neutral-900 transition-colors cursor-pointer group"
                  >
                    <div>
                      <p className="text-white font-bold group-hover:text-cyan-400 transition-colors uppercase">{cmd.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-1 font-sans">{cmd.sub}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-700 group-hover:text-white transition" />
                  </button>
                ))}
                {filteredCommands.length === 0 && (
                  <p className="text-center py-6 text-xs font-mono text-neutral-500 select-none">No cluster commands registered matching "{commandSearch}"</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
