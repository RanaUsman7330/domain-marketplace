// /app/api/watchlist/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  // For now, return mock user - implement proper JWT validation
  return { id: 1, email: 'guest@example.com' }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ 
        watchlist: [],
        count: 0
      })
    }

    const watchlist = await executeQuery(`
      SELECT 
        w.id as watchlistId,
        w.domain_id as domainId,
        d.name as domainName,
        d.price,
        d.description,
        d.image_url as imageUrl,
        d.extension,
        d.category,
        d.status,
        w.created_at as addedAt
      FROM watchlist w
      JOIN domains d ON w.domain_id = d.id
      WHERE w.user_id = ? AND d.status = ?
      ORDER BY w.created_at DESC
    `, [user.id, 'active'])

    return NextResponse.json({
      success: true,
      watchlist: watchlist || [],
      count: watchlist.length
    })

  } catch (error) {
    console.error('Watchlist API error:', error)
    return NextResponse.json({ 
      watchlist: [],
      count: 0,
      error: 'Failed to load watchlist'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const { domainId } = await request.json()
    
    if (!domainId) {
      return NextResponse.json({ error: 'Missing domain ID' }, { status: 400 })
    }

    // Check if domain exists and is active
    const domains = await executeQuery(
      'SELECT id FROM domains WHERE id = ? AND status = ?',
      [domainId, 'active']
    ) as any[]

    if (domains.length === 0) {
      return NextResponse.json({ error: 'Domain not found or unavailable' }, { status: 404 })
    }

    // Check if already in watchlist
    const existing = await executeQuery(
      'SELECT id FROM watchlist WHERE user_id = ? AND domain_id = ?',
      [user.id, domainId]
    ) as any[]

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Domain already in watchlist' }, { status: 400 })
    }

    // Add to watchlist
    await executeQuery(
      'INSERT INTO watchlist (user_id, domain_id, created_at) VALUES (?, ?, NOW())',
      [user.id, domainId]
    )

    return NextResponse.json({
      success: true,
      message: 'Domain added to watchlist'
    })

  } catch (error) {
    console.error('Add to watchlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const domainId = searchParams.get('domainId')

    if (!domainId) {
      return NextResponse.json({ error: 'Missing domain ID' }, { status: 400 })
    }

    // Delete from watchlist
    const result = await executeQuery(
      'DELETE FROM watchlist WHERE user_id = ? AND domain_id = ?',
      [user.id, domainId]
    ) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Domain not found in watchlist' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Domain removed from watchlist'
    })

  } catch (error) {
    console.error('Remove from watchlist error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}