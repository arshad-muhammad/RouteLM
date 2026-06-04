import React, { useState } from "react";
import { RouteLMApiKey } from "../types";
import { Key, Copy, Check, Eye, Trash2, ShieldCheck, Plus, Terminal } from "lucide-react";

interface APIKeysManagerProps {
  keys: RouteLMApiKey[];
  onCreateKey: (name: string) => Promise<void>;
  onRevokeKey: (id: string) => Promise<void>;
}

export default function APIKeysManager({ keys, onCreateKey, onRevokeKey }: APIKeysManagerProps) {
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKeySecretId, setShowKeySecretId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateKey(newKeyName.trim());
      setNewKeyName("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Generator panel */}
        <div className="lg:col-span-1 bg-[#0C0C0E] border border-[#27272A] rounded p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="font-semibold text-[#FAFAFA] text-xs uppercase tracking-wider font-mono">
                Create API Key
              </h3>
            </div>
            <p className="text-[11px] text-[#71717A] leading-relaxed mb-6 font-mono">
              Create secure API keys to integrate RouteLM into your code. Use these keys in your code headers to securely route requests.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[9px] font-mono text-[#71717A] uppercase mb-2 font-bold tracking-wider">
                Key Label / Purpose
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Staging Webhooks, Dev SDK"
                className="w-full bg-[#18181B] border border-[#27272A] rounded px-3 py-1.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-white font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !newKeyName}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold py-1.5 rounded transition disabled:opacity-50 select-none cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "GENERATING..." : "CREATE KEY"}</span>
            </button>
          </form>
        </div>

        {/* Keys List Table */}
        <div className="lg:col-span-2 bg-[#0C0C0E] border border-[#27272A] rounded p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">
              Active API Keys
            </h3>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/20 px-2.5 py-0.5 rounded-full border border-cyan-800/40">
              {keys.length} Keys Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#27272A] text-[9px] font-mono text-[#71717A] uppercase font-bold">
                  <th className="pb-2.5 pt-1 pl-2">Name</th>
                  <th className="pb-2.5 pt-1">Key</th>
                  <th className="pb-2.5 pt-1">Requests</th>
                  <th className="pb-2.5 pt-1">Created On</th>
                  <th className="pb-2.5 pt-1 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]/40 text-[11px] font-mono">
                {keys.map((k) => (
                  <tr key={k.id} className="hover:bg-[#18181B]/40 group transition-colors">
                    <td className="py-2.5 pl-2 max-w-[140px] truncate">
                      <div className="flex items-center space-x-2">
                        <Key className={`h-3 w-3 ${k.status === "active" ? "text-cyan-400" : "text-slate-600"}`} />
                        <span className="font-sans font-medium text-slate-200">{k.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 max-w-[170px] truncate text-[#A1A1AA]">
                      {showKeySecretId === k.id ? (
                        <span className="text-white font-mono text-[11px] selection:bg-cyan-950">{k.key}</span>
                      ) : (
                        <span>••••••••••••••••{k.key.slice(-4)}</span>
                      )}
                    </td>
                    <td className="py-2.5 text-[#A1A1AA]">{k.requestsCount}</td>
                    <td className="py-2.5 text-[#71717A]">
                      {new Date(k.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "2-digit",
                      })}
                    </td>
                    <td className="py-2.5 text-right pr-2">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleCopy(k.key, k.id)}
                          className="p-1 text-[#71717A] hover:text-cyan-400 rounded hover:bg-[#18181B] transition"
                          title="Copy client key"
                        >
                          {copiedKeyId === k.id ? (
                            <Check className="h-3 w-3 text-[#4ADE80]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={() => setShowKeySecretId(showKeySecretId === k.id ? null : k.id)}
                          className="p-1 text-[#71717A] hover:text-[#FAFAFA] rounded hover:bg-[#18181B] transition"
                          title="Toggle Key Visibility"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        {k.status === "active" ? (
                          <button
                            onClick={() => onRevokeKey(k.id)}
                            className="p-1 text-[#71717A] hover:text-red-400 rounded hover:bg-[#18181B] transition"
                            title="Revoke key"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-red-500/80 bg-red-950/20 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider">
                            Revoked
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {keys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-[#71717A] text-xs">
                      No API keys found. Create a key above to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
