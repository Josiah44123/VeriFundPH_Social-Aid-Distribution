"use client"

import { useState } from "react"
import { Camera, CheckCircle2, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QRCode } from "@/components/QRCode"
import { cn } from "@/lib/utils"
import { LoadingOverlay } from "@/components/LoadingOverlay"

export function RegisterTab() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
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
    setStep(2)
  }

  const handleRegister = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (formData.phone === "09171234567") {
        setError("Duplicate — may existing na account ang numerong ito.")
        setTimeout(() => setError(""), 3000)
      } else {
        setStep(3)
      }
    }, 1500)
  }

  const handleIdScan = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setFormData(prev => ({ ...prev, idNumber: "1234-5678-9012-3456" }))
      setIdScanned(true)
      alert("Na-read ang ID! I-check ang mga detalye.") // Using browser alert for toast
    }, 1500)
  }

  const handleSelfieScan = () => {
    setSelfieScanned(true)
  }

  if (step === 3) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-8">
        <div className="w-[80px] h-[80px] bg-[var(--success-green)] rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-[24px] font-bold text-[var(--text-primary)] mb-1">Registered ka na!</h1>
        <p className="text-[16px] text-[var(--text-muted)] mb-2 uppercase">{formData.firstName} {formData.lastName}</p>
        <div className="font-mono text-[16px] font-bold text-[var(--ph-gold)] mb-6">
          VF-2025-0156-STC
        </div>
        
        <div className="mb-8 p-4 border rounded-xl border-dashed">
          <QRCode value="VF-2025-0156-STC" size={120} />
        </div>

        <button 
          onClick={() => window.print()}
          className="w-full h-[56px] border-[1.5px] border-[var(--ph-red)] text-[var(--ph-red)] font-bold rounded-[14px] text-[15px] mb-3 transition-transform active:scale-95"
        >
          I-print ang QR Card
        </button>
        <button 
          onClick={() => {
            setFormData({ lastName: "", firstName: "", middleName: "", phone: "", idType: "", idNumber: "" })
            setIdScanned(false)
            setSelfieScanned(false)
            setStep(1)
          }}
          className="w-full h-[56px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-95"
        >
          Mag-register ng Bago
        </button>

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
    <div className="flex flex-col h-full animate-in fade-in">
      <LoadingOverlay isVisible={loading} />
      
      {/* Step Indicator */}
      <div className="mb-6">
        <div className="text-[13px] font-semibold text-[color:var(--text-muted)] mb-2">
          Hakbang {step} ng 2 — {step === 1 ? "Impormasyon" : "Litrato at ID"}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[var(--ph-red)] transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] font-semibold p-3 rounded-xl mb-4 text-center">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="section-label mb-1.5 block">Apelyido</label>
            <Input 
              value={formData.lastName}
              onChange={(e: any) => setFormData({...formData, lastName: e.target.value})}
              className={cn("bg-white", error && !formData.lastName ? "border-[var(--ph-red)]" : "")}
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Pangalan</label>
            <Input 
              value={formData.firstName}
              onChange={(e: any) => setFormData({...formData, firstName: e.target.value})}
              className={cn("bg-white", error && !formData.firstName ? "border-[var(--ph-red)]" : "")}
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Karagdagang Pangalan (Optional)</label>
            <Input 
              value={formData.middleName}
              onChange={(e: any) => setFormData({...formData, middleName: e.target.value})}
              className="bg-white"
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Numero ng Telepono</label>
            <Input 
              type="tel"
              placeholder="09XXXXXXXXX"
              value={formData.phone}
              onChange={(e: any) => setFormData({...formData, phone: e.target.value})}
              className={cn("bg-white", error && !formData.phone ? "border-[var(--ph-red)]" : "")}
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Uri ng ID</label>
            <Select value={formData.idType} onValueChange={(v: any) => setFormData({...formData, idType: v})}>
              <SelectTrigger className={cn("h-[52px] bg-white rounded-[12px]", error && !formData.idType ? "border-[var(--ph-red)]" : "")}>
                <SelectValue placeholder="Pumili ng ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="philsys">PhilSys</SelectItem>
                <SelectItem value="driver">Driver's License</SelectItem>
                <SelectItem value="voter">Voter's ID</SelectItem>
                <SelectItem value="postal">Postal ID</SelectItem>
                <SelectItem value="sss">SSS ID</SelectItem>
                <SelectItem value="gsis">GSIS ID</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="section-label mb-1.5 block">Numero ng ID</label>
            <Input 
              value={formData.idNumber}
              onChange={(e: any) => setFormData({...formData, idNumber: e.target.value})}
              className={cn("bg-white font-mono", error && !formData.idNumber ? "border-[var(--ph-red)]" : "")}
            />
          </div>
          <div>
            <label className="section-label mb-1.5 block">Barangay</label>
            <Input 
              value="Sta. Cruz, Quezon City"
              readOnly
              className="bg-gray-50 text-gray-500"
            />
          </div>

          <button 
            onClick={handleNext}
            className="w-full h-[52px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] mt-4 transition-transform active:scale-95"
          >
            Susunod &rarr;
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div 
            className={cn(
              "v-card h-[80px] flex items-center px-4 cursor-pointer transition-colors active:bg-gray-50 relative",
              idScanned ? "border-green-500 bg-green-50/20" : ""
            )}
            onClick={handleIdScan}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">I-Scan ang ID</h3>
              <p className="text-[12px] text-[var(--text-muted)]">OCR — mababasa ang ID automatically</p>
            </div>
            <div className="shrink-0">
              {idScanned ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              )}
            </div>
          </div>

          <div 
            className={cn(
              "v-card h-[80px] flex items-center px-4 cursor-pointer transition-colors active:bg-gray-50 relative",
              selfieScanned ? "border-green-500 bg-green-50/20" : ""
            )}
            onClick={handleSelfieScan}
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 overflow-hidden">
              {selfieScanned ? (
                <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`} alt="selfie" className="w-full h-full object-cover" />
              ) : (
                <UserPlus className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-[15px] font-bold text-[var(--text-primary)]">Kunan ng Selfie</h3>
              <p className="text-[12px] text-[var(--text-muted)]">Siguraduhing malinaw ang mukha</p>
            </div>
            <div className="shrink-0">
              {selfieScanned ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              )}
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={handleRegister}
              disabled={(!idScanned || !selfieScanned)}
              className="w-full h-[56px] bg-[var(--ph-red)] text-white font-bold rounded-[14px] text-[15px] transition-transform active:scale-95 disabled:bg-gray-300"
            >
              I-Register
            </button>
            <div className="text-center mt-4">
              <button 
                onClick={() => handleRegister()}
                className="text-[13px] text-[var(--text-muted)] font-semibold hover:text-gray-900"
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
