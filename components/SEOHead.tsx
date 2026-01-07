// components/SEOHead.tsx
import { getConnection } from '@/lib/mysql-db'

interface SEOData {
  title: string
  description: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  structuredData?: string
  canonicalUrl?: string
  robots?: string
}

export async function getSEOData(pagePath: string): Promise<SEOData> {
  try {
    const connection = getConnection()
    
    // Handle dynamic routes
    let seoPageKey = pagePath
    if (pagePath.startsWith('/domains/')) {
      seoPageKey = '/domains/[id]'
    }

    const [rows] = await connection.execute(
      'SELECT * FROM seo_settings WHERE page = ?',
      [seoPageKey]
    )

    const seo = rows[0] as any
    
    return {
      title: seo?.title || 'Domain Marketplace',
      description: seo?.description || 'Buy and sell premium domains',
      keywords: seo?.keywords || 'domains, premium domains, domain marketplace',
      ogTitle: seo?.og_title || seo?.title,
      ogDescription: seo?.og_description || seo?.description,
      ogImage: seo?.og_image || '/og-image.jpg',
      twitterCard: seo?.twitter_card || 'summary_large_image',
      twitterTitle: seo?.twitter_title || seo?.title,
      twitterDescription: seo?.twitter_description || seo?.description,
      twitterImage: seo?.twitter_image || '/twitter-image.jpg',
      structuredData: seo?.structured_data,
      canonicalUrl: seo?.canonical_url,
      robots: seo?.robots || 'index,follow'
    }
  } catch (error) {
    console.error('SEO data fetch error:', error)
    return {
      title: 'Domain Marketplace',
      description: 'Buy and sell premium domains',
      keywords: 'domains, premium domains, domain marketplace',
      robots: 'index,follow'
    }
  }
}