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

      // Get recent domains (purchased by user)
      const domains = await executeQuery(`
        SELECT 
          d.id,
          d.name,
          d.price,
          d.status,
          d.created_at,
          COALESCE(c.name, d.category, 'Uncategorized') as category
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN domains d ON oi.domain_id = d.id
        LEFT JOIN domain_categories dc ON d.id = dc.domain_id
        LEFT JOIN categories c ON dc.category_id = c.id
        WHERE o.user_id = ? AND o.status = 'completed'
        ORDER BY o.created_at DESC
        LIMIT 5
      `, [userId])

      return NextResponse.json({
        success: true,
        domains: domains || []
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ success: true, domains: [] })
    }

  } catch (error) {
    console.error('Recent domains error:', error)
    return NextResponse.json({ success: true, domains: [] })
  }
}