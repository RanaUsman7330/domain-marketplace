// /app/api/domains/route.ts - ROBUST VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // First, check what columns exist in domains table
    const tableInfo = await executeQuery(`
      SHOW COLUMNS FROM domains
    `) as any[]
    
    const availableColumns = tableInfo.map(col => col.Field)
    console.log('Available columns in domains API:', availableColumns)

    // Build query based on available columns
    let selectFields = ['id', 'name', 'price', 'status', 'category', 'description']
    
    // Add optional columns if they exist
    if (availableColumns.includes('extension')) {
      selectFields.push('extension')
    } else {
      selectFields.push("'.com' as extension")
    }
    
    if (availableColumns.includes('length')) {
      selectFields.push('length')
    } else {
      selectFields.push('LENGTH(name) as length')
    }
    
    if (availableColumns.includes('image_url')) {
      selectFields.push('image_url as imageUrl')
    } else {
      selectFields.push("'' as imageUrl")
    }
    
    if (availableColumns.includes('is_featured')) {
      selectFields.push('is_featured as isFeatured')
    } else {
      selectFields.push('FALSE as isFeatured')
    }

    // Get filter parameters
    const category = searchParams.get('category')
    const priceRange = searchParams.get('priceRange')
    const length = searchParams.get('length')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'

    // Build WHERE conditions
    let whereConditions = ['1=1'] // Always true to make building easier
    let params: any[] = []

    // Add search filter
    if (search) {
      whereConditions.push('(d.name LIKE ? OR d.description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    // Add category filter
    if (category && category !== 'all') {
      whereConditions.push('d.category = ?')
      params.push(category)
    }

    // Build final query
    const whereClause = whereConditions.join(' AND ')
    
    // Build ORDER BY
    let orderBy = 'd.id DESC'
    switch (sort) {
      case 'price-low':
        orderBy = 'd.price ASC'
        break
      case 'price-high':
        orderBy = 'd.price DESC'
        break
      case 'name':
        orderBy = 'd.name ASC'
        break
      case 'newest':
      default:
        orderBy = 'd.id DESC'
    }

    const domains = await executeQuery(`
      SELECT ${selectFields.join(', ')}
      FROM domains d
      WHERE ${whereClause}
      ORDER BY ${orderBy}
    `, params)

    console.log(`Found ${domains?.length || 0} domains`)

    return NextResponse.json({
      success: true,
      domains: domains || []
    })

  } catch (error) {
    console.error('Domains API error:', error)
    return NextResponse.json({ 
      error: 'Failed to load domains',
      success: false,
      domains: []
    }, { status: 500 })
  }
}