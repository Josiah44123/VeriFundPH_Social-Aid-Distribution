"use client"

import { useState, useRef, useCallback } from "react"
import { CheckCircle2, XCircle, Upload as UploadIcon, Keyboard, AlertTriangle } from "lucide-react"
import { QRScanner } from "@/components/QRScanner"
import { useVeriFundStore } from "@/lib/store"
import type { Claim, AuditEntry } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

import { DEFAULT_BARANGAY, OFFICER_CREDENTIALS } from "@/lib/constants"

const OFFICER_NAME = OFFICER_CREDENTIALS[0].name
const BARANGAY = DEFAULT_BARANGAY

export function VerifyTab() {
  const store = useVeriFundStore()

  // Find active distribution from store
  const activeDistribution = store.distributions.find(d => d.status === "ACTIVE") || {
    id: "SAP-2025-Q1",
    title: "SAP 2025 — Una",
    amount: 1500,
    scheduledDate: "MARSO 15, 2025",
  }
  
  const [scanResult, setScanResult] = useState<{
    type: 'VERIFIED' | 'REJECTED' | 'FLAGGED';
    beneficiary?: ReturnType<typeof store.beneficiaries.find>;
    reason?: string;
    distribution?: typeof activeDistribution;
  } | null>(null);

  const [showResultSheet, setShowResultSheet] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCode, setManualCode] = useState("")
  const [selectedMethod, setSelectedMethod] = useState<"Cash" | "GCash" | "Palawan" | null>(null)
  const [successFlash, setSuccessFlash] = useState(false)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const qrImageInputRef = useRef<HTMLInputElement>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  const handleVerify = useCallback((vfId: string) => {
    const id = vfId.trim().toUpperCase();
    if (!id) return;

    setIsProcessing(false);

    const beneficiary = store.beneficiaries.find(
      b => b.id.toUpperCase() === id || b.qrData.toUpperCase() === id
    );

    const alreadyClaimed = beneficiary
      ? store.claims.some(
          c => c.beneficiaryId === beneficiary.id && c.distributionId === activeDistribution.id
        )
      : false;

    if (!beneficiary) {
      setScanResult({ type: 'REJECTED', reason: 'Hindi nahanap sa listahan.' });
    } else if (alreadyClaimed) {
      setScanResult({ type: 'REJECTED', reason: 'Nakakuha na sa distribution na ito.' });
    } else if (beneficiary.status === 'FLAGGED') {
      setScanResult({ type: 'FLAGGED', beneficiary, distribution: activeDistribution });
    } else {
      setScanResult({ type: 'VERIFIED', beneficiary, distribution: activeDistribution });
    }

    setSelectedMethod(null);
    setShowResultSheet(true);
  }, [store, activeDistribution]);

  const handleManualVerify = () => {
    if (!manualCode.trim()) return;
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
    } catch {
      setIsProcessing(false);
      alert('Hindi ma-read ang QR. I-type na lang ang VF ID.');
    }

    e.target.value = '';
  };

  const handleConfirm = (flagOverride?: boolean) => {
    if (!scanResult?.beneficiary) return
    if (!selectedMethod) return // Must select a method
    
    const { beneficiary, distribution } = scanResult
    const activeDist = distribution || activeDistribution;

    const claim: Claim = {
      id: `CLM-${Date.now()}`,
      beneficiaryId: beneficiary.id,
      beneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
      distributionId: activeDist.id,
      distributionTitle: activeDist.title,
      amount: activeDist.amount,
      method: selectedMethod,
      status: "NAKUHA",
      reason: flagOverride ? "Proceeded despite FLAGGED status" : undefined,
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
      details: `Claim confirmed — ${activeDist.title} — ₱${activeDist.amount.toLocaleString()} ${selectedMethod}${flagOverride ? " (FLAGGED override)" : ""}`,
    }

    store.addClaim(claim)
    store.addAuditEntry(auditEntry)

    // Show success flash for 2 seconds then auto-close
    setSuccessFlash(true)
    setTimeout(() => {
      setSuccessFlash(false)
      setShowResultSheet(false)
      setScanResult(null)
      setManualCode("")
      setSelectedMethod(null)
    }, 2000)
  }

  const handleReject = () => {
    if (!scanResult?.beneficiary) return

    const auditEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "REJECTED",
      actorName: OFFICER_NAME,
      actorRole: "OFFICER",
      targetId: scanResult.beneficiary.id,
      targetName: `${scanResult.beneficiary.firstName} ${scanResult.beneficiary.lastName}`,
      barangay: BARANGAY,
      details: `Claim rejected — FLAGGED account`,
    }

    store.addAuditEntry(auditEntry)
    setShowResultSheet(false)
    setScanResult(null)
  }

  const initials = (b: { firstName: string; lastName: string }) => `${b.firstName[0]}${b.lastName[0]}`

  const DisbursementPicker = () => (
    <div className="w-full mb-4">
      <p className="text-xs font-black text-outline uppercase tracking-widest mb-2 text-center">Paraan ng Payout</p>
      <div className="flex gap-2">
        {(["Cash", "GCash", "Palawan"] as const).map(method => (
          <button
            key={method}
            onClick={() => setSelectedMethod(method)}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-bold transition-all min-h-[44px]",
              selectedMethod === method
                ? "bg-primary text-white shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container border border-outline-variant/30"
            )}
          >
            {method}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col bg-surface min-h-screen pb-[120px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      
      <div className="mx-4 mt-4 bg-gradient-to-r from-tertiary to-tertiary-container rounded-[2rem] p-6 flex items-center justify-between editorial-shadow relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10">
          <h3 className="font-extrabold text-white text-lg tracking-tight leading-tight">{activeDistribution.title}</h3>
          <p className="text-white/80 text-xs font-semibold mt-1.5 uppercase tracking-wider">{activeDistribution.scheduledDate ? `${activeDistribution.scheduledDate} · ` : ''}₱{activeDistribution.amount.toLocaleString()}</p>
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

      {/* Action Section */}
      <div className="mx-4 mt-4 flex flex-col gap-3">
        <button onClick={() => qrImageInputRef.current?.click()}
          className="flex items-center justify-center gap-3 py-4 rounded-full bg-[#003B8F] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all min-h-[48px]">
          <UploadIcon className="w-5 h-5" />
          I-upload ang QR Code Image
        </button>

        {/* Manual entry — toggleable */}
        {!showManualInput ? (
          <button onClick={() => setShowManualInput(true)}
            className="flex items-center justify-center gap-3 py-4 rounded-full border border-outline-variant text-on-surface font-bold text-sm bg-surface shadow-sm hover:bg-surface-container-lowest active:scale-[0.98] transition-all min-h-[48px]">
            <Keyboard className="w-5 h-5 text-on-surface-variant" />
            I-type ang VeriFund ID
          </button>
        ) : (
          <div className="bg-surface-container-low border border-outline-variant rounded-3xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1 pl-2">
              <Keyboard className="w-4 h-4 text-on-surface-variant" />
              <span className="text-sm font-bold text-on-surface">I-type ang VeriFund ID</span>
            </div>
            <div className="flex gap-2">
              <input
                ref={manualInputRef}
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="VF-2025-0001-STC"
                className="flex-1 bg-white rounded-2xl px-4 py-3 font-mono text-sm outline-none border border-outline-variant focus:border-tertiary min-h-[44px]"
                onKeyDown={e => e.key === 'Enter' && handleManualVerify()}
                autoFocus
              />
              <button
                onClick={handleManualVerify}
                disabled={!manualCode.trim()}
                className="px-5 py-3 rounded-2xl bg-[#A25F65] text-white font-bold text-xs disabled:opacity-40 min-h-[44px] hover:bg-[#8B4E54] transition-colors"
              >
                Verify
              </button>
            </div>
          </div>
        )}
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

      {/* SUCCESS FLASH */}
      <AnimatePresence>
        {successFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-emerald-600/95 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-14 h-14 text-emerald-600" />
            </motion.div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Nakuha Na!</h2>
            <p className="text-white/80 font-medium">Matagumpay na naitala ang claim.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VERIFIED Result Sheet */}
      <AnimatePresence>
        {showResultSheet && !successFlash && scanResult?.type === "VERIFIED" && scanResult.beneficiary && (
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

                <div className="flex items-center gap-4 mb-4 w-full bg-surface-container-low p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-primary text-white font-bold text-lg rounded-full flex items-center justify-center shrink-0">
                    {initials(scanResult.beneficiary)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-on-surface truncate leading-tight mb-0.5">{scanResult.beneficiary.firstName} {scanResult.beneficiary.lastName}</p>
                    <p className="text-sm text-on-surface-variant truncate">{scanResult.beneficiary.barangay}</p>
                  </div>
                </div>
                
                <div className="text-center mb-4 w-full">
                  <span className="text-3xl font-extrabold text-primary tracking-tight block">₱{(scanResult.distribution?.amount || activeDistribution.amount).toLocaleString()}</span>
                </div>

                <DisbursementPicker />

                <button
                  onClick={() => handleConfirm()}
                  disabled={!selectedMethod}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mb-3 disabled:opacity-40 min-h-[48px]"
                >
                  KUMPIRMAHIN
                </button>
                <button 
                  onClick={() => setShowResultSheet(false)}
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors min-h-[44px]"
                >
                  I-cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLAGGED Result Sheet */}
      <AnimatePresence>
        {showResultSheet && !successFlash && scanResult?.type === "FLAGGED" && scanResult.beneficiary && (
          <>
            <motion.div 
              key="flagged-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResultSheet(false)}
              className="fixed inset-0 bg-[#1C1C1E]/60 z-[55]"
            />
            <motion.div 
              key="flagged-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 bg-amber-50 shadow-[0_-20px_60px_rgba(0,0,0,0.15)] rounded-t-[1.5rem] pb-[calc(100px+env(safe-area-inset-bottom))] z-[60] overflow-hidden"
            >
              <div className="pt-4 px-6 flex flex-col items-center relative">
                <div className="w-12 h-1 bg-amber-300 rounded-full mb-6" />
                
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
                >
                  <AlertTriangle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-2xl font-extrabold text-amber-800 tracking-tight mb-1 text-center leading-tight">FLAGGED Account</h2>
                <div className="w-full bg-amber-100 border border-amber-300 p-4 rounded-2xl mb-4">
                  <p className="text-sm text-amber-900 font-bold text-center leading-relaxed">
                    Ang account na ito ay under review. Kailangan mong gumawa ng judgment call.
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4 w-full bg-white p-4 rounded-2xl border border-amber-200">
                  <div className="w-12 h-12 bg-amber-500 text-white font-bold text-lg rounded-full flex items-center justify-center shrink-0">
                    {initials(scanResult.beneficiary)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-on-surface truncate leading-tight mb-0.5">{scanResult.beneficiary.firstName} {scanResult.beneficiary.lastName}</p>
                    <p className="text-sm text-on-surface-variant truncate">{scanResult.beneficiary.id}</p>
                  </div>
                </div>

                <div className="text-center mb-4 w-full">
                  <span className="text-3xl font-extrabold text-amber-800 tracking-tight block">₱{activeDistribution.amount.toLocaleString()}</span>
                </div>

                <DisbursementPicker />

                <button
                  onClick={() => handleConfirm(true)}
                  disabled={!selectedMethod}
                  className="w-full py-4 rounded-full bg-amber-600 text-white font-bold shadow-lg shadow-amber-600/20 active:scale-[0.98] transition-all mb-3 disabled:opacity-40 min-h-[48px]"
                >
                  I-proceed Anyway
                </button>
                <button 
                  onClick={handleReject}
                  className="w-full py-4 rounded-full border-2 border-tertiary text-tertiary font-bold active:scale-[0.98] transition-all mb-3 min-h-[48px]"
                >
                  I-reject
                </button>
                <button 
                  onClick={() => setShowResultSheet(false)}
                  className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors min-h-[44px]"
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
        {showResultSheet && !successFlash && scanResult?.type === "REJECTED" && (
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
                  className="w-full py-4 rounded-full border-2 border-tertiary text-tertiary font-bold active:scale-[0.98] transition-all min-h-[48px]"
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
