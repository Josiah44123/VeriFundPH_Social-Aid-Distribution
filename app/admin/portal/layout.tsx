"use client"

import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Map, 
  ShieldAlert,
  MapPin,
  Search,
  Bell,
  Settings,
  User as UserIcon
} from "lucide-react"

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: "Dashboard", href: "/admin/portal", icon: LayoutDashboard },
    { name: "Mga Benepisyaryo", href: "/admin/portal/beneficiaries", icon: Users },
    { name: "Distributions", href: "/admin/portal/distributions", icon: Map },
    { name: "Audit Log", href: "/admin/portal/audit", icon: ShieldAlert },
  ]

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin/portal": return "Admin Dashboard"
      case "/admin/portal/beneficiaries": return "Master Ledger"
      case "/admin/portal/distributions": return "Distributions Control Center"
      case "/admin/portal/audit": return "System Audit Ledger"
      default: return "Admin Portal"
    }
  }

  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-[160px] bg-admin-navy flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Logo Area */}
          <div className="p-4 pt-6 pb-8 flex flex-col items-center border-b border-white/10">
            <h1 className="text-white font-bold text-[16px] leading-tight text-center">
              VeriFund PH
            </h1>
            <span className="text-admin-amber text-[10px] font-bold uppercase tracking-widest mt-1">
              Admin Portal
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 gap-2 flex flex-col mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-white text-admin-navy shadow-md" 
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1.5" />
                  <span className={`text-[10px] text-center leading-tight ${isActive ? "font-bold" : "font-medium"}`}>
                    {item.name}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Profile */}
        <div className="p-4 border-t border-white/10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-admin-amber text-admin-navy flex items-center justify-center font-bold text-sm mb-2">
            RM
          </div>
          <span className="text-white font-bold text-[11px] text-center w-full truncate">Ricardo M.</span>
          <span className="text-white/60 text-[9px] text-center mt-0.5">District III Head</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* TOPBAR */}
        <header className="h-[72px] bg-white border-b border-admin-border flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          {/* Left: Title & Location */}
          <div className="flex items-center gap-6">
            <h2 className="text-admin-text text-[22px] font-bold">
              {getPageTitle()}
            </h2>
            <div className="hidden md:flex items-center gap-1.5 text-admin-textMuted bg-admin-bg px-3 py-1.5 rounded-full border border-admin-border/60">
              <MapPin className="w-4 h-4 text-admin-textMuted" />
              <span className="text-[12px] font-semibold">Quezon City, PH</span>
            </div>
          </div>

          {/* Right: Search, Actions, Profile */}
          <div className="flex items-center gap-5">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="w-4 h-4 text-admin-textMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search entities..." 
                className="pl-9 pr-4 py-2 w-[240px] bg-admin-bg border border-admin-border rounded-full text-[13px] font-medium outline-none focus:ring-2 focus:ring-admin-navy/20 transition-all"
              />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full hover:bg-admin-bg flex items-center justify-center text-admin-textMuted transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-admin-danger rounded-full border border-white"></span>
              </button>
              <button className="w-10 h-10 rounded-full hover:bg-admin-bg flex items-center justify-center text-admin-textMuted transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            <div className="w-px h-8 bg-admin-border mx-1"></div>

            {/* Topbar Avatar */}
            <button className="w-10 h-10 rounded-full bg-admin-text/5 flex items-center justify-center border border-admin-border hover:border-admin-navy transition-colors">
              <UserIcon className="w-5 h-5 text-admin-text" />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8 relative scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  )
}
