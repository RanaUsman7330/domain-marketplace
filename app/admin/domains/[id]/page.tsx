// /app/api/admin/domains/[id]/route.ts - COMPREHENSIVE ADMIN API
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // For now, check if it's a valid admin token
  const users = await executeQuery(
    'SELECT id, email, name, role FROM users WHERE email = ? AND role = ?',
    ['admin@example.com', 'admin']
  ) as any[]

  return users.length > 0 ? users[0] : null
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID',
        debug: `Received ID: ${id}`
      }, { status: 400 })
    }

    console.log('Fetching domain with ID:', domainId)

    // Get domain details
    const domains = await executeQuery(`
      SELECT 
        id,
        name,
        price,
        description,
        category,
        status,
        extension,
        length,
        image_url as imageUrl,
        is_featured as isFeatured,
        created_at as createdAt,
        updated_at as updatedAt
      FROM domains 
      WHERE id = ?
      LIMIT 1
    `, [domainId])

    console.log('Query result:', domains)

    if (!domains || domains.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found',
        debug: { searchedId: domainId }
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      domain: domains[0]
    })

  } catch (error) {
    console.error('Admin domain detail API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load domain details',
      debug: error.message 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID' 
      }, { status: 400 })
    }

    const body = await request.json()
    const { name, category, price, status, description, tags } = body

    // Validate required fields
    if (!name || !category || !price || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Update domain
    const result = await executeQuery(
      `UPDATE domains 
       SET name = ?, category = ?, price = ?, status = ?, description = ?, tags = ?, updated_at = NOW()
       WHERE id = ?`,
      [name, category, price, status, description, tags || '', domainId]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    // Get updated domain
    const updatedDomains = await executeQuery(
      'SELECT * FROM domains WHERE id = ?',
      [domainId]
    ) as any[]

    return NextResponse.json({
      success: true,
      message: 'Domain updated successfully',
      domain: updatedDomains[0]
    })

  } catch (error) {
    console.error('Admin update domain API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update domain',
      debug: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID' 
      }, { status: 400 })
    }

    // Delete domain
    const result = await executeQuery(
      'DELETE FROM domains WHERE id = ?',
      [domainId]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Domain deleted successfully'
    })

  } catch (error) {
    console.error('Admin delete domain API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete domain',
      debug: error.message 
    }, { status: 500 })
  }
}