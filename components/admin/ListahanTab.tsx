"use client"

import { CheckCircle2, ChevronDown, ChevronRight, XCircle, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useVeriFundStore } from "@/lib/store"
import { useState } from "react"

const BARANGAY = "Sta. Cruz, Quezon City"

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
    <div className="flex flex-col h-full pb-[100px] bg-[var(--surface-page)] min-h-full">
      
      {/* Header */}
      <div className="sticky top-0 bg-[var(--surface-page)] z-10 px-[16px] pt-[24px] pb-[16px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] leading-tight tracking-[-0.3px]">Listahan Ngayon</h2>
          <span className="bg-[var(--success-light)] text-[var(--success)] text-[12px] font-bold px-[12px] py-[6px] rounded-full flex items-center gap-[4px] shadow-sm">
            <CheckCircle2 className="w-[14px] h-[14px]" />
            {nakuhaCount} Nakuha
          </span>
        </div>
      </div>

      <div className="px-[16px]">
        {/* Summary Stats */}
        <div className="flex gap-[12px] mb-[28px]">
          <div className="flex-1 bg-[var(--navy-light)] rounded-[14px] p-[12px] px-[16px] flex flex-col items-center justify-center shadow-[var(--shadow-sm)]">
            <div className="text-[20px] font-extrabold text-[var(--navy)] leading-none">{totalScanned}</div>
            <div className="text-[11px] text-[var(--navy)] font-bold uppercase mt-[4px] opacity-70">Scanned</div>
          </div>
          <div className="flex-1 bg-[var(--success-light)] rounded-[14px] p-[12px] px-[16px] flex flex-col items-center justify-center shadow-[var(--shadow-sm)]">
            <div className="text-[20px] font-extrabold text-[var(--success)] leading-none">{nakuhaCount}</div>
            <div className="text-[11px] text-[var(--success)] font-bold uppercase mt-[4px] opacity-70">Nakuha</div>
          </div>
          <div className="flex-1 bg-[var(--danger-light)] rounded-[14px] p-[12px] px-[16px] flex flex-col items-center justify-center shadow-[var(--shadow-sm)]">
            <div className="text-[20px] font-extrabold text-[var(--red)] leading-none">{tinanggihanCount}</div>
            <div className="text-[11px] text-[var(--red)] font-bold uppercase mt-[4px] opacity-70">Tinanggihan</div>
          </div>
        </div>

        {sortedClaims.length === 0 && (
          <div className="flex flex-col items-center justify-center py-[60px] text-center">
            <div className="w-[64px] h-[64px] rounded-full bg-[#E8ECF7] flex items-center justify-center mb-[16px]">
              <QrCode className="w-[32px] h-[32px] text-[var(--text-muted)]" />
            </div>
            <p className="text-[16px] font-bold text-[var(--text-secondary)]">Wala pang na-verify ngayon.</p>
            {onSwitchToVerify && (
              <button 
                onClick={onSwitchToVerify}
                className="text-[14px] font-bold text-[var(--red)] mt-[8px] underline underline-offset-4"
              >
                I-Verify ang una →
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-[12px]">
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
                  className={cn(
                    "rounded-[16px] p-[14px] px-[16px] shadow-[var(--shadow-sm)] cursor-pointer border-[1.5px] transition-colors",
                    !isNakuha ? "bg-[#FFF5F7] border-[var(--red-light)]" : "bg-white border-transparent hover:border-[#E8ECF7]"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                >
                  <div className="flex items-center gap-[12px]">
                    <div className={cn(
                      "w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[16px] text-white shrink-0 shadow-sm",
                      isNakuha ? "bg-[var(--navy)]" : "bg-[var(--red)]"
                    )}>
                      {initials(name)}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-[14px] font-bold text-[var(--text-primary)] truncate leading-tight">{name}</h4>
                      <div className="text-[12px] text-[var(--text-muted)] mt-[2px] flex items-center gap-[6px]">
                        <span>{formatTime(claim.verifiedAt)}</span>
                        {claim.method && (
                          <>
                            <span className="w-[3px] h-[3px] rounded-full bg-gray-300" />
                            <span className="font-semibold text-[var(--text-secondary)]">{claim.method}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 ml-[8px] flex items-center gap-1">
                      <span className={cn(
                        "inline-flex items-center px-[10px] py-[6px] rounded-[9999px] text-[11px] font-bold",
                        isNakuha ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]"
                      )}>
                        {claim.status}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[var(--text-muted)] opacity-50" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-50" />
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
                        <div className="mt-[16px] pt-[16px] border-t border-[#E8ECF7] flex flex-col gap-[8px]">
                          <div className="flex justify-between items-center">
                            <span className="text-[13px] text-[var(--text-muted)] font-medium">VeriFund ID</span>
                            <span className="font-mono text-[13px] font-bold text-[var(--red)] bg-[var(--red-light)] px-[8px] py-[2px] rounded-[6px]">{claim.beneficiaryId}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[13px] text-[var(--text-muted)] font-medium">Oras</span>
                            <span className="text-[13px] font-bold text-[var(--text-secondary)]">{new Date(claim.verifiedAt).toLocaleString()}</span>
                          </div>
                          {!isNakuha && claim.reason && (
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-[13px] text-[var(--text-muted)] font-medium">Dahilan</span>
                              <span className="text-[13px] font-bold text-[var(--danger)] max-w-[200px] text-right leading-tight">{claim.reason}</span>
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
