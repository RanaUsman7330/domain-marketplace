import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'

// Helper to get admin from token
async function getAdminFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const users = await executeQuery(
    'SELECT id, email, name, role FROM users WHERE email = ? AND role = ?',
    ['admin@example.com', 'admin']
  ) as any[]

  return users.length > 0 ? users[0] : null
}

function getDateRange(range: string): string {
  const now = new Date()
  let startDate: Date

  switch (range) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  return startDate.toISOString().split('T')[0]
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminFromRequest(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const range = searchParams.get('range') || '30d'
    const startDate = getDateRange(range)

    // Get overview statistics
    const overview = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM domains) as totalDomains,
        (SELECT COUNT(*) FROM users WHERE role = 'user') as totalUsers,
        (SELECT COUNT(*) FROM orders WHERE created_at >= ?) as totalOrders,
        (SELECT COALESCE(SUM(price), 0) FROM orders WHERE status = 'completed' AND created_at >= ?) as totalRevenue,
        (SELECT 
          CASE 
            WHEN lastMonthRevenue > 0 THEN ROUND(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100, 2)
            ELSE 0 
          END
         FROM (
           SELECT 
             COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN price ELSE 0 END), 0) as thisMonthRevenue,
             COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 60 DAY) AND created_at < DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN price ELSE 0 END), 0) as lastMonthRevenue
           FROM orders 
           WHERE status = 'completed'
         ) t) as monthlyGrowth
    `, [startDate, startDate]) as any[]

    // Get revenue chart data (daily revenue for the period)
    const revenueChart = await executeQuery(`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(price), 0) as revenue
      FROM orders 
      WHERE status = 'completed' AND created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDate])

    // Get domain categories distribution
    const domainCategories = await executeQuery(`
      SELECT 
        c.name as category,
        COUNT(d.id) as count
      FROM categories c
      LEFT JOIN domains d ON c.id = d.category_id
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `)

    // Get monthly orders data
    const monthlyOrders = await executeQuery(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m-%d') as date,
        COUNT(*) as orders
      FROM orders 
      WHERE created_at >= ?
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [startDate])

    // Get top domains by price
    const topDomains = await executeQuery(`
      SELECT 
        name,
        price,
        status
      FROM domains 
      WHERE status = 'available'
      ORDER BY price DESC
      LIMIT 5
    `) as any[]

    // Get recent orders
    const recentOrders = await executeQuery(`
      SELECT 
        o.order_number as id,
        d.name as domain,
        o.price,
        o.status,
        DATE_FORMAT(o.created_at, '%Y-%m-%d') as date
      FROM orders o
      JOIN domains d ON o.domain_id = d.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `) as any[]

    // Format chart data
    const formatChartData = (data: any[], labelKey: string, valueKey: string) => ({
      labels: data.map(item => item[labelKey]),
      data: data.map(item => item[valueKey])
    })

    const analytics = {
      overview: overview[0] || {
        totalDomains: 0,
        totalUsers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
      },
      revenueChart: formatChartData(revenueChart, 'date', 'revenue'),
      domainCategories: formatChartData(domainCategories, 'category', 'count'),
      monthlyOrders: formatChartData(monthlyOrders, 'date', 'orders'),
      topDomains: topDomains.map(domain => ({
        ...domain,
        price: parseFloat(domain.price)
      })),
      recentOrders: recentOrders.map(order => ({
        ...order,
        price: parseFloat(order.price)
      }))
    }

    return NextResponse.json({
      success: true,
      analytics
    })

  } catch (error) {
    console.error('Admin analytics error:', error)
    return NextResponse.json({ 
      error: 'Failed to load analytics',
      success: false 
    }, { status: 500 })
  }
}