'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WatchlistProvider } from '@/contexts/WatchlistContext'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WatchlistProvider>
          <Navbar /> {/* <-- Navbar inside AuthProvider */}
          <main className="min-h-screen">{children}</main>
          <Footer />
        </WatchlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
