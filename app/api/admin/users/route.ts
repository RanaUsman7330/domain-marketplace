import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token (same as before)
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

    // Get all users for admin
    const users = await executeQuery(`
      SELECT 
        id,
        name,
        email,
        role,
        status,
        created_at,
        last_login
      FROM users 
      ORDER BY created_at DESC
    `)

    return NextResponse.json({
      success: true,
      users: users || []
    })

  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ 
      error: 'Failed to load users',
      success: false 
    }, { status: 500 })
  }
}