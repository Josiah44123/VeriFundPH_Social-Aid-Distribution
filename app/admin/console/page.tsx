"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserPlus, QrCode, List } from "lucide-react"
import { OFFICER, INITIAL_LISTAHAN } from "@/lib/data"
import { TabBar } from "@/components/TabBar"
import { RegisterTab } from "@/components/admin/RegisterTab"
import { VerifyTab } from "@/components/admin/VerifyTab"
import { ListahanTab } from "@/components/admin/ListahanTab"

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
    <div className="min-h-screen bg-[var(--surface)] flex flex-col">
      {/* Persistent Header */}
      <div className="bg-[var(--ph-red)] h-[68px] flex items-center justify-between px-4 shrink-0 relative z-20">
        <div className="flex flex-col">
          <span className="text-white font-bold text-[18px] leading-tight mt-1">VeriFund</span>
          <span className="text-white/70 text-[11px] font-medium leading-tight">Field Console</span>
        </div>
        
        <button 
          className="w-9 h-9 rounded-full bg-white text-[var(--ph-red)] font-bold text-[13px] flex items-center justify-center shadow-sm"
          onClick={() => setShowLogout(!showLogout)}
        >
          {OFFICER.initials}
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div className="absolute top-[64px] right-4 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2 border-b border-gray-100 mb-1">
              <p className="text-[13px] font-bold text-[var(--text-primary)]">{OFFICER.name}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{OFFICER.role}</p>
            </div>
            <button 
              className="w-full text-left px-4 py-2 text-sm text-[var(--ph-red)] font-semibold flex items-center gap-2"
              onClick={() => router.push("/")}
            >
              <LogOut className="w-4 h-4" />
              Mag-logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-lg mx-auto overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden p-4 pb-32">
          {activeTab === "register" && <RegisterTab />}
          {activeTab === "verify" && <VerifyTab onConfirmClaim={handleConfirmClaim} />}
          {activeTab === "listahan" && <ListahanTab listahan={listahan} />}
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
