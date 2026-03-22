"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { DEFAULT_BARANGAY, CITIZEN_ACCOUNT, OFFICER_CREDENTIALS } from "./constants"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Beneficiary {
  id: string
  lastName: string
  firstName: string
  middleName?: string
  phone: string
  gender?: "Lalaki" | "Babae" | "Iba pa"
  idType: string
  idNumber: string
  barangay: string
  status: "ACTIVE" | "PENDING" | "FLAGGED" | "INACTIVE"
  enrolledAt: string
  enrolledBy: string
  photoUrl?: string
  qrData: string
}

export interface Claim {
  id: string
  beneficiaryId: string
  beneficiaryName: string
  distributionId: string
  distributionTitle: string
  amount: number
  method: "Cash" | "GCash" | "Palawan" | null
  status: "NAKUHA" | "TINANGGIHAN"
  reason?: string
  verifiedBy: string
  verifiedAt: string
  barangay: string
}

export interface Distribution {
  id: string
  title: string
  barangay: string
  scheduledDate: string
  amount: number
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED"
  totalBeneficiaries: number
  totalClaimed: number
  disbursementMethod: "Cash" | "GCash" | "Palawan" | "Mixed"
  createdBy: string
  createdAt: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  action: "ENROLLED" | "CLAIMED" | "REJECTED" | "FLAGGED" | "DISTRIBUTION_CREATED" | "LOGIN"
  actorName: string
  actorRole: "OFFICER" | "ADMIN" | "SYSTEM"
  targetId: string
  targetName: string
  barangay: string
  details: string
}

export interface FraudFlag {
  id: string
  type: "DUPLICATE_ID" | "DUPLICATE_FACE" | "VELOCITY_ANOMALY"
  beneficiaryId?: string
  details: string
  flaggedAt: string
  resolved: boolean
}

