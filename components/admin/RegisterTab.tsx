"use client"

import { useState } from "react"
import { Camera, CheckCircle2, UserPlus } from "lucide-react"
import { QRCode } from "@/components/QRCode"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { useVeriFundStore } from "@/lib/store"
import type { Beneficiary, AuditEntry } from "@/lib/store"

const OFFICER_NAME = "Josefa Reyes"
const BARANGAY = "Sta. Cruz, Quezon City"
const DISTRIBUTION_ID = "SAP-2025-Q1"

export function RegisterTab() {
  const { beneficiaries, addBeneficiary, addAuditEntry } = useVeriFundStore()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [generatedId, setGeneratedId] = useState("")
  
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    phone: "",
    idType: "",
    idNumber: "",
  })
  
  const [idScanned, setIdScanned] = useState(false)
  const [selfieScanned, setSelfieScanned] = useState(false)

  const handleNext = () => {
    if (!formData.lastName || !formData.firstName || !formData.phone || !formData.idType || !formData.idNumber) {
      setError("Kailangan itong punan.")
      setTimeout(() => setError(""), 2000)
      return
    }
    const phoneRegex = /^09\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      setError("Invalid phone pattern (09XXXXXXXXX)")
      setTimeout(() => setError(""), 2000)
      return
    }
    // Check for duplicate phone
    const dup = beneficiaries.find(b => b.phone === formData.phone)
    if (dup) {
      setError("Duplicate — may existing na account ang numerong ito.")
      setTimeout(() => setError(""), 3000)
      return
    }
    setStep(2)
  }

  const handleRegister = () => {
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
        middleName: formData.middleName || undefined,
        phone: formData.phone,
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
    setFormData({ lastName: "", firstName: "", middleName: "", phone: "", idType: "", idNumber: "" })
    setIdScanned(false)
    setSelfieScanned(false)
    setGeneratedId("")
    setStep(1)
  }

  if (step === 3) {
    return (
      <div className="fixed inset-0 z-[100] bg-[var(--surface-page)] flex flex-col items-center justify-center p-[24px] animate-in fade-in zoom-in-95 duration-200">
        <div className="w-[100px] h-[100px] bg-[var(--success)] rounded-full flex items-center justify-center mb-[24px] shadow-lg animate-in zoom-in-50 delay-150">
          <CheckCircle2 className="w-[56px] h-[56px] text-white" />
        </div>
        <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-[8px] text-center leading-tight">Registered ka na!</h1>
        <p className="text-[16px] text-[var(--text-secondary)] mb-[8px] uppercase font-bold tracking-wide">{formData.firstName} {formData.lastName}</p>
        <div className="font-mono text-[16px] font-bold text-[var(--ph-gold)] mb-[32px] bg-[var(--info-light)] px-[16px] py-[6px] rounded-[10px]">
          {generatedId}
        </div>
        
        <div className="mb-[32px] p-[20px] bg-white rounded-[24px] shadow-sm border border-[#E8ECF7]">
          <QRCode value={generatedId} id="qr-code" size={160} />
        </div>

        <div className="w-full flex justify-center gap-[12px] flex-col max-w-sm">
          <button 
            onClick={() => window.print()}
            className="w-full h-[52px] border-[2px] border-[var(--ph-red)] text-[var(--ph-red)] font-bold rounded-[14px] text-[15px] transition-transform active:scale-95"
          >
            I-print ang QR Card
          </button>
          <button 
            onClick={resetForm}
            className="w-full h-[52px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-95 shadow-sm hover:opacity-90"
          >
            Mag-register ng Bago
          </button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            #qr-code, #qr-code * { visibility: visible; }
            #qr-code { position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
          }
        `}} />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in px-[16px] pt-[24px] pb-[32px]">
      <LoadingOverlay isVisible={loading} />
      
      {/* Step Indicator */}
      <div className="mb-[24px]">
        <div className="text-[13px] font-bold text-[var(--text-secondary)] mb-[8px]">
          Hakbang {step} ng 2 — {step === 1 ? "Impormasyon" : "Litrato at ID"}
        </div>
        <div className="w-full h-[6px] bg-[#E8ECF7] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--ph-red)] transition-all duration-300 ease-out rounded-full"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-[var(--danger-light)] border border-red-200 text-[var(--danger)] text-[13px] font-bold p-[12px] rounded-[12px] mb-[16px] text-center animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-[16px]">
          <div>
            <label className="section-label mb-[6px] block">Apelyido</label>
            <input 
              value={formData.lastName}
              onChange={(e: any) => setFormData({...formData, lastName: e.target.value})}
              className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] outline-none transition-colors", error && !formData.lastName ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" : "border-transparent bg-white text-[var(--text-primary)] focus:border-[var(--ph-red)]")}
            />
          </div>
          <div>
            <label className="section-label mb-[6px] block">Pangalan</label>
            <input 
              value={formData.firstName}
              onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
              className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] outline-none transition-colors", error && !formData.firstName ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" : "border-transparent bg-white text-[var(--text-primary)] focus:border-[var(--ph-red)]")}
            />
          </div>
          <div>
            <label className="section-label mb-[6px] block">Karagdagang Pangalan (Optional)</label>
            <input 
              value={formData.middleName}
              onChange={(e: any) => setFormData({...formData, middleName: e.target.value})}
              className="w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] border-transparent bg-white text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--ph-red)]"
            />
          </div>
          <div>
            <label className="section-label mb-[6px] block">Numero ng Telepono</label>
            <input 
              type="tel"
              placeholder="09XXXXXXXXX"
              value={formData.phone}
              onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] outline-none transition-colors font-mono tracking-wide", error && !formData.phone ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" : "border-transparent bg-white text-[var(--text-primary)] focus:border-[var(--ph-red)]")}
            />
          </div>
          <div>
            <label className="section-label mb-[6px] block">Uri ng ID</label>
            <select 
              value={formData.idType} 
              onChange={(e: any) => setFormData({...formData, idType: e.target.value})}
              className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] outline-none transition-colors appearance-none", error && !formData.idType ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" : "border-transparent bg-white text-[var(--text-primary)] focus:border-[var(--ph-red)]")}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '20px' }}
            >
              <option value="" disabled>Pumili ng ID</option>
              <option value="PhilSys">PhilSys</option>
              <option value="Driver's License">Driver's License</option>
              <option value="Voter's ID">Voter's ID</option>
              <option value="Postal ID">Postal ID</option>
              <option value="SSS ID">SSS ID</option>
              <option value="GSIS ID">GSIS ID</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div>
            <label className="section-label mb-[6px] block">Numero ng ID</label>
            <input 
              value={formData.idNumber}
              onChange={(e: any) => setFormData({...formData, idNumber: e.target.value})}
              className={cn("w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] font-mono tracking-wide outline-none transition-colors", error && !formData.idNumber ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" : "border-transparent bg-white text-[var(--text-primary)] focus:border-[var(--ph-red)]")}
            />
          </div>
          <div>
            <label className="section-label mb-[6px] block">Barangay</label>
            <input 
              value={BARANGAY}
              readOnly
              className="w-full h-[52px] rounded-[14px] px-[16px] text-[15px] border-[1.5px] border-transparent bg-[#E8ECF7] text-[var(--text-muted)] font-bold outline-none cursor-not-allowed"
            />
          </div>

          <button 
            onClick={handleNext}
            className="w-full h-[52px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] mt-[8px] transition-transform active:scale-95 shadow-sm hover:opacity-90"
          >
            Susunod &rarr;
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-[16px]">
          <div 
            className={cn(
              "h-[80px] rounded-[20px] bg-white flex items-center px-[20px] cursor-pointer transition-all active:scale-[0.98] border-[1.5px]",
              idScanned ? "border-[var(--success)] bg-[var(--success-light)]" : "border-transparent shadow-sm hover:border-[#E8ECF7]"
            )}
            onClick={handleIdScan}
          >
            <div className={cn("w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0", idScanned ? "bg-[var(--success)]" : "bg-[var(--info-light)]")}>
              <Camera className={cn("w-[24px] h-[24px]", idScanned ? "text-white" : "text-[var(--ph-blue)]")} />
            </div>
            <div className="ml-[16px] flex-1">
              <h3 className={cn("text-[16px] font-bold", idScanned ? "text-[var(--success)]" : "text-[var(--text-primary)]")}>I-Scan ang ID</h3>
              <p className={cn("text-[12px]", idScanned ? "text-[var(--success)]/80 font-semibold" : "text-[var(--text-muted)]")}>OCR — mababasa ang ID automatically</p>
            </div>
            <div className="shrink-0">
              {idScanned ? (
                <CheckCircle2 className="w-[28px] h-[28px] text-[var(--success)]" />
              ) : (
                <div className="w-[28px] h-[28px] rounded-full bg-[#E8ECF7]" />
              )}
            </div>
          </div>

          <div 
            className={cn(
              "h-[80px] rounded-[20px] bg-white flex items-center px-[20px] cursor-pointer transition-all active:scale-[0.98] border-[1.5px]",
              selfieScanned ? "border-[var(--success)] bg-[var(--success-light)]" : "border-transparent shadow-sm hover:border-[#E8ECF7]"
            )}
            onClick={handleSelfieScan}
          >
            <div className={cn("w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 overflow-hidden", selfieScanned ? "bg-[var(--success)]" : "bg-[var(--danger-light)]")}>
              {selfieScanned ? (
                <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`} alt="selfie" className="w-full h-full object-cover" />
              ) : (
                <UserPlus className="w-[24px] h-[24px] text-[var(--danger)]" />
              )}
            </div>
            <div className="ml-[16px] flex-1">
              <h3 className={cn("text-[16px] font-bold", selfieScanned ? "text-[var(--success)]" : "text-[var(--text-primary)]")}>Kunan ng Selfie</h3>
              <p className={cn("text-[12px]", selfieScanned ? "text-[var(--success)]/80 font-semibold" : "text-[var(--text-muted)]")}>Siguraduhing malinaw ang mukha</p>
            </div>
            <div className="shrink-0">
              {selfieScanned ? (
                <CheckCircle2 className="w-[28px] h-[28px] text-[var(--success)]" />
              ) : (
                <div className="w-[28px] h-[28px] rounded-full bg-[#E8ECF7]" />
              )}
            </div>
          </div>

          <div className="mt-[32px]">
            <button 
              onClick={handleRegister}
              disabled={(!idScanned || !selfieScanned)}
              className="w-full h-[52px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-[0.98] shadow-sm hover:opacity-90 disabled:bg-[#E8ECF7] disabled:text-[#A0ABC0] disabled:active:scale-100 disabled:shadow-none"
            >
              I-Register
            </button>
            <div className="text-center mt-[16px]">
              <button 
                onClick={() => handleRegister()}
                className="text-[13px] text-[var(--text-muted)] font-bold hover:text-[var(--text-secondary)] py-[8px] px-[16px] rounded-full transition-colors active:bg-[#E8ECF7]"
              >
                Laktawan (Demo)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
