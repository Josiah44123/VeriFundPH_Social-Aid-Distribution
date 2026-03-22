"use client"

import { Card } from "@/components/ui/card"
import { ShieldCheck, User, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.1 } }
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
        {/* Header & Hero Text */}
        <div className="flex flex-col items-center justify-center pt-24 pb-12 z-10 px-4 flex-1">
          {/* Logo and Sun Watermark */}
          <div className="relative flex items-center justify-center mb-8">
            <svg viewBox="0 0 100 100" className="absolute w-[120px] h-[120px] fill-[var(--ph-gold)] opacity-15 pointer-events-none z-0">
              <path d="M50 15L55 35L75 30L60 45L80 55L60 60L65 80L50 65L35 80L40 60L20 55L40 45L25 30L45 35Z" />
              <circle cx="50" cy="50" r="12" />
            </svg>
            <h1 className="text-[40px] font-extrabold text-white tracking-tight relative z-10">
              VeriFund
            </h1>
          </div>
          
          <h2 className="text-[22px] font-bold text-white text-center max-w-[280px] leading-[1.4] mb-3">
            Siguruhing makakarating ang tulong sa tamang tao.
          </h2>
          
          <p className="text-[12px] text-white/60 text-center font-medium">
            Official Government Social Aid Platform
          </p>
        </div>

        {/* Portal Cards Panel */}
        <motion.div 
          className="w-full bg-white px-[24px] pt-[32px] pb-[calc(24px+env(safe-area-inset-bottom))]"
          style={{ borderRadius: '28px 28px 0 0' }}
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <div className="flex flex-col gap-[16px] max-w-md mx-auto w-full">
            {/* Citizen Portal Card */}
            <motion.div 
              variants={cardVariants}
              className="flex flex-col w-full cursor-pointer"
              onClick={() => router.push('/citizen/login')}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full h-[6px] rounded-[6px] mb-[16px]" style={{ background: 'linear-gradient(135deg, #0038A8, #185ADB)' }} />
              <div className="flex flex-col">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[56px] h-[56px] rounded-full bg-[var(--info-light)] flex items-center justify-center shrink-0">
                    <User className="w-[28px] h-[28px] text-[var(--ph-blue)]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[18px] font-bold text-[var(--text-primary)] leading-tight">
                      Para sa Benepisyaryo
                    </h3>
                    <p className="text-[13px] text-[var(--text-muted)] mt-[2px]">
                      I-check ang iyong status at QR code
                    </p>
                  </div>
                </div>
                <div className="mt-[20px]">
                  <button 
                    className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                    style={{ background: '#0038A8' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/citizen/login');
                    }}
                  >
                    Mag-login <ArrowRight className="w-[18px] h-[18px]" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Officer Portal Card */}
            <motion.div 
              variants={cardVariants}
              className="flex flex-col w-full cursor-pointer"
              onClick={() => router.push('/admin/login')}
              whileTap={{ scale: 0.97 }}
            >
              <div className="w-full h-[6px] rounded-[6px] mb-[16px]" style={{ background: 'linear-gradient(135deg, #CE1126, #E8354A)' }} />
              <div className="flex flex-col">
                <div className="flex items-center gap-[16px]">
                  <div className="w-[56px] h-[56px] rounded-full bg-[var(--danger-light)] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-[28px] h-[28px] text-[var(--ph-red)]" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-[18px] font-bold text-[var(--text-primary)] leading-tight">
                      Para sa Barangay Officer
                    </h3>
                    <p className="text-[13px] text-[var(--text-muted)] mt-[2px]">
                      I-register at i-verify ang mga benepisyaryo
                    </p>
                  </div>
                </div>
                <div className="mt-[20px]">
                  <button 
                    className="w-full h-[52px] rounded-full text-white font-bold text-[15px] flex items-center justify-center transition-transform active:scale-[0.98]"
                    style={{ background: '#CE1126' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push('/admin/login');
                    }}
                  >
                    Mag-login bilang Officer
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
