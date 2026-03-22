"use client"

import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { useVeriFundStore } from "@/lib/store"
import type { Claim, AuditEntry, FraudFlag } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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
  const [showManualEntry, setShowManualEntry] = useState(false)

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

  const handleConfirm = () => {
    if (!result?.beneficiary) return
    const { beneficiary } = result
    const method = "Cash" // Simplified per the new button requirement "KUMPIRMAHIN" instead of 3 buttons

    const claim: Claim = {
      id: `CLM-${Date.now()}`,
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
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
    setShowManualEntry(false)
    
    // Toast notification would go here in a full app, using a global toast system
    // but the store update will automatically update Listahan.
  }

  const initials = (b: any) => `${b.firstName[0]}${b.lastName[0]}`

  return (
    <div className="flex flex-col h-full animate-in fade-in pb-[100px] bg-[var(--surface-page)] min-h-full">
      <div className="px-[16px] pt-[24px]">
        {/* Distribution Info Card */}
        <div className="bg-white rounded-[16px] p-[16px] mb-[32px] shadow-[var(--shadow-sm)] flex border-l-[3px] border-l-[var(--red)]">
          <div className="flex-1">
            <h3 className="font-bold text-[16px] text-[var(--text-primary)] leading-tight mb-[4px]">{ACTIVE_DISTRIBUTION.title}</h3>
            <p className="text-[13px] text-[var(--text-muted)] font-medium">{ACTIVE_DISTRIBUTION.date} • ₱{ACTIVE_DISTRIBUTION.amount.toLocaleString()}</p>
          </div>
          <div className="shrink-0 flex items-center">
            <span className="bg-[var(--success)] text-white text-[11px] px-[12px] py-[4px] rounded-[9999px] font-bold">AKTIBO</span>
          </div>
        </div>

        {/* Scanner */}
        <QRScanner 
          isScanning={!result}
          onScanSuccess={(code) => handleVerify(code)}
        />

        {/* Manual Entry Toggle */}
        <div className="text-center mt-[24px]">
          <button 
            onClick={() => setShowManualEntry(true)}
            className="text-[13px] font-bold text-[var(--text-muted)] border-b border-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors pb-1"
          >
            Hindi gumagana ang camera?
          </button>
        </div>
      </div>

      {/* Manual Entry Bottom Sheet */}
      <AnimatePresence>
        {showManualEntry && !result && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualEntry(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white z-50 rounded-t-[24px] shadow-[var(--shadow-lg)] pb-[calc(24px+env(safe-area-inset-bottom))] px-[24px] pt-[12px]"
            >
              <div className="flex justify-center mb-[24px]">
                <div className="w-[48px] h-[5px] bg-[#E8ECF7] rounded-full" />
              </div>
              <h3 className="text-[18px] font-bold text-[var(--text-primary)] mb-[16px] text-center">I-type ang VeriFund ID</h3>
              <input 
                value={manualCode}
                onChange={(e: any) => setManualCode(e.target.value)}
                placeholder="VF-2025-0001-STC"
                className="w-full h-[52px] rounded-[14px] px-[16px] bg-[var(--surface-input)] text-[15px] border-[1.5px] border-transparent outline-none transition-colors focus:border-[var(--blue)] font-mono text-center tracking-wide mb-[16px]"
              />
              <button 
                onClick={() => handleVerify(manualCode)}
                disabled={!manualCode}
                className="w-full h-[52px] bg-[var(--navy)] text-white font-bold rounded-[14px] text-[15px] tracking-[-0.2px] disabled:bg-[#E8ECF7] disabled:text-[#A0ABC0] transition-colors shadow-[var(--shadow-sm)]"
              >
                I-Verify
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* VERIFIED Result Bottom Sheet */}
      <AnimatePresence>
        {result?.type === "VERIFIED" && result.beneficiary && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResult(null)}
              className="fixed inset-0 bg-[#1C1C1E]/60 z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white shadow-[var(--shadow-lg)] rounded-t-[24px] pb-[calc(24px+env(safe-area-inset-bottom))] z-50 overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="h-[4px] w-full bg-[var(--red)] absolute top-0 left-0" />
              
              <div className="pt-[16px] px-[24px] flex flex-col items-center relative">
                <div className="w-[48px] h-[5px] bg-[#E8ECF7] rounded-full mb-[24px]" />
                
                {/* Spring Checkmark */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-[72px] h-[72px] bg-[var(--success)] rounded-full flex items-center justify-center mb-[16px] shadow-[var(--shadow-sm)] text-white"
                >
                  <CheckCircle2 className="w-[40px] h-[40px]" />
                </motion.div>

                <h2 className="text-[22px] font-bold text-[var(--text-primary)] text-center mb-[4px] leading-tight">Verified!</h2>
                <p className="text-[14px] text-[var(--text-muted)] font-medium text-center mb-[24px]">Pwedeng kumuha ng ayuda</p>

                {/* Recipient Row */}
                <div className="flex items-center gap-[16px] mb-[24px] w-full">
                  <div className="w-[52px] h-[52px] bg-[var(--navy)] text-white font-bold text-[18px] rounded-full flex items-center justify-center shrink-0">
                    {initials(result.beneficiary)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[16px] text-[var(--text-primary)] truncate leading-tight mb-[2px]">{result.beneficiary.firstName} {result.beneficiary.lastName}</p>
                    <p className="text-[13px] text-[var(--text-muted)] truncate">{result.beneficiary.barangay}</p>
                  </div>
                </div>
                
                <div className="text-center mb-[32px] w-full">
                  <span className="text-[24px] font-extrabold text-[var(--red)] leading-none block tracking-tight">₱{ACTIVE_DISTRIBUTION.amount.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full h-[52px] bg-[var(--success)] text-white font-bold rounded-[14px] text-[15px] tracking-[-0.2px] transition-transform active:scale-[0.98] shadow-[var(--shadow-sm)] mb-[16px]"
                >
                  KUMPIRMAHIN
                </button>
                <button 
                  onClick={() => setResult(null)}
                  className="text-[13px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  I-cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REJECTED Result Bottom Sheet */}
      <AnimatePresence>
        {result?.type === "REJECTED" && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setResult(null)}
              className="fixed inset-0 bg-[#1C1C1E]/60 z-40"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white shadow-[var(--shadow-lg)] rounded-t-[24px] pb-[calc(24px+env(safe-area-inset-bottom))] z-50 overflow-hidden"
            >
              {/* Top Accent Bar */}
              <div className="h-[4px] w-full bg-[var(--danger)] absolute top-0 left-0" />
              
              <div className="pt-[16px] px-[24px] flex flex-col items-center relative">
                <div className="w-[48px] h-[5px] bg-[#E8ECF7] rounded-full mb-[24px]" />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-[72px] h-[72px] bg-[var(--danger)] rounded-full flex items-center justify-center mb-[16px] shadow-[var(--shadow-sm)] text-white"
                >
                  <XCircle className="w-[40px] h-[40px]" />
                </motion.div>

                <h2 className="text-[22px] font-bold text-[var(--danger)] text-center mb-[8px] leading-tight">Hindi Puwede</h2>
                <div className="w-full bg-[var(--danger-light)] p-[16px] rounded-[16px] mb-[32px]">
                  <p className="text-[14px] text-[var(--danger)] text-center font-bold tracking-tight leading-[1.4]">{result.reason}</p>
                </div>

                <button 
                  onClick={() => setResult(null)}
                  className="w-full h-[52px] bg-white border-[1.5px] border-[var(--red)] text-[var(--red)] font-bold rounded-[14px] text-[15px] tracking-[-0.2px] transition-transform active:scale-[0.98] shadow-[var(--shadow-sm)]"
                >
                  Scan Ulit
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
    </div>
  )
}
