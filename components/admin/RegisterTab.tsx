"use client"

import { useState, useRef } from "react"
import { Camera, CheckCircle2, ChevronDown, CheckCircle, ScanLine, Check } from "lucide-react"
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
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-[24px]">
        {/* Confetti element */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
          <div className="w-[10px] h-[10px] bg-[var(--ph-gold)] absolute top-0 animate-[fall_3s_linear_infinite]" style={{ left: '20%', animationDelay: '0s' }} />
          <div className="w-[8px] h-[8px] bg-[var(--red)] absolute top-0 animate-[fall_2.5s_linear_infinite]" style={{ left: '50%', animationDelay: '0.5s' }} />
          <div className="w-[12px] h-[12px] bg-[var(--blue)] absolute top-0 animate-[fall_4s_linear_infinite]" style={{ left: '80%', animationDelay: '1s' }} />
        </div>
        
        <div className="w-[80px] h-[80px] bg-[var(--success)] rounded-full flex items-center justify-center mb-[24px] shadow-[var(--shadow-md)] animate-in zoom-in-50 delay-150">
          <CheckCircle2 className="w-[48px] h-[48px] text-white" />
        </div>
        <h1 className="text-[24px] font-bold text-[var(--text-primary)] mb-[8px] text-center leading-tight">
          Registered ka na!
        </h1>
        <p className="text-[16px] text-[var(--text-secondary)] mb-[8px] uppercase font-bold tracking-wide">
          {formData.firstName} {formData.lastName}
        </p>
        <div className="font-mono text-[14px] font-bold text-[var(--red)] mb-[32px]">
          {generatedId}
        </div>
        
        <div className="mb-[32px] p-[24px] bg-white rounded-[24px] shadow-[var(--shadow-sm)] border border-[rgba(0,0,0,0.04)] print-qr-container">
          <QRCode value={generatedId} id="qr-code" size={160} />
        </div>

        <div className="w-full flex justify-center gap-[12px] flex-col max-w-sm px-[16px]">
          <button 
            onClick={() => window.print()}
            className="w-full h-[52px] border-[1.5px] border-[var(--red)] text-[var(--red)] font-bold rounded-[14px] text-[15px] tracking-[-0.2px] transition-transform active:scale-[0.98]"
          >
            I-print ang Card
          </button>
          <button 
            onClick={resetForm}
            className="w-full h-[52px] bg-[var(--red)] text-white font-bold rounded-[14px] text-[15px] tracking-[-0.2px] transition-transform active:scale-[0.98] shadow-[var(--shadow-sm)]"
          >
            Mag-register ng Bago
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fall {
            to { transform: translateY(100vh) rotate(360deg); }
          }
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
    <div className="flex flex-col h-full animate-in fade-in pb-[100px] bg-[var(--surface-page)] min-h-full relative overflow-x-hidden">
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
              toast.type === 'success' ? "bg-[rgba(0,200,83,0.9)] text-white" : "bg-[rgba(255,0,72,0.9)] text-white"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : null}
            <span className="text-[14px] font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes highlightFlash {
          0% { background-color: rgba(0,200,83,0.08); }
          100% { background-color: white; }
        }
        .animate-highlight {
          animation: highlightFlash 800ms ease-out forwards;
        }
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
        @keyframes faceScan {
          0% { top: 20%; }
          50% { top: 75%; }
          100% { top: 20%; }
        }
      `}} />

      {/* Header and Step Indicator */}
      <div className="px-[16px] pt-[24px] pb-[16px] sticky top-0 bg-[var(--surface-page)] z-10">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-[12px]">
            <div className="flex flex-col items-center gap-[4px] relative">
              <div className={cn("w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold z-10", step === 2 ? "bg-[#F2F2F7] text-[#8E8E93]" : "bg-[#FF0048] text-white")}>
                {step === 2 ? <Check size={16} /> : "1"}
              </div>
              <span className="text-[11px] text-[#8E8E93] absolute top-[32px] whitespace-nowrap">I-scan ang ID</span>
            </div>
            <div className="w-[32px] h-[2px] bg-[#D1D1D6] mb-[20px]" />
            <div className="flex flex-col items-center gap-[4px] relative">
              <div className={cn("w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold z-10", step === 2 ? "bg-[#FF0048] text-white" : "bg-white text-[#8E8E93] border border-[#D1D1D6]")}>
                2
              </div>
              <span className="text-[11px] text-[#8E8E93] absolute top-[32px] whitespace-nowrap">Face Scan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-[16px] pb-[24px]">
        {error && !error.field && (
          <div className="bg-[var(--danger)] text-white text-[13px] font-bold p-[16px] rounded-[16px] mb-[16px] text-center shadow-[var(--shadow-sm)] animate-in slide-in-from-top-2">
            {error.message}
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-[16px]">
            {/* ID Scan card — top of step 1 */}
            <div
              onClick={handleIDScan}
              style={{
                background: scanDone ? '#F0FBF4' : 'white',
                border: `2px ${scanDone ? 'solid' : 'dashed'} ${scanDone ? '#00C853' : '#D1D1D6'}`,
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                transition: 'all 200ms',
                marginBottom: 20,
              }}
            >
              {/* Icon */}
              <div style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                background: scanDone ? '#E8FAF0' : '#EEF0FB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {scanDone
                  ? <CheckCircle size={28} color="#00C853" />
                  : <ScanLine size={28} color="#18269B" />
                }
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: scanDone ? '#00C853' : '#1C1C1E' }}>
                  {scanDone ? 'Na-scan na ang ID!' : 'I-scan ang Government ID'}
                </p>
                <p style={{ fontSize: 12, color: '#8E8E93', margin: '2px 0 0' }}>
                  {scanDone
                    ? 'Na-fill na ang mga detalye. I-check at i-edit kung may mali.'
                    : 'Awtomatikong mafi-fill ang mga fields sa ibaba.'
                  }
                </p>
              </div>

              {/* Status indicator */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: scanDone ? '#00C853' : '#F2F2F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {scanDone && <Check size={16} color="white" />}
              </div>
            </div>

            {/* Hidden file input for ID scan */}
            <input
              ref={idScanRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleIDImageSelected}
            />

            {/* Scanning overlay */}
            {isScanning && (
              <div style={{
                position: 'fixed', inset: 0, zIndex: 200,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 16,
              }}>
                <div style={{
                  width: 260, height: 164,
                  background: '#1C1C1E',
                  borderRadius: 12,
                  position: 'relative',
                  overflow: 'hidden',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}>
                  {[
                    { top: 8, left: 8, borderWidth: '3px 0 0 3px' },
                    { top: 8, right: 8, borderWidth: '3px 3px 0 0' },
                    { bottom: 8, left: 8, borderWidth: '0 0 3px 3px' },
                    { bottom: 8, right: 8, borderWidth: '0 3px 3px 0' },
                  ].map((pos, i) => (
                    <div key={i} style={{
                      position: 'absolute', width: 20, height: 20,
                      borderColor: '#FF0048', borderStyle: 'solid',
                      ...pos,
                    }} />
                  ))}

                  <div style={{
                    position: 'absolute', left: 0, right: 0, height: 2,
                    background: 'linear-gradient(to right, transparent, #FF0048, transparent)',
                    animation: 'scanLine 1.5s ease-in-out infinite',
                  }} />

                  <div style={{
                    position: 'absolute', inset: '20px 16px',
                    borderRadius: 6, background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }} />
                </div>

                <p style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>
                  Binabasa ang ID...
                </p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                  Sandali lang
                </p>
              </div>
            )}

            <div className={cn("bg-white rounded-[20px] shadow-[var(--shadow-md)] p-[20px] flex flex-col gap-[16px] transition-colors duration-800", scanDone ? "animate-highlight" : "")}>
              
              <div>
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Apelyido (Last Name)</label>
                <input 
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})}
                  className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors", error?.field === "lastName" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
                />
                {error?.field === "lastName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              <div>
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Pangalan (First Name)</label>
                <input 
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, firstName: e.target.value})}
                  className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors", error?.field === "firstName" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
                />
                {error?.field === "firstName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              {/* Phone number field */}
              <div>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: '#8E8E93',
                  display: 'block', marginBottom: 6,
                }}>
                  Numero ng Telepono
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: 52,
                  background: '#F2F2F7',
                  borderRadius: 12,
                  border: error?.field === "phone" ? '1.5px solid #FF0048' : '1.5px solid transparent',
                  overflow: 'hidden',
                  transition: 'border-color 150ms',
                }}
                onFocusCapture={e => {
                  if (error?.field !== "phone") e.currentTarget.style.borderColor = '#0080F8';
                }}
                onBlurCapture={e => {
                  if (error?.field !== "phone") e.currentTarget.style.borderColor = 'transparent';
                }}
                >
                  {/* +63 prefix — fixed left side, never moves */}
                  <div style={{
                    padding: '0 12px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#E8E8ED',
                    borderRight: '1px solid #D1D1D6',
                    flexShrink: 0,
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#3C3C43',
                    whiteSpace: 'nowrap',
                  }}>
                    +63
                  </div>

                  {/* Actual input — starts after the prefix */}
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => {
                      // Strip non-digits, limit to 10 digits (after +63)
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData(f => ({ ...f, phone: digits }));
                    }}
                    placeholder="9XXXXXXXXX"
                    style={{
                      flex: 1,
                      height: '100%',
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      padding: '0 14px',
                      fontSize: 15,
                      color: '#1C1C1E',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {/* Validation error */}
                {error?.field === "phone" && (
                  <p style={{ fontSize: 12, color: '#FF0048', marginTop: 4 }}>
                    {error.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Kasarian (Gender)</label>
                <div className="flex bg-[var(--surface-input)] rounded-[14px] p-[4px] h-[52px]">
                  {(["Lalaki", "Babae", "Iba pa"] as const).map(option => (
                    <button
                      key={option}
                      onClick={() => setFormData({...formData, gender: option})}
                      className={cn(
                        "flex-1 rounded-[10px] text-[14px] font-medium transition-all",
                        formData.gender === option 
                          ? "bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)] font-bold" 
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {error?.field === "gender" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              <div className="relative">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Uri ng ID</label>
                <div 
                  onClick={() => setShowIdPicker(true)}
                  className={cn("w-full h-[52px] rounded-[14px] px-[16px] flex items-center justify-between bg-[var(--surface-input)] border-[1.5px] cursor-pointer", error?.field === "idType" ? "border-[var(--danger)]" : "border-transparent")}
                >
                  <span className={formData.idType ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
                    {formData.idType || "Pumili ng ID"}
                  </span>
                  <ChevronDown className="w-[20px] h-[20px] text-[var(--text-muted)]" />
                </div>
                {error?.field === "idType" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}

                {/* ID Picker Bottom Sheet */}
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
                        className="fixed inset-x-0 bottom-0 bg-white z-50 rounded-t-[24px] shadow-[var(--shadow-lg)] pb-[calc(24px+env(safe-area-inset-bottom))]"
                      >
                        <div className="flex justify-center pt-[12px] pb-[8px]">
                          <div className="w-[40px] h-[5px] bg-[#E8ECF7] rounded-full" />
                        </div>
                        <h3 className="px-[24px] py-[12px] text-[16px] font-bold text-[var(--text-primary)]">Pumili ng Uri ng ID</h3>
                        <div className="max-h-[300px] overflow-y-auto px-[16px]">
                          {ID_TYPES.map(type => (
                            <button
                              key={type}
                              onClick={() => { setFormData({...formData, idType: type}); setShowIdPicker(false) }}
                              className="w-full flex items-center justify-between px-[16px] py-[16px] border-b border-[#E8ECF7] last:border-0"
                            >
                              <span className="text-[15px] font-medium text-[var(--text-primary)]">{type}</span>
                              {formData.idType === type && <CheckCircle2 className="w-[20px] h-[20px] text-[var(--blue)]" />}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Numero ng ID</label>
                <input 
                  value={formData.idNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, idNumber: e.target.value})}
                  className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors font-mono tracking-wide", error?.field === "idNumber" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
                />
                {error?.field === "idNumber" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
              </div>

              <div>
                <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Barangay</label>
                <input 
                  value={BARANGAY}
                  readOnly
                  className="w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--gray-light)] border-[1.5px] border-transparent text-[var(--text-muted)] font-medium outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[12px] mb-[8px]">
              <button 
                onClick={() => setStep(1)}
                className="text-[14px] font-bold text-[var(--text-muted)] border border-[#E8ECF7] py-[6px] px-[12px] rounded-[10px]"
              >
                ← Bumalik
              </button>
            </div>

            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              {/* Instruction text */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: '#1C1C1E' }}>
                  Face Verification
                </p>
                <p style={{ fontSize: 13, color: '#8E8E93', margin: 0 }}>
                  I-align ang mukha ng benepisyaryo sa loob ng frame
                </p>
              </div>

              {/* Face scan viewport */}
              <div style={{
                width: 260, height: 260,
                borderRadius: '50%',
                overflow: 'hidden',
                position: 'relative',
                background: '#1C1C1E',
                border: faceCaptured ? '4px solid #00C853' : '4px solid #FF0048',
                transition: 'border-color 300ms',
                flexShrink: 0,
              }}>
                {/* Show preview after capture, placeholder before */}
                {faceCaptured ? (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(145deg, #1C3A2A, #0D2418)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: '50%',
                      background: '#00C853',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={40} color="white" />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Face silhouette guide */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="120" height="140" viewBox="0 0 120 140" fill="none">
                        <ellipse cx="60" cy="55" rx="35" ry="42" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4"/>
                        <path d="M20 120 Q60 90 100 120" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
                      </svg>
                    </div>

                    {/* Animated scan line */}
                    {isCapturing && (
                      <div style={{
                        position: 'absolute', left: 0, right: 0, height: 3,
                        background: 'linear-gradient(to right, transparent, #FF0048, transparent)',
                        animation: 'faceScan 2s ease-in-out infinite',
                      }} />
                    )}
                  </>
                )}
              </div>

              {/* Three alignment dots below the circle */}
              {!faceCaptured && (
                <div style={{ display: 'flex', gap: 6 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: i === 1 ? '#FF0048' : '#D1D1D6',
                    }} />
                  ))}
                </div>
              )}

              {/* Status text */}
              <p style={{ fontSize: 13, color: '#8E8E93', textAlign: 'center', margin: 0 }}>
                {faceCaptured
                  ? 'Na-capture na ang mukha!'
                  : isCapturing
                  ? 'Nakita ang mukha — huwag gumalaw...'
                  : 'Pindutin ang button para simulan'
                }
              </p>

              {/* Capture button — hidden file input trigger */}
              <input
                ref={faceScanRef}
                type="file"
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
                onChange={handleFaceCapture}
              />

              {!faceCaptured ? (
                <button
                  onClick={() => faceScanRef.current?.click()}
                  style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: '#FF0048', border: '4px solid rgba(255,0,72,0.3)',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Camera size={28} color="white" />
                </button>
              ) : (
                <button
                  onClick={() => setFaceCaptured(false)}
                  style={{
                    padding: '10px 24px',
                    background: 'none', border: '1.5px solid #D1D1D6',
                    borderRadius: 12, fontSize: 13, color: '#8E8E93', cursor: 'pointer',
                  }}
                >
                  Ulitin ang Face Scan
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div style={{
        position: 'fixed', bottom: 64, left: 0, right: 0,
        padding: '12px 16px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, white 80%, transparent)',
        display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none', zIndex: 30, // Make sure it sits above the list but allows clicks inside
      }}>
        <div className="max-w-md mx-auto w-full pointer-events-auto" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {step === 1 ? (
            <button 
              onClick={handleNext}
              className="w-full h-[52px] bg-[var(--red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-[0.98] shadow-[var(--shadow-md)]"
            >
              Susunod →
            </button>
          ) : (
            <>
              {/* Primary register button — always shown, not gated on face scan */}
              <button
                onClick={handleRegister}
                style={{
                  width: '100%', height: 52,
                  background: '#FF0048',
                  opacity: 1, // always full opacity — face scan is optional for prototype
                  color: 'white', border: 'none',
                  borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                {faceCaptured ? 'I-Register ang Benepisyaryo →' : 'I-Register nang walang Face Scan →'}
              </button>

              {/* Skip label — makes it clear this is optional */}
              {!faceCaptured && (
                <p style={{ textAlign: 'center', fontSize: 12, color: '#8E8E93', margin: 0 }}>
                  Ang face scan ay optional para sa prototype
                </p>
              )}
            </>
          )}
        </div>
      </div>

    </div>
  )
}
