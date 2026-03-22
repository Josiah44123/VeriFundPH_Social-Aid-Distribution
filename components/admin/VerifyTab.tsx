"use client"

import { useState, useRef, useCallback } from "react"
import { CheckCircle2, XCircle, Upload as UploadIcon } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { useVeriFundStore } from "@/lib/store"
import type { Claim, AuditEntry } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { DEFAULT_BARANGAY, OFFICER_CREDENTIALS } from "@/lib/constants"

const OFFICER_NAME = OFFICER_CREDENTIALS[0].name
const BARANGAY = DEFAULT_BARANGAY
const ACTIVE_DISTRIBUTION = {
  id: "SAP-2025-Q1",
  title: "SAP 2025 — Una",
  amount: 1500,
  date: "Marso 15, 2025",
} as any

export function VerifyTab() {
  const store = useVeriFundStore()
  
  const [scanResult, setScanResult] = useState<{
    type: 'VERIFIED' | 'REJECTED';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beneficiary?: any;
    reason?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    distribution?: any;
  } | null>(null);

  const [showResultSheet, setShowResultSheet] = useState(false);
  const [manualCode, setManualCode] = useState("")
  const [showManualEntry, setShowManualEntry] = useState(false)
  
  // Bug 2: QR Upload State
  const [isProcessing, setIsProcessing] = useState(false)
  const qrImageInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type?: string) => {
    alert(msg)
  }

  const handleVerify = useCallback((vfId: string) => {
    const id = vfId.trim();
    if (!id) return;

    setIsProcessing(false);

    const beneficiary = store.beneficiaries.find(
      b => b.id === id || b.qrData === id
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activeDistribution = store.distributions?.find((d: any) => d.status === 'ACTIVE') || ACTIVE_DISTRIBUTION;

    const alreadyClaimed = activeDistribution
      ? store.claims.some(
          c => c.beneficiaryId === id && c.distributionId === activeDistribution.id
        )
      : false;

    if (!beneficiary) {
      setScanResult({ type: 'REJECTED', reason: 'Hindi nahanap sa listahan.' });
    } else if (alreadyClaimed) {
      setScanResult({ type: 'REJECTED', reason: 'Nakakuha na sa distribution na ito.' });
    } else {
      setScanResult({ type: 'VERIFIED', beneficiary, distribution: activeDistribution });
    }

    setShowManualEntry(false);
    setShowResultSheet(true);
  }, [store]);

  const handleManualVerify = () => {
    handleVerify(manualCode);
    setManualCode('');
  };

  const handleQRImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true); // show loading state

    try {
      // Use html5-qrcode to decode from file
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader-hidden');
      const result = await html5QrCode.scanFile(file, true);
      await html5QrCode.clear();
      handleVerify(result); // same handler as camera scan
    } catch (err) {
      // If library fails, show manual entry as fallback
      setIsProcessing(false);
      setShowManualEntry(true);
      showToast('Hindi ma-read ang QR. I-type na lang ang VF ID.', 'warning');
    }

    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const handleConfirm = () => {
    if (!scanResult?.beneficiary) return
    const { beneficiary, distribution } = scanResult
    const method = "Cash" 
    const activeDist = distribution || ACTIVE_DISTRIBUTION;

    const claim: Claim = {
      id: `CLM-${Date.now()}`,
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      distributionId: activeDist.id,
      distributionTitle: activeDist.title,
      amount: activeDist.amount,
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
      details: `Claim confirmed — ${activeDist.title} — ₱${activeDist.amount.toLocaleString()} ${method}`,
    }

    store.addClaim(claim)
    store.addAuditEntry(auditEntry)
    setShowResultSheet(false)
    setScanResult(null)
    setManualCode("")
    setShowManualEntry(false)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          isScanning={!showResultSheet}
          onScanSuccess={(code) => handleVerify(code)}
        />

        {/* Hidden div required by html5-qrcode for file scanning */}
        <div id="qr-reader-hidden" style={{ display: 'none' }} />

        {/* Hidden file input */}
        <input
          ref={qrImageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleQRImageUpload}
        />

        {/* Bug 2 Upload UI below scanner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginTop: 16,
        }}>
          {/* Primary upload option */}
          <button
            onClick={() => qrImageInputRef.current?.click()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 12,
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UploadIcon size={16} />
            I-upload ang QR Code Image
          </button>

          {/* Manual text entry link */}
          <button
            onClick={() => setShowManualEntry(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: 12,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: '4px 8px',
            }}
          >
            I-type ang VeriFund ID nang mano-mano
          </button>
        </div>
      </div>

      {isProcessing && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          zIndex: 10,
        }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid #FF0048',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'white', fontSize: 13, marginTop: 12 }}>
            Binabasa ang QR code...
          </p>
        </div>
      )}

      {/* Manual Entry Bottom Sheet */}
      <AnimatePresence>
        {showManualEntry && !showResultSheet && (
          <>
            <motion.div 
              key="manual-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowManualEntry(false)}
              className="fixed inset-0 bg-black/40 z-[55]"
            />
            <motion.div 
              key="manual-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white z-[60] rounded-t-[24px] shadow-[var(--shadow-lg)] px-[20px] pt-[16px] pb-[calc(24px+env(safe-area-inset-bottom)+80px)] md:pb-[calc(32px+env(safe-area-inset-bottom))]"
            >
              {/* Drag handle */}
              <div className="w-[32px] h-[4px] bg-[#E8ECF7] rounded-full mx-auto mb-[16px]" />

              <p className="text-[16px] font-bold text-[var(--text-primary)] mb-[16px] text-center">
                I-type ang VeriFund ID
              </p>

              <input
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="VF-2025-0001-STC"
                className="w-full h-[52px] bg-[var(--surface-input)] border-[1.5px] border-transparent rounded-[14px] px-[16px] text-[15px] font-mono mb-[12px] block outline-none focus:border-[var(--blue)] focus:bg-white transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleManualVerify()}
              />

              <button
                onClick={handleManualVerify}
                disabled={!manualCode.trim()}
                className={cn(
                  "w-full h-[52px] font-bold rounded-[14px] text-[15px] transition-all",
                  !manualCode.trim() ? "bg-[#E8ECF7] text-[#A0ABC0] cursor-not-allowed" : "bg-[var(--red)] text-white shadow-[var(--shadow-sm)] active:scale-[0.98]"
                )}
              >
                I-Verify
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* VERIFIED Result Bottom Sheet */}
      <AnimatePresence>
        {showResultSheet && scanResult?.type === "VERIFIED" && scanResult.beneficiary && (
          <>
            <motion.div 
              key="verified-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultSheet(false)}
              className="fixed inset-0 bg-[#1C1C1E]/60 z-[55]"
            />
            <motion.div 
              key="verified-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white shadow-[var(--shadow-lg)] rounded-t-[24px] pb-[calc(24px+env(safe-area-inset-bottom)+64px)] z-[60] overflow-hidden"
            >
              <div className="h-[4px] w-full bg-[var(--red)] absolute top-0 left-0" />
              
              <div className="pt-[16px] px-[24px] flex flex-col items-center relative">
                <div className="w-[48px] h-[5px] bg-[#E8ECF7] rounded-full mb-[24px]" />
                
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

                <div className="flex items-center gap-[16px] mb-[24px] w-full">
                  <div className="w-[52px] h-[52px] bg-[var(--navy)] text-white font-bold text-[18px] rounded-full flex items-center justify-center shrink-0">
                    {initials(scanResult.beneficiary)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[16px] text-[var(--text-primary)] truncate leading-tight mb-[2px]">{scanResult.beneficiary.firstName} {scanResult.beneficiary.lastName}</p>
                    <p className="text-[13px] text-[var(--text-muted)] truncate">{scanResult.beneficiary.barangay}</p>
                  </div>
                </div>
                
                <div className="text-center mb-[32px] w-full">
                  <span className="text-[24px] font-extrabold text-[var(--red)] leading-none block tracking-tight">₱{(scanResult.distribution?.amount || ACTIVE_DISTRIBUTION.amount).toLocaleString()}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full h-[52px] bg-[var(--success)] text-white font-bold rounded-[14px] text-[15px] tracking-[-0.2px] transition-transform active:scale-[0.98] shadow-[var(--shadow-sm)] mb-[16px]"
                >
                  KUMPIRMAHIN
                </button>
                <button 
                  onClick={() => setShowResultSheet(false)}
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
        {showResultSheet && scanResult?.type === "REJECTED" && (
          <>
            <motion.div 
              key="rejected-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultSheet(false)}
              className="fixed inset-0 bg-[#1C1C1E]/60 z-[55]"
            />
            <motion.div 
              key="rejected-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-white shadow-[var(--shadow-lg)] rounded-t-[24px] pb-[calc(24px+env(safe-area-inset-bottom)+64px)] z-[60] overflow-hidden"
            >
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
                  <p className="text-[14px] text-[var(--danger)] text-center font-bold tracking-tight leading-[1.4]">{scanResult.reason}</p>
                </div>

                <button 
                  onClick={() => setShowResultSheet(false)}
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

