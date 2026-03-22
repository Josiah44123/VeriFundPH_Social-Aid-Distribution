import "./globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta"
})

export const metadata: Metadata = {
  title: "VeriFund",
  description: "Official Government Platform for Social Aid Distribution",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(jakarta.variable, "font-sans")}>
      <body className="font-sans antialiased text-[color:var(--text-primary)] bg-[color:var(--surface)] selection:bg-[color:var(--ph-gold)] selection:text-black">
        <main className="min-h-screen pb-[env(safe-area-inset-bottom)]">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
