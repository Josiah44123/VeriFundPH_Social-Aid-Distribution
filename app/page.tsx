"use client"

import { Card } from "@/components/ui/card"
import { ShieldCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[var(--surface)]">
      {/* Decorative Sun Motif Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] opacity-10 pointer-events-none z-0">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="fill-[var(--ph-gold)]">
          <path d="M50 15L55 35L75 30L60 45L80 55L60 60L65 80L50 65L35 80L40 60L20 55L40 45L25 30L45 35Z" />
          <circle cx="50" cy="50" r="12" />
        </svg>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center justify-center pt-24 pb-12 z-10 px-4">
        <h1 className="text-[32px] font-extrabold text-[var(--navy-deep)] tracking-tight">
          VeriFund
        </h1>
        <p className="text-[14px] text-[var(--text-muted)] mt-2 text-center font-medium max-w-[280px]">
          Siguruhing makakarating ang tulong sa tamang tao.
        </p>
      </div>

      {/* Hero Icon */}
      <div className="flex justify-center mb-12 z-10">
        <div className="relative w-32 h-32 flex items-center justify-center -translate-y-4">
          <div className="absolute inset-0 bg-[var(--ph-blue)] opacity-5 rounded-full blur-xl" />
          <User className="w-16 h-16 text-[var(--ph-blue)] relative z-10" />
          <ShieldCheck className="w-8 h-8 text-[var(--ph-gold)] absolute bottom-4 right-4 z-20 bg-white rounded-full p-1 shadow-sm" />
        </div>
      </div>

      {/* Portal Cards */}
      <div className="flex-1 px-4 flex flex-col gap-4 z-10 max-w-md mx-auto w-full">
        {/* Citizen Portal Card */}
        <Card 
          className="v-card overflow-hidden p-0 border-[0.5px] border-[#E0E4EF] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push('/citizen/login')}
        >
          <div className="h-2 bg-[var(--ph-blue)] w-full" />
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <User className="w-6 h-6 text-[var(--ph-blue)]" />
              </div>
              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                Para sa Benepisyaryo
              </h2>
            </div>
            <p className="text-[13px] text-[var(--text-muted)] mb-4 pl-12 line-clamp-2">
              I-check ang iyong status at history ng ayuda
            </p>
            <div className="mt-auto">
              <button 
                className="primary-btn w-full bg-[var(--ph-blue)] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/citizen/login');
                }}
              >
                Mag-login
              </button>
            </div>
          </div>
        </Card>

        {/* Admin Portal Card */}
        <Card 
          className="v-card overflow-hidden p-0 border-[0.5px] border-[#E0E4EF] hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer"
          onClick={() => router.push('/admin/login')}
        >
          <div className="h-2 bg-[var(--ph-red)] w-full" />
          <div className="p-4 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-red-50 rounded-lg shrink-0">
                <ShieldCheck className="w-6 h-6 text-[var(--ph-red)]" />
              </div>
              <h2 className="text-[18px] font-bold text-[var(--text-primary)]">
                Para sa Barangay Officer
              </h2>
            </div>
            <p className="text-[13px] text-[var(--text-muted)] mb-4 pl-12 line-clamp-2">
              I-register at i-verify ang mga benepisyaryo
            </p>
            <div className="mt-auto">
              <button 
                className="primary-btn w-full bg-[var(--ph-red)] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/admin/login');
                }}
              >
                Mag-login bilang Officer
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="py-8 flex justify-center items-center gap-2 z-10 w-full mt-4">
        <span className="text-[11px] text-[var(--text-muted)] font-medium">
          VeriFund PH · Official Government Platform
        </span>
        <svg viewBox="0 0 100 100" className="w-[12px] h-[12px] fill-[var(--ph-gold)]">
          <path d="M50 15L55 35L75 30L60 45L80 55L60 60L65 80L50 65L35 80L40 60L20 55L40 45L25 30L45 35Z" />
        </svg>
      </div>
    </div>
  )
}
