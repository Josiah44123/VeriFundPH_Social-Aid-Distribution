"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { QrCode, LayoutGrid, LogOut } from "lucide-react"
import { motion } from "framer-motion"

interface UserSession {
  name: string
  role: string
  barangay: string
  email: string
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
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Top App Bar */}
      <header className="sticky top-0 z-20 bg-surface/90 backdrop-blur-xl px-5 py-3 flex justify-between items-center border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="VeriFund" className="w-8 h-8 object-contain" />
          <span className="text-xl font-extrabold text-primary tracking-tight">VeriFund PH</span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-tertiary transition-colors">
          <LogOut className="w-4 h-4" /> Mag-logout
        </button>
      </header>

      {/* Hero Section */}
      <div className="header-gradient-blue mx-5 mt-5 rounded-2xl p-7 text-white relative overflow-hidden editorial-shadow">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-xl" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-1">{greeting()},</p>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">{user?.name}</h1>
          <p className="text-white/60 text-sm">{user?.barangay}</p>
          <span className="inline-flex items-center gap-1.5 mt-3 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-secondary-container" />
            Piliin ang Portal
          </span>
        </div>
      </div>

      <div className="px-5 mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Field Console Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/admin/console')}
          className="cursor-pointer bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden editorial-shadow"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <QrCode className="w-9 h-9 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Field Console</h2>
            <p className="text-white/75 text-sm leading-relaxed">I-register at i-verify ang mga benepisyaryo</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['I-Register', 'I-Verify', 'Listahan'].map(f => (
              <span key={f} className="px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full">{f}</span>
            ))}
          </div>
          <button className="w-full bg-white text-tertiary font-bold py-3 rounded-xl text-sm transition-all hover:shadow-md active:scale-[0.98]">
            Pumunta sa Field Console →
          </button>
        </motion.div>

        {/* Management Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/management/dashboard')}
          className="cursor-pointer bg-gradient-to-br from-primary to-primary-container rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden editorial-shadow"
        >
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center">
            <LayoutGrid className="w-9 h-9 text-secondary-container" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Management System</h2>
            <p className="text-white/75 text-sm leading-relaxed">Dashboard, benepisyaryo, distribusyon, audit log</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Dashboard', 'Benepisyaryo', 'Audit Log'].map(f => (
              <span key={f} className="px-3 py-1 bg-secondary-container/25 text-secondary-container text-xs font-bold rounded-full">{f}</span>
            ))}
          </div>
          <button className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 rounded-xl text-sm transition-all hover:shadow-md active:scale-[0.98]">
            Pumunta sa Management →
          </button>
        </motion.div>
      </div>
    </div>
  )
}
