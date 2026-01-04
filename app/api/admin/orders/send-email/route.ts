// /app/api/admin/orders/send-email/route.ts - EMAIL NOTIFICATIONS
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function POST(request: NextRequest) {
  try {
    const { orderId, orderNumber, buyerName, buyerEmail, domainName, newStatus, oldStatus } = await request.json()

    // Get order details
    const orders = await executeQuery(`
      SELECT * FROM orders WHERE id = ?
    `, [orderId]) as any[]

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // Create email content
    const emailSubject = `Order ${orderNumber} Status Update - ${newStatus}`
    
    const emailContent = `
      <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">Domain Marketplace - Order Update</h2>
          
          <p>Dear ${buyerName},</p>
          
          <p>Your order status has been updated:</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Domain:</strong> ${domainName}</p>
            <p><strong>Previous Status:</strong> ${oldStatus}</p>
            <p><strong>New Status:</strong> <span style="color: #2563eb; font-weight: bold;">${newStatus}</span></p>
            <p><strong>Amount:</strong> $${parseFloat(order.price).toLocaleString()}</p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>Domain Marketplace Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </body>
      </html>
    `

    // For now, just log the email (you can integrate with email service later)
    console.log(`📧 Email to be sent to: ${buyerEmail}`)
    console.log(`Subject: ${emailSubject}`)
    console.log(`Content: ${emailContent}`)

    // In production, you would integrate with an email service like:
    // - SendGrid
    // - Mailgun  
    // - AWS SES
    // - Nodemailer

    return NextResponse.json({
      success: true,
      message: 'Email notification queued for sending',
      email: {
        to: buyerEmail,
        subject: emailSubject,
        content: emailContent
      }
    })

  } catch (error: any) {
    console.error('Send email error:', error)
    return NextResponse.json({ 
      error: 'Failed to send email',
      debug: error.message 
    }, { status: 500 })
  }
}