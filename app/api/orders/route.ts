// /app/api/orders/route.ts - COMPLETE FIXED VERSION
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// ------------------ GET ORDERS ------------------
export async function GET(request: NextRequest) {
  try {
    console.log('=== FETCH ORDERS API ===')

    const orders = await executeQuery(`
      SELECT 
        o.id,
        o.order_number as orderNumber,
        o.domain_id as domainId,
        o.domain_name as domainName,
        o.buyer_name as buyerName,
        o.buyer_email as buyerEmail,
        o.price as totalAmount,
        o.status,
        o.payment_method as paymentMethod,
        o.payment_status as paymentStatus,
        o.created_at as createdAt
      FROM orders o
      ORDER BY o.created_at DESC
      LIMIT 10
    `) as any[]

    console.log(`Orders fetched: ${orders.length}`)

    return NextResponse.json({
      success: true,
      orders: orders || [],
      count: orders.length
    })
  } catch (error: any) {
    console.error('GET Orders error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load orders',
      debug: error.message 
    }, { status: 500 })
  }
}

// ------------------ CREATE ORDER ------------------
export async function POST(request: NextRequest) {
  try {
    console.log('\n🚀 === ORDER API STARTED === 🚀')
    console.log('Timestamp:', new Date().toISOString())
    console.log('Request method:', request.method)
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))

    // Read raw body
    let bodyText
    try {
      bodyText = await request.text()
      console.log('Raw request body:', bodyText)
    } catch (textError) {
      console.error('❌ Error reading request body:', textError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to read request body' 
      }, { status: 400 })
    }

    // Parse JSON safely
    let body
    try {
      body = JSON.parse(bodyText)
      console.log('✅ Parsed body successfully:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      console.error('Problematic text:', bodyText)
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid JSON format',
        debug: parseError.message,
        rawBody: bodyText 
      }, { status: 400 })
    }

    const { items, billingInfo, paymentMethod, total } = body

    // ------------------ VALIDATION ------------------
    console.log('📦 Items validation:')
    console.log('  - items exists:', !!items)
    console.log('  - items is array:', Array.isArray(items))
    console.log('  - items length:', items?.length)
    
    console.log('👤 Billing Info validation:')
    console.log('  - billingInfo exists:', !!billingInfo)
    console.log('  - billingInfo keys:', billingInfo ? Object.keys(billingInfo) : 'none')
    
    console.log('💳 Payment Method validation:')
    console.log('  - paymentMethod exists:', !!paymentMethod)
    console.log('  - paymentMethod.type:', paymentMethod?.type)
    
    console.log('💰 Total validation:')
    console.log('  - total exists:', !!total)
    console.log('  - total value:', total)

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'No items provided or items is not an array' }, { status: 400 })
    }
    if (!billingInfo || typeof billingInfo !== 'object') {
      return NextResponse.json({ success: false, error: 'Billing info is missing or invalid' }, { status: 400 })
    }
    if (!paymentMethod || typeof paymentMethod !== 'object') {
      return NextResponse.json({ success: false, error: 'Payment method is missing or invalid' }, { status: 400 })
    }
    if (!total || typeof total !== 'number' || total <= 0) {
      return NextResponse.json({ success: false, error: 'Total amount is missing or invalid' }, { status: 400 })
    }

    // Check required billing fields
    const requiredBillingFields = ['firstName', 'lastName', 'email', 'phone']
    for (const field of requiredBillingFields) {
      if (!billingInfo[field]) {
        return NextResponse.json({ success: false, error: `Missing required billing field: ${field}` }, { status: 400 })
      }
    }

    console.log('✅ All validation passed')

  // ------------------ GET USER ID ------------------
const authHeader = request.headers.get('authorization')
const token = authHeader?.replace('Bearer ', '') || 'guest-token'
console.log('🔑 Token:', token)

let userId = null // Change from 0 to null for guests

if (token !== 'guest-token') {
  const users = await executeQuery('SELECT id FROM users WHERE email = ?', ['user@example.com']) as any[]
  console.log('User lookup result:', users)
  if (users.length > 0) {
    userId = users[0].id
  }
}

console.log('👤 Final userId:', userId)

// ------------------ GENERATE ORDER NUMBER ------------------
const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
console.log('📋 Order number:', orderNumber)

