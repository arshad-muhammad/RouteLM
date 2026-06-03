import React, { useState } from "react";
import { FailoverRule } from "../types";
import { ShieldCheck, ShieldAlert, WifiOff, RefreshCcw, Save, CheckCircle } from "lucide-react";

interface FailoverPoliciesProps {
  rules: FailoverRule[];
  onUpdateRule: (updated: FailoverRule) => Promise<void>;
}

export default function FailoverPolicies({ rules, onUpdateRule }: FailoverPoliciesProps) {
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [editedRule, setEditedRule] = useState<FailoverRule | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleStartEdit = (rule: FailoverRule) => {
    setEditingRuleId(rule.id);
    setEditedRule({ ...rule });
  };

  const handleFieldChange = (key: keyof FailoverRule, value: any) => {
    if (!editedRule) return;
    setEditedRule({
      ...editedRule,
      [key]: value,
    });
  };

  const handleToggleEnable = async (rule: FailoverRule) => {
    try {
      const updated = { ...rule, isEnabled: !rule.isEnabled };
      await onUpdateRule(updated);
      showSuccessFeedback(`Policy for ${rule.primaryModel} updated.`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedRule) return;
    setIsSaving(true);
    try {
      await onUpdateRule(editedRule);
      setEditingRuleId(null);
      setEditedRule(null);
      showSuccessFeedback("Failover threshold policy saved successfully.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const showSuccessFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white text-sm uppercase tracking-wider font-mono">
            Failover & Resilient Retries Policies
          </h2>
          <p className="text-[11px] text-[#71717A] font-mono mt-1">
            Define secondary paths when external AI providers fail or experience high latency
          </p>
        </div>
        {successMsg && (
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-900/40 text-[#4ADE80] px-3 py-1.5 rounded text-[11px] font-mono font-medium animate-fade-in uppercase">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((rule) => {
          const isEditing = editingRuleId === rule.id;
          const activeItem = isEditing ? editedRule : rule;

          if (!activeItem) return null;

          return (
            <div
              key={rule.id}
              className={`bg-[#0C0C0E] border rounded p-5 transition-all ${
                rule.isEnabled ? "border-[#27272A]" : "border-[#27272A]/40 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded ${
                      rule.isEnabled ? "bg-cyan-950/20 text-cyan-400 border border-cyan-900/25" : "bg-[#18181B] text-[#71717A] border border-zinc-800"
                    }`}
                  >
                    {rule.isEnabled ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="text-[9px] font-mono text-[#71717A] uppercase tracking-wider font-bold">Provider Route</h4>
                    <p className="text-xs font-bold text-[#FAFAFA] font-mono mt-0.5">
                      {rule.primaryModel}
                    </p>
                  </div>
                </div>

                {/* Enable toggle switch */}
                <button
                  onClick={() => handleToggleEnable(rule)}
                  className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.isEnabled ? "bg-white" : "bg-neutral-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-black shadow transition duration-200 ease-in-out ${
                      rule.isEnabled ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Policy Criteria */}
              <div className="space-y-4 border-t border-[#27272A]/40 pt-4">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#a1a1aa] flex items-center space-x-1.5">
                    <WifiOff className="h-3.5 w-3.5" />
                    <span>Trigger on Network Failure</span>
                  </span>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={activeItem.triggerOnError}
                      onChange={(e) => handleFieldChange("triggerOnError", e.target.checked)}
                      className="rounded border-[#27272A] text-white focus:ring-0 bg-[#18181B] accent-white"
                    />
                  ) : (
                    <span className="text-white font-bold">
                      {rule.triggerOnError ? "Yes" : "No"}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#a1a1aa] flex items-center space-x-1.5">
                      <RefreshCcw className="h-3.5 w-3.5" />
                      <span>Fallback Retry Limit</span>
                    </span>
                    <span className="text-white font-bold">{activeItem.retryCount} times</span>
                  </div>
                  {isEditing && (
                    <input
                      type="range"
                      min="1"
                      max="3"
                      value={activeItem.retryCount}
                      onChange={(e) => handleFieldChange("retryCount", parseInt(e.target.value))}
                      className="w-full accent-white bg-[#27272A] h-1 rounded outline-none pt-1"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#a1a1aa]">Latency Timeout Threshold</span>
                    <span className="text-white font-bold">
                      {activeItem.triggerOnLatencyMs} ms
                    </span>
                  </div>
                  {isEditing ? (
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={activeItem.triggerOnLatencyMs}
                      onChange={(e) => handleFieldChange("triggerOnLatencyMs", parseInt(e.target.value))}
                      className="w-full accent-white bg-[#27272A] h-1 rounded outline-none pt-1"
                    />
                  ) : (
                    <div className="w-full bg-[#18181B] h-1 rounded overflow-hidden">
                      <div
                        className="bg-white h-full"
                        style={{ width: `${Math.min(100, (rule.triggerOnLatencyMs / 4000) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[#71717A] pt-3.5 border-t border-[#27272A]/40">
                  <span>Destination:</span>
                  <span className="text-white font-semibold bg-[#18181B] px-2 py-0.5 rounded border border-[#27272A]">
                    {rule.fallbackModel}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingRuleId(null)}
                        className="px-2.5 py-1 text-[10px] font-mono uppercase bg-transparent border border-[#27272A] hover:bg-[#18181B] text-slate-400 rounded transition cursor-pointer select-none"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="flex items-center space-x-1.5 px-3 py-1 text-[10px] font-mono bg-white hover:bg-neutral-200 text-black font-bold rounded transition cursor-pointer select-none"
                      >
                        <Save className="h-3 w-3" />
                        <span>{isSaving ? "SAVING..." : "SAVE POLICY"}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(rule)}
                      className="px-2.5 py-1 text-[10px] font-mono uppercase bg-[#18181B] border border-[#27272A] hover:bg-neutral-800 text-slate-300 rounded transition cursor-pointer select-none"
                    >
                      Configure Policy
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
