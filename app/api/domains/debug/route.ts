// /app/api/domains/debug/route.ts - ROBUST VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(request: NextRequest) {
  try {
    console.log('=== DEBUG API CALLED ===')
    
    // First, check what columns exist in domains table
    const tableInfo = await executeQuery(`
      SHOW COLUMNS FROM domains
    `) as any[]
    
    console.log('Available columns:', tableInfo.map(col => col.Field))
    
    // Build query based on available columns
    const availableColumns = tableInfo.map(col => col.Field)
    
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

    const domains = await executeQuery(`
      SELECT ${selectFields.join(', ')}
      FROM domains 
      ORDER BY id DESC
      LIMIT 10
    `)

    console.log('Debug query result:', domains)

    return NextResponse.json({
      success: true,
      domains: domains || [],
      availableColumns: availableColumns,
      message: 'Debug info: Showing latest 10 domains',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('=== DEBUG API ERROR ===')
    console.error('Error details:', error)
    console.error('Error message:', error.message)
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load debug info',
      debug: {
        message: error.message,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}