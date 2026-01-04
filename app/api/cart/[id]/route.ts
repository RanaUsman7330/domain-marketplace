// /app/api/cart/[id]/route.ts - DELETE method for removing cart items
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cartId = params.id
    console.log('Cart DELETE - Cart ID:', cartId)

    if (!cartId || isNaN(Number(cartId))) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid cart ID' 
      }, { status: 400 })
    }

    // Check if cart item exists
    const existing = await executeQuery(
      'SELECT id FROM cart WHERE id = ?',
      [cartId]
    ) as any[]

    if (existing.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Cart item not found' 
      }, { status: 404 })
    }

    // Delete the cart item
    await executeQuery(
      'DELETE FROM cart WHERE id = ?',
      [cartId]
    )

    console.log('Cart DELETE - Successfully removed cart item:', cartId)

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Cart DELETE API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to remove item from cart' 
    }, { status: 500 })
  }
}