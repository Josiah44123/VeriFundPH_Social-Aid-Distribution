"use client"

import { CheckCircle2, ChevronDown, ChevronRight, QrCode } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVeriFundStore } from "@/lib/store"
import { useState } from "react"

import { DEFAULT_BARANGAY } from "@/lib/constants"

const BARANGAY = DEFAULT_BARANGAY

interface ListahanTabProps {
  onSwitchToVerify?: () => void
}

export function ListahanTab({ onSwitchToVerify }: ListahanTabProps) {
  const { claims } = useVeriFundStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const todayClaims = claims.filter(c => {
    const claimDate = c.verifiedAt.slice(0, 10)
    return c.barangay === BARANGAY && (claimDate === today || claimDate === "2025-03-15")
  })

  const sortedClaims = [...todayClaims].sort((a, b) => new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime())

  const nakuhaCount = todayClaims.filter(c => c.status === "NAKUHA").length
  const tinanggihanCount = todayClaims.filter(c => c.status === "TINANGGIHAN").length
  const totalScanned = todayClaims.length

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    } catch { return "—" }
  }

  const initials = (name: string) => name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()

  return (
    <div className="flex flex-col h-full bg-surface-container-low min-h-full pb-[100px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      
      {/* Header */}
      <div className="px-5 pt-5 pb-4 bg-surface-container-lowest border-b border-outline-variant/20 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-extrabold text-primary tracking-tight">Listahan Ngayon</h2>
          <span className="bg-[#E8F5EE] text-[#1A8C4E] text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> {nakuhaCount} Nakuha
          </span>
        </div>
      </div>

      {/* Stats Row — pill-shaped gradient badges */}
      <div className="px-5 py-4 flex gap-3">
        {[
          { label: 'Scanned', value: totalScanned, gradient: 'from-primary to-primary-container' },
          { label: 'Nakuha', value: nakuhaCount, gradient: 'from-[#1a56ad] to-[#2563eb]' },
          { label: 'Tinanggihan', value: tinanggihanCount, gradient: 'from-[#CE1126] to-[#A30D1E]' },
        ].map(({ label, value, gradient }) => (
          <div key={label} className={`flex-1 bg-gradient-to-br ${gradient} rounded-full py-3 px-4 text-center shadow-lg relative overflow-hidden`}>
            {/* Decorative shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            
            <div className="relative z-10 text-2xl font-extrabold tracking-tight text-white">{value}</div>
            <div className="relative z-10 text-[9px] font-bold uppercase tracking-[0.15em] text-white/90 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div>
        {sortedClaims.length === 0 && (
          <div className="flex flex-col items-center py-16 px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4">
              <QrCode className="w-8 h-8 text-on-surface-variant" />
            </div>
            <p className="text-base font-bold text-on-surface-variant">Wala pang na-verify ngayon.</p>
            {onSwitchToVerify && (
              <button onClick={onSwitchToVerify}
                className="mt-3 text-sm font-bold text-tertiary underline underline-offset-4">
                I-Verify ang una →
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {sortedClaims.map((claim, index) => {
              const isNakuha = claim.status === "NAKUHA"
              const isExpanded = expandedId === claim.id
              const name = claim.beneficiaryName

              // Full-color card backgrounds based on status
              const cardBg = isNakuha
                ? 'bg-gradient-to-br from-primary to-primary-container'
                : 'bg-gradient-to-br from-tertiary to-tertiary-container'

              return (
                  <motion.div 
                    key={claim.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06 }}
                    className={`mx-5 mb-3 rounded-2xl p-4 cursor-pointer transition-all shadow-lg relative overflow-hidden ${cardBg}`}
                    onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                  >
                    {/* Decorative blob */}
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />

                    <div className="flex items-center gap-3 relative z-10">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-white/20 text-white flex-shrink-0">
                      {initials(name)}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-base font-extrabold text-white truncate leading-tight">{name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-white/60">{formatTime(claim.verifiedAt)}</span>
                        {claim.method && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span className="text-xs text-white/60">{claim.method}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2 flex items-center gap-1">
                      <span className="text-[10px] font-black px-3 py-1.5 rounded-full flex-shrink-0 bg-white/20 text-white">
                        {claim.status}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-white/50" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/50" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-white/20 flex flex-col gap-2 relative z-10">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 font-medium">VeriFund ID</span>
                            <span className="font-mono text-xs font-bold text-white py-0.5 px-2 bg-white/15 rounded-md">{claim.beneficiaryId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white/70 font-medium">Oras</span>
                            <span className="text-xs font-bold text-white/90">{new Date(claim.verifiedAt).toLocaleString()}</span>
                          </div>
                          {!isNakuha && claim.reason && (
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-white/70 font-medium">Dahilan</span>
                              <span className="text-xs font-bold text-white max-w-[200px] text-right leading-tight">{claim.reason}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
