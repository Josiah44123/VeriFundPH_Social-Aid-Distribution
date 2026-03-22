"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import { Search, X, CheckCircle2, AlertTriangle, Clock, Ban, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { QRCode } from "@/components/QRCode"

type StatusFilter = "ALL" | "ACTIVE" | "FLAGGED" | "PENDING" | "INACTIVE"
type SortKey = "id" | "lastName" | "barangay" | "enrolledAt"

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
  const PAGE_SIZE = 20

  const filtered = beneficiaries
    .filter(b => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        b.firstName.toLowerCase().includes(q) ||
        b.lastName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.barangay.toLowerCase().includes(q)
      const matchFilter = filter === "ALL" || b.status === filter
      return matchSearch && matchFilter
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1
      if (sortKey === "enrolledAt") return dir * (a.enrolledAt < b.enrolledAt ? -1 : 1)
      if (sortKey === "lastName") return dir * a.lastName.localeCompare(b.lastName)
      if (sortKey === "barangay") return dir * a.barangay.localeCompare(b.barangay)
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
              placeholder="Hanapin by pangalan, ID, o barangay…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full h-[44px] pl-[40px] pr-[16px] rounded-[12px] bg-white border border-[#E2E8F0] text-[14px] outline-none focus:border-[var(--ph-blue-deeper)] transition-colors"
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
                    ? "bg-[var(--navy-deep)] text-white"
                    : "bg-white border border-[#E2E8F0] text-[var(--text-muted)] hover:border-[var(--navy-deep)]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[16px] shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-[var(--surface-page)]">
                  {[
                    { label: "VeriFund ID", key: "id" as SortKey },
                    { label: "Pangalan", key: "lastName" as SortKey },
                    { label: "Barangay", key: "barangay" as SortKey },
                    { label: "Uri ng ID", key: null },
                    { label: "Status", key: null },
                    { label: "Enrolled", key: "enrolledAt" as SortKey },
                  ].map(col => (
                    <th
                      key={col.label}
                      onClick={() => col.key && handleSort(col.key)}
                      className={cn(
                        "px-[16px] py-[12px] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[#E2E8F0]",
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
                    <td colSpan={6} className="px-[16px] py-[40px] text-center text-[var(--text-muted)] text-[14px]">
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
                        "cursor-pointer transition-colors hover:bg-[#FAFBFF]",
                        b.id === selectedId ? "bg-[#EBF5FF]" : ""
                      )}
                    >
                      <td className="px-[16px] py-[12px] font-mono text-[12px] font-bold text-[var(--ph-gold)]">{b.id}</td>
                      <td className="px-[16px] py-[12px]">
                        <p className="text-[14px] font-bold text-[var(--text-primary)]">{b.firstName} {b.lastName}</p>
                        <p className="text-[12px] text-[var(--text-muted)]">{b.middleName || ""}</p>
                      </td>
                      <td className="px-[16px] py-[12px] text-[13px] text-[var(--text-secondary)]">{b.barangay}</td>
                      <td className="px-[16px] py-[12px] text-[13px] text-[var(--text-secondary)]">{b.idType}</td>
                      <td className="px-[16px] py-[12px]">
                        <span className="inline-flex items-center gap-[4px] px-[8px] py-[3px] rounded-full text-[11px] font-bold" style={{ background: cfg.bg, color: cfg.text }}>
                          <StatusIcon className="w-[10px] h-[10px]" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-[16px] py-[12px] text-[12px] text-[var(--text-muted)]">{formatDate(b.enrolledAt)}</td>
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
                className="px-[24px] py-[8px] rounded-full bg-[var(--navy-deep)] text-white text-[13px] font-bold hover:opacity-90 transition-opacity"
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
      {selected && (
        <div className="w-[360px] shrink-0 bg-white rounded-[16px] shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-200">
          <div className="px-[20px] py-[16px] border-b border-[#E2E8F0] flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #001A5E, #0038A8)' }}>
            <div>
              <p className="text-white font-bold text-[15px]">{selected.firstName} {selected.lastName}</p>
              <p className="text-white/60 font-mono text-[11px]">{selected.id}</p>
            </div>
            <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-[20px] h-[20px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-[20px]">
            {/* QR Code */}
            <div className="flex justify-center mb-[16px]">
              <div className="p-[12px] bg-white border border-[#E2E8F0] rounded-[12px]">
                <QRCode value={selected.id} size={120} />
              </div>
            </div>

            {/* Details */}
            {[
              ["Telepono", selected.phone],
              ["Barangay", selected.barangay],
              ["Uri ng ID", selected.idType],
              ["Numero ng ID", selected.idNumber],
              ["Enrolled by", selected.enrolledBy],
              ["Enrolled", formatDate(selected.enrolledAt)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-start py-[8px] border-b border-[#F0F3FA]">
                <span className="text-[12px] text-[var(--text-muted)] font-medium">{label}</span>
                <span className="text-[12px] font-bold text-[var(--text-primary)] text-right max-w-[160px] break-words">{value}</span>
              </div>
            ))}

            {/* Claims history */}
            <h4 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mt-[16px] mb-[8px]">History ng Claims</h4>
            {selectedClaims.length === 0 ? (
              <p className="text-[13px] text-[var(--text-muted)]">Wala pang claim.</p>
            ) : (
              <div className="flex flex-col gap-[8px]">
                {selectedClaims.map(c => (
                  <div key={c.id} className="bg-[var(--surface-page)] rounded-[10px] p-[12px]">
                    <div className="flex justify-between mb-[4px]">
                      <p className="text-[13px] font-bold text-[var(--text-primary)]">{c.distributionTitle}</p>
                      <span className={cn("text-[11px] font-bold px-[6px] py-[1px] rounded-full", c.status === "NAKUHA" ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]")}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[12px] text-[var(--text-muted)]">₱{c.amount.toLocaleString()} · {c.method ?? "N/A"} · {formatDate(c.verifiedAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
