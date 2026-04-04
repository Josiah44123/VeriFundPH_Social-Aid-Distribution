"use client"

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  isScanning: boolean
}

export function QRScanner({ onScanSuccess, isScanning }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    if (!isScanning) {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
      return
    }

    const scanner = new Html5Qrcode("reader")
    scannerRef.current = scanner

    scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 220, height: 220 },
        aspectRatio: undefined
      },
      (decodedText) => {
        onScanSuccess(decodedText)
      },
      (errorMessage) => {
        // ignored for continuous scanning
      }
    ).catch(console.error)

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [isScanning, onScanSuccess])

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-xl"
        style={{ height: 'min(65vw, 340px)' }}>
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }} />
        
        {/* Target brackets */}
        <div className="absolute inset-[32px] z-20 pointer-events-none animate-[pulse_1.8s_ease-in-out_infinite]">
          <div className="absolute top-0 left-0 w-[48px] h-[48px] border-t-[3px] border-l-[3px] border-[#FFB800] rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-[48px] h-[48px] border-t-[3px] border-r-[3px] border-[#FFB800] rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-[48px] h-[48px] border-b-[3px] border-l-[3px] border-[#FFB800] rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-[48px] h-[48px] border-b-[3px] border-r-[3px] border-[#FFB800] rounded-br-lg" />
        </div>

        {/* Horizontal Scan Line */}
        <div className="absolute left-0 right-0 h-[3px] bg-[var(--red)] z-20 pointer-events-none shadow-[0_0_12px_var(--red)] animate-[scan_2s_linear_infinite]" />
        
        {/* Scanner Element */}
        <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full" />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(min(65vw, 340px)); }
            100% { transform: translateY(0); }
          }
        `}} />
      </div>
      <p className="text-xs text-on-surface-variant text-center font-medium mt-3">
        I-align ang QR sa loob ng frame
      </p>
    </div>
  )
}
