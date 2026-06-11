import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  Globe, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Shuffle, 
  HelpCircle,
  Clock
} from "lucide-react";

// Types for the heatmap data
interface HeatmapCell {
  region: string;
  hour: number; // 0 - 23
  avgLatencyMs: number;
  requestsCount: number;
  failureRate: number; // percentage (0 - 100)
}

const REGIONS = [
  "us-east-1 (N. Virginia)",
  "us-west-2 (Oregon)",
  "eu-west-1 (Ireland)",
  "ap-southeast-1 (Singapore)",
  "sa-east-1 (São Paulo)"
];

export default function LatencyHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Interactive states
  const [metricType, setMetricType] = useState<"latency" | "requests" | "failures">("latency");
  const [hasSpike, setHasSpike] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 280 });
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);

  // Generate initial heatmap telemetry dataset
  useEffect(() => {
    const data: HeatmapCell[] = [];
    REGIONS.forEach((region) => {
      for (let hour = 0; hour < 24; hour++) {
        // Base latency differs by region distance
        let baseLatency = 130; // default US East
        if (region.includes("Oregon")) baseLatency = 160;
        if (region.includes("Ireland")) baseLatency = 240;
        if (region.includes("Singapore")) baseLatency = 420;
        if (region.includes("São Paulo")) baseLatency = 380;

        // Base traffic volume
        let baseRequests = 450;
        
        // Traffic peak hour factors: 
        // Peak hours in business time (e.g. 10:00 - 17:00 local, around hours 14 - 21 UTC)
        const peakFactor = hour >= 14 && hour <= 21 ? 1.8 : hour >= 20 || hour <= 3 ? 1.4 : 0.8;
        
        // Latency peak during traffic spikes
        const latencyPeak = hour >= 15 && hour <= 18 ? 1.35 : 1.0;

        // Add some random/natural volatility
        const randomFactor = 0.95 + Math.random() * 0.15;
        
        const calculatedLatency = Math.round(baseLatency * peakFactor * latencyPeak * randomFactor);
        const calculatedRequests = Math.round(baseRequests * peakFactor * randomFactor);
        
        // Failures / error spikes
        let errorRate = 0.2; // default 0.2% basic network timeouts
        if (hour === 16 || hour === 17) {
          errorRate = region.includes("Singapore") ? 2.4 : region.includes("São Paulo") ? 1.8 : 0.4;
        }

        data.push({
          region,
          hour,
          avgLatencyMs: calculatedLatency,
          requestsCount: calculatedRequests,
          failureRate: parseFloat(errorRate.toFixed(1))
        });
      }
    });

    setHeatmapData(data);
  }, []);

  // Set up ResizeObserver to make the SVG perfectly responsive
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Clamp responsive width to minimum 450px and maximum 1200px
      const cleanWidth = Math.max(450, width);
      setDimensions({
        width: cleanWidth,
        height: 280
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Handle high-load/regional network spike simulation toggle
  const handleToggleSpike = () => {
    setHasSpike((prev) => {
      const nextSpike = !prev;
      setHeatmapData((currentData) => {
        return currentData.map((cell) => {
          // If we introduce a spike, let's congest Singapore (ap-southeast-1) and São Paulo around hours 15-20
          if (nextSpike && (cell.region.includes("Singapore") || cell.region.includes("São Paulo")) && cell.hour >= 14 && cell.hour <= 20) {
            return {
              ...cell,
              avgLatencyMs: Math.round(cell.avgLatencyMs * 2.3),
              requestsCount: Math.round(cell.requestsCount * 1.6),
              failureRate: parseFloat((cell.failureRate + 6.8).toFixed(1))
            };
          } else if (!nextSpike && (cell.region.includes("Singapore") || cell.region.includes("São Paulo")) && cell.hour >= 14 && cell.hour <= 20) {
            // Restore back to original
            const baseFactor = cell.hour >= 14 && cell.hour <= 21 ? 1.8 : 0.8;
            let originalBase = cell.region.includes("Singapore") ? 420 : 380;
            return {
              ...cell,
              avgLatencyMs: Math.round(originalBase * baseFactor * (cell.hour >= 15 && cell.hour <= 18 ? 1.35 : 1.0) * (0.95 + Math.random() * 0.15)),
              requestsCount: Math.round(450 * baseFactor * (0.95 + Math.random() * 0.15)),
              failureRate: cell.hour === 16 || cell.hour === 17 ? (cell.region.includes("Singapore") ? 2.4 : 1.8) : 0.2
            };
          }
          return cell;
        });
      });
      return nextSpike;
    });
  };

  // Re-render D3 Heatmap on data, dimension, or metric type change
  useEffect(() => {
    if (!svgRef.current || heatmapData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean sweep before redraw to avoid duplicate elements

    const { width, height } = dimensions;
    const margin = { top: 25, right: 15, bottom: 40, left: 165 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create container group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Hours labels: 0H to 23H
    const hours = Array.from({ length: 24 }, (_, i) => i);

    // Scales
    const xScale = d3.scaleBand()
      .domain(hours.map(String))
      .range([0, chartWidth])
      .padding(0.08);

    const yScale = d3.scaleBand()
      .domain(REGIONS)
      .range([0, chartHeight])
      .padding(0.12);

    // Color Scales depending on active metric type
    let colorScale: d3.ScaleLinear<string, string>;

    if (metricType === "latency") {
      // Latency scale: Cool slate/cyan to amber and critical warning rose
      colorScale = d3.scaleLinear<string>()
        .domain([100, 250, 450, 800])
        .range(["#1e293b", "#06b6d4", "#f59e0b", "#ef4444"])
        .interpolate(d3.interpolateRgb) as d3.ScaleLinear<string, string>;
    } else if (metricType === "requests") {
      // Traffic Volume scale: Slate to vibrant violet/purple
      colorScale = d3.scaleLinear<string>()
        .domain([200, 500, 900])
        .range(["#1e293b", "#a855f7", "#ec4899"])
        .interpolate(d3.interpolateRgb) as d3.ScaleLinear<string, string>;
    } else {
      // Failure Rate scale: Slate to red alert crimson
      colorScale = d3.scaleLinear<string>()
        .domain([0, 1, 3, 7])
        .range(["#1e293b", "#22c55e", "#f59e0b", "#ef4444"])
        .interpolate(d3.interpolateRgb) as d3.ScaleLinear<string, string>;
    }

    // DRAW AXIS X
    const xAxis = d3.axisBottom(xScale)
      .tickSize(0)
      .tickFormat((d) => {
        const hourNum = parseInt(d);
        if (hourNum === 0) return "12 AM";
        if (hourNum === 12) return "12 PM";
        // To avoid label clustering, only display every 3 hours on small cards
        if (width < 600) {
          return hourNum % 6 === 0 ? `${hourNum}:00` : "";
        }
        return hourNum % 3 === 0 ? `${hourNum}:00` : "";
      });

    const gX = g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(xAxis);

    gX.select(".domain").remove(); // Hide basic stroke axis line
    gX.selectAll("text")
      .attr("font-family", "JetBrains Mono, ui-monospace, sans-serif")
      .attr("font-size", "9px")
      .attr("fill", "#71717A")
      .attr("dy", "12px");

    // DRAW AXIS Y
    const yAxis = d3.axisLeft(yScale)
      .tickSize(0);

    const gY = g.append("g")
      .call(yAxis);

    gY.select(".domain").remove(); // Clean vertical line
    gY.selectAll("text")
      .attr("font-family", "ui-sans-serif, system-ui, sans-serif")
      .attr("font-size", "10px")
      .attr("font-weight", 500)
      .attr("fill", "#E4E4E7")
      .attr("dx", "-8px");

    // DRAW CELLS
    g.selectAll(".cell")
      .data(heatmapData)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d: any) => xScale(String(d.hour)) || 0)
      .attr("y", (d: any) => yScale(d.region) || 0)
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("rx", 3) // rounded cells
      .attr("ry", 3)
      .attr("cursor", "pointer")
      .attr("stroke", "rgba(9, 9, 11, 0.5)")
      .attr("stroke-width", 1)
      .style("fill", (d: any) => {
        const val = metricType === "latency" ? d.avgLatencyMs 
                  : metricType === "requests" ? d.requestsCount 
                  : d.failureRate;
        return colorScale(val);
      })
      .style("transition", "fill 0.2s ease")
      // Interactivity
      .on("mouseover", function (event, d: any) {
        d3.select(this)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 1.5)
          .raise(); // Pull hovered rect to the front in vector layout
        setHoveredCell(d);
      })
      .on("mousemove", function (event) {
        // Handled floating placement in relative coordinates
      })
      .on("mouseleave", function (event, d: any) {
        const isSelected = selectedCell && selectedCell.region === d.region && selectedCell.hour === d.hour;
        d3.select(this)
          .attr("stroke", isSelected ? "#06b6d4" : "rgba(9, 9, 11, 0.5)")
          .attr("stroke-width", isSelected ? 2 : 1);
        setHoveredCell(null);
      })
      .on("click", function (event, d: any) {
        // Clear previous selected highlight strokes manually in D3
        g.selectAll(".cell")
          .attr("stroke", "rgba(9, 9, 11, 0.5)")
          .attr("stroke-width", 1);
          
        d3.select(this)
          .attr("stroke", "#06b6d4")
          .attr("stroke-width", 2)
          .raise();

        setSelectedCell(d);
      });

    // Apply active borders if a cell is currently selected in React state
    if (selectedCell) {
      g.selectAll(".cell")
        .filter((d: any) => d.region === selectedCell.region && d.hour === selectedCell.hour)
        .attr("stroke", "#06b6d4")
        .attr("stroke-width", 2)
        .raise();
    }

  }, [heatmapData, dimensions, metricType, selectedCell]);

  // Utility to determine cell condition color
  const getCellStatus = (cell: HeatmapCell) => {
    if (cell.failureRate > 3 || cell.avgLatencyMs > 600) {
      return {
        label: "Critical Bottleneck",
        color: "text-rose-400 bg-rose-950/30 border-rose-800/40",
        message: "Severe delay or packet drops detected. Failover policies will actively detour traffic to high-capacity Standby Nodes."
      };
    }
    if (cell.avgLatencyMs > 320 || cell.failureRate > 1.2) {
      return {
        label: "Moderate Congestion",
        color: "text-amber-400 bg-amber-950/30 border-amber-800/40",
        message: "Minor load queue buildup. Routing engine weights speed parameters to bypass this region if cheaper paths exist."
      };
    }
    return {
      label: "Optimal Core Delivery",
      color: "text-emerald-400 bg-emerald-950/30 border-emerald-800/40",
      message: "Gateway operating within healthy parameters. Adaptive routing will utilize standard speeds to minimize provider costs."
    };
  };

  return (
    <div id="latency-heatmap-container" className="bg-slate-950 border border-slate-900 rounded-2xl p-5 space-y-4">
      
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-900/60">
        <div>
          <h3 className="font-display font-semibold text-slate-200 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Region Gateway Latency Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime distribution metrics across Edge routing topologies. Click any cell to diagnose connection.
          </p>
        </div>

        {/* Metric Selector Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMetricType("latency")}
            className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded border transition cursor-pointer select-none ${
              metricType === "latency"
                ? "bg-cyan-950/40 border-cyan-700 text-cyan-400"
                : "bg-[#0C0C0E] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Latency (ms)
          </button>
          <button
            type="button"
            onClick={() => setMetricType("requests")}
            className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded border transition cursor-pointer select-none ${
              metricType === "requests"
                ? "bg-purple-950/40 border-purple-700 text-purple-400"
                : "bg-[#0C0C0E] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Volume (Reqs)
          </button>
          <button
            type="button"
            onClick={() => setMetricType("failures")}
            className={`px-2.5 py-1 text-[10px] uppercase font-mono font-bold tracking-wider rounded border transition cursor-pointer select-none ${
              metricType === "failures"
                ? "bg-rose-950/40 border-rose-700 text-rose-400"
                : "bg-[#0C0C0E] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            Errors (%)
          </button>
        </div>
      </div>

      {/* Main Heatmap Render Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Heatmap Column */}
        <div className="lg:col-span-8 flex flex-col justify-between" ref={containerRef}>
          <div className="overflow-x-auto overflow-y-hidden pb-1 scrollbar-thin">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="mx-auto block select-none"
            />
          </div>

          {/* Color scale visual guide / legend */}
          <div className="flex items-center justify-between px-3 text-[10px] font-mono mt-1 text-slate-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Hour of day (UTC times)</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span>Low Burden</span>
              <div className="flex items-center h-2.5 w-24 rounded overflow-hidden">
                {metricType === "latency" ? (
                  <>
                    <div className="h-full w-1/4 bg-[#1e293b]" />
                    <div className="h-full w-1/4 bg-[#06b6d4]" />
                    <div className="h-full w-1/4 bg-[#f59e0b]" />
                    <div className="h-full w-1/4 bg-[#ef4444]" />
                  </>
                ) : metricType === "requests" ? (
                  <>
                    <div className="h-full w-1/3 bg-[#1e293b]" />
                    <div className="h-full w-1/3 bg-[#a855f7]" />
                    <div className="h-full w-1/3 bg-[#ec4899]" />
                  </>
                ) : (
                  <>
                    <div className="h-full w-1/3 bg-[#1e293b]" />
                    <div className="h-full w-1/3 bg-[#22c55e]" />
                    <div className="h-full w-1/3 bg-[#f59e0b]" />
                    <div className="h-full w-1/3 bg-[#ef4444]" />
                  </>
                )}
              </div>
              <span>Severe Peak</span>
            </div>
          </div>
        </div>

        {/* Actionable Diagnostics Console Column */}
        <div className="lg:col-span-4 bg-[#09090B] border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-850 px-2 py-0.5 rounded text-slate-400 font-bold tracking-wider">
                Telemetry Diagnostician
              </span>
              <button
                type="button"
                onClick={handleToggleSpike}
                className={`px-2 py-1 text-[9px] font-mono uppercase font-bold tracking-wider rounded border flex items-center gap-1.5 select-none transition cursor-pointer ${
                  hasSpike 
                    ? "bg-rose-950/40 border-rose-800 text-rose-400 hover:bg-rose-900/30" 
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <Shuffle className={`w-2.5 h-2.5 ${hasSpike ? "animate-pulse" : ""}`} />
                <span>{hasSpike ? "RECOVER NETWORK" : "SIMULATE SPIKE"}</span>
              </button>
            </div>

            {/* Selected or Hovered Cell Status Detail */}
            {(() => {
              const activeCell = hoveredCell || selectedCell;
              if (!activeCell) {
                return (
                  <div className="py-10 text-center space-y-2 border border-dashed border-slate-900 rounded-xl">
                    <HelpCircle className="w-8 h-8 text-slate-700 mx-auto" />
                    <p className="text-xs text-slate-400 font-sans px-2">No gateway checkpoint selected</p>
                    <p className="text-[10px] text-slate-600 font-mono px-4 leading-normal">
                      Hover over any node cell or click directly to inspect live packet route metrics.
                    </p>
                  </div>
                );
              }

              const status = getCellStatus(activeCell);

              return (
                <div className="space-y-3.5 animate-fadeIn">
                  
                  {/* Gateway Metadata Row */}
                  <div className="border border-slate-900 bg-slate-950/80 p-3 rounded-lg space-y-1.5">
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Gateway Node</p>
                    <p className="text-xs font-bold text-white font-sans">{activeCell.region}</p>
                    <div className="flex items-center gap-4 text-[10px] font-mono pt-1 text-slate-500">
                      <span>Time: <strong className="text-slate-300">{activeCell.hour}:00 UTC</strong></span>
                    </div>
                  </div>

                  {/* Condition badge */}
                  <div className={`p-2.5 rounded-lg border text-[11px] flex gap-2 items-start ${status.color}`}>
                    {activeCell.failureRate > 1.5 ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold uppercase tracking-wider text-[10px]">{status.label}</p>
                      <p className="text-[10px] leading-relaxed mt-0.5 opacity-90 font-sans">{status.message}</p>
                    </div>
                  </div>

                  {/* Core Metrics comparison columns */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 border border-slate-900 bg-slate-950/40 rounded text-center">
                      <p className="text-[9px] font-mono text-slate-500 uppercase">Avg Speed</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{activeCell.avgLatencyMs}ms</p>
                    </div>
                    <div className="p-2 border border-slate-900 bg-slate-950/40 rounded text-center">
                      <p className="text-[9px] font-mono text-slate-500 uppercase">Volume</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{activeCell.requestsCount}</p>
                    </div>
                    <div className="p-2 border border-slate-900 bg-slate-950/40 rounded text-center">
                      <p className="text-[9px] font-mono text-slate-500 uppercase">Packet Loss</p>
                      <p className="text-xs font-bold text-slate-200 mt-0.5 font-mono">{activeCell.failureRate}%</p>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

          <div className="pt-3.5 border-t border-slate-900/60 flex items-center gap-2.5 text-[10px] text-slate-500 leading-normal font-sans">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              RouteLM gateway automatically triggers localized detours if latency breaches the <strong>Failover Threshold Rule</strong>.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
