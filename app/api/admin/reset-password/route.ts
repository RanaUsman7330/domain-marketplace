import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/mysql-db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { newPassword } = await request.json()
    
    console.log('=== ADMIN PASSWORD RESET ===')
    console.log('Resetting admin password to:', newPassword)
    
    // Generate correct hash
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log('Generated hash:', hashedPassword)
    
    // Update admin password
    const result = await executeQuery(
      'UPDATE users SET password = ? WHERE email = ? AND role = ?',
      [hashedPassword, 'admin@example.com', 'admin']
    )

    console.log('Update result:', result)
    
    return NextResponse.json({ 
      success: true, 
      message: `Admin password updated to: ${newPassword}`,
      hash: hashedPassword
    })

  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json({ 
      error: 'Failed to reset password',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}