'use client'
import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WatchlistProvider } from '@/contexts/WatchlistContext'

interface Props {
  children: ReactNode
}

export default function SiteProviders({ children }: Props) {
  return (
    <AuthProvider>
      <CartProvider>
        <WatchlistProvider>{children}</WatchlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
