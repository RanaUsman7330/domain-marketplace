// /app/api/admin/enquiries/[id]/route.ts
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

// ------------------ GET SINGLE ENQUIRY ------------------
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    const enquiries = (await executeQuery(
      `
      SELECT 
        e.id, e.name, e.email, e.subject, e.message, e.type, e.status,
        e.domain_id, d.name as domain_name, e.created_at, e.updated_at
      FROM enquiries e
      LEFT JOIN domains d ON e.domain_id = d.id
      WHERE e.id = ?
      `,
      [id]
    )) as any[]

    if (enquiries.length === 0) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 })
    }

    const enquiry = enquiries[0]

    if (enquiry.status === 'new') {
      await executeQuery(
        'UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?',
        ['read', id]
      )
      enquiry.status = 'read'
    }

    return NextResponse.json({ success: true, enquiry })
  } catch (error) {
    console.error('Error loading enquiry:', error)
    return NextResponse.json({ error: 'Failed to load enquiry' }, { status: 500 })
  }
}

// ------------------ DELETE ENQUIRY ------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params  // ✅ unwrap the promise

    if (!id) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 })
    }

    // Admin check (optional, but recommended)
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = (await executeQuery(
      'DELETE FROM enquiries WHERE id = ?',
      [id]
    )) as any

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting enquiry:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete enquiry' }, { status: 500 })
  }
}
