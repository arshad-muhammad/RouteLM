import React from "react";
import { BookOpen, Terminal, Sparkles, FileCode, Check, Shield } from "lucide-react";

export default function DeveloperDocs() {
  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <BookOpen className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <span>Developer Reference Specifications & Quickstarts</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Quickly implement reliable failover parameters with RouteLM standard integrations and HTTP schemas.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-neutral-900 border border-neutral-800 px-3 py-1 rounded text-neutral-400 font-semibold shrink-0">
          v2.4 LTS Reference
        </span>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Navigation / Content Map */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg space-y-4.5">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Docs Navigation Map</h3>
            </div>
            
            <ul className="space-y-2.5 font-mono text-[11px] text-neutral-450 text-neutral-400 font-medium">
              <li className="flex items-center gap-2 text-cyan-400 hover:underline cursor-pointer">
                <span>&rarr;</span> <span>Quickstart in 3 Lines of Code</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                <span>&rarr;</span> <span>Enforcing Failover Mechanics</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                <span>&rarr;</span> <span>Dynamic Pricing Balancing Policies</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                <span>&rarr;</span> <span>Header Verification Keys Vault</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer transition">
                <span>&rarr;</span> <span>Status Codes & Gateway Exceptions</span>
              </li>
            </ul>
          </div>

          <div className="bg-neutral-900/60 p-4 border border-neutral-850 rounded-md">
            <div className="flex gap-2">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-mono text-[10px] font-bold uppercase text-white">Production Service Level Agreements (SLA)</p>
                <p className="text-[10px] text-neutral-500 mt-1 leading-normal font-sans">
                  The central gateway utilizes hot replication topologies across triple redundancy availability zones to ensure 99.999% endpoint delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Manual Specifications */}
        <div className="lg:col-span-2 bg-[#0C0C0E] border border-neutral-800 p-6 rounded-lg space-y-5">
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-base text-white">Continuous Failover Implementation</h3>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              To guarantee that your applications achieve absolute uptime, RoutLM automatically audits error parameters for downstream requests. If a model cluster outputs a rate limit response (such as an HTTP status code 429), RouteLM reroutes your query.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-mono text-[10px] font-bold uppercase text-white tracking-wider">Failover Policy Schema Configuration</h4>
            <pre className="p-4 bg-[#09090B] border border-neutral-850 rounded text-neutral-300 font-mono text-[11px] leading-relaxed overflow-x-auto select-all">
{`{
  "policyId": "hot_replica_failover_rule",
  "triggerOnStatusCodes": [429, 500, 503],
  "latencyThresholdMs": 1500,
  "fallbacks": [
    "gemini-2.5-flash",
    "gemini-2.1-flash-lite"
  ],
  "maxRetryAttempts": 3
}`}
            </pre>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-sans font-bold text-sm text-white">Dynamic Pricing & Saving Parameters</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
              When using the <strong className="text-white font-mono font-medium">COST</strong> selection parameter, prompt semantic complexions are run through lightweight parsers. If a routine prompt is flagged with a low complexity criteria evaluation score, we proxy the request directly to Google Gemini's highly responsive flat free rate clusters.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-neutral-900 pt-4">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Automatic SDK Exception Deflection Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
