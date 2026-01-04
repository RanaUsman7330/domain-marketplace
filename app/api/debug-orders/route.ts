// /app/api/debug-orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG ORDERS ENDPOINT ===')
    
    // Check database connection
    const dbTest = await executeQuery('SELECT 1 as test') as any[]
    console.log('Database connection test:', dbTest)

    // Check orders table
    const ordersCount = await executeQuery('SELECT COUNT(*) as count FROM orders') as any[]
    console.log('Orders count:', ordersCount[0].count)

    // Check order_items table
    const itemsCount = await executeQuery('SELECT COUNT(*) as count FROM order_items') as any[]
    console.log('Order items count:', itemsCount[0].count)

    // Get recent orders
    const recentOrders = await executeQuery(`
      SELECT 
        o.id,
        o.order_number,
        o.domain_name,
        o.buyer_name,
        o.buyer_email,
        o.price,
        o.status,
        o.payment_method,
        o.created_at
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 5
    `) as any[]

    console.log('Recent orders:', recentOrders)

    return NextResponse.json({
      success: true,
      debug: {
        dbConnection: 'OK',
        ordersCount: ordersCount[0].count,
        itemsCount: itemsCount[0].count,
        recentOrders: recentOrders,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      debug: {
        dbConnection: 'FAILED',
        error: error.message
      }
    }, { status: 500 })
  }
}