// app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { WatchlistProvider } from "@/contexts/WatchlistContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <WatchlistProvider>
              {children}
            </WatchlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