interface VeriFundStore {
  beneficiaries: Beneficiary[]
  addBeneficiary: (b: Beneficiary) => void
  claims: Claim[]
  addClaim: (c: Claim) => void
  distributions: Distribution[]
  addDistribution: (d: Distribution) => void
  updateDistribution: (id: string, updates: Partial<Distribution>) => void
  auditLog: AuditEntry[]
  addAuditEntry: (e: AuditEntry) => void
  fraudFlags: FraudFlag[]
  addFraudFlag: (f: FraudFlag) => void
  resolveFraudFlag: (id: string) => void
  isHydrated: boolean
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_BENEFICIARIES: Beneficiary[] = [
  {
    id: CITIZEN_ACCOUNT.verifundId, lastName: CITIZEN_ACCOUNT.name.split(' ').slice(-2).join(' '), firstName: CITIZEN_ACCOUNT.name.split(' ').slice(0, -2).join(' '), middleName: "Santos",
    phone: CITIZEN_ACCOUNT.phone, gender: "Babae", idType: "PhilSys", idNumber: "1234-5678-9012-3456",
    barangay: CITIZEN_ACCOUNT.barangay, status: CITIZEN_ACCOUNT.status,
    enrolledAt: "2025-03-10T08:14:00Z", enrolledBy: OFFICER_CREDENTIALS[0].name, qrData: CITIZEN_ACCOUNT.verifundId
  },
  {
    id: "VF-2025-0099-STC", lastName: "Bautista", firstName: "Juan", middleName: "Reyes",
    phone: "09281234567", gender: "Lalaki", idType: "Voter's ID", idNumber: "QC-2020-00456",
    barangay: DEFAULT_BARANGAY, status: "ACTIVE",
    enrolledAt: "2025-03-10T09:22:00Z", enrolledBy: OFFICER_CREDENTIALS[0].name, qrData: "VF-2025-0099-STC"
  },
  {
    id: "VF-2025-0045-STC", lastName: "Mercado", firstName: "Ana", middleName: "Lim",
    phone: "09391234567", gender: "Babae", idType: "Driver's License", idNumber: "N01-98-765432",
    barangay: DEFAULT_BARANGAY, status: "ACTIVE",
    enrolledAt: "2025-03-10T09:35:00Z", enrolledBy: OFFICER_CREDENTIALS[0].name, qrData: "VF-2025-0045-STC"
  },
  {
    id: "VF-2025-0003-STC", lastName: "Cruz", firstName: "Pedro", middleName: "Garcia",
    phone: "09451234567", gender: "Lalaki", idType: "PhilSys", idNumber: "9876-5432-1098-7654",
    barangay: DEFAULT_BARANGAY, status: "FLAGGED",
    enrolledAt: "2025-03-10T09:41:00Z", enrolledBy: OFFICER_CREDENTIALS[0].name, qrData: "VF-2025-0003-STC"
  },
  {
    id: "VF-2025-0078-STC", lastName: "Santos", firstName: "Rosa", middleName: "Cruz",
    phone: "09561234567", gender: "Babae", idType: "PhilSys", idNumber: "4567-8901-2345-6789",
    barangay: DEFAULT_BARANGAY, status: "ACTIVE",
    enrolledAt: "2025-03-10T09:48:00Z", enrolledBy: OFFICER_CREDENTIALS[0].name, qrData: "VF-2025-0078-STC"
  },
]

const SEED_DISTRIBUTIONS: Distribution[] = [
  {
    id: "SAP-2025-Q1", title: "SAP 2025 — Una", barangay: DEFAULT_BARANGAY,
    scheduledDate: "2025-03-15", amount: 1500, status: "ACTIVE",
    totalBeneficiaries: 5, totalClaimed: 4, disbursementMethod: "Mixed",
    createdBy: OFFICER_CREDENTIALS[1].name, createdAt: "2025-03-01T08:00:00Z"
  },
]

const SEED_CLAIMS: Claim[] = [
  {
    id: "CLM-001", beneficiaryId: CITIZEN_ACCOUNT.verifundId, beneficiaryName: CITIZEN_ACCOUNT.name,
    distributionId: "SAP-2025-Q1", distributionTitle: "SAP 2025 — Una", amount: 1500,
    method: "Cash", status: "NAKUHA", verifiedBy: OFFICER_CREDENTIALS[0].name,
    verifiedAt: "2025-03-15T09:14:00Z", barangay: DEFAULT_BARANGAY
  },
  {
    id: "CLM-002", beneficiaryId: "VF-2025-0099-STC", beneficiaryName: "Juan Reyes Bautista",
    distributionId: "SAP-2025-Q1", distributionTitle: "SAP 2025 — Una", amount: 1500,
    method: "GCash", status: "NAKUHA", verifiedBy: OFFICER_CREDENTIALS[0].name,
    verifiedAt: "2025-03-15T09:22:00Z", barangay: DEFAULT_BARANGAY
  },
  {
    id: "CLM-003", beneficiaryId: "VF-2025-0003-STC", beneficiaryName: "Pedro Garcia Cruz",
    distributionId: "SAP-2025-Q1", distributionTitle: "SAP 2025 — Una", amount: 1500,
    method: null, status: "TINANGGIHAN", reason: "Duplicate claim attempt",
    verifiedBy: OFFICER_CREDENTIALS[0].name, verifiedAt: "2025-03-15T09:41:00Z",
    barangay: DEFAULT_BARANGAY
  },
]

const SEED_FRAUD_FLAGS: FraudFlag[] = [
  {
    id: "FRD-001", type: "VELOCITY_ANOMALY", beneficiaryId: "VF-2025-0003-STC",
    details: "Sinubukang mag-claim nang dalawang beses para sa SAP 2025 — Una",
    flaggedAt: "2025-03-15T09:41:00Z", resolved: false
  },
]

const SEED_AUDIT: AuditEntry[] = [
  {
    id: "AUD-001", timestamp: "2025-03-15T09:14:00Z", action: "CLAIMED",
    actorName: OFFICER_CREDENTIALS[0].name, actorRole: "OFFICER",
    targetId: CITIZEN_ACCOUNT.verifundId, targetName: CITIZEN_ACCOUNT.name,
    barangay: DEFAULT_BARANGAY, details: "Claim confirmed — SAP 2025 Q1 — ₱1,500 Cash"
  },
  {
    id: "AUD-002", timestamp: "2025-03-15T09:22:00Z", action: "CLAIMED",
    actorName: OFFICER_CREDENTIALS[0].name, actorRole: "OFFICER",
    targetId: "VF-2025-0099-STC", targetName: "Juan Reyes Bautista",
    barangay: DEFAULT_BARANGAY, details: "Claim confirmed — SAP 2025 Q1 — ₱1,500 GCash"
  },
  {
    id: "AUD-003", timestamp: "2025-03-15T09:41:00Z", action: "FLAGGED",
    actorName: "SYSTEM", actorRole: "SYSTEM",
    targetId: "VF-2025-0003-STC", targetName: "Pedro Garcia Cruz",
    barangay: DEFAULT_BARANGAY, details: "Velocity anomaly — duplicate claim attempt blocked"
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "verifund_store"

function loadFromStorage(): Partial<{
  beneficiaries: Beneficiary[]
  claims: Claim[]
  distributions: Distribution[]
  auditLog: AuditEntry[]
  fraudFlags: FraudFlag[]
}> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToStorage(data: {
  beneficiaries: Beneficiary[]
  claims: Claim[]
  distributions: Distribution[]
  auditLog: AuditEntry[]
  fraudFlags: FraudFlag[]
}) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

// ─── Context ──────────────────────────────────────────────────────────────────

const VeriFundContext = createContext<VeriFundStore | null>(null)

export function VeriFundProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(SEED_BENEFICIARIES)
  const [claims, setClaims] = useState<Claim[]>(SEED_CLAIMS)
  const [distributions, setDistributions] = useState<Distribution[]>(SEED_DISTRIBUTIONS)
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(SEED_AUDIT)
  const [fraudFlags, setFraudFlags] = useState<FraudFlag[]>(SEED_FRAUD_FLAGS)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage()
    if (saved.beneficiaries?.length) setBeneficiaries(saved.beneficiaries)
    if (saved.claims?.length) setClaims(saved.claims)
    if (saved.distributions?.length) setDistributions(saved.distributions)
    if (saved.auditLog?.length) setAuditLog(saved.auditLog)
    if (saved.fraudFlags?.length) setFraudFlags(saved.fraudFlags)
    setIsHydrated(true)
  }, [])

