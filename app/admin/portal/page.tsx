"use client"

import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Activity,
  Plus,
  MapPin
} from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-admin-bg flex items-center justify-center text-admin-navy">
              <Users className="w-6 h-6" />
            </div>
            <div className="px-2.5 py-1 bg-admin-amber/10 text-[11px] font-bold text-admin-amber rounded-full uppercase tracking-wider">
              +12% this month
            </div>
          </div>
          <p className="text-admin-textMuted font-medium text-[13px] mb-1">Total Rehistrado</p>
          <h3 className="text-admin-navy text-[36px] font-bold leading-none tracking-tight">142,890</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-2xl bg-admin-success/10 flex items-center justify-center text-admin-success">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-admin-bg border-2 border-white flex items-center justify-center text-[10px] font-bold text-admin-navy">RD</div>
              <div className="w-8 h-8 rounded-full bg-admin-bg border-2 border-white flex items-center justify-center text-[10px] font-bold text-admin-navy">AB</div>
              <div className="w-8 h-8 rounded-full bg-[#E5E7EB] border-2 border-white flex items-center justify-center text-[10px] font-bold text-admin-textMuted">+9</div>
            </div>
          </div>
          <p className="text-admin-textMuted font-medium text-[13px] mb-1">Nakakuha Na</p>
          <h3 className="text-admin-navy text-[36px] font-bold leading-none tracking-tight">98,421</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-[16px] p-6 shadow-[0_0_15px_rgba(239,68,68,0.1)] border border-admin-danger/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-admin-danger/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-admin-danger/10 flex items-center justify-center text-admin-danger">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="px-2.5 py-1 bg-admin-danger text-[11px] font-bold text-white rounded-full uppercase tracking-wider animate-pulse">
              Action Needed
            </div>
          </div>
          <p className="text-admin-textMuted font-medium text-[13px] mb-1 relative z-10">Hindi Pa</p>
          <h3 className="text-admin-danger text-[36px] font-bold leading-none tracking-tight relative z-10">44,469</h3>
        </div>
      </div>

      {/* BOTTOM SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-[16px] shadow-sm border border-admin-border flex flex-col overflow-hidden">
          <div className="p-6 border-b border-admin-border flex items-center justify-between bg-white">
            <h3 className="text-[18px] font-bold text-admin-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-admin-amber" />
              Recent Activity
            </h3>
            <button className="text-[13px] font-bold text-admin-amber hover:text-admin-navy transition-colors flex items-center gap-1">
              View All Distribution <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-admin-bg/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-admin-textMuted uppercase tracking-wider border-b border-admin-border">Beneficiary Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-admin-textMuted uppercase tracking-wider border-b border-admin-border">Barangay</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-admin-textMuted uppercase tracking-wider border-b border-admin-border">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-admin-textMuted uppercase tracking-wider border-b border-admin-border text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-white">
                {/* Row 1 */}
                <tr className="hover:bg-admin-bg/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center text-[12px] font-bold shadow-sm group-hover:scale-105 transition-transform">RD</div>
                      <span className="font-semibold text-admin-text text-[14px]">Reyes, Danilo G.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-nowrap">Bgy. Commonwealth</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-admin-success/10 text-admin-success text-[11px] font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-right">2 mins ago</td>
                </tr>
                {/* Row 2 */}
                <tr className="hover:bg-admin-bg/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-[12px] font-bold shadow-sm group-hover:scale-105 transition-transform">AM</div>
                      <span className="font-semibold text-admin-text text-[14px]">Abad, Maria Elena</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-nowrap">Bgy. Batasan Hills</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-admin-amber/10 text-admin-amber text-[11px] font-bold uppercase">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-right">14 mins ago</td>
                </tr>
                {/* Row 3 */}
                <tr className="hover:bg-admin-bg/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center text-[12px] font-bold shadow-sm group-hover:scale-105 transition-transform">JC</div>
                      <span className="font-semibold text-admin-text text-[14px]">Jimenez, Carlos S.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-nowrap">Bgy. Payatas</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-admin-success/10 text-admin-success text-[11px] font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-right">45 mins ago</td>
                </tr>
                {/* Row 4 */}
                <tr className="hover:bg-admin-bg/30 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center text-[12px] font-bold shadow-sm group-hover:scale-105 transition-transform">SC</div>
                      <span className="font-semibold text-admin-text text-[14px]">Santos, Clara L.</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-nowrap">Bgy. Fairview</td>
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-admin-success/10 text-admin-success text-[11px] font-bold uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-admin-textMuted text-right">1 hr ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Distribution Profile & Map */}
        <div className="flex flex-col gap-6">
          
          {/* Distribution Profile Card */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border flex flex-col relative overflow-hidden">
            {/* FAB Button */}
            <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-admin-amber text-white shadow-lg flex items-center justify-center hover:scale-105 hover:bg-yellow-500 transition-all z-10">
              <Plus className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-admin-navy/5 flex items-center justify-center">
                <Activity className="w-5 h-5 text-admin-navy" />
              </div>
              <h3 className="text-[18px] font-bold text-admin-navy">Distribution Profile</h3>
            </div>
            <p className="text-[13px] text-admin-textMuted font-medium mb-6">System-wide allocation health for District III</p>
            
            <div className="space-y-5 mb-8">
              {/* Progress 1 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                  <span className="text-admin-text">Universe Size</span>
                  <span className="text-admin-navy">100%</span>
                </div>
                <div className="h-2 w-full bg-admin-bg rounded-full overflow-hidden">
                  <div className="h-full bg-admin-navy rounded-full w-full"></div>
                </div>
              </div>
              
              {/* Progress 2 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                  <span className="text-admin-text">Nakakuha Na</span>
                  <span className="text-admin-success">69%</span>
                </div>
                <div className="h-2 w-full bg-admin-bg rounded-full overflow-hidden">
                  <div className="h-full bg-admin-success rounded-full w-[69%] shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                </div>
              </div>
              
              {/* Progress 3 */}
              <div>
                <div className="flex justify-between text-[11px] font-bold uppercase mb-2">
                  <span className="text-admin-text">Hindi Pa</span>
                  <span className="text-admin-danger">31%</span>
                </div>
                <div className="h-2 w-full bg-admin-bg rounded-full overflow-hidden">
                  <div className="h-full bg-admin-danger rounded-full w-[31%] shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
              </div>
            </div>

            <div className="flex divide-x divide-admin-border border-t border-admin-border pt-4 mb-6">
              <div className="flex-1 pr-4">
                <span className="text-[11px] font-bold text-admin-textMuted uppercase">Served</span>
                <p className="text-[20px] font-bold text-admin-navy leading-tight mt-1">98.4K</p>
              </div>
              <div className="flex-1 pl-4">
                <span className="text-[11px] font-bold text-admin-danger uppercase">Pending</span>
                <p className="text-[20px] font-bold text-admin-danger leading-tight mt-1">44.4K</p>
              </div>
            </div>

            <div className="bg-admin-bg rounded-xl p-4 text-[13px] font-medium text-admin-textMuted leading-relaxed">
              <span className="text-admin-amber font-bold mr-1">Insight:</span>
              The current distribution rate shows optimal velocity. Focus manual entries on <strong className="text-admin-navy font-bold">Bgy. Commonwealth</strong> to resolve the remaining 31% pending cases.
            </div>
          </div>

          {/* MAP WIDGET */}
          <div className="bg-[#0f172a] rounded-[16px] h-32 overflow-hidden relative shadow-md flex items-center justify-center border border-slate-700">
            {/* Simulated Satellite Map BG */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/121.05,14.65,12/400x200?access_token=none')] bg-cover bg-center mix-blend-luminosity"></div>
            
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-admin-danger border-2 border-white shadow-[0_0_15px_rgba(239,68,68,1)] animate-pulse relative">
                <div className="absolute inset-0 rounded-full bg-admin-danger animate-ping opacity-75"></div>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-slate-700">Live Allocation Feed</span>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}
