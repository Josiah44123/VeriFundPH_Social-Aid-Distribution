"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserPlus, QrCode, List } from "lucide-react"
import { OFFICER, INITIAL_LISTAHAN } from "@/lib/data"
import { TabBar } from "@/components/TabBar"
import { RegisterTab } from "@/components/admin/RegisterTab"
import { VerifyTab } from "@/components/admin/VerifyTab"
import { ListahanTab } from "@/components/admin/ListahanTab"
import { AnimatePresence, motion } from "framer-motion"

export default function FieldConsole() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("verify")
  const [showLogout, setShowLogout] = useState(false)
  const [listahan, setListahan] = useState(INITIAL_LISTAHAN)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
  }

  const handleConfirmClaim = (resultData: any) => {
    const newItem = {
      name: resultData.name,
      initials: resultData.initials,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      method: "Cash on site",
      status: "NAKUHA",
      verifundId: "VF-2025-XXXX-STC" // Mocked generated ID for now
    }
    setListahan([newItem, ...listahan])
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      {/* Persistent Header */}
      <div className="bg-[var(--ph-red)] h-[64px] flex items-center justify-between px-[16px] shrink-0 relative z-20">
        <div className="flex items-center gap-[12px]">
          <div className="flex flex-col gap-[2px]">
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--danger-light)]" />
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--warning)]" />
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--success)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-[18px] leading-[1]">VeriFund</span>
            <span className="text-white/70 text-[11px] font-medium leading-[1] mt-[4px]">Field Console</span>
          </div>
        </div>
        
        <button 
          className="w-[36px] h-[36px] rounded-full bg-white text-[var(--ph-red)] border-[2px] border-[var(--ph-red)] font-bold text-[14px] flex items-center justify-center shadow-sm"
          onClick={() => setShowLogout(!showLogout)}
        >
          {OFFICER.initials}
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div className="absolute top-[64px] right-[16px] bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] py-[8px] z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-[16px] py-[8px] border-b border-[#E8ECF7] mb-[4px]">
              <p className="text-[13px] font-bold text-[var(--text-primary)]">{OFFICER.name}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{OFFICER.role}</p>
            </div>
            <button 
              className="w-full text-left px-[16px] py-[8px] text-[14px] text-[var(--danger)] font-bold flex items-center gap-[8px]"
              onClick={() => router.push("/")}
            >
              <LogOut className="w-[18px] h-[18px]" />
              Mag-logout
            </button>
          </div>
        )}
      </div>

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
              className="h-full"
            >
              {activeTab === "register" && <RegisterTab />}
              {activeTab === "verify" && <VerifyTab onConfirmClaim={handleConfirmClaim} />}
              {activeTab === "listahan" && <ListahanTab listahan={listahan} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <TabBar 
        colorScheme="red"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={[
          { id: "register", label: "I-Register", icon: UserPlus },
          { id: "verify", label: "I-Verify", icon: QrCode },
          { id: "listahan", label: "Listahan", icon: List }
        ]}
      />
    </div>
  )
}
