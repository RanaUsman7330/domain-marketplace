// /models/Orders.js - Based on your actual database structure
import { executeQuery } from '@/lib/mysql-db'

export class OrdersModel {
  // Get all orders with complete details
  static async getAllOrders(limit = 100) {
    const query = `
      SELECT 
        o.id,
        o.order_number as orderNumber,
        o.user_id as userId,
        o.domain_id as domainId,
        o.domain_name as domainName,
        o.buyer_name as buyerName,
        o.buyer_email as buyerEmail,
        o.buyer_phone as buyerPhone,
        o.billing_info as billingInfo,
        o.seller_name as sellerName,
        o.seller_email as sellerEmail,
        o.price as totalAmount,
        o.status,
        o.payment_method as paymentMethod,
        o.payment_status as paymentStatus,
        o.created_at as createdAt,
        o.updated_at as updatedAt,
        o.completed_at as completedAt,
        u.name as userName,
        u.email as userEmail,
        u.role as userRole,
        d.name as domainNameFull,
        d.price as domainPrice,
        d.status as domainStatus,
        d.description as domainDescription
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN domains d ON o.domain_id = d.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `
    
    const results = await executeQuery(query, [limit])
    
    // Process billing info JSON if it exists
    return results.map(order => ({
      ...order,
      billingInfo: order.billingInfo ? (() => {
        try {
          return JSON.parse(order.billingInfo)
        } catch {
          return null
        }
      })() : null
    }))
  }

  // Get single order by ID
  static async getOrderById(orderId) {
    const query = `
      SELECT 
        o.*,
        u.name as userName,
        u.email as userEmail,
        u.role as userRole,
        d.name as domainNameFull,
        d.price as domainPrice,
        d.status as domainStatus,
        d.description as domainDescription
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN domains d ON o.domain_id = d.id
      WHERE o.id = ?
    `
    
    const results = await executeQuery(query, [orderId])
    const order = results[0] || null
    
    if (order && order.billingInfo) {
      try {
        order.billingInfo = JSON.parse(order.billingInfo)
      } catch {
        order.billingInfo = null
      }
    }
    
    return order
  }

  // Update order status
  static async updateOrderStatus(orderId, newStatus) {
    const query = 'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?'
    return await executeQuery(query, [newStatus, orderId])
  }

  // Update payment status
  static async updatePaymentStatus(orderId, paymentStatus) {
    const query = 'UPDATE orders SET payment_status = ?, updated_at = NOW() WHERE id = ?'
    return await executeQuery(query, [paymentStatus, orderId])
  }

  // Get order stats
  static async getOrderStats() {
    const query = `
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedOrders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingOrders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processingOrders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelledOrders,
        SUM(CASE WHEN payment_status = 'paid' THEN price ELSE 0 END) as totalRevenue,
        AVG(price) as avgOrderValue
      FROM orders
    `
    const results = await executeQuery(query)
    return results[0]
  }

  // Get orders by user
  static async getOrdersByUserId(userId) {
    const query = `
      SELECT 
        o.*,
        d.name as domainName
      FROM orders o
      LEFT JOIN domains d ON o.domain_id = d.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `
    return await executeQuery(query, [userId])
  }

  // Create new order
  static async createOrder(orderData) {
    const {
      userId,
      domainId,
      domainName,
      buyerName,
      buyerEmail,
      buyerPhone,
      price,
      paymentMethod,
      billingInfo,
      orderNumber
    } = orderData

    const query = `
      INSERT INTO orders (
        user_id, domain_id, domain_name, buyer_name, buyer_email, 
        buyer_phone, billing_info, price, payment_method, 
        order_number, status, payment_status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending', NOW())
    `
    
    const result = await executeQuery(query, [
      userId, domainId, domainName, buyerName, buyerEmail,
      buyerPhone, JSON.stringify(billingInfo), price, paymentMethod, 
      orderNumber
    ])
    
    return result.insertId
  }

  // Delete order
  static async deleteOrder(orderId) {
    // First delete order items if they exist
    await executeQuery('DELETE FROM order_items WHERE order_id = ?', [orderId])
    // Then delete the order
    return await executeQuery('DELETE FROM orders WHERE id = ?', [orderId])
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber) {
    const query = 'SELECT * FROM orders WHERE order_number = ?'
    const results = await executeQuery(query, [orderNumber])
    return results[0] || null
  }

  // Update domain status when order status changes
  static async updateDomainStatusOnOrderChange(orderId, newStatus) {
    // Get order and domain info
    const order = await this.getOrderById(orderId)
    if (!order) return

    let domainStatus = 'available'
    
    if (newStatus === 'completed') {
      domainStatus = 'sold'
    } else if (newStatus === 'cancelled' || newStatus === 'refunded') {
      domainStatus = 'available'
    } else if (newStatus === 'processing') {
      domainStatus = 'pending'
    }

    // Update domain status
    await executeQuery('UPDATE domains SET status = ? WHERE id = ?', [domainStatus, order.domainId])
  }
}