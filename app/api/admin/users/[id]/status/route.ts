import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Same getAdminFromRequest function...

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { status } = await request.json()
    
    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update user status
    await executeQuery(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'User status updated successfully'
    })

  } catch (error) {
    console.error('Update user status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}