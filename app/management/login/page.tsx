"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Building2 } from "lucide-react"
import { LoadingOverlay } from "@/components/LoadingOverlay"

const CREDENTIALS = { email: "admin@lgu-qc.gov.ph", password: "admin2025" }

export default function ManagementLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleLogin = () => {
    if (!email || !password) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
        if (typeof window !== "undefined") sessionStorage.setItem("mgmt_auth", "1")
        router.push("/management/dashboard")
      } else {
        setError(true)
        setTimeout(() => setError(false), 2500)
      }
    }, 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-[16px]" style={{ background: 'linear-gradient(160deg, #001A5E 0%, #0038A8 100%)' }}>
      <LoadingOverlay isVisible={loading} />

      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-[40px]">
          <div className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-[16px] shadow-lg" style={{ background: 'rgba(252,209,22,0.15)', border: '1.5px solid rgba(252,209,22,0.3)' }}>
            <Building2 className="w-[36px] h-[36px] text-[var(--ph-gold)]" />
          </div>
          <h1 className="text-[28px] font-extrabold text-white leading-tight text-center">VeriFund PH</h1>
          <p className="text-[var(--ph-gold)] text-[13px] font-bold uppercase tracking-widest mt-[4px]">
            Management System
          </p>
          <p className="text-white/50 text-[13px] mt-[8px] text-center">
            Para sa awtorisadong LGU administrator
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] p-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="space-y-[16px] mb-[20px]">
            <div>
              <label className="section-label mb-[6px] block">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="admin@lgu-qc.gov.ph"
                onKeyDown={(e: any) => e.key === "Enter" && handleLogin()}
                className="w-full h-[52px] rounded-[12px] bg-[var(--surface-page)] px-[16px] text-[15px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none transition-colors focus:border-[var(--ph-blue-deeper)] focus:bg-white"
              />
            </div>
            <div>
              <label className="section-label mb-[6px] block">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e: any) => e.key === "Enter" && handleLogin()}
                  className="w-full h-[52px] rounded-[12px] bg-[var(--surface-page)] px-[16px] pr-[48px] text-[15px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none transition-colors focus:border-[var(--ph-blue-deeper)] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[20px] flex items-center justify-center mb-[16px]">
            {error && (
              <span className="text-[13px] font-bold text-[var(--danger)] animate-in fade-in">
                Mali ang email o password.
              </span>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={!email || !password}
            className="w-full h-[52px] rounded-[14px] text-white font-bold text-[15px] transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg"
            style={{ background: 'linear-gradient(135deg, #001A5E, #0038A8)' }}
          >
            Mag-login
          </button>

          <div className="mt-[16px] text-center">
            <p className="text-[12px] text-[var(--text-muted)]">
              Demo: <span className="font-mono font-bold text-[var(--text-secondary)]">admin@lgu-qc.gov.ph</span> / <span className="font-mono font-bold text-[var(--text-secondary)]">admin2025</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
