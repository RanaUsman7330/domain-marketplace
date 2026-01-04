// /app/layout.tsx - FINAL VERSION WITH ALL PROVIDERS
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { WatchlistProvider } from "@/contexts/WatchlistContext"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "DomainHub - Premium Domain Marketplace",
  description: "Buy and sell premium domain names",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        {/* Wrap entire app with all providers */}
        <AuthProvider>
          <CartProvider>
            <WatchlistProvider>
              {/* Navigation - This will appear on all pages */}
              <Navbar />
              
              {/* Main Content */}
              <main className="min-h-screen">
                {children}
              </main>
              
              {/* Footer - This will appear on all pages */}
              <Footer />
            </WatchlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}