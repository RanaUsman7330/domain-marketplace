import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Same getAdminFromRequest function...

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payment_status } = await request.json()
    
    const validStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (!validStatuses.includes(payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    // Update payment status
    await executeQuery(
      'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [payment_status, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully'
    })

  } catch (error) {
    console.error('Update payment status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}