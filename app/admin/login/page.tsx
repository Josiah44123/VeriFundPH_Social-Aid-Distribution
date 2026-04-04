"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

import { OFFICER_CREDENTIALS } from "@/lib/constants"

const USERS = OFFICER_CREDENTIALS

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleLogin = () => {
    if (!email || !password) return
    
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
      
      if (user) {
        // Store user info in sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("verifund_user", JSON.stringify({
            name: user.name,
            role: user.role,
            barangay: user.barangay,
            email: user.email,
          }))
        }
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/portal-selector")
        }, 500)
      } else {
        setError(true)
        setShaking(true)
        setTimeout(() => { setError(false); setShaking(false) }, 2000)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-container" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[5%] w-[40%] h-[40%] bg-tertiary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-[5%] w-[30%] h-[30%] bg-tertiary/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-[1100px] grid md:grid-cols-5 overflow-hidden rounded-2xl editorial-shadow border border-outline-variant/20">
        <div className="header-gradient-red p-8 md:p-12 flex flex-col justify-between relative overflow-hidden text-white md:col-span-2">
          {/* Top decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

          {/* Logo in white box */}
          <div className="relative z-10">
            <div className="bg-white/95 p-3 rounded-xl shadow-lg inline-block mb-8 cursor-pointer" onClick={() => router.push('/')}>
              <img src="/logo.png" alt="VeriFund" className="h-12 w-auto" />
            </div>
            <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4">
              Officer Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-tight mb-4">
              Secured Authority Interface
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              Authorized access for VeriFund verification officers.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-white/70 mt-8 md:mt-0">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Compliance-Grade Access</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-12 flex flex-col justify-center md:col-span-3">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-2xl font-bold text-on-surface tracking-tight mb-1">Welcome, Officer</h2>
            <p className="text-on-surface-variant font-medium mb-8">I-authenticate ang iyong session para magpatuloy.</p>

            <div style={shaking ? { animation: 'shake 300ms ease-in-out' } : undefined}>
              {/* Error state */}
              {error && <div className="bg-tertiary/10 text-tertiary text-sm font-bold p-3 rounded-xl mb-4 text-center">
                Mali ang email o password.
              </div>}

              {/* Email field */}
              <div className="mb-5">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="officer@stacruz.gov.ph"
                  className="w-full px-5 py-4 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-tertiary/20 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline outline-none"
                  style={{ border: '2px solid transparent', ...(error ? { borderColor: 'var(--tertiary)' } : {}) }}
                />
              </div>

              {/* Password field */}
              <div className="mb-7 relative">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Password</label>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="w-full px-5 py-4 pr-12 bg-surface-container-low rounded-xl focus:ring-2 focus:ring-tertiary/20 focus:bg-surface-container-lowest transition-all text-on-surface font-medium placeholder:text-outline outline-none"
                  style={{ border: '2px solid transparent', ...(error ? { borderColor: 'var(--tertiary)' } : {}) }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[calc(50%+8px)] -translate-y-1/2 text-outline hover:text-tertiary transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <motion.button
              onClick={handleLogin}
              disabled={!email || !password || loading || success}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-tertiary text-white py-4 rounded-full font-extrabold text-base flex items-center justify-center gap-2 hover:bg-tertiary/90 hover:shadow-xl hover:shadow-tertiary/20 active:scale-[0.98] transition-all shadow-lg disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading || success ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Mag-login'}
              {!(loading || success) && <ChevronRight className="w-5 h-5" />}
            </motion.button>

            {/* Footer help */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30 text-xs text-outline text-center">
              Demo: officer@stacruz.gov.ph / verifund2025
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
