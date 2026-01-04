import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const users = await executeQuery(
    'SELECT id, email, name, role FROM users WHERE email = ? AND role = ?',
    ['admin@example.com', 'admin']
  ) as any[]

  return users.length > 0 ? users[0] : null
}

function generateXMLSitemap(urls: Array<{
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}>) {
  const urlEntries = urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      <lastmod>${url.lastmod}</lastmod>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>
  `).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

    // Get all domains for sitemap
    const domains = await executeQuery(`
      SELECT 
        d.name,
        d.updated_at as updatedAt,
        c.priority,
        c.og_description as changefreq
      FROM domains d
      LEFT JOIN seo_settings c ON c.page = 'domains'
      WHERE d.status = 'available'
      ORDER BY d.created_at DESC
    `) as any[]

    // Get all static pages with SEO settings
    const pages = await executeQuery(`
      SELECT 
        page,
        last_modified as updatedAt,
        priority,
        og_description as changefreq
      FROM seo_settings 
      WHERE page NOT IN ('sitemap', 'robots.txt')
      ORDER BY priority DESC
    `) as any[]

    // Generate URLs for sitemap
    const urls = []

    // Add homepage
    urls.push({
      loc: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    })

    // Add static pages
    const pageUrls = {
      'home': '',
      'about': '/about',
      'contact': '/contact',
      'domains': '/domains',
      'how-it-works': '/how-it-works',
      'help-center': '/help-center',
      'faq': '/faq',
      'system-status': '/system-status'
    }

    pages.forEach(page => {
      const urlPath = pageUrls[page.page] || `/${page.page.replace('_', '-')}`
      urls.push({
        loc: `${baseUrl}${urlPath}`,
        lastmod: new Date(page.updatedAt).toISOString().split('T')[0],
        changefreq: page.changefreq || 'weekly',
        priority: page.priority || 0.5
      })
    })

    // Add domains
    domains.forEach(domain => {
      urls.push({
        loc: `${baseUrl}/domains/${domain.name}`,
        lastmod: new Date(domain.updatedAt).toISOString().split('T')[0],
        changefreq: domain.changefreq || 'weekly',
        priority: domain.priority || 0.7
      })
    })

    // Split into multiple sitemaps if needed (max 50,000 URLs per sitemap)
    const maxUrlsPerSitemap = 50000
    const sitemaps = []
    
    for (let i = 0; i < urls.length; i += maxUrlsPerSitemap) {
      const chunk = urls.slice(i, i + maxUrlsPerSitemap)
      const xmlContent = generateXMLSitemap(chunk)
      
      // Save to database or file system
      const sitemapName = i === 0 ? 'sitemap-main.xml' : `sitemap-${Math.floor(i / maxUrlsPerSitemap) + 1}.xml`
      
      await executeQuery(
        `INSERT INTO seo_settings (page, title, description, structured_data, last_modified) 
         VALUES (?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
         structured_data = ?, 
         last_modified = NOW()`,
        [sitemapName, `Sitemap ${Math.floor(i / maxUrlsPerSitemap) + 1}`, `Generated sitemap with ${chunk.length} URLs`, xmlContent, xmlContent]
      )
      
      sitemaps.push(sitemapName)
    }

    // Generate sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
`).join('')}
</sitemapindex>`

    // Save sitemap index
    await executeQuery(
      `INSERT INTO seo_settings (page, title, description, structured_data, last_modified) 
       VALUES ('sitemap.xml', 'Sitemap Index', 'Main sitemap index file', ?, NOW())
       ON DUPLICATE KEY UPDATE 
       structured_data = ?, 
       last_modified = NOW()`,
      [sitemapIndex, sitemapIndex]
    )

    return NextResponse.json({
      success: true,
      message: 'Sitemap generated successfully',
      sitemaps: sitemaps.length
    })

  } catch (error) {
    console.error('Generate sitemap error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}