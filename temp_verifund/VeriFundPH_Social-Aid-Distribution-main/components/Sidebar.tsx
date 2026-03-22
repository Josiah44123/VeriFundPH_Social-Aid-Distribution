import React from 'react';
import { Transaction } from '../types';
import { ShieldCheck, History, Lock, Database, Radio, Server } from 'lucide-react';

interface SidebarProps {
  transactions: Transaction[];
}

const Sidebar: React.FC<SidebarProps> = ({ transactions }) => {
  return (
    <div className="w-full lg:w-[400px] bg-gov-900 h-1/3 lg:h-full flex flex-col shadow-2xl z-30 font-mono border-t lg:border-t-0 lg:border-l border-gov-700 shrink-0">
      {/* Sidebar Header */}
      <div className="shrink-0 p-6 border-b border-gov-700/50 bg-gov-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded bg-brand-yellow/20 flex items-center justify-center text-brand-yellow border border-brand-yellow/50">
             <Database className="w-4 h-4" />
          </div>
          <div>
             <h2 className="text-sm font-bold text-slate-100 tracking-wider">BLOCKCHAIN LEDGER</h2>
             <p className="text-[10px] text-brand-yellow animate-pulse">● LIVE NETWORK ACTIVE</p>
          </div>
        </div>
        
        {/* Network Stats */}
        <div className="grid grid-cols-2 gap-2 mt-4">
           <div className="bg-gov-900/50 p-2 rounded border border-gov-700">
              <p className="text-[10px] text-slate-400">NODE LATENCY</p>
              <p className="text-xs text-emerald-400 font-bold">12ms</p>
           </div>
           <div className="bg-gov-900/50 p-2 rounded border border-gov-700">
              <p className="text-[10px] text-slate-400">BLOCK HEIGHT</p>
              <p className="text-xs text-brand-blue font-bold">#9,203,441</p>
           </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
        <div className="sticky top-0 bg-gov-900/95 backdrop-blur py-2 z-10 border-b border-gov-700 mb-2">
           <p className="text-[10px] text-slate-500 font-bold uppercase px-1">Recent Blocks</p>
        </div>

        {transactions.map((tx, idx) => (
          <div key={idx} className="bg-gov-800/50 p-4 rounded border border-gov-700/50 hover:border-brand-yellow/30 hover:bg-gov-800 transition-all group">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-slate-400 flex items-center gap-1">
                 <History className="w-3 h-3" /> {tx.timestamp}
               </span>
               <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-900/50">
                 CONFIRMED
               </span>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gov-700 flex items-center justify-center text-slate-300 font-bold text-xs border border-gov-600">
                {tx.beneficiaryName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-200">{tx.beneficiaryName}</div>
                <div className="text-[10px] text-slate-500">{tx.beneficiaryId}</div>
              </div>
              <div className="ml-auto text-right">
                 <div className="text-sm font-bold text-white">₱{tx.amount.toLocaleString()}</div>
                 <div className="text-[10px] text-slate-500">SAP-T3</div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gov-700/50">
               <div className="flex items-center justify-between">
                 <span className="text-[9px] text-slate-500">TX HASH</span>
                 <code className="text-[10px] text-brand-yellow bg-gov-900 px-2 py-1 rounded border border-gov-700 flex items-center gap-1">
                    <Lock className="w-2 h-2" />
                    {tx.hash}
                 </code>
               </div>
            </div>
          </div>
        ))}
        
        {transactions.length === 0 && (
          <div className="text-center py-20 text-slate-600">
            <Server className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm font-mono">Waiting for blocks...</p>
          </div>
        )}
      </div>

      {/* Footer Status */}
      <div className="shrink-0 p-4 border-t border-gov-700 bg-gov-800 text-center">
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3" />
          SECURED BY VERIFUND_PH_CHAIN • <span className="text-emerald-500">v1.0.4-stable</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;