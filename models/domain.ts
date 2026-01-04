// /models/domain.ts
import { executeQuery } from '@/lib/mysql-db'

export interface Domain {
  id: number
  name: string
  category: string
  price: number
  status: 'available' | 'sold' | 'auction' | 'pending'
  description: string
  tags: string
  views: number
  offers: number
  created_at: string
  updated_at: string
}

export const Domain = {
  // Find all domains
  async findAll() {
    return await executeQuery(
      'SELECT * FROM domains ORDER BY created_at DESC'
    ) as Domain[]
  },

  // Find by ID
  async findById(id: number) {
    const domains = await executeQuery(
      'SELECT * FROM domains WHERE id = ?',
      [id]
    ) as Domain[]
    return domains[0] || null
  },

  // Find by name
  async findByName(name: string) {
    const domains = await executeQuery(
      'SELECT * FROM domains WHERE name = ?',
      [name]
    ) as Domain[]
    return domains[0] || null
  },

  // Create domain
  async create(domainData: Partial<Domain>) {
    const result = await executeQuery(
      `INSERT INTO domains (name, category, price, status, description, tags, views, offers) 
       VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
      [
        domainData.name,
        domainData.category,
        domainData.price,
        domainData.status || 'available',
        domainData.description || '',
        domainData.tags || '[]'
      ]
    ) as any
    return result.insertId
  },

  // Update domain
  async update(id: number, domainData: Partial<Domain>) {
    await executeQuery(
      `UPDATE domains 
       SET name = ?, category = ?, price = ?, status = ?, description = ?, tags = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        domainData.name,
        domainData.category,
        domainData.price,
        domainData.status,
        domainData.description,
        domainData.tags,
        id
      ]
    )
    return this.findById(id)
  },

  // Delete domain
  async delete(id: number) {
    await executeQuery('DELETE FROM domains WHERE id = ?', [id])
    return true
  }
}