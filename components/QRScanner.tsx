"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { CameraOff } from "lucide-react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  isScanning: boolean
}

export function QRScanner({ onScanSuccess, isScanning }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const hasScannedRef = useRef(false)

  useEffect(() => {
    if (!isScanning) {
      hasScannedRef.current = false
      return
    }

    setCameraError(false)
    const scanner = new Html5Qrcode("reader")
    scannerRef.current = scanner

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: 1.0
      },
      (decodedText) => {
        // Stop scanner immediately after successful scan
        if (hasScannedRef.current) return
        hasScannedRef.current = true
        
        if (scannerRef.current?.isScanning) {
          scannerRef.current.stop().catch(() => {})
        }
        onScanSuccess(decodedText)
      },
      () => {}
    ).catch(() => {
      setCameraError(true)
    })

    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {})
        }
        try {
          scannerRef.current.clear()
        } catch {}
        scannerRef.current = null
      }
    }
  }, [isScanning, onScanSuccess])

  if (cameraError) {
    return (
      <div className="flex flex-col w-full items-center">
        <div className="w-full max-w-[230px] bg-surface-container-high rounded-3xl overflow-hidden aspect-square flex flex-col items-center justify-center p-6 text-center gap-3">
          <CameraOff className="w-10 h-10 text-outline" />
          <p className="text-sm font-bold text-on-surface-variant">Hindi pinayagan ang camera</p>
          <p className="text-xs text-outline">I-type na lang ang VF ID sa ibaba.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full items-center">
      {/* Fixed-size viewport container */}
      <div className="relative w-full max-w-[230px] bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-xl aspect-square">
        
        {/* Absolute-fill inner container */}
        <div className="absolute inset-0">
          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }} />
          
          {/* Target brackets */}
          <div className="absolute inset-[32px] z-20 pointer-events-none opacity-80">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-[2px] border-l-[2px] border-[#FFB800] rounded-tl-xl drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-[2px] border-r-[2px] border-[#FFB800] rounded-tr-xl drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[2px] border-l-[2px] border-[#FFB800] rounded-bl-xl drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[2px] border-r-[2px] border-[#FFB800] rounded-br-xl drop-shadow-[0_0_8px_rgba(255,184,0,0.5)]" />
          </div>
          
          {/* Scanning animation area */}
          <div className="absolute inset-[32px] pointer-events-none z-20 overflow-hidden rounded-xl">
            <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-tertiary to-transparent shadow-[0_0_15px_var(--tertiary)]" 
              style={{ animation: 'scanWave 2.2s ease-in-out infinite' }} />
          </div>
          
          {/* Scanner Element */}
          <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:scale-110" />
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scanWave {
            0% { top: 0; opacity: 0; }
            40% { opacity: 1; }
            60% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}} />
      </div>
      <p className="text-xs text-on-surface-variant text-center font-medium mt-4">
        I-align ang QR sa loob ng frame
      </p>
    </div>
  )
}
