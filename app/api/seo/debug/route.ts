// app/api/seo/debug/route.ts - FIXED
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

export async function GET() {
  try {
    console.log('🔍 Debug SEO API - Testing connection...')
    
    // Test database connection
    const rows = await executeQuery(
      'SELECT COUNT(*) as count FROM seo_settings'
    ) as any[]
    
    console.log('🔍 Debug - Query Result:', rows)
    console.log('🔍 Debug - Total SEO settings:', rows[0]?.count || 0)
    
    // Get domains SEO specifically
    const domainRows = await executeQuery(
      'SELECT * FROM seo_settings WHERE page = "/domains"'
    ) as any[]
    
    console.log('🔍 Debug - Domains SEO:', domainRows[0])

    return NextResponse.json({ 
      success: true,
      totalCount: rows[0]?.count || 0,
      domainsData: domainRows[0] || null,
      message: 'Debug successful'
    })
  } catch (error) {
    console.error('❌ Debug API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}