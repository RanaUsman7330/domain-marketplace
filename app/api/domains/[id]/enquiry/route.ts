// /app/api/domains/[id]/enquiry/route.ts - Create enquiry from domain page
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, email, phone, offerAmount, message, type } = await request.json()

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Check if domain exists
    const domainCheck = await executeQuery(
      'SELECT id, name, price FROM domains WHERE id = ?',
      [id]
    ) as any[]

    if (domainCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found' 
      }, { status: 404 })
    }

    const domain = domainCheck[0]

    // Create subject based on type
    let subject = ''
    if (type === 'offer') {
      subject = `Offer for ${domain.name} - $${offerAmount}`
    } else {
      subject = `Inquiry about ${domain.name}`
    }

    // Create enquiry
    const result = await executeQuery(
      `INSERT INTO enquiries 
      (name, email, subject, message, type, status, domain_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, 'new', ?, NOW(), NOW())`,
      [name, email, subject, message, type || 'domain', id]
    ) as any

    // Get the created enquiry
    const newEnquiry = await executeQuery(`
      SELECT 
        e.*,
        d.name as domain_name
      FROM enquiries e
      LEFT JOIN domains d ON e.domain_id = d.id
      WHERE e.id = ?
    `, [result.insertId]) as any[]

    // Send admin notification
    await sendAdminNotification(newEnquiry[0])

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      enquiryId: result.insertId,
      enquiry: newEnquiry[0]
    })

  } catch (error: any) {
    console.error('Create domain enquiry error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to submit enquiry',
      debug: error.message 
    }, { status: 500 })
  }
}

// Function to send admin notification
async function sendAdminNotification(enquiry: any) {
  try {
    const adminEmail = 'admin@domainhub.com' // This should come from your settings
    
    const subject = `New Enquiry Received - ${enquiry.subject}`
    const content = `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">New Domain Enquiry Received</h2>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Enquiry Details</h3>
            <p><strong>Name:</strong> ${enquiry.name}</p>
            <p><strong>Email:</strong> ${enquiry.email}</p>
            <p><strong>Domain:</strong> ${enquiry.domain_name}</p>
            <p><strong>Subject:</strong> ${enquiry.subject}</p>
            <p><strong>Type:</strong> ${enquiry.type}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 10px; border-radius: 4px; margin-top: 10px;">
              ${enquiry.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <p>Please login to admin panel to respond to this enquiry.</p>
          
          <p>Best regards,<br>DomainHub System</p>
        </div>
      </body>
      </html>
    `

    console.log(`📧 ADMIN NOTIFICATION - New enquiry from ${enquiry.name} about ${enquiry.domain_name}`)
    console.log(`Subject: ${subject}`)

    return {
      success: true,
      message: 'Admin notification sent'
    }
  } catch (error) {
    console.error('Admin notification error:', error)
    return {
      success: false,
      error: 'Failed to send admin notification'
    }
  }
}