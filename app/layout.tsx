import "./globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { VeriFundProvider } from "@/lib/store"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
})

export const metadata: Metadata = {
  title: "VeriFund PH",
  description: "Official Government Platform for Social Aid Distribution",
}

import { Suspense } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(jakarta.variable, "font-sans")} suppressHydrationWarning>
      <body className="font-sans antialiased text-[color:var(--text-primary)] bg-[color:var(--surface-page)] selection:bg-[color:var(--ph-gold)] selection:text-[color:var(--text-on-gold)]">
        <VeriFundProvider>
          <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
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
