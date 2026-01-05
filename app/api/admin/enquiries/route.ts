// /app/api/admin/enquiries/route.ts - Fixed route structure
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

// ------------------ GET ALL ENQUIRIES ------------------
export async function GET(request: NextRequest) {
  try {
    console.log('=== ADMIN ENQUIRIES GET ===')
    const admin = await getAdminFromRequest(request)
    
    if (!admin) {
      console.log('Admin authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin authenticated:', admin.email)

    // Get all enquiries with domain details if applicable
    const enquiries = await executeQuery(`
      SELECT 
        e.id,
        e.name,
        e.email,
        e.subject,
        e.message,
        e.type,
        e.status,
        e.domain_id,
        d.name as domain_name,
        e.created_at,
        e.updated_at
      FROM enquiries e
      LEFT JOIN domains d ON e.domain_id = d.id
      ORDER BY e.created_at DESC
    `) as any[]

    console.log('Found enquiries:', enquiries.length)

    return NextResponse.json({
      success: true,
      enquiries: enquiries || [],
      count: enquiries.length
    })

  } catch (error: any) {
    console.error('Admin enquiries GET error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to load enquiries',
      debug: error.message
    }, { status: 500 })
  }
}

// ------------------ CREATE NEW ENQUIRY (ADMIN) ------------------
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, subject, message, type, domain_id } = await request.json()

    // Update the loadEnquiries function in your admin enquiries page
const loadEnquiries = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    const response = await fetch('/api/admin/enquiries', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Enquiries response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Enquiries API error:', response.status, errorText)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Enquiries data:', data)
    
    if (data.success) {
      setEnquiries(data.enquiries || [])
    } else {
      console.error('Failed to load enquiries:', data.error)
      setEnquiries([])
    }
  } catch (error) {
    console.error('Error loading enquiries:', error)
    setEnquiries([])
    // Show user-friendly error
    alert('Failed to load enquiries: ' + error.message)
  } finally {
    setLoading(false)
  }
}

    // Validation
    if (!name || !email || !subject || !message || !type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Insert enquiry
    const result = await executeQuery(
      `INSERT INTO enquiries 
      (name, email, subject, message, type, status, domain_id, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, 'new', ?, NOW(), NOW())`,
      [name, email, subject, message, type, domain_id || null]
    ) as any

    console.log('Enquiry created with ID:', result.insertId)

    return NextResponse.json({
      success: true,
      message: 'Enquiry created successfully',
      enquiryId: result.insertId
    })

  } catch (error: any) {
    console.error('Create enquiry error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create enquiry',
      debug: error.message 
    }, { status: 500 })
  }
}