"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import { Lock, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const ACTION_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  ENROLLED: { bg: "#EBF5FF", text: "#0038A8", label: "ENROLLED" },
  CLAIMED: { bg: "#E8F5EE", text: "#1A8C4E", label: "CLAIMED" },
  REJECTED: { bg: "#FDE8EB", text: "#CE1126", label: "REJECTED" },
  FLAGGED: { bg: "#FEF3C7", text: "#B45309", label: "FLAGGED" },
  DISTRIBUTION_CREATED: { bg: "#E0E8FF", text: "#001A5E", label: "DISTRIBUTION" },
  LOGIN: { bg: "#F3F4F6", text: "#4A5568", label: "LOGIN" },
}

const ROLE_CONFIG: Record<string, { bg: string; text: string }> = {
  SYSTEM: { bg: "#7C3AED", text: "#FFFFFF" },
  OFFICER: { bg: "#F3F4F6", text: "#4A5568" },
  ADMIN: { bg: "#0D1966", text: "#FFFFFF" },
}

const ACTIONS = ["ALL", "ENROLLED", "CLAIMED", "REJECTED", "FLAGGED", "DISTRIBUTION_CREATED", "LOGIN"]

function formatDateTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      year: "numeric", month: "short", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).format(new Date(iso))
  } catch { return iso }
}

export default function AuditLogPage() {
  const { auditLog } = useVeriFundStore()
  const [actionFilter, setActionFilter] = useState("ALL")
  const [barangayFilter, setBarangayFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const filtered = auditLog.filter(e => {
    const matchAction = actionFilter === "ALL" || e.action === actionFilter
    const matchBarangay = !barangayFilter || e.barangay.toLowerCase().includes(barangayFilter.toLowerCase())
    const eDate = e.timestamp.slice(0, 10)
    const matchFrom = !dateFrom || eDate >= dateFrom
    const matchTo = !dateTo || eDate <= dateTo
    return matchAction && matchBarangay && matchFrom && matchTo
  })

  const handleExportCSV = () => {
    const headers = ["Timestamp", "Action", "Actor Name", "Actor Role", "Target ID", "Target Name", "Barangay", "Details"]
    const rows = filtered.map(e => [
      e.timestamp, e.action, e.actorName, e.actorRole,
      e.targetId, e.targetName, e.barangay, `"${e.details.replace(/"/g, '""')}"`
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `verifund-audit-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1200px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5" /> Security
          </div>
          <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2 tracking-tight">Audit Log</h1>
          <p className="text-sm text-outline font-medium mt-1 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Immutable — Hindi mabubura ang mga entry na ito.
          </p>
        </div>
        <button onClick={handleExportCSV}
          className="h-11 px-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-90 transition-all">
          <Download className="w-4 h-4" /> I-export as CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 editorial-shadow flex flex-wrap gap-3 items-center border border-outline-variant/20">
        <div className="flex gap-2 flex-wrap">
          {ACTIONS.map(a => {
            const cfg = a === "ALL" ? null : ACTION_CONFIG[a]
            return (
              <button key={a} onClick={() => setActionFilter(a)}
                className={cn("px-4 h-9 rounded-full text-xs font-bold transition-all",
                  actionFilter === a
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-surface-container-low text-on-surface hover:bg-outline-variant/30"
                )}>
                {cfg?.label ?? "LAHAT"}
              </button>
            )
          })}
        </div>

        <div className="w-px h-6 bg-outline-variant/30 hidden md:block" />

        <input type="text" placeholder="Filter by barangay…" value={barangayFilter} onChange={e => setBarangayFilter(e.target.value)}
          className="h-10 px-4 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white text-sm outline-none transition-all w-[200px] placeholder:text-outline/50" />

        <div className="flex gap-2 items-center">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white text-sm outline-none transition-all" />
          <span className="text-xs text-outline font-black">—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="h-10 px-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:bg-white text-sm outline-none transition-all" />
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden border border-outline-variant/20">
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Updates</span>
          </div>
          <span className="text-xs text-outline font-bold">{filtered.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20">
                {["Timestamp", "Action", "Actor", "Target", "Barangay", "Details"].map(h => (
                  <th key={h} className="px-5 py-4 text-[11px] font-black text-outline uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-outline text-sm font-medium">
                    Walang matching entries.
                  </td>
                </tr>
              )}
              {filtered.map((entry, idx) => {
                const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.LOGIN
                const role = ROLE_CONFIG[entry.actorRole] ?? ROLE_CONFIG.OFFICER
                const isNew = idx === 0

                return (
                  <motion.tr key={entry.id}
                    initial={isNew ? { backgroundColor: "rgba(252,209,22,0.15)" } : undefined}
                    animate={{ backgroundColor: "rgba(252,209,22,0)" }}
                    transition={{ duration: 2 }}
                    className={`hover:bg-surface-container-low/50 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/30' : ''}`}>
                    <td className="px-5 py-3 font-mono text-[11px] text-outline font-medium whitespace-nowrap">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] font-black tracking-widest uppercase"
                        style={{ background: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-primary mb-1">{entry.actorName}</p>
                      <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest"
                        style={{ background: role.bg, color: role.text }}>
                        {entry.actorRole}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-primary">{entry.targetName}</p>
                      <p className="font-mono text-[10px] text-secondary font-bold">{entry.targetId}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant font-medium">{entry.barangay}</td>
                    <td className="px-5 py-3 text-[11px] text-outline font-medium w-full max-w-[300px]">
                      <span className="line-clamp-2">{entry.details}</span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
