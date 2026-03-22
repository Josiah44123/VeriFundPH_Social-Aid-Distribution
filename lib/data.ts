export const CITIZEN = {
  name: "Maria Santos dela Cruz",
  phone: "09171234567",
  barangay: "Sta. Cruz, Quezon City",
  verifundId: "VF-2025-0001-STC",
  status: "ACTIVE",
  photoInitials: "MS"
};

export const DISTRIBUTIONS = [
  {
    id: "SAP-2025-Q1",
    title: "SAP 2025 — Una",
    amount: 1500,
    date: "Marso 15, 2025",
    status: "NAKUHA", // green
    method: "Cash on site"
  },
  {
    id: "SAP-2024-Q4",
    title: "SAP 2024 — Ikaapat",
    amount: 1500,
    date: "Disyembre 10, 2024",
    status: "NAKUHA",
    method: "GCash"
  },
  {
    id: "SAP-2025-Q2",
    title: "SAP 2025 — Ikalawa",
    amount: 1500,
    date: "Hunyo 20, 2025",
    status: "DARATING", // amber
    method: null
  }
];

export const OFFICER = {
  email: "officer@stacruz.gov.ph",
  password: "verifund2025",
  name: "Josefa Reyes",
  role: "Barangay Officer",
  barangay: "Sta. Cruz, Quezon City",
  initials: "JR"
};

export const QR_RESPONSES: Record<string, any> = {
  "VF-2025-0001-STC": {
    result: "VERIFIED",
    name: "Maria Santos dela Cruz",
    barangay: "Sta. Cruz, Quezon City",
    initials: "MS",
    alreadyClaimed: false
  },
  "VF-2025-0001-STC-CLAIMED": {
    result: "REJECTED",
    reason: "Nakakuha na sa distribution na ito."
  },
  "VF-2025-0099-STC": {
    result: "VERIFIED",
    name: "Juan Reyes Bautista",
    barangay: "Sta. Cruz, Quezon City",
    initials: "JR",
    alreadyClaimed: false
  }
};

export const INITIAL_LISTAHAN = [
  { name: "Maria Santos dela Cruz", initials: "MS", time: "9:14 AM",
    method: "Cash", status: "NAKUHA", verifundId: "VF-2025-0001-STC" },
  { name: "Juan Reyes Bautista", initials: "JR", time: "9:22 AM",
    method: "GCash", status: "NAKUHA", verifundId: "VF-2025-0099-STC" },
  { name: "Ana Lim Mercado", initials: "AL", time: "9:35 AM",
    method: "Palawan", status: "NAKUHA", verifundId: "VF-2025-0045-STC" },
  { name: "Pedro Garcia Cruz", initials: "PG", time: "9:41 AM",
    method: null, status: "TINANGGIHAN", reason: "Duplicate claim attempt",
    verifundId: "VF-2025-0003-STC" },
  { name: "Rosa Cruz Santos", initials: "RC", time: "9:48 AM",
    method: "Cash", status: "NAKUHA", verifundId: "VF-2025-0078-STC" },
  { name: "Jose Mendoza", initials: "JM", time: "10:02 AM",
    method: "GCash", status: "NAKUHA", verifundId: "VF-2025-0112-STC" }
];
