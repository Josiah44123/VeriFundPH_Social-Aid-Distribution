import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"
import { VeriFundProvider } from "@/lib/store"
import { Suspense } from "react"
import type { Viewport } from "next"

export const metadata: Metadata = {
  title: 'VeriFund PH — Official Social Aid Distribution Platform',
  description: 'Siguruhing makakarating ang tulong sa tamang tao.',
}

export const viewport: Viewport = {
  themeColor: '#18269B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#18269B" />
      </head>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <VeriFundProvider>
          <main className="flex-1 flex flex-col w-full pb-[env(safe-area-inset-bottom)] relative">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </main>
          <Toaster />
        </VeriFundProvider>
      </body>
    </html>
  )
}
