import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('=== ADMIN LOGIN DEBUG ===')
    console.log('Attempting admin login:', { email })

    // Find admin user by email and role
    const users = await executeQuery(
      'SELECT id, name, email, password, role FROM users WHERE email = ? AND role = ?',
      [email, 'admin']
    ) as any[]

    console.log('Found users:', users.length)

    if (users.length === 0) {
      console.log('No admin user found with this email')
      return NextResponse.json(
        { error: 'Invalid admin credentials or insufficient privileges' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    console.log('Password valid:', isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials or insufficient privileges' },
        { status: 401 }
      )
    }

    // Generate admin token
    const token = jwt.sign(
      { 
        userId: user.id.toString(),
        email: user.email,
        role: user.role,
        isAdmin: true 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    )

    console.log('Admin login successful for:', user.email)

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}