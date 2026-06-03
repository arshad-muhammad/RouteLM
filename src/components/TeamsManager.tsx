import React, { useState } from "react";
import { Users, Mail, UserPlus, Check, Key, Shield, User, Copy } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Administrator" | "Read-Only Operator" | "Security Auditor";
  status: "Active" | "Pending";
}

export default function TeamsManager() {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Elena Arshad", email: "muhd.arshadra@gmail.com", role: "Owner", status: "Active" },
    { id: "2", name: "David K.", email: "david.k@routelm.co", role: "Administrator", status: "Active" },
    { id: "3", name: "Sophia Y.", email: "sophia.y@linear.io", role: "Security Auditor", status: "Active" }
  ]);

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Member["role"]>("Read-Only Operator");
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Simulate sending invite
    const newMember: Member = {
      id: String(members.length + 1),
      name: inviteName.trim() || inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "Pending"
    };

    setMembers(prev => [...prev, newMember]);
    setGeneratedInviteLink(`https://console.routelm.com/join?code=r_inv_${Math.random().toString(36).substring(2, 10)}`);
    setInviteName("");
    setInviteEmail("");
  };

  const handleCopyInvite = () => {
    if (!generatedInviteLink) return;
    navigator.clipboard.writeText(generatedInviteLink);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
      setGeneratedInviteLink(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neutral-900 pb-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider font-mono text-white flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-cyan-400 shrink-0" />
            <span>Infrastructure Team Privileges</span>
          </h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Delegate workspace access, key permissions, and failover policy rule overrides to engineers with secure role scopes.
          </p>
        </div>
        <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-950/20 border border-emerald-900 px-3 py-1 rounded text-emerald-400 font-semibold shrink-0">
          Cluster: Prod-01-MFA Enforced
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Invite form panel */}
        <div className="lg:col-span-4 bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-850">
            <UserPlus className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Invite Cluster Operator</h3>
          </div>

          <form onSubmit={handleInviteSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Operator Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Elena Rose"
                className="w-full bg-[#18181B] border border-neutral-800 text-xs font-mono text-white p-2 rounded outline-none focus:border-white focus:placeholder-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Workspace Connection Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="rose@company.io"
                required
                className="w-full bg-[#18181B] border border-neutral-800 text-xs font-mono text-white p-2 rounded outline-none focus:border-white focus:placeholder-transparent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono text-neutral-500 font-bold uppercase block tracking-wider">Privilege Role Domain</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="w-full bg-[#18181B] text-white border border-neutral-800 rounded p-2 text-xs font-mono outline-none focus:border-white"
              >
                <option value="Read-Only Operator">Read-Only Operator</option>
                <option value="Administrator">Administrator</option>
                <option value="Security Auditor">Security Auditor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-white hover:bg-neutral-200 text-black text-xs font-mono font-bold tracking-wider rounded transition flex items-center justify-center gap-2 select-none cursor-pointer"
            >
              <span>SEND OPERATOR INVITE</span>
            </button>
          </form>

          {/* Generated Invite Copy Box */}
          {generatedInviteLink && (
            <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-md space-y-2 mt-4 animate-fadeIn">
              <p className="text-[9px] font-mono font-bold uppercase text-emerald-400">Invite Code Pending Registration</p>
              <div className="flex gap-1">
                <input
                  type="text"
                  readOnly
                  value={generatedInviteLink}
                  className="flex-1 bg-black/40 text-[10px] font-mono text-neutral-400 p-1.5 rounded outline-none"
                />
                <button
                  onClick={handleCopyInvite}
                  className="bg-neutral-800 border border-neutral-700 hover:text-white p-1.5 rounded text-neutral-400 select-none cursor-pointer transition"
                  title="Copy invite code to clipboard"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Existing Team Privileges Table */}
        <div className="lg:col-span-8 bg-[#0C0C0E] border border-neutral-800 p-5 rounded-lg">
          <div className="flex justify-between items-center pb-3 border-b border-neutral-850 mb-4">
            <h3 className="font-mono text-[10px] uppercase font-bold tracking-widest text-white">Active Operator Node Registry</h3>
            <span className="text-[10px] font-mono text-cyan-400 px-2 bg-cyan-950/20 rounded border border-cyan-900">
              {members.length} Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="border-b border-neutral-900 text-neutral-500 uppercase text-[9px] font-bold">
                  <th className="pb-2.5">Member Namespace</th>
                  <th className="pb-2.5">Role Domain</th>
                  <th className="pb-2.5 text-right">MFA Shield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-neutral-950/40 transition">
                    <td className="py-2.5">
                      <div className="flex flex-col">
                        <span className="text-white font-sans font-bold flex items-center gap-1.5">
                          <User className="w-3 h-3 text-neutral-400" />
                          {m.name}
                        </span>
                        <span className="text-neutral-500 text-[10px] mt-0.5">{m.email}</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold ${
                        m.role === "Owner" ? "bg-cyan-950/20 text-cyan-400 border border-cyan-900" :
                        m.role === "Administrator" ? "bg-purple-950/20 text-purple-400 border border-purple-900" :
                        m.role === "Security Auditor" ? "bg-amber-950/20 text-amber-500 border border-amber-900" :
                        "bg-[#18181B] text-neutral-400 border border-neutral-800"
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-emerald-400 bg-emerald-950/20 border border-emerald-900 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold tracking-widest inline-flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" />
                        <span>Shield Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
