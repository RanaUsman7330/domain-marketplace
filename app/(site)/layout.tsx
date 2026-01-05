import { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SiteProviders from './SiteProviders'
import { getConnection } from '@/lib/mysql-db'
import Head from 'next/head'

interface SiteLayoutProps {
  children: ReactNode
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  // Default SEO
  let seo = {
    title: 'Domain Marketplace',
    description: 'Buy and sell domains',
    keywords: 'domains',
    robots: 'index,follow',
  }

  try {
    const connection = getConnection()
    const [rows] = await connection.execute(
      'SELECT * FROM seo_settings WHERE page = ?',
      ['/domains'] // or use dynamic route logic here
    )
    if (rows[0]) seo = rows[0] as any
  } catch (err) {
    console.error('SEO fetch error:', err)
  }

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta name="keywords" content={seo.keywords || 'domains'} />
        <meta name="robots" content={seo.robots || 'index,follow'} />
      </Head>

      <SiteProviders>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </SiteProviders>
    </>
  )
}
