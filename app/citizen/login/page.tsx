"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LockKeyhole, Shield, CheckCircle2 } from "lucide-react"
import { OTPInput } from "@/components/OTPInput"
import { VALID_OTP } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function CitizenLogin() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [contact, setContact] = useState("")
  const [method, setMethod] = useState<"sms" | "email">("sms")
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [inputError, setInputError] = useState("")

  const handleSendCode = () => {
    if (!contact) {
      setInputError("Kailangan itong punan")
      return
    }
    setInputError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
      startCountdown()
    }, 800)
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

  const handleOTPComplete = useCallback((code: string) => {
    if (code === VALID_OTP) {
      setOtpSuccess(true)
      setTimeout(() => {
        router.push("/citizen/dashboard")
      }, 500)
    } else {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 2000)
    }
  }, [router])

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
            onClick={() => step === 2 ? setStep(1) : router.push("/")} 
            className="p-2 -ml-2 text-on-surface hover:text-primary transition-colors"
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
                className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col gap-8"
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
                    onClick={() => setMethod("sms")}
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
                    onClick={() => setMethod("email")}
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
                          setContact(e.target.value.replace(/\D/g, ''))
                        } else {
                          setContact(e.target.value)
                        }
                      }}
                      placeholder={method === "sms" ? "09XXXXXXXXX" : "juan@email.com"}
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
                  className="w-full bg-primary-container hover:bg-primary text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 mt-2"
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
                <div className="bg-surface-container-lowest rounded-2xl p-8 editorial-shadow flex flex-col gap-6">
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
                    <OTPInput length={6} onComplete={handleOTPComplete} error={otpError} />
                    <div className="h-6 mt-2 flex justify-center items-center">
                      {otpError && (
                        <span className="text-xs font-bold text-tertiary" style={{ animation: 'shake 300ms ease-in-out' }}>
                          Mali ang code. Subukan ulit.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center flex-col items-center gap-3">
                    {countdown > 0 ? (
                      <span className="text-on-surface-variant text-sm text-center">
                        I-resend in <span className="text-primary font-bold">0:{countdown.toString().padStart(2, '0')}</span>
                      </span>
                    ) : (
                      <button 
                        onClick={() => startCountdown()}
                        className="text-primary font-bold text-sm underline underline-offset-4 hover:text-primary-container transition-colors"
                      >
                        I-resend ang code
                      </button>
                    )}
                  </div>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-primary-container text-white font-bold py-5 rounded-full shadow-[0_10px_30px_rgba(26,86,173,0.2)] hover:scale-[1.02] active:scale-95 transition-all text-lg mt-2 flex justify-center items-center"
                    onClick={() => {}}
                  >
                    I-verify
                  </motion.button>
                </div>

                {/* Security Notice */}
                <div className="w-full bg-surface-container-lowest p-5 rounded-2xl editorial-shadow relative overflow-hidden mt-4">
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
