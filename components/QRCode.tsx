"use client"

import { QRCodeCanvas } from "qrcode.react"

interface QRCodeProps {
  value: string
  size?: number
  id?: string
}

export function QRCode({ value, size = 180, id = "qr-code" }: QRCodeProps) {
  return (
    <div className="p-4 bg-white rounded-xl flex items-center justify-center">
      <QRCodeCanvas
        id={id}
        value={value}
        size={size}
        level="H"
        includeMargin={true}
        className="w-full h-auto max-w-[180px]"
      />
    </div>
  )
}
