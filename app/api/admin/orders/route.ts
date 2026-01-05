// /app/api/admin/orders/route.ts - Fixed route structure
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Admin authentication function
const getAdminFromRequest = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  return token ? { id: 1, name: 'Admin' } : null
}

// ------------------ GET ORDERS ------------------
export async function GET(request: NextRequest) {
  try {
    console.log('=== ADMIN ORDERS GET ===')
    const authHeader = request.headers.get('authorization')

    // Query based on your actual database structure
    const orders = await executeQuery(`
      SELECT 
        o.id,
        o.order_number as orderNumber,
        o.user_id as userId,
        o.domain_id as domainId,
        o.domain_name as domainName,
        o.buyer_name as buyerName,
        o.buyer_email as buyerEmail,
        o.buyer_phone as buyerPhone,
        o.billing_info as billingInfo,
        o.seller_name as sellerName,
        o.seller_email as sellerEmail,
        o.price as totalAmount,
        o.status,
        o.payment_method as paymentMethod,
        o.payment_status as paymentStatus,
        o.created_at as createdAt,
        o.updated_at as updatedAt,
        o.completed_at as completedAt,
        u.name as userName,
        u.email as userEmail,
        u.role as userRole,
        d.name as domainNameFull,
        d.price as domainPrice,
        d.status as domainStatus,
        d.description as domainDescription
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN domains d ON o.domain_id = d.id
      ORDER BY o.created_at DESC
      LIMIT 100
    `) as any[]

    console.log('Found orders:', orders.length)
    
    // Process orders to ensure consistent structure
    const processedOrders = orders.map(order => ({
      ...order,
      billingInfo: order.billingInfo ? (() => {
        try {
          return JSON.parse(order.billingInfo)
        } catch {
          return null
        }
      })() : null
    }))

    return NextResponse.json({
      success: true,
      orders: processedOrders || [],
      count: processedOrders.length,
      auth: authHeader ? 'provided' : 'missing'
    })

  } catch (error: any) {
    console.error('Admin orders GET error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to load orders',
      debug: error.message
    }, { status: 500 })
  }
}

// ------------------ POST (CREATE) ORDER - ADMIN ------------------
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

    // Check domain exists
    const domain = await executeQuery('SELECT id FROM domains WHERE id = ?', [domainId]) as any[]
    if (domain.length === 0) return NextResponse.json({ error: 'Domain not found' }, { status: 404 })

    // Check user exists
    const user = await executeQuery('SELECT id FROM users WHERE id = ?', [userId]) as any[]
    if (user.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Insert offer
    const result = await executeQuery(
      'INSERT INTO offers (domain_id, user_id, offer_amount, offer_type, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [domainId, userId, offerAmount, offerType, message || '', 'pending']
    ) as any

    console.log('Offer created with ID:', result.insertId)
    return NextResponse.json({
      success: true,
      message: 'Offer created successfully',
      offerId: result.insertId
    })

  } catch (error: any) {
    console.error('Create offer error:', error)
    return NextResponse.json({ error: 'Internal server error', debug: error.message }, { status: 500 })
  }
}

// ------------------ PUT (UPDATE) ORDER - ADMIN ------------------
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, status, message } = await request.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const result = await executeQuery(
      'UPDATE orders SET status = ?, message = ?, updated_at = NOW() WHERE id = ?',
      [status, message || '', id]
    ) as any

    if (result.affectedRows === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    console.log(`Order ${id} updated to status ${status}`)
    return NextResponse.json({ success: true, message: 'Order updated successfully' })

  } catch (error: any) {
    console.error('Update order error:', error)
    return NextResponse.json({ error: 'Internal server error', debug: error.message }, { status: 500 })
  }
}

// ------------------ DELETE ORDER - ADMIN ------------------
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Missing order ID' }, { status: 400 })

    // Delete order items first
    await executeQuery('DELETE FROM order_items WHERE order_id = ?', [id])

    const result = await executeQuery('DELETE FROM orders WHERE id = ?', [id]) as any
    if (result.affectedRows === 0) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    console.log(`Order ${id} deleted successfully`)
    return NextResponse.json({ success: true, message: 'Order deleted successfully' })

  } catch (error: any) {
    console.error('Delete order error:', error)
    return NextResponse.json({ error: 'Internal server error', debug: error.message }, { status: 500 })
  }
}