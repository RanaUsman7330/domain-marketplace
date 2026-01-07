import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId

      // Get user's orders with items
      const orders = await executeQuery(`
        SELECT 
          o.id,
          o.order_number,
          o.total_amount,
          o.status,
          o.created_at,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'domain_name', d.name,
              'price', oi.price
            )
          ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN domains d ON oi.domain_id = d.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `, [userId])

      return NextResponse.json({
        success: true,
        orders: orders || []
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ success: true, orders: [] })
    }

  } catch (error) {
    console.error('Orders error:', error)
    return NextResponse.json({ success: true, orders: [] })
  }
}