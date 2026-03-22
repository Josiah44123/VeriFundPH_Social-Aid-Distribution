"use client"

import { useVeriFundStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Users, CheckCircle2, Clock, AlertTriangle, Activity, Shield } from "lucide-react"

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.2, delay: i * 0.06 } })
}

const ACTION_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ENROLLED: { bg: "#EBF5FF", text: "#0038A8", label: "Enrolled" },
  CLAIMED: { bg: "#E8F5EE", text: "#1A8C4E", label: "Claimed" },
  REJECTED: { bg: "#FDE8EB", text: "#CE1126", label: "Rejected" },
  FLAGGED: { bg: "#FEF3C7", text: "#B45309", label: "Flagged" },
  DISTRIBUTION_CREATED: { bg: "#E0E8FF", text: "#001A5E", label: "Distribution" },
  LOGIN: { bg: "#F3F4F6", text: "#4A5568", label: "Login" },
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date(iso))
  } catch { return iso }
}

export default function ManagementDashboard() {
  const { beneficiaries, claims, fraudFlags, auditLog, resolveFraudFlag, distributions } = useVeriFundStore()

  const nakuhaCount = claims.filter(c => c.status === "NAKUHA").length
  const activeCount = beneficiaries.filter(b => b.status === "ACTIVE").length
  const notClaimed = Math.max(0, activeCount - nakuhaCount)
  const activeFraudCount = fraudFlags.filter(f => !f.resolved).length
  const recentAudit = auditLog.slice(0, 10)
  const activeFlags = fraudFlags.filter(f => !f.resolved)

  // Claims per barangay for active distribution
  const activeDist = distributions.find(d => d.status === "ACTIVE")
  const claimsByBarangay = claims
    .filter(c => c.status === "NAKUHA" && c.distributionId === activeDist?.id)
    .reduce<Record<string, number>>((acc, c) => {
      acc[c.barangay] = (acc[c.barangay] || 0) + 1
      return acc
    }, {})

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Magandang umaga"
    if (h < 18) return "Magandang hapon"
    return "Magandang gabi"
  }

  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())

  return (
    <div className="flex flex-col gap-[20px] max-w-[1200px]">
      {/* Greeting */}
      <div>
        <h1 className="text-[24px] font-bold text-[var(--text-primary)]">{greeting()}, Admin 👋</h1>
        <p className="text-[13px] text-[var(--text-muted)] mt-[2px]">{today}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
        {[
          { label: "Kabuuang Benepisyaryo", value: beneficiaries.length, icon: Users, color: "#EBF5FF", iconColor: "#0038A8", accent: "#0038A8" },
          { label: "Nakakuha Na", value: nakuhaCount, icon: CheckCircle2, color: "#E8F5EE", iconColor: "#1A8C4E", accent: "#1A8C4E" },
          { label: "Hindi pa Nakakuha", value: notClaimed, icon: Clock, color: "#FEF3C7", iconColor: "#B45309", accent: "#B45309" },
          { label: "Fraud Flags", value: activeFraudCount, icon: AlertTriangle, color: "#FDE8EB", iconColor: "#CE1126", accent: "#CE1126", pulse: activeFraudCount > 0 },
        ].map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              className="bg-white rounded-[16px] p-[20px] shadow-sm"
            >
              <div className="flex items-center justify-between mb-[12px]">
                <div className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center" style={{ background: card.color }}>
                  <Icon className="w-[20px] h-[20px]" style={{ color: card.iconColor }} />
                </div>
                {card.pulse && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--danger)] animate-pulse" />
                )}
              </div>
              <p className="text-[12px] text-[var(--text-muted)] font-medium mb-[4px]">{card.label}</p>
              <p className="text-[32px] font-bold leading-none" style={{ color: card.accent }}>
                {card.value.toLocaleString()}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Two-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-[12px]">
        {/* Recent Activity */}
        <div className="lg:col-span-3 bg-white rounded-[16px] shadow-sm overflow-hidden">
          <div className="px-[20px] py-[16px] border-b border-[#E2E8F0] flex items-center gap-[8px]">
            <Activity className="w-[18px] h-[18px] text-[var(--ph-gold)]" />
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Kamakailang Aktibidad</h3>
          </div>
          <div className="divide-y divide-[#F0F3FA]">
            {recentAudit.length === 0 && (
              <p className="px-[20px] py-[16px] text-[13px] text-[var(--text-muted)]">Walang aktibidad pa.</p>
            )}
            {recentAudit.map((entry) => {
              const colors = ACTION_COLORS[entry.action] ?? ACTION_COLORS.LOGIN
              return (
                <div key={entry.id} className="px-[20px] py-[12px] flex items-start gap-[12px] hover:bg-[#FAFBFF] transition-colors">
                  <span className="px-[8px] py-[3px] rounded-full text-[10px] font-bold shrink-0 mt-[2px]" style={{ background: colors.bg, color: colors.text }}>
                    {colors.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[var(--text-primary)] truncate">{entry.targetName}</p>
                    <p className="text-[12px] text-[var(--text-muted)] truncate">{entry.actorName} · {entry.barangay}</p>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] shrink-0 mt-[2px]">{formatTime(entry.timestamp)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fraud Flags */}
        <div className="lg:col-span-2 bg-white rounded-[16px] shadow-sm overflow-hidden">
          <div className="px-[20px] py-[16px] border-b border-[#E2E8F0] flex items-center gap-[8px]">
            <Shield className="w-[18px] h-[18px] text-[var(--danger)]" />
            <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Aktibong Fraud Flags</h3>
          </div>
          {activeFlags.length === 0 ? (
            <div className="px-[20px] py-[32px] flex flex-col items-center text-center">
              <div className="w-[48px] h-[48px] rounded-full bg-[var(--success-light)] flex items-center justify-center mb-[12px]">
                <CheckCircle2 className="w-[24px] h-[24px] text-[var(--success)]" />
              </div>
              <p className="text-[14px] font-bold text-[var(--text-primary)]">Walang aktibong flag.</p>
              <p className="text-[12px] text-[var(--text-muted)] mt-[4px]">Ayos ang lahat.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0F3FA]">
              {activeFlags.map((flag) => (
                <div key={flag.id} className="px-[20px] py-[12px]">
                  <div className="flex items-start justify-between gap-[8px] mb-[6px]">
                    <span className="px-[8px] py-[3px] rounded-full text-[10px] font-bold bg-[var(--warning-light)] text-[var(--warning-amber)]">
                      {flag.type.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">{formatTime(flag.flaggedAt)}</span>
                  </div>
                  <p className="text-[12px] text-[var(--text-secondary)] mb-[8px] leading-snug">{flag.details}</p>
                  <button
                    onClick={() => resolveFraudFlag(flag.id)}
                    className="text-[12px] font-bold text-[var(--success)] bg-[var(--success-light)] px-[10px] py-[4px] rounded-full hover:opacity-80 transition-opacity"
                  >
                    Mark as Resolved
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Distribution overview bar chart */}
      {activeDist && Object.keys(claimsByBarangay).length > 0 && (
        <div className="bg-white rounded-[16px] shadow-sm p-[20px]">
          <h3 className="text-[15px] font-bold text-[var(--text-primary)] mb-[16px]">Distribusyon Overview — {activeDist.title}</h3>
          <div className="flex flex-col gap-[10px]">
            {Object.entries(claimsByBarangay).map(([barangay, count]) => {
              const pct = Math.round((count / activeDist.totalBeneficiaries) * 100)
              return (
                <div key={barangay}>
                  <div className="flex justify-between text-[12px] font-bold mb-[4px]">
                    <span className="text-[var(--text-primary)]">{barangay}</span>
                    <span className="text-[var(--success)]">{count} / {activeDist.totalBeneficiaries} ({pct}%)</span>
                  </div>
                  <div className="h-[8px] bg-[var(--surface-page)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--success)] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
