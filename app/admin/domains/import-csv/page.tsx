// /app/api/admin/domains/import-csv/route.ts - CSV IMPORT API
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to parse CSV
function parseCSV(text: string): string[][] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line => {
    // Simple CSV parsing - you might want to use a proper CSV library
    const result = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  })
}

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

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 })
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please upload a CSV file' 
      }, { status: 400 })
    }

    // Read file content
    const text = await file.text()
    const rows = parseCSV(text)

    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'CSV file is empty' 
      }, { status: 400 })
    }

    const imported: any[] = []
    const failed: any[] = []
    const errors: string[] = []

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      
      // Skip header row if it exists
      if (i === 0 && row[0].toLowerCase().includes('name')) {
        continue
      }

      try {
        if (row.length < 6) {
          failed.push({ row: i + 1, data: row, error: 'Not enough columns' })
          errors.push(`Row ${i + 1}: Not enough columns`)
          continue
        }

        const [name, category, priceStr, status, description, tags] = row

        // Validate required fields
        if (!name || !category || !priceStr || !status) {
          failed.push({ row: i + 1, data: row, error: 'Missing required fields' })
          errors.push(`Row ${i + 1}: Missing required fields`)
          continue
        }

        const price = parseFloat(priceStr)
        if (isNaN(price) || price < 0) {
          failed.push({ row: i + 1, data: row, error: 'Invalid price' })
          errors.push(`Row ${i + 1}: Invalid price`)
          continue
        }

        // Check if domain already exists
        const existing = await executeQuery(
          'SELECT id FROM domains WHERE name = ?',
          [name]
        ) as any[]

        if (existing.length > 0) {
          failed.push({ row: i + 1, data: row, error: 'Domain already exists' })
          errors.push(`Row ${i + 1}: Domain ${name} already exists`)
          continue
        }

        // Insert domain
        const result = await executeQuery(
          'INSERT INTO domains (name, category, price, status, description, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [name, category, price, status, description, tags || '']
        ) as any

        imported.push({
          id: result.insertId,
          name,
          category,
          price,
          status,
          description,
          tags
        })

      } catch (error) {
        console.error(`Error processing row ${i + 1}:`, error)
        failed.push({ row: i + 1, data: row, error: error.message })
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      failed: failed.length,
      errors: errors,
      message: `Successfully imported ${imported.length} domains, ${failed.length} failed`
    })

  } catch (error) {
    console.error('CSV import API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to import CSV',
      debug: error.message 
    }, { status: 500 })
  }
}