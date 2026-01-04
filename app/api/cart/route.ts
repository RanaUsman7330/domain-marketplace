// /app/api/cart/route.ts - SIMPLE CART API
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || 'guest-token'
    
    // Get user ID (simplified for now)
    let userId = 0
    if (token !== 'guest-token') {
      const users = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['user@example.com']
      ) as any[]
      if (users.length > 0) userId = users[0].id
    }

    // Get cart items
    const cartItems = await executeQuery(`
      SELECT 
        c.id as cartId,
        c.domain_id as domainId,
        d.name as domainName,
        d.price,
        d.category,
        d.extension,
        d.description,
        d.image_url as imageUrl,
        1 as years,
        c.created_at as addedAt
      FROM cart c
      LEFT JOIN domains d ON c.domain_id = d.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [userId]) as any[]

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0)

    return NextResponse.json({
      success: true,
      cart: cartItems,
      total: total,
      userId: userId
    })

  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load cart',
      cart: [],
      total: 0
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { domainId, userId } = await request.json()

    if (!domainId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain ID is required' 
      }, { status: 400 })
    }

    // Check if domain exists and is available
    const domains = await executeQuery(
      'SELECT id, name, price, status FROM domains WHERE id = ? AND status = ?',
      [domainId, 'available']
    ) as any[]

    if (domains.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found or not available' 
      }, { status: 404 })
    }

    // Get actual user ID
    let actualUserId = userId || 0
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || 'guest-token'
    
    if (token !== 'guest-token') {
      const users = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['user@example.com']
      ) as any[]
      if (users.length > 0) actualUserId = users[0].id
    }

    // Check if already in cart
    const existing = await executeQuery(
      'SELECT id FROM cart WHERE domain_id = ? AND user_id = ?',
      [domainId, actualUserId]
    ) as any[]

    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain already in cart' 
      }, { status: 409 })
    }

    // Add to cart
    const result = await executeQuery(
      'INSERT INTO cart (user_id, domain_id, created_at) VALUES (?, ?, NOW())',
      [actualUserId, domainId]
    ) as any

    return NextResponse.json({
      success: true,
      message: 'Added to cart successfully',
      cartId: result.insertId
    })

  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add to cart' 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get('id')
    
    if (!cartId || isNaN(Number(cartId))) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid cart ID' 
      }, { status: 400 })
    }

    // Get user ID
    let userId = 0
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || 'guest-token'
    
    if (token !== 'guest-token') {
      const users = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['user@example.com']
      ) as any[]
      if (users.length > 0) userId = users[0].id
    }

    // Delete cart item
    const result = await executeQuery(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [cartId, userId]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart item not found' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Cart DELETE error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to remove item from cart' 
    }, { status: 500 })
  }
}