"use client"

import { useState } from "react"
import { Camera, CheckCircle2, UserPlus, ChevronDown } from "lucide-react"
import { QRCode } from "@/components/QRCode"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useVeriFundStore } from "@/lib/store"
import type { Beneficiary, AuditEntry } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"

const OFFICER_NAME = "Josefa Reyes"
const BARANGAY = "Sta. Cruz, Quezon City"
const ID_TYPES = ["PhilSys", "Driver's License", "Voter's ID", "Postal ID", "SSS ID", "GSIS ID", "Passport"]

export function RegisterTab() {
  const { beneficiaries, addBeneficiary, addAuditEntry } = useVeriFundStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{field?: string, message: string} | null>(null)
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
  const [idScanned, setIdScanned] = useState(false)
  const [selfieScanned, setSelfieScanned] = useState(false)

  const handleNext = () => {
    setError(null)
    if (!formData.lastName) return setError({ field: "lastName", message: "Kailangan itong punan." })
    if (!formData.firstName) return setError({ field: "firstName", message: "Kailangan itong punan." })
    if (!formData.phone) return setError({ field: "phone", message: "Kailangan itong punan." })
    if (!formData.gender) return setError({ field: "gender", message: "Kailangan pumili ng kasarian." })
    if (!formData.idType) return setError({ field: "idType", message: "Kailangan itong punan." })
    if (!formData.idNumber) return setError({ field: "idNumber", message: "Kailangan itong punan." })

    const phoneRegex = /^09\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      return setError({ field: "phone", message: "Invalid phone pattern (09XXXXXXXXX)" })
    }

    setStep(2)
  }

  const handleRegister = () => {
    // Duplicate phone check
    const dup = beneficiaries.find(b => b.phone === formData.phone)
    if (dup) {
      setError({ message: "May existing na account ang numerong ito." })
      setTimeout(() => setError(null), 3000)
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Generate VF ID
      const year = new Date().getFullYear()
      const idx = String(beneficiaries.length + 1).padStart(4, "0")
      const barangayCode = "STC"
      const vfId = `VF-${year}-${idx}-${barangayCode}`
      setGeneratedId(vfId)

      const newBeneficiary: Beneficiary = {
        id: vfId,
        lastName: formData.lastName,
        firstName: formData.firstName,
        phone: formData.phone,
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
        details: `Bagong benepisyaryo na-register — ${formData.idType}`,
      }

      addBeneficiary(newBeneficiary)
      addAuditEntry(auditEntry)
      setStep(3)
    }, 1500)
  }

  const handleIdScan = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFormData(prev => ({ ...prev, idNumber: "1234-5678-9012-3456" }))
      setIdScanned(true)
    }, 1500)
  }

  const handleSelfieScan = () => {
    setSelfieScanned(true)
  }

  const resetForm = () => {
    setFormData({ lastName: "", firstName: "", phone: "", gender: "", idType: "", idNumber: "" })
    setIdScanned(false)
    setSelfieScanned(false)
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
      
      {/* Header and Step Indicator */}
      <div className="px-[16px] pt-[24px] pb-[16px] sticky top-0 bg-[var(--surface-page)] z-10">
        <div className="flex items-center gap-[12px] justify-center mb-[8px]">
          <div className={cn("w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold", step === 1 ? "bg-[var(--red)] text-white" : "bg-[var(--success)] text-white")}>
            {step === 2 ? <CheckCircle2 className="w-[16px] h-[16px]" /> : "1"}
          </div>
          <div className="w-[32px] h-[2px] bg-[#E8ECF7]" />
          <div className={cn("w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] font-bold", step === 2 ? "bg-[var(--red)] text-white" : "bg-white text-[var(--text-muted)] border border-[#E8ECF7]")}>
            2
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
          <div className="bg-white rounded-[20px] shadow-[var(--shadow-md)] p-[20px] flex flex-col gap-[16px]">
            <div>
              <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Apelyido (Last Name)</label>
              <input 
                value={formData.lastName}
                onChange={(e: any) => setFormData({...formData, lastName: e.target.value})}
                className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors", error?.field === "lastName" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
              />
              {error?.field === "lastName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
            </div>

            <div>
              <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Pangalan (First Name)</label>
              <input 
                value={formData.firstName}
                onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
                className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors", error?.field === "firstName" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
              />
              {error?.field === "firstName" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
            </div>

            <div>
              <label className="text-[13px] font-medium text-[var(--text-secondary)] mb-[6px] block">Numero ng Telepono</label>
              <div className="relative">
                <div className="absolute left-[12px] top-1/2 -translate-y-1/2 font-bold text-[13px] text-[var(--text-primary)]">
                  +63
                </div>
                <input 
                  type="tel"
                  placeholder="09XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e: any) => {
                    const v = e.target.value.replace(/\D/g, '')
                    setFormData({...formData, phone: v})
                  }}
                  className={cn("w-full h-[52px] rounded-[14px] pl-[40px] pr-[16px] text-[15px] bg-[var(--surface-input)] border-[1.5px] outline-none transition-colors font-mono tracking-wide", error?.field === "phone" ? "border-[var(--danger)]" : "border-transparent focus:border-[var(--blue)] focus:bg-white")}
                />
              </div>
              {error?.field === "phone" && <p className="text-[11px] text-[var(--danger)] mt-[4px]">{error.message}</p>}
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
                onChange={(e: any) => setFormData({...formData, idNumber: e.target.value})}
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

            <div 
              className={cn(
                "rounded-[20px] bg-white p-[20px] flex items-center shadow-[var(--shadow-md)] transition-colors border-[1.5px] cursor-pointer",
                idScanned ? "border-[var(--success)]" : "border-transparent"
              )}
              onClick={handleIdScan}
            >
              <div className={cn("w-[56px] h-[56px] rounded-full flex items-center justify-center shrink-0", idScanned ? "bg-[var(--success)]" : "bg-[var(--navy)]")}>
                <Camera className="w-[28px] h-[28px] text-white" />
              </div>
              <div className="ml-[16px] flex-1">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">I-Scan ang Government ID</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">Awtomatikong mababasa ang detalye</p>
              </div>
              <div className="shrink-0 ml-[12px]">
                {idScanned ? (
                  <CheckCircle2 className="w-[28px] h-[28px] text-[var(--success)]" />
                ) : (
                  <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#E8ECF7]" />
                )}
              </div>
            </div>

            <div 
              className={cn(
                "rounded-[20px] bg-white p-[20px] flex items-center shadow-[var(--shadow-md)] transition-colors border-[1.5px] cursor-pointer",
                selfieScanned ? "border-[var(--success)]" : "border-transparent"
              )}
              onClick={handleSelfieScan}
            >
              <div className={cn("w-[56px] h-[56px] rounded-full flex items-center justify-center shrink-0 overflow-hidden", selfieScanned ? "bg-[var(--success)]" : "bg-[var(--red)]")}>
                {selfieScanned ? (
                  <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`} alt="selfie" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-[28px] h-[28px] text-white" />
                )}
              </div>
              <div className="ml-[16px] flex-1">
                <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Kunan ng Selfie</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-[2px]">Para sa face verification</p>
              </div>
              <div className="shrink-0 ml-[12px]">
                {selfieScanned ? (
                  <CheckCircle2 className="w-[28px] h-[28px] text-[var(--success)]" />
                ) : (
                  <div className="w-[28px] h-[28px] rounded-full border-[2px] border-[#E8ECF7]" />
                )}
              </div>
            </div>
            
            {idScanned && !selfieScanned && (
              <div className="bg-[var(--success-light)] text-[var(--success)] text-[13px] font-bold p-[12px] rounded-[12px] text-center shadow-sm mt-[8px] animate-in slide-in-from-top-2">
                Na-detect ang ID! I-check ang mga detalye.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-[80px] left-0 right-0 px-[16px] pb-[16px] bg-gradient-to-t from-[var(--surface-page)] via-[var(--surface-page)] to-transparent pt-[40px] pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          {step === 1 ? (
            <button 
              onClick={handleNext}
              className="w-full h-[52px] bg-[var(--red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-[0.98] shadow-[var(--shadow-md)]"
            >
              Susunod →
            </button>
          ) : (
            <div className="flex flex-col gap-[8px]">
              <button 
                onClick={handleRegister}
                style={{ opacity: (idScanned || selfieScanned) ? 1 : 0.4 }}
                className={cn(
                  "w-full h-[52px] bg-[var(--red)] text-white font-bold rounded-[14px] text-[15px] transition-transform shadow-[var(--shadow-md)]",
                  (idScanned || selfieScanned) ? "active:scale-[0.98]" : ""
                )}
              >
                I-Register
              </button>
              {!(idScanned && selfieScanned) && (
                <p className="text-center text-[12px] font-semibold text-[var(--text-muted)]">
                  Pwedeng laktawan ang litrato sa demo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
