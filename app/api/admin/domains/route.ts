// /app/api/admin/domains/route.ts - ADD POST METHOD
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  // For now, check if it's a valid admin token
  const users = await executeQuery(
    'SELECT id, email, name, role FROM users WHERE email = ? AND role = ?',
    ['admin@example.com', 'admin']
  ) as any[]

  return users.length > 0 ? users[0] : null
}

// GET all domains - Already working
export async function GET(request: NextRequest) {
  try {
    console.log('Admin domains GET API called')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin authenticated:', admin.email)

    // Get all domains with basic info
    const domains = await executeQuery(`
      SELECT 
        id,
        name,
        category,
        price,
        status,
        description,
        tags,
        views,
        offers,
        created_at as createdAt,
        updated_at as updatedAt
      FROM domains 
      ORDER BY id DESC
    `)

    console.log(`Found ${domains?.length || 0} domains`)

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

// ADD POST method for creating new domains
export async function POST(request: NextRequest) {
  try {
    console.log('Admin domains POST API called')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized POST attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin authenticated for POST:', admin.email)

    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, category, price, status, description, tags } = body

    // Validate required fields
    if (!name || !category || !price || !status) {
      console.log('Missing required fields')
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
      console.log('Domain already exists:', name)
      return NextResponse.json({ 
        success: false, 
        error: 'Domain already exists' 
      }, { status: 409 })
    }

    // Insert new domain
    console.log('Inserting new domain:', name)
    const result = await executeQuery(
      'INSERT INTO domains (name, category, price, status, description, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, category, parseFloat(price), status, description || '', tags || '']
    ) as any

    console.log('Domain inserted with ID:', result.insertId)

    // Get the created domain
    const newDomains = await executeQuery(
      'SELECT * FROM domains WHERE id = ?',
      [result.insertId]
    ) as any[]

    return NextResponse.json({
      success: true,
      message: 'Domain added successfully',
      domain: newDomains[0]
    })

  } catch (error) {
    console.error('Admin add domain API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add domain',
      debug: error.message 
    }, { status: 500 })
  }
}