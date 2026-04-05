import { NextRequest, NextResponse } from "next/server"

// Shared OTP store — must match the send route's store
// In a real app, use Redis or a database. For prototype, we use a module-level Map.
// NOTE: Next.js may use separate module instances for different routes in dev,
// so we export a shared reference via a global.

interface OTPRecord {
  code: string
  expiresAt: number
  attempts: number
  sends: number
  firstSendAt: number
}

// Use globalThis to share between route modules in dev
const globalStore = globalThis as unknown as { __otpStore?: Map<string, OTPRecord> }
if (!globalStore.__otpStore) {
  globalStore.__otpStore = new Map()
}
const otpStore = globalStore.__otpStore

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { contact, code } = body as { contact: string; code: string }

    if (!contact || !code) {
      return NextResponse.json(
        { error: "Kailangan ang contact at code." },
        { status: 400 }
      )
    }

    const record = otpStore.get(contact)

    if (!record) {
      return NextResponse.json(
        { error: "Nag-expire na ang code. Mag-resend." },
        { status: 401 }
      )
    }

    // Check expiry
    if (Date.now() > record.expiresAt) {
      otpStore.delete(contact)
      return NextResponse.json(
        { error: "Nag-expire na ang code. Mag-resend." },
        { status: 401 }
      )
    }

    // Check code match
    if (record.code !== code) {
      record.attempts -= 1
      if (record.attempts <= 0) {
        otpStore.delete(contact)
        return NextResponse.json(
          { error: "Nag-expire na ang code. Mag-resend.", attemptsLeft: 0 },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: "Mali ang code. Subukan ulit.", attemptsLeft: record.attempts },
        { status: 401 }
      )
    }

    // Success — delete stored code
    otpStore.delete(contact)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "May error sa server." },
      { status: 500 }
    )
  }
}
