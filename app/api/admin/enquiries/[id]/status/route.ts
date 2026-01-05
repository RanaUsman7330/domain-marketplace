// /app/api/admin/enquiries/[id]/status/route.ts - Status update with email notifications
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Admin authentication function
const getAdminFromRequest = async (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  const token = authHeader.substring(7)
  return token ? { id: 1, name: 'Admin', email: 'admin@example.com' } : null
}

// Email notification function
const sendEnquiryStatusEmail = async (enquiry: any, newStatus: string) => {
  try {
    // Get admin email from settings (you can store this in your settings table)
    const adminEmail = 'admin@domainhub.com' // This should come from your settings
    
    const subject = `Enquiry Status Updated - ${enquiry.subject}`
    const content = `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">DomainHub - Enquiry Update</h2>
          
          <p>Dear ${enquiry.name},</p>
          
          <p>Your enquiry status has been updated:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Enquiry Details</h3>
            <p><strong>Subject:</strong> ${enquiry.subject}</p>
            <p><strong>Domain:</strong> ${enquiry.domain_name || 'N/A'}</p>
            <p><strong>New Status:</strong> <span style="color: #2563eb; font-weight: bold;">${newStatus.toUpperCase()}</span></p>
            <p><strong>Type:</strong> ${enquiry.type}</p>
          </div>
          
          <p>We will respond to your enquiry shortly.</p>
          
          <p>Best regards,<br>DomainHub Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </body>
      </html>
    `

    // For now, log the email (integrate with real email service later)
    console.log(`📧 Email to be sent to: ${enquiry.email}`)
    console.log(`Subject: ${subject}`)
    console.log(`Content: ${content}`)

    return {
      success: true,
      message: 'Email notification logged'
    }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: 'Failed to send email'
    }
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Await the params Promise for Next.js 15+
    const { id } = await params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ['new', 'read', 'replied', 'closed']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get current enquiry details
    const currentEnquiry = await executeQuery(
      'SELECT * FROM enquiries WHERE id = ?',
      [id]
    ) as any[]

    if (currentEnquiry.length === 0) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    const enquiry = currentEnquiry[0]

    // Update status
    await executeQuery(
      'UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    )

    // Send email notification
    const emailResult = await sendEnquiryStatusEmail(enquiry, status)
    console.log('Email notification result:', emailResult)

    return NextResponse.json({
      success: true,
      message: 'Enquiry status updated successfully',
      emailNotification: emailResult
    })

  } catch (error: any) {
    console.error('Update enquiry status error:', error)
    return NextResponse.json({
      error: 'Failed to update enquiry status',
      debug: error.message
    }, { status: 500 })
  }
}