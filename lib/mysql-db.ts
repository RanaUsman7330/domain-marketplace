import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

// Get MySQL connection pool
export function getConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'domain_marketplace',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
  return pool
}

// Execute a query in the MySQL database
export async function executeQuery(query: string, params: any[] = []) {
  const connection = getConnection()
  try {
    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

export default getConnection
