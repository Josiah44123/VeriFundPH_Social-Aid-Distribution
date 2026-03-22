"use client"

import { 
  UserPlus, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal
} from "lucide-react"

const beneficiaries = [
  { id: 1, name: "Ricardo Santos", location: "Brgy. 477, Santa Mesa, Manila", status: "verified", img: "RS" },
  { id: 2, name: "Maria Clara", location: "Poblacion, Makati City", status: "verified", img: "MC" },
  { id: 3, name: "Antonio Luna", location: "Binondo District, Manila", status: "disbursed", img: "AL" },
  { id: 4, name: "Teresa Magbanua", location: "Jam, Iloilo City", status: "verified", img: "TM" },
  { id: 5, name: "Juan Dela Cruz", location: "Sagpon, Central Visayas", status: "pending", img: "JD" },
  { id: 6, name: "Leonor Rivera", location: "Dagupan, Pangasinan", status: "verified", img: "LR" },
  { id: 7, name: "Jose Rizal", location: "Calamba, Laguna", status: "disbursed", img: "JR" },
  { id: 8, name: "Melchora Aquino", location: "Novaliches, Quezon City", status: "action_needed", img: "MA", alert: true },
]

export default function MasterLedger() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-[14px] text-admin-textMuted font-medium leading-relaxed">
            Managing the central registry of verified beneficiaries for national fund distribution. Authenticate and review social welfare profiles.
          </p>
        </div>
        <button className="primary-btn bg-admin-navy text-white px-5 flex items-center gap-2 w-fit">
          <UserPlus className="w-5 h-5" />
          Enroll New
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button className="px-5 py-2.5 rounded-full bg-admin-navy text-white text-[13px] font-bold shadow-sm whitespace-nowrap">
          All Members
        </button>
        <button className="px-5 py-2.5 rounded-full bg-white text-admin-textMuted hover:text-admin-navy hover:bg-admin-bg border border-admin-border text-[13px] font-semibold transition-colors whitespace-nowrap">
          Pending Review
        </button>
        <button className="px-5 py-2.5 rounded-full bg-white text-admin-textMuted hover:text-admin-navy hover:bg-admin-bg border border-admin-border text-[13px] font-semibold transition-colors whitespace-nowrap">
          Verified
        </button>
        <button className="px-5 py-2.5 rounded-full bg-white text-admin-textMuted hover:text-admin-navy hover:bg-admin-bg border border-admin-border text-[13px] font-semibold transition-colors whitespace-nowrap">
          Disbursed
        </button>
      </div>

      {/* BENEFICIARY GRID (2x4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {beneficiaries.map((b) => (
          <div key={b.id} className="bg-white rounded-[16px] p-6 shadow-sm border border-admin-border hover:shadow-md transition-all flex flex-col items-center relative group">
            
            {/* Alert Dot */}
            {b.alert && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-admin-danger rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
            )}
            
            {/* Profile Circle (Simulated Image) */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-admin-bg to-admin-border mb-4 flex items-center justify-center text-[22px] font-bold text-admin-navy/40 shadow-inner overflow-hidden relative">
              {/* Fake Photo Effect */}
              <div className="absolute inset-0 bg-admin-navy/5 mix-blend-multiply"></div>
              {b.img}
            </div>
            
            <h4 className="text-[16px] font-bold text-admin-text text-center mb-1 group-hover:text-admin-navy transition-colors">
              {b.name}
            </h4>
            
            <div className="flex items-center justify-center gap-1.5 text-admin-textMuted mb-6">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[12px] font-medium text-center line-clamp-1">{b.location}</span>
            </div>
            
            <div className="mt-auto w-full">
              <button className="w-full py-2.5 rounded-xl border-2 border-admin-border text-admin-navy text-[13px] font-bold hover:bg-admin-navy hover:border-admin-navy hover:text-white transition-all">
                More Info
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-admin-border mt-4 gap-4">
        <span className="text-[13px] font-medium text-admin-textMuted">
          Showing <strong className="text-admin-navy">8</strong> of <strong className="text-admin-navy">2,451</strong> beneficiaries
        </span>
        
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-admin-bg text-admin-textMuted transition-colors border border-transparent hover:border-admin-border">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-admin-navy text-white text-[13px] font-bold shadow-sm">
            1
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-admin-bg text-admin-textMuted text-[13px] font-medium transition-colors border border-transparent hover:border-admin-border">
            2
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-admin-bg text-admin-textMuted text-[13px] font-medium transition-colors border border-transparent hover:border-admin-border">
            3
          </button>
          <div className="w-9 h-9 flex items-center justify-center text-admin-textMuted">
            <MoreHorizontal className="w-4 h-4" />
          </div>
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-admin-bg text-admin-textMuted text-[13px] font-medium transition-colors border border-transparent hover:border-admin-border">
            42
          </button>
          
          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-admin-bg text-admin-textMuted transition-colors border border-transparent hover:border-admin-border">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
    </div>
  )
}
