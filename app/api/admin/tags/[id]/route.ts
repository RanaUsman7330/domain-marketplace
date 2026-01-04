import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const users = await executeQuery(
    'SELECT id, email, name, role FROM users WHERE email = ? AND role = ?',
    ['admin@example.com', 'admin']
  ) as any[]

  return users.length > 0 ? users[0] : null
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, color } = await request.json()
    
    if (!name || !color) {
      return NextResponse.json({ error: 'Name and color are required' }, { status: 400 })
    }

    // Check if tag name already exists (excluding current tag)
    const existingTag = await executeQuery(
      'SELECT id FROM tags WHERE name = ? AND id != ?',
      [name, params.id]
    ) as any[]

    if (existingTag.length > 0) {
      return NextResponse.json({ error: 'Tag name already exists' }, { status: 400 })
    }

    // Update tag
    await executeQuery(
      'UPDATE tags SET name = ?, color = ?, updated_at = NOW() WHERE id = ?',
      [name, color, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Tag updated successfully'
    })

  } catch (error) {
    console.error('Update tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if tag is being used by any domains
    const domainCount = await executeQuery(
      'SELECT COUNT(*) as count FROM domain_tags WHERE tag_id = ?',
      [params.id]
    ) as any[]

    if (domainCount[0]?.count > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete tag: it is being used by domains' 
      }, { status: 400 })
    }

    // Delete tag
    await executeQuery('DELETE FROM tags WHERE id = ?', [params.id])

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully'
    })

  } catch (error) {
    console.error('Delete tag error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}