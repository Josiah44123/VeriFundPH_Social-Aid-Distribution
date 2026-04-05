"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { LoadingOverlay } from "@/components/LoadingOverlay"

import { OFFICER_CREDENTIALS } from "@/lib/constants"

const ADMIN_CRED = OFFICER_CREDENTIALS.find(c => c.role === "ADMIN")!

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
      if (email === ADMIN_CRED.email && password === ADMIN_CRED.password) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("verifund_user", JSON.stringify({
            name: ADMIN_CRED.name,
            role: ADMIN_CRED.role,
            barangay: ADMIN_CRED.barangay,
            email: ADMIN_CRED.email,
          }))
        }
        router.push("/management/dashboard")
      } else {
        setError(true)
        setTimeout(() => setError(false), 2500)
      }
    }, 900)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #001A5E 0%, #003f89 60%, #1a56ad 100%)', fontFamily: 'Manrope, sans-serif' }}>
      
      <LoadingOverlay isVisible={loading} />

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-secondary-container/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-[10%] w-64 h-64 bg-primary-fixed/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Login card */}
      <div className="w-full max-w-[420px] bg-surface-container-lowest rounded-3xl p-8 editorial-shadow z-10">
        
        {/* Logo header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="VeriFund" className="w-16 h-16 object-contain mb-4" />
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">VeriFund PH</h1>
          <span className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mt-1">Management System</span>
          <p className="text-sm text-on-surface-variant text-center mt-2">Para sa awtorisadong LGU administrator</p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="admin@lgu-qc.gov.ph"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-4 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline"
            style={{ border: '2px solid transparent' }}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-2">Password</label>
          <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-4 pr-12 bg-surface-container-low rounded-2xl outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline"
            style={{ border: '2px solid transparent' }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[calc(50%+10px)] -translate-y-1/2 text-outline hover:text-primary transition-colors">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Error */}
        {error && <div className="text-sm font-bold text-tertiary text-center mb-4 bg-tertiary/8 py-2 rounded-xl">
          Mali ang email o password.
        </div>}

        {/* Submit */}
        <button onClick={handleLogin} disabled={!email || !password}
          className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-extrabold text-base shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none">
          Mag-login
        </button>

        {/* Demo credentials */}
        <p className="text-center text-xs text-outline mt-5">
          Demo: <span className="font-mono font-bold text-on-surface-variant">admin@lgu-qc.gov.ph</span> / <span className="font-mono font-bold text-on-surface-variant">admin2025</span>
        </p>
      </div>
    </div>
  )
}
