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

      // Get user's watchlist
      const items = await executeQuery(`
        SELECT 
          w.id,
          w.domain_id,
          w.added_at,
          d.name,
          d.price,
          d.status,
          COALESCE(c.name, d.category, 'Uncategorized') as category
        FROM watchlist w
        JOIN domains d ON w.domain_id = d.id
        LEFT JOIN domain_categories dc ON d.id = dc.domain_id
        LEFT JOIN categories c ON dc.category_id = c.id
        WHERE w.user_id = ?
        ORDER BY w.added_at DESC
      `, [userId])

      return NextResponse.json({
        success: true,
        items: items || []
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ success: true, items: [] })
    }

  } catch (error) {
    console.error('Watchlist error:', error)
    return NextResponse.json({ success: true, items: [] })
  }
}