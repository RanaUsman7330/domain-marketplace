// File: /app/api/domains/route.ts - PUBLIC DOMAIN API

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// GET domain by name (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domainName = searchParams.get('name')
    
    if (!domainName) {
      return NextResponse.json({ error: 'Domain name required' }, { status: 400 })
    }

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
        d.extension,
        d.length,
        d.meta_title,
        d.meta_description,
        d.meta_keywords,
        d.seo_tags
      FROM domains d
      LEFT JOIN domain_categories dc ON d.id = dc.domain_id
      LEFT JOIN categories c ON dc.category_id = c.id
      WHERE d.name = ? AND d.status = 'available'
      LIMIT 1
    `, [domainName])

    if (!domains || domains.length === 0) {
      return NextResponse.json({ error: 'Domain not found or not available' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      domain: domains[0]
    })

  } catch (error) {
    console.error('Error fetching domain:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch domain' 
    }, { status: 500 })
  }
}

// POST track domain view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domainId } = body

    if (!domainId) {
      return NextResponse.json({ error: 'Domain ID required' }, { status: 400 })
    }

    // Increment view count
    await executeQuery(
      'UPDATE domains SET views = views + 1 WHERE id = ?',
      [domainId]
    )

    return NextResponse.json({
      success: true,
      message: 'View tracked successfully'
    })

  } catch (error) {
    console.error('Error tracking view:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to track view' 
    }, { status: 500 })
  }
}