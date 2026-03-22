"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import type { Distribution, AuditEntry } from "@/lib/store"
import { Plus, Gift, ChevronDown, ChevronUp, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

function formatDate(iso: string) {
  try { return new Intl.DateTimeFormat("en-PH", { month: "long", day: "numeric", year: "numeric" }).format(new Date(iso)) }
  catch { return iso }
}

const STATUS_CONFIG = {
  ACTIVE: { bg: "#E8F5EE", text: "#1A8C4E", label: "AKTIBO", border: "#00C853" },
  SCHEDULED: { bg: "#FEF3C7", text: "#B45309", label: "NAKATAKDA", border: "#FFB800" },
  COMPLETED: { bg: "#F3F4F6", text: "#4A5568", label: "TAPOS NA", border: "#4A5568" },
}

export default function DistributionsPage() {
  const { distributions, claims, addDistribution, addAuditEntry, updateDistribution } = useVeriFundStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: "", barangay: "", scheduledDate: "", amount: "", disbursementMethod: "Mixed" as Distribution["disbursementMethod"]
  })
  const [formError, setFormError] = useState("")

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
      totalBeneficiaries: 0,
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
      action: "DISTRIBUTION_CREATED",
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
      <div className="bg-white rounded-[20px] shadow-[var(--shadow-md)] overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-r-full" style={{ background: cfg.border }} />
        
        <div className="p-[20px] cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : d.id)}>
          <div className="flex items-start justify-between mb-[12px]">
            <div>
              <h3 className="text-[16px] font-bold text-[var(--text-primary)]">{d.title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] mt-[2px]">{d.barangay} · {formatDate(d.scheduledDate)}</p>
            </div>
            <div className="flex items-center gap-[8px]">
              <span className="px-[10px] py-[4px] rounded-full text-[11px] font-bold" style={{ background: cfg.bg, color: cfg.text }}>{cfg.label}</span>
              {isExpanded ? <ChevronUp className="w-[16px] h-[16px] text-[var(--text-muted)]" /> : <ChevronDown className="w-[16px] h-[16px] text-[var(--text-muted)]" />}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-[8px]">
            <div className="flex justify-between text-[12px] font-bold mb-[6px]">
              <span className="text-[var(--text-muted)]">{d.totalClaimed} / {d.totalBeneficiaries} na-claim</span>
              <span className="text-[#FFB800] font-bold">₱{(d.totalClaimed * d.amount).toLocaleString()} disbursed</span>
            </div>
            <div className="h-[8px] bg-[var(--surface-page)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--success)] rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-[11px] text-[var(--text-muted)] mt-[4px]">{pct}% complete · {d.disbursementMethod}</div>
          </div>
        </div>

        {/* Expanded claims */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#F0F3FA] px-[20px] py-[16px]">
                <div className="flex items-center justify-between mb-[10px]">
                  <h4 className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Claims ({distClaims.length})
                  </h4>
                  {d.status !== "COMPLETED" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMarkComplete(d) }}
                      className="flex items-center gap-[6px] text-[12px] font-bold text-[var(--success)] hover:text-[var(--navy)] transition-colors"
                    >
                      <CheckCircle2 className="w-[14px] h-[14px]" />
                      I-mark bilang Tapos
                    </button>
                  )}
                </div>
                {distClaims.length === 0 ? (
                  <p className="text-[13px] text-[var(--text-muted)]">Wala pang claims.</p>
                ) : (
                  <div className="flex flex-col gap-[6px] max-h-[200px] overflow-y-auto">
                    {distClaims.map(c => (
                      <div key={c.id} className="flex items-center justify-between text-[13px] py-[6px] border-b border-[#F0F3FA]">
                        <span className="font-medium text-[var(--text-primary)]">{c.beneficiaryName}</span>
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[#FFB800] font-bold text-[12px]">₱{c.amount.toLocaleString()}</span>
                          <span className="text-[var(--text-muted)] text-[12px]">{c.method ?? "N/A"}</span>
                          <span className={cn("px-[6px] py-[2px] rounded-full text-[10px] font-bold", c.status === "NAKUHA" ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]")}>
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
    <div className="flex flex-col gap-[20px] max-w-[900px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-extrabold text-[var(--text-primary)] tracking-[-0.3px]">Distribusyon</h1>
        <button
          onClick={() => setShowModal(true)}
          className="h-[44px] px-[20px] rounded-[14px] text-[var(--navy-deep)] font-bold text-[14px] flex items-center gap-[8px] transition-all hover:opacity-90 shadow-sm active:scale-[0.97]"
          style={{ background: 'var(--ph-gold)' }}
        >
          <Plus className="w-[18px] h-[18px]" />
          Mag-create ng Distribusyon
        </button>
      </div>

      {/* Active */}
      {active.length > 0 && (
        <div>
          <h2 className="section-label-bar mb-[12px]">AKTIBONG DISTRIBUSYON</h2>
          <div className="flex flex-col gap-[12px]">
            {active.map(d => <DistCard key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="section-label-bar mb-[12px]">NATAPOS NA</h2>
          <div className="flex flex-col gap-[12px]">
            {completed.map(d => <DistCard key={d.id} d={d} />)}
          </div>
        </div>
      )}

      {distributions.length === 0 && (
        <div className="bg-white rounded-[20px] p-[40px] text-center shadow-[var(--shadow-sm)]">
          <Gift className="w-[40px] h-[40px] text-[var(--text-muted)] mx-auto mb-[12px]" />
          <p className="font-bold text-[var(--text-primary)]">Wala pang distribusyon.</p>
          <p className="text-[13px] text-[var(--text-muted)] mt-[4px]">Gumawa ng bagong distribusyon para magsimula.</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(13,27,62,0.6)' }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-x-0 bottom-0 z-50 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[480px] bg-white rounded-t-[24px] sm:rounded-[20px] p-[24px] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-[20px]">
                <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Bagong Distribusyon</h2>
                <button onClick={() => setShowModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <X className="w-[20px] h-[20px]" />
                </button>
              </div>

              <div className="space-y-[14px]">
                {formError && <div className="text-[13px] font-bold text-[var(--danger)] bg-[var(--danger-light)] p-[10px] rounded-[10px]">{formError}</div>}
                
                {[
                  { label: "Distribution Title", key: "title", placeholder: "SAP 2025 — Ikalawa" },
                  { label: "Barangay", key: "barangay", placeholder: "Sta. Cruz, Quezon City" },
                  { label: "Amount per Recipient (₱)", key: "amount", placeholder: "1500", type: "number" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="section-label mb-[4px] block">{f.label}</label>
                    <input
                      type={f.type ?? "text"}
                      placeholder={f.placeholder}
                      value={(form as Record<string, string>)[f.key]}
                      onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      className="w-full h-[48px] rounded-[12px] bg-[var(--surface-page)] px-[14px] text-[14px] border-[1.5px] border-transparent outline-none focus:border-[var(--navy)] transition-colors"
                    />
                  </div>
                ))}

                <div>
                  <label className="section-label mb-[4px] block">Petsa</label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={e => setForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full h-[48px] rounded-[12px] bg-[var(--surface-page)] px-[14px] text-[14px] border-[1.5px] border-transparent outline-none focus:border-[var(--navy)] transition-colors"
                  />
                </div>

                <div>
                  <label className="section-label mb-[4px] block">Disbursement Method</label>
                  <div className="flex gap-[8px] flex-wrap">
                    {(["Cash", "GCash", "Palawan", "Mixed"] as Distribution["disbursementMethod"][]).map(m => (
                      <button
                        key={m}
                        onClick={() => setForm(prev => ({ ...prev, disbursementMethod: m }))}
                        className={cn(
                          "px-[14px] py-[8px] rounded-[10px] text-[13px] font-bold transition-colors border-[1.5px]",
                          form.disbursementMethod === m
                            ? "bg-[var(--navy)] text-white border-[var(--navy)]"
                            : "bg-[var(--surface-page)] text-[var(--text-muted)] border-transparent hover:border-[var(--navy)]"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="w-full h-[52px] rounded-[14px] font-bold text-[15px] text-[var(--navy-deep)] mt-[20px] transition-all hover:opacity-90 shadow-sm active:scale-[0.97]"
                style={{ background: 'var(--ph-gold)' }}
              >
                I-save ang Distribusyon
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
