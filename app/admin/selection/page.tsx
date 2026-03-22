"use client"

import { useRouter } from "next/navigation"
import { LayoutDashboard, Tablet, ShieldCheck, ArrowRight, LogOut } from "lucide-react"
import { OFFICER } from "@/lib/data"
import { useState } from "react"
import { LoadingOverlay } from "@/components/LoadingOverlay"

export default function AdminSelection() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const navigateTo = (path: string) => {
    setLoading(true)
    setTimeout(() => {
      router.push(path)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col items-center p-6 sm:p-12 relative overflow-hidden">
      <LoadingOverlay isVisible={loading} />
      
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[var(--ph-blue)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--ph-red)] opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Header Area */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--ph-red)] flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-bold text-[var(--text-primary)] leading-tight">VeriFund PH</h1>
            <p className="text-[12px] text-[var(--text-muted)] font-medium">Officer Gateway</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-[var(--text-primary)]">{OFFICER.name}</p>
            <p className="text-[11px] text-[var(--text-muted)] font-medium">{OFFICER.role}</p>
          </div>
          <button 
            onClick={() => router.push("/admin/login")}
            className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[var(--danger)] shadow-sm hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col items-center relative z-10 flex-1 justify-center -mt-12">
        <div className="text-center mb-12">
          <h2 className="text-[32px] sm:text-[40px] font-black text-[var(--text-primary)] mb-3 tracking-tight">
            Welcome back, <span className="text-[var(--ph-red)]">Officer</span>.
          </h2>
          <p className="text-[16px] text-[var(--text-muted)] max-w-md mx-auto">
            Piliin ang system na nais mong i-access para sa iyong mga gagawing operasyon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* Card 1: Field Console */}
          <button 
            onClick={() => navigateTo("/admin/console")}
            className="group relative bg-white rounded-[24px] p-8 text-left border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity">
              <Tablet className="w-32 h-32 text-[var(--ph-red)]" />
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[var(--ph-red)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Tablet className="w-7 h-7" />
            </div>

            <h3 className="text-[22px] font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--ph-red)] transition-colors">
              Field Console
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mb-8 leading-relaxed">
              Gamitin para sa on-the-ground registration, claims verification, at pamamahala ng aid distribution.
            </p>

            <div className="flex items-center gap-2 text-[14px] font-bold text-[var(--ph-red)]">
              <span>Buksan ang Console</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Management System */}
          <button 
            onClick={() => navigateTo("/management/dashboard")}
            className="group relative bg-[#1A2B5F] rounded-[24px] p-8 text-left shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(26,43,95,0.2)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.1] group-hover:opacity-[0.15] transition-opacity">
              <LayoutDashboard className="w-32 h-32 text-white" />
            </div>
            
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <LayoutDashboard className="w-7 h-7" />
            </div>

            <h3 className="text-[22px] font-bold text-white mb-2">
              Management System
            </h3>
            <p className="text-[14px] text-white/70 mb-8 leading-relaxed">
              I-monitor ang kabuuang datos, mag-audit ng mga transaksyon, at pamahalaan ang mga listahan ng benepisyaryo.
            </p>

            <div className="flex items-center gap-2 text-[14px] font-bold text-white">
              <span>Buksan ang Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mt-12 text-center relative z-10">
        <p className="text-[12px] text-[var(--text-muted)]">
          VeriFund Social Aid Distribution Platform &copy; 2026. Lahat ng karapatan ay rezebado.
        </p>
      </div>
    </div>
  )
}
