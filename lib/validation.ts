// ─── Phone & Email Validation (Section 1) ─────────────────────────────────────

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Philippine mobile number validation:
 * - Must start with 09
 * - Exactly 11 digits
 * - Only digits allowed
 */
export function validatePhone(raw: string): ValidationResult {
  const digits = raw.replace(/\D/g, "")
  if (digits.length !== 11 || !digits.startsWith("09")) {
    return {
      valid: false,
      error: "Dapat 11 digits at nagsisimula sa 09 (hal. 09171234567)",
    }
  }
  return { valid: true }
}

/**
 * Email validation (RFC-5321-lite):
 * - Exactly one @, domain with at least one dot, TLD >= 2 chars, no spaces
 */
export function validateEmail(email: string): ValidationResult {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  if (!regex.test(email)) {
    return {
      valid: false,
      error: "Di-wastong email address",
    }
  }
  return { valid: true }
}
