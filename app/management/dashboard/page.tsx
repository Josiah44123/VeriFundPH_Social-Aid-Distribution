"use client"

import { useVeriFundStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, CheckCircle2, Clock, AlertTriangle, Shield, PlusCircle, FileDown, AlertCircle, BarChart3 } from "lucide-react"


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



  return (
    <div className="flex flex-col gap-6 max-w-[1300px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Welcome header */}
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">{greeting()}, Admin</h1>
          <p className="text-sm text-outline font-medium mt-1">{today}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/management/audit-log')}
            className="h-11 px-5 rounded-full bg-surface-container-low border border-outline-variant/30 text-on-surface font-bold text-sm flex items-center gap-2 hover:bg-white transition-all">
            <FileDown className="w-4 h-4 text-outline" /> I-export
          </button>
          <button onClick={() => router.push('/management/distributions')}
            className="h-11 px-5 rounded-full bg-gradient-to-r from-tertiary to-tertiary-container text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-tertiary/20 hover:opacity-90 transition-all">
            <PlusCircle className="w-4 h-4" /> Bagong Distribusyon
          </button>
        </div>
      </div>

      {/* 4 Metric Cards — premium styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Beneficiaries — navy blue */}
        <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-2xl text-white shadow-xl shadow-primary/20 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-bold">Kabuuang Benepisyaryo</p>
            <h3 className="text-4xl font-black tracking-tight mt-1">{beneficiaries.length.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 2: Nakuha Na — bright blue */}
        <div className="bg-gradient-to-br from-[#1a56ad] to-[#2563eb] p-6 rounded-2xl text-white shadow-xl shadow-blue-600/20 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-bold">Nakuha Na</p>
            <h3 className="text-4xl font-black tracking-tight mt-1">{nakuhaCount.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 3: Hindi pa Nakakuha — gold/amber */}
        <div className="bg-gradient-to-br from-secondary to-[#b88000] p-6 rounded-2xl text-white shadow-xl shadow-yellow-800/20 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-bold">Hindi pa Nakakuha</p>
            <h3 className="text-4xl font-black tracking-tight mt-1">{notClaimed.toLocaleString()}</h3>
          </div>
        </div>

        {/* Card 4: Fraud Flags — red */}
        <div className="bg-gradient-to-br from-tertiary to-tertiary-container p-6 rounded-2xl text-white shadow-xl shadow-tertiary/20 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-lg" />
          <div className="flex justify-between items-start relative z-10">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            {activeFraudCount > 0 && (
              <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">High Risk</span>
            )}
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/80 font-bold">Fraud Flags</p>
            <h3 className="text-4xl font-black tracking-tight mt-1">{activeFraudCount}</h3>
          </div>
        </div>
      </div>

      {/* Horizontal Progress Bar replacing the huge chart */}
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-extrabold text-primary uppercase tracking-tight">OVERALL CLAIM PROGRESS</h3>
          </div>
          <p className="text-xs font-bold text-outline">
            {nakuhaCount} / {activeCount} Claimed
          </p>
        </div>
        
        <div className="w-full h-3 rounded-full flex overflow-hidden bg-secondary shadow-inner">
          <div className="bg-[#1a56ad] h-full transition-all duration-500" 
            style={{ width: `${activeCount > 0 ? (nakuhaCount / activeCount) * 100 : 0}%` }} />
        </div>
        
        <div className="flex gap-4 text-[11px] font-bold">
          <div className="flex items-center gap-1.5 text-[#1a56ad]">
            <div className="w-2 h-2 rounded-full bg-[#1a56ad]" /> Nakuha Na ({activeCount > 0 ? Math.round((nakuhaCount/activeCount)*100) : 0}%)
          </div>
          <div className="flex items-center gap-1.5 text-secondary">
            <div className="w-2 h-2 rounded-full bg-secondary" /> Hindi pa ({activeCount > 0 ? Math.round((notClaimed/activeCount)*100) : 0}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-primary uppercase tracking-tight">Kamakailang Aktibidad</h3>
            <button onClick={() => router.push('/management/audit-log')}
              className="text-primary text-sm font-bold hover:underline underline-offset-2">Tingnan Lahat</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-outline text-[10px] font-black uppercase tracking-[0.15em] border-b border-surface-container-low">
                  <th className="px-6 py-4">Benepisyaryo</th>
                  <th className="px-6 py-4">Aksyon</th>
                  <th className="px-6 py-4">Target</th>
                  <th className="px-6 py-4">Barangay</th>
                  <th className="px-6 py-4">Oras</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {recentAudit.map((entry, idx) => {
                  const cfg = ACTION_COLORS[entry.action] ?? ACTION_COLORS.LOGIN;
                  return (
                    <tr key={entry.id} className={`hover:bg-surface-container-low/50 transition-colors ${idx % 2 === 1 ? 'bg-surface-container-low/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-xs flex items-center justify-center">
                            {entry.actorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary leading-none">{entry.actorName}</p>
                            <p className="text-xs text-outline font-medium">{entry.actorRole}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase"
                          style={{ background: cfg.bg, color: cfg.text }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{entry.targetName}</p>
                        <p className="font-mono text-xs text-secondary font-bold">{entry.targetId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">{entry.barangay}</td>
                      <td className="px-6 py-4 text-xs text-outline font-medium">{formatTime(entry.timestamp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fraud Flags */}
        <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
          {/* Header with red accent */}
          <div className="bg-gradient-to-r from-tertiary to-tertiary-container px-5 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              <h3 className="text-sm font-extrabold text-white uppercase tracking-tight">Fraud Flags</h3>
            </div>
            {activeFraudCount > 0 && (
              <span className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {activeFraudCount} ALERT
              </span>
            )}
          </div>

          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
            {activeFlags.length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-emerald-600">Wala! Ayos ang lahat.</p>
              </div>
            ) : activeFlags.map(flag => (
              <div key={flag.id} className="bg-tertiary/5 rounded-xl p-4 border border-tertiary/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-black text-tertiary uppercase">{flag.type.replace(/_/g,' ')}</span>
                  <span className="text-[10px] text-outline">{formatTime(flag.flaggedAt)}</span>
                </div>
                <p className="text-sm font-bold text-on-surface mb-1">{flag.beneficiaryId}</p>
                <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">{flag.details}</p>
                <button onClick={() => resolveFraudFlag(flag.id)}
                  className="text-xs font-bold text-tertiary border border-tertiary/30 px-3 py-1.5 rounded-lg hover:bg-tertiary/5 transition-all">
                  Mark as Resolved
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Component */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.button onClick={() => router.push('/management/distributions')}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-tertiary/10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Mag-create ng Distribusyon</span>
        </motion.button>

        <motion.button onClick={() => router.push('/management/audit-log')}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-primary/10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <FileDown className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold text-white">I-export ang Audit Log</span>
        </motion.button>

        <motion.button onClick={() => router.push('/management/dashboard')}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-br from-secondary to-[#b88000] rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-yellow-800/10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-bold text-white">Tingnan ang Fraud Flags</span>
        </motion.button>
      </div>
    </div>
  )
}
