"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Home, Download } from "lucide-react"
import { CITIZEN, DISTRIBUTIONS } from "@/lib/data"
import { QRCode } from "@/components/QRCode"
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

  const upcomingDist = DISTRIBUTIONS.find(d => d.status === "DARATING")

  const handleDownload = () => {
    const canvas = document.querySelector("#qr-code") as HTMLCanvasElement
    if (!canvas) return
    const pngUrl = canvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl
    downloadLink.download = `verifund-qr-${CITIZEN.verifundId}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col pb-[calc(100px+env(safe-area-inset-bottom))]"
      style={{ background: 'var(--surface-page)' }}
    >
      {/* Header */}
      <div className="h-[80px] flex items-center justify-between px-[20px] shrink-0 relative z-20"
        style={{ background: 'linear-gradient(135deg, #18269B, #0D1966)' }}
      >
        <span className="text-white font-extrabold text-[20px] tracking-tight">VeriFund</span>
        <div className="relative">
          <button 
            onClick={() => setShowLogout(!showLogout)}
            className="w-[40px] h-[40px] rounded-full bg-[#FFB800] border-[2px] border-white text-[var(--navy)] font-bold text-[15px] flex items-center justify-center shadow-sm"
          >
            {CITIZEN.photoInitials}
          </button>
          {/* Logout Dropdown */}
          {showLogout && (
            <div className="absolute right-0 top-[48px] bg-white rounded-[12px] shadow-[var(--shadow-lg)] p-[4px] min-w-[160px] z-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-[10px] px-[14px] py-[10px] text-[14px] font-bold text-[var(--red)] hover:bg-[var(--red-light)] rounded-[8px] transition-colors"
              >
                <LogOut className="w-[16px] h-[16px]" />
                Mag-logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Gradient transition below header */}
      <div className="h-[40px] -mt-[1px] relative z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(24,38,155,0.08), transparent)' }}
      />

      <motion.div 
        className="flex-1 w-full max-w-md mx-auto px-[20px] flex flex-col gap-[20px] -mt-[16px]"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Profile Card */}
        <motion.div variants={cardVariants} className="bg-white rounded-[20px] p-[20px] shadow-[var(--shadow-md)] flex flex-col w-full relative overflow-hidden">
          <div className="flex gap-[16px] items-center">
            <div className="w-[56px] h-[56px] rounded-full bg-[var(--navy)] text-white font-bold text-[20px] flex items-center justify-center shrink-0">
              {CITIZEN.photoInitials}
            </div>
            <div className="flex flex-col min-w-0 flex-1 pt-1">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight truncate">{CITIZEN.name}</h2>
              <div className="font-mono text-[var(--red)] text-[13px] font-bold mt-[2px]">
                {CITIZEN.verifundId}
              </div>
              <div className="text-[12px] text-[var(--text-muted)] mt-[2px] truncate">
                {CITIZEN.barangay}
              </div>
            </div>
          </div>
          
          <div className="h-[1px] bg-[#E8ECF7] w-full my-[16px]" />
          
          <div className="flex items-center gap-[8px]">
            <div className="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-full bg-[var(--success-light)] text-[var(--success)] text-[11px] font-bold tracking-wide">
              <div className="w-[6px] h-[6px] rounded-full bg-[var(--success)] animate-pulse" />
              AKTIBO
            </div>
          </div>
        </motion.div>

        {/* QR Code Card */}
        <motion.div variants={cardVariants} className="bg-white rounded-[20px] p-[24px] shadow-[var(--shadow-md)] flex flex-col items-center w-full">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-[4px]">Iyong QR Code</h3>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-[20px]">
            Ipakita ito sa officer para makatanggap ng ayuda.
          </p>
          
          <div className="p-[12px] rounded-[20px] bg-white border border-[rgba(0,0,0,0.08)] mb-[16px] flex items-center justify-center shadow-[var(--shadow-sm)]">
            <QRCode value={CITIZEN.verifundId} id="qr-code" size={180} />
          </div>
          
          <div className="font-mono text-[var(--red)] text-[12px] font-bold mb-[24px] bg-[var(--red-light)] px-[12px] py-[4px] rounded-[8px]">
            {CITIZEN.verifundId}
          </div>
          
          <motion.button 
            onClick={handleDownload}
            whileTap={{ scale: 0.95 }}
            className="h-[44px] border-[1.5px] border-[var(--red)] text-[var(--red)] font-bold px-[24px] rounded-full text-[14px] flex items-center justify-center gap-[8px] w-full shadow-[var(--shadow-sm)] hover:bg-[var(--red-light)] transition-colors"
          >
            <Download className="w-[18px] h-[18px]" />
            I-download
          </motion.button>
        </motion.div>

        {/* Notification Card */}
        {upcomingDist && (
          <motion.div variants={cardVariants} className="rounded-[16px] bg-[#FFF8EB] border border-[#FFE8B8] flex items-center p-[16px] gap-[12px] shadow-sm">
            <div className="w-[40px] h-[40px] rounded-full bg-[var(--warning)] flex items-center justify-center shrink-0">
              <Bell className="w-[20px] h-[20px] text-white" />
            </div>
            <div className="flex-1 flex flex-col">
              <span className="text-[13px] font-bold text-[#B45309] leading-tight">May darating na ayuda sa Hunyo 20!</span>
              <span className="text-[12px] font-medium text-[#B45309]/70 mt-[2px]">{upcomingDist.title}</span>
            </div>
          </motion.div>
        )}

        {/* History Section */}
        <motion.div variants={cardVariants} className="flex flex-col w-full mb-[24px]">
          <div className="section-label-bar mb-[16px]">HISTORY NG AYUDA</div>
          
          <div className="flex flex-col gap-[12px]">
            {DISTRIBUTIONS.map((dist) => (
              <div 
                key={dist.id} 
                className="bg-white rounded-[16px] p-[20px] relative overflow-hidden shadow-[var(--shadow-sm)] flex flex-col border-[1px] border-[rgba(0,0,0,0.02)]"
              >
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-[3px]",
                  dist.status === "NAKUHA" ? "bg-[var(--success)]" : dist.status === "DARATING" ? "bg-[var(--warning)]" : "bg-[var(--danger)]"
                )} />
                <div className="flex justify-between items-start mb-[16px]">
                  <div className="flex flex-col flex-1 min-w-0 pr-4">
                    <h4 className="text-[15px] font-bold text-[var(--text-primary)] truncate">{dist.title}</h4>
                    <span className="text-[12px] text-[var(--text-muted)] mt-[2px]">{dist.date}</span>
                  </div>
                  <span className="text-[18px] font-extrabold text-[#FFB800]">
                    ₱{dist.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-[8px]">
                  <span className={cn(
                    "inline-flex items-center px-[10px] py-[4px] rounded-full text-[11px] font-bold tracking-wide",
                    dist.status === "NAKUHA" ? "bg-[var(--success-light)] text-[var(--success)]" : 
                    dist.status === "DARATING" ? "bg-[var(--warning-light)] text-[var(--warning)]" :
                    "bg-[var(--danger-light)] text-[var(--danger)]"
                  )}>
                    {dist.status}
                  </span>
                  
                  {dist.method && (
                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full bg-[var(--surface-input)] text-[var(--text-secondary)] text-[11px] font-bold tracking-wide">
                      {dist.method}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-[24px] left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white rounded-[9999px] shadow-[var(--shadow-md)] p-[8px] px-[24px] flex items-center gap-[32px] border border-[rgba(0,0,0,0.04)]">
          <button 
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors min-w-[64px]", 
              activeTab === "home" ? "text-[var(--navy)]" : "text-[var(--text-muted)]"
            )}
            onClick={() => setActiveTab("home")}
          >
            <Home className={cn("w-[24px] h-[24px]", activeTab === "home" && "text-[var(--navy)]")} />
            <span className="text-[10px] font-bold">Home</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center gap-1 transition-colors min-w-[64px] text-[var(--text-muted)] hover:text-[var(--red)]"
            onClick={handleLogout}
          >
            <LogOut className="w-[24px] h-[24px]" />
            <span className="text-[10px] font-bold">Mag-logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}
