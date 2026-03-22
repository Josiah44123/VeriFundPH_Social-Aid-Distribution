"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListahanTabProps {
  listahan: any[]
}

export function ListahanTab({ listahan }: ListahanTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const nakuhaCount = listahan.filter(item => item.status === "NAKUHA").length
  const tinanggihanCount = listahan.filter(item => item.status === "TINANGGIHAN").length

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Listahan Ngayon</h2>
        <span className="bg-[var(--success-green)]/10 text-[var(--success-green)] text-[12px] font-bold px-3 py-1 rounded-full">
          {nakuhaCount} Nakuha
        </span>
      </div>

      {/* Summary Bar */}
      <div className="bg-[var(--navy-deep)] rounded-[12px] p-4 flex justify-between mb-6 shadow-sm">
        <div className="text-center">
          <div className="text-[20px] font-bold text-white">{listahan.length}</div>
          <div className="text-[11px] text-gray-400 font-medium uppercase mt-0.5">Total Scanned</div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <div className="text-[20px] font-bold text-[var(--success-green)]">{nakuhaCount}</div>
          <div className="text-[11px] text-gray-400 font-medium uppercase mt-0.5">Nakuha</div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center">
          <div className="text-[20px] font-bold text-[var(--ph-red)]">{tinanggihanCount}</div>
          <div className="text-[11px] text-gray-400 font-medium uppercase mt-0.5">Tinanggihan</div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-32">
        {listahan.map((item, i) => {
          const isNakuha = item.status === "NAKUHA"
          const isExpanded = expandedId === `${i}-${item.verifundId}`

          return (
            <div 
              key={`${i}-${item.verifundId}`} 
              className={cn(
                "v-card p-4 transition-colors cursor-pointer border-[1px]",
                !isNakuha && "bg-[rgba(206,17,38,0.04)] border-[var(--ph-red)]/20"
              )}
              onClick={() => setExpandedId(isExpanded ? null : `${i}-${item.verifundId}`)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0",
                  isNakuha ? "bg-[var(--ph-blue)]" : "bg-[var(--ph-red)]"
                )}>
                  {item.initials}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-[var(--text-primary)] truncate">{item.name}</h4>
                  <div className="text-[12px] text-[var(--text-muted)] mt-0.5 flex gap-2">
                    <span>{item.time}</span>
                    {item.method && (
                      <>
                        <span>•</span>
                        <span className="font-semibold">{item.method}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold",
                    isNakuha ? "bg-[var(--success-green)]/10 text-[var(--success-green)]" : "bg-[var(--ph-red)]/10 text-[var(--ph-red)]"
                  )}>
                    {isNakuha ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {item.status}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[12px] text-[var(--text-muted)]">VeriFund ID</span>
                    <span className="font-mono text-[13px] font-semibold text-[color:var(--ph-gold)]">{item.verifundId}</span>
                  </div>
                  {!isNakuha && item.reason && (
                    <div className="flex justify-between items-center">
                      <span className="text-[12px] text-[var(--text-muted)]">Dahilan</span>
                      <span className="text-[13px] font-semibold text-[var(--ph-red)]">{item.reason}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
