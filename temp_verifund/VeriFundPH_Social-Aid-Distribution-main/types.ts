export interface Beneficiary {
  id: string;
  name: string;
  status: 'Ready' | 'Flagged' | 'Processed' | 'Rejected';
  photoUrl: string; // URL for the ID photo
  liveFeedUrl: string; // URL for the simulated webcam feed
  details: {
    philSysId: string;
    address: string;
    dob: string;
  };
  isFraud?: boolean; // Hidden flag for simulation logic
}

export interface Transaction {
  hash: string;
  timestamp: string;
  beneficiaryId: string;
  beneficiaryName: string;
  amount: number;
}

export enum ScanStep {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  COMPLETE = 'COMPLETE',
  FRAUD_DETECTED = 'FRAUD_DETECTED',
}

export interface VerificationCheck {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'failure';
  value?: string;
}

export interface LocationContextType {
  region: string;
  province: string;
  city: string;
}