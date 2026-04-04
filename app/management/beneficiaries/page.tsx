"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import { Search, X, CheckCircle2, AlertTriangle, Clock, Ban, ChevronUp, ChevronDown, Download, Users } from "lucide-react"
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

  const cols: { label: string, key: SortKey | null }[] = [
    { label: "VeriFund ID", key: "id" },
    { label: "Pangalan", key: "lastName" },
    { label: "Telepono", key: null },
    { label: "Kasarian", key: null },
    { label: "Barangay", key: null },
    { label: "Uri ng ID", key: null },
    { label: "Status", key: "status" },
    { label: "Enrolled", key: "enrolledAt" },
    { label: "Actions", key: null },
  ]

  return (
    <div className="flex flex-col gap-5 max-w-[1300px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Users className="w-3.5 h-3.5" /> Beneficiary Directory
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Benepisyaryo</h1>
          <p className="text-sm text-outline font-medium mt-1">Master file ng lahat ng verified na benepisyaryo</p>
        </div>
        <button onClick={handleExportCSV}
          className="h-11 px-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-primary/20 hover:opacity-90 transition-all">
          <Download className="w-4 h-4" /> I-export as CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total */}
        <div className="bg-gradient-to-br from-primary to-primary-container p-5 rounded-2xl text-white shadow-xl shadow-primary/10 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Kabuuang Benepisyaryo</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-black">{filtered.length.toLocaleString()}</span>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">+4.2%</span>
          </div>
        </div>

        {/* Active */}
        <div className="bg-gradient-to-br from-[#1a56ad] to-[#2563eb] p-5 rounded-2xl text-white shadow-xl shadow-blue-600/10 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Aktibong Account</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-black">{beneficiaries.filter(b => b.status === 'ACTIVE').length.toLocaleString()}</span>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">95%</span>
          </div>
        </div>

        {/* Flagged */}
        <div className="bg-gradient-to-br from-tertiary to-tertiary-container p-5 rounded-2xl text-white shadow-xl shadow-tertiary/10 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-lg" />
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Flagged For Review</p>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-black">{beneficiaries.filter(b => b.status === 'FLAGGED').length}</span>
            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">Attention</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Hanapin by pangalan, ID, telepono..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all" />
        </div>
        {/* Filter chips */}
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }}
            className={cn('h-11 px-4 rounded-full text-sm font-bold transition-all', filter === f.value
              ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-md'
              : 'bg-surface-container-lowest border border-outline-variant/20 text-on-surface-variant hover:border-primary/30')}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden flex-1 flex flex-col relative">
        {/* Table header */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/20">
                {cols.map(col => (
                  <th key={col.label} onClick={() => col.key && handleSort(col.key)}
                    className="px-5 py-4 text-[11px] font-black text-outline uppercase tracking-wider cursor-pointer select-none hover:text-primary transition-colors">
                    <span className="flex items-center gap-1">{col.label} {col.key && <SortIcon k={col.key} />}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-[16px] py-[40px] text-center text-[var(--text-muted)] text-[14px]">
                    Walang nahanap. Mag-register muna sa Field Console.
                  </td>
                </tr>
              )}
              {paginated.map(b => {
                const cfg = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.INACTIVE;
                return (
                  <tr key={b.id} onClick={() => setSelectedId(b.id === selectedId ? null : b.id)}
                    className={cn('cursor-pointer transition-all hover:bg-surface-container-low/50 group',
                      b.id === selectedId ? 'bg-primary/5' : '')}>
                    <td className="px-5 py-4 font-mono text-sm font-bold text-secondary">{b.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                          {b.firstName[0]}{b.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary leading-none">{b.firstName} {b.lastName}</p>
                          {b.middleName && <p className="text-xs text-outline">{b.middleName}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant font-mono">{b.phone}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{b.gender || '—'}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{b.barangay}</td>
                    <td className="px-5 py-4 text-sm text-on-surface-variant">{b.idType}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                        style={{ background: cfg.bg, color: cfg.text }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.text }} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-outline">{formatDate(b.enrolledAt)}</td>
                    <td className="px-5 py-4">
                      <button onClick={e => { e.stopPropagation(); setSelectedId(b.id); }}
                        className="text-xs font-bold text-primary hover:underline">Tingnan</button>
                    </td>
                  </tr>
                );
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
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
            className="w-[360px] shrink-0 bg-surface-container-lowest rounded-2xl editorial-shadow flex flex-col overflow-hidden fixed right-8 top-28 bottom-8 z-50">
            
            {/* Colored header */}
            <div className="bg-gradient-to-br from-primary to-primary-container px-5 py-5 flex items-start justify-between">
              <div>
                <p className="text-white font-bold text-base">{selected.firstName} {selected.lastName}</p>
                <p className="font-mono text-white/60 text-xs mt-0.5">{selected.id}</p>
                <span className="inline-flex items-center gap-1 mt-2 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold text-white">
                  {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                </span>
              </div>
              <button onClick={() => setSelectedId(null)} className="text-white/70 hover:text-white p-1">
                <X className="w-5 h-5" />
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
                      ? "text-primary border-primary"
                      : "text-outline border-transparent hover:text-primary"
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
                      <span className="text-[12px] text-outline font-medium">{label}</span>
                      <span className="text-[12px] font-bold text-primary text-right max-w-[180px] break-words">{value}</span>
                    </div>
                  ))}
                </>
              )}

              {drawerTab === "claims" && (
                <>
                  {selectedClaims.length === 0 ? (
                    <p className="text-[13px] text-outline text-center py-[24px]">Wala pang claim.</p>
                  ) : (
                    <div className="flex flex-col gap-[8px]">
                      {selectedClaims.map(c => (
                        <div key={c.id} className="bg-surface-container-low rounded-[12px] p-[14px]">
                          <div className="flex justify-between mb-[4px]">
                            <p className="text-[13px] font-bold text-primary">{c.distributionTitle}</p>
                            <span className={cn("text-[11px] font-bold px-[6px] py-[1px] rounded-full", c.status === "NAKUHA" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                              {c.status}
                            </span>
                          </div>
                          <p className="text-[12px] text-outline">
                            <span className="text-secondary font-bold">₱{c.amount.toLocaleString()}</span> · {c.method ?? "N/A"} · {formatDate(c.verifiedAt)}
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
