import { NextRequest, NextResponse } from 'next/server'
import { generateToken, verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    // Test token generation
    const testToken = generateToken('2')
    console.log('Generated token:', testToken)
    
    // Test token verification
    const decoded = verifyToken(testToken)
    console.log('Decoded token:', decoded)
    
    return NextResponse.json({
      success: true,
      generated_token: testToken,
      decoded_token: decoded,
      secret: process.env.JWT_SECRET ? 'Set' : 'Missing'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}