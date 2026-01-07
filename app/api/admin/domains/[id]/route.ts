// File: /app/api/admin/domains/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from request
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return { id: 1, role: 'admin' }
}

// GET single domain details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domainId = params.id

    const domains = await executeQuery(`
      SELECT 
        d.id,
        d.name,
        COALESCE(c.name, d.category, 'Uncategorized') as category,
        d.price,
        d.status,
        d.description,
        d.tags,
        COALESCE(d.views, 0) as views,
        COALESCE(d.offers, 0) as offers,
        DATE_FORMAT(d.created_at, '%Y-%m-%d') as created_at,
        DATE_FORMAT(d.updated_at, '%Y-%m-%d') as updated_at,
        d.extension,
        d.length,
        d.meta_title,
        d.meta_description,
        d.meta_keywords,
        d.seo_tags
      FROM domains d
      LEFT JOIN domain_categories dc ON d.id = dc.domain_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE d.id = ?
      LIMIT 1
    `, [domainId])

    if (!domains || domains.length === 0) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      domain: domains[0]
    })

  } catch (error) {
    console.error('Error fetching domain:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch domain',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT update domain
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domainId = params.id
    const body = await request.json()
    const { 
      name, 
      category, 
      price, 
      status, 
      description, 
      tags,
      meta_title,
      meta_description,
      meta_keywords,
      seo_tags 
    } = body

    // Update domain
    await executeQuery(`
      UPDATE domains 
      SET 
        name = ?,
        category = ?,
        price = ?,
        status = ?,
        description = ?,
        tags = ?,
        meta_title = ?,
        meta_description = ?,
        meta_keywords = ?,
        seo_tags = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      name, category, parseFloat(price), status, description || '', tags || '',
      meta_title || '', meta_description || '', meta_keywords || '', seo_tags || '',
      domainId
    ])

    // Update category relationship if needed
    if (category) {
      // Get category ID
      const catResult = await executeQuery(
        'SELECT id FROM categories WHERE name = ?',
        [category]
      ) as any[]

      if (catResult.length > 0) {
        const categoryId = catResult[0].id
        
        // Remove existing category relationship
        await executeQuery(
          'DELETE FROM domain_categories WHERE domain_id = ?',
          [domainId]
        )
        
        // Add new category relationship
        await executeQuery(
          'INSERT INTO domain_categories (domain_id, category_id) VALUES (?, ?)',
          [domainId, categoryId]
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Domain updated successfully'
    })

  } catch (error) {
    console.error('Error updating domain:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update domain',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domainId = params.id

    // Delete category relationships first
    await executeQuery('DELETE FROM domain_categories WHERE domain_id = ?', [domainId])
    
    // Delete the domain
    const result = await executeQuery('DELETE FROM domains WHERE id = ?', [domainId])

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Domain deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting domain:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete domain',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}