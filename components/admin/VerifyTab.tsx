"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { useVeriFundStore } from "@/lib/store"
import type { Claim, AuditEntry, FraudFlag } from "@/lib/store"
import { cn } from "@/lib/utils"

const OFFICER_NAME = "Josefa Reyes"
const BARANGAY = "Sta. Cruz, Quezon City"
const ACTIVE_DISTRIBUTION = {
  id: "SAP-2025-Q1",
  title: "SAP 2025 — Una",
  amount: 1500,
  date: "Marso 15, 2025",
}

export function VerifyTab() {
  const { beneficiaries, claims, addClaim, addAuditEntry, addFraudFlag } = useVeriFundStore()
  const [manualCode, setManualCode] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleVerify = (code: string) => {
    const trimmed = code.trim()
    const beneficiary = beneficiaries.find(b => b.qrData === trimmed || b.id === trimmed)
    
    if (!beneficiary) {
      setResult({ type: "REJECTED", reason: "Hindi nahanap sa listahan ng mga benepisyaryo." })
      return
    }

    if (beneficiary.status === "FLAGGED") {
      setResult({ type: "REJECTED", reason: "Naka-flag ang beneficiary na ito. Hindi puwedeng mag-claim.", beneficiary })
      return
    }

    // Check for duplicate claim in this distribution
    const existingClaim = claims.find(
      c => c.beneficiaryId === beneficiary.id && c.distributionId === ACTIVE_DISTRIBUTION.id
    )

    if (existingClaim) {
      setResult({ type: "REJECTED", reason: "Nakakuha na sa distribution na ito.", beneficiary })
      // Add fraud flag for velocity anomaly
      const flag: FraudFlag = {
        id: `FRD-${Date.now()}`,
        type: "VELOCITY_ANOMALY",
        beneficiaryId: beneficiary.id,
        details: `Sinubukang mag-claim nang dalawang beses para sa ${ACTIVE_DISTRIBUTION.title}`,
        flaggedAt: new Date().toISOString(),
        resolved: false,
      }
      addFraudFlag(flag)
      const auditEntry: AuditEntry = {
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "FLAGGED",
        actorName: "SYSTEM",
        actorRole: "SYSTEM",
        targetId: beneficiary.id,
        targetName: `${beneficiary.firstName} ${beneficiary.lastName}`,
        barangay: BARANGAY,
        details: `Velocity anomaly — duplicate claim attempt blocked for ${ACTIVE_DISTRIBUTION.title}`,
      }
      addAuditEntry(auditEntry)
      return
    }

    setResult({ type: "VERIFIED", beneficiary })
  }

  const handleConfirm = (method: "Cash" | "GCash" | "Palawan") => {
    if (!result?.beneficiary) return
    const { beneficiary } = result

    const claim: Claim = {
      id: `CLM-${Date.now()}`,
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.middleName ? beneficiary.middleName + " " : ""}${beneficiary.lastName}`,
      distributionId: ACTIVE_DISTRIBUTION.id,
      distributionTitle: ACTIVE_DISTRIBUTION.title,
      amount: ACTIVE_DISTRIBUTION.amount,
      method,
      status: "NAKUHA",
      verifiedBy: OFFICER_NAME,
      verifiedAt: new Date().toISOString(),
      barangay: BARANGAY,
    }

    const auditEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "CLAIMED",
      actorName: OFFICER_NAME,
      actorRole: "OFFICER",
      targetId: beneficiary.id,
      targetName: claim.beneficiaryName,
      barangay: BARANGAY,
      details: `Claim confirmed — ${ACTIVE_DISTRIBUTION.title} — ₱${ACTIVE_DISTRIBUTION.amount.toLocaleString()} ${method}`,
    }

    addClaim(claim)
    addAuditEntry(auditEntry)
    setResult(null)
    setManualCode("")
  }

  const initials = (b: any) => `${b.firstName[0]}${b.lastName[0]}`

  return (
    <div className="flex flex-col h-full relative overflow-clip animate-in fade-in px-[16px] pt-[16px] pb-[32px]">
      {/* Current Distribution Info */}
      <div className="bg-[var(--ph-blue)] rounded-[16px] p-[16px] mb-[24px] shadow-sm flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white opacity-5 rounded-full -mt-[40px] -mr-[40px] pointer-events-none" />
        <div className="flex justify-between items-start mb-[8px] relative z-10">
          <h3 className="font-bold text-[16px] text-white">{ACTIVE_DISTRIBUTION.title}</h3>
          <span className="bg-white text-[var(--ph-blue)] text-[11px] px-[10px] py-[4px] rounded-full font-bold shadow-sm">AKTIBO</span>
        </div>
        <p className="text-[13px] text-white/80 font-medium relative z-10">{ACTIVE_DISTRIBUTION.date} • ₱{ACTIVE_DISTRIBUTION.amount.toLocaleString()} bawat isa</p>
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
          placeholder="I-type ang VF ID o QR code"
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

      {/* VERIFIED Result */}
      {result?.type === "VERIFIED" && result.beneficiary && (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.1)] rounded-t-[28px] p-[24px] pb-[calc(24px+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-[100%] duration-300 z-50 flex flex-col items-center border-[1.5px] border-[#E8ECF7]">
          <div className="w-[48px] h-[6px] bg-[#E8ECF7] rounded-full mb-[24px]" />
          
          <div className="w-[64px] h-[64px] bg-[var(--success)] rounded-full flex items-center justify-center mb-[16px] shadow-sm animate-in zoom-in-50 delay-150 relative">
            <div className="absolute inset-0 bg-[var(--success)] rounded-full animate-ping opacity-20" />
            <CheckCircle2 className="w-[32px] h-[32px] text-white relative z-10" />
          </div>
          <h2 className="text-[24px] font-bold text-[var(--success)] text-center mb-[4px] leading-tight">VERIFIED</h2>
          <p className="text-[14px] text-[var(--text-muted)] font-medium text-center mb-[24px]">Maaaring kumuha ng ayuda</p>

          <div className="flex items-center gap-[16px] mb-[16px] bg-[var(--surface-page)] w-full p-[16px] rounded-[20px] border border-[#E8ECF7]">
            <div className="w-[56px] h-[56px] bg-[var(--ph-blue)] text-white font-bold text-[20px] rounded-full flex items-center justify-center shrink-0 shadow-sm border-[2px] border-white">
              {initials(result.beneficiary)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[18px] text-[var(--text-primary)] truncate leading-tight mb-[2px]">{result.beneficiary.firstName} {result.beneficiary.lastName}</p>
              <p className="text-[13px] text-[var(--text-muted)] truncate">{result.beneficiary.barangay}</p>
            </div>
          </div>
          
          <div className="text-center mb-[16px] w-full bg-[var(--info-light)] py-[12px] rounded-[16px] border border-[var(--ph-blue)]/10">
            <span className="text-[12px] text-[var(--text-muted)] font-bold uppercase tracking-widest block mb-[2px]">Halaga</span>
            <span className="text-[28px] font-bold text-[var(--ph-gold)] leading-none block">₱{ACTIVE_DISTRIBUTION.amount.toLocaleString()}</span>
          </div>

          <p className="text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-[8px] self-start">Paraan ng Bayad:</p>
          <div className="flex gap-[8px] w-full mb-[8px]">
            {(["Cash", "GCash", "Palawan"] as const).map(method => (
              <button
                key={method}
                onClick={() => handleConfirm(method)}
                className="flex-1 h-[52px] bg-[var(--success)] text-white font-bold rounded-[14px] text-[14px] transition-transform active:scale-[0.97] shadow-sm hover:opacity-90"
              >
                {method}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* REJECTED Result */}
      {result?.type === "REJECTED" && (
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
            onClick={() => { setResult(null); setManualCode("") }}
            className="w-full h-[56px] bg-[var(--surface-page)] text-[var(--text-primary)] font-bold rounded-[16px] text-[16px] transition-transform active:scale-[0.98] shadow-sm border-[1.5px] border-[#E8ECF7] hover:bg-gray-100"
          >
            Scan Ulit
          </button>
        </div>
      )}
      
      {/* Backdrop */}
      {result && (
        <div 
          className="fixed inset-0 z-40 animate-in fade-in"
          style={{ background: 'rgba(13, 27, 62, 0.6)' }}
          onClick={() => result.type === "REJECTED" && setResult(null)}
        />
      )}
    </div>
  )
}
