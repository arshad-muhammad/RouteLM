import React, { useState } from "react";
import { Terminal, Shield, FileText, Check, Copy, Code, Sparkles, Send } from "lucide-react";

export default function UnifiedApiGateway() {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "python">("curl");
  const [copied, setCopied] = useState(false);
  
  // Custom API sandbox tester state
  const [testEndpoint, setTestEndpoint] = useState("https://api.routelm.com/v1/route");
  const [testStrategy, setTestStrategy] = useState("BALANCED");
  const [testPrompt, setTestPrompt] = useState("Optimize search performance");
  const [responseLog, setResponseLog] = useState<string>("// Enter a test prompt and click send to test the API");
  const [isSimulating, setIsSimulating] = useState(false);

  const copyCode = () => {
    let text = "";
    if (activeTab === "curl") {
      text = `curl -X POST "https://api.routelm.com/v1/route" \\
  -H "Authorization: Bearer rlm_live_8f3dsa901k" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "${testPrompt}",
    "strategy": "${testStrategy}"
  }'`;
    } else if (activeTab === "node") {
      text = `import { RouteClient } from "@routelm/sdk";

const rlm = new RouteClient({ apiKey: "rlm_live_8f3dsa901k" });

const response = await rlm.route({
  prompt: "${testPrompt}",
  strategy: "${testStrategy}"
});`;
    } else {
      text = `from routelm import RouteLM

rlm = RouteLM(api_key="rlm_live_8f3dsa901k")

response = rlm.route(
    prompt="${testPrompt}",
    strategy="${testStrategy}"
)`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setResponseLog("// Checking prompt syntax...\n// Finding best backup model connection...");
    setTimeout(() => {
      const isFailed = Math.random() > 0.95; // very rare
      const latency = Math.floor(Math.random() * 120) + 70;
      const tokensIn = Math.floor(testPrompt.length / 4) + 5;
      const tokensOut = Math.floor(Math.random() * 40) + 10;
      
      const payloadResp = {
        routedModelId: testStrategy === "COST" ? "gemini-3.1-flash-lite" : "gemini-3.5-flash",
        success: !isFailed,
        latencyMs: latency,
        tokensIn: tokensIn,
        tokensOut: tokensOut,
        content: `Successful response for prompt: "${testPrompt}" using '${testStrategy}' settings. RouteLM successfully routed this request to a backup server.`,
        costSavedUsd: testStrategy === "COST" ? 0.0084 : 0.0032
      };

      setResponseLog(JSON.stringify(payloadResp, null, 2));
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <Terminal className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <span>Unified RouteLM API Gateway</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Create, test, and use a single API key to connect multiple models. Keep your apps running even when providers fail.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-cyan-950/20 border border-cyan-900 px-3 py-1 rounded text-cyan-400 font-semibold shrink-0">
          Endpoint Status: Active
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Interactive JSON payload tester and params */}
        <div className="lg:col-span-5 bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Test Request Parameters</h3>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Gateway Target URL</label>
              <input
                type="text"
                value={testEndpoint}
                readOnly
                className="w-full bg-[#18181B] text-slate-400 border border-neutral-800 rounded p-2 text-xs font-mono outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Routing Preference</label>
              <select
                value={testStrategy}
                onChange={(e) => setTestStrategy(e.target.value)}
                className="w-full bg-[#18181B] text-white border border-neutral-800 rounded p-2 text-xs font-mono outline-none"
              >
                <option value="BALANCED">BALANCED</option>
                <option value="SPEED">SPEED</option>
                <option value="COST">COST</option>
                <option value="INTELLIGENCE">INTELLIGENCE</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Prompt Text</label>
              <textarea
                value={testPrompt}
                onChange={(e) => setTestPrompt(e.target.value)}
                className="w-full bg-[#18181B] text-white border border-neutral-800 rounded p-2 text-xs font-mono outline-none h-16 resize-none"
                placeholder="Enter prompt text here..."
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating || !testPrompt.trim()}
              className="w-full py-2 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold tracking-wider rounded transition flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSimulating ? "SENDING TEST REQUEST..." : "SEND TEST REQUEST"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic SDK cURL code blocks */}
        <div className="lg:col-span-7 space-y-4 flex flex-col h-full">
          <div className="bg-[#0C0C0E] border border-neutral-800 rounded-lg overflow-hidden flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center justify-between px-4 py-3 bg-[#09090B] border-b border-neutral-850">
              <div className="flex gap-2">
                {[
                  { id: "curl", label: "cURL" },
                  { id: "node", label: "NODE" },
                  { id: "python", label: "PYTHON" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded border transition select-none cursor-pointer ${
                      activeTab === t.id 
                        ? "bg-white text-black border-white" 
                        : "bg-transparent text-neutral-500 border-transparent hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              
              <button
                onClick={copyCode}
                className="px-2.5 py-1 text-[10px] font-mono font-bold border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white rounded flex items-center gap-1 cursor-pointer select-none"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "COPIED" : "COPY CODE"}</span>
              </button>
            </div>

            <div className="p-4 bg-black/40 font-mono text-xs text-cyan-400 overflow-x-auto select-all leading-relaxed flex-1">
              {activeTab === "curl" && (
                <pre>
{`curl -X POST "https://api.routelm.com/v1/route" \\
  -H "Authorization: Bearer rlm_live_8f3dsa901k" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "${testPrompt}",
    "strategy": "${testStrategy}"
  }'`}
                </pre>
              )}

              {activeTab === "node" && (
                <pre className="text-white">
                  <span className="text-emerald-400">import</span> {`{ RouteClient }`} <span className="text-emerald-400">from</span> <span className="text-neutral-500">"@routelm/sdk"</span>;<br /><br />
                  <span className="text-emerald-400">const</span> rlm = <span className="text-cyan-400">new</span> RouteClient({`{ apiKey: "rlm_live_8f3dsa901k" }`});<br /><br />
                  <span className="text-emerald-400">const</span> response = <span className="text-cyan-400">await</span> rlm.route({`{
  prompt: "${testPrompt}",
  strategy: "${testStrategy}"
}`});
                </pre>
              )}

              {activeTab === "python" && (
                <pre className="text-neutral-300">
                  <span className="text-emerald-400">from</span> routelm <span className="text-emerald-400">import</span> RouteLM<br /><br />
                  rlm = RouteLM(api_key=<span className="text-neutral-500">"rlm_live_8f3dsa901k"</span>)<br /><br />
                  response = rlm.route(<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;prompt=<span className="text-neutral-500">"${testPrompt}"</span>,<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;strategy=<span className="text-neutral-500">"${testStrategy}"</span><br />
                  )
                </pre>
              )}
            </div>
          </div>

          {/* SIMULATED GATEWAY RESPONSE STREAM */}
          <div className="bg-[#0C0C0E] border border-neutral-800 p-4 rounded-lg">
            <p className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
              <span>SIMULATED API GATEWAY RESPONSE</span>
            </p>
            <pre className="p-3 bg-[#09090B] border border-neutral-850 rounded text-[11px] font-mono text-emerald-400 max-h-[140px] overflow-y-auto leading-relaxed select-text">
              {responseLog}
            </pre>
          </div>
        </div>

      </div>
    </div>
  );
}
