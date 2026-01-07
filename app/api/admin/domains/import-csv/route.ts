// File: /app/api/admin/domains/import-csv/route.ts - COMPLETE UPDATE

import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

async function getOrCreateCategory(categoryName: string): Promise<number> {
  try {
    if (!categoryName || categoryName.trim() === '' || categoryName === 'Uncategorized') {
      return 1; // Default to Uncategorized
    }

    // Try to find existing category
    const existing = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [categoryName.trim()]
    ) as any[]

    if (existing && existing.length > 0) {
      return existing[0].id
    }

    // Create new category if it doesn't exist
    const result = await executeQuery(
      'INSERT INTO categories (name, description, status, created_at) VALUES (?, ?, ?, NOW())',
      [categoryName.trim(), `Auto-created category for ${categoryName}`, 1]
    ) as any

    return result.insertId
  } catch (error) {
    console.error('Error in getOrCreateCategory:', error)
    // Return default category if there's an error
    return 1
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvContent = await file.text()
    const records = parseCSV(csvContent)
    
    let importedCount = 0
    let autoCreatedCategories = 0
    const errors: string[] = []

    for (const record of records) {
      try {
        const { name, category, price, status, description, tags } = record
        
        if (!name) continue

        // Get or create category
        const categoryId = await getOrCreateCategory(category)
        if (categoryId && category && category.trim() !== '' && category !== 'Uncategorized') {
          autoCreatedCategories++
        }

        // Get actual category name for the domain table
        let categoryName = 'Uncategorized'
        if (categoryId > 0) {
          const catResult = await executeQuery(
            'SELECT name FROM categories WHERE id = ?',
            [categoryId]
          ) as any[]
          if (catResult.length > 0) {
            categoryName = catResult[0].name
          }
        }

        // Insert domain with category name
        const domainResult = await executeQuery(
          `INSERT INTO domains (name, category, price, status, description, tags, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [name, categoryName, parseFloat(price) || 0, status || 'available', description || '', tags || '']
        ) as any

        // Link domain to category if we have a valid category
        if (categoryId && categoryId > 0) {
          await executeQuery(
            'INSERT INTO domain_categories (domain_id, category_id) VALUES (?, ?)',
            [domainResult.insertId, categoryId]
          )
        }

        importedCount++
      } catch (error) {
        console.error('Error processing record:', error)
        errors.push(`Error processing ${record.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedCount,
      autoCreatedCategories,
      totalRecords: records.length,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('CSV import error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to import CSV',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Simple CSV parser function
function parseCSV(csvContent: string): any[] {
  const lines = csvContent.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim())
    const record: any = {}
    
    headers.forEach((header, index) => {
      record[header] = values[index] || ''
    })
    
    return record
  })
}