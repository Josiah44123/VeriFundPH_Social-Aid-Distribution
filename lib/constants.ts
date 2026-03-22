export const VALID_OTP = '123456';
export const OFFICER_CREDENTIALS = [
  { email: 'officer@stacruz.gov.ph', password: 'verifund2025', name: 'Josefa Reyes', role: 'OFFICER', barangay: 'Sta. Cruz, Quezon City' },
  { email: 'admin@lgu-qc.gov.ph', password: 'admin2025', name: 'LGU Admin', role: 'ADMIN', barangay: 'Quezon City' },
] as const;
export const CITIZEN_ACCOUNT = {
  name: 'Maria Santos dela Cruz',
  phone: '09171234567',
  barangay: 'Sta. Cruz, Quezon City',
  verifundId: 'VF-2025-0001-STC',
  status: 'ACTIVE',
} as const;
export const DEFAULT_BARANGAY = 'Sta. Cruz, Quezon City';
export const DEFAULT_DISTRIBUTION_AMOUNT = 1500;
