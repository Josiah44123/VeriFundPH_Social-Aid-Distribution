import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import VerificationModal from './components/VerificationModal';
import LandingPage from './components/LandingPage';
import LocationSelector from './components/LocationSelector';
import CitizenPortal from './components/CitizenPortal';
import { INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, generateHash } from './utils/mockData';
import { Beneficiary, Transaction, LocationContextType } from './types';

function App() {
  const [viewState, setViewState] = useState<'landing' | 'location' | 'dashboard' | 'citizen'>('landing');
  const [location, setLocation] = useState<LocationContextType>({
    region: 'National Capital Region',
    province: 'Metro Manila',
    city: 'Quezon City'
  });
  
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [funds, setFunds] = useState<number>(2500000); // 2.5M Initial funds
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);

  const handleVerifyClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleCloseModal = () => {
    setSelectedBeneficiary(null);
  };

  const handleConfirmDisbursement = async (beneficiary: Beneficiary) => {
    // Artificial delay for "Minting" visualization
    await new Promise(resolve => setTimeout(resolve, 2000));

    const amount = 5000;
    const newTransaction: Transaction = {
      hash: generateHash(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      amount: amount
    };

    // Update State
    setTransactions(prev => [newTransaction, ...prev]);
    setFunds(prev => prev - amount);
    setBeneficiaries(prev => prev.map(b => 
      b.id === beneficiary.id ? { ...b, status: 'Processed' } : b
    ));
    
    handleCloseModal();
  };

  const handleReject = (beneficiary: Beneficiary) => {
    setBeneficiaries(prev => prev.map(b => 
      b.id === beneficiary.id ? { ...b, status: 'Rejected' } : b
    ));
    handleCloseModal();
  };

  if (viewState === 'landing') {
    return <LandingPage onEnter={() => setViewState('location')} onEnterCitizen={() => setViewState('citizen')} />;
  }

  if (viewState === 'citizen') {
    return <CitizenPortal onBack={() => setViewState('landing')} />;
  }

  if (viewState === 'location') {
    return (
      <LocationSelector 
        onComplete={(loc) => {
            setLocation(loc);
            setViewState('dashboard');
        }} 
        onBack={() => setViewState('landing')}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gov-900 overflow-hidden font-sans">
      {/* Main Dashboard Area */}
      <Dashboard 
        beneficiaries={beneficiaries} 
        onVerify={handleVerifyClick}
        funds={funds}
        location={location}
      />

      {/* Sidebar Ledger */}
      <Sidebar transactions={transactions} />

      {/* Modals */}
      {selectedBeneficiary && (
        <VerificationModal 
          beneficiary={selectedBeneficiary}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDisbursement}
          onReject={handleReject}
        />
      )}
    </div>
  );
}

export default App;