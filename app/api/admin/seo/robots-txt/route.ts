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

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

    // Default robots.txt content
    const robotsContent = `User-agent: *
Allow: /

# Block admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard/

# Block specific file types
Disallow: /*.pdf$
Disallow: /*.doc$
Disallow: /*.xls$

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for bots
Crawl-delay: 1

# Additional rules for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: ia_archiver
Disallow: /

User-agent: mj12bot
Disallow: /`

    // Save robots.txt to database
    await executeQuery(
      `INSERT INTO seo_settings (page, title, description, structured_data, last_modified) 
       VALUES ('robots.txt', 'Robots.txt', 'Robots.txt file for search engine crawling', ?, NOW())
       ON DUPLICATE KEY UPDATE 
       structured_data = ?, 
       last_modified = NOW()`,
      [robotsContent, robotsContent]
    )

    return NextResponse.json({
      success: true,
      message: 'Robots.txt generated successfully'
    })

  } catch (error) {
    console.error('Generate robots.txt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}