"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

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
  const activeColor = colorScheme === "blue" ? "text-[color:var(--ph-blue)]" : "text-[color:var(--ph-red)]"
  const activeDotBg = colorScheme === "blue" ? "bg-[color:var(--ph-blue)]" : "bg-[color:var(--ph-red)]"

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E4EF] pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex justify-around items-center h-[64px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          
          return (
            <button key={tab.id} onClick={() => onTabChange(tab.id)} className="h-full flex-1 touch-manipulation">
              <div className="flex flex-col items-center justify-center relative w-full h-full gap-1">
                {isActive && (
                  <div className={cn("absolute top-0 w-1 h-1 rounded-full", activeDotBg)} />
                )}
                <tab.icon className={cn("w-5 h-5 transition-colors", isActive ? activeColor : "text-gray-400")} />
                <span className={cn("text-[10px] font-medium transition-colors", isActive ? activeColor : "text-gray-400")}>
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
