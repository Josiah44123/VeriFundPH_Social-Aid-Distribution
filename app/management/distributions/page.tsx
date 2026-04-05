"use client"

import { useState, useEffect } from "react"
import { useVeriFundStore } from "@/lib/store"
import type { Distribution, AuditEntry } from "@/lib/store"
import { Plus, Gift, ChevronDown, ChevronUp, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

function formatDate(iso: string) {
  try { return new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(new Date(iso)) }
  catch { return iso }
}

const STATUS_CONFIG = {
  ACTIVE: { bg: "#E8F5EE", text: "#1A8C4E", label: "AKTIBO", border: "#10B981" },
  SCHEDULED: { bg: "#FEF3C7", text: "#B45309", label: "NAKATAKDA", border: "#F59E0B" },
  COMPLETED: { bg: "#EBF5FF", text: "#1E40AF", label: "TAPOS NA", border: "#1A56AD" }, // Vibrant Blue
}

export default function DistributionsPage() {
  const { distributions, claims, beneficiaries, addDistribution, addAuditEntry, updateDistribution } = useVeriFundStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: "", barangay: "", scheduledDate: "", amount: "", disbursementMethod: "Mixed" as Distribution["disbursementMethod"]
  })
  const [formError, setFormError] = useState("")

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) setShowModal(false)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showModal])

  const active = distributions.filter(d => d.status !== "COMPLETED")
  const completed = distributions.filter(d => d.status === "COMPLETED")

  const handleCreate = () => {
    if (!form.title || !form.barangay || !form.scheduledDate || !form.amount) {
      setFormError("Kumpletuhin ang lahat ng fields.")
      return
    }
    const newDist: Distribution = {
      id: `DIST-${Date.now()}`,
      title: form.title,
      barangay: form.barangay,
      scheduledDate: form.scheduledDate,
      amount: Number(form.amount),
      status: "SCHEDULED",
      totalBeneficiaries: beneficiaries.filter(b => b.status === "ACTIVE" && b.barangay.toLowerCase().includes(form.barangay.toLowerCase())).length,
      totalClaimed: 0,
      disbursementMethod: form.disbursementMethod,
      createdBy: "LGU Admin",
      createdAt: new Date().toISOString(),
    }
    const entry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "DISTRIBUTION_CREATED",
      actorName: "LGU Admin",
      actorRole: "ADMIN",
      targetId: newDist.id,
      targetName: newDist.title,
      barangay: form.barangay,
      details: `Bagong distribusyon: ${newDist.title} — ₱${newDist.amount.toLocaleString()} — ${newDist.scheduledDate}`,
    }
    addDistribution(newDist)
    addAuditEntry(entry)
    setShowModal(false)
    setForm({ title: "", barangay: "", scheduledDate: "", amount: "", disbursementMethod: "Mixed" })
    setFormError("")
  }

  const handleMarkComplete = (d: Distribution) => {
    if (typeof updateDistribution === "function") {
      updateDistribution(d.id, { status: "COMPLETED" })
    }
    addAuditEntry({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "DISTRIBUTION_COMPLETED",
      actorName: "LGU Admin",
      actorRole: "ADMIN",
      targetId: d.id,
      targetName: d.title,
      barangay: d.barangay,
      details: `Distribusyon "${d.title}" ay minarkahan na bilang TAPOS.`,
    })
  }

  const DistCard = ({ d }: { d: Distribution }) => {
    const cfg = STATUS_CONFIG[d.status] ?? STATUS_CONFIG.SCHEDULED
    const pct = d.totalBeneficiaries > 0 ? Math.round((d.totalClaimed / d.totalBeneficiaries) * 100) : 0
    const isExpanded = expandedId === d.id
    const distClaims = claims.filter(c => c.distributionId === d.id)

    return (
      <div 
        className="rounded-2xl overflow-hidden relative editorial-shadow transition-shadow hover:shadow-lg mt-1"
        style={{ backgroundColor: cfg.border, color: '#ffffff' }}
      >
        <div className="p-5 pl-6 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : d.id)}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base font-extrabold text-white leading-tight">{d.title}</h3>
              <p className="text-xs text-white/80 font-medium mt-1">{d.barangay} · {formatDate(d.scheduledDate)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider bg-white/20 text-white shadow-sm">{cfg.label}</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-white/80" /> : <ChevronDown className="w-4 h-4 text-white/80" />}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-1">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-wider mb-2 text-white/95">
              <span>{d.totalClaimed} / {d.totalBeneficiaries} NA-CLAIM</span>
              <span className="drop-shadow-sm font-extrabold text-white">₱{(d.totalClaimed * d.amount).toLocaleString()} DISBURSED</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[10px] text-white/80 font-bold mt-2">{pct}% complete · {d.disbursementMethod}</div>
          </div>
        </div>

        {/* Expanded claims */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="border-t border-white/20 px-6 py-4 bg-black/10">
                <div className="flex items-center justify-between mb-3 text-white/90">
                  <h4 className="text-[10px] font-black uppercase tracking-widest">
                    CLAIMS ({distClaims.length})
                  </h4>
                  {d.status !== "COMPLETED" && (
                    <button onClick={(e) => { e.stopPropagation(); handleMarkComplete(d) }}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-white hover:text-white/80 transition-colors bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> I-mark bilang Tapos
                    </button>
                  )}
                </div>
                {distClaims.length === 0 ? (
                  <p className="text-xs text-white/70 font-medium">Wala pang claims.</p>
                ) : (
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                    {distClaims.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-xs py-2 border-b border-white/10 last:border-0 text-white">
                        <span className="font-bold tracking-tight">{c.beneficiaryName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black drop-shadow-sm">₱{c.amount.toLocaleString()}</span>
                          <span className="text-[10px] text-white/70">{c.method ?? "N/A"}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase", c.status === "NAKUHA" ? "bg-white text-emerald-800" : "bg-white/20 text-white")}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-[1000px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-bold uppercase tracking-widest mb-3">
            <Gift className="w-3.5 h-3.5" /> Operations
          </div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Distribusyon</h1>
          <p className="text-sm text-outline font-medium mt-1">I-manage ang mga payout events at schedules</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="h-11 px-5 rounded-full bg-gradient-to-r from-tertiary to-tertiary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-tertiary/20 hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Bagong Distribusyon
        </button>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div>
          <h2 className="text-xs font-black text-outline uppercase tracking-widest mb-3">Aktibong Distribusyon</h2>
          <div className="flex flex-col gap-3">
            {active.map(d => <DistCard key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-xs font-black text-outline uppercase tracking-widest mb-3">Natapos Na</h2>
          <div className="flex flex-col gap-3">
            {completed.map(d => <DistCard key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {distributions.length === 0 && (
        <div className="bg-surface-container-lowest rounded-2xl p-10 text-center editorial-shadow">
          <Gift className="w-10 h-10 text-outline mx-auto mb-3" />
          <p className="font-extrabold text-primary text-lg">Wala pang distribusyon.</p>
          <p className="text-sm text-outline font-medium mt-1">Gumawa ng bagong distribusyon para magsimula.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-primary/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={e => e.stopPropagation()}
              className="bg-surface-container-lowest rounded-3xl w-full max-w-[480px] max-h-[calc(100vh-32px)] flex flex-col overflow-hidden editorial-shadow">
              
              <div className="p-5 border-b border-outline-variant/20 shrink-0 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-primary tracking-tight">Bagong Distribusyon</h2>
                <button type="button" onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-low text-on-surface hover:bg-outline-variant/30 transition-all flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                {formError && <div className="text-[13px] font-bold text-tertiary bg-tertiary/10 p-3 rounded-xl">{formError}</div>}

                <div>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-1.5">Distribution Title</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="SAP 2025 — Ikalawa"
                    className="w-full h-12 bg-surface-container-low border border-transparent focus:border-tertiary/30 focus:bg-white rounded-xl px-4 text-sm text-on-surface font-bold outline-none transition-all placeholder:text-outline/50 placeholder:font-medium" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-1.5">Barangay</label>
                  <input value={form.barangay} onChange={e => setForm(f => ({ ...f, barangay: e.target.value }))}
                    placeholder="Sta. Cruz, Quezon City"
                    className="w-full h-12 bg-surface-container-low border border-transparent focus:border-tertiary/30 focus:bg-white rounded-xl px-4 text-sm text-on-surface font-bold outline-none transition-all placeholder:text-outline/50 placeholder:font-medium" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-1.5">Halaga sa Bawat Benepisyaryo (₱)</label>
                  <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="1500"
                    className="w-full h-12 bg-surface-container-low border border-transparent focus:border-tertiary/30 focus:bg-white rounded-xl px-4 text-sm text-on-surface font-bold outline-none transition-all placeholder:text-outline/50 placeholder:font-medium" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-1.5">Petsa</label>
                  <input type="date" value={form.scheduledDate} onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                    className="w-full h-12 bg-surface-container-low border border-transparent focus:border-tertiary/30 focus:bg-white rounded-xl px-4 text-sm text-on-surface font-bold outline-none transition-all" />
                </div>

                <div>
                  <label className="text-[10px] font-black text-outline uppercase tracking-widest block mb-2">Disbursement Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Cash', 'GCash', 'Palawan', 'Mixed'] as Distribution["disbursementMethod"][]).map(method => (
                      <button key={method} type="button" onClick={() => setForm(f => ({ ...f, disbursementMethod: method }))}
                        className={cn("h-11 rounded-xl border-[1.5px] text-sm transition-all",
                          form.disbursementMethod === method
                            ? "border-tertiary bg-tertiary/5 text-tertiary font-bold"
                            : "border-outline-variant/30 bg-white text-outline font-medium hover:border-outline-variant"
                        )}>
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-outline-variant/20 shrink-0 flex flex-col gap-2">
                <button type="button" onClick={handleCreate}
                  className="w-full h-[52px] bg-gradient-to-r from-tertiary to-tertiary-container text-white rounded-xl font-extrabold text-[15px] shadow-md shadow-tertiary/20 hover:opacity-90 active:scale-[0.98] transition-all">
                  I-save ang Distribusyon
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="w-full h-10 text-outline font-bold text-sm hover:text-primary transition-colors">
                  I-cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
