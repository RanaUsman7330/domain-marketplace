// app/api/admin/seo/robots-txt/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// GET - Fetch robots.txt content
export async function GET() {
  try {
    // Check if table exists, if not create it
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS robots_txt (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Insert default if not exists
    await executeQuery(`
      INSERT IGNORE INTO robots_txt (id, content) VALUES (1, ?)
    `, [`# Default robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`])

    const [rows] = await executeQuery('SELECT content FROM robots_txt LIMIT 1') as any[]
    const content = rows?.[0]?.content || `# Default robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/sitemap.xml`

    return NextResponse.json({ success: true, content })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// POST - Update robots.txt content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (content === undefined) {
      return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 })
    }

    // Ensure table exists
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS robots_txt (
        id INT PRIMARY KEY AUTO_INCREMENT,
        content TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    // Update or insert content
    await executeQuery(`
      INSERT INTO robots_txt (id, content) VALUES (1, ?)
      ON DUPLICATE KEY UPDATE content = ?
    `, [content, content])

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}