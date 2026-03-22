import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import VerificationModal from "./components/VerificationModal";
import LandingPage from "./components/LandingPage";
import LocationSelector from "./components/LocationSelector";
import CitizenPortal from "./components/CitizenPortal";
import {
  initializeStorage,
  getBeneficiaries,
  getTransactions,
  saveBeneficiaries,
  saveTransactions,
  generateHash,
} from "./utils/mockData";
import { Beneficiary, Transaction, LocationContextType } from "./types";

function App() {
  const [viewState, setViewState] = useState<
    "landing" | "location" | "dashboard" | "citizen"
  >("landing");
  const [location, setLocation] = useState<LocationContextType>({
    region: "National Capital Region",
    province: "Metro Manila",
    city: "Quezon City",
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    initializeStorage();

    setBeneficiaries(getBeneficiaries());
    setTransactions(getTransactions());
  }, []);
  const [funds, setFunds] = useState<number>(2500000); // 2.5M Initial funds
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<Beneficiary | null>(null);

  const handleVerifyClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
  };

  const handleCloseModal = () => {
    setSelectedBeneficiary(null);
  };

  const handleConfirmDisbursement = async (beneficiary: Beneficiary) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const amount = 5000;

    const newTransaction: Transaction = {
      hash: generateHash(),
      timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      amount,
    };

    const updatedTransactions = [newTransaction, ...transactions];
    const updatedBeneficiaries = beneficiaries.map((b) =>
      b.id === beneficiary.id ? { ...b, status: "Processed" } : b,
    );

    // ✅ Update state
    setTransactions(updatedTransactions);
    setBeneficiaries(updatedBeneficiaries);
    setFunds((prev) => prev - amount);

    // ✅ Save to localStorage
    saveTransactions(updatedTransactions);
    saveBeneficiaries(updatedBeneficiaries);

    handleCloseModal();
  };

  const handleReject = (beneficiary: Beneficiary) => {
    const updatedBeneficiaries = beneficiaries.map((b) =>
      b.id === beneficiary.id ? { ...b, status: "Rejected" } : b,
    );

    setBeneficiaries(updatedBeneficiaries);
    saveBeneficiaries(updatedBeneficiaries);

    handleCloseModal();
  };

  if (viewState === "landing") {
    return (
      <LandingPage
        onEnter={() => setViewState("location")}
        onEnterCitizen={() => setViewState("citizen")}
      />
    );
  }

  if (viewState === "citizen") {
    return <CitizenPortal onBack={() => setViewState("landing")} />;
  }

  if (viewState === "location") {
    return (
      <LocationSelector
        onComplete={(loc) => {
          setLocation(loc);
          setViewState("dashboard");
        }}
        onBack={() => setViewState("landing")}
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
