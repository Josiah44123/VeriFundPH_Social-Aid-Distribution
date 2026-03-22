"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserPlus, QrCode, List, ArrowLeft } from "lucide-react"
import { TabBar } from "@/components/TabBar"
import { RegisterTab } from "@/components/admin/RegisterTab"
import { VerifyTab } from "@/components/admin/VerifyTab"
import { ListahanTab } from "@/components/admin/ListahanTab"
import { AnimatePresence, motion } from "framer-motion"

export default function FieldConsole() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("register")
  const [showLogout, setShowLogout] = useState(false)

  // Read officer name from session
  const getOfficer = () => {
    if (typeof window === "undefined") return { name: "Officer", initials: "OF" }
    try {
      const stored = sessionStorage.getItem("verifund_user")
      if (stored) {
        const u = JSON.parse(stored)
        const initials = u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        return { name: u.name, initials }
      }
    } catch {}
    return { name: "Josefa Reyes", initials: "JR" }
  }

  const officer = getOfficer()

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      {/* Persistent Header */}
      <div 
        className="h-[64px] flex items-center justify-between px-[16px] shrink-0 relative z-20"
        style={{ background: 'linear-gradient(135deg, #FF0048, #CC0039)' }}
      >
        <div className="flex items-center gap-[12px]">
          <button 
            onClick={() => router.push("/admin/portal-selector")}
            className="p-1 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-white font-bold text-[18px] leading-[1]">VeriFund</span>
            <span className="text-white/70 text-[11px] font-medium leading-[1] mt-[4px]">Field Console</span>
          </div>
        </div>
        
        <button 
          className="w-[36px] h-[36px] rounded-full bg-white text-[var(--red)] font-bold text-[14px] flex items-center justify-center shadow-sm"
          onClick={() => setShowLogout(!showLogout)}
        >
          {officer.initials}
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div className="absolute top-[64px] right-[16px] bg-white rounded-[12px] shadow-[var(--shadow-lg)] py-[8px] z-50" style={{ animation: 'fade-in-up 200ms ease-out' }}>
            <div className="px-[16px] py-[8px] border-b border-[#E8ECF7] mb-[4px]">
              <p className="text-[13px] font-bold text-[var(--text-primary)]">{officer.name}</p>
              <p className="text-[11px] text-[var(--text-muted)]">Barangay Officer</p>
            </div>
            <button 
              className="w-full text-left px-[16px] py-[8px] text-[14px] text-[var(--danger)] font-bold flex items-center gap-[8px] hover:bg-[var(--red-light)] transition-colors"
              onClick={() => {
                if (typeof window !== "undefined") sessionStorage.removeItem("verifund_user")
                router.push("/")
              }}
            >
              <LogOut className="w-[18px] h-[18px]" />
              Mag-logout
            </button>
          </div>
        )}
      </div>

      {/* Red gradient bleed into content */}
      <div className="h-[24px] -mt-[1px]" style={{ background: 'linear-gradient(to bottom, rgba(255,0,72,0.06), transparent)' }} />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-lg mx-auto overflow-hidden relative -mt-[8px]">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden pb-[calc(80px+env(safe-area-inset-bottom))]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {activeTab === "register" && <RegisterTab />}
              {activeTab === "verify" && <VerifyTab />}
              {activeTab === "listahan" && <ListahanTab onSwitchToVerify={() => setActiveTab("verify")} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <TabBar 
        colorScheme="red"
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          { id: "register", label: "I-Register", icon: UserPlus },
          { id: "verify", label: "I-Verify", icon: QrCode },
          { id: "listahan", label: "Listahan", icon: List }
        ]}
      />
    </div>
  )
}
