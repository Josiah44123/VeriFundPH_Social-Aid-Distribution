"use client"

import { useVeriFundStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, CheckCircle2, Clock, AlertTriangle, Shield, PlusCircle, FileDown, AlertCircle } from "lucide-react"

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

const ROLE_BADGE: Record<string, { bg: string; text: string }> = {
  OFFICER: { bg: "#F3F4F6", text: "#4A5568" },
  ADMIN: { bg: "#0D1966", text: "#FFFFFF" },
  SYSTEM: { bg: "#7C3AED", text: "#FFFFFF" },
}

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-PH", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(new Date(iso))
  } catch { return iso }
}

export default function ManagementDashboard() {
  const router = useRouter()
  const { beneficiaries, claims, fraudFlags, auditLog, resolveFraudFlag } = useVeriFundStore()

  const nakuhaCount = claims.filter(c => c.status === "NAKUHA").length
  const activeCount = beneficiaries.filter(b => b.status === "ACTIVE").length
  const notClaimed = Math.max(0, activeCount - nakuhaCount)
  const activeFraudCount = fraudFlags.filter(f => !f.resolved).length
  const recentAudit = auditLog.slice(0, 10)
  const activeFlags = fraudFlags.filter(f => !f.resolved)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Magandang umaga"
    if (h < 18) return "Magandang hapon"
    return "Magandang gabi"
  }

  const today = new Intl.DateTimeFormat("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date())

  const METRIC_CARDS = [
    { label: "Kabuuang Benepisyaryo", value: beneficiaries.length, icon: Users, bg: "#EBF5FF", topGrad: "rgba(0,56,168,0.04)", color: "#0038A8", border: "#0038A8" },
    { label: "Nakuha Na", value: nakuhaCount, icon: CheckCircle2, bg: "#E8F5EE", topGrad: "rgba(0,200,83,0.04)", color: "#00C853", border: "#00C853" },
    { label: "Hindi pa Nakakuha", value: notClaimed, icon: Clock, bg: "#FEF3C7", topGrad: "rgba(255,183,0,0.04)", color: "#B45309", border: "#FFB800" },
    { label: "Fraud Flags", value: activeFraudCount, icon: AlertTriangle, bg: "#FDE8EB", topGrad: "rgba(255,0,72,0.04)", color: "#CE1126", border: "#FF0048", pulse: activeFraudCount > 0 },
  ]

  return (
    <div className="flex flex-col gap-[24px] max-w-[1240px]">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-extrabold text-[var(--text-primary)] tracking-tight">{greeting()}, Admin 👋</h1>
          <p className="text-[14px] font-medium text-[var(--text-muted)] mt-[4px]">{today}</p>
        </div>
        <div className="flex gap-[12px]">
          <button 
            onClick={() => router.push("/management/audit-log")}
            className="h-[44px] px-[20px] rounded-full bg-white border border-[#E8ECF7] text-[14px] font-bold text-[var(--text-primary)] shadow-sm hover:bg-[#F8FAFC] transition-colors flex items-center gap-[8px]"
          >
            <FileDown className="w-[18px] h-[18px] text-[var(--text-muted)]" />
            I-export
          </button>
          <button 
            onClick={() => router.push("/management/distributions")}
            className="h-[44px] px-[20px] rounded-full bg-[var(--red)] text-white text-[14px] font-bold shadow-sm hover:opacity-90 transition-opacity flex items-center gap-[8px]"
          >
            <PlusCircle className="w-[18px] h-[18px]" />
            Bagong Distribusyon
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px]">
        {METRIC_CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.label}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              className="bg-white rounded-[20px] p-[24px] shadow-[var(--shadow-md)] border border-[rgba(0,0,0,0.02)] relative overflow-hidden"
              style={{ background: `linear-gradient(to bottom, ${card.topGrad}, white)` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-r-full" style={{ background: card.border }} />
              
              <div className="flex items-center justify-between mb-[16px] relative z-10">
                <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon className="w-[26px] h-[26px]" style={{ color: card.color }} />
                </div>
                {card.pulse && (
                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--danger)] animate-pulse" />
                )}
              </div>
              <p className="text-[13px] text-[var(--text-muted)] font-bold mb-[4px] relative z-10">{card.label}</p>
              <p className="text-[40px] font-extrabold leading-none tracking-tight relative z-10" style={{ color: card.color }}>
                {card.value.toLocaleString()}
              </p>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px]">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[20px] shadow-[var(--shadow-md)] border border-[rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="px-[24px] py-[20px] border-b border-[#E8ECF7] flex items-center gap-[8px]">
            <div className="section-label-bar">Kamakailang Aktibidad</div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-[#F0F3FA] max-h-[400px]">
            {recentAudit.length === 0 && (
              <p className="p-[24px] text-[13px] text-[var(--text-muted)] text-center">Walang aktibidad pa.</p>
            )}
            {recentAudit.map((entry) => {
              const colors = ACTION_COLORS[entry.action] ?? ACTION_COLORS.LOGIN
              const role = ROLE_BADGE[entry.actorRole] ?? ROLE_BADGE.OFFICER
              return (
                <div key={entry.id} className="px-[24px] py-[16px] hover:bg-[#FAFBFF] transition-colors flex items-start gap-[12px]">
                  <div className="w-[36px] h-[36px] rounded-full bg-[var(--navy)] text-white font-bold text-[12px] flex items-center justify-center shrink-0 mt-[2px]">
                    {entry.actorName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[8px] mb-[4px] flex-wrap">
                      <span className="px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: colors.bg, color: colors.text }}>
                        {colors.label}
                      </span>
                      <span className="text-[13px] font-bold text-[var(--text-primary)]">{entry.actorName}</span>
                      <span className="px-[6px] py-[1px] rounded-[4px] text-[9px] font-bold uppercase" style={{ background: role.bg, color: role.text }}>
                        {entry.actorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <span className="font-mono text-[12px] font-bold text-[#FFB800]">{entry.targetId}</span>
                      <span className="text-[12px] text-[var(--text-muted)]">{entry.barangay}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] shrink-0 font-medium">{formatTime(entry.timestamp)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Fraud Flags */}
        <div className="bg-white rounded-[20px] shadow-[var(--shadow-md)] border border-[rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
          <div className="px-[24px] py-[20px] border-b border-[#E8ECF7] flex items-center gap-[8px]">
            <Shield className="w-[18px] h-[18px] text-[var(--danger)]" />
            <h3 className="text-[16px] font-bold text-[var(--text-primary)]">Aktibong Fraud Flags</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {activeFlags.length === 0 ? (
              <div className="p-[32px] flex flex-col items-center justify-center text-center h-full">
                <div className="w-[56px] h-[56px] rounded-full bg-[var(--success-light)] flex items-center justify-center mb-[16px]">
                  <CheckCircle2 className="w-[28px] h-[28px] text-[var(--success)]" />
                </div>
                <p className="text-[15px] font-bold text-[var(--success)]">Walang aktibong flag. Ayos ang lahat. ✓</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F0F3FA]">
                {activeFlags.map((flag) => {
                  const typeColors: Record<string, { bg: string; text: string }> = {
                    VELOCITY_ANOMALY: { bg: "#FDE8EB", text: "#CE1126" },
                    DUPLICATE_ID: { bg: "#FEF3C7", text: "#B45309" },
                    DUPLICATE_FACE: { bg: "#F3E8FF", text: "#7C3AED" },
                  }
                  const tc = typeColors[flag.type] ?? typeColors.VELOCITY_ANOMALY
                  return (
                    <div key={flag.id} className="p-[20px] hover:bg-[#FFF5F7] transition-colors group">
                      <div className="flex items-start justify-between gap-[8px] mb-[8px]">
                        <span className="px-[10px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-wide" style={{ background: tc.bg, color: tc.text }}>
                          {flag.type.replace(/_/g, " ")}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium shrink-0">{formatTime(flag.flaggedAt)}</span>
                      </div>
                      <p className="text-[13px] text-[var(--text-secondary)] font-medium mb-[12px] leading-snug">{flag.details}</p>
                      <button
                        onClick={() => resolveFraudFlag(flag.id)}
                        className="text-[12px] font-bold text-[var(--red)] border border-[var(--red)] px-[12px] py-[4px] rounded-[8px] hover:bg-[var(--red-light)] transition-colors"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
        {[
          { label: "Mag-create ng Distribusyon", icon: PlusCircle, bg: "rgba(255,0,72,0.06)", color: "var(--red)", href: "/management/distributions" },
          { label: "I-export ang Audit Log", icon: FileDown, bg: "rgba(24,38,155,0.06)", color: "var(--navy)", href: "/management/audit-log" },
          { label: "Tingnan ang Fraud Flags", icon: AlertCircle, bg: "rgba(255,183,0,0.06)", color: "#B45309", href: "/management/dashboard" },
        ].map(action => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(action.href)}
              className="bg-white rounded-[20px] p-[20px] shadow-[var(--shadow-sm)] border border-[rgba(0,0,0,0.02)] flex items-center gap-[16px] text-left transition-shadow hover:shadow-[var(--shadow-md)]"
              style={{ background: action.bg }}
            >
              <div className="w-[48px] h-[48px] rounded-[14px] bg-white flex items-center justify-center shadow-sm" style={{ color: action.color }}>
                <Icon className="w-[24px] h-[24px]" />
              </div>
              <span className="text-[14px] font-bold" style={{ color: action.color }}>{action.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