// ------------------ PAYMENT METHOD MAPPING ------------------
const paymentMethodMap: Record<string, string> = {
  'card': 'credit_card',
  'bank': 'bank_transfer',
  'email': 'email_request'
}
console.log('💳 Payment method mapping:', paymentMethod.type, '->', paymentMethodMap[paymentMethod.type])

// ------------------ CREATE ORDERS ------------------
console.log('📝 Creating orders for items:', items.length)
const createdOrders: number[] = []

for (let i = 0; i < items.length; i++) {
  const item = items[i]
  console.log(`\n--- Processing item ${i + 1}/${items.length} ---`)
  
  // FIX: Use correct field names from your cart data structure
  const itemId = item.domainId || item.id
  const itemName = item.domainName || item.name
  const itemPrice = parseFloat(item.price) || 0
  const itemYears = item.years || 1
  const itemTotal = itemPrice * itemYears
  
  console.log('Mapped fields:')
  console.log('  itemId (domainId):', itemId)
  console.log('  itemName (domainName):', itemName)
  console.log('  itemPrice (price):', itemPrice)
  console.log('  itemYears (years):', itemYears)
  console.log('  itemTotal:', itemTotal)

  // Validate required fields
  if (!itemId || !itemName) {
    console.error(`❌ Missing required fields for item ${i + 1}:`)
    console.error('  itemId:', itemId)
    console.error('  itemName:', itemName)
    throw new Error(`Item ${i + 1} missing required fields`)
  }

  try {
    console.log('📝 SQL Parameters for item', i + 1, ':')
    console.log('  1. orderNumber:', orderNumber + '-' + itemId)
    console.log('  2. userId:', userId)
    console.log('  3. itemId:', itemId)
    console.log('  4. itemName:', itemName)
    console.log('  5. buyerName:', `${billingInfo.firstName} ${billingInfo.lastName}`)
    console.log('  6. buyerEmail:', billingInfo.email)
    console.log('  7. itemTotal:', itemTotal)
    console.log('  8. status: pending')
    console.log('  9. paymentMethod:', paymentMethodMap[paymentMethod.type] || 'manual')
    console.log('  10. paymentStatus: pending')

    // For guests (userId = null), we need to handle the foreign key constraint
    // Option 1: Create a guest user
    // Option 2: Use a default guest user ID
    // Option 3: Make user_id nullable in database
    
    // Let's use Option 2: Create/find a guest user
    let finalUserId = userId
    if (!finalUserId) {
      // Check if guest user exists, if not create one
      const guestUsers = await executeQuery(
        'SELECT id FROM users WHERE email = ?',
        ['guest@example.com']
      ) as any[]
      
      if (guestUsers.length > 0) {
        finalUserId = guestUsers[0].id
      } else {
        // Create guest user
        const guestResult = await executeQuery(
          'INSERT INTO users (name, email, role, created_at) VALUES (?, ?, ?, NOW())',
          ['Guest User', 'guest@example.com', 'guest']
        ) as any
        finalUserId = guestResult.insertId
      }
    }

    console.log('Using final userId:', finalUserId)

    const orderResult = await executeQuery(
      `INSERT INTO orders 
      (order_number, user_id, domain_id, domain_name, buyer_name, buyer_email, 
       price, status, payment_method, payment_status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        orderNumber + '-' + itemId,
        finalUserId,  // Use the resolved user ID
        itemId,
        itemName,
        `${billingInfo.firstName} ${billingInfo.lastName}`,
        billingInfo.email,
        itemTotal,
        'pending', 
        paymentMethodMap[paymentMethod.type] || 'manual',
        'pending'
      ]
    ) as any

    console.log('✅ Order created successfully:', orderResult.insertId)
    createdOrders.push(orderResult.insertId)

    console.log('Updating domain status to pending...')
    await executeQuery('UPDATE domains SET status = ? WHERE id = ?', ['pending', itemId])
    console.log('✅ Domain status updated')

  } catch (dbError: any) {
    console.error(`❌ Database error for item ${i + 1}:`, dbError)
    throw dbError
  }
}

    console.log(`\n🎉 SUCCESS: Created ${createdOrders.length} orders`)
    console.log('Created order IDs:', createdOrders)

    return NextResponse.json({
      success: true,
      message: 'Order placed successfully',
      orderId: createdOrders[0],
      orderNumber,
      totalOrders: createdOrders.length
    })

  } catch (error: any) {
    console.error('\n❌ FINAL CATCH ERROR:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create order',
      debug: error.message,
      errorName: error.name,
      errorCode: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack 
    }, { status: 500 })
  }
}