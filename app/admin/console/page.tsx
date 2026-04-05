"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserPlus, QrCode, List, ArrowLeft } from "lucide-react"
import { RegisterTab } from "@/components/admin/RegisterTab"
import { VerifyTab } from "@/components/admin/VerifyTab"
import { ListahanTab } from "@/components/admin/ListahanTab"
import { AnimatePresence, motion } from "framer-motion"

export default function FieldConsole() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("register")
  const [showLogout, setShowLogout] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const [officer, setOfficer] = useState({ name: "Officer", initials: "OF" })

  useEffect(() => {
    setIsMounted(true)
    try {
      const stored = sessionStorage.getItem("verifund_user")
      if (stored) {
        const u = JSON.parse(stored)
        const initials = u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        setOfficer({ name: u.name, initials })
      } else {
        setOfficer({ name: "Josefa Reyes", initials: "JR" })
      }
    } catch {
      setOfficer({ name: "Josefa Reyes", initials: "JR" })
    }
    // DO NOT set activeTab here — it should only change when user taps a tab
  }, [])

  if (!isMounted) {
    return null // Prevent entire tree from hydration mismatching
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      <header className="h-[60px] flex items-center justify-between px-4 shrink-0 bg-surface-container-lowest border-b border-outline-variant/20"
        style={{ fontFamily: 'Manrope, sans-serif' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/admin/portal-selector')} className="p-1.5 text-on-surface-variant hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="VeriFund" className="w-7 h-7 object-contain" />
          <div>
            <span className="text-base font-bold text-primary">VeriFund</span>
            <span className="text-xs text-on-surface-variant block -mt-0.5">Field Console</span>
          </div>
        </div>

        <button
          className="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary font-bold text-sm flex items-center justify-center"
          onClick={() => setShowLogout(!showLogout)}>
          {officer.initials}
        </button>

        {/* Logout dropdown */}
        {showLogout && (
          <div className="absolute top-[60px] right-4 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(25,27,33,0.12)] py-2 z-50 min-w-[180px]">
            <div className="px-4 py-3 border-b border-outline-variant/20">
              <p className="text-sm font-bold text-on-surface">{officer.name}</p>
              <p className="text-xs text-on-surface-variant">Barangay Officer</p>
            </div>
            <button className="w-full text-left px-4 py-3 text-sm text-tertiary font-bold flex items-center gap-2 hover:bg-tertiary/5 transition-colors"
              onClick={() => { sessionStorage.removeItem('verifund_user'); router.push('/'); }}>
              <LogOut className="w-4 h-4" /> Mag-logout
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-lg mx-auto overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-[calc(80px+env(safe-area-inset-bottom))]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {activeTab === "register" && <RegisterTab />}
              {activeTab === "verify" && <VerifyTab />}
              {activeTab === "listahan" && <ListahanTab onSwitchToVerify={() => setActiveTab("verify")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-0.5 px-1.5 py-1.5 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(25,27,33,0.12)] rounded-full border border-outline-variant/20 w-[max-content] max-w-[94vw] overflow-x-auto no-scrollbar" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {[
          { id: 'register', label: 'I-Register', icon: UserPlus },
          { id: 'verify', label: 'I-Verify', icon: QrCode },
          { id: 'listahan', label: 'Listahan', icon: List },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 transition-all rounded-full font-semibold text-sm shrink-0 whitespace-nowrap ${
              activeTab === id
                ? 'bg-tertiary text-white shadow-md shadow-tertiary/20'
                : 'text-on-surface-variant hover:text-tertiary opacity-70'
            }`}>
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
