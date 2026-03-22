"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <div className="w-[48px] h-[48px] border-[4px] border-[var(--red)] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div 
        className="h-[120px] flex items-start pt-[24px] px-[16px] shrink-0 relative z-0"
        style={{ background: 'linear-gradient(135deg, #FF0048 0%, #CC0039 100%)' }}
      >
        <button onClick={() => router.push("/")} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors relative z-20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-bold text-[18px] absolute w-full text-center left-0 top-[32px] pointer-events-none z-10">
          Officer Login
        </span>
      </div>

      <div className="flex-1 bg-white rounded-t-[24px] -mt-[24px] relative z-10 px-[20px] pb-[40px] flex flex-col items-center pt-[44px] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        {/* Floating Icon */}
        <div className="absolute -top-[32px] w-[64px] h-[64px] rounded-full bg-[var(--red)] border-[4px] border-white flex items-center justify-center shadow-[var(--shadow-md)]">
          {success ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 className="w-[32px] h-[32px] text-white" />
            </motion.div>
          ) : (
            <ShieldCheck className="w-[32px] h-[32px] text-white" />
          )}
        </div>

        <div className="w-full max-w-md flex flex-col">
          <h1 className="text-[20px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
            Para sa Barangay Officer
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-[32px]">
            I-enter ang iyong credentials.
          </p>

          <div 
            className="flex flex-col gap-[16px] mb-[16px]"
            style={shaking ? { animation: 'shake 300ms ease-in-out' } : undefined}
          >
            <div>
              <label className="section-label mb-[8px] block">Email Address</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@stacruZ.gov.ph"
                style={error ? { borderColor: 'var(--danger)', backgroundColor: 'var(--danger-light)' } : undefined}
                className="w-full text-left bg-[var(--surface-input)] text-[15px] px-[16px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none h-[52px] rounded-[14px] placeholder-[var(--text-muted)]"
              />
            </div>
            
            <div>
              <label className="section-label mb-[8px] block">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  style={error ? { borderColor: 'var(--danger)', backgroundColor: 'var(--danger-light)' } : undefined}
                  className="w-full text-left bg-[var(--surface-input)] text-[15px] px-[16px] pr-[48px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none h-[52px] rounded-[14px] placeholder-[var(--text-muted)]"
                />
                <button
                  type="button"
                  className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--red)] transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-[20px] h-[20px]" /> : <Eye className="w-[20px] h-[20px]" />}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[24px] flex items-center justify-center mb-[16px]">
            {error && (
              <span className="text-[13px] font-bold text-[var(--danger)]">
                Mali ang email o password.
              </span>
            )}
          </div>

          <motion.button 
            onClick={handleLogin}
            disabled={!email || !password || loading || success}
            whileTap={{ scale: 0.97 }}
            className="w-full h-[52px] rounded-[14px] text-[15px] font-bold tracking-[-0.2px] disabled:opacity-40 disabled:pointer-events-none bg-[var(--red)] text-white flex items-center justify-center shadow-[var(--shadow-sm)]"
          >
            Mag-login
          </motion.button>
        </div>
      </div>
    </div>
  )
}
