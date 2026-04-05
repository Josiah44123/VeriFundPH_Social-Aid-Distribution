"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Home, Download, Check, Clock, X } from "lucide-react"
import { CITIZEN, DISTRIBUTIONS } from "@/lib/data"
import { QRCode } from "@/components/QRCode"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const containerVariants = {
  animate: { transition: { staggerChildren: 0.06 } }
}
const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  hover: { y: -4, transition: { duration: 0.2 } }
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
    <div className="min-h-screen flex flex-col pb-24 bg-surface font-editorial">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-xl px-5 py-4 flex justify-between items-center editorial-shadow">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="VeriFund" className="h-8 w-8 object-contain" />
          <span className="text-xl font-extrabold text-primary tracking-tight">VeriFund</span>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowLogout(!showLogout)}
            className="w-10 h-10 rounded-full bg-primary-container text-white font-bold text-sm flex items-center justify-center border-2 border-primary-fixed transition-transform hover:scale-105"
          >
            {CITIZEN.photoInitials}
          </button>
          {/* Logout Dropdown */}
          {showLogout && (
            <div className="absolute right-0 top-12 bg-surface-container-lowest rounded-2xl shadow-[0_20px_40px_rgba(25,27,33,0.08)] p-2 min-w-[160px] z-50">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-tertiary hover:bg-surface-container-low rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Mag-logout
              </button>
            </div>
          )}
        </div>
      </div>

      <motion.div 
        className="flex-1 w-full max-w-md mx-auto px-5 flex flex-col gap-6 mt-6"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Profile Card (Hero) */}
        <motion.div variants={cardVariants} whileHover="hover" className="bg-gradient-to-br from-primary to-primary-container rounded-2xl p-7 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              <div className="w-2 h-2 rounded-full bg-secondary-container" />
              AKTIBO
            </div>
            <h2 className="text-3xl font-extrabold tracking-tighter mb-1">{CITIZEN.name}</h2>
            <div className="text-white/70 font-mono text-sm mb-6">
              {CITIZEN.verifundId}
            </div>
            <div className="text-white/60 text-sm font-medium">
              Barangay {CITIZEN.barangay}
            </div>
          </div>
          {/* Decorative Blob */}
          <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black pointer-events-none select-none">
            V
          </div>
        </motion.div>

        {/* QR Code Card */}
        <motion.div variants={cardVariants} whileHover="hover" className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col items-center text-center editorial-shadow">
          <h3 className="text-on-surface font-bold text-base mb-4">Iyong QR Code</h3>
          <p className="text-on-surface-variant text-xs mb-5">
            Ipakita ito sa officer para makatanggap ng ayuda.
          </p>
          
          <div className="bg-surface-container-high p-4 rounded-2xl mb-5 hover:scale-105 transition-transform duration-300">
            <QRCode value={CITIZEN.verifundId} id="qr-code" size={180} />
          </div>
          
          <div className="font-mono text-xs font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full mb-5">
            {CITIZEN.verifundId}
          </div>
          
          <button 
            onClick={handleDownload}
            className="w-full rounded-full border-2 border-primary text-primary font-bold py-3 flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all"
          >
            <Download className="w-5 h-5" />
            I-download ang QR
          </button>
        </motion.div>

        {/* Notification Banner */}
        {upcomingDist && (
          <motion.div variants={cardVariants} whileHover="hover" className="bg-secondary-container rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden shadow-sm">
            <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center shrink-0 relative z-10">
              <Bell className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1 flex flex-col relative z-10">
              <span className="text-on-secondary-container font-black text-base">May darating na ayuda!</span>
              <span className="text-on-secondary-container/80 text-xs font-medium">{upcomingDist.title}</span>
            </div>
            {/* Right gradient overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-secondary/10 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* History Section */}
        <motion.div variants={cardVariants} className="flex flex-col w-full mb-6">
          <div className="flex justify-between items-end mb-5">
            <div>
              <div className="text-primary font-bold text-xs tracking-widest uppercase mb-1">
                KASAYSAYAN NG TRANSAKSYON
              </div>
              <h2 className="text-2xl font-black tracking-tighter text-on-surface">
                HISTORY NG AYUDA
              </h2>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            {DISTRIBUTIONS.map((dist) => {
              const bgGradientClass = dist.status === "NAKUHA" ? "bg-gradient-to-br from-primary to-primary-container"
                                 : dist.status === "DARATING" ? "bg-gradient-to-br from-secondary to-[#b88000]"
                                 : "bg-gradient-to-br from-tertiary to-tertiary-container";
              
              const textColor = "text-white";
              const secondaryTextColor = "text-white/80";
              const pillBg = "bg-white/20";
              const Icon = dist.status === "NAKUHA" ? Check : dist.status === "DARATING" ? Clock : X;

              return (
                <motion.div 
                  key={dist.id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className={cn("rounded-2xl p-5 flex flex-col gap-3 editorial-shadow relative overflow-hidden", bgGradientClass)}
                >
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start gap-3 relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className={cn("w-5 h-5", textColor)} />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                      <h4 className={cn("text-lg font-bold leading-tight mb-1", textColor)}>{dist.title}</h4>
                      <span className={cn("text-sm font-medium", secondaryTextColor)}>{dist.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end mt-2 relative z-10">
                    <span className={cn("text-2xl font-black tracking-tight", textColor)}>
                      ₱{dist.amount.toLocaleString()}
                    </span>
                    <div className="flex flex-col items-end gap-2">
                      <span className={cn("px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase", pillBg, textColor)}>
                        {dist.status}
                      </span>
                      {dist.method && (
                        <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold", pillBg, secondaryTextColor)}>
                          {dist.method}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(25,27,33,0.12)] rounded-full border border-outline-variant/20" style={{ minWidth: '200px' }}>
        <button 
          className={cn(
            "flex items-center gap-2 px-6 py-3 transition-all rounded-full font-semibold text-sm", 
            activeTab === "home" ? "bg-primary text-white shadow-md shadow-primary/20" : "text-on-surface-variant hover:text-primary"
          )}
          onClick={() => setActiveTab("home")}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Home</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-6 py-3 transition-all rounded-full text-on-surface-variant hover:text-tertiary font-semibold text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[11px] font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>
    </div>
  )
}
