"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import { Search, X, CheckCircle2, AlertTriangle, Clock, Ban, ChevronUp, ChevronDown, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { QRCode } from "@/components/QRCode"
import { motion, AnimatePresence } from "framer-motion"

type StatusFilter = "ALL" | "ACTIVE" | "FLAGGED" | "PENDING" | "INACTIVE"
type SortKey = "id" | "lastName" | "enrolledAt" | "status"

const STATUS_CONFIG = {
  ACTIVE: { bg: "#E8F5EE", text: "#1A8C4E", label: "AKTIBO", icon: CheckCircle2 },
  PENDING: { bg: "#FEF3C7", text: "#B45309", label: "PENDING", icon: Clock },
  FLAGGED: { bg: "#FDE8EB", text: "#CE1126", label: "FLAGGED", icon: AlertTriangle },
  INACTIVE: { bg: "#F3F4F6", text: "#4A5568", label: "INACTIVE", icon: Ban },
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso))
  } catch { return iso }
}

export default function BeneficiariesPage() {
  const { beneficiaries, claims } = useVeriFundStore()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<StatusFilter>("ALL")
  const [sortKey, setSortKey] = useState<SortKey>("enrolledAt")
  const [sortAsc, setSortAsc] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [drawerTab, setDrawerTab] = useState<"info" | "claims">("info")
  const PAGE_SIZE = 20

  const filtered = beneficiaries
    .filter(b => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        b.firstName.toLowerCase().includes(q) ||
        b.lastName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.barangay.toLowerCase().includes(q)
      const matchFilter = filter === "ALL" || b.status === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1
      if (sortKey === "enrolledAt") return dir * (a.enrolledAt < b.enrolledAt ? -1 : 1)
      if (sortKey === "lastName") return dir * a.lastName.localeCompare(b.lastName)
      if (sortKey === "status") return dir * a.status.localeCompare(b.status)
      return dir * a.id.localeCompare(b.id)
    })

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const selected = selectedId ? beneficiaries.find(b => b.id === selectedId) : null
  const selectedClaims = selected ? claims.filter(c => c.beneficiaryId === selected.id) : []

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(true) }
  }

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (sortAsc ? <ChevronUp className="w-[12px] h-[12px]" /> : <ChevronDown className="w-[12px] h-[12px]" />) : null

  const handleExportCSV = () => {
    const headers = ["VeriFund ID", "Pangalan", "Telepono", "Kasarian", "Barangay", "Uri ng ID", "Status", "Enrolled"]
    const rows = filtered.map(b => [
      b.id, `${b.firstName} ${b.middleName || ""} ${b.lastName}`, b.phone, b.gender || "", b.barangay, b.idType, b.status, b.enrolledAt
    ])
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `verifund-beneficiaries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const FILTERS: { label: string; value: StatusFilter }[] = [
    { label: "Lahat", value: "ALL" },
    { label: "Aktibo", value: "ACTIVE" },
    { label: "Flagged", value: "FLAGGED" },
    { label: "Pending", value: "PENDING" },
  ]

  return (
    <div className="flex gap-[16px] h-full">
      {/* Main table area */}
      <div className="flex-1 flex flex-col gap-[16px] min-w-0">
        {/* Header controls */}
        <div className="flex items-center gap-[12px] flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-[16px] h-[16px] text-[var(--text-muted)] absolute left-[14px] top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Hanapin by pangalan, ID, telepono, o barangay…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full h-[48px] pl-[40px] pr-[16px] rounded-[14px] bg-white border border-[#E2E8F0] text-[14px] outline-none focus:border-[var(--navy)] transition-colors"
            />
          </div>
          <div className="flex gap-[6px]">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => { setFilter(f.value); setPage(1) }}
                className={cn(
                  "px-[14px] py-[6px] rounded-full text-[12px] font-bold transition-colors",
                  filter === f.value
                    ? "bg-[var(--navy)] text-white"
                    : "bg-white border border-[#E2E8F0] text-[var(--text-muted)] hover:border-[var(--navy)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportCSV}
            className="h-[40px] px-[16px] rounded-[12px] bg-[var(--navy)] text-white font-bold text-[13px] flex items-center gap-[8px] hover:opacity-90 transition-opacity"
          >
            <Download className="w-[16px] h-[16px]" />
            I-export as CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-md)] overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="bg-[var(--surface-page)]">
                  {[
                    { label: "VeriFund ID", key: "id" as SortKey },
                    { label: "Pangalan", key: "lastName" as SortKey },
                    { label: "Telepono", key: null },
                    { label: "Kasarian", key: null },
                    { label: "Barangay", key: null },
                    { label: "Uri ng ID", key: null },
                    { label: "Status", key: "status" as SortKey },
                    { label: "Enrolled", key: "enrolledAt" as SortKey },
                    { label: "Actions", key: null },
                  ].map(col => (
                    <th
                      key={col.label}
                      onClick={() => col.key && handleSort(col.key)}
                      className={cn(
                        "px-[14px] py-[12px] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[#E2E8F0]",
                        col.key ? "cursor-pointer select-none hover:text-[var(--text-primary)]" : ""
                      )}
                    >
                      <span className="flex items-center gap-[4px]">
                        {col.label}
                        {col.key && <SortIcon k={col.key} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F3FA]">
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-[16px] py-[40px] text-center text-[var(--text-muted)] text-[14px]">
                      Walang nahanap. Mag-register muna sa Field Console.
                    </td>
                  </tr>
                )}
                {paginated.map(b => {
                  const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.INACTIVE
                  const StatusIcon = cfg.icon
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
                      className={cn(
                        "cursor-pointer transition-all group",
                        b.id === selectedId ? "bg-[#EBF5FF]" : "hover:bg-[#F8F9FF]"
                      )}
                      style={b.id !== selectedId ? { borderLeft: '3px solid transparent' } : undefined}
                      onMouseEnter={e => { if (b.id !== selectedId) (e.currentTarget.style.borderLeft = '3px solid var(--navy)') }}
                      onMouseLeave={e => { if (b.id !== selectedId) (e.currentTarget.style.borderLeft = '3px solid transparent') }}
                    >
                      <td className="px-[14px] py-[12px] font-mono text-[12px] font-bold text-[#FFB800]">{b.id}</td>
                      <td className="px-[14px] py-[12px]">
                        <p className="text-[14px] font-bold text-[var(--text-primary)]">{b.firstName} {b.lastName}</p>
                        {b.middleName && <p className="text-[12px] text-[var(--text-muted)]">{b.middleName}</p>}
                      </td>
                      <td className="px-[14px] py-[12px] text-[13px] text-[var(--text-secondary)] font-mono">{b.phone}</td>
                      <td className="px-[14px] py-[12px] text-[13px] text-[var(--text-secondary)]">{b.gender || "—"}</td>
                      <td className="px-[14px] py-[12px] text-[13px] text-[var(--text-secondary)]">{b.barangay}</td>
                      <td className="px-[14px] py-[12px] text-[13px] text-[var(--text-secondary)]">{b.idType}</td>
                      <td className="px-[14px] py-[12px]">
                        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full text-[11px] font-bold" style={{ background: cfg.bg, color: cfg.text }}>
                          <StatusIcon className="w-[10px] h-[10px]" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-[14px] py-[12px] text-[12px] text-[var(--text-muted)]">{formatDate(b.enrolledAt)}</td>
                      <td className="px-[14px] py-[12px]">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedId(b.id) }}
                          className="text-[12px] font-bold text-[var(--navy)] hover:text-[var(--red)] transition-colors underline underline-offset-2"
                        >
                          Tingnan
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {paginated.length < filtered.length && (
            <div className="p-[16px] border-t border-[#E2E8F0] text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="px-[24px] py-[8px] rounded-full bg-[var(--navy)] text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
              >
                Ipakita pa ({filtered.length - paginated.length} natitira)
              </button>
            </div>
          )}

          <div className="px-[16px] py-[10px] border-t border-[#E2E8F0] text-[12px] text-[var(--text-muted)]">
            Nagpapakita ng {paginated.length} sa {filtered.length} benepisyaryo
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-[380px] shrink-0 bg-white rounded-[20px] shadow-[var(--shadow-lg)] flex flex-col overflow-hidden"
            style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.12)' }}
          >
            <div className="px-[20px] py-[20px] flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0D1966, #18269B)' }}>
              <div>
                <p className="text-white font-bold text-[16px]">{selected.firstName} {selected.lastName}</p>
                <p className="text-white/60 font-mono text-[12px] mt-[2px]">{selected.id}</p>
                <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full text-[10px] font-bold mt-[6px]"
                  style={{ 
                    background: STATUS_CONFIG[selected.status]?.bg ?? "#F3F4F6", 
                    color: STATUS_CONFIG[selected.status]?.text ?? "#4A5568" 
                  }}
                >
                  {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                </span>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white transition-colors p-1">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E2E8F0]">
              {(["info", "claims"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={cn(
                    "flex-1 py-[12px] text-[13px] font-bold transition-colors border-b-[2px]",
                    drawerTab === tab
                      ? "text-[var(--navy)] border-[var(--navy)]"
                      : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)]"
                  )}
                >
                  {tab === "info" ? "Impormasyon" : "Kasaysayan ng Claim"}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-[20px]">
              {drawerTab === "info" && (
                <>
                  {/* QR Code */}
                  <div className="flex justify-center mb-[16px]">
                    <div className="p-[8px] bg-white border border-[#E2E8F0] rounded-[12px]">
                      <QRCode value={selected.id} size={120} />
                    </div>
                  </div>

                  {/* Details */}
                  {[
                    ["Telepono", selected.phone],
                    ["Kasarian", selected.gender || "—"],
                    ["Barangay", selected.barangay],
                    ["Uri ng ID", selected.idType],
                    ["Numero ng ID", selected.idNumber],
                    ["Enrolled by", selected.enrolledBy],
                    ["Enrolled", formatDate(selected.enrolledAt)],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex justify-between items-start py-[8px] border-b border-[#F0F3FA]">
                      <span className="text-[12px] text-[var(--text-muted)] font-medium">{label}</span>
                      <span className="text-[12px] font-bold text-[var(--text-primary)] text-right max-w-[180px] break-words">{value}</span>
                    </div>
                  ))}
                </>
              )}

              {drawerTab === "claims" && (
                <>
                  {selectedClaims.length === 0 ? (
                    <p className="text-[13px] text-[var(--text-muted)] text-center py-[24px]">Wala pang claim.</p>
                  ) : (
                    <div className="flex flex-col gap-[8px]">
                      {selectedClaims.map(c => (
                        <div key={c.id} className="bg-[var(--surface-page)] rounded-[12px] p-[14px]">
                          <div className="flex justify-between mb-[4px]">
                            <p className="text-[13px] font-bold text-[var(--text-primary)]">{c.distributionTitle}</p>
                            <span className={cn("text-[11px] font-bold px-[6px] py-[1px] rounded-full", c.status === "NAKUHA" ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]")}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-[12px] text-[var(--text-muted)]">
                            <span className="text-[#FFB800] font-bold">₱{c.amount.toLocaleString()}</span> · {c.method ?? "N/A"} · {formatDate(c.verifiedAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
