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
    
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get current order details
    const currentOrder = await executeQuery(
      'SELECT status, domain_id FROM orders WHERE id = ?',
      [params.id]
    ) as any[]

    if (currentOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const oldStatus = currentOrder[0].status
    const domainId = currentOrder[0].domain_id

    // Update order status
    await executeQuery(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, params.id]
    )

    // Handle domain status changes based on order status
    if (status === 'completed' && oldStatus !== 'completed') {
      // Mark domain as sold when order is completed
      await executeQuery(
        'UPDATE domains SET status = ? WHERE id = ?',
        ['sold', domainId]
      )
    } else if (status === 'cancelled' && oldStatus === 'completed') {
      // Revert domain to available if completed order is cancelled
      await executeQuery(
        'UPDATE domains SET status = ? WHERE id = ?',
        ['available', domainId]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    })

  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}