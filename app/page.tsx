"use client"

import { ShieldCheck, User, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col relative w-full bg-surface text-on-surface" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <header className="sticky top-0 z-50 flex justify-between items-center px-5 py-3 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="VeriFund" className="w-8 h-8 object-contain" />
          <span className="text-xl font-extrabold text-primary tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>VeriFund</span>
        </div>
        <button onClick={() => router.push('/admin/login')}
          className="px-5 py-2 rounded-full bg-primary text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm"
          style={{ fontFamily: 'Manrope, sans-serif' }}>
          Mag-login
        </button>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-5 py-6 bg-surface">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold tracking-widest uppercase mb-5">
          ✓ Opisyal na Platform
        </div>
        
        <h1 className="text-4xl font-extrabold text-primary tracking-tighter leading-[1.15] text-center mb-3 max-w-xs mx-auto" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Siguruhing makakarating ang tulong sa{' '}
          <span className="text-secondary-fixed-dim">tamang tao.</span>
        </h1>
        
        <p className="text-sm text-on-surface-variant text-center mb-7 max-w-xs mx-auto font-medium">
          I-access ang impormasyon o pamahalaan ang distribusyon ng ayuda.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm mx-auto">
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => router.push('/citizen/login')}
            className="cursor-pointer bg-gradient-to-br from-primary to-primary-container rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden editorial-shadow"
          >
            {/* decorative blob */}
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Para sa Benepisyaryo</h3>
              <p className="text-xs text-white/70 mt-1">I-check ang QR at kasaysayan ng ayuda</p>
            </div>
            <div className="flex items-center text-white/90 text-xs font-bold gap-1 mt-auto">
              Mag-login <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => router.push('/admin/login')}
            className="cursor-pointer bg-gradient-to-br from-tertiary to-tertiary-container rounded-2xl p-6 flex flex-col gap-3 relative overflow-hidden editorial-shadow"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Para sa Barangay Officer</h3>
              <p className="text-xs text-white/70 mt-1">I-register at i-verify ang mga benepisyaryo</p>
            </div>
            <div className="flex items-center text-white/90 text-xs font-bold gap-1 mt-auto">
              Mag-login bilang Officer <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
        
        <p className="text-center text-xs text-on-surface-variant mt-6 font-medium">
          VeriFund PH · Official Platform
        </p>
      </main>
    </div>
  )
}
