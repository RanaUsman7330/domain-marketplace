// File: /app/api/admin/categories/route.ts - FIXED VERSION

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from request (basic auth check)
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  // For now, we'll do basic validation - you can enhance this later
  return { id: 1, role: 'admin' } // Mock admin for now
}

// GET: Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fixed query - removed slug and parent_id references
    const query = `
      SELECT 
        c.id,
        c.name,
        c.description,
        c.created_at as createdAt,
        c.updated_at as updatedAt,
        CASE 
          WHEN c.status = 1 THEN 'active'
          ELSE 'inactive'
        END as status,
        COUNT(dc.domain_id) as domainCount
      FROM categories c
      LEFT JOIN domain_categories dc ON c.id = dc.category_id
      GROUP BY c.id, c.name, c.description, c.created_at, c.updated_at, c.status
      ORDER BY c.name ASC
    `

    const categories = await executeQuery(query)
    
    // Transform to match frontend expectations
    const transformedCategories = (categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description || '',
      domainCount: Number(cat.domainCount) || 0,
      createdAt: cat.createdAt,
      status: cat.status || 'active'
    }))
    
    return NextResponse.json({
      success: true,
      categories: transformedCategories
    })

  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: Create new category
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if name already exists (no slug needed)
    const existing = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    )

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      )
    }

    // Fixed query - removed slug and parent_id, status defaults to 1
    const query = `
      INSERT INTO categories (name, description, created_at, updated_at, status)
      VALUES (?, ?, NOW(), NOW(), 1)
    `

    const result = await executeQuery(query, [name, description || ''])

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: {
        id: result.insertId,
        name,
        description: description || '',
        domainCount: 0,
        status: 'active'
      }
    })

  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT: Update category
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, name, description } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const existing = await executeQuery(
      'SELECT id FROM categories WHERE id = ?',
      [id]
    )

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if name already exists for another category
    const nameExists = await executeQuery(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, id]
    )
    
    if (nameExists && nameExists.length > 0) {
      return NextResponse.json(
        { error: 'Another category with this name already exists' },
        { status: 409 }
      )
    }

    // Fixed query - only update name and description
    const query = `
      UPDATE categories 
      SET 
        name = ?,
        description = ?,
        updated_at = NOW()
      WHERE id = ?
    `

    await executeQuery(query, [name, description || '', id])

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully'
    })

  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Alternative: Let me also update the main DELETE route to handle the format your frontend is using
// File: /app/api/admin/categories/route.ts - Updated DELETE method

// Simplify the main DELETE route to avoid conflicts
// File: /app/api/admin/categories/route.ts - Simplified DELETE

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only use query parameters for the main route
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log('Main DELETE route - Category ID from query:', id)

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required as query parameter' },
        { status: 400 }
      )
    }

    // Use the same logic as the dynamic route
    const existing = await executeQuery(
      'SELECT id, name FROM categories WHERE id = ?',
      [id]
    )

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    const hasDomains = await executeQuery(
      'SELECT COUNT(*) as count FROM domain_categories WHERE category_id = ?',
      [id]
    )

    if (hasDomains && hasDomains[0].count > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete category with associated domains',
          message: `This category has ${hasDomains[0].count} domain(s) associated with it.`
        },
        { status: 409 }
      )
    }

    const deleteResult = await executeQuery('DELETE FROM categories WHERE id = ?', [id])
    
    if (deleteResult.affectedRows === 0) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
      deletedId: id
    })

  } catch (error) {
    console.error('Main DELETE route error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}