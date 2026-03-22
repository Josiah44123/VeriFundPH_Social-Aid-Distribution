import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Smartphone } from 'lucide-react';

interface LandingV2Props {
  onLoginStart: () => void;
}

const LandingV2: React.FC<LandingV2Props> = ({ onLoginStart }) => {
  const [showToast, setShowToast] = useState(false);

  const handleAdminClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gov-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      {/* Toast */}
      {showToast && (
        <div className="absolute top-8 right-8 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl animate-in fade-in slide-in-from-top-4 z-50">
          Admin Portal Coming Soon!
        </div>
      )}

      <div className="max-w-4xl w-full text-center z-10 space-y-8">
        <div className="inline-flex items-center justify-center p-4 bg-brand-blue/10 rounded-full mb-4">
          <ShieldCheck className="w-12 h-12 text-brand-blue" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          Welcome to <span className="text-brand-blue">VeriFund</span>
        </h1>
        
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Secure, direct, and verifiable social aid distribution. 
          Experience a new standard of transparency in government assistance.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
          {/* Citizen Portal Button */}
          <button 
            onClick={onLoginStart}
            className="w-full sm:w-auto px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-3 group"
          >
            <Smartphone className="w-6 h-6" />
            Citizen Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Admin Portal Button */}
          <button 
            onClick={handleAdminClick}
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-bold text-lg hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-center gap-3"
          >
            <ShieldCheck className="w-6 h-6" />
            Admin Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingV2;
