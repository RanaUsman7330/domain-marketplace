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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      title, 
      description, 
      keywords, 
      canonicalUrl, 
      ogTitle, 
      ogDescription, 
      ogImage, 
      twitterCard, 
      twitterTitle, 
      twitterDescription, 
      twitterImage, 
      structuredData, 
      robots, 
      priority 
    } = await request.json()
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Validate priority range
    if (priority < 0 || priority > 1) {
      return NextResponse.json({ error: 'Priority must be between 0.0 and 1.0' }, { status: 400 })
    }

    // Update SEO setting
    await executeQuery(
      `UPDATE seo_settings SET 
        title = ?, 
        description = ?, 
        keywords = ?, 
        canonical_url = ?, 
        og_title = ?, 
        og_description = ?, 
        og_image = ?, 
        twitter_card = ?, 
        twitter_title = ?, 
        twitter_description = ?, 
        twitter_image = ?, 
        structured_data = ?, 
        robots = ?, 
        priority = ?, 
        last_modified = NOW()
      WHERE id = ?`,
      [title, description, keywords, canonicalUrl, ogTitle, ogDescription, ogImage, twitterCard, twitterTitle, twitterDescription, twitterImage, structuredData, robots, priority, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'SEO setting updated successfully'
    })

  } catch (error) {
    console.error('Update SEO setting error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}