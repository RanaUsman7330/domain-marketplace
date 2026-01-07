// app/api/seo/[page]/route.ts - FIXED PARAMETER HANDLING
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ page: string }> }
) {
  try {
    let { page } = await context.params
    
    console.log('🔍 User SEO API - Raw Page param:', page)
    
    // Normalize page parameter - handle both with and without slash
    if (!page.startsWith('/')) {
      page = '/' + page
    }
    
    console.log('🔍 User SEO API - Normalized Page:', page)
    
    const rows = await executeQuery(
      'SELECT * FROM seo_settings WHERE page = ?',
      [page]
    ) as any[]

    console.log('🔍 User SEO API - Query Result:', rows)
    console.log('🔍 User SEO API - Found Data:', rows[0])

    if (!rows || rows.length === 0) {
      console.log('🔍 User SEO API - No data found for page:', page)
      
      // Return fallback data instead of 404
      return NextResponse.json({ 
        success: true,
        data: {
          title: 'Domain Marketplace',
          description: 'Buy and sell premium domains',
          keywords: 'domains, premium domains, domain marketplace',
          robots: 'index,follow'
        },
        fallback: true,
        page: page
      })
    }

    return NextResponse.json({ 
      success: true, 
      data: rows[0],
      page: page
    })
  } catch (error) {
    console.error('❌ User SEO API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message,
      fallback: true
    }, { status: 500 })
  }
}