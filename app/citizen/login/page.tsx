"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, CheckCircle2 } from "lucide-react"
import { OTPInput } from "@/components/OTPInput"
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
    if (code === "123456") {
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
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col relative w-full overflow-hidden">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center"
          >
            <div className="w-[48px] h-[48px] border-[4px] border-[var(--navy)] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div 
        className="h-[120px] flex items-start pt-[24px] px-[16px] shrink-0 relative z-0"
        style={{ background: 'linear-gradient(160deg, #18269B, #0D1966)' }}
      >
        <button onClick={() => step === 2 ? setStep(1) : router.push("/")} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors relative z-20">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-[24px] relative z-10 px-[20px] pb-[40px] flex flex-col items-center pt-[44px] shadow-[0_-8px_32px_rgba(0,0,0,0.08)]">
        {/* Floating Avatar */}
        <div className="absolute -top-[32px] w-[64px] h-[64px] rounded-full bg-[var(--navy)] border-[4px] border-white flex items-center justify-center shadow-[var(--shadow-md)]">
          {otpSuccess ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 className="w-[32px] h-[32px] text-[#FFB800]" />
            </motion.div>
          ) : (
            <User className="w-[32px] h-[32px] text-white" />
          )}
        </div>

        <div className="w-full max-w-md mt-[8px]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col w-full"
              >
                <h1 className="text-[20px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
                  Mag-login
                </h1>
                <p className="text-[13px] text-[var(--text-muted)] text-center mb-[32px]">
                  Magpapadala kami ng verification code.
                </p>

                {/* Segmented Control */}
                <div className="bg-[var(--surface-input)] p-[4px] rounded-[14px] flex relative mb-[24px] h-[52px]">
                  <button 
                    onClick={() => setMethod("sms")}
                    className={cn(
                      "flex-1 rounded-[10px] text-[14px] font-medium z-10 transition-colors",
                      method === "sms" ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    SMS
                  </button>
                  <button 
                    onClick={() => setMethod("email")}
                    className={cn(
                      "flex-1 rounded-[10px] text-[14px] font-medium z-10 transition-colors",
                      method === "email" ? "text-[var(--text-primary)] font-bold" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    Email
                  </button>
                  <motion.div 
                    className="absolute top-[4px] bottom-[4px] bg-white rounded-[10px] shadow-[var(--shadow-sm)] z-0"
                    initial={false}
                    animate={{ 
                      left: method === "sms" ? "4px" : "calc(50% + 2px)", 
                      width: "calc(50% - 6px)" 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>

                <div className="relative mb-[8px]">
                  {method === "sms" && (
                    <div className="absolute left-[12px] top-1/2 -translate-y-1/2 font-bold text-[15px] text-[var(--text-primary)] z-10">
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
                    style={inputError ? { borderColor: 'var(--danger)', backgroundColor: 'var(--danger-light)' } : undefined}
                    className={cn(
                      "w-full h-[52px] rounded-[14px] bg-[var(--surface-input)] text-[15px] text-[var(--text-primary)] border-[1.5px] border-transparent outline-none focus:bg-white focus:border-[var(--blue)]",
                      method === "sms" ? "pl-[44px] pr-[16px] font-mono tracking-wide" : "px-[16px]"
                    )}
                  />
                </div>
                {inputError && (
                  <p className="text-[12px] text-[var(--danger)] font-bold mb-[24px]">{inputError}</p>
                )}
                {!inputError && <div className="mb-[24px]" />}

                <motion.button 
                  onClick={handleSendCode}
                  whileTap={{ scale: 0.97 }}
                  className="w-full h-[52px] rounded-[14px] bg-[var(--navy)] text-white font-bold text-[15px] tracking-[-0.2px] shadow-[var(--shadow-sm)] mt-auto"
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
                className="flex flex-col w-full h-full"
              >
                <h1 className="text-[20px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
                  I-enter ang OTP
                </h1>
                <p className="text-[14px] text-[var(--text-muted)] text-center mb-[32px]">
                  Napadala na sa {method === "sms" ? "+63" : ""}{contact}
                </p>

                <OTPInput length={6} onComplete={handleOTPComplete} error={otpError} />

                <div className="h-[24px] mt-[16px] mb-[16px] flex justify-center items-center">
                  {otpError && (
                    <span className="text-[13px] font-bold text-[var(--danger)]" style={{ animation: 'shake 300ms ease-in-out' }}>
                      Mali ang code. Subukan ulit.
                    </span>
                  )}
                </div>

                <div className="mt-auto flex justify-center pb-[24px]">
                  {countdown > 0 ? (
                    <span className="text-[13px] font-bold text-[var(--text-muted)]">
                      I-resend in 0:{countdown.toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <button 
                      onClick={() => startCountdown()}
                      className="text-[13px] font-bold text-[var(--blue)] hover:text-[var(--text-primary)] transition-colors underline underline-offset-4"
                    >
                      I-resend ang code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
