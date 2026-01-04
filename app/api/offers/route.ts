// /app/api/offers/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function POST(request: NextRequest) {
  try {
    const { domainId, offerAmount, buyerName, buyerEmail, buyerPhone, message, offerType } = await request.json()
    
    if (!domainId || !offerAmount || !buyerName || !buyerEmail) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Check if domain exists
    const domain = await executeQuery(
      'SELECT id, name, price FROM domains WHERE id = ?',
      [domainId]
    ) as any[]

    if (domain.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    // Insert offer with CORRECT column names
    const result = await executeQuery(
      'INSERT INTO offers (domain_id, offer_amount, offer_type, status, message, buyer_name, buyer_email, buyer_phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [domainId, offerAmount, offerType || 'negotiable', 'pending', message || '', buyerName, buyerEmail, buyerPhone || '']
    ) as any

    return NextResponse.json({
      success: true,
      message: 'Offer submitted successfully',
      offerId: result.insertId
    })

  } catch (error) {
    console.error('Create offer error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit offer',
      debug: error.message 
    }, { status: 500 })
  }
}

// GET method for fetching offers (optional)
export async function GET(request: NextRequest) {
  try {
    const offers = await executeQuery(`
      SELECT 
        o.id,
        o.domain_id as domainId,
        d.name as domain,
        o.offer_amount as offerAmount,
        o.offer_type as offerType,
        o.status,
        o.message,
        o.buyer_name as buyerName,
        o.buyer_email as buyerEmail,
        o.buyer_phone as buyerPhone,
        o.created_at as createdAt
      FROM offers o
      LEFT JOIN domains d ON o.domain_id = d.id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      offers: offers || []
    })

  } catch (error) {
    console.error('Get offers error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch offers',
      debug: error.message 
    }, { status: 500 })
  }
}