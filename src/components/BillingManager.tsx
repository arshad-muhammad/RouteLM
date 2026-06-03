import React, { useState } from "react";
import { DollarSign, ShieldCheck, ArrowUpRight, TrendingDown, ClipboardList, Check, Plus } from "lucide-react";

export default function BillingManager() {
  const [credits, setCredits] = useState(42.50);
  const [maxCredits] = useState(100.00);
  const [addSuccess, setAddSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(25);

  const handleAddDemoFunds = () => {
    setCredits(prev => Math.min(prev + selectedAmount, maxCredits));
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <DollarSign className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <span>Billing & Infrastructure Cost Ledger</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Reconcile micro-credits savings across all downstream stand-by. Fund developer tokens securely.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-purple-950/20 border border-purple-900 px-3 py-1 rounded text-purple-400 font-semibold shrink-0">
          Tier: Enterprise Sandbox
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost stats tracker */}
        <div className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
              <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
              <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Dynamic Cost Saved</h3>
            </div>
            
            <p className="text-[11px] text-neutral-450 leading-relaxed text-neutral-400">
              Downstream model federation dynamically filters simple prompts to free, low-latency nodes, bypassing expensive premium models except during High IQ analytic modes.
            </p>

            <div className="pt-2">
              <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase tracking-wider block">Total Pipeline Savings</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">$441.28 saved</p>
              <p className="text-[10px] text-neutral-500 font-sans mt-1">~82.3% cheaper than standard direct premium triggers</p>
            </div>
          </div>

          <div className="mt-8 bg-neutral-900/60 p-3.5 border border-neutral-850 rounded text-[10px] text-neutral-400 leading-normal font-sans font-medium">
            💡 Standard cURL route processing is included in free limits. Downstream API keys enforce individual provider limits directly without route surcharges!
          </div>
        </div>

        {/* Dynamic credit balance simulator */}
        <div className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
              <DollarSign className="w-4 h-4 text-cyan-400 shrink-0" />
              <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Sandbox Credits Balance</h3>
            </div>

            <p className="text-[11px] text-neutral-400">
              Pre-funded sandbox micro-credits allow fallback caching tests when personal API keys are omitted.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[11px] font-mono font-bold text-white">
                <span>Micro-Credits Remaining</span>
                <span>${credits.toFixed(2)} / ${maxCredits.toFixed(2)}</span>
              </div>
              <div className="w-full bg-[#18181B] border border-neutral-800 h-2.5 rounded overflow-hidden">
                <div className="bg-cyan-450 h-full bg-cyan-400 transition-all duration-500" style={{ width: `${(credits / maxCredits) * 100}%` }} />
              </div>
            </div>

            {/* Simulated deposit fund handler */}
            <div className="pt-4 space-y-2.5">
              <span className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Fund Test Micro-credits</span>
              <div className="flex gap-2">
                {[10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setSelectedAmount(amt)}
                    className={`flex-1 py-1 text-xs font-mono rounded border transition-all select-none cursor-pointer ${
                      selectedAmount === amt 
                        ? "bg-white text-black border-white font-bold" 
                        : "bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-750"
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddDemoFunds}
                className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white text-[11px] font-mono font-bold rounded transition flex items-center justify-center gap-1.5 select-none cursor-pointer"
              >
                {addSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                )}
                <span>{addSuccess ? "FUNDS DEPOSITED SUCCESSFULLY" : "ADD SANDBOX CREDITS"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Audit Invoice ledger history */}
        <div className="bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg">
          <div className="flex items-center gap-2 pb-3 border-b border-neutral-850 mb-3">
            <ClipboardList className="w-4 h-4 text-purple-400 shrink-0" />
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Invoice Settlement History</h3>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {[
              { id: "INV-0881", date: "June 01, 2026", cost: "$12.40", status: "Settle Paid" },
              { id: "INV-0834", date: "May 01, 2026", cost: "$18.52", status: "Settle Paid" },
              { id: "INV-0792", date: "Apr 01, 2026", cost: "$8.10", status: "Settle Paid" },
              { id: "INV-0711", date: "Mar 01, 2026", cost: "$4.15", status: "Settle Paid" }
            ].map((inv) => (
              <div key={inv.id} className="flex justify-between items-center text-[10px] font-mono bg-neutral-900/40 border border-neutral-850 p-2.5 rounded hover:bg-neutral-900 transition mb-1 flex-wrap gap-1.5">
                <div className="flex flex-col">
                  <span className="text-white font-bold">{inv.id}</span>
                  <span className="text-neutral-500 mt-0.5 text-[9px]">{inv.date}</span>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-white font-bold">{inv.cost}</span>
                  <span className="text-emerald-400 font-semibold text-[9px] uppercase tracking-wider">{inv.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
