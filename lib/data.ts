import { CITIZEN_ACCOUNT, OFFICER_CREDENTIALS, DEFAULT_BARANGAY, DEFAULT_DISTRIBUTION_AMOUNT } from "./constants";

export const CITIZEN = {
  name: CITIZEN_ACCOUNT.name,
  phone: CITIZEN_ACCOUNT.phone,
  barangay: CITIZEN_ACCOUNT.barangay,
  verifundId: CITIZEN_ACCOUNT.verifundId,
  status: CITIZEN_ACCOUNT.status,
  photoInitials: "MS"
};

export const DISTRIBUTIONS = [
  {
    id: "SAP-2025-Q1",
    title: "SAP 2025 — Una",
    amount: DEFAULT_DISTRIBUTION_AMOUNT,
    date: "Marso 15, 2025",
    status: "NAKUHA", // green
    method: "Cash on site"
  },
  {
    id: "SAP-2024-Q4",
    title: "SAP 2024 — Ikaapat",
    amount: DEFAULT_DISTRIBUTION_AMOUNT,
    date: "Disyembre 10, 2024",
    status: "NAKUHA",
    method: "GCash"
  },
  {
    id: "SAP-2025-Q2",
    title: "SAP 2025 — Ikalawa",
    amount: DEFAULT_DISTRIBUTION_AMOUNT,
    date: "Hunyo 20, 2025",
    status: "DARATING", // amber
    method: null
  }
];

export const OFFICER = {
  email: OFFICER_CREDENTIALS[0].email,
  password: OFFICER_CREDENTIALS[0].password,
  name: OFFICER_CREDENTIALS[0].name,
  role: "Barangay Officer",
  barangay: OFFICER_CREDENTIALS[0].barangay,
  initials: "JR"
};

export const QR_RESPONSES: Record<string, any> = {
  [CITIZEN_ACCOUNT.verifundId]: {
    result: "VERIFIED",
    name: CITIZEN_ACCOUNT.name,
    barangay: CITIZEN_ACCOUNT.barangay,
    initials: "MS",
    alreadyClaimed: false
  },
  [`${CITIZEN_ACCOUNT.verifundId}-CLAIMED`]: {
    result: "REJECTED",
    reason: "Nakakuha na sa distribution na ito."
  },
  "VF-2025-0099-STC": {
    result: "VERIFIED",
    name: "Juan Reyes Bautista",
    barangay: DEFAULT_BARANGAY,
    initials: "JR",
    alreadyClaimed: false
  }
};

export const INITIAL_LISTAHAN = [
  { name: CITIZEN_ACCOUNT.name, initials: "MS", time: "9:14 AM",
    method: "Cash", status: "NAKUHA", verifundId: CITIZEN_ACCOUNT.verifundId },
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
