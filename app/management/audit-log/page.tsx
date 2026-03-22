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
    <div className="flex flex-col gap-[16px] max-w-[1200px]">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-[12px]">
        <div>
          <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] flex items-center gap-[8px] tracking-[-0.3px]">
            <Lock className="w-[20px] h-[20px] text-[var(--text-muted)]" />
            Audit Log
          </h1>
          <p className="text-[12px] text-[var(--text-muted)] mt-[4px] flex items-center gap-[4px]">
            <Lock className="w-[10px] h-[10px]" />
            Immutable — Hindi mabubura ang mga entry na ito.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="h-[44px] px-[20px] rounded-[14px] bg-[var(--navy)] text-white font-bold text-[13px] flex items-center gap-[8px] hover:opacity-90 transition-opacity shadow-sm"
        >
          <Download className="w-[16px] h-[16px]" />
          I-export as CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-[16px] p-[16px] shadow-[var(--shadow-sm)] flex flex-wrap gap-[12px] items-center">
        {/* Action filter chips */}
        <div className="flex gap-[6px] flex-wrap">
          {ACTIONS.map(a => {
            const cfg = a === "ALL" ? null : ACTION_CONFIG[a]
            return (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={cn(
                  "px-[12px] py-[5px] rounded-full text-[11px] font-bold transition-colors",
                  actionFilter === a
                    ? "bg-[var(--navy)] text-white"
                    : "bg-[var(--surface-page)] text-[var(--text-muted)] hover:bg-[var(--navy-light)]"
                )}
              >
                {cfg?.label ?? "LAHAT"}
              </button>
            )
          })}
        </div>

        <div className="w-[1px] h-[24px] bg-[#E8ECF7] hidden md:block" />

        {/* Barangay text filter */}
        <input
          type="text"
          placeholder="Filter by barangay…"
          value={barangayFilter}
          onChange={e => setBarangayFilter(e.target.value)}
          className="h-[36px] px-[12px] rounded-[10px] bg-[var(--surface-page)] border border-[#E2E8F0] text-[13px] outline-none focus:border-[var(--navy)] transition-colors w-[200px]"
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
      <div className="bg-white rounded-[20px] shadow-[var(--shadow-md)] overflow-hidden">
        <div className="px-[20px] py-[14px] border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFBFF]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[12px] font-bold text-[var(--success)] uppercase tracking-wider">● Live Updates</span>
          </div>
          <span className="text-[12px] text-[var(--text-muted)] font-bold">
            {filtered.length} entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
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
              {filtered.map((entry, idx) => {
                const cfg = ACTION_CONFIG[entry.action] ?? ACTION_CONFIG.LOGIN
                const role = ROLE_CONFIG[entry.actorRole] ?? ROLE_CONFIG.OFFICER
                const isNew = idx === 0

                return (
                  <motion.tr
                    key={entry.id}
                    initial={isNew ? { backgroundColor: "rgba(255,184,0,0.10)" } : undefined}
                    animate={{ backgroundColor: "rgba(255,184,0,0)" }}
                    transition={{ duration: 2 }}
                    className="hover:bg-[#FAFBFF] transition-colors"
                  >
                    <td className="px-[16px] py-[10px] font-mono text-[11px] text-[var(--text-muted)] whitespace-nowrap">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <span className="px-[8px] py-[3px] rounded-full text-[10px] font-bold whitespace-nowrap" style={{ background: cfg.bg, color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <p className="text-[13px] font-bold text-[var(--text-primary)] mb-[2px]">{entry.actorName}</p>
                      <span className="px-[6px] py-[2px] rounded-[4px] text-[9px] font-bold uppercase tracking-wider" style={{ background: role.bg, color: role.text }}>
                        {entry.actorRole}
                      </span>
                    </td>
                    <td className="px-[16px] py-[10px]">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{entry.targetName}</p>
                      <p className="font-mono text-[11px] text-[#FFB800] font-bold">{entry.targetId}</p>
                    </td>
                    <td className="px-[16px] py-[10px] text-[12px] text-[var(--text-muted)]">{entry.barangay}</td>
                    <td className="px-[16px] py-[10px] text-[12px] text-[var(--text-secondary)] max-w-[300px]">
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
