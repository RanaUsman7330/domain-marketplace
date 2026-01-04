import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from request
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

    // Get all categories with domain count
    const categories = await executeQuery(`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.status,
        c.created_at as createdAt,
        COALESCE(COUNT(d.id), 0) as domainCount
      FROM categories c
      LEFT JOIN domains d ON c.id = d.category_id
      GROUP BY c.id, c.name, c.description, c.status, c.created_at
      ORDER BY c.name ASC
    `)

    return NextResponse.json({
      success: true,
      categories: categories || []
    })

  } catch (error) {
    console.error('Admin categories error:', error)
    return NextResponse.json({ 
      error: 'Failed to load categories',
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

    const { name, description } = await request.json()
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Check if category name already exists
    const existingCategory = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    ) as any[]

    if (existingCategory.length > 0) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Insert new category
    const result = await executeQuery(
      'INSERT INTO categories (name, description, status, created_at) VALUES (?, ?, ?, NOW())',
      [name, description, 'active']
    ) as any

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.insertId
    })

  } catch (error) {
    console.error('Create category error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}