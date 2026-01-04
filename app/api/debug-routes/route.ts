// /app/api/debug-routes/route.ts - CHECK API ROUTES
import { NextResponse } from 'next/server'

export async function GET() {
  const routes = [
    '/api/cart',
    '/api/orders', 
    '/api/admin/orders',
    '/api/debug-orders'
  ]
  
  const results = {}
  
  for (const route of routes) {
    try {
      const response = await fetch(`http://localhost:3000${route}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      results[route] = {
        status: response.status,
        statusText: response.statusText,
        exists: response.status !== 404
      }
    } catch (error) {
      results[route] = {
        status: 'ERROR',
        error: error.message,
        exists: false
      }
    }
  }
  
  return NextResponse.json({
    success: true,
    routes: results,
    timestamp: new Date().toISOString()
  })
}