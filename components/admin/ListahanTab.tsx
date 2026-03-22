"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ListahanTabProps {
  listahan: any[]
}

export function ListahanTab({ listahan }: ListahanTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const nakuhaCount = listahan.filter(item => item.status === "NAKUHA").length
  const tinanggihanCount = listahan.filter(item => item.status === "TINANGGIHAN").length

  return (
    <div className="flex flex-col h-full animate-in fade-in px-[16px] pt-[16px] pb-[32px]">
      <div className="flex justify-between items-center mb-[16px]">
        <h2 className="text-[18px] font-bold text-[var(--text-primary)]">Listahan Ngayon</h2>
        <span className="bg-[var(--success-light)] text-[var(--success)] text-[11px] font-bold px-[12px] py-[4px] rounded-full flex items-center gap-[4px]">
          <CheckCircle2 className="w-[12px] h-[12px]" />
          {nakuhaCount} Nakuha
        </span>
      </div>

      {/* Summary Stats - 3 Distinct Cards */}
      <div className="flex gap-[12px] mb-[24px]">
        <div className="flex-1 bg-[var(--navy-deep)] rounded-[16px] p-[16px] flex flex-col items-center justify-center shadow-sm">
          <div className="text-[24px] font-bold text-white leading-none">{listahan.length}</div>
          <div className="text-[10px] text-white/70 font-bold uppercase mt-[4px] tracking-wide">Lahat</div>
        </div>
        <div className="flex-1 bg-[var(--success)] rounded-[16px] p-[16px] flex flex-col items-center justify-center shadow-sm">
          <div className="text-[24px] font-bold text-white leading-none">{nakuhaCount}</div>
          <div className="text-[10px] text-white/80 font-bold uppercase mt-[4px] tracking-wide">Nakuha</div>
        </div>
        <div className="flex-1 bg-[var(--danger)] rounded-[16px] p-[16px] flex flex-col items-center justify-center shadow-sm">
          <div className="text-[24px] font-bold text-white leading-none">{tinanggihanCount}</div>
          <div className="text-[10px] text-white/80 font-bold uppercase mt-[4px] tracking-wide">Tinanggihan</div>
        </div>
      </div>

      <div className="flex flex-col gap-[12px]">
        {listahan.map((item, i) => {
          const isNakuha = item.status === "NAKUHA"
          const isExpanded = expandedId === `${i}-${item.verifundId}`

          return (
            <div 
              key={`${i}-${item.verifundId}`} 
              className={cn(
                "bg-white rounded-[12px] p-[16px] shadow-sm transition-colors cursor-pointer border",
                !isNakuha ? "border-[var(--danger-light)] bg-red-50/30" : "border-[#E8ECF7]"
              )}
              onClick={() => setExpandedId(isExpanded ? null : `${i}-${item.verifundId}`)}
            >
              <div className="flex items-center gap-[12px]">
                <div className={cn(
                  "w-[44px] h-[44px] rounded-full flex items-center justify-center font-bold text-[16px] text-white shrink-0 shadow-sm",
                  isNakuha ? "bg-[var(--ph-blue)]" : "bg-[var(--ph-red)]"
                )}>
                  {item.initials}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h4 className="text-[15px] font-bold text-[var(--text-primary)] truncate leading-tight">{item.name}</h4>
                  <div className="text-[12px] text-[var(--text-muted)] mt-[2px] flex items-center gap-[6px]">
                    <span>{item.time}</span>
                    {item.method && (
                      <>
                        <span className="w-[3px] h-[3px] rounded-full bg-gray-300" />
                        <span className="font-semibold text-[color:var(--text-secondary)]">{item.method}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-[8px]">
                  <span className={cn(
                    "inline-flex items-center px-[10px] py-[6px] rounded-full text-[11px] font-bold",
                    isNakuha ? "bg-[var(--success-light)] text-[var(--success)]" : "bg-[var(--danger-light)] text-[var(--danger)]"
                  )}>
                    {item.status}
                  </span>
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
                        <span className="font-mono text-[13px] font-bold text-[var(--ph-gold)] bg-[var(--info-light)] px-[8px] py-[2px] rounded-md">{item.verifundId}</span>
                      </div>
                      {!isNakuha && item.reason && (
                        <div className="flex justify-between items-center">
                          <span className="text-[13px] text-[var(--text-muted)] font-medium">Dahilan</span>
                          <span className="text-[13px] font-bold text-[var(--danger)]">{item.reason}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
