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
    <div className="relative w-full max-w-[300px] mx-auto aspect-square bg-[color:var(--navy-deep)] rounded-[20px] overflow-hidden">
      {/* Target brackets with pulse animation */}
      <div className="absolute inset-4 z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[color:var(--ph-gold)] animate-pulse" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[color:var(--ph-gold)] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[color:var(--ph-gold)] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[color:var(--ph-gold)] animate-pulse" />
      </div>
      
      {/* Scanner Element */}
      <div id="reader" className="w-full h-full [&>video]:object-cover" />
    </div>
  )
}
