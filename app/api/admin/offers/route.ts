// /app/api/admin/offers/route.ts
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

    // Get all offers with domain and user details
    const offers = await executeQuery(`
      SELECT 
        o.id,
        o.domain_id as domainId,
        d.name as domain,
        o.user_id as userId,
        u.name as buyerName,
        u.email as buyerEmail,
        o.offer_amount as offerAmount,
        o.offer_type as offerType,
        o.status,
        o.message,
        o.created_at as createdAt,
        o.updated_at as updatedAt
      FROM offers o
      LEFT JOIN domains d ON o.domain_id = d.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      offers: offers || []
    })

  } catch (error) {
    console.error('Admin offers error:', error)
    return NextResponse.json({ 
      error: 'Failed to load offers',
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

    const { domainId, userId, offerAmount, offerType, message } = await request.json()
    
    if (!domainId || !userId || !offerAmount || !offerType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if domain exists
    const domain = await executeQuery(
      'SELECT id FROM domains WHERE id = ?',
      [domainId]
    ) as any[]

    if (domain.length === 0) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    // Check if user exists
    const user = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    ) as any[]

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Insert new offer
    const result = await executeQuery(
      'INSERT INTO offers (domain_id, user_id, offer_amount, offer_type, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [domainId, userId, offerAmount, offerType, message || '', 'pending']
    ) as any

    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      offerId: result.insertId
    })

  } catch (error) {
    console.error('Create offer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status, message } = await request.json()
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update offer status
    const result = await executeQuery(
      'UPDATE offers SET status = ?, message = ?, updated_at = NOW() WHERE id = ?',
      [status, message || '', id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Offer updated successfully'
    })

  } catch (error) {
    console.error('Update offer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing offer ID' }, { status: 400 })
    }

    // Delete offer
    const result = await executeQuery(
      'DELETE FROM offers WHERE id = ?',
      [id]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Offer deleted successfully'
    })

  } catch (error) {
    console.error('Delete offer error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}