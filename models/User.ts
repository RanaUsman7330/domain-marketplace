import { executeQuery } from '@/lib/mysql-db'
import bcrypt from 'bcryptjs'

export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  last_login: string | null
}

export const User = {
  // Create user
  async create(userData: Partial<User>) {
    const hashedPassword = await bcrypt.hash(userData.password!, 12)
    const result = await executeQuery(
      'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [userData.name, userData.email, hashedPassword, userData.role || 'user', 'active']
    ) as any
    return result.insertId
  },

  // Find user by email
  async findOne(query: { email: string }) {
    const users = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      [query.email]
    ) as User[]
    return users[0] || null
  },

  // Find user by ID
  async findById(id: number) {
    const users = await executeQuery(
      'SELECT * FROM users WHERE id = ?',
      [id]
    ) as User[]
    return users[0] || null
  },

  // Compare password
  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
  },

  // Update user
  async update(id: number, userData: Partial<User>) {
    await executeQuery(
      'UPDATE users SET name = ?, email = ?, role = ?, status = ? WHERE id = ?',
      [userData.name, userData.email, userData.role, userData.status, id]
    )
    return this.findById(id)
  },

  // Delete user
  async delete(id: number) {
    await executeQuery('DELETE FROM users WHERE id = ?', [id])
    return true
  }
}