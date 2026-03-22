"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { OTPInput } from "@/components/OTPInput"
import { LoadingOverlay } from "@/components/LoadingOverlay"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-white flex flex-col">
      <LoadingOverlay isVisible={loading} />
      
      {/* Header */}
      <div className="bg-[var(--ph-blue)] h-[64px] flex items-center px-4 shrink-0">
        <button onClick={() => step === 2 ? setStep(1) : router.push("/")} className="p-2 -ml-2 text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="text-white font-bold ml-2 text-[18px]">Mag-login</span>
      </div>

      <div className="flex-1 px-4 pt-8 pb-8 flex flex-col max-w-md mx-auto w-full">
        <div className="flex justify-center mb-6">
          <div className="w-[40px] h-[40px] bg-[var(--ph-blue)] rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>

        {step === 1 ? (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-[16px] font-bold text-center mb-1 text-[var(--text-primary)]">
              I-enter ang iyong numero o email
            </h1>
            <p className="text-[13px] text-[var(--text-muted)] text-center mb-6">
              Magpapadala kami ng verification code.
            </p>

            <Input 
              value={contact}
              onChange={(e: any) => setContact(e.target.value)}
              placeholder="09XXXXXXXXX o email@gmail.com"
              className="mb-4 text-center font-medium"
            />

            <div className="flex gap-2 mb-8">
              <button 
                onClick={() => setMethod("sms")}
                className={cn("flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors border", 
                  method === "sms" ? "bg-[var(--surface)] border-[var(--ph-blue)] text-[var(--ph-blue)]" : "border-transparent text-[var(--text-muted)]"
                )}
              >
                SMS
              </button>
              <button 
                onClick={() => setMethod("email")}
                className={cn("flex-1 py-2 rounded-full text-[13px] font-semibold transition-colors border", 
                  method === "email" ? "bg-[var(--surface)] border-[var(--ph-blue)] text-[var(--ph-blue)]" : "border-transparent text-[var(--text-muted)]"
                )}
              >
                Email
              </button>
            </div>

            <button 
              onClick={handleSendCode}
              disabled={!contact}
              className="primary-btn w-full bg-[var(--ph-blue)] text-[var(--ph-gold)]"
            >
              Mag-send ng Code
            </button>
          </div>
        ) : (
          <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
            <h1 className="text-[16px] font-bold text-center mb-1 text-[var(--text-primary)]">
              I-enter ang OTP
            </h1>
            <p className="text-[13px] text-[var(--text-muted)] text-center mb-8">
              Napadala na ang code sa {contact}
            </p>

            <OTPInput length={6} onComplete={handleOTPComplete} error={otpError} />

            <div className="h-6 mt-4 flex justify-center items-center">
              {otpError && (
                <span className="text-[13px] font-semibold text-[color:var(--ph-red)] animate-in fade-in">
                  Mali ang code. Subukan ulit.
                </span>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              {countdown > 0 ? (
                <span className="text-[13px] text-[var(--text-muted)] font-medium">
                  Maghintay ng {countdown}s para maka-resend
                </span>
              ) : (
                <button 
                  onClick={() => {
                    startCountdown()
                  }}
                  className="text-[13px] font-semibold text-[var(--ph-blue)]"
                >
                  Wala pang natanggap? I-resend
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
