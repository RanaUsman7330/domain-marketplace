// File: /app/api/domains/contact/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, offer, domainId, domainName } = body

    if (!name || !email || !message || !domainId || !domainName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save contact form
    await executeQuery(`
      INSERT INTO domain_contacts (domain_id, name, email, message, offer, created_at) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [domainId, name, email, message, offer || null])

    // Track as an offer if price provided
    if (offer && parseFloat(offer) > 0) {
      await executeQuery(`
        INSERT INTO domain_offers (domain_id, buyer_name, buyer_email, amount, message, status, created_at) 
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
      `, [domainId, name, email, parseFloat(offer), message])
      
      // Update domain offers count
      await executeQuery(
        'UPDATE domains SET offers = offers + 1 WHERE id = ?',
        [domainId]
      )
    }

    // Here you would typically send an email notification
    // For now, we'll just save to database

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully'
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process contact form' 
    }, { status: 500 })
  }
}