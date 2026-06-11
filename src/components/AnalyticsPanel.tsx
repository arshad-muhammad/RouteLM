import React from "react";
import { SystemMetrics } from "../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";
import { Zap, Activity, ShieldAlert, Cpu } from "lucide-react";
import LatencyHeatmap from "./LatencyHeatmap";

interface AnalyticsPanelProps {
  metrics: SystemMetrics;
}

export default function AnalyticsPanel({ metrics }: AnalyticsPanelProps) {
  // Convert requestsByModel object to a nice Array for Recharts
  const modelData = Object.entries(metrics.requestsByModel || {}).map(([model, count]) => {
    let cleanName = model;
    if (model === "gemini-3.1-flash-lite") cleanName = "Flash Lite";
    if (model === "gemini-3.5-flash") cleanName = "Flash 3.5";
    if (model === "gemini-3.1-pro-preview") cleanName = "Pro 3.1";
    if (model === "gpt-4o") cleanName = "GPT-4o (V)";
    if (model === "claude-3-5-sonnet") cleanName = "Claude 3.5 (V)";

    return {
      name: cleanName,
      requests: count,
    };
  });

  const COLORS = ["#06b6d4", "#a855f7", "#3b82f6", "#10b981", "#f59e0b"];

  // Custom chart tooltips matching Stripe slate aesthetics
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg shadow-2xl">
          <p className="text-slate-400 text-xs mb-1 font-mono">{label}</p>
          <p className="text-cyan-400 font-medium font-mono text-sm">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Mini-grid of extra telemetry metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/10 text-cyan-400">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Core API Status</p>
            <p className="text-base font-semibold font-display text-emerald-400">99.98% Healthy</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-800/10 text-pink-400">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Gateway Active Load</p>
            <p className="text-base font-semibold font-display text-slate-200">12 ms route time</p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/10 text-purple-400">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Infrastructure Power</p>
            <p className="text-base font-semibold font-display text-slate-200">
              {metrics.totalTokensIn + metrics.totalTokensOut} Tokens
            </p>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/10 text-blue-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Failovers Intercepted</p>
            <p className="text-base font-semibold font-display text-amber-500">
              {metrics.failedRequests} failovers
            </p>
          </div>
        </div>
      </div>

      {/* Latency Heatmap Visualization using D3 */}
      <LatencyHeatmap />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Latency History */}
        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-200 text-sm mb-1">
              Gateway Realtime Latency Trend
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Reflects end-to-end processing speeds across RouteLM optimization cycles
            </p>
          </div>
          <div className="h-64 w-full">
            {metrics.latencyHistory && metrics.latencyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.latencyHistory}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="timestamp" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} unit="ms" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="latencyMs"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLatency)"
                    name="Latency"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                Pending telemetry data sync...
              </div>
            )}
          </div>
        </div>

        {/* Traffic Composition by Model */}
        <div className="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-200 text-sm mb-1">
              Provider Traffic Share Model
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Volume allocation automatically routed based on active strategies
            </p>
          </div>
          <div className="h-64 w-full">
            {modelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={modelData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                  <Tooltip cursor={{ fill: "rgba(30, 41, 59, 0.4)" }} />
                  <Bar dataKey="requests" fill="#a855f7" radius={[4, 4, 0, 0]} name="Requests Count">
                    {modelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                Deploy infrastructure keys to inspect model share
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
