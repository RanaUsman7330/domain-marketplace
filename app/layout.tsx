// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

// ✅ Import DB helper
import { getConnection } from '@/lib/mysql-db'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// ==================== SEO Metadata ====================
export async function generateMetadata({ params, searchParams, pathname }: any) {
  try {
    // Fallback in case pathname undefined
    const pageKey = pathname || '/'

    // Skip admin pages
    if (pageKey.startsWith('/admin')) {
      return { title: 'Admin Panel' }
    }

    const connection = getConnection()

    // Handle dynamic routes like /domains/[id]
    let seoPageKey = pageKey
    if (pageKey.startsWith('/domains/') && !pageKey.includes('[id]')) {
      seoPageKey = '/domains/[id]'
    }

    const [rows] = await connection.execute(
      'SELECT * FROM seo_settings WHERE page = ?',
      [seoPageKey]
    )

    const seo = rows[0] as any

    return {
      title: seo?.title || 'Domain Marketplace',
      description: seo?.description || 'Buy and sell domains',
      keywords: seo?.keywords || 'domains',
      robots: seo?.robots || 'index,follow',
    }
  } catch (err) {
    console.error('SEO metadata fetch error:', err)
    return {
      title: 'Domain Marketplace',
      description: 'Buy and sell domains',
      keywords: 'domains',
      robots: 'index,follow',
    }
  }
}

// ==================== Root Layout ====================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        {children} {/* ONLY render children, no Navbar / Auth */}
      </body>
    </html>
  )
}
