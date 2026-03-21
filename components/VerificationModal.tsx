import React, { useState, useEffect, useRef } from 'react';
import { Beneficiary, ScanStep, VerificationCheck } from '../types';
import { 
  X, Scan, CheckCircle, AlertTriangle, ShieldCheck, 
  CreditCard, Loader2, Fingerprint, Camera, UserCheck, Database, Focus, Radio, Activity
} from 'lucide-react';

interface VerificationModalProps {
  beneficiary: Beneficiary;
  onClose: () => void;
  onConfirm: (beneficiary: Beneficiary) => Promise<void>;
  onReject: (beneficiary: Beneficiary) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ 
  beneficiary, onClose, onConfirm, onReject 
}) => {
  const [scanStep, setScanStep] = useState<ScanStep>(ScanStep.IDLE);
  const [checks, setChecks] = useState<VerificationCheck[]>([
    { id: 'db', label: 'Searching Central Database', status: 'pending' },
    { id: 'liveness', label: 'Liveness Analysis', status: 'pending' },
    { id: 'match', label: 'Biometric Match Score', status: 'pending' }
  ]);
  const [isMinting, setIsMinting] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const startScan = () => {
    setScanStep(ScanStep.SCANNING);
    
    // Reset checks
    setChecks(prev => prev.map(c => ({ ...c, status: 'loading', value: undefined })));

    // 1. Database Check
    setTimeout(() => {
      setChecks(prev => prev.map(c => c.id === 'db' ? { ...c, status: 'success', value: 'RECORD FOUND' } : c));
      
      // 2. Liveness Check
      setTimeout(() => {
        if (beneficiary.isFraud) {
          setChecks(prev => prev.map(c => c.id === 'liveness' ? { ...c, status: 'failure', value: 'SPOOF DETECTED' } : c));
          setScanStep(ScanStep.FRAUD_DETECTED);
        } else {
          setChecks(prev => prev.map(c => c.id === 'liveness' ? { ...c, status: 'success', value: 'LIVE SUBJECT' } : c));
          
          // 3. Match Score (Only if not fraud)
          setTimeout(() => {
            setChecks(prev => prev.map(c => c.id === 'match' ? { ...c, status: 'success', value: '99.2% MATCH' } : c));
            setScanStep(ScanStep.COMPLETE);
          }, 1200);
        }
      }, 1800);
    }, 1000);
  };

  const handleConfirm = async () => {
    setIsMinting(true);
    await onConfirm(beneficiary);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      <div className={`bg-gov-900 w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-500 border-2 ${
        scanStep === ScanStep.FRAUD_DETECTED ? 'border-brand-red ring-4 ring-brand-red/20' : 
        scanStep === ScanStep.COMPLETE ? 'border-emerald-500' :
        'border-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className={`flex justify-between items-center px-6 py-4 border-b ${scanStep === ScanStep.FRAUD_DETECTED ? 'bg-brand-red/5 border-brand-red/20' : 'bg-slate-900 border-slate-700'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${scanStep === ScanStep.FRAUD_DETECTED ? 'bg-brand-red text-white' : 'bg-brand-blue text-white'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-lg font-bold ${scanStep === ScanStep.FRAUD_DETECTED ? 'text-brand-red' : 'text-white'} uppercase tracking-wider`}>
                {scanStep === ScanStep.FRAUD_DETECTED ? 'Security Alert: Fraud Attempt' : 'Verification Protocol: Level 3'}
              </h2>
              <p className="text-[10px] text-slate-400 font-mono">SECURE_SESSION_ID: {Math.random().toString(36).substr(2, 12).toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} disabled={isMinting} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Left Panel: Static Record */}
          <div className="w-full lg:w-1/3 bg-gov-900 p-6 border-r border-gov-700 overflow-y-auto">
            <div className="mb-6 flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-widest border-b border-gov-700 pb-2">
              <Database className="w-4 h-4" />
              <span>Reference Database</span>
            </div>

            <div className="bg-gov-800/50 p-6 rounded-xl border border-gov-700 shadow-sm mb-6 relative overflow-hidden backdrop-blur-sm">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <Fingerprint className="w-24 h-24 text-white" />
               </div>
              <div className="aspect-square w-32 h-32 mx-auto bg-gov-700 rounded-lg mb-4 overflow-hidden border-2 border-gov-600 shadow-md relative group">
                <img src={beneficiary.photoUrl} alt="ID Photo" className="w-full h-full object-cover" />
              </div>
              
              <div className="space-y-4 relative z-10">
                <div className="text-center">
                  <div className="text-xl font-bold text-white leading-tight">{beneficiary.name}</div>
                  <div className="text-xs font-mono text-slate-400 mt-1">{beneficiary.id}</div>
                </div>
                
                <div className="grid grid-cols-1 gap-1 border-t border-gov-700 pt-4">
                  <div className="flex justify-between py-2 border-b border-gov-700/50">
                     <span className="text-xs text-slate-400 font-bold uppercase">PhilSys ID</span>
                     <span className="text-xs font-mono text-slate-300">{beneficiary.details.philSysId}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gov-700/50">
                     <span className="text-xs text-slate-400 font-bold uppercase">Birthday</span>
                     <span className="text-xs font-mono text-slate-300">{beneficiary.details.dob}</span>
                  </div>
                  <div className="py-2">
                     <span className="text-xs text-slate-400 font-bold uppercase block mb-1">Address</span>
                     <span className="text-xs text-slate-300">{beneficiary.details.address}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gov-800 to-gov-900 text-white rounded-xl p-4 shadow-lg">
               <div className="flex items-start gap-3">
                 <div className="p-2 bg-white/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-brand-yellow" />
                 </div>
                 <div>
                   <h4 className="text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">Disbursement Amount</h4>
                   <p className="text-2xl font-mono font-bold">₱5,000.00</p>
                   <p className="text-[10px] text-slate-400 mt-1">SAP Tranche 3 • Priority Sector</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Live Scanner */}
          <div className="w-full lg:w-2/3 p-6 flex flex-col bg-gov-900 relative">
            
            {/* Camera Feed */}
            <div className="relative w-full flex-1 bg-black rounded-xl overflow-hidden shadow-2xl border border-slate-700 mb-6 group" ref={videoRef}>
              <img 
                src={beneficiary.liveFeedUrl} 
                alt="Live Feed" 
                className={`w-full h-full object-cover transition-opacity duration-300 ${scanStep === ScanStep.IDLE ? 'opacity-40 grayscale' : 'opacity-100'}`} 
              />
              
              {/* Overlay Grid */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
              
              {/* IDLE STATE */}
              {scanStep === ScanStep.IDLE && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                     <div className="absolute inset-0 bg-brand-blue blur-2xl opacity-20 rounded-full animate-pulse"></div>
                     <Scan className="w-24 h-24 text-slate-500 relative z-10" />
                  </div>
                  <p className="text-brand-blue font-mono text-sm mt-6 animate-pulse">AWAITING BIOMETRIC INPUT...</p>
                </div>
              )}

              {/* ACTIVE SCANNING STATE */}
              {(scanStep === ScanStep.SCANNING || scanStep === ScanStep.COMPLETE || scanStep === ScanStep.FRAUD_DETECTED) && (
                <>
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-2 rounded-lg transition-all duration-300 ${
                    scanStep === ScanStep.SCANNING ? 'border-brand-blue/50' :
                    scanStep === ScanStep.FRAUD_DETECTED ? 'border-brand-red bg-brand-red/10' :
                    'border-emerald-500 bg-emerald-500/10'
                  }`}>
                    {/* Corner Reticles */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-current"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-current"></div>
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-current"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-current"></div>
                    
                    {/* Scanning Laser */}
                    {scanStep === ScanStep.SCANNING && (
                      <div className="absolute left-0 right-0 h-0.5 bg-brand-blue shadow-[0_0_20px_rgba(0,56,168,0.8)] animate-scan"></div>
                    )}
                  </div>

                  {/* Facial Mesh Points Simulation */}
                  {scanStep === ScanStep.SCANNING && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 grid grid-cols-4 grid-rows-4 gap-8 opacity-50">
                        {[...Array(16)].map((_, i) => (
                           <div key={i} className="w-1 h-1 bg-brand-blue rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s`}}></div>
                        ))}
                     </div>
                  )}
                  
                  {/* HUD Info */}
                  <div className="absolute top-4 left-4 text-[10px] font-mono text-brand-blue/80 bg-slate-900/80 px-3 py-2 rounded border border-brand-blue/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1"><Focus className="w-3 h-3"/> FOCUS: LOCKED</div>
                    <div className="flex items-center gap-2 mb-1"><Radio className="w-3 h-3"/> LIVENESS: ANALYZING</div>
                    <div className="flex items-center gap-2"><Activity className="w-3 h-3"/> CONFIDENCE: {(Math.random() * (0.99 - 0.90) + 0.90).toFixed(4)}</div>
                  </div>
                </>
              )}

              {/* Fraud Alert */}
              {scanStep === ScanStep.FRAUD_DETECTED && (
                <div className="absolute inset-0 bg-brand-red/20 backdrop-blur-[2px] flex items-center justify-center animate-pulse z-20">
                  <div className="bg-slate-900 text-white px-8 py-6 rounded-xl border border-brand-red shadow-2xl flex flex-col items-center">
                    <AlertTriangle className="w-16 h-16 text-brand-red mb-4" />
                    <h2 className="text-3xl font-black text-brand-red uppercase tracking-widest mb-1">FRAUD DETECTED</h2>
                    <p className="font-mono text-sm text-white">BIOMETRIC MISMATCH / SPOOFING</p>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Steps */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {checks.map((check) => (
                <div key={check.id} className={`p-4 rounded-lg border transition-all duration-300 ${
                  check.status === 'pending' ? 'bg-slate-800 border-slate-700 opacity-50' :
                  check.status === 'loading' ? 'bg-gov-800/30 border-gov-500' :
                  check.status === 'success' ? 'bg-emerald-900/20 border-emerald-500/50' :
                  'bg-brand-red/10 border-brand-red/50'
                }`}>
                  <div className={`text-[10px] uppercase font-bold mb-1 ${check.status === 'pending' ? 'text-slate-500' : 'text-slate-300'}`}>{check.label}</div>
                  <div className="flex items-center gap-2">
                    {check.status === 'pending' && <span className="text-sm font-mono text-slate-600">--</span>}
                    {check.status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />}
                    {check.status === 'success' && (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-mono font-bold text-emerald-400">{check.value}</span>
                      </>
                    )}
                    {check.status === 'failure' && (
                      <>
                        <X className="w-4 h-4 text-brand-red" />
                        <span className="text-xs font-mono font-bold text-brand-red">{check.value}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              {scanStep === ScanStep.IDLE && (
                <button 
                  onClick={startScan}
                  className="w-full h-16 bg-brand-blue hover:bg-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-blue/20 transition-all active:scale-[0.99]"
                >
                  <Scan className="w-6 h-6" />
                  INITIATE BIO-SCAN
                </button>
              )}

              {scanStep === ScanStep.SCANNING && (
                <button disabled className="w-full h-16 bg-slate-800 text-slate-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 cursor-not-allowed border border-slate-700">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  PROCESSING BIOMETRICS...
                </button>
              )}

              {scanStep === ScanStep.COMPLETE && (
                <button 
                  onClick={handleConfirm}
                  disabled={isMinting}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99]"
                >
                  {isMinting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      WRITING TO BLOCKCHAIN...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-6 h-6" />
                      AUTHORIZE DISBURSEMENT
                    </>
                  )}
                </button>
              )}

              {scanStep === ScanStep.FRAUD_DETECTED && (
                <button 
                  onClick={() => onReject(beneficiary)}
                  className="w-full h-16 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-brand-red/20 transition-all active:scale-[0.99]"
                >
                  <AlertTriangle className="w-6 h-6" />
                  REJECT & REPORT ID
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;