// /app/api/domains/[id]/route.ts - ROBUST VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params promise
    const { id } = await context.params
    
    console.log('=== DOMAIN DETAIL API DEBUG ===')
    console.log('Raw ID from params:', id)

    // Convert ID to number
    const domainId = parseInt(id, 10)

    if (isNaN(domainId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid domain ID format',
        debug: `Received ID: ${id}, Converted: ${domainId}`
      }, { status: 400 })
    }

    // First, check what columns exist in domains table
    const tableInfo = await executeQuery(`
      SHOW COLUMNS FROM domains
    `) as any[]
    
    const availableColumns = tableInfo.map(col => col.Field)
    console.log('Available columns:', availableColumns)

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

    if (availableColumns.includes('created_at')) {
      selectFields.push('created_at as createdAt')
    } else {
      selectFields.push('NOW() as createdAt')
    }

    if (availableColumns.includes('updated_at')) {
      selectFields.push('updated_at as updatedAt')
    } else {
      selectFields.push('NOW() as updatedAt')
    }

    // Get domain details
    const domains = await executeQuery(`
      SELECT ${selectFields.join(', ')}
      FROM domains 
      WHERE id = ?
      LIMIT 1
    `, [domainId])

    console.log('Query result:', domains)

    if (!domains || domains.length === 0) {
      console.log('ERROR: Domain not found with ID:', domainId)
      
      // Show what domains are available
      const existingIds = await executeQuery(
        'SELECT id, name FROM domains ORDER BY id DESC LIMIT 5'
      ) as any[]
      
      return NextResponse.json({ 
        success: false, 
        error: 'Domain not found',
        debug: {
          searchedId: domainId,
          availableDomains: existingIds || []
        }
      }, { status: 404 })
    }

    const domain = domains[0]
    console.log('Found domain:', domain)

    return NextResponse.json({
      success: true,
      domain: domain
    })

  } catch (error) {
    console.error('=== DOMAIN DETAIL API ERROR ===')
    console.error('Error details:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load domain details',
      debug: error.message 
    }, { status: 500 })
  }
}