"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Gift, ClipboardList, LogOut, ArrowLeft, Menu } from "lucide-react"
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

      {/* Sidebar — Light */}
      <aside className={cn(
        "w-[260px] shrink-0 flex flex-col z-40 fixed lg:relative inset-y-0 left-0 h-full transition-transform duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )} style={{ background: '#F4F7FA', borderRight: '1px solid rgba(0,0,0,0.04)' }}>
        
        {/* Sidebar top logo */}
        <div className="px-6 pt-7 pb-5 border-b border-black/5 bg-white">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="VeriFund" className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-lg font-extrabold text-[#001A5E] tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                VeriFund PH
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#001A5E]/60">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return isActive ? (
              <button
                key={item.name}
                onClick={() => { router.push(item.href); setIsSidebarOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#001A5E] rounded-xl text-white font-bold text-[14px] text-left shadow-md shadow-[#001A5E]/20"
              >
                <Icon className="w-5 h-5 text-white" />
                {item.name}
              </button>
            ) : (
              <button
                key={item.name}
                onClick={() => { router.push(item.href); setIsSidebarOpen(false) }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#001A5E]/70 font-semibold text-[14px] text-left hover:bg-[#001A5E]/10 hover:text-[#001A5E] transition-all"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </button>
            )
          })}
        </nav>

        {/* Sidebar bottom */}
        <div className="px-4 pb-5 pt-3 border-t border-black/5 flex flex-col gap-1">
          <button onClick={() => router.push('/admin/portal-selector')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#001A5E]/70 hover:bg-[#001A5E]/10 hover:text-[#001A5E] transition-all font-semibold text-sm">
            <ArrowLeft className="w-5 h-5" /> Portal Selector
          </button>
          <button onClick={() => {
              if (typeof window !== "undefined") sessionStorage.removeItem("verifund_user")
              router.push("/")
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-500/10 hover:text-red-700 transition-all font-semibold text-sm">
            <LogOut className="w-5 h-5" /> Mag-logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-[64px] bg-white border-b border-outline-variant/20 px-6 lg:px-8 flex items-center justify-between shrink-0"
          style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.9)' }}>
          
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-on-surface-variant">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-extrabold text-[18px] text-primary tracking-tight">{currentPage}</h2>
              <p className="text-[12px] text-outline font-medium">{today}</p>
            </div>
          </div>

          {/* Right: live badge + admin avatar */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-on-surface">Live</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-primary leading-tight">Admin</p>
                <p className="text-[11px] text-outline font-medium">QC District 1</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm flex items-center justify-center shadow-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 bg-surface">
          {children}
        </main>
      </div>
    </div>
  )
}
