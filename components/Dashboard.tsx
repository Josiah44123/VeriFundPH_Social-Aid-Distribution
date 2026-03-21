import React, { useState } from 'react';
import { Beneficiary, LocationContextType } from '../types';
import { User, AlertCircle, CheckCircle2, ChevronRight, Fingerprint, Search, Filter, LayoutGrid, List, ShieldAlert, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  beneficiaries: Beneficiary[];
  onVerify: (b: Beneficiary) => void;
  funds: number;
  location: LocationContextType;
}

type FilterType = 'All' | 'Ready' | 'Flagged' | 'Processed';

const Dashboard: React.FC<DashboardProps> = ({ beneficiaries, onVerify, funds, location }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('Ready');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesFilter = activeFilter === 'All' ? true : b.status === activeFilter;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gov-900 relative font-sans min-h-0 min-w-0">
      {/* Philippine Sun Rays Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 800 800" className="w-[150%] h-[150%] animate-[spin_240s_linear_infinite]">
          <g fill="#FCD116">
            {[...Array(8)].map((_, i) => (
              <polygon key={i} points="400,400 420,0 380,0" transform={`rotate(${i * 45} 400 400)`} />
            ))}
          </g>
        </svg>
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(2,6,23,0.8),rgba(2,6,23,0.95))] pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] pointer-events-none mix-blend-overlay"></div>
      
      {/* Header */}
      <header className="relative shrink-0 bg-gov-800/80 backdrop-blur-md border-b border-gov-500 py-5 px-8 flex justify-between items-center z-20 shadow-2xl shadow-gov-900/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,56,168,0.5)] border border-brand-blue/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-yellow/10 animate-pulse"></div>
            <Fingerprint className="w-7 h-7 relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase flex items-center gap-2">
              VeriFund PH <span className="text-brand-yellow text-lg font-bold align-super bg-brand-yellow/10 px-1.5 py-0.5 rounded border border-brand-yellow/30">PRO</span>
            </h1>
            <p className="text-xs text-brand-red font-mono tracking-widest mt-1 font-bold">LGU DISBURSEMENT CONSOLE v2.5</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:block text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Active Jurisdiction</p>
            <div className="flex items-center gap-2 bg-gov-900/80 px-4 py-1.5 rounded-full border border-gov-500 shadow-inner">
               <span className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse shadow-[0_0_8px_rgba(252,209,22,0.8)]"></span>
               <p className="text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                 {location.city}, {location.province}
               </p>
            </div>
          </div>
          <div className="bg-gov-900/80 pl-5 pr-7 py-2.5 rounded-xl border border-brand-blue/30 flex flex-col items-end shadow-[inset_0_0_20px_rgba(0,56,168,0.2)] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-blue"></div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Allocation</p>
            <p className="text-2xl font-bold text-white font-mono tracking-tight text-shadow-sm">₱{funds.toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="relative shrink-0 px-8 py-6 flex flex-col md:flex-row gap-4 justify-between items-end md:items-center z-10">
        <div className="flex items-center bg-gov-800/80 p-1.5 rounded-xl border border-gov-500 shadow-lg backdrop-blur-sm">
          {['Ready', 'Flagged', 'Processed', 'All'].map((filter) => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter as FilterType)}
               className={`px-5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                 activeFilter === filter 
                 ? filter === 'Flagged' ? 'bg-brand-yellow text-gov-900 shadow-[0_0_10px_rgba(252,209,22,0.3)]' :
                   filter === 'Processed' ? 'bg-gov-500 text-white shadow-[0_0_10px_rgba(0,56,168,0.3)]' :
                   'bg-brand-blue text-white shadow-[0_0_10px_rgba(0,56,168,0.3)]'
                 : 'text-slate-400 hover:bg-gov-500/50 hover:text-white'
               }`}
             >
               {filter}
             </button>
          ))}
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-yellow transition-colors" />
          <input 
            type="text" 
            placeholder="Search ID or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gov-500 bg-gov-800/80 focus:outline-none focus:ring-2 focus:ring-brand-yellow/50 focus:border-brand-yellow transition-all text-sm font-medium text-white placeholder-slate-500 shadow-lg backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative flex-1 overflow-y-auto px-8 pb-12 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBeneficiaries.map((b) => (
            <div 
              key={b.id} 
              className={`group relative bg-gov-800/90 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl border ${
                b.status === 'Flagged' ? 'border-brand-yellow/50 shadow-[0_5px_20px_rgba(252,209,22,0.15)]' : 
                b.status === 'Ready' ? 'border-gov-500 hover:border-brand-blue' : 
                'border-gov-900 opacity-70 grayscale-[0.3] hover:grayscale-0'
              }`}
            >
              {/* Card Header Status Line */}
              <div className={`h-1.5 w-full ${
                 b.status === 'Ready' ? 'bg-brand-blue' :
                 b.status === 'Flagged' ? 'bg-brand-yellow' :
                 b.status === 'Rejected' ? 'bg-brand-red' : 'bg-gov-500'
              }`}></div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                     <span className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md border ${
                       b.status === 'Ready' ? 'bg-brand-blue/20 text-blue-300 border-brand-blue/30' :
                       b.status === 'Flagged' ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30' :
                       'bg-gov-900 text-slate-400 border-gov-500'
                     }`}>
                       {b.status}
                     </span>
                     {parseInt(b.details.dob.split('-')[0]) < 1965 && (
                       <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md border bg-purple-900/30 text-purple-300 border-purple-500/30">
                         Senior
                       </span>
                     )}
                  </div>
                  <button className="text-slate-500 hover:text-brand-yellow transition-colors bg-gov-900 p-1.5 rounded-lg border border-gov-500">
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gov-500 shadow-lg relative">
                      <div className="absolute inset-0 bg-brand-blue/20 mix-blend-overlay z-10"></div>
                      <img 
                        src={b.photoUrl} 
                        alt={b.name} 
                        className="w-full h-full object-cover grayscale-[0.2]" 
                      />
                    </div>
                    {b.status === 'Flagged' && (
                       <div className="absolute -top-2 -right-2 bg-brand-yellow text-gov-900 rounded-full p-1 border-2 border-gov-800 shadow-lg animate-bounce">
                         <ShieldAlert className="w-3.5 h-3.5" />
                       </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1">{b.name}</h3>
                    <p className="font-mono text-xs text-brand-yellow bg-gov-900/80 px-2 py-0.5 rounded border border-gov-500 inline-block mb-2">{b.id}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">{b.details.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-gov-900/80 p-2.5 rounded-lg border border-gov-500">
                     <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">PhilSys Check</p>
                     <p className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                       <ShieldCheck className="w-3.5 h-3.5" />
                       VERIFIED
                     </p>
                   </div>
                   <div className="bg-gov-900/80 p-2.5 rounded-lg border border-gov-500">
                     <p className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">Risk Score</p>
                     <p className={`text-xs font-bold flex items-center gap-1.5 ${b.status === 'Flagged' ? 'text-brand-yellow' : 'text-blue-400'}`}>
                       {b.status === 'Flagged' ? 'HIGH (88%)' : 'LOW (2%)'}
                     </p>
                   </div>
                </div>

                {b.status === 'Ready' || b.status === 'Flagged' ? (
                  <button 
                    onClick={() => onVerify(b)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border ${
                      b.status === 'Flagged' 
                      ? 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/50 hover:bg-brand-yellow hover:text-gov-900 hover:shadow-[0_0_15px_rgba(252,209,22,0.4)]' 
                      : 'bg-brand-blue text-white border-brand-blue hover:bg-brand-red hover:border-brand-red hover:shadow-[0_0_15px_rgba(206,17,38,0.4)]'
                    } active:scale-[0.98]`}
                  >
                    {b.status === 'Flagged' ? 'Review Flagged Case' : 'Initiate Verification'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                   <div className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border ${
                     b.status === 'Processed' ? 'bg-gov-900/80 text-slate-300 border-gov-500' : 'bg-brand-red/10 text-brand-red border-brand-red/30'
                   }`}>
                      {b.status === 'Processed' ? 'DISBURSEMENT COMPLETE' : 'APPLICATION REJECTED'}
                   </div>
                )}
              </div>
            </div>
          ))}
          
          {filteredBeneficiaries.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center py-24 opacity-50 bg-gov-800/30 rounded-3xl border border-gov-500 border-dashed">
               <Search className="w-16 h-16 text-slate-500 mb-4" />
               <p className="text-slate-400 font-medium text-lg">No records found matching current filter.</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;