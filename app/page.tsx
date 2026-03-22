"use client"

import { ShieldCheck, User, Building2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } }
}
const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } }
}

export default function LandingPage() {
  const router = useRouter()

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="landing"
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #001A5E 0%, #0038A8 60%, #002985 100%)' }}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Radial glow decoration */}
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#FCD116] opacity-[0.05] blur-3xl pointer-events-none" />
        <div className="absolute bottom-[40%] left-[-10%] w-[200px] h-[200px] rounded-full bg-white opacity-[0.04] blur-3xl pointer-events-none" />

        {/* Header & Hero Text */}
        <div className="flex flex-col items-center justify-center pt-20 pb-8 z-10 px-4 flex-1">
          {/* Logo with Sun Watermark */}
          <div className="relative flex items-center justify-center mb-6">
            <svg viewBox="0 0 100 100" className="absolute w-[110px] h-[110px] fill-[var(--ph-gold)] opacity-15 pointer-events-none z-0">
              <path d="M50 15L55 35L75 30L60 45L80 55L60 60L65 80L50 65L35 80L40 60L20 55L40 45L25 30L45 35Z" />
              <circle cx="50" cy="50" r="12" />
            </svg>
            <h1 className="text-[44px] font-extrabold text-white tracking-tight relative z-10">
              VeriFund
            </h1>
          </div>
          
          {/* PH flag color bar accent */}
          <div className="flex gap-[4px] mb-6 opacity-70">
            <div className="w-[32px] h-[4px] rounded-full bg-[var(--ph-blue)]" />
            <div className="w-[32px] h-[4px] rounded-full bg-[var(--ph-red)]" />
            <div className="w-[32px] h-[4px] rounded-full bg-[var(--ph-gold)]" />
          </div>
          
          <h2 className="text-[20px] font-bold text-white text-center max-w-[280px] leading-[1.4] mb-3">
            Siguruhing makakarating ang tulong sa tamang tao.
          </h2>
          
          <p className="text-[12px] text-white/60 text-center font-medium tracking-wide uppercase">
            Official Government Social Aid Platform
          </p>
        </div>

        {/* Portal Cards Panel */}
        <motion.div 
          className="w-full bg-[var(--surface-page)] px-[20px] pt-[28px] pb-[calc(28px+env(safe-area-inset-bottom))]"
          style={{ borderRadius: '28px 28px 0 0' }}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.1em] mb-[16px] text-center">
            Piliin ang iyong portal
          </p>
          
          <div className="flex flex-col gap-[12px] max-w-md mx-auto w-full">
            {/* Citizen Portal Card */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-[16px] p-[16px] flex items-center gap-[16px] cursor-pointer shadow-sm"
              onClick={() => router.push('/citizen/login')}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #0038A8, #185ADB)' }}>
                <User className="w-[24px] h-[24px] text-white" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight">
                  Para sa Benepisyaryo
                </h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">
                  I-check ang iyong status at QR code
                </p>
              </div>
              <div className="w-[36px] h-[36px] rounded-full bg-[#E8EEFA] flex items-center justify-center shrink-0">
                <ArrowRight className="w-[18px] h-[18px] text-[var(--ph-blue)]" />
              </div>
            </motion.div>

            {/* Officer Portal Card */}
            <motion.div 
              variants={cardVariants}
              className="bg-white rounded-[16px] p-[16px] flex items-center gap-[16px] cursor-pointer shadow-sm"
              onClick={() => router.push('/admin/login')}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #CE1126, #E8354A)' }}>
                <ShieldCheck className="w-[24px] h-[24px] text-white" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-[var(--text-primary)] leading-tight">
                  Para sa Barangay Officer
                </h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">
                  I-register at i-verify ang mga benepisyaryo
                </p>
              </div>
              <div className="w-[36px] h-[36px] rounded-full bg-[var(--danger-light)] flex items-center justify-center shrink-0">
                <ArrowRight className="w-[18px] h-[18px] text-[var(--ph-red)]" />
              </div>
            </motion.div>

            {/* LGU Admin Portal Card */}
            <motion.div 
              variants={cardVariants}
              className="rounded-[16px] p-[16px] flex items-center gap-[16px] cursor-pointer shadow-sm"
              style={{ background: 'linear-gradient(135deg, #001A5E, #0038A8)' }}
              onClick={() => router.push('/management/login')}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(252,209,22,0.2)', border: '1.5px solid rgba(252,209,22,0.4)' }}>
                <Building2 className="w-[24px] h-[24px] text-[var(--ph-gold)]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3 className="text-[16px] font-bold text-white leading-tight">
                  Para sa LGU Admin
                </h3>
                <p className="text-[12px] text-[var(--ph-gold)]/70 mt-[2px]">
                  Dashboard, benepisyaryo, at distribusyon
                </p>
              </div>
              <div className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(252,209,22,0.15)' }}>
                <ArrowRight className="w-[18px] h-[18px] text-[var(--ph-gold)]" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
