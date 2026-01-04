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

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all SEO settings
    const settings = await executeQuery(`
      SELECT 
        id,
        page,
        title,
        description,
        keywords,
        canonical_url as canonicalUrl,
        og_title as ogTitle,
        og_description as ogDescription,
        og_image as ogImage,
        twitter_card as twitterCard,
        twitter_title as twitterTitle,
        twitter_description as twitterDescription,
        twitter_image as twitterImage,
        structured_data as structuredData,
        robots,
        priority,
        last_modified as lastModified
      FROM seo_settings
      ORDER BY priority DESC, page ASC
    `)

    return NextResponse.json({
      success: true,
      settings: settings || []
    })

  } catch (error) {
    console.error('Admin SEO settings error:', error)
    return NextResponse.json({ 
      error: 'Failed to load SEO settings',
      success: false 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { page, title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage, structuredData, robots, priority } = await request.json()
    
    if (!page || !title) {
      return NextResponse.json({ error: 'Page and title are required' }, { status: 400 })
    }

    // Check if page already exists
    const existingPage = await executeQuery(
      'SELECT id FROM seo_settings WHERE page = ?',
      [page]
    ) as any[]

    if (existingPage.length > 0) {
      return NextResponse.json({ error: 'SEO settings for this page already exist' }, { status: 400 })
    }

    // Insert new SEO setting
    const result = await executeQuery(
      `INSERT INTO seo_settings (
        page, title, description, keywords, canonical_url, og_title, og_description, og_image,
        twitter_card, twitter_title, twitter_description, twitter_image, structured_data, robots, priority, last_modified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [page, title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage, structuredData, robots, priority]
    ) as any

    return NextResponse.json({
      success: true,
      message: 'SEO setting created successfully',
      settingId: result.insertId
    })

  } catch (error) {
    console.error('Create SEO setting error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}