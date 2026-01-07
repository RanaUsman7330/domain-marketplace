// FIXED VERSION - Handles NOT NULL constraints
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔍 Received body:', body);
    
    // Ensure NO NULL values - use empty strings instead
    const page_name = body.page?.trim() || ''  // This MUST NOT be null
    const title = body.title?.trim() || ''
    const description = body.description?.trim() || ''
    const keywords = body.keywords?.trim() || ''
    const robots = body.robots || 'index,follow'
    const priority = parseFloat(body.priority) || 0.5

    console.log('🔍 Final data:', { page_name, title, description, keywords });

    if (!page_name || !title || !description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields',
        received: { page_name, title, description }
      }, { status: 400 })
    }

    // Check if page already exists (using page_name as the key)
    const [existing] = await executeQuery('SELECT id FROM seo_settings WHERE page_name = ?', [page_name]) as any[]
    
    if (existing) {
      // Update existing
      await executeQuery(
        `UPDATE seo_settings SET 
         title = ?, description = ?, keywords = ?, robots = ?, priority = ?
         WHERE page_name = ?`,
        [title, description, keywords, robots, priority, page_name]
      )
      return NextResponse.json({ success: true, message: 'Updated existing setting' })
    } else {
      // Insert new - ensure NO NULL values anywhere
      const result = await executeQuery(
        `INSERT INTO seo_settings (page_name, title, description, keywords, robots, priority) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [page_name, title, description, keywords, robots, priority]
      ) as any
      
      console.log('✅ SEO setting saved with ID:', result.insertId);
      return NextResponse.json({ success: true, id: result.insertId })
    }
  } catch (error) {
    console.error('❌ SEO POST error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - Fetch all SEO settings
export async function GET() {
  try {
    const rows = await executeQuery('SELECT * FROM seo_settings ORDER BY page_name') as any[]
    return NextResponse.json({ success: true, settings: rows })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}