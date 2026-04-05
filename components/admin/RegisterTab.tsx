"use client"

import { useState, useRef } from "react"
import { Camera, CheckCircle2, ChevronDown, CheckCircle, ScanLine, Check, MapPin } from "lucide-react"
import { QRCode } from "@/components/QRCode"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useVeriFundStore } from "@/lib/store"
import type { Beneficiary, AuditEntry } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

const OFFICER_NAME = "Josefa Reyes"
import { DEFAULT_BARANGAY } from "@/lib/constants"

const BARANGAY = DEFAULT_BARANGAY
const ID_TYPES = ["PhilSys", "Driver's License", "Voter's ID", "Postal ID", "SSS ID", "GSIS ID", "Passport"]

export function RegisterTab() {
  const { beneficiaries, addBeneficiary, addAuditEntry } = useVeriFundStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{field?: string, message: string} | null>(null)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [generatedId, setGeneratedId] = useState("")
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    gender: "" as "Lalaki" | "Babae" | "Iba pa" | "",
    idType: "",
    idNumber: "",
  })
  
  const [showIdPicker, setShowIdPicker] = useState(false)

  // Step 1: ID Scan
  const idScanRef = useRef<HTMLInputElement>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanDone, setScanDone] = useState(false)

  // Step 2: Face Scan
  const faceScanRef = useRef<HTMLInputElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [faceCaptured, setFaceCaptured] = useState(false)

  const showToastMsg = (msg: string, type: 'success' | 'error') => {
    setToast({ message: msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleIDScan = () => {
    idScanRef.current?.click()
  }

  const handleIDImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setFormData(f => ({
      ...f,
      lastName: 'Dela Cruz',
      firstName: 'Maria',
      phone: '9171234568',
      idType: 'PhilSys',
      idNumber: '1234-5678-9012-3456',
      gender: 'Babae',
    }))

    setIsScanning(false)
    setScanDone(true)
    showToastMsg('Na-scan ang ID! I-check ang mga detalye.', 'success')
    e.target.value = ''
  }

  const handleFaceCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCapturing(true)
    await new Promise(resolve => setTimeout(resolve, 2500))

    setIsCapturing(false)
    setFaceCaptured(true)
    showToastMsg('Face verified! Walang duplicate na nahanap.', 'success')
    e.target.value = ''
  }

  const handleNext = () => {
    setError(null)

    if (!scanDone && (!formData.lastName || !formData.firstName || !formData.phone || !formData.gender || !formData.idType || !formData.idNumber)) {
      return setError({ message: "I-scan muna ang ID o punan ang mga fields." })
    }

    if (!formData.lastName) return setError({ field: "lastName", message: "Kailangan itong punan." })
    if (!formData.firstName) return setError({ field: "firstName", message: "Kailangan itong punan." })
    if (!formData.phone) return setError({ field: "phone", message: "Kailangan itong punan." })
    if (!formData.gender) return setError({ field: "gender", message: "Kailangan pumili ng kasarian." })
    if (!formData.idType) return setError({ field: "idType", message: "Kailangan itong punan." })
    if (!formData.idNumber) return setError({ field: "idNumber", message: "Kailangan itong punan." })

    const phoneRegex = /^9\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      return setError({ field: "phone", message: "Dapat magsimula sa 9 at 10 digits ang numero." })
    }

    setStep(2)
  }

  const handleRegister = async () => {
    const fullPhone = '0' + formData.phone
    const exists = beneficiaries.some(b => b.phone === fullPhone || b.phone === formData.phone)
    if (exists) {
      showToastMsg('May existing na account ang numerong ito.', 'error')
      return
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)

    const year = new Date().getFullYear()
    const idx = String(beneficiaries.length + 1).padStart(4, "0")
    const barangayCode = "STC"
    const vfId = `VF-${year}-${idx}-${barangayCode}`
    setGeneratedId(vfId)

    const newBeneficiary: Beneficiary = {
      id: vfId,
      lastName: formData.lastName,
      firstName: formData.firstName,
      phone: fullPhone,
      gender: formData.gender as any,
      idType: formData.idType,
      idNumber: formData.idNumber,
      barangay: BARANGAY,
      status: "ACTIVE",
      enrolledAt: new Date().toISOString(),
      enrolledBy: OFFICER_NAME,
      qrData: vfId,
    }

    const auditEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "ENROLLED",
      actorName: OFFICER_NAME,
      actorRole: "OFFICER",
      targetId: vfId,
      targetName: `${formData.firstName} ${formData.lastName}`,
      barangay: BARANGAY,
      details: `Na-register ang bagong benepisyaryo gamit ang ${formData.idType}`,
    }

    addBeneficiary(newBeneficiary)
    addAuditEntry(auditEntry)
    setStep(3)
  }

  const resetForm = () => {
    setFormData({ lastName: "", firstName: "", phone: "", gender: "", idType: "", idNumber: "" })
    setScanDone(false)
    setFaceCaptured(false)
    setGeneratedId("")
    setStep(1)
  }

  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center p-6" style={{ fontFamily: 'Manrope, sans-serif' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mb-6 editorial-shadow">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="text-2xl font-extrabold text-primary text-center mb-2 tracking-tight">Registered ka na!</h1>
        <p className="text-lg font-bold text-on-surface text-center uppercase tracking-wide mb-1">
          {formData.firstName} {formData.lastName}
        </p>
        <div className="font-mono text-sm font-bold text-tertiary bg-tertiary/10 px-4 py-2 rounded-full mb-8">
          {generatedId}
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-2xl editorial-shadow mb-6 print-qr-container">
          <QRCode value={generatedId} id="qr-code" size={160} />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <button onClick={() => window.print()}
            className="w-full py-3.5 rounded-full border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">
            I-print ang Card
          </button>
          <button onClick={resetForm}
            className="w-full py-3.5 rounded-full bg-tertiary text-white font-bold shadow-lg shadow-tertiary/20 hover:bg-tertiary/90 active:scale-[0.98] transition-all">
            Mag-register ng Bago
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            .print-qr-container, .print-qr-container * { visibility: visible; }
            .print-qr-container { position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; box-shadow: none; border: none; }
          }
        `}} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-surface-container-low min-h-full pb-[100px]" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <LoadingOverlay isVisible={loading} />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={cn(
              "fixed top-[80px] left-1/2 z-[200] px-[16px] py-[10px] rounded-[100px] shadow-[var(--shadow-lg)] backdrop-blur-md flex items-center gap-[8px] max-w-[90vw] whitespace-nowrap",
              toast.type === 'success' ? "bg-[rgba(0,200,83,0.9)] text-white" : "bg-tertiary text-white"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : null}
            <span className="text-[14px] font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 pt-6 pb-4 bg-surface-container-lowest border-b border-outline-variant/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold text-tertiary uppercase tracking-widest">Hakbang {step} ng 2</span>
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-tertiary rounded-full transition-all" style={{ width: step === 1 ? '50%' : '100%' }} />
          </div>
        </div>
        <h2 className="text-xl font-extrabold text-primary tracking-tight">
          {step === 1 ? 'I-scan ang Government ID' : 'Face Verification'}
        </h2>
      </div>

      <div>
        {error && !error.field && (
          <div className="mx-5 mt-4 bg-[var(--danger)] text-white text-[13px] font-bold p-[16px] rounded-[16px] mb-[16px] text-center shadow-[var(--shadow-sm)] animate-in slide-in-from-top-2">
            {error.message}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col">
            <div onClick={handleIDScan} className={`mx-5 mt-5 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all ${
              scanDone
                ? 'bg-gradient-to-r from-primary/10 to-primary-container/10 border-2 border-primary-container/30'
                : 'bg-gradient-to-r from-primary/5 to-transparent border-2 border-dashed border-primary/20'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                scanDone ? 'bg-primary-container text-white' : 'bg-primary/10 text-primary'
              }`}>
                {scanDone ? <CheckCircle className="w-7 h-7" /> : <ScanLine className="w-7 h-7" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-on-surface text-sm">
                  {scanDone ? 'Na-scan na ang ID!' : 'I-scan ang Government ID'}
                </p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {scanDone ? 'Na-fill na ang mga detalye.' : 'Awtomatikong mafi-fill ang mga fields.'}
                </p>
              </div>
              {scanDone && <CheckCircle2 className="w-5 h-5 text-primary-container flex-shrink-0" />}
            </div>

            <input
              ref={idScanRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleIDImageSelected}
            />

            {isScanning && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                <div style={{ width: 260, height: 164, background: '#1C1C1E', borderRadius: 12, position: 'relative', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ position: 'absolute', inset: '20px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <p style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>Binabasa ang ID...</p>
              </div>
            )}

            <div className={`mx-5 mt-4 bg-surface-container-lowest rounded-3xl p-5 editorial-shadow space-y-4 mb-[100px] ${scanDone ? 'ring-2 ring-primary/10' : ''}`}>
              
              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Apelyido</label>
                <input 
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                  className={cn("w-full bg-surface-container-low rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface border-none outline-none font-medium", error?.field === "lastName" && "ring-2 ring-tertiary")}
                />
                {error?.field === "lastName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Pangalan</label>
                <input 
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                  className={cn("w-full bg-surface-container-low rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface border-none outline-none font-medium", error?.field === "firstName" && "ring-2 ring-tertiary")}
                />
                {error?.field === "firstName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Numero ng Telepono</label>
                <div className={cn("flex items-center h-[56px] bg-surface-container-low rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all", error?.field === "phone" && "ring-2 ring-tertiary")}>
                  <div className="px-4 h-full flex items-center bg-surface-container border-r border-outline-variant/30 text-on-surface font-bold text-sm">
                    +63
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(f => ({ ...f, phone: digits }));
                    }}
                    placeholder="9XXXXXXXXX"
                    className="flex-1 h-full bg-transparent border-none outline-none px-4 text-on-surface font-medium placeholder-outline"
                  />
                </div>
                {error?.field === "phone" && <p className="text-xs text-tertiary mt-1 font-medium">{error.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Kasarian</label>
                <div className="flex gap-2">
                  {(["Lalaki", "Babae", "Iba pa"] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, gender: option})}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                        formData.gender === option
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {error?.field === "gender" && <p className="text-xs text-tertiary mt-1 font-medium">{error.message}</p>}
              </div>

              <div className="relative">
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Uri ng ID</label>
                <div 
                  onClick={() => setShowIdPicker(true)}
                  className={cn("w-full bg-surface-container-low rounded-2xl p-4 flex items-center justify-between cursor-pointer", error?.field === "idType" && "ring-2 ring-tertiary")}
                >
                  <span className={formData.idType ? "text-on-surface font-medium" : "text-outline font-medium"}>
                    {formData.idType || "Pumili ng ID"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-on-surface-variant" />
                </div>
                {error?.field === "idType" && <p className="text-xs text-tertiary mt-1 font-medium">{error.message}</p>}

                <AnimatePresence>
                  {showIdPicker && (
                    <>
                      <motion.div 
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowIdPicker(false)}
                        className="fixed inset-0 bg-black/40 z-40"
                      />
                      <motion.div 
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 bg-surface-container-lowest z-50 rounded-t-[24px] shadow-[0_-20px_60px_rgba(0,0,0,0.15)] pb-[calc(24px+env(safe-area-inset-bottom))]"
                      >
                        <div className="flex justify-center pt-[12px] pb-[8px]">
                          <div className="w-[40px] h-[5px] bg-surface-container-high rounded-full" />
                        </div>
                        <h3 className="px-6 py-3 text-base font-bold text-on-surface">Pumili ng Uri ng ID</h3>
                        <div className="max-h-[300px] overflow-y-auto px-6">
                          {ID_TYPES.map(type => (
                            <button
                              key={type}
                              onClick={() => { setFormData({...formData, idType: type}); setShowIdPicker(false) }}
                              className="w-full flex items-center justify-between py-4 border-b border-outline-variant/20 last:border-0"
                            >
                              <span className="text-sm font-bold text-on-surface">{type}</span>
                              {formData.idType === type && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Numero ng ID</label>
                <input 
                  value={formData.idNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, idNumber: e.target.value})}
                  className={cn("w-full bg-surface-container-low rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all text-on-surface border-none outline-none font-mono tracking-wide font-bold", error?.field === "idNumber" && "ring-2 ring-tertiary")}
                />
                {error?.field === "idNumber" && <p className="text-xs text-tertiary mt-1 font-medium">{error.message}</p>}
              </div>

              <div>
                <label className="text-xs font-bold text-primary/70 uppercase tracking-widest block mb-1.5">Barangay</label>
                <div className="bg-surface-container-high rounded-2xl p-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-outline" />
                  <span className="text-sm text-on-surface-variant font-medium">{BARANGAY}</span>
                </div>
              </div>
            </div>

            <div className="fixed bottom-[88px] left-0 right-0 px-5 pb-4 bg-gradient-to-t from-surface-container-low/40 via-surface-container-low/10 to-transparent pt-8 z-30 pointer-events-none transition-all duration-300">
              <div className="max-w-[240px] mx-auto pointer-events-auto">
                <button onClick={handleNext}
                  className="w-full bg-tertiary text-white py-3.5 rounded-full font-bold text-xs shadow-[0_12px_24px_-6px_rgba(136,0,13,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(136,0,13,0.4)] hover:bg-tertiary/95 active:scale-[0.98] transition-all tracking-widest uppercase">
                  Susunod →
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center px-5 pt-4 gap-5">
            <div className="w-full flex justify-start mb-2">
               <button onClick={() => setStep(1)} className="text-sm font-bold text-outline hover:text-primary transition-colors">
                  ← Bumalik
               </button>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-extrabold text-primary tracking-tight">Face Verification</h3>
              <p className="text-sm text-on-surface-variant mt-1">I-align ang mukha sa loob ng frame</p>
            </div>

            {/* Circle viewport */}
            <div style={{
              width: 240, height: 240, borderRadius: '50%',
              border: faceCaptured ? '4px solid #1a56ad' : '4px solid #88000d',
              background: '#1C1C1E', position: 'relative', overflow: 'hidden', transition: 'border-color 300ms',
            }}>
              {faceCaptured ? (
                 <div className="w-full h-full flex items-center justify-center bg-primary-container">
                    <Check className="w-16 h-16 text-white" />
                 </div>
              ) : (
                <>
                  <div className="absolute inset-x-0 inset-y-0 flex items-center justify-center">
                    <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                      <ellipse cx="60" cy="55" rx="35" ry="42" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4"/>
                      <path d="M20 120 Q60 90 100 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
                    </svg>
                  </div>
                  {isCapturing && (
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: 3,
                      background: 'linear-gradient(to right, transparent, #88000d, transparent)',
                      animation: 'faceScan 2s ease-in-out infinite',
                    }} />
                  )}
                </>
              )}
            </div>

            <input
              ref={faceScanRef}
              type="file"
              accept="image/*"
              capture="user"
              style={{ display: 'none' }}
              onChange={handleFaceCapture}
            />

            {!faceCaptured ? (
              <button onClick={() => faceScanRef.current?.click()}
                className="w-16 h-16 rounded-full bg-tertiary flex items-center justify-center shadow-lg shadow-tertiary/30 active:scale-90 transition-all">
                <Camera className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button onClick={() => setFaceCaptured(false)}
                className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm text-on-surface-variant font-bold hover:bg-surface-container transition-all">
                Ulitin ang Face Scan
              </button>
            )}

            <div className="fixed bottom-[88px] left-0 right-0 px-5 pb-4 bg-gradient-to-t from-surface-container-low/40 via-surface-container-low/10 to-transparent pt-8 z-30 pointer-events-none transition-all duration-300">
              <div className="max-w-[280px] mx-auto pointer-events-auto">
                <button onClick={handleRegister}
                  className="w-full bg-tertiary text-white py-3.5 rounded-full font-bold text-xs shadow-[0_12px_24px_-6px_rgba(136,0,13,0.3)] hover:shadow-[0_16px_32px_-8px_rgba(136,0,13,0.4)] hover:bg-tertiary/95 active:scale-[0.98] transition-all tracking-widest uppercase">
                  {faceCaptured ? 'Kumpirmahin ang Registration' : 'Mag-register nang walang Face Scan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
