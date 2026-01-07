// /app/api/offers/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Update your /api/offers/route.ts POST function
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domainId, offerAmount, offerType, message, buyerName, buyerEmail, buyerPhone } = body

    // Validation
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

    const domainData = domain[0]

    // Create enquiry instead of offer
    const subject = `Offer for ${domainData.name} - $${offerAmount}`
    const enquiryMessage = `Offer Amount: $${offerAmount}\n\n${message || ''}`

    const result = await executeQuery(
      `INSERT INTO enquiries 
      (name, email, subject, message, type, status, domain_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, 'offer', 'new', ?, NOW(), NOW())`,
      [buyerName, buyerEmail, subject, enquiryMessage, domainId]
    ) as any

    // Send admin notification
    console.log(`📧 NEW OFFER ENQUIRY - ${buyerName} offered $${offerAmount} for ${domainData.name}`)

    return NextResponse.json({
      success: true,
      message: 'Offer submitted successfully as enquiry',
      enquiryId: result.insertId
    })

  } catch (error: any) {
    console.error('Create offer/enquiry error:', error)
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