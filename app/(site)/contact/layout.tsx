// app/(site)/contact/layout.tsx
import { Metadata } from 'next'
import { executeQuery } from '@/lib/mysql-db'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const rows = await executeQuery(
      'SELECT * FROM seo_settings WHERE page_name = ?',
      ['/contact']
    ) as any[]

    if (rows && rows.length > 0) {
      const seo = rows[0]
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        robots: seo.robots || 'index,follow',
      }
    }
  } catch (error) {
    console.error('❌ Contact page SEO error:', error)
  }

  return {
    title: 'Contact Us - Domain Marketplace',
    description: 'Get in touch with us',
  }
}

export default function ContactLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <>{children}</>
}