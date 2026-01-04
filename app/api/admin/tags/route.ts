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

    // Get all tags with domain count using COALESCE for proper zero counts
    const tags = await executeQuery(`
      SELECT 
        t.id,
        t.name,
        t.color,
        t.status,
        t.created_at as createdAt,
        COALESCE(COUNT(dt.domain_id), 0) as domainCount
      FROM tags t
      LEFT JOIN domain_tags dt ON t.id = dt.tag_id
      GROUP BY t.id, t.name, t.color, t.status, t.created_at
      ORDER BY t.name ASC
    `)

    return NextResponse.json({
      success: true,
      tags: tags || []
    })

  } catch (error) {
    console.error('Admin tags error:', error)
    return NextResponse.json({ 
      error: 'Failed to load tags',
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

    const { name, color } = await request.json()
    
    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 })
    }

    // Check if tag name already exists
    const existingTag = await executeQuery(
      'SELECT id FROM tags WHERE name = ?',
      [name]
    ) as any[]

    if (existingTag.length > 0) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 400 })
    }

    // Insert new tag
    const result = await executeQuery(
      'INSERT INTO tags (name, color, status, created_at) VALUES (?, ?, ?, NOW())',
      [name, color, 'active']
    ) as any

    return NextResponse.json({
      success: true,
      message: 'Tag created successfully',
      tagId: result.insertId
    })

  } catch (error) {
    console.error('Create tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}