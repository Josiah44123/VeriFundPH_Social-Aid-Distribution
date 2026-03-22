"use client"

import React, { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  error?: boolean
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.05 } }
}
const boxVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
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
    <motion.div 
      className={cn("flex justify-center gap-[8px]", error && "animate-[shake_300ms_ease-in-out]")}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {otp.map((data, index) => (
        <motion.div key={index} variants={boxVariants}>
          <input
            type="text"
            inputMode="numeric"
            ref={(ref) => {
              inputRefs.current[index] = ref
            }}
            value={data}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "w-[48px] h-[56px] text-center text-[22px] font-bold rounded-[12px] border-[2px] transition-all outline-none",
              error ? "border-[var(--danger)] bg-[var(--danger-light)] text-[var(--danger)]" 
                : data ? "bg-white border-[var(--ph-blue)] text-[var(--ph-blue)] shadow-[0_2px_8px_rgba(0,56,168,0.15)]"
                : "bg-[var(--surface-page)] border-transparent text-[var(--text-primary)] focus:border-[var(--ph-blue)] focus:bg-white"
            )}
            maxLength={1}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
