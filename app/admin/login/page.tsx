"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { OFFICER } from "@/lib/data"

export default function AdminLogin() {
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
      if (email === OFFICER.email && password === OFFICER.password) {
        router.push("/admin/selection")
      } else {
        setError(true)
        setTimeout(() => setError(false), 2000)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      <LoadingOverlay isVisible={loading} />
      
      {/* Header */}
      <div 
        className="h-[120px] flex items-start pt-[24px] px-[16px] shrink-0 relative z-0"
        style={{ background: 'linear-gradient(135deg, #CE1126, #E8354A)' }}
      >
        <button onClick={() => router.push("/")} className="p-2 -ml-2 text-white relative z-20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-bold text-[18px] absolute w-full text-center left-0 top-[32px] pointer-events-none z-10">
          Officer Login
        </span>
      </div>

      <div className="flex-1 bg-white rounded-t-[24px] -mt-[20px] relative z-10 px-[16px] flex flex-col items-center pt-[32px] shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <div className="absolute -top-[32px] w-[64px] h-[64px] rounded-full bg-[var(--ph-red)] border-[4px] border-white flex items-center justify-center shadow-sm">
          <ShieldCheck className="w-[32px] h-[32px] text-white" />
        </div>

        <div className="w-full max-w-md mt-[16px] flex flex-col">
          <h1 className="text-[18px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
            Officer Login
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-[32px]">
            Para sa mga awtorisadong barangay officer.
          </p>

          <div className="space-y-[16px] mb-[8px]">
            <div>
              <label className="section-label mb-[6px] block">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="officer@stacruz.gov.ph"
                className="w-full text-left bg-[var(--surface-page)] text-[15px] px-[16px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none transition-colors h-[52px] rounded-[12px] focus:border-[var(--ph-red)] focus:bg-white"
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
                  className="w-full text-left bg-[var(--surface-page)] text-[15px] px-[16px] pr-[48px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none transition-colors h-[52px] rounded-[12px] focus:border-[var(--ph-red)] focus:bg-white"
                />
                <button
                  type="button"
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--ph-red)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[24px] flex items-center justify-center mb-[24px]">
            {error && (
              <span className="text-[13px] font-bold text-[var(--danger)] animate-[shake_300ms_ease-in-out]">
                Mali ang email o password.
              </span>
            )}
          </div>

          <button 
            onClick={handleLogin}
            disabled={!email || !password}
            className="danger-btn w-full"
          >
            Mag-login
          </button>
        </div>
      </div>
    </div>
  )
}
