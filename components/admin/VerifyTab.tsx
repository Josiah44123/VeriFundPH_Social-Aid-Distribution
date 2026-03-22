"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { QR_RESPONSES } from "@/lib/data"
import { cn } from "@/lib/utils"

interface VerifyTabProps {
  onConfirmClaim: (data: any) => void
}

export function VerifyTab({ onConfirmClaim }: VerifyTabProps) {
  const [manualCode, setManualCode] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleVerify = (code: string) => {
    const response = QR_RESPONSES[code]
    if (response) {
      setResult(response)
    } else {
      setResult({
        result: "REJECTED",
        reason: "Hindi nahanap sa listahan."
      })
    }
  }

  const handleConfirm = () => {
    onConfirmClaim(result)
    setResult(null)
    setManualCode("")
    alert("Na-record ang pagkuha ni " + result.name)
  }

  return (
    <div className="flex flex-col h-full relative overflow-clip animate-in fade-in px-[16px] pt-[16px] pb-[32px]">
      {/* Current Dist Info */}
      <div className="bg-[var(--ph-blue)] rounded-[16px] p-[16px] mb-[24px] shadow-sm flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white opacity-5 rounded-full -mt-[40px] -mr-[40px] pointer-events-none" />
        <div className="flex justify-between items-start mb-[8px] relative z-10">
          <h3 className="font-bold text-[16px] text-white">SAP 2025 — Una</h3>
          <span className="bg-white text-[var(--ph-blue)] text-[11px] px-[10px] py-[4px] rounded-full font-bold shadow-sm">AKTIBO</span>
        </div>
        <p className="text-[13px] text-white/80 font-medium relative z-10">Marso 15, 2025 • ₱1,500 bawat isa</p>
      </div>

      <QRScanner 
        isScanning={!result}
        onScanSuccess={(code) => handleVerify(code)}
      />

      <div className="flex items-center gap-[16px] my-[24px]">
        <div className="h-[2px] bg-[#E8ECF7] flex-1 rounded-full" />
        <span className="text-[13px] text-[var(--text-muted)] font-bold uppercase tracking-wider">o</span>
        <div className="h-[2px] bg-[#E8ECF7] flex-1 rounded-full" />
      </div>

      <div className="flex gap-[8px]">
        <input 
          value={manualCode}
          onChange={(e: any) => setManualCode(e.target.value)}
          placeholder="I-type ang QR code"
          className="bg-white flex-1 h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] border-transparent outline-none transition-colors focus:border-[var(--ph-red)] font-mono shadow-sm"
        />
        <button 
          onClick={() => handleVerify(manualCode)}
          disabled={!manualCode}
          className="h-[52px] bg-[var(--navy-deep)] text-white px-[24px] font-bold rounded-[14px] disabled:bg-[#E8ECF7] disabled:text-[#A0ABC0] transition-colors shadow-sm active:scale-[0.98] disabled:active:scale-100"
        >
          I-Verify
        </button>
      </div>

      {/* Result Cards */}
      {result && result.result === "VERIFIED" && (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.1)] rounded-t-[28px] p-[24px] pb-[calc(24px+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-[100%] duration-300 z-50 flex flex-col items-center border-[1.5px] border-[#E8ECF7]">
          <div className="w-[48px] h-[6px] bg-[#E8ECF7] rounded-full mb-[24px]" />
          
          <div className="w-[64px] h-[64px] bg-[var(--success)] rounded-full flex items-center justify-center mb-[16px] shadow-sm animate-in zoom-in-50 delay-150 relative">
            <div className="absolute inset-0 bg-[var(--success)] rounded-full animate-ping opacity-20" />
            <CheckCircle2 className="w-[32px] h-[32px] text-white relative z-10" />
          </div>
          <h2 className="text-[24px] font-bold text-[var(--success)] text-center mb-[4px] leading-tight">VERIFIED</h2>
          <p className="text-[14px] text-[var(--text-muted)] font-medium text-center mb-[24px]">Maaaring kumuha ng ayuda</p>

          <div className="flex items-center gap-[16px] mb-[24px] bg-[var(--surface-page)] w-full p-[16px] rounded-[20px] border border-[#E8ECF7]">
            <div className="w-[56px] h-[56px] bg-[var(--ph-blue)] text-white font-bold text-[20px] rounded-full flex items-center justify-center shrink-0 shadow-sm border-[2px] border-white">
              {result.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[18px] text-[var(--text-primary)] truncate leading-tight mb-[2px]">{result.name}</p>
              <p className="text-[13px] text-[var(--text-muted)] truncate">{result.barangay}</p>
            </div>
          </div>
          
          <div className="text-center mb-[32px] w-full bg-[var(--info-light)] py-[12px] rounded-[16px] border border-[var(--ph-blue)]/10">
            <span className="text-[12px] text-[var(--text-muted)] font-bold uppercase tracking-widest block mb-[2px]">Halaga</span>
            <span className="text-[28px] font-bold text-[var(--ph-gold-dark)] leading-none block">₱1,500</span>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full h-[56px] bg-[var(--success)] text-white font-bold rounded-[16px] text-[16px] transition-transform active:scale-[0.98] shadow-[0_4px_12px_rgba(34,197,94,0.3)] hover:bg-green-600"
          >
            Kumpirmahin — Nakuha na!
          </button>
        </div>
      )}

      {result && result.result === "REJECTED" && (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.1)] rounded-t-[28px] p-[24px] pb-[calc(24px+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-[100%] duration-300 z-50 flex flex-col items-center border-[1.5px] border-[var(--danger)]">
          <div className="w-[48px] h-[6px] bg-[#E8ECF7] rounded-full mb-[24px]" />

          <div className="w-[64px] h-[64px] bg-[var(--danger)] rounded-full flex items-center justify-center mb-[16px] shadow-sm animate-in zoom-in-50 delay-150">
            <XCircle className="w-[32px] h-[32px] text-white" />
          </div>
          <h2 className="text-[24px] font-bold text-[var(--danger)] text-center mb-[8px] leading-tight">HINDI PUWEDE</h2>
          <div className="w-full bg-[var(--danger-light)] p-[16px] rounded-[16px] mb-[32px]">
            <p className="text-[15px] text-[var(--danger)] text-center font-bold">{result.reason}</p>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="w-full h-[56px] bg-[var(--surface-page)] text-[var(--text-primary)] font-bold rounded-[16px] text-[16px] transition-transform active:scale-[0.98] shadow-sm border-[1.5px] border-[#E8ECF7] hover:bg-gray-100"
          >
            Scan Ulit
          </button>
        </div>
      )}
      
      {/* Backdrop for bottom sheet */}
      {result && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 animate-in fade-in"
          onClick={() => result.result === "REJECTED" && setResult(null)}
        />
      )}
    </div>
  )
}
