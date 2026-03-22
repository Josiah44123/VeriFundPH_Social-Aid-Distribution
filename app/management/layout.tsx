"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Gift, ClipboardList, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/management/dashboard", icon: LayoutDashboard },
  { name: "Benepisyaryo", href: "/management/beneficiaries", icon: Users },
  { name: "Distribusyon", href: "/management/distributions", icon: Gift },
  { name: "Audit Log", href: "/management/audit-log", icon: ClipboardList },
]

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === "/management/login") {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-[var(--surface-page)] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 flex flex-col z-20 shadow-xl" style={{ background: 'linear-gradient(180deg, #001A5E 0%, #002985 100%)' }}>
        
        {/* Logo area */}
        <div className="px-[20px] pt-[28px] pb-[24px] border-b border-white/10">
          <div className="flex items-center gap-[10px] mb-[4px]">
            <div className="w-[32px] h-[32px] rounded-lg flex items-center justify-center" style={{ background: 'rgba(252,209,22,0.2)' }}>
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-[var(--ph-gold)]">
                <path d="M12 2l1.5 5.5L19 6l-4 4 5.5 2.5-5.5 1.5L16 19.5 12 15l-4 4.5 1-5.5L3.5 12.5 9 11 5 7l5.5 1.5z"/>
              </svg>
            </div>
            <div>
              <p className="text-white font-extrabold text-[15px] leading-tight">VeriFund PH</p>
              <p className="text-[var(--ph-gold)] text-[10px] font-bold uppercase tracking-widest leading-tight">Management System</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-[12px] py-[16px] flex flex-col gap-[4px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={cn(
                  "w-full flex items-center gap-[12px] px-[12px] py-[10px] rounded-[10px] text-left transition-all duration-150 relative",
                  isActive
                    ? "text-[var(--ph-gold)] font-bold"
                    : "text-white/60 hover:text-white hover:bg-white/5 font-medium"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-[3px] bg-[var(--ph-gold)] rounded-r-full" />
                )}
                {isActive && (
                  <div className="absolute inset-0 rounded-[10px]" style={{ background: 'rgba(252,209,22,0.08)' }} />
                )}
                <Icon className={cn("w-[18px] h-[18px] shrink-0 relative z-10", isActive ? "text-[var(--ph-gold)]" : "")} />
                <span className="text-[14px] relative z-10">{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-[12px] pb-[20px] border-t border-white/10 pt-[12px]">
          <div className="px-[12px] py-[8px] mb-[4px]">
            <p className="text-white text-[13px] font-bold truncate">LGU Admin</p>
            <p className="text-white/50 text-[11px]">admin@lgu-qc.gov.ph</p>
          </div>
          <button
            onClick={() => {
              if (typeof window !== "undefined") sessionStorage.removeItem("mgmt_auth")
              router.push("/management/login")
            }}
            className="w-full flex items-center gap-[12px] px-[12px] py-[10px] rounded-[10px] text-white/60 hover:text-white hover:bg-white/5 transition-all text-left"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <span className="text-[14px] font-medium">Mag-logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-[60px] bg-white border-b border-[#E2E8F0] px-[24px] flex items-center justify-between shrink-0 shadow-sm">
          <div>
            <h2 className="text-[var(--text-primary)] font-bold text-[16px]">
              {navItems.find(n => n.href === pathname)?.name ?? "Management System"}
            </h2>
          </div>
          <div className="flex items-center gap-[8px] text-[13px] text-[var(--text-muted)]">
            <div className="w-[8px] h-[8px] rounded-full bg-[var(--success)] animate-pulse" />
            <span className="font-medium">Live</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-[24px]">
          {children}
        </main>
      </div>
    </div>
  )
}
