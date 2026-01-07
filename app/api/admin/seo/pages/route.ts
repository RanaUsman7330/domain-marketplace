// app/api/admin/seo/pages/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/mysql-db';

export async function GET() {
  try {
    // Get existing pages from SEO settings
    const existingPages = await executeQuery(
      'SELECT DISTINCT page FROM seo_settings ORDER BY page'
    ) as any[];

    // Get all possible pages from your app structure
    const availablePages = [
      '/',
      '/domains',
      '/domains/[id]',
      '/about',
      '/contact',
      '/how-it-works',
      '/help-center',
      '/faq',
      '/system-status',
      '/terms',
      '/privacy',
      '/cookies'
    ];

    // Filter out already configured pages
    const configuredPages = existingPages.map(p => p.page);
    const remainingPages = availablePages.filter(page => !configuredPages.includes(page));

    return NextResponse.json({ 
      success: true, 
      pages: remainingPages 
    });
  } catch (error) {
    console.error('Pages fetch error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch available pages' 
    }, { status: 500 });
  }
}