// app/(site)/domains/layout.tsx - FIXED SYNTAX
import { Metadata } from 'next'
import { executeQuery } from '@/lib/mysql-db'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rows = await executeQuery(
      'SELECT * FROM seo_settings WHERE page_name = ?',
      ['/domains']
    ) as any[]

    if (rows && rows.length > 0) {
      const seo = rows[0]
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        robots: seo.robots || 'index,follow',
        openGraph: {
          title: seo.title,
          description: seo.description,
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: seo.title,
          description: seo.description,
        }
      }
    }
  } catch (error) {
    console.error('❌ Domains page SEO error:', error)
  }

  return {
    title: 'Browse Domains - Domain Marketplace',
    description: 'Browse our collection of premium domains',
  }
}

export default function DomainsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  console.log('🔄 DomainsLayout rendering with full page structure...');
  return <>{children}</>; {/* REMOVE COMMENT - Just return children */}
}