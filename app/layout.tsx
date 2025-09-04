import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth"
import { InstallPrompt } from "@/components/pwa/install-prompt"
import { PWAProvider } from "@/components/pwa/pwa-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "EventHub - Event Registration Platform",
  description: "Discover and register for amazing events. Built as a Progressive Web App.",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#0066FF",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EventHub",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        <PWAProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              {children}
              <InstallPrompt />
              <Analytics />
            </Suspense>
          </AuthProvider>
        </PWAProvider>
      </body>
    </html>
  )
}
