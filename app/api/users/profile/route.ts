import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// GET user profile
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

      const users = await executeQuery(
        'SELECT id, firstName, lastName, email, phone, company, address FROM users WHERE id = ?',
        [userId]
      ) as any[]

      if (users.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        user: users[0]
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const body = await request.json()
    const { firstName, lastName, phone, company, address } = body

    // Decode token to get user info
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId

      // Update user profile (excluding email for security)
      await executeQuery(`
        UPDATE users 
        SET firstName = ?, lastName = ?, phone = ?, company = ?, address = ?
        WHERE id = ?
      `, [firstName, lastName, phone, company, address, userId])

      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully'
      })

    } catch (tokenError) {
      console.error('Token decode error:', tokenError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}