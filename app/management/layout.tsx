"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Gift, ClipboardList, LogOut, Star, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Dashboard", href: "/management/dashboard", icon: LayoutDashboard },
  { name: "Benepisyaryo", href: "/management/beneficiaries", icon: Users },
  { name: "Distribusyon", href: "/management/distributions", icon: Gift },
  { name: "Audit Log", href: "/management/audit-log", icon: ClipboardList },
]

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (pathname === "/management/login") {
    return <>{children}</>
  }

  const currentPage = navItems.find(n => n.href === pathname)?.name ?? "Management System"

  const today = new Intl.DateTimeFormat("en-PH", {
    weekday: "short", month: "short", day: "numeric", year: "numeric"
  }).format(new Date())

  return (
    <div className="flex h-screen bg-[var(--surface-page)] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={cn(
          "w-[260px] shrink-0 flex flex-col z-40 shadow-xl transition-transform duration-300 fixed lg:relative inset-y-0 left-0 lg:translate-x-0 h-full",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        style={{ background: 'linear-gradient(to bottom, #0D1966, #18269B)' }}
      >
        {/* Logo area */}
        <div className="px-[24px] pt-[28px] pb-[8px] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-[10px] mb-[4px]">
              <Star className="w-[20px] h-[20px] text-[#FFB800] fill-[#FFB800] shrink-0" />
              <p className="text-white font-extrabold text-[18px] leading-tight tracking-tight">VeriFund PH</p>
            </div>
            <p className="text-[#FFB800] text-[10px] font-bold uppercase tracking-[0.15em] ml-[30px]">Management System</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60 p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-white/10 mx-[20px] my-[16px]" />

        {/* Nav Items */}
        <nav className="flex-1 px-[16px] py-[4px] flex flex-col gap-[4px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <button
                key={item.name}
                onClick={() => { router.push(item.href); setIsSidebarOpen(false) }}
                className={cn(
                  "w-full flex items-center gap-[14px] px-[16px] py-[14px] rounded-[10px] text-left transition-all duration-200 relative group overflow-hidden",
                  isActive
                    ? "text-white font-bold bg-white/[0.15]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.08] font-medium"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-[8px] bottom-[8px] w-[3px] bg-[#FFB800] rounded-r-full" />
                )}
                <Icon className={cn("w-[20px] h-[20px] shrink-0 relative z-10 transition-colors", isActive ? "text-[#FFB800]" : "group-hover:text-white/80")} />
                <span className="text-[14px] relative z-10">{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="px-[16px] pb-[20px] pt-[8px] flex flex-col gap-[4px]">
          <button
            onClick={() => router.push("/admin/portal-selector")}
            className="w-full flex items-center gap-[14px] px-[16px] py-[12px] rounded-[10px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all text-left"
          >
            <ArrowLeft className="w-[20px] h-[20px] shrink-0" />
            <span className="text-[14px] font-medium">Portal Selector</span>
          </button>
          <button
            onClick={() => {
              if (typeof window !== "undefined") sessionStorage.removeItem("verifund_user")
              router.push("/")
            }}
            className="w-full flex items-center gap-[14px] px-[16px] py-[12px] rounded-[10px] text-white/60 hover:text-[#FF4D6D] hover:bg-[#FF0048]/10 transition-all text-left"
          >
            <LogOut className="w-[20px] h-[20px] shrink-0" />
            <span className="text-[14px] font-medium">Mag-logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-[64px] bg-white border-b border-[rgba(0,0,0,0.04)] px-[16px] lg:px-[32px] flex items-center justify-between shrink-0 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-[12px]">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[var(--text-secondary)]"
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-[var(--text-primary)] font-bold text-[18px] lg:text-[20px] tracking-[-0.3px] truncate max-w-[150px] sm:max-w-none">
                {currentPage}
              </h2>
              <p className="text-[11px] lg:text-[13px] text-[var(--text-muted)] font-medium -mt-[1px]">{today}</p>
            </div>
          </div>
          <div className="flex items-center gap-[8px] lg:gap-[16px]">
            <div className="hidden sm:flex items-center gap-[8px] text-[12px] lg:text-[13px] text-[var(--text-muted)] bg-[var(--surface-input)] px-[12px] py-[6px] rounded-full">
              <div className="w-[8px] h-[8px] rounded-full bg-[var(--success)] animate-pulse" />
              <span className="font-bold whitespace-nowrap">● Live</span>
            </div>
            <div className="hidden sm:block w-[1px] h-[24px] bg-[#E8ECF7]" />
            <div className="flex items-center gap-[10px] lg:gap-[12px]">
              <div className="text-right hidden md:block">
                <p className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">Admin</p>
                <p className="text-[12px] font-medium text-[var(--text-muted)]">QC District 1</p>
              </div>
              <div className="w-[36px] h-[36px] lg:w-[40px] lg:h-[40px] rounded-full bg-[var(--navy)] text-white font-bold text-[13px] lg:text-[14px] flex items-center justify-center shadow-[var(--shadow-sm)]">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-[32px]">
          {children}
        </main>
      </div>
    </div>
  )
}
