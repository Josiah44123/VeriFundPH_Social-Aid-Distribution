"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { OTPInput } from "@/components/OTPInput"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export default function CitizenLogin() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [contact, setContact] = useState("")
  const [method, setMethod] = useState<"sms" | "email">("sms")
  const [loading, setLoading] = useState(false)
  const [otpError, setOtpError] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = () => {
    if (!contact) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(2)
      startCountdown()
    }, 800)
  }

  const startCountdown = () => {
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
  }

  const handleOTPComplete = (code: string) => {
    if (code === "123456") {
      setLoading(true)
      setTimeout(() => {
        router.push("/citizen/dashboard")
      }, 800)
    } else {
      setOtpError(true)
      setTimeout(() => setOtpError(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--surface-page)] flex flex-col">
      <LoadingOverlay isVisible={loading} />
      
      {/* Header */}
      <div 
        className="h-[120px] flex items-start pt-[24px] px-[16px] shrink-0 relative z-0"
        style={{ background: 'linear-gradient(135deg, #0038A8, #185ADB)' }}
      >
        <button onClick={() => step === 2 ? setStep(1) : router.push("/")} className="p-2 -ml-2 text-white relative z-20">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-bold text-[18px] absolute w-full text-center left-0 top-[32px] pointer-events-none z-10">
          VeriFund
        </span>
      </div>

      {/* Content Area overlapped */}
      <div className="flex-1 bg-white rounded-t-[24px] -mt-[20px] relative z-10 px-[16px] flex flex-col items-center pt-[32px] shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        {/* Absolute Avatar */}
        <div className="absolute -top-[32px] w-[64px] h-[64px] rounded-full bg-[var(--ph-blue)] border-[4px] border-white flex items-center justify-center shadow-sm">
          <User className="w-[32px] h-[32px] text-white" />
        </div>

        <div className="w-full max-w-md mt-[16px]">
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
                <h1 className="text-[18px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
                  I-enter ang iyong numero o email
                </h1>
                <p className="text-[13px] text-[var(--text-muted)] text-center mb-[32px]">
                  Magpapadala kami ng verification code.
                </p>

                {/* Segmented Control */}
                <div className="bg-[#F0F3FA] p-[4px] rounded-full flex relative mb-[24px]">
                  <button 
                    onClick={() => setMethod("sms")}
                    className={cn(
                      "flex-1 py-[10px] rounded-full text-[14px] font-bold z-10 transition-colors",
                      method === "sms" ? "text-[var(--ph-blue)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    SMS
                  </button>
                  <button 
                    onClick={() => setMethod("email")}
                    className={cn(
                      "flex-1 py-[10px] rounded-full text-[14px] font-bold z-10 transition-colors",
                      method === "email" ? "text-[var(--ph-blue)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    Email
                  </button>
                  {/* Active Indicator */}
                  <motion.div 
                    className="absolute top-[4px] bottom-[4px] bg-white rounded-full shadow-sm z-0"
                    initial={false}
                    animate={{ 
                      left: method === "sms" ? "4px" : "50%", 
                      width: "calc(50% - 4px)" 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                </div>

                <input 
                  value={contact}
                  onChange={(e: any) => setContact(e.target.value)}
                  placeholder={method === "sms" ? "09XXXXXXXXX" : "juan@email.com"}
                  className="w-full h-[56px] text-center rounded-[14px] mb-[24px] text-[15px] outline-none bg-[#F0F3FA] border-[2px] border-transparent focus:bg-white focus:border-[#0038A8] text-[#0D1B3E] transition-colors"
                />

                <button 
                  onClick={handleSendCode}
                  className="w-full h-[52px] rounded-[14px] bg-[var(--ph-blue)] text-white font-bold text-[15px] transition-transform active:scale-[0.98]"
                >
                  Mag-send ng Code
                </button>
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
                <h1 className="text-[18px] font-bold text-center mb-[4px] text-[var(--text-primary)]">
                  I-enter ang OTP
                </h1>
                <p className="text-[14px] text-[var(--text-muted)] text-center mb-[32px]">
                  Napadala na sa {contact}
                </p>

                <OTPInput length={6} onComplete={handleOTPComplete} error={otpError} />

                <div className="h-[24px] mt-[16px] flex justify-center items-center">
                  {otpError && (
                    <span className="text-[13px] font-bold text-[var(--danger)] animate-in fade-in">
                      Mali ang code. Subukan ulit.
                    </span>
                  )}
                </div>

                <div className="mt-[32px] flex justify-center">
                  {countdown > 0 ? (
                    <span className="px-[16px] py-[6px] rounded-full bg-[var(--surface-page)] text-[12px] font-bold text-[var(--text-muted)]">
                      Resend in 0:{countdown.toString().padStart(2, '0')}
                    </span>
                  ) : (
                    <button 
                      onClick={() => {
                        startCountdown()
                      }}
                      className="text-[13px] font-bold text-[var(--ph-blue)] px-[16px] py-[6px] rounded-full bg-[var(--info-light)] hover:bg-[var(--surface-page)] transition-colors"
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
