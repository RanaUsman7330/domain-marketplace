import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Decode token to get user info (simplified version)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId

      // Get dashboard stats for purchased domains only
      const stats = await executeQuery(`
        SELECT 
          COUNT(DISTINCT d.id) as totalDomains,
          COUNT(DISTINCT CASE WHEN o.status IN ('pending', 'processing') THEN o.id END) as activeOrders,
          COUNT(DISTINCT w.domain_id) as watchlistCount,
          COALESCE(SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END), 0) as totalSpent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN domains d ON oi.domain_id = d.id
        LEFT JOIN watchlist w ON u.id = w.user_id
        WHERE u.id = ?
        GROUP BY u.id
      `, [userId])

      const userStats = stats.length > 0 ? stats[0] : {
        totalDomains: 0,
        activeOrders: 0,
        watchlistCount: 0,
        totalSpent: 0
      }

      return NextResponse.json({
        success: true,
        stats: userStats
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ 
        success: true, 
        stats: { totalDomains: 0, activeOrders: 0, watchlistCount: 0, totalSpent: 0 }
      })
    }

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: true, stats: { totalDomains: 0, activeOrders: 0, watchlistCount: 0, totalSpent: 0 }},
      { status: 200 }
    )
  }
}