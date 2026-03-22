"use client"

import { ShieldCheck, User, Star, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.2,
            animation: `float-particle ${10 + Math.random() * 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col relative w-full bg-[var(--surface-page)]">
      {/* Top half: navy gradient header with particles */}
      <div 
        className="flex-1 flex flex-col items-center justify-center pt-16 pb-36 px-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0D1966, #18269B, #1E33B8)' }}
      >
        <Particles />

        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col items-center justify-center mb-6 z-10"
        >
          <div className="w-[80px] h-[80px] bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
            <ShieldCheck className="w-[40px] h-[40px] text-white" />
          </div>
          <div className="flex items-center gap-[6px] mb-2">
            <Star className="w-[18px] h-[18px] text-[#FFB800] fill-[#FFB800]" />
            <h1 className="text-[36px] font-extrabold text-white tracking-tight leading-none">
              VeriFund PH
            </h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-[14px] text-white/70 font-medium text-center"
          >
            Siguruhing makakarating ang tulong sa tamang tao.
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom half: white panel */}
      <div 
        className="w-full rounded-t-[28px] shadow-[0_-8px_32px_rgba(0,0,0,0.08)] px-[20px] py-[32px] -mt-[64px] relative z-20 pb-[calc(40px+env(safe-area-inset-bottom))]"
        style={{
          background: 'white',
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,0,72,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(24,38,155,0.04) 0%, transparent 50%)',
        }}
      >
        <div className="flex flex-col gap-[16px] max-w-md mx-auto w-full">
          
          {/* Citizen Portal Card */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            whileHover={{ y: -2 }}
            className="rounded-[20px] p-[24px] flex flex-col gap-[16px] cursor-pointer overflow-hidden relative"
            style={{ 
              background: 'linear-gradient(135deg, #18269B, #0D1966)',
              boxShadow: '0 12px 40px rgba(24,38,155,0.25)',
            }}
            onClick={() => router.push('/citizen/login')}
          >
            <div className="flex items-start gap-[16px]">
              <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <User className="w-[32px] h-[32px] text-white" />
              </div>
              <div className="flex flex-col flex-1 pt-1 min-w-0">
                <h3 className="text-[18px] font-bold text-white tracking-[-0.3px]">
                  Para sa Benepisyaryo
                </h3>
                <p className="text-[13px] text-white/70 mt-1">
                  I-check ang iyong QR at kasaysayan ng ayuda
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-[6px]">
              {["QR Code", "Ayuda History", "Status"].map(f => (
                <span key={f} className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  {f}
                </span>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); router.push('/citizen/login') }}
              className="w-full h-[52px] bg-white text-[var(--navy)] rounded-[14px] font-bold text-[15px] tracking-[-0.2px] flex items-center justify-center gap-[6px] shadow-sm"
            >
              Mag-login
              <ChevronRight className="w-[18px] h-[18px]" />
            </motion.button>
          </motion.div>

          {/* Officer Portal Card */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            whileHover={{ y: -2 }}
            className="rounded-[20px] p-[24px] flex flex-col gap-[16px] cursor-pointer overflow-hidden relative"
            style={{ 
              background: 'linear-gradient(135deg, #FF0048, #CC0039)',
              boxShadow: '0 12px 40px rgba(255,0,72,0.25)',
            }}
            onClick={() => router.push('/admin/login')}
          >
            <div className="flex items-start gap-[16px]">
              <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <ShieldCheck className="w-[32px] h-[32px] text-white" />
              </div>
              <div className="flex flex-col flex-1 pt-1 min-w-0">
                <h3 className="text-[18px] font-bold text-white tracking-[-0.3px]">
                  Para sa Barangay Officer
                </h3>
                <p className="text-[13px] text-white/70 mt-1">
                  I-register at i-verify ang mga benepisyaryo
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-[6px]">
              {["I-Register", "I-Verify", "Console"].map(f => (
                <span key={f} className="px-[10px] py-[4px] rounded-full text-[11px] font-bold text-white" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  {f}
                </span>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); router.push('/admin/login') }}
              className="w-full h-[52px] bg-white text-[var(--red)] rounded-[14px] font-bold text-[15px] tracking-[-0.2px] flex items-center justify-center gap-[6px] shadow-sm"
            >
              Mag-login bilang Officer
              <ChevronRight className="w-[18px] h-[18px]" />
            </motion.button>
          </motion.div>

        </div>

        {/* Footer */}
        <p className="text-center text-[12px] text-[var(--text-muted)] mt-[28px] font-medium">
          VeriFund PH · Official Platform
        </p>
      </div>
    </div>
  )
}
