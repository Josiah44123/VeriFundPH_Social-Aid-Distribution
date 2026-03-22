import { Beneficiary } from '../types';

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'SAP-2024-001',
    name: 'Maria Clara Santos',
    status: 'Ready',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    details: {
      philSysId: '1111-2222-3333-4444',
      address: 'B1 L2, Brgy. San Antonio, Pasig City',
      dob: '1990-09-23'
    }
  },
  {
    id: 'SAP-2024-082',
    name: 'Lolo Efren Reyes',
    status: 'Ready',
    photoUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    details: {
      philSysId: '9988-7766-5544-3322',
      address: 'Unit 4, Brgy. Commonwealth, QC',
      dob: '1955-02-14'
    }
  },
  {
    id: 'SAP-2024-105',
    name: 'Crisostomo Ibarra',
    status: 'Flagged',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', // Identical to simulate deepfake/spoof
    details: {
      philSysId: '0000-0000-FAKE-ID00',
      address: 'Unknown Zone, Manila',
      dob: '1988-11-30'
    },
    isFraud: true
  },
  {
    id: 'SAP-2024-210',
    name: 'Gabriela Silang',
    status: 'Ready',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    details: {
      philSysId: '4567-8901-2345-6789',
      address: 'Purok 3, Vigan City, Ilocos',
      dob: '1975-03-19'
    }
  },
  {
    id: 'SAP-2024-303',
    name: 'Andres Bonifacio',
    status: 'Ready',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    details: {
      philSysId: '1234-5678-9012-3456',
      address: 'Tondo, Manila',
      dob: '1995-11-30'
    }
  },
  {
    id: 'SAP-2024-404',
    name: 'Teresa Magbanua',
    status: 'Ready',
    photoUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    details: {
      philSysId: '5678-9012-3456-7890',
      address: 'Pototan, Iloilo',
      dob: '1982-10-13'
    }
  },
   {
    id: 'SAP-2024-555',
    name: 'Suspicious Profile #2',
    status: 'Flagged',
    photoUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    liveFeedUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', // Different person
    details: {
      philSysId: '9999-9999-8888-8888',
      address: 'Area 51, Nevada St.',
      dob: '1999-01-01'
    },
    isFraud: true
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    hash: '0x3a1...9b2',
    timestamp: '08:45:12',
    beneficiaryId: 'SAP-2024-000',
    beneficiaryName: 'Pedro Penduko',
    amount: 5000
  },
  {
    hash: '0x8f2...a1b',
    timestamp: '08:52:30',
    beneficiaryId: 'SAP-2023-999',
    beneficiaryName: 'Jose Rizal',
    amount: 5000
  },
  {
    hash: '0xc4d...e5f',
    timestamp: '09:05:45',
    beneficiaryId: 'SAP-2023-998',
    beneficiaryName: 'Apolinario Mabini',
    amount: 5000
  }
];

export const generateHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
  hash += '...';
  for (let i = 0; i < 3; i++) hash += chars[Math.floor(Math.random() * 16)];
  return hash;
};