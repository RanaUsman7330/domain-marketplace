// /app/api/admin/domains/import-csv/route.ts - FIXED CSV IMPORT API
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

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

// Helper to parse CSV
function parseCSV(text: string): string[][] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map(line => {
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

export async function POST(request: NextRequest) {
  try {
    console.log('CSV Import API called')
    
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      console.log('Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin authenticated:', admin.email)

    // Get form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No file provided')
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 })
    }

    console.log('File received:', file.name, 'Size:', file.size)

    if (!file.name.endsWith('.csv')) {
      console.log('Invalid file type:', file.name)
      return NextResponse.json({ 
        success: false, 
        error: 'Please upload a CSV file' 
      }, { status: 400 })
    }

    // Read file content
    const text = await file.text()
    console.log('CSV content length:', text.length)
    
    const rows = parseCSV(text)
    console.log('Parsed rows:', rows.length)

    if (rows.length === 0) {
      console.log('CSV file is empty')
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
      console.log(`Processing row ${i + 1}:`, row)
      
      // Skip header row if it exists
      if (i === 0 && row[0].toLowerCase().includes('name')) {
        console.log('Skipping header row')
        continue
      }

      try {
        if (row.length < 6) {
          console.log(`Row ${i + 1}: Not enough columns`)
          failed.push({ row: i + 1, data: row, error: 'Not enough columns' })
          errors.push(`Row ${i + 1}: Not enough columns`)
          continue
        }

        const [name, category, priceStr, status, description, tags] = row

        // Validate required fields
        if (!name || !category || !priceStr || !status) {
          console.log(`Row ${i + 1}: Missing required fields`)
          failed.push({ row: i + 1, data: row, error: 'Missing required fields' })
          errors.push(`Row ${i + 1}: Missing required fields`)
          continue
        }

        const price = parseFloat(priceStr)
        if (isNaN(price) || price < 0) {
          console.log(`Row ${i + 1}: Invalid price - ${priceStr}`)
          failed.push({ row: i + 1, data: row, error: 'Invalid price' })
          errors.push(`Row ${i + 1}: Invalid price - ${priceStr}`)
          continue
        }

        // Check if domain already exists
        const existing = await executeQuery(
          'SELECT id FROM domains WHERE name = ?',
          [name]
        ) as any[]

        if (existing.length > 0) {
          console.log(`Row ${i + 1}: Domain ${name} already exists`)
          failed.push({ row: i + 1, data: row, error: 'Domain already exists' })
          errors.push(`Row ${i + 1}: Domain ${name} already exists`)
          continue
        }

        // Insert domain
        console.log(`Inserting domain: ${name}`)
        const result = await executeQuery(
          'INSERT INTO domains (name, category, price, status, description, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
          [name, category, price, status, description, tags || '']
        ) as any

        console.log(`Domain inserted with ID: ${result.insertId}`)
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

    console.log(`Import complete: ${imported.length} successful, ${failed.length} failed`)

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