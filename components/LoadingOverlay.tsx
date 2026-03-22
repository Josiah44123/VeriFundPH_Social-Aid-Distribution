"use client"

import { Loader2 } from "lucide-react"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = "Nagloload..." }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4 max-w-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-[color:var(--ph-blue)]" />
        <span className="text-sm font-semibold">{message}</span>
      </div>
    </div>
  )
}
