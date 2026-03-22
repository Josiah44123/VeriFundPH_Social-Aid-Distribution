"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QrCode, LayoutGrid, LogOut, Star } from "lucide-react"
import { motion } from "framer-motion"

interface UserSession {
  name: string
  role: string
  barangay: string
  email: string
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.15 + Math.random() * 0.25,
            animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function PortalSelector() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("verifund_user")
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        router.push("/admin/login")
      }
    }
  }, [router])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("verifund_user")
    }
    router.push("/")
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return "Magandang umaga"
    if (h < 18) return "Magandang hapon"
    return "Magandang gabi"
  }

  if (!user) return null

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-[20px] py-[40px] relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0D1966 0%, #18269B 50%, #1E33B8 100%)' }}
    >
      <Particles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[720px]">
        {/* Logo */}
        <div className="flex items-center gap-[8px] mb-[8px]">
          <Star className="w-[22px] h-[22px] text-[#FFB800] fill-[#FFB800]" />
          <h1 className="text-[28px] font-extrabold text-white tracking-tight">VeriFund PH</h1>
        </div>
        <p className="text-[14px] text-white/60 mb-[24px]">Piliin ang inyong portal</p>

        {/* Officer Greeting */}
        <p className="text-[18px] font-semibold text-white mb-[4px]">{greeting()}, {user.name}</p>
        <p className="text-[13px] text-white/50 mb-[36px]">{user.barangay}</p>

        {/* Portal Cards */}
        <div className="flex flex-col md:flex-row gap-[16px] md:gap-[20px] w-full justify-center">
          {/* Field Console Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            whileHover={{ scale: 1.02, boxShadow: '0 24px 72px rgba(255,0,72,0.45)' }}
            onClick={() => router.push("/admin/console")}
            className="flex-1 max-w-[340px] rounded-[24px] p-[28px] cursor-pointer flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #FF0048, #CC0039)',
              boxShadow: '0 20px 60px rgba(255,0,72,0.35)',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            {/* Icon */}
            <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center mb-[20px]"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <QrCode className="w-[48px] h-[48px] text-white" />
            </div>

            <h2 className="text-[20px] font-bold text-white mb-[4px]">Field Console</h2>
            <p className="text-[13px] text-white/80 mb-[16px] leading-relaxed">
              I-register at i-verify ang mga benepisyaryo
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-[6px] mb-[20px]">
              {["I-Register", "I-Verify", "Listahan"].map(f => (
                <span key={f} className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Button */}
            <button className="w-full h-[52px] bg-white text-[var(--red)] font-bold rounded-[14px] text-[15px] mt-auto transition-all hover:shadow-lg active:scale-[0.97]">
              Pumunta sa Field Console →
            </button>
          </motion.div>

          {/* Management System Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.25 }}
            whileHover={{ scale: 1.02, boxShadow: '0 24px 72px rgba(24,38,155,0.5)' }}
            onClick={() => router.push("/management/dashboard")}
            className="flex-1 max-w-[340px] rounded-[24px] p-[28px] cursor-pointer flex flex-col"
            style={{
              background: 'linear-gradient(135deg, #18269B, #0D1966)',
              boxShadow: '0 20px 60px rgba(24,38,155,0.4)',
              transition: 'box-shadow 200ms ease, transform 200ms ease',
            }}
          >
            {/* Icon */}
            <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center mb-[20px]"
              style={{ background: 'rgba(255,183,0,0.2)' }}
            >
              <LayoutGrid className="w-[48px] h-[48px] text-[#FFB800]" />
            </div>

            <h2 className="text-[20px] font-bold text-white mb-[4px]">Management System</h2>
            <p className="text-[13px] text-white/80 mb-[16px] leading-relaxed">
              Dashboard, benepisyaryo, distribusyon, audit log
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-[6px] mb-[20px]">
              {["Dashboard", "Benepisyaryo", "Audit Log"].map(f => (
                <span key={f} className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-[#FFB800]" style={{ background: 'rgba(255,183,0,0.25)' }}>
                  {f}
                </span>
              ))}
            </div>

            {/* Button */}
            <button className="w-full h-[52px] bg-[#FFB800] text-[#0D1966] font-bold rounded-[14px] text-[15px] mt-auto transition-all hover:shadow-lg active:scale-[0.97]">
              Pumunta sa Management →
            </button>
          </motion.div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-[6px] text-[13px] text-white/50 hover:text-white/80 transition-colors mt-[32px]"
        >
          <LogOut className="w-[14px] h-[14px]" />
          Mag-logout
        </button>
      </div>
    </div>
  )
}
