"use client"

import { useState, useRef, useCallback } from "react"
import { CheckCircle2, XCircle, Upload as UploadIcon, Keyboard } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { useVeriFundStore } from "@/lib/store"
import type { Claim, AuditEntry } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

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
    beneficiary?: any;
    reason?: string;
    distribution?: any;
  } | null>(null);

  const [showResultSheet, setShowResultSheet] = useState(false);
  const [manualCode, setManualCode] = useState("")
  const [showManualEntry, setShowManualEntry] = useState(false)
  
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

    setShowResultSheet(true);
  }, [store]);

  const handleManualVerify = () => {
    handleVerify(manualCode);
    setManualCode('');
  };

  const handleQRImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode('qr-reader-hidden');
      const result = await html5QrCode.scanFile(file, true);
      await html5QrCode.clear();
      handleVerify(result);
    } catch (err) {
      setIsProcessing(false);
      showToast('Hindi ma-read ang QR. I-type na lang ang VF ID.', 'warning');
    }

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
  }

  const initials = (b: any) => `${b.firstName[0]}${b.lastName[0]}`

  return (
    <div className="flex flex-col bg-surface min-h-screen pb-[120px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      
      <div className="mx-4 mt-4 bg-gradient-to-r from-tertiary to-tertiary-container rounded-[2rem] p-6 flex items-center justify-between editorial-shadow relative overflow-hidden">
        {/* Decorative circle for card texture */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="font-extrabold text-white text-lg tracking-tight leading-tight">{ACTIVE_DISTRIBUTION.title}</h3>
          <p className="text-white/80 text-xs font-semibold mt-1.5 uppercase tracking-wider">{ACTIVE_DISTRIBUTION.date} · ₱{ACTIVE_DISTRIBUTION.amount.toLocaleString()}</p>
        </div>
        <span className="relative z-10 bg-white/20 backdrop-blur-md text-white text-[10px] px-4 py-2 rounded-full font-black tracking-widest shadow-sm border border-white/20">AKTIBO</span>
      </div>

      <div className="mx-4 mt-4 mb-2">
        <QRScanner isScanning={!showResultSheet} onScanSuccess={handleVerify} />
      </div>

      <div id="qr-reader-hidden" style={{ display: 'none' }} />
      <input
        ref={qrImageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleQRImageUpload}
      />

      {/* Action Section: MATCHING THE 3RD IMAGE (Upload then Manual) */}
      <div className="mx-4 mt-4 flex flex-col gap-3">
        <button onClick={() => qrImageInputRef.current?.click()}
          className="flex items-center justify-center gap-3 py-4 rounded-full bg-[#003B8F] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all">
          <UploadIcon className="w-5 h-5" />
          I-upload ang QR Code Image
        </button>

        <button 
          onClick={() => setShowManualEntry(!showManualEntry)}
          className={`flex items-center justify-center gap-3 py-4 rounded-full border border-outline-variant transition-all active:scale-[0.98] shadow-sm ${
            showManualEntry 
              ? 'bg-tertiary/10 border-tertiary text-tertiary' 
              : 'bg-white text-on-surface'
          }`}
        >
          {!showManualEntry && <Keyboard className="w-5 h-5 text-on-surface-variant opacity-70" />}
          <span className="font-bold text-sm">I-type ang VeriFund ID</span>
        </button>

        {/* Manual Entry Section - Toggleable Inline */}
        <AnimatePresence>
          {showManualEntry && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex flex-col gap-3 mt-1">
                <div className="flex gap-2">
                  <input
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value)}
                    placeholder="I-type ang VF ID"
                    className="flex-1 bg-white rounded-xl px-4 py-3 font-mono text-sm outline-none border border-outline-variant focus:border-tertiary"
                    onKeyDown={e => e.key === 'Enter' && handleManualVerify()}
                    autoFocus
                  />
                  <button
                    onClick={handleManualVerify}
                    disabled={!manualCode.trim()}
                    className="px-4 py-3 rounded-xl bg-tertiary text-white font-bold text-xs"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-10 w-full shrink-0" />

      {isProcessing && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          borderRadius: 20, zIndex: 10,
        }}>
          <div style={{
            width: 40, height: 40,
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid #88000d',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: 'white', fontSize: 13, marginTop: 12 }}>
            Binabasa ang QR code...
          </p>
        </div>
      )}

      {/* Manual Entry Bottom Sheet removed because it is now inline */}

      {/* VERIFIED Result Sheet */}
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
              className="fixed inset-x-0 bottom-0 bg-surface-container-lowest shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[1.5rem] pb-[calc(100px+env(safe-area-inset-bottom))] z-[60] overflow-hidden"
            >
              <div className="pt-4 px-6 flex flex-col items-center relative">
                <div className="w-12 h-1 bg-surface-container-highest rounded-full mb-6" />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mb-4 editorial-shadow"
                >
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-extrabold text-primary tracking-tight mb-1 text-center leading-tight">Verified!</h2>
                <p className="text-sm text-on-surface-variant font-medium text-center mb-6">Pwedeng kumuha ng ayuda</p>

                <div className="flex items-center gap-4 mb-6 w-full bg-surface-container-low p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center shrink-0">
                    {initials(scanResult.beneficiary)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-on-surface truncate leading-tight mb-0.5">{scanResult.beneficiary.firstName} {scanResult.beneficiary.lastName}</p>
                    <p className="text-sm text-on-surface-variant truncate">{scanResult.beneficiary.barangay}</p>
                  </div>
                </div>
                
                <div className="text-center mb-6 w-full">
                  <span className="text-3xl font-extrabold text-primary tracking-tight block">₱{(scanResult.distribution?.amount || ACTIVE_DISTRIBUTION.amount).toLocaleString()}</span>
                </div>

                <button
                  onClick={handleConfirm}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mb-3"
                >
                  KUMPIRMAHIN
                </button>
                <button 
                  onClick={() => setShowResultSheet(false)}
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
                >
                  I-cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* REJECTED Result Sheet */}
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
              className="fixed inset-x-0 bottom-0 bg-surface-container-lowest shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[1.5rem] pb-[calc(100px+env(safe-area-inset-bottom))] z-[60] overflow-hidden"
            >
              <div className="pt-4 px-6 flex flex-col items-center relative">
                <div className="w-12 h-1 bg-surface-container-highest rounded-full mb-6" />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-tertiary to-tertiary-container rounded-full flex items-center justify-center mb-4 editorial-shadow"
                >
                  <XCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-extrabold text-tertiary tracking-tight mb-2 text-center leading-tight">Hindi Puwede</h2>
                <div className="w-full bg-tertiary/10 p-4 rounded-2xl mb-6">
                  <p className="text-sm text-tertiary text-center font-bold tracking-tight leading-[1.4]">{scanResult.reason}</p>
                </div>

                <button 
                  onClick={() => setShowResultSheet(false)}
                  className="w-full py-4 rounded-full border-2 border-tertiary text-tertiary font-bold active:scale-[0.98] transition-all"
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
