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
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
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
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full max-w-[280px] aspect-square bg-[#1C1C1E] rounded-[20px] overflow-hidden shadow-[var(--shadow-lg)] mb-[12px]">
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }} />
        
        {/* Target brackets */}
        <div className="absolute inset-[24px] z-20 pointer-events-none animate-[pulse_1.8s_ease-in-out_infinite]">
          <div className="absolute top-0 left-0 w-[40px] h-[40px] border-t-[3px] border-l-[3px] border-[#FFB800]" />
          <div className="absolute top-0 right-0 w-[40px] h-[40px] border-t-[3px] border-r-[3px] border-[#FFB800]" />
          <div className="absolute bottom-0 left-0 w-[40px] h-[40px] border-b-[3px] border-l-[3px] border-[#FFB800]" />
          <div className="absolute bottom-0 right-0 w-[40px] h-[40px] border-b-[3px] border-r-[3px] border-[#FFB800]" />
        </div>

        {/* Horizontal Scan Line */}
        <div className="absolute left-0 right-0 h-[2px] bg-[var(--red)] z-20 pointer-events-none shadow-[0_0_8px_var(--red)] animate-[scan_2s_linear_infinite]" />
        
        {/* Scanner Element */}
        <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:scale-105" />

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { transform: translateY(0); }
            50% { transform: translateY(280px); }
            100% { transform: translateY(0); }
          }
        `}} />
      </div>
      <p className="text-[12px] text-[var(--text-muted)] text-center font-medium">
        I-align ang QR sa loob ng frame
      </p>
    </div>
  )
}
