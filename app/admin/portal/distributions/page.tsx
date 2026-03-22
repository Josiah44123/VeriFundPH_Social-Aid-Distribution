"use client"

import { 
  Zap,
  TrendingUp,
  ChevronRight,
  Plus,
  FileText,
  MapPin,
  Calendar,
  MoreVertical,
  Circle
} from "lucide-react"

export default function DistributionsControlCenter() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div className="max-w-3xl">
          <p className="text-[14px] text-admin-textMuted font-medium leading-relaxed">
            Monitor and control the disbursement of funds across localities, manage batch schedules, and view geographic coverage.
          </p>
        </div>
      </div>

      {/* TOP HERO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 - Navy */}
        <div className="bg-admin-navy rounded-[16px] p-6 shadow-md relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-white/80 font-medium text-[13px] tracking-wide">Total Disbursed Funds</h3>
            <div className="px-2.5 py-1 bg-admin-success/20 text-[11px] font-bold text-admin-success border border-admin-success/30 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +23.4% from last month
            </div>
          </div>
          <p className="text-white text-[38px] font-extrabold leading-none tracking-tight mb-2 relative z-10">₱42,840,000</p>
          <p className="text-admin-amber text-[12px] font-bold uppercase tracking-wider relative z-10">70% of total budget utilized</p>
        </div>

        {/* Card 2 - White */}
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border hover:shadow-md transition-shadow">
          <h3 className="text-admin-textMuted font-medium text-[13px] tracking-wide mb-4">Remaining Allocation</h3>
          <p className="text-admin-navy text-[38px] font-extrabold leading-none tracking-tight mb-2">₱18,160,000</p>
          <div className="w-full bg-admin-bg h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-admin-navy h-full rounded-full w-[30%]"></div>
          </div>
        </div>

        {/* Card 3 - Gold/Amber */}
        <div className="bg-gradient-to-br from-admin-amber to-[#D97706] rounded-[16px] p-6 shadow-md relative overflow-hidden text-white group">
          <div className="absolute right-0 bottom-0 text-white/20 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
            <Zap className="w-32 h-32" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-white/90 font-medium text-[13px] tracking-wide">Active Distributions</h3>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          </div>
          <p className="text-white text-[48px] font-extrabold leading-none tracking-tight relative z-10">14</p>
        </div>
      </div>

      {/* MID SECTION SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Progress & Ledger */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* BARANGAY DISTRIBUTION PROGRESS */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-[18px] font-bold text-admin-navy flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-admin-amber" />
                  Barangay Distribution Progress
                </h3>
                <p className="text-[13px] text-admin-textMuted font-medium mt-1">Monitoring real-time disbursement per locality</p>
              </div>
              <button className="text-[13px] font-bold text-admin-amber hover:text-admin-navy transition-colors flex items-center gap-1">
                View All Units <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Brgy 1 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-admin-text">Brgy. Poblacion I</span>
                  <span className="text-[14px] font-bold text-admin-success">92%</span>
                </div>
                <div className="w-full h-2.5 bg-admin-bg rounded-full overflow-hidden">
                  <div className="bg-admin-success h-full rounded-full w-[92%] shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                </div>
              </div>
              {/* Brgy 2 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-admin-text">San Jose</span>
                  <span className="text-[14px] font-bold text-admin-amber">45%</span>
                </div>
                <div className="w-full h-2.5 bg-admin-bg rounded-full overflow-hidden">
                  <div className="bg-admin-amber h-full rounded-full w-[45%] shadow-[0_0_10px_rgba(245,166,35,0.4)]"></div>
                </div>
              </div>
              {/* Brgy 3 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-admin-text">Santa Maria</span>
                  <span className="text-[14px] font-bold text-[#84CC16]">78%</span>
                </div>
                <div className="w-full h-2.5 bg-admin-bg rounded-full overflow-hidden">
                  <div className="bg-[#84CC16] h-full rounded-full w-[78%] shadow-[0_0_10px_rgba(132,204,22,0.4)]"></div>
                </div>
              </div>
              {/* Brgy 4 */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-admin-text">Santo Niño</span>
                  <span className="text-[14px] font-bold text-admin-danger">12%</span>
                </div>
                <div className="w-full h-2.5 bg-admin-bg rounded-full overflow-hidden">
                  <div className="bg-admin-danger h-full rounded-full w-[12%] shadow-[0_0_10px_rgba(239,68,68,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* RECENT LEDGER ENTRIES */}
          <div className="bg-white rounded-[16px] shadow-sm border border-admin-border flex flex-col overflow-hidden">
            <div className="p-6 border-b border-admin-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
              <h3 className="text-[18px] font-bold text-admin-navy flex items-center gap-2">
                <FileText className="w-5 h-5 text-admin-amber" />
                Recent Ledger Entries
              </h3>
              <button className="primary-btn bg-admin-navy text-white px-4 h-10 text-[13px] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Schedule New Batch
              </button>
            </div>
            
            <div className="divide-y divide-admin-border">
              {/* Entry 1 */}
              <div className="p-4 hover:bg-admin-bg/50 transition-colors flex items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#E0ECEF] text-[#475569] flex items-center justify-center shrink-0 group-hover:bg-admin-navy group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-admin-text">AIMS Cash Grant – Batch 2024–A</h4>
                    <p className="text-[12px] text-admin-textMuted font-medium flex items-center gap-2 mt-0.5">
                      <span className="text-admin-navy">#DX-99201</span> • Oct 24
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <span className="text-[15px] font-bold text-admin-text">₱2,450,000</span>
                  <div className="px-3 py-1 bg-admin-success/10 text-admin-success text-[10px] font-bold uppercase rounded-md border border-admin-success/20 text-center">
                    COMPLETED
                  </div>
                </div>
              </div>
              
              {/* Entry 2 */}
              <div className="p-4 hover:bg-admin-bg/50 transition-colors flex items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#E0ECEF] text-[#475569] flex items-center justify-center shrink-0 group-hover:bg-admin-navy group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-admin-text">Health & Nutrition Subsidy</h4>
                    <p className="text-[12px] text-admin-textMuted font-medium flex items-center gap-2 mt-0.5">
                      <span className="text-admin-navy">#DX-99189</span> • Oct 22
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <span className="text-[15px] font-bold text-admin-text">₱1,200,000</span>
                  <div className="px-3 py-1 bg-admin-amber/10 text-admin-amber text-[10px] font-bold uppercase rounded-md border border-admin-amber/20 text-center">
                    PROCESSING
                  </div>
                </div>
              </div>

              {/* Entry 3 */}
              <div className="p-4 hover:bg-admin-bg/50 transition-colors flex items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#E0ECEF] text-[#475569] flex items-center justify-center shrink-0 group-hover:bg-admin-navy group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-admin-text">Senior Citizen Quarterly Social Pension</h4>
                    <p className="text-[12px] text-admin-textMuted font-medium flex items-center gap-2 mt-0.5">
                      <span className="text-admin-navy">#DX-99</span> • Oct 18
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <span className="text-[15px] font-bold text-admin-text">₱8,900,000</span>
                  <div className="px-3 py-1 bg-admin-success/10 text-admin-success text-[10px] font-bold uppercase rounded-md border border-admin-success/20 text-center">
                    COMPLETED
                  </div>
                </div>
              </div>

              {/* Entry 4 */}
              <div className="p-4 hover:bg-admin-bg/50 transition-colors flex items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[#E0ECEF] text-[#475569] flex items-center justify-center shrink-0 group-hover:bg-admin-navy group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-admin-text">Educational Assistance (Tertiary)</h4>
                    <p className="text-[12px] text-admin-textMuted font-medium flex items-center gap-2 mt-0.5">
                      <span className="text-admin-navy">#DX-99772</span> • Oct 15
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                  <span className="text-[15px] font-bold text-admin-text">₱540,000</span>
                  <div className="px-3 py-1 bg-admin-success/10 text-admin-success text-[10px] font-bold uppercase rounded-md border border-admin-success/20 text-center">
                    COMPLETED
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Schedule & Map */}
        <div className="flex flex-col gap-6">
          
          {/* DISTRIBUTION SCHEDULE */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[18px] font-bold text-admin-navy flex items-center gap-2">
                <Calendar className="w-5 h-5 text-admin-amber" />
                Distribution Schedule
              </h3>
              <button className="text-admin-textMuted hover:text-admin-navy transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="relative pl-3 flex-1">
              <div className="absolute top-2 bottom-2 left-[15px] w-px bg-admin-border"></div>
              
              <div className="space-y-6 relative">
                {/* Event 1 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-admin-danger/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-danger"></div>
                  </div>
                  <div className="text-[11px] font-bold text-admin-danger tracking-wider uppercase mb-1">TODAY 09:00 AM</div>
                  <h4 className="text-[14px] font-bold text-admin-text leading-tight mb-1">Brgy. Poblacion I Payout</h4>
                  <p className="text-[12px] text-admin-textMuted leading-snug">Livelihood Assistance at Municipal Hall</p>
                </div>
                
                {/* Event 2 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-admin-amber/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-amber"></div>
                  </div>
                  <div className="text-[11px] font-bold text-admin-amber tracking-wider uppercase mb-1">TOMORROW 10:00 AM</div>
                  <h4 className="text-[14px] font-bold text-admin-text leading-tight mb-1">San Jose Site Visit</h4>
                  <p className="text-[12px] text-admin-textMuted leading-snug">Pre-distribution verification for 400 beneficiaries</p>
                </div>

                {/* Event 3 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-admin-textMuted/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-textMuted"></div>
                  </div>
                  <div className="text-[11px] font-bold text-admin-textMuted tracking-wider uppercase mb-1">Oct 28 8:30 AM</div>
                  <h4 className="text-[14px] font-bold text-admin-text leading-tight mb-1">Santa Maria Distribution</h4>
                  <p className="text-[12px] text-admin-textMuted leading-snug">Quarterly Social Pension at Covered Court</p>
                </div>

                {/* Event 4 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-5px] top-1 w-3 h-3 rounded-full bg-admin-textMuted/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-admin-textMuted"></div>
                  </div>
                  <div className="text-[11px] font-bold text-admin-textMuted tracking-wider uppercase mb-1">Oct 31 3:00 PM</div>
                  <h4 className="text-[14px] font-bold text-admin-text leading-tight mb-1">Financial Report Audit</h4>
                  <p className="text-[12px] text-admin-textMuted leading-snug">Monthly reconciliation meeting with COA auditors</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-admin-bg text-admin-navy text-[13px] font-bold hover:bg-admin-navy hover:text-white transition-all">
              Manage Full Calendar
            </button>
          </div>

          {/* COVERAGE MAP (bottom right) */}
          <div className="bg-[#0f172a] rounded-[16px] p-4 relative overflow-hidden shadow-md border border-slate-700 h-[220px] flex flex-col justify-end">
            <div className="absolute inset-0 opacity-50 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/121.05,14.65,11/400x300?access_token=none')] bg-cover bg-center mix-blend-screen"></div>
            
            {/* Map Dots Simulated */}
            <div className="absolute top-[40%] left-[30%] w-4 h-4 bg-admin-success/80 rounded-full blur-[2px]"></div>
            <div className="absolute top-[45%] left-[35%] w-6 h-6 bg-admin-success/80 rounded-full blur-[3px]"></div>
            <div className="absolute top-[35%] left-[45%] w-8 h-8 bg-admin-success/80 rounded-full blur-[4px]"></div>
            
            <div className="absolute top-[60%] left-[60%] w-5 h-5 bg-admin-danger/80 rounded-full blur-[3px]"></div>
            <div className="absolute top-[65%] left-[70%] w-3 h-3 bg-admin-danger/80 rounded-full blur-[2px]"></div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Circle className="w-2.5 h-2.5 fill-admin-success text-admin-success" />
                  <span className="text-[11px] font-bold text-white uppercase">High Density</span>
                </div>
                <span className="text-[11px] font-semibold text-white/70">4 Barangays</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Circle className="w-2.5 h-2.5 fill-admin-danger text-admin-danger" />
                  <span className="text-[11px] font-bold text-white uppercase">Pending Units</span>
                </div>
                <span className="text-[11px] font-semibold text-white/70">2 Barangays</span>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}
