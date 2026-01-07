import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// GET single domain details - FIXED FOR NEXT.JS 15+
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid domain ID'
      }, { status: 400 })
    }

    // Get domain with SEO fields
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
        SUBSTRING_INDEX(d.name, '.', -1) as extension,
        CHAR_LENGTH(SUBSTRING_INDEX(d.name, '.', 1)) as length,
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

// PUT update domain - FIXED FOR NEXT.JS 15+
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const domainId = parseInt(id, 10)
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

    // Update domain with SEO fields
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

// DELETE domain - FIXED FOR NEXT.JS 15+
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid domain ID'
      }, { status: 400 })
    }

    // Delete domain
    await executeQuery('DELETE FROM domains WHERE id = ?', [domainId])

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