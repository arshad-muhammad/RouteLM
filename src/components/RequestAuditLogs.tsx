import React, { useState } from "react";
import { RequestLogEntry, RoutingStrategy } from "../types";
import { Search, SlidersHorizontal, ArrowRight, Play, Info, Terminal, RefreshCw, X, Download, ChevronDown } from "lucide-react";

interface RequestAuditLogsProps {
  logs: RequestLogEntry[];
  onClearLogs: () => Promise<void>;
  onRefreshLogs: () => Promise<void>;
}

export default function RequestAuditLogs({ logs, onClearLogs, onRefreshLogs }: RequestAuditLogsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState<RoutingStrategy | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<RequestLogEntry["status"] | "ALL">("ALL");
  const [activeLogId, setActiveLogId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const exportToCSV = (exportAll: boolean) => {
    const listToExport = exportAll ? logs : filteredLogs;
    if (listToExport.length === 0) {
      alert("No logs available to export.");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "Status",
      "Strategy",
      "Routed Model ID",
      "Prompt",
      "Content/Response",
      "Latency (ms)",
      "Cost (USD)",
      "Tokens In",
      "Tokens Out",
      "Client IP",
      "Error Message"
    ];

    const escapeCsv = (val: any) => {
      if (val === undefined || val === null) return "";
      const s = String(val);
      if (/[",\r\n]/.test(s)) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csvRows = [
      headers.join(","),
      ...listToExport.map((row) => [
        escapeCsv(row.id),
        escapeCsv(row.timestamp),
        escapeCsv(row.status),
        escapeCsv(row.strategy),
        escapeCsv(row.routedModelId),
        escapeCsv(row.prompt),
        escapeCsv(row.content),
        row.latencyMs,
        row.costUsd,
        row.tokensIn,
        row.tokensOut,
        escapeCsv(row.clientIp),
        escapeCsv(row.errorMessage || "")
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `routelm_logs_${exportAll ? "all" : "filtered"}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (exportAll: boolean) => {
    const listToExport = exportAll ? logs : filteredLogs;
    if (listToExport.length === 0) {
      alert("No logs available to export.");
      return;
    }

    const jsonString = JSON.stringify(listToExport, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `routelm_logs_${exportAll ? "all" : "filtered"}_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to purge RouteLM's historic engineering logs?")) return;
    setIsClearing(true);
    try {
      await onClearLogs();
    } catch (e) {
      console.error(e);
    } finally {
      setIsClearing(false);
    }
  };

  // Filter logs logic
  const filteredLogs = logs.filter((l) => {
    const matchesSearch = l.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.routedModelId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStrategy = selectedStrategy === "ALL" || l.strategy === selectedStrategy;
    const matchesStatus = selectedStatus === "ALL" || l.status === selectedStatus;
    return matchesSearch && matchesStrategy && matchesStatus;
  });

  const activeLog = logs.find((l) => l.id === activeLogId);

  return (
    <div className="relative space-y-4">
      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0C0C0E] p-4 border border-[#27272A] rounded">
        <div className="flex flex-1 w-full md:w-auto items-center space-x-2 bg-[#18181B] px-3 py-1.5 rounded border border-[#27272A]">
          <Search className="h-4 w-4 text-[#71717A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search prompt payload, routed models..."
            className="bg-transparent text-xs w-full outline-none placeholder-[#52525B] text-white font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Strategy filter */}
          <select
            value={selectedStrategy}
            onChange={(e) => setSelectedStrategy(e.target.value as any)}
            className="bg-[#18181B] border border-[#27272A] text-[11px] font-mono rounded px-2.5 py-1.5 focus:outline-none text-white font-bold"
          >
            <option value="ALL">ALL STRATEGIES</option>
            <option value="BALANCED">BALANCED</option>
            <option value="SPEED">SPEED</option>
            <option value="COST">COST</option>
            <option value="INTELLIGENCE">INTELLIGENCE</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="bg-[#18181B] border border-[#27272A] text-[11px] font-mono rounded px-2.5 py-1.5 focus:outline-none text-white font-bold"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="success">SUCCESS</option>
            <option value="failover">FAILOVER</option>
            <option value="error">ERROR</option>
          </select>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-1 px-3 flex items-center space-x-1.5 bg-[#18181B] border border-[#27272A] hover:bg-zinc-800 rounded text-xs font-mono text-[#A1A1AA] transition select-none cursor-pointer font-bold"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>REFRESH</span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="p-1 px-3 flex items-center space-x-1.5 bg-[#18181B] border border-[#27272A] hover:bg-zinc-800 rounded text-xs font-mono text-[#A1A1AA] transition select-none cursor-pointer font-bold"
            >
              <Download className="h-3 w-3 text-cyan-400" />
              <span>EXPORT</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {isExportOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsExportOpen(false)} 
                />
                
                <div className="absolute right-0 mt-1.5 w-60 bg-[#0C0C0E] border border-[#27272A] rounded shadow-2xl z-50 py-2.5 font-mono text-[11px] divide-y divide-[#27272A]/40 text-left">
                  <div className="px-3.5 py-1.5">
                    <p className="text-[9px] text-[#71717A] uppercase font-bold tracking-wider mb-2">Visible Filtered ({filteredLogs.length})</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          exportToCSV(false);
                          setIsExportOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-white text-slate-300 transition flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>Export as CSV</span>
                        <span className="text-[9px] text-cyan-400 font-bold">.CSV</span>
                      </button>
                      <button
                        onClick={() => {
                          exportToJSON(false);
                          setIsExportOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-white text-slate-300 transition flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>Export as JSON</span>
                        <span className="text-[9px] text-amber-400 font-bold">.JSON</span>
                      </button>
                    </div>
                  </div>

                  <div className="px-3.5 py-2">
                    <p className="text-[9px] text-[#71717A] uppercase font-bold tracking-wider mb-2 mt-1">All Telemetry History ({logs.length})</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          exportToCSV(true);
                          setIsExportOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-white text-slate-300 transition flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>Export All as CSV</span>
                        <span className="text-[9px] text-cyan-400 font-bold">.CSV</span>
                      </button>
                      <button
                        onClick={() => {
                          exportToJSON(true);
                          setIsExportOpen(false);
                        }}
                        className="w-full text-left py-1 hover:text-white text-slate-300 transition flex items-center justify-between cursor-pointer select-none"
                      >
                        <span>Export All as JSON</span>
                        <span className="text-[9px] text-amber-400 font-bold">.JSON</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleClear}
            disabled={isClearing}
            className="p-1 px-3 bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 rounded text-xs font-mono text-red-400 transition select-none cursor-pointer"
          >
            PURGE LOGS
          </button>
        </div>
      </div>

      {/* Main logs list */}
      <div className="bg-[#0C0C0E] border border-[#27272A] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#27272A] text-[9px] font-mono text-[#71717A] uppercase font-bold">
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Strategy</th>
                <th className="py-2.5 px-4">Mapped Provider</th>
                <th className="py-2.5 px-4">Prompt Preview</th>
                <th className="py-2.5 px-4">Latency</th>
                <th className="py-2.5 px-4 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]/40 text-[11px] font-mono">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setActiveLogId(log.id)}
                  className="hover:bg-[#18181B]/40 cursor-pointer transition-colors group"
                >
                  <td className="py-2 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                        log.status === "success"
                          ? "bg-emerald-950/20 text-[#4ADE80] border-emerald-900/40"
                          : log.status === "failover"
                          ? "bg-amber-950/20 text-[#F59E0B] border-amber-900/40"
                          : "bg-[#7F1D1D]/20 text-[#F87171] border-[#B91C1C]/40"
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-[#71717A]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-white font-medium">{log.strategy}</span>
                  </td>
                  <td className="py-2 px-4 text-[#22D3EE] font-semibold">{log.routedModelId}</td>
                  <td className="py-2 px-4 font-sans text-slate-400 max-w-xs truncate group-hover:text-[#FAFAFA] transition">
                    {log.prompt}
                  </td>
                  <td className="py-2 px-4 text-[#C084FC]">{log.latencyMs} ms</td>
                  <td className="py-2 px-4 text-right text-[#A1A1AA] pr-4">
                    ${log.costUsd.toFixed(6)}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#71717A] text-xs font-sans">
                    No matching RouteLM request logs located in telemetry index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Overlay drawer */}
      {activeLog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-lg bg-[#0C0C0E] border-l border-[#27272A] h-full p-6 flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#27272A]">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono font-bold text-xs text-white uppercase tracking-wider">Log Details</span>
                </div>
                <button
                  onClick={() => setActiveLogId(null)}
                  className="p-1 hover:bg-[#18181B] rounded text-[#71717A] hover:text-white transition cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status and summary */}
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#18181B]/40 p-3 rounded border border-[#27272A]">
                    <p className="text-[9px] text-[#71717A] uppercase font-mono mb-1 font-bold">Request ID</p>
                    <p className="text-xs text-[#A1A1AA] font-mono truncate select-all">{activeLog.id}</p>
                  </div>
                  <div className="bg-[#18181B]/40 p-3 rounded border border-[#27272A]">
                    <p className="text-[9px] text-[#71717A] uppercase font-mono mb-1 font-bold">Strategy Profile</p>
                    <span className="text-xs text-cyan-400 font-mono font-bold">{activeLog.strategy}</span>
                  </div>
                </div>

                {/* Tokens detail */}
                <div className="bg-[#18181B]/40 p-4 border border-[#27272A] rounded space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider font-mono">Token Analytics Mapping</h4>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#a1a1aa]">Input Tokens Count</span>
                    <span className="text-white">{activeLog.tokensIn}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#a1a1aa]">Output Tokens Count</span>
                    <span className="text-white">{activeLog.tokensOut}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono border-t border-[#27272A] pt-2">
                    <span className="text-[#71717A]">Total Tokens</span>
                    <span className="text-cyan-400 font-semibold">{activeLog.tokensIn + activeLog.tokensOut}</span>
                  </div>
                </div>

                {/* Payloads */}
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#71717A] uppercase font-mono font-bold">Client Request Prompt</label>
                    <div className="bg-[#18181B] border border-[#27272A] rounded p-3 text-xs text-[#A1A1AA] leading-relaxed max-h-32 overflow-y-auto font-mono select-all">
                      {activeLog.prompt}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] text-[#71717A] uppercase font-mono font-bold">Routed Gateway Response</label>
                    <div className="bg-[#18181B] border border-[#27272A] rounded p-3 text-xs font-mono text-[#FAFAFA] leading-relaxed max-h-48 overflow-y-auto select-all">
                      {activeLog.content}
                    </div>
                  </div>

                  {activeLog.errorMessage && (
                    <div className="space-y-1">
                      <label className="text-[9px] text-red-500 uppercase font-mono font-bold">Gateway Exception Raw</label>
                      <div className="bg-red-950/25 border border-red-900/30 rounded p-3 text-xs font-mono text-red-400 select-all">
                        {activeLog.errorMessage}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="bg-[#18181B]/40 p-3 rounded border border-[#27272A]/80 text-[11px] font-mono text-slate-550 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">Origin Client IP:</span>
                    <span className="text-slate-350">{activeLog.clientIp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">UTC Execution Time:</span>
                    <span className="text-slate-350">{new Date(activeLog.timestamp).toISOString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveLogId(null)}
              className="mt-6 w-full py-2 bg-[#18181B] hover:bg-neutral-800 text-white font-medium text-xs font-mono uppercase rounded transition select-none cursor-pointer border border-[#27272A]"
            >
              Dismiss Log Inspector
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
