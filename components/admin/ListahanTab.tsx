"use client"

import { CheckCircle2, ChevronDown, ChevronRight, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
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
          <span className="bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> {nakuhaCount} Nakuha
          </span>
        </div>
      </div>

      <div className="px-5 py-4 flex gap-3">
        {[
          { label: 'Scanned', value: totalScanned, gradient: 'from-primary to-primary-container', text: 'text-white' },
          { label: 'Nakuha', value: nakuhaCount, gradient: 'from-secondary to-secondary-fixed-dim', text: 'text-[#271900]' },
          { label: 'Tinanggihan', value: tinanggihanCount, gradient: 'from-tertiary to-tertiary-container', text: 'text-white' },
        ].map(({ label, value, gradient, text }) => (
          <div key={label} className={`flex-1 bg-gradient-to-br ${gradient} rounded-2xl p-3 text-center editorial-shadow relative overflow-hidden`}>
            {/* Decorative blob */}
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white/20 rounded-full blur-md pointer-events-none" />
            
            <div className={`relative z-10 text-2xl font-extrabold tracking-tight ${text}`}>{value}</div>
            <div className={`relative z-10 text-[10px] font-bold uppercase tracking-widest ${text} opacity-90 mt-0.5`}>{label}</div>
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
            {sortedClaims.map((claim) => {
              const isNakuha = claim.status === "NAKUHA"
              const isExpanded = expandedId === claim.id
              const name = claim.beneficiaryName

              return (
                <motion.div 
                  key={claim.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mx-5 mb-3 rounded-2xl p-4 cursor-pointer transition-all editorial-shadow border-l-4 ${
                    isNakuha
                      ? 'bg-surface-container-lowest border-l-primary-container'
                      : 'bg-tertiary/5 border-l-tertiary'
                  }`}
                  onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0",
                      isNakuha ? "bg-gradient-to-br from-primary to-primary-container" : "bg-tertiary"
                    )}>
                      {initials(name)}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-on-surface truncate leading-tight">{name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-on-surface-variant">{formatTime(claim.verifiedAt)}</span>
                        {claim.method && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-outline-variant" />
                            <span className="text-xs font-semibold text-on-surface-variant">{claim.method}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ml-2 flex items-center gap-1">
                      <span className={cn(
                        "text-[10px] font-black px-3 py-1.5 rounded-full flex-shrink-0",
                        isNakuha ? "bg-gradient-to-r from-primary to-primary-container text-white" : "bg-gradient-to-r from-tertiary-container to-tertiary text-white"
                      )}>
                        {claim.status}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-on-surface-variant opacity-50" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-on-surface-variant opacity-50" />
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
                        <div className="mt-4 pt-4 border-t border-screen-variant/20 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-on-surface-variant font-medium">VeriFund ID</span>
                            <span className="font-mono text-xs font-bold text-tertiary py-0.5 px-2 bg-tertiary/10 rounded-md">{claim.beneficiaryId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-on-surface-variant font-medium">Oras</span>
                            <span className="text-xs font-bold text-on-surface-variant">{new Date(claim.verifiedAt).toLocaleString()}</span>
                          </div>
                          {!isNakuha && claim.reason && (
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-on-surface-variant font-medium">Dahilan</span>
                              <span className="text-xs font-bold text-tertiary max-w-[200px] text-right leading-tight">{claim.reason}</span>
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
