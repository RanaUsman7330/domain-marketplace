// app/layout.tsx - Fixed import error
import './globals.css'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'  // Fixed: was CartProvider
import { WatchlistProvider } from '@/contexts/WatchlistContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export async function generateMetadata() {
  return {
    title: 'Domain Marketplace',
    description: 'Buy and sell premium domains',
    keywords: 'domains, premium domains, domain marketplace',
    robots: 'index,follow',
    openGraph: {
      title: 'Domain Marketplace',
      description: 'Buy and sell premium domains',
      images: ['/og-image.jpg'],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Domain Marketplace',
      description: 'Buy and sell premium domains',
      images: ['/twitter-image.jpg'],
    },
  }
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light" />
      </head>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WatchlistProvider>
              <SettingsProvider>
                {children}
              </SettingsProvider>
            </WatchlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}