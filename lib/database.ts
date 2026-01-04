import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'domain_user',
  password: process.env.DB_PASSWORD || 'your_password',
  database: process.env.DB_NAME || 'domain_marketplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

export default pool