import { NextRequest, NextResponse } from "next/server"

// Shared OTP store via globalThis (must match verify route)
interface OTPRecord {
  code: string
  expiresAt: number
  attempts: number
  sends: number
  firstSendAt: number
}

const globalStore = globalThis as unknown as { __otpStore?: Map<string, OTPRecord> }
if (!globalStore.__otpStore) {
  globalStore.__otpStore = new Map()
}
const otpStore = globalStore.__otpStore

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, method } = body as { contact: string; method: "sms" | "email" }

    if (!contact || !method) {
      return NextResponse.json(
        { error: "Kailangan ang contact at method." },
        { status: 400 }
      )
    }

    // Validate contact format
    if (method === "sms") {
      const digits = contact.replace(/\D/g, "")
      const normalized = digits.startsWith("63")
        ? "0" + digits.slice(2)
        : digits.startsWith("9") && digits.length === 10
          ? "0" + digits
          : digits
      if (normalized.length !== 11 || !normalized.startsWith("09")) {
        return NextResponse.json(
          { error: "Dapat 11 digits at nagsisimula sa 09 (hal. 09171234567)" },
          { status: 400 }
        )
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
      if (!emailRegex.test(contact)) {
        return NextResponse.json(
          { error: "Di-wastong email address" },
          { status: 400 }
        )
      }
    }

    const now = Date.now()
    const existing = otpStore.get(contact)

    // Rate limit disabled for prototype QA
    if (existing && now - existing.firstSendAt >= 10 * 60 * 1000) {
      otpStore.delete(contact)
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const prev = otpStore.get(contact)
    otpStore.set(contact, {
      code,
      expiresAt: now + 5 * 60 * 1000,
      attempts: 3,
      sends: prev ? prev.sends + 1 : 1,
      firstSendAt: prev?.firstSendAt ?? now,
    })

    console.log("[OTP]", contact, code)

    return NextResponse.json({ success: true, devCode: code })
  } catch {
    return NextResponse.json(
      { error: "May error sa server." },
      { status: 500 }
    )
  }
}
