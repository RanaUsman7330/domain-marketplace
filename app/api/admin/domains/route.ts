// File: /app/api/admin/domains/route.ts - COMPLETE UPDATE

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return { id: 1, role: 'admin' }
}

// GET all domains with proper category and date formatting
export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Updated query to properly join with categories and format dates
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
        d.length
      FROM domains d
      LEFT JOIN domain_categories dc ON d.id = dc.domain_id
      LEFT JOIN categories c ON dc.category_id = c.id
      ORDER BY d.created_at DESC
    `)

    return NextResponse.json({
      success: true,
      domains: domains || []
    })

  } catch (error) {
    console.error('Admin domains API error:', error)
    return NextResponse.json({ 
      error: 'Failed to load domains',
      success: false 
    }, { status: 500 })
  }
}

// POST method for creating new domains
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, category, price, status, description, tags } = body

    if (!name || !category || !price || !status) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields' 
      }, { status: 400 })
    }

    // Check if domain already exists
    const existing = await executeQuery(
      'SELECT id FROM domains WHERE name = ?',
      [name]
    ) as any[]

    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Domain already exists' 
      }, { status: 409 })
    }

    // Insert new domain
    const result = await executeQuery(
      'INSERT INTO domains (name, category, price, status, description, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, category, parseFloat(price), status, description || '', tags || '']
    ) as any

    // Get category ID for linking
    const categoryResult = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [category]
    ) as any[]

    if (categoryResult.length > 0) {
      // Link domain to category
      await executeQuery(
        'INSERT INTO domain_categories (domain_id, category_id) VALUES (?, ?)',
        [result.insertId, categoryResult[0].id]
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Domain added successfully',
      domainId: result.insertId
    })

  } catch (error) {
    console.error('Admin add domain API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add domain'
    }, { status: 500 })
  }
}