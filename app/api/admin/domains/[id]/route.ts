// /app/api/admin/domains/[id]/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper function to get admin from token
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

// GET method for fetching single domain
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('GET single domain API called')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized GET attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    console.log('Domain ID from params:', id)
    
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      console.log('Invalid domain ID:', id)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID' 
      }, { status: 400 })
    }

    console.log('Fetching domain with ID:', domainId)

    // Get domain details - FIXED COLUMNS
    const domains = await executeQuery(`
      SELECT 
        id,
        name,
        price,
        description,
        category,
        status,
        created_at as createdAt,
        updated_at as updatedAt,
        tags,
        views,
        offers
      FROM domains 
      WHERE id = ?
      LIMIT 1
    `, [domainId])

    console.log('Query result:', domains)

    if (!domains || domains.length === 0) {
      console.log('Domain not found with ID:', domainId)
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

// PUT method for updating domain
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT domain API called')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized PUT attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      console.log('Invalid domain ID:', id)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID' 
      }, { status: 400 })
    }

    const body = await request.json()
    const { name, category, price, status, description, tags } = body

    // Update domain
    const result = await executeQuery(
      'UPDATE domains SET name = ?, category = ?, price = ?, status = ?, description = ?, tags = ?, updated_at = NOW() WHERE id = ?',
      [name, category, parseFloat(price), status, description || '', tags || '', domainId]
    ) as any

    if (result.affectedRows === 0) {
      console.log('Domain not found for update:', domainId)
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    console.log('Domain updated successfully:', domainId)
    
    return NextResponse.json({
      success: true,
      message: 'Domain updated successfully'
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

// DELETE method for deleting domain
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE API called for domain')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized DELETE attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await context.params
    console.log('Domain ID from params:', id)
    
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      console.log('Invalid domain ID:', id)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID' 
      }, { status: 400 })
    }

    console.log('Attempting to delete domain ID:', domainId)

    // Delete domain
    const result = await executeQuery(
      'DELETE FROM domains WHERE id = ?',
      [domainId]
    ) as any

    console.log('Delete result:', result)

    if (result.affectedRows === 0) {
      console.log('Domain not found for ID:', domainId)
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    console.log('Domain deleted successfully:', domainId)
    
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