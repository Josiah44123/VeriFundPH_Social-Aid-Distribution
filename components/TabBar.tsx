"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TabItem {
  id: string
  label: string
  icon: LucideIcon
  href?: string
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (id: string) => void
  colorScheme?: "blue" | "red"
}

export function TabBar({ tabs, activeTab, onTabChange, colorScheme = "red" }: TabBarProps) {
  const activeColor = colorScheme === "blue" ? "text-[var(--navy)]" : "text-[var(--red)]"
  const activeDotBg = colorScheme === "blue" ? "bg-[var(--navy)]" : "bg-[var(--red)]"

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white pb-[env(safe-area-inset-bottom)] z-50 transition-shadow"
      style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
    >
      <div className="flex justify-around items-center h-[64px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button 
              key={tab.id} 
              onClick={() => onTabChange(tab.id)} 
              className="h-full flex-1 touch-manipulation transition-colors relative"
            >
              <div className="flex flex-col items-center justify-center w-full h-full gap-1 pt-[6px]">
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      layoutId="tab-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={cn("absolute top-0 w-[24px] h-[3px] rounded-full", activeDotBg)} 
                    />
                  )}
                </AnimatePresence>
                <tab.icon className={cn("w-6 h-6 transition-colors", isActive ? activeColor : "text-[var(--text-muted)]")} />
                <span className={cn("text-[11px] font-semibold transition-colors mt-[2px]", isActive ? activeColor : "text-[var(--text-muted)]")}>
                  {tab.label}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
