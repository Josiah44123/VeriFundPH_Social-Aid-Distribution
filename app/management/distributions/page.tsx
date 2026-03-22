"use client"

import { useState } from "react"
import { useVeriFundStore } from "@/lib/store"
import type { Distribution, AuditEntry } from "@/lib/store"
import { Plus, Gift, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(13,25,102,0.55)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowModal(false)}
          >
            {/* Modal shell — constrained height */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()} // prevent backdrop click from closing
              style={{
                background: 'white',
                borderRadius: 20,
                width: '100%',
                maxWidth: 480,
                maxHeight: 'calc(100vh - 32px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              {/* Header — fixed, never scrolls */}
              <div style={{
                padding: '20px 24px 16px',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Bagong Distribusyon</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: '#F2F2F7', border: 'none',
                    cursor: 'pointer', fontSize: 14, color: '#3C3C43',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >✕</button>
              </div>

              {/* Scrollable form body */}
              <div style={{
                padding: '16px 24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}>
                {formError && <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)', background: 'var(--danger-light)', padding: 10, borderRadius: 10 }}>{formError}</div>}

                {/* Distribution Title */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E8E93', display: 'block', marginBottom: 6 }}>
                    Distribution Title
                  </label>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="SAP 2025 — Ikalawa"
                    style={{ width: '100%', height: 48, background: '#F2F2F7', border: '1.5px solid transparent', borderRadius: 12, padding: '0 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Barangay */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E8E93', display: 'block', marginBottom: 6 }}>
                    Barangay
                  </label>
                  <input
                    value={form.barangay}
                    onChange={e => setForm(f => ({ ...f, barangay: e.target.value }))}
                    placeholder="Sta. Cruz, Quezon City"
                    style={{ width: '100%', height: 48, background: '#F2F2F7', border: '1.5px solid transparent', borderRadius: 12, padding: '0 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Amount */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E8E93', display: 'block', marginBottom: 6 }}>
                    Halaga sa Bawat Benepisyaryo (₱)
                  </label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    placeholder="1500"
                    style={{ width: '100%', height: 48, background: '#F2F2F7', border: '1.5px solid transparent', borderRadius: 12, padding: '0 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Petsa */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E8E93', display: 'block', marginBottom: 6 }}>
                    Petsa
                  </label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={e => setForm(f => ({ ...f, scheduledDate: e.target.value }))}
                    style={{ width: '100%', height: 48, background: '#F2F2F7', border: '1.5px solid transparent', borderRadius: 12, padding: '0 14px', fontSize: 14, boxSizing: 'border-box', outline: 'none', color: 'var(--text-primary)' }}
                  />
                </div>

                {/* Disbursement Method */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E8E93', display: 'block', marginBottom: 8 }}>
                    Disbursement Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {(['Cash', 'GCash', 'Palawan', 'Mixed'] as Distribution["disbursementMethod"][]).map(method => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, disbursementMethod: method }))}
                        style={{
                          height: 42,
                          borderRadius: 10,
                          border: '1.5px solid',
                          borderColor: form.disbursementMethod === method ? '#FF0048' : '#E0E0E0',
                          background: form.disbursementMethod === method ? '#FFF0F3' : 'white',
                          color: form.disbursementMethod === method ? '#FF0048' : '#8E8E93',
                          fontSize: 14,
                          fontWeight: form.disbursementMethod === method ? 700 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer — fixed at bottom, never scrolls away */}
              <div style={{
                padding: '12px 24px 20px',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}>
                <button
                  type="button"
                  onClick={handleCreate}
                  style={{
                    width: '100%', height: 50,
                    background: '#FF0048', color: 'white',
                    border: 'none', borderRadius: 14,
                    fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  I-save ang Distribusyon
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    width: '100%', height: 40,
                    background: 'none', border: 'none',
                    color: '#8E8E93', fontSize: 14, cursor: 'pointer',
                  }}
                >
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
