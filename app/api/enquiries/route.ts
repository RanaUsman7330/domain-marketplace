// app/api/enquiries/route.ts - Fixed null domain issue
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql-db';

// POST: Create new enquiry from contact form (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message, inquiryType, domain, domainId } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Format the message to include additional info
    const formattedMessage = `
      Inquiry Type: ${inquiryType || 'general'}\n
      Company: ${company || 'N/A'}\n
      Phone: ${phone || 'N/A'}\n\n
      ${message}
    `.trim();

    // Insert enquiry into database - handle null domain properly
    const result = await executeQuery(
      `INSERT INTO enquiries (name, email, subject, message, type, status, domain, domain_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, 'new', ?, ?, NOW(), NOW())`,
      [name, email, subject, formattedMessage, inquiryType || 'general', domain || '', domainId || null]
    );

    const enquiryId = (result as any).insertId;

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: { id: enquiryId }
    });

  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}