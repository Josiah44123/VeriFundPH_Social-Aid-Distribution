"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  error?: boolean
}

export function OTPInput({ length = 6, onComplete, error }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (error) {
      setOtp(Array(length).fill(""))
      inputRefs.current[0]?.focus()
    }
  }, [error, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    const combinedOtp = newOtp.join("")
    if (combinedOtp.length === length) {
      onComplete(combinedOtp)
    }

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <div className={cn("flex justify-center gap-2", error && "animate-[shake_300ms_ease-in-out]")}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          ref={(ref) => {
            inputRefs.current[index] = ref
          }}
          value={data}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-[48px] h-[56px] text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 transition-all",
            error ? "border-[var(--ph-red)] text-[var(--ph-red)]" : "border-gray-300 focus:border-[#FCD116] focus:ring-[#FCD116]"
          )}
          maxLength={1}
        />
      ))}
    </div>
  )
}
