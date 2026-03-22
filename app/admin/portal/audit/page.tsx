"use client"

import { 
  Filter, 
  Upload, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Activity,
  Server,
  RefreshCcw,
  Zap,
  Globe
} from "lucide-react"

export default function SystemAuditLedger() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1400px] mx-auto">
      
      {/* HEADER SECTION ALREADY IN LAYOUT, BUT PAGE SPECIFIC SUBTITLE */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-[14px] text-admin-textMuted font-medium leading-relaxed">
            Real-time immutable transparency log for all VeriFund PH administrative actions.
          </p>
        </div>
        
        {/* TOP ACTIONS ROW */}
        <div className="flex items-center gap-3">
          <button className="px-4 h-10 rounded-xl border border-admin-border text-admin-navy text-[13px] font-bold hover:bg-admin-bg transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Actions
          </button>
          <button className="primary-btn bg-admin-navy text-white px-4 h-10 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Export Ledger
          </button>
        </div>
      </div>

      {/* TOP STAT CARDS (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-admin-border hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-admin-textMuted font-medium text-[13px]">Total Events (24H)</h3>
            <Activity className="w-4 h-4 text-admin-textMuted/50" />
          </div>
          <div className="flex items-end gap-3">
            <p className="text-admin-navy text-[28px] font-bold leading-none">14,282</p>
            <div className="px-2 py-0.5 bg-admin-success/10 text-[10px] font-bold text-admin-success rounded flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3" />
              +12.5% vs yesterday
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-admin-danger/20 bg-admin-danger/5 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-admin-textMuted font-medium text-[13px]">Failed Logins</h3>
            <AlertTriangle className="w-4 h-4 text-admin-danger" />
          </div>
          <p className="text-admin-danger text-[28px] font-bold leading-none mb-1">24</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-admin-danger">
            <AlertTriangle className="w-3.5 h-3.5" />
            3 active blocks in place
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[16px] p-5 shadow-sm border border-admin-border hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-admin-textMuted font-medium text-[13px]">Payout Approvals</h3>
            <Zap className="w-4 h-4 text-admin-textMuted/50" />
          </div>
          <p className="text-admin-navy text-[28px] font-bold leading-none mb-1">₱1.2M</p>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-admin-textMuted">
            <div className="w-2 h-2 rounded-full bg-admin-success"></div>
            142 Batches processed
          </div>
        </div>

        {/* Card 4 - Dark Navy Card */}
        <div className="bg-admin-navy rounded-[16px] p-5 shadow-lg border border-admin-navy relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <ShieldCheck className="w-24 h-24" />
          </div>
          <div className="relative z-10 flex flex-col items-start">
            <div className="px-2 py-1 bg-admin-amber/20 border border-admin-amber/30 text-[10px] font-bold text-admin-amber rounded uppercase tracking-wider mb-2">
              Integrity Check
            </div>
            <h3 className="text-white text-[16px] font-bold leading-tight mb-1">System Integrity 100% Verified</h3>
            <p className="text-white/70 text-[11px] font-medium leading-snug pr-4">All ledger entries are signed via biometric secure enclave.</p>
          </div>
        </div>

      </div>

      {/* CHRONOLOGICAL EVENT LEDGER TABLE */}
      <div className="bg-white rounded-[16px] shadow-sm border border-admin-border flex flex-col flex-1 overflow-hidden relative">
        <div className="p-5 border-b border-admin-border flex items-center justify-between bg-white relative z-10">
          <h3 className="text-[16px] font-bold text-admin-navy flex items-center gap-2">
            Chronological Event Ledger
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-admin-success/10 rounded-full border border-admin-success/20">
            <div className="w-2 h-2 rounded-full bg-admin-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            <span className="text-[10px] font-bold text-admin-success tracking-wider uppercase">Live Updates Enabled</span>
          </div>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-mono text-[13px] whitespace-nowrap">
            <thead>
              <tr className="bg-admin-bg/50 text-[#475569] font-sans">
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border">TIMESTAMP</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border">USER ENTITY</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border">SYSTEM ACTION</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border">NETWORK/LOCATION</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border">INTEGRITY</th>
                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider border-b border-admin-border text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border bg-white">
              {/* Row 1 */}
              <tr className="hover:bg-admin-bg/40 transition-colors">
                <td className="px-5 py-3.5 text-admin-textMuted">Oct 24, 2023 14:22:15.004 UTC</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-admin-navy text-white flex items-center justify-center text-[10px] font-bold">RM</div>
                    <span className="font-semibold text-admin-text">Rodrigo M. <span className="text-[#94A3B8] font-normal">(Chief Auditor)</span></span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-1 bg-admin-amber/10 text-admin-amber font-bold text-[11px] rounded uppercase border border-admin-amber/20">PAYOUT_APPROVAL</span>
                </td>
                <td className="px-5 py-3.5 text-[#64748B] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> 122.54.12.192 Quezon City, PH
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-admin-success font-bold text-[12px]">
                    <CheckCircle2 className="w-4 h-4" /> VERIFIED
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-[#94A3B8] hover:text-admin-navy"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>

              {/* Row 2 - Suspicious */}
              <tr className="hover:bg-admin-danger/5 transition-colors bg-admin-danger/[0.02]">
                <td className="px-5 py-3.5 text-admin-textMuted">Oct 24, 2023 13:58:02.812 UTC</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-admin-danger text-white flex items-center justify-center text-[10px] font-bold">??</div>
                    <span className="font-semibold text-admin-danger">Unknown Entity <span className="text-admin-danger/60 font-normal">(Internal IP Range)</span></span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-1 bg-admin-danger/10 text-admin-danger font-bold text-[11px] rounded uppercase border border-admin-danger/20">SECURITY_ALERT</span>
                </td>
                <td className="px-5 py-3.5 text-[#64748B] flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" /> 10.0.4.52 Cisco Proxy, PH
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-admin-danger font-bold text-[12px]">
                    <ShieldAlert className="w-4 h-4" /> SUSPICIOUS
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-admin-danger hover:text-red-700 font-bold text-[11px] uppercase">Review</button>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-admin-bg/40 transition-colors">
                <td className="px-5 py-3.5 text-admin-textMuted">Oct 24, 2023 12:45:33.442 UTC</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#475569] text-white flex items-center justify-center text-[10px] font-bold">SA</div>
                    <span className="font-semibold text-admin-text">System Admin <span className="text-[#94A3B8] font-normal">(Root Access)</span></span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-1 bg-[#EFF6FF] text-[#2563EB] font-bold text-[11px] rounded uppercase border border-[#BFDBFE]">MIGRATION_EXEC</span>
                </td>
                <td className="px-5 py-3.5 text-[#64748B] flex items-center gap-2">
                  <Server className="w-3.5 h-3.5" /> LOCAL_HOST Data Center 1
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-admin-success font-bold text-[12px]">
                    <CheckCircle2 className="w-4 h-4" /> VERIFIED
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-[#94A3B8] hover:text-admin-navy"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>

              {/* Row 4 */}
              <tr className="hover:bg-admin-bg/40 transition-colors">
                <td className="px-5 py-3.5 text-admin-textMuted">Oct 24, 2023 10:11:00.009 UTC</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#0D9488] text-white flex items-center justify-center text-[10px] font-bold">LA</div>
                    <span className="font-semibold text-admin-text">Liza A. <span className="text-[#94A3B8] font-normal">(Dist. Manager)</span></span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-1 bg-[#F0FDFA] text-[#0D9488] font-bold text-[11px] rounded uppercase border border-[#CCFBF1]">BENEFICIARY_SYNC</span>
                </td>
                <td className="px-5 py-3.5 text-[#64748B] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5" /> 110.32.9.22 Cebu City, PH
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-admin-success font-bold text-[12px]">
                    <CheckCircle2 className="w-4 h-4" /> VERIFIED
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button className="text-[#94A3B8] hover:text-admin-navy"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION & FOOTER */}
        <div className="p-4 border-t border-admin-border bg-admin-bg/20 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-[12px] font-bold text-admin-success bg-[#DCFCE7] px-3 py-1.5 rounded-full border border-[#bbf7d0]">
            <ShieldCheck className="w-4 h-4" />
            SYSTEM SECURE
            <div className="w-16 h-1.5 bg-white/50 rounded-full ml-1 overflow-hidden">
              <div className="w-full h-full bg-admin-success rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 font-sans">
            <span className="text-[13px] font-medium text-admin-textMuted">
              Showing <strong className="text-admin-navy">50</strong> of <strong className="text-admin-navy">14,282</strong> events today
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-admin-textMuted mr-1">page</span>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-admin-navy text-white text-[12px] font-bold shadow-sm">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-admin-border text-admin-textMuted text-[12px] font-medium transition-colors">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-admin-border text-admin-textMuted text-[12px] font-medium transition-colors">3</button>
              <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-admin-border text-admin-textMuted transition-colors ml-1"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING REFRESH FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-admin-danger text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] flex items-center justify-center hover:bg-red-600 hover:scale-105 transition-all z-50 group border-2 border-white/20">
        <RefreshCw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
      </button>

    </div>
  )
}
