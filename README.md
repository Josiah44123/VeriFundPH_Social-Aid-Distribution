# VeriFund PH

> **Siguruhing makakarating ang tulong sa tamang tao.**
> *Ensuring aid reaches the right people.*

VeriFund PH is an official government social aid distribution platform designed for Local Government Units (LGUs) in the Philippines. It digitizes, secures, and accelerates the distribution of social amelioration (ayuda) by eliminating ghost beneficiaries, duplicate claims, and paper-based inefficiencies — ensuring every peso reaches a verified, living citizen.

Built for the **InterCICSkwela Hackathon 2026 — Challenge #3: Governance**.

---

## The Problem

Every time the Philippine government distributes social aid (ayuda), the same three problems repeat:

- **Ghost beneficiaries** — deceased or non-existent recipients still on the list
- **Duplicate claims** — the same person collecting aid multiple times at different sites
- **Paper-based chaos** — manual verification leads to long lines, human error, and zero accountability

VeriFund PH solves all three at the last mile: getting the right money to the right verified living person, efficiently and without leakage.

---

## How It Works

### For Citizens (Benepisyaryo)
1. Register at their barangay hall — officer scans their government ID and captures a photo
2. Receive a unique **VeriFund QR Card** — printable or via SMS
3. On distribution day, show the QR card and collect their aid instantly
4. Log in to the Citizen Portal to view their QR code and distribution history

### For Barangay Officers (Field Console)
1. **Register** new beneficiaries — OCR auto-reads government IDs and fills form fields
2. **Verify** recipients during distribution — scan QR code for instant VERIFIED/REJECTED result
3. **Monitor** today's claims via the running Listahan log

### For LGU Administrators (Management System)
1. **Dashboard** — real-time metrics across all barangays
2. **Beneficiary Management** — full database with search, filter, and export
3. **Distribution Scheduling** — create and manage ayuda distribution events
4. **Audit Log** — immutable, append-only record of every action in the system

---

## Key Features

| Feature | Description |
|---|---|
| **QR-Based Identity** | Every verified recipient gets a unique QR code — no app download required |
| **OCR ID Scanning** | Government IDs are read automatically using AI vision — no manual typing |
| **Face Verification** | Duplicate face detection prevents ghost enrollments |
| **Anti-Fraud Engine** | Duplicate ID check, velocity anomaly detection, and face matching run on every submission |
| **Immutable Audit Log** | Every action is permanently logged — nothing can be deleted or edited |
| **Real-Time Sync** | Field Console and Management System share live data — registrations appear instantly in the dashboard |
| **OTP Login** | Citizens log in via a one-time code sent to their phone or email — no password needed |
| **CSV Export** | Administrators can export beneficiary lists and audit logs at any time |
| **PWA Ready** | Works on any mobile browser — no app store installation required |

---

## Portals

VeriFund PH has three separate user interfaces:

### 🔵 Citizen Portal
For aid recipients to view their QR code and distribution history.

### 🔴 Field Console
For barangay officers to register and verify beneficiaries. Mobile-first, designed for one-handed use in the field.

### 🏛️ Management System
For barangay officers to monitor all barangay activity, manage distributions, and review the audit trail. Desktop layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + custom design system |
| **Animations** | Framer Motion |
| **QR Code** | `qrcode.react` |
| **QR Scanner** | `html5-qrcode` |
| **State / Storage** | React Context + localStorage |
| **Charts** | Recharts |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Josiah44123/VeriFundPH_Social-Aid-Distribution.git
cd VeriFundPH_Social-Aid-Distribution

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run start
```

---

## Demo Credentials

Use these credentials to explore all three portals:

### 🔵 Citizen Portal
| Field | Value |
|---|---|
| Phone / Email | `09171234567` or any email |
| OTP Code | `123456` |

### 🔴 Barangay Officer (Field Console + Management System)
| Field | Value |
|---|---|
| Email | `officer@stacruZ.gov.ph` |
| Password | `verifund2025` |

### 🏛️ LGU Administrator (Management System only)
| Field | Value |
|---|---|
| Email | `admin@lgu-qc.gov.ph` |
| Password | `admin2025` |

---

## Application Routes

```
/                          → Landing page — portal selector
/citizen/login             → Citizen OTP login
/citizen/dashboard         → Citizen dashboard + QR code

/admin/login               → Officer / Admin login
/admin/portal              → Portal selector (Field Console or Management System)
/admin/console             → Field Console — I-Register, I-Verify, Listahan

/management/dashboard      → LGU Admin dashboard
/management/beneficiaries  → Full beneficiary database
/management/distributions  → Distribution event management
/management/audit-log      → Immutable audit trail
```

---

## Project Structure

```
app/
├── page.tsx                      # Landing page
├── citizen/
│   ├── login/page.tsx            # Citizen OTP login
│   └── dashboard/page.tsx        # Citizen dashboard
├── admin/
│   ├── login/page.tsx            # Officer login
│   ├── portal/page.tsx           # Portal selector
│   └── console/page.tsx          # Field Console
└── management/
    ├── dashboard/page.tsx         # Admin dashboard
    ├── beneficiaries/page.tsx     # Beneficiary table
    ├── distributions/page.tsx     # Distribution management
    └── audit-log/page.tsx         # Audit log

components/
├── ui/                           # shadcn/ui base components
├── QRScanner.tsx                 # html5-qrcode wrapper
├── QRCode.tsx                    # qrcode.react wrapper
├── OTPInput.tsx                  # 6-box OTP input
├── TabBar.tsx                    # Field Console bottom nav
└── Toast.tsx                     # Toast notification system

lib/
├── store.ts                      # Shared data store (Context + localStorage)
├── constants.ts                  # Hardcoded credentials and seed data
└── utils.ts                      # Phone formatter, ID generator
```

---

## Design System

VeriFund PH uses a custom design system inspired by modern Filipino consumer apps (GCash, Maya, Grab).

| Color | Hex | Usage |
|---|---|---|
| Red | `#FF0048` | Field Console identity, CTAs, danger states |
| Navy | `#18269B` | Citizen Portal identity, Management System sidebar |
| Deep Navy | `#0D1966` | Dark backgrounds, gradients |
| Gold | `#FFB800` | Management System accent, success states, amounts |
| Success Green | `#00C853` | Verified states, active badges |
| Gray | `#F5F5F7` | Page backgrounds |

**Typography:** SF Pro Text (`-apple-system, 'SF Pro Text', 'Helvetica Neue', system-ui, sans-serif`)

---

## Security Architecture

VeriFund PH implements a multi-layer anti-fraud system:

1. **Duplicate ID Check** — government ID number matched against all existing records on enrollment
2. **Duplicate Face Detection** — face image compared against enrolled beneficiaries (simulated in prototype)
3. **Velocity Anomaly Detection** — blocks recipients from claiming the same distribution twice
4. **Immutable Audit Log** — append-only database table; no record can be updated or deleted
5. **Geofencing** — officers must be near the branch to submit (bypassed in prototype mode)

---

## Live Demo

🌐 **[https://verifundph.vercel.app](https://verifundph.vercel.app)**

---

## Team

**De La Salle Lipa — Null Set**

Built with ❤️ for Filipino communities.

---

## License

This project was built for academic and hackathon purposes.
