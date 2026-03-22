"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
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
    <div className="flex flex-col h-full relative overflow-clip animate-in fade-in">
      {/* Current Dist Info */}
      <div className="v-card bg-red-50 border-[var(--ph-red)]/20 mb-6">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-[15px] text-[var(--text-primary)]">SAP 2025 — Una</h3>
          <span className="bg-[var(--success-green)] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">AKTIBO</span>
        </div>
        <p className="text-[12px] text-[var(--text-muted)]">Marso 15, 2025 • ₱1,500 bawat isa</p>
      </div>

      <QRScanner 
        isScanning={!result}
        onScanSuccess={(code) => handleVerify(code)}
      />

      <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-[12px] text-[var(--text-muted)] font-bold">o</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <div className="flex gap-2">
        <Input 
          value={manualCode}
          onChange={(e: any) => setManualCode(e.target.value)}
          placeholder="I-type ang QR code"
          className="bg-white flex-1"
        />
        <button 
          onClick={() => handleVerify(manualCode)}
          disabled={!manualCode}
          className="h-[52px] bg-gray-900 text-white px-6 font-bold rounded-[12px] disabled:bg-gray-300 transition-colors"
        >
          I-Verify
        </button>
      </div>

      {/* Result Cards */}
      {result && result.result === "VERIFIED" && (
        <div className="absolute inset-x-0 bottom-0 bg-white border border-gray-200 shadow-2xl rounded-t-[24px] p-6 animate-in slide-in-from-bottom-12 z-10">
          <div className="w-16 h-1 h-2 bg-gray-300 rounded-full mx-auto mb-6 absolute top-2 left-1/2 -translate-x-1/2" />
          <div className="w-[48px] h-[48px] bg-[var(--success-green)] rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[20px] font-bold text-[var(--success-green)] text-center mb-1">VERIFIED</h2>
          <p className="text-[13px] text-[var(--text-muted)] text-center mb-6">Maaaring kumuha ng ayuda</p>

          <div className="flex items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
            <div className="w-12 h-12 bg-[var(--ph-blue)] text-white font-bold rounded-full flex items-center justify-center shrink-0">
              {result.initials}
            </div>
            <div>
              <p className="font-bold text-[16px] text-[var(--text-primary)]">{result.name}</p>
              <p className="text-[12px] text-[var(--text-muted)]">{result.barangay}</p>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <span className="text-[22px] font-bold text-[color:var(--ph-gold)]">₱1,500</span>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full h-[56px] bg-[var(--success-green)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-95"
          >
            Kumpirmahin — Nakuha na!
          </button>
        </div>
      )}

      {result && result.result === "REJECTED" && (
        <div className="absolute inset-x-0 bottom-0 bg-white border border-red-200 shadow-2xl rounded-t-[24px] p-6 animate-in slide-in-from-bottom-12 z-10 border-t-4 border-t-[var(--ph-red)]">
          <div className="w-[48px] h-[48px] bg-[var(--ph-red)] rounded-full flex items-center justify-center mx-auto mb-2 mt-2">
            <XCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[20px] font-bold text-[var(--ph-red)] text-center mb-1">HINDI PUWEDE</h2>
          <p className="text-[14px] text-[var(--text-primary)] text-center font-semibold mb-8">{result.reason}</p>

          <button 
            onClick={() => setResult(null)}
            className="w-full h-[56px] border-[1.5px] border-gray-300 text-gray-700 font-bold rounded-[14px] text-[15px] transition-transform active:scale-95"
          >
            Scan Ulit
          </button>
        </div>
      )}
    </div>
  )
}
