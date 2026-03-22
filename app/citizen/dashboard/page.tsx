"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCircle2, Clock, MapPin, LogOut, Home, Download } from "lucide-react"
import { CITIZEN, DISTRIBUTIONS } from "@/lib/data"
import { QRCode } from "@/components/QRCode"
import { TabBar } from "@/components/TabBar"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-[var(--surface)] flex flex-col pb-[80px]">
      {/* Header */}
      <div className="bg-[var(--ph-blue)] h-[64px] flex items-center justify-between px-4 shrink-0 relative z-20">
        <span className="text-white font-bold text-[18px]">VeriFund</span>
        <button 
          className="w-8 h-8 rounded-full bg-[var(--ph-gold)] text-[var(--navy-deep)] font-bold text-xs flex items-center justify-center"
          onClick={() => setShowLogout(!showLogout)}
        >
          {CITIZEN.photoInitials}
        </button>
        
        {/* Logout Dropdown */}
        {showLogout && (
          <div className="absolute top-[60px] right-4 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
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

      <div className="flex-1 px-4 py-6 overflow-y-auto max-w-md mx-auto w-full">
        {/* Profile Card */}
        <div className="v-card border-l-4 border-l-[var(--ph-blue)] flex gap-4 items-center">
          <div className="w-[64px] h-[64px] rounded-full bg-[var(--ph-blue)] text-white font-bold text-xl flex items-center justify-center shrink-0">
            {CITIZEN.photoInitials}
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">{CITIZEN.name}</h2>
            <div className="font-mono text-[var(--ph-gold)] text-[13px] font-semibold my-1 mt-0">
              {CITIZEN.verifundId}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--success-green)]/10 text-[var(--success-green)] text-[10px] font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--success-green)]" />
                AKTIBO
              </span>
              <span className="text-[12px] text-[var(--text-muted)] flex items-center gap-1 truncate max-w-[140px]">
                <MapPin className="w-3 h-3 shrink-0" />
                {CITIZEN.barangay}
              </span>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="v-card mt-4 flex flex-col items-center py-6">
          <h3 className="text-[14px] font-bold text-[var(--text-primary)] mb-4">Iyong QR Code</h3>
          <QRCode value={CITIZEN.verifundId} id="qr-code" size={180} />
          <p className="text-[12px] text-[var(--text-muted)] text-center mt-4 max-w-[200px]">
            Ipakita ito sa officer para makatanggap ng ayuda.
          </p>
          <button 
            onClick={handleDownload}
            className="mt-6 border-[1.5px] border-[var(--ph-blue)] text-[var(--ph-blue)] font-bold px-6 py-2 rounded-xl text-[14px] flex items-center gap-2 transition-transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            I-download
          </button>
        </div>

        {/* Distributions Section */}
        <div className="mt-8">
          <h3 className="section-label mb-3 uppercase text-[var(--ph-blue)]">History ng Ayuda</h3>
          
          <div className="flex flex-col gap-3">
            {upcomingDist && (
              <div className="v-card mb-1 border-l-4 border-l-[var(--ph-gold)] bg-amber-50/50 flex xl:flex-row items-center gap-3">
                <div className="p-2 bg-[var(--ph-gold)]/20 rounded-full">
                  <Bell className="w-5 h-5 text-amber-600" />
                </div>
                <span className="text-[13px] font-semibold text-amber-900">
                  May darating na ayuda sa {upcomingDist.date.split(" ")[0]} {upcomingDist.date.split(" ")[1]}!
                </span>
              </div>
            )}

            {DISTRIBUTIONS.map((dist) => (
              <div 
                key={dist.id} 
                className={cn(
                  "v-card border-l-4 p-4",
                  dist.status === "NAKUHA" ? "border-l-[var(--success-green)]" :
                  dist.status === "DARATING" ? "border-l-[var(--ph-gold)]" :
                  "border-l-[var(--ph-red)]"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-[14px] font-bold text-[var(--text-primary)]">{dist.title}</h4>
                    <span className="text-[12px] text-[var(--text-muted)]">{dist.date}</span>
                  </div>
                  <span className="text-[16px] font-bold text-[var(--ph-gold)]">
                    ₱{dist.amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  {dist.status === "NAKUHA" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--success-green)]/10 text-[var(--success-green)] text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      NAKUHA
                    </span>
                  )}
                  {dist.status === "DARATING" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      DARATING
                    </span>
                  )}
                  
                  {dist.method && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold">
                      {dist.method}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
