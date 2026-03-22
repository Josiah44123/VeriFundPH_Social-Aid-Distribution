"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, MapPin, LogOut, Home, Download } from "lucide-react"
import { CITIZEN, DISTRIBUTIONS } from "@/lib/data"
import { QRCode } from "@/components/QRCode"
import { TabBar } from "@/components/TabBar"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } }
}

export default function CitizenDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [showLogout, setShowLogout] = useState(false)

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (id === "logout") {
      router.push("/")
    }
  }

  const upcomingDist = DISTRIBUTIONS.find(d => d.status === "DARATING")

  const handleDownload = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement
    if (!canvas) return
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `VeriFund-QR-${CITIZEN.verifundId}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col pb-[calc(80px+env(safe-area-inset-bottom))]">
      {/* Header */}
      <div 
        className="h-[80px] flex items-center justify-between px-[16px] shrink-0 relative z-20"
        style={{ background: 'linear-gradient(135deg, #0038A8, #185ADB)' }}
      >
        <span className="text-white font-bold text-[18px]">VeriFund</span>
        <button 
          className="w-[36px] h-[36px] rounded-full bg-[var(--ph-gold)] border-[2px] border-white text-[var(--text-primary)] font-bold text-[14px] flex items-center justify-center shadow-sm"
          onClick={() => setShowLogout(!showLogout)}
        >
          {CITIZEN.photoInitials}
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div className="absolute top-[70px] right-[16px] bg-white rounded-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.1)] py-[8px] z-50 animate-in fade-in slide-in-from-top-2">
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

      <motion.div 
        className="flex-1 overflow-y-auto max-w-md mx-auto w-full pt-[16px] px-[16px] flex flex-col gap-[24px]"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Profile Card */}
        <motion.div variants={cardVariants} className="bg-white rounded-[20px] p-[20px] shadow-sm flex flex-col w-full">
          <div className="flex gap-[16px] items-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[var(--ph-blue)] text-white font-bold text-[20px] flex items-center justify-center shrink-0">
              {CITIZEN.photoInitials}
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-bold text-[var(--text-primary)] leading-tight">{CITIZEN.name}</h2>
              <div className="font-mono text-[var(--ph-gold)] text-[13px] font-bold mt-[2px]">
                {CITIZEN.verifundId}
              </div>
            </div>
          </div>
          
          <div className="h-[1px] bg-[#E8ECF7] w-full my-[16px]" />
          
          <div className="flex items-center gap-[8px]">
            <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-[var(--success-light)] text-[var(--success)] text-[11px] font-bold">
              <div className="w-[6px] h-[6px] rounded-full bg-[var(--success)]" />
              AKTIBO
            </div>
            <div className="inline-flex items-center gap-[4px] px-[10px] py-[4px] rounded-full bg-[var(--info-light)] text-[var(--ph-blue)] text-[11px] font-bold truncate max-w-[200px]">
              <MapPin className="w-[12px] h-[12px] shrink-0" />
              {CITIZEN.barangay}
            </div>
          </div>
        </motion.div>

        {/* QR Code Card */}
        <motion.div variants={cardVariants} className="bg-white rounded-[20px] p-[24px] shadow-sm flex flex-col items-center w-full">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-[4px]">Iyong QR Code</h3>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-[20px]">
            Ipakita ito sa officer para makatanggap ng ayuda.
          </p>
          
          <div className="p-[12px] rounded-[16px] bg-white border border-[#E8ECF7] shadow-sm mb-[16px]">
            <QRCode value={CITIZEN.verifundId} id="qr-code" size={180} />
          </div>
          
          <div className="font-mono text-[var(--ph-gold)] text-[12px] font-bold mb-[24px]">
            {CITIZEN.verifundId}
          </div>
          
          <button 
            onClick={handleDownload}
            className="h-[44px] border-[2px] border-[var(--ph-gold)] text-[var(--ph-gold-dark)] font-bold px-[24px] rounded-full text-[14px] flex items-center justify-center gap-[8px] transition-transform active:scale-95 w-full"
          >
            <Download className="w-[18px] h-[18px]" />
            I-download
          </button>
        </motion.div>

        {/* Distributions Section */}
        <motion.div variants={cardVariants} className="flex flex-col w-full mb-[24px]">
          <h3 className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] mb-[12px]">History ng Ayuda</h3>
          
          <div className="flex flex-col gap-[12px]">
            {upcomingDist && (
              <div className="rounded-[14px] bg-[var(--warning-light)] flex items-center p-[12px] relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--ph-gold)]" />
                <div className="w-[32px] h-[32px] rounded-full bg-[var(--ph-gold)] flex items-center justify-center shrink-0 ml-[4px]">
                  <Bell className="w-[16px] h-[16px] text-white" />
                </div>
                <span className="text-[14px] font-semibold text-[var(--warning)] ml-[12px]">
                  May darating na ayuda — {upcomingDist.date.split(" ")[0]} {upcomingDist.date.split(" ")[1]}
                </span>
              </div>
            )}

            {DISTRIBUTIONS.map((dist) => (
              <div 
                key={dist.id} 
                className="bg-white rounded-[16px] p-[16px] relative overflow-hidden shadow-sm flex flex-col"
              >
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-[3px]",
                  dist.status === "NAKUHA" ? "bg-[var(--success)]" :
                  dist.status === "DARATING" ? "bg-[var(--warning)]" :
                  "bg-[var(--danger)]"
                )} />
                <div className="flex justify-between items-start mb-[12px]">
                  <div className="flex flex-col">
                    <h4 className="text-[15px] font-bold text-[var(--text-primary)]">{dist.title}</h4>
                    <span className="text-[12px] text-[var(--text-muted)] mt-[2px]">{dist.date}</span>
                  </div>
                  <span className="text-[18px] font-bold text-[var(--ph-gold)]">
                    ₱{dist.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-[8px]">
                  {dist.status === "NAKUHA" && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[var(--success-light)] text-[var(--success)] text-[11px] font-bold">
                      NAKUHA
                    </span>
                  )}
                  {dist.status === "DARATING" && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[var(--warning-light)] text-[var(--warning)] text-[11px] font-bold">
                      DARATING
                    </span>
                  )}
                  {dist.status === "TINANGGIHAN" && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[var(--danger-light)] text-[var(--danger)] text-[11px] font-bold">
                      TINANGGIHAN
                    </span>
                  )}
                  
                  {dist.method && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[#F0F3FA] text-[var(--text-secondary)] text-[11px] font-bold">
                      {dist.method}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <TabBar 
        colorScheme="blue"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={[
          { id: "home", label: "Home", icon: Home, href: "/citizen/dashboard" },
          { id: "logout", label: "Mag-logout", icon: LogOut, href: "/" }
        ]}
      />
    </div>
  )
}
