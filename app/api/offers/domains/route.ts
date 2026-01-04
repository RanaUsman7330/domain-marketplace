import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // First get user ID from token (you'll need to implement this)
    // For now, let's get it from the users table using a simple query
    // You should implement proper JWT verification
    
    const users = await executeQuery(
      'SELECT id FROM users WHERE status = ? LIMIT 1',
      ['active']
    ) as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userId = users[0].id

    // Get user's domains
    const domains = await executeQuery(
      `SELECT id, name, price, status, created_at 
       FROM domains 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    )

    return NextResponse.json({ domains })

  } catch (error) {
    console.error('Error fetching user domains:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}