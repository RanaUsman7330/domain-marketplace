import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (!decoded.isAdmin || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Not an admin' }, { status: 403 })
    }

    // Get fresh user data
    const users = await executeQuery(
      'SELECT id, name, email, role FROM users WHERE id = ? AND role = ?',
      [decoded.userId, 'admin']
    ) as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: users[0]
    })

  } catch (error) {
    console.error('Admin auth check error:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}