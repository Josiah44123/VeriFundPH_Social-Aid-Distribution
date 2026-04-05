"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LockKeyhole, Shield, CheckCircle2, AlertCircle } from "lucide-react"
import { OTPInput } from "@/components/OTPInput"
import { validatePhone, validateEmail } from "@/lib/validation"
import { normalizePhone, useVeriFundStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function CitizenLogin() {
  const router = useRouter()
  const store = useVeriFundStore()
  const [step, setStep] = useState<1 | 2>(1)
  const [contact, setContact] = useState("")
  const [method, setMethod] = useState<"sms" | "email">("sms")
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [inputError, setInputError] = useState("")
  const [devCode, setDevCode] = useState("")
  const [attemptsLeft, setAttemptsLeft] = useState(3)
  const [notFound, setNotFound] = useState(false)

  // Build the full phone number for display & API calls
  const fullPhone = method === "sms" ? (contact.startsWith("0") ? contact : "0" + contact) : contact

  const handleBlurValidation = () => {
    if (!contact) return
    if (method === "sms") {
      const phone = contact.startsWith("0") ? contact : "0" + contact
      const result = validatePhone(phone)
      if (!result.valid) setInputError(result.error || "")
      else setInputError("")
    } else {
      const result = validateEmail(contact)
      if (!result.valid) setInputError(result.error || "")
      else setInputError("")
    }
  }

  const handleSendCode = async () => {
    // Client-side validation first
    if (!contact) {
      setInputError("Kailangan itong punan")
      return
    }

    if (method === "sms") {
      const phone = contact.startsWith("0") ? contact : "0" + contact
      const result = validatePhone(phone)
      if (!result.valid) {
        setInputError(result.error || "")
        return
      }
    } else {
      const result = validateEmail(contact)
      if (!result.valid) {
        setInputError(result.error || "")
        return
      }
    }

    setInputError("")
    setLoading(true)

    try {
      const apiContact = method === "sms" ? fullPhone : contact
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: apiContact, method }),
      })
      const data = await res.json()

      if (res.status === 429) {
        setInputError(data.error || "Maraming pagtatangka. Subukan ulit mamaya.")
        setLoading(false)
        return
      }

      if (!res.ok) {
        setInputError(data.error || "May error.")
        setLoading(false)
        return
      }

      // Success: advance to step 2
      setDevCode(data.devCode)
      setStep(2)
      setAttemptsLeft(3)
      startCountdown()
    } catch {
      setInputError("Hindi makakonekta sa server.")
    } finally {
      setLoading(false)
    }
  }

  const startCountdown = useCallback(() => {
    setCountdown(30)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  const handleOTPComplete = useCallback(async (code: string) => {
    setOtpError("")
    setLoading(true)

    try {
      const apiContact = method === "sms" ? fullPhone : contact
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: apiContact, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft)
        }
        setOtpError(data.error || "Mali ang code.")
        setLoading(false)
        return
      }

      // OTP verified — look up beneficiary in store
      const normalizedContact = method === "sms" ? normalizePhone(fullPhone) : contact
      const beneficiary = store.beneficiaries.find(b => {
        if (method === "sms") {
          return normalizePhone(b.phone) === normalizedContact
        }
        return false // email lookup not applicable to prototype
      })

      if (beneficiary) {
        // Set citizen session
        const session = {
          verifundId: beneficiary.id,
          name: `${beneficiary.firstName}${beneficiary.middleName ? " " + beneficiary.middleName : ""} ${beneficiary.lastName}`,
          barangay: beneficiary.barangay,
          status: beneficiary.status,
        }
        sessionStorage.setItem("citizen_session", JSON.stringify(session))
        setOtpSuccess(true)
        setTimeout(() => {
          router.push("/citizen/dashboard")
        }, 500)
      } else {
        setNotFound(true)
      }
    } catch {
      setOtpError("Hindi makakonekta sa server.")
    } finally {
      setLoading(false)
    }
  }, [method, fullPhone, contact, store.beneficiaries, router])

  const handleManualVerify = () => {
    const inputs = document.querySelectorAll<HTMLInputElement>('input[inputmode="numeric"]')
    const code = Array.from(inputs).map(i => i.value).join("")
    if (code.length === 6) {
      handleOTPComplete(code)
    }
  }

  const handleResend = async () => {
    setOtpError("")
    setLoading(true)
    try {
      const apiContact = method === "sms" ? fullPhone : contact
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: apiContact, method }),
      })
      const data = await res.json()
      if (res.ok) {
        setDevCode(data.devCode)
        startCountdown()
        setAttemptsLeft(3)
      } else {
        setOtpError(data.error || "Hindi ma-resend.")
      }
    } catch {
      setOtpError("Hindi makakonekta sa server.")
    } finally {
      setLoading(false)
    }
  }

  // Not found state
  if (notFound) {
    return (
      <div className="bg-surface min-h-screen flex flex-col font-editorial relative overflow-hidden z-0 w-full">
        <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary-fixed opacity-10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary-fixed opacity-10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="bg-surface/80 backdrop-blur-xl px-6 py-4 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          <button onClick={() => router.push("/")} className="p-2 -ml-2 text-on-surface hover:text-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VeriFund" className="h-8 w-8 object-contain" />
            <span className="font-extrabold tracking-tight text-primary text-xl">VeriFund</span>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md mx-auto px-6 mt-12 flex flex-col items-center">
          <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 bg-tertiary/10 rounded-full flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-tertiary" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter text-on-surface">Hindi ka pa nakapalit sa sistema</h1>
            <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
              Makipag-ugnayan sa iyong barangay officer para ma-register ang iyong account sa VeriFund.
            </p>
            <button
              onClick={() => { setNotFound(false); setStep(1); setContact(""); setDevCode(""); }}
              className="w-full bg-primary-container hover:bg-primary text-white py-4 rounded-full font-bold transition-all mt-2"
            >
              Bumalik
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface min-h-screen flex flex-col font-editorial relative overflow-hidden z-0 w-full">
      {/* Background Blobs */}
      <div className="fixed top-1/4 -left-20 w-96 h-96 bg-primary-fixed opacity-10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-secondary-fixed opacity-10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-surface/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Top Navigation Bar */}
      <div className="bg-surface/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => step === 2 ? (setStep(1), setDevCode(""), setOtpError("")) : router.push("/")} 
            className="p-2 -ml-2 text-on-surface hover:text-primary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="VeriFund" className="h-8 w-8 object-contain" />
            <span className="font-extrabold tracking-tight text-primary text-xl">VeriFund</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 w-full max-w-md mx-auto px-6 mt-12 mb-12 flex flex-col">
        <div className="w-full relative">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col gap-6"
              >
                <div>
                  <div className="rounded-2xl bg-primary-container/10 p-3 text-primary w-fit mb-4">
                    <LockKeyhole className="w-6 h-6" />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">
                    Mag-login
                  </h1>
                  <p className="text-on-surface-variant font-medium text-sm">
                    Magpapadala kami ng verification code.
                  </p>
                </div>

                {/* SMS/Email Toggle */}
                <div className="flex p-1.5 bg-surface-container-high rounded-2xl w-fit gap-1 relative">
                  <button 
                    onClick={() => { setMethod("sms"); setContact(""); setInputError(""); }}
                    className={cn(
                      "relative z-10 transition-colors text-sm font-bold",
                      method === "sms" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    <div className={cn("px-8 py-2 rounded-xl", method === "sms" ? "bg-surface-container-lowest shadow-sm" : "")}>
                      SMS
                    </div>
                  </button>
                  <button 
                    onClick={() => { setMethod("email"); setContact(""); setInputError(""); }}
                    className={cn(
                      "relative z-10 transition-colors text-sm font-bold",
                      method === "email" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                    )}
                  >
                    <div className={cn("px-8 py-2 rounded-xl", method === "email" ? "bg-surface-container-lowest shadow-sm" : "")}>
                      Email
                    </div>
                  </button>
                </div>

                {/* Input Field */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-outline ml-1 mb-2">
                    {method === "sms" ? "Numero ng Mobile" : "Email Address"}
                  </div>
                  <div 
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl transition-all border",
                      inputError ? "bg-tertiary-container/10 border-tertiary/30" : "bg-surface-container-high border-transparent focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/30"
                    )}
                  >
                    {method === "sms" && (
                      <div className="text-on-surface font-bold border-r border-outline-variant pr-3 shrink-0">
                        +63
                      </div>
                    )}
                    <input 
                      value={contact}
                      onChange={(e) => {
                        setInputError("")
                        if (method === "sms") {
                          let val = e.target.value.replace(/\D/g, '')
                          // Auto-correct: if user types starting with 9, prepend 0
                          if (val.startsWith("9") && val.length <= 10) {
                            // Keep as is, we'll prepend 0 when building fullPhone
                          }
                          setContact(val.slice(0, 10))
                        } else {
                          setContact(e.target.value)
                        }
                      }}
                      onBlur={handleBlurValidation}
                      placeholder={method === "sms" ? "9171234567" : "juan@email.com"}
                      inputMode={method === "sms" ? "numeric" : "email"}
                      pattern={method === "sms" ? "[0-9]*" : undefined}
                      className="bg-transparent border-none focus:ring-0 w-full font-semibold text-on-surface placeholder:text-outline/50 outline-none"
                    />
                  </div>
                  {inputError && (
                    <p className="text-xs text-tertiary font-bold ml-1 mt-2">{inputError}</p>
                  )}
                </div>

                <motion.button 
                  onClick={handleSendCode}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-primary-container hover:bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 mt-2 min-h-[48px]"
                >
                  Mag-send ng Code
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col w-full"
              >
                <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col gap-4">
                  <div>
                    <div className="rounded-2xl bg-primary-container/10 p-3 text-primary w-fit mb-4">
                      {otpSuccess ? <CheckCircle2 className="w-6 h-6 text-primary" /> : <Shield className="w-6 h-6" />}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tighter text-on-surface mb-2">
                      I-enter ang OTP
                    </h1>
                    <p className="text-on-surface-variant font-medium text-sm">
                      Napadala na sa <span className="text-on-surface font-bold">{method === "sms" ? "+63" : ""}{contact}</span>
                    </p>
                  </div>

                  <div className="py-2">
                    <OTPInput length={6} onComplete={handleOTPComplete} error={!!otpError} />
                    
                    {/* OTP Dev Code — Clean Textual Design */}
                    {devCode && (
                      <div className="mt-4 text-center">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">PROTOTYPE OTP</p>
                        <p className="text-xl font-bold text-primary tracking-widest">{devCode}</p>
                      </div>
                    )}

                    <div className="h-4 mt-2 flex justify-center items-center">
                      {otpError ? (
                        <span className="text-xs font-bold text-tertiary" style={{ animation: 'shake 300ms ease-in-out' }}>
                          {otpError} {attemptsLeft > 0 && `(${attemptsLeft} na pagkakataon)`}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex justify-center flex-col items-center mt-2">
                    {countdown > 0 ? (
                      <span className="text-on-surface-variant text-sm text-center">
                        I-resend in <span className="text-primary font-bold">0:{countdown.toString().padStart(2, '0')}</span>
                      </span>
                    ) : (
                      <button 
                        onClick={handleResend}
                        className="text-primary font-bold text-sm underline underline-offset-4 hover:text-primary-container transition-colors min-h-[44px]"
                      >
                        I-resend ang code
                      </button>
                    )}
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary-container text-white font-bold py-4 rounded-full shadow-[0_10px_30px_rgba(26,86,173,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg mb-2 flex justify-center items-center min-h-[52px]"
                    onClick={handleManualVerify}
                  >
                    I-verify
                  </motion.button>
                </div>

                {/* Security Notice */}
                <div className="w-full bg-surface-container-lowest p-5 rounded-2xl editorial-shadow relative overflow-hidden mt-6">
                  <div className="absolute top-0 right-0 p-3 opacity-10 text-6xl">🔒</div>
                  <div className="flex gap-3 relative z-10">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black tracking-widest text-secondary uppercase mb-1">Paalala ng Seguridad</p>
                      <p className="text-xs leading-relaxed font-semibold text-on-surface-variant">
                        Huwag kailanman ibigay ang iyong OTP sa kahit na sino.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
