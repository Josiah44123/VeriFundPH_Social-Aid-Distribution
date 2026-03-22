"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import { Lock, Download } from "lucide-react"
import { cn } from "@/lib/utils"

const ACTION_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  ENROLLED: { bg: "#EBF5FF", text: "#0038A8", label: "ENROLLED" },
  CLAIMED: { bg: "#E8F5EE", text: "#1A8C4E", label: "CLAIMED" },
  REJECTED: { bg: "#FDE8EB", text: "#CE1126", label: "REJECTED" },
  FLAGGED: { bg: "#FEF3C7", text: "#B45309", label: "FLAGGED" },
  DISTRIBUTION_CREATED: { bg: "#E0E8FF", text: "#001A5E", label: "DISTRIBUTION" },
  LOGIN: { bg: "#F3F4F6", text: "#4A5568", label: "LOGIN" },
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
    <div className="flex flex-col gap-[16px] max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <div>
          <h1 className="text-[20px] font-bold text-[var(--text-primary)] flex items-center gap-[8px]">
            <Lock className="w-[18px] h-[18px] text-[var(--text-muted)]" />
            Audit Log
          </h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-[2px] flex items-center gap-[4px]">
            <Lock className="w-[10px] h-[10px]" />
            Immutable — Hindi mabubura ang mga entry na ito.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="h-[40px] px-[16px] rounded-[10px] bg-[var(--navy-deep)] text-white font-bold text-[13px] flex items-center gap-[8px] hover:opacity-90 transition-opacity"
        >
          <Download className="w-[16px] h-[16px]" />
          I-export as CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[14px] p-[16px] shadow-sm flex flex-wrap gap-[12px] items-center">
        {/* Action filter chips */}
        <div className="flex gap-[6px] flex-wrap">
          {ACTIONS.map(a => {
            const cfg = a === "ALL" ? null : ACTION_CONFIG[a]
            return (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={cn(
                  "px-[10px] py-[4px] rounded-full text-[11px] font-bold transition-colors",
                  actionFilter === a
                    ? "bg-[var(--navy-deep)] text-white"
                    : "bg-[var(--surface-page)] text-[var(--text-muted)] hover:bg-[var(--navy-deep)]/10"
                )}
              >
                {cfg?.label ?? "LAHAT"}
              </button>
            )
          })}
        </div>

        {/* Barangay text filter */}
        <input
          type="text"
          placeholder="Filter by barangay…"
          value={barangayFilter}
          onChange={e => setBarangayFilter(e.target.value)}
          className="h-[36px] px-[12px] rounded-[10px] bg-[var(--surface-page)] border border-[#E2E8F0] text-[13px] outline-none focus:border-[var(--navy-deep)]"
        />

        {/* Date range */}
        <div className="flex gap-[6px] items-center">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="h-[36px] px-[10px] rounded-[10px] bg-[var(--surface-page)] border border-[#E2E8F0] text-[13px] outline-none" />
          <span className="text-[12px] text-[var(--text-muted)]">—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="h-[36px] px-[10px] rounded-[10px] bg-[var(--surface-page)] border border-[#E2E8F0] text-[13px] outline-none" />
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden">
        <div className="px-[20px] py-[12px] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[12px] font-bold text-[var(--success)] uppercase tracking-wider">Live Updates</span>
          </div>
          <span className="text-[12px] text-[var(--text-muted)]">
            {filtered.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-[var(--surface-page)]">
                {["Timestamp", "Action", "Actor", "Target", "Barangay", "Details"].map(h => (
                  <th key={h} className="px-[16px] py-[10px] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[#E2E8F0]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F3FA]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-[16px] py-[40px] text-center text-[var(--text-muted)] text-[14px]">
                    Walang matching entries.
                  </td>
                </tr>
              )}
              {filtered.map(entry => {
                const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.LOGIN
                return (
                  <tr key={entry.id} className="hover:bg-[#FAFBFF] transition-colors">
                    <td className="px-[16px] py-[10px] font-mono text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <span className="px-[8px] py-[3px] rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{entry.actorName}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{entry.actorRole}</p>
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{entry.targetName}</p>
                      <p className="font-mono text-[11px] text-[var(--ph-gold)]">{entry.targetId}</p>
                    </td>
                    <td className="px-[16px] py-[10px] text-[12px] text-[var(--text-muted)]">{entry.barangay}</td>
                    <td className="px-[16px] py-[10px] text-[12px] text-[var(--text-secondary)] max-w-[240px] truncate">{entry.details}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
