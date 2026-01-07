// File: /app/api/admin/categories-with-counts/route.ts

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

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const query = `
      SELECT 
        c.id,
        c.name,
        COALESCE(COUNT(dc.domain_id), 0) as domainCount
      FROM categories c
      LEFT JOIN domain_categories dc ON c.id = dc.category_id
      GROUP BY c.id, c.name
      ORDER BY c.name ASC
    `
    
    const categories = await executeQuery(query)
    return NextResponse.json({
      success: true,
      categories: categories || []
    })
  } catch (error) {
    console.error('Error fetching categories with counts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}