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
    
    const validStatuses = ['new', 'read', 'replied', 'closed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Update enquiry status
    await executeQuery(
      'UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Enquiry status updated successfully'
    })

  } catch (error) {
    console.error('Update enquiry status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}