// /app/api/admin/orders/[id]/payment-status/route.ts - Fixed for Next.js 15+
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Admin authentication function
const getAdminFromRequest = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  const token = authHeader.replace('Bearer ', '')
  return token ? { id: 1, name: 'Admin' } : null
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params Promise
    const { id } = await params
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payment_status } = await request.json()
    
    const validStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (!validStatuses.includes(payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    console.log('Updating payment status:', id, 'to', payment_status)

    // Update payment status
    await executeQuery(
      'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?',
      [payment_status, id]
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