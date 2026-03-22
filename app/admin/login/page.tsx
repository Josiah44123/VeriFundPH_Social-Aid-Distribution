"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
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
        router.push("/admin/console")
      } else {
        setError(true)
        setTimeout(() => setError(false), 2000)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex flex-col">
      <LoadingOverlay isVisible={loading} />
      
      {/* Header */}
      <div className="bg-[var(--ph-red)] h-[64px] flex items-center justify-between px-4 shrink-0 shadow-sm relative z-10">
        <div className="flex items-center">
          <button onClick={() => router.push("/")} className="p-2 -ml-2 text-white transition-opacity active:opacity-50">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <span className="text-white font-bold ml-2 text-[18px]">Officer Login</span>
        </div>
      </div>

      <div className="flex-1 px-4 pt-12 flex flex-col max-w-md mx-auto w-full bg-white sm:shadow-sm sm:mt-4 sm:rounded-2xl sm:max-h-[600px] overflow-hidden">
        <div className="flex justify-center mb-6">
          <div className="w-[56px] h-[56px] bg-red-50 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-[var(--ph-red)]" />
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-[20px] font-bold text-center mb-2 text-[var(--text-primary)]">
            Officer Login
          </h1>
          <p className="text-[14px] text-[var(--text-muted)] text-center mb-8">
            Para sa mga awtorisadong barangay officer.
          </p>

          <div className="space-y-4 mb-2">
            <div>
              <label className="section-label mb-1.5 block">Email Address</label>
              <Input 
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="officer@stacruz.gov.ph"
                className="font-medium bg-[var(--surface)] focus:bg-white"
              />
            </div>
            
            <div>
              <label className="section-label mb-1.5 block">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="font-medium pr-12 bg-[var(--surface)] focus:bg-white"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--ph-red)] p-1 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="h-8 flex items-center justify-center mb-6">
            {error && (
              <span className="text-[13px] font-semibold text-[color:var(--ph-red)] animate-[shake_300ms_ease-in-out]">
                Mali ang email o password.
              </span>
            )}
          </div>

          <button 
            onClick={handleLogin}
            disabled={!email || !password}
            className="primary-btn w-full bg-[var(--ph-red)] text-white hover:bg-red-700 disabled:bg-red-300"
          >
            Mag-login
          </button>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">or portal access</span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          
          <button 
            onClick={() => router.push("/admin/portal")}
            className="mt-4 primary-btn w-full bg-[#1A2B5F] text-white hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