  // Persist whenever data changes
  useEffect(() => {
    if (!isHydrated) return
    saveToStorage({ beneficiaries, claims, distributions, auditLog, fraudFlags })
  }, [beneficiaries, claims, distributions, auditLog, fraudFlags, isHydrated])

  const addBeneficiary = (b: Beneficiary) => {
    setBeneficiaries(prev => [b, ...prev])
  }

  const addClaim = (c: Claim) => {
    setClaims(prev => [c, ...prev])
    // Update distribution totalClaimed
    setDistributions(prev => prev.map(d =>
      d.id === c.distributionId && c.status === "NAKUHA"
        ? { ...d, totalClaimed: d.totalClaimed + 1 }
        : d
    ))
  }

  const addDistribution = (d: Distribution) => {
    setDistributions(prev => [d, ...prev])
  }

  const updateDistribution = (id: string, updates: Partial<Distribution>) => {
    setDistributions(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
  }

  const addAuditEntry = (e: AuditEntry) => {
    setAuditLog(prev => [e, ...prev])
  }

  const addFraudFlag = (f: FraudFlag) => {
    setFraudFlags(prev => [f, ...prev])
    // Also mark beneficiary as FLAGGED
    if (f.beneficiaryId) {
      setBeneficiaries(prev => prev.map(b =>
        b.id === f.beneficiaryId ? { ...b, status: "FLAGGED" } : b
      ))
    }
  }

  const resolveFraudFlag = (id: string) => {
    setFraudFlags(prev => prev.map(f => f.id === id ? { ...f, resolved: true } : f))
  }

  return (
    <VeriFundContext.Provider value={{
      beneficiaries, addBeneficiary,
      claims, addClaim,
      distributions, addDistribution, updateDistribution,
      auditLog, addAuditEntry,
      fraudFlags, addFraudFlag, resolveFraudFlag,
      isHydrated,
    }}>
      {children}
    </VeriFundContext.Provider>
  )
}

export function useVeriFundStore() {
  const ctx = useContext(VeriFundContext)
  if (!ctx) throw new Error("useVeriFundStore must be used inside VeriFundProvider")
  return ctx
}
