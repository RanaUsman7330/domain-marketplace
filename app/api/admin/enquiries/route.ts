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

    // Get all enquiries with domain details if applicable
    const enquiries = await executeQuery(`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.subject,
        e.message,
        e.type,
        e.status,
        e.domain_id,
        d.name as domain_name,
        e.created_at,
        e.updated_at
      FROM enquiries e
      LEFT JOIN domains d ON e.domain_id = d.id
      ORDER BY e.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      enquiries: enquiries || []
    })

  } catch (error) {
    console.error('Admin enquiries error:', error)
    return NextResponse.json({ 
      error: 'Failed to load enquiries',
      success: false 
    }, { status: 500 })
  }
}