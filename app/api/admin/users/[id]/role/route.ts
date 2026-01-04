import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await request.json()
    
    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Don't allow changing the main admin's role
    const targetUser = await executeQuery(
      'SELECT email FROM users WHERE id = ?',
      [params.id]
    ) as any[]

    if (targetUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (targetUser[0].email === 'admin@example.com') {
      return NextResponse.json({ error: 'Cannot change main admin role' }, { status: 403 })
    }

    // Update user role
    await executeQuery(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully'
    })

  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}