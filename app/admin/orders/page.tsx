// /app/admin/orders/page.tsx - Complete Admin Orders Page with All Functionality
'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import OrderDetailModal from '@/components/admin/OrderDetailModal'

interface Order {
  id: number
  orderNumber: string
  userId: number
  buyerName: string
  buyerEmail: string
  buyerPhone?: string
  domainId: number
  domainName: string
  totalAmount: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  billingInfo?: any
  userUsername?: string
  userEmail?: string
}

// Email sending function
const sendOrderStatusEmail = async (orderData: any) => {
  try {
    const response = await fetch('/api/admin/orders/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

export default function AdminOrdersPage() {
  const { user, isLoading: authLoading } = useAdminAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    if (user && !authLoading) {
      fetchOrders()
    }
  }, [user, authLoading])

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders for admin:', user?.email)
      const adminToken = localStorage.getItem('adminToken') || 'admin-token'

      const response = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` }
      })

      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      } else {
        console.error('Failed to load orders:', data.error)
        setOrders([])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    setStatusLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      
      // Get current order details for email
      const currentOrder = orders.find(o => o.id === orderId)
      if (!currentOrder) return

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()
      
      if (data.success) {
        // Send email notification
        const emailData = {
          orderId,
          orderNumber: currentOrder.orderNumber,
          buyerName: currentOrder.buyerName,
          buyerEmail: currentOrder.buyerEmail,
          domainName: currentOrder.domainName,
          newStatus,
          oldStatus: currentOrder.status
        }
        
        const emailResult = await sendOrderStatusEmail(emailData)
        console.log('Email notification result:', emailResult)

        // Refresh orders list
        fetchOrders()
        
        // Show success message
        alert(`Order status updated to ${newStatus}. Email notification sent.`)
      } else {
        alert('Failed to update order status: ' + data.error)
      }
    } catch (error) { 
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    } finally {
      setStatusLoading(false)
    }
  }

  const updatePaymentStatus = async (orderId: number, newStatus: string) => {
    setStatusLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ payment_status: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchOrders()
        alert('Payment status updated successfully')
      } else {
        alert('Failed to update payment status: ' + data.error)
      }
    } catch (error) { 
      console.error('Error updating payment status:', error)
      alert('Error updating payment status')
    } finally {
      setStatusLoading(false)
    }
  }

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const exportOrderInvoice = (order: Order) => {
    // Create invoice data
    const invoiceData = {
      orderNumber: order.orderNumber,
      date: new Date(order.createdAt).toLocaleDateString(),
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      domainName: order.domainName,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      billingInfo: order.billingInfo
    }

    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 20px; }
          .billing-info { margin-bottom: 20px; }
          .order-details { margin-bottom: 20px; }
          .total { text-align: right; font-size: 18px; font-weight: bold; }
          .status { padding: 5px 10px; border-radius: 5px; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-processing { background: #dbeafe; color: #1e40af; }
          .status-completed { background: #d1fae5; color: #065f46; }
          .status-cancelled { background: #fee2e2; color: #991b1b; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          .logo { text-align: center; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="logo">
          <h1 style="color: #2563eb; font-size: 24px;">DOMAIN MARKETPLACE</h1>
          <p style="color: #666;">Premium Domain Trading Platform</p>
        </div>
        
        <div class="invoice-header">
          <h2>INVOICE</h2>
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Date:</strong> ${invoiceData.date}</p>
        </div>
        
        <div class="invoice-details">
          <h3>Bill To:</h3>
          <p><strong>${order.buyerName}</strong></p>
          <p>${order.buyerEmail}</p>
          <p>${order.buyerPhone || 'Phone not provided'}</p>
          ${order.billingInfo ? `
            <p>${order.billingInfo.company || ''}</p>
            <p>${order.billingInfo.address || ''}</p>
            <p>${order.billingInfo.city || ''}, ${order.billingInfo.state || ''} ${order.billingInfo.zipCode || ''}</p>
            <p>${order.billingInfo.country || ''}</p>
          ` : ''}
        </div>
        
        <div class="order-details">
          <h3>Order Details:</h3>
          <table>
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
            <tr>
              <td>Domain Name</td>
              <td>${order.domainName}</td>
              <td>$${parseFloat(order.totalAmount).toLocaleString()}</td>
            </tr>
            <tr style="font-weight: bold;">
              <td colspan="2">Total Amount:</td>
              <td>$${parseFloat(order.totalAmount).toLocaleString()}</td>
            </tr>
          </table>
          
          <p><strong>Payment Method:</strong> ${order.paymentMethod.replace('_', ' ')}</p>
          <p><strong>Payment Status:</strong> <span class="status status-${order.paymentStatus}">${order.paymentStatus}</span></p>
          <p><strong>Order Status:</strong> <span class="status status-${order.status}">${order.status}</span></p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p><strong>Thank you for your order!</strong></p>
          <p>For support, contact: support@domainmarketplace.com</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This is a computer-generated invoice and does not require a signature.
          </p>
        </div>
      </body>
      </html>
    `

    // Open in new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.buyerEmail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.domainName || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter

    return matchesSearch && matchesStatus && matchesPayment
  })

  // Stats
  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount || '0'), 0)
  const completedOrders = filteredOrders.filter(o => o.status === 'completed').length
  const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="text-sm text-gray-600">Total Orders: {totalOrders}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{completedOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg Order Value</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No orders found</td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div>{order.buyerName}</div>
                    <div className="text-gray-500 text-sm">{order.buyerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-blue-600">{order.domainName}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">${parseFloat(order.totalAmount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">{order.paymentMethod.replace('_',' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 space-y-2">
                    <div className="flex flex-col space-y-2">
                      <select 
                        value={order.status} 
                        onChange={e => updateOrderStatus(order.id, e.target.value)} 
                        disabled={statusLoading}
                        className="text-xs border rounded px-2 py-1 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <select 
                        value={order.paymentStatus} 
                        onChange={e => updatePaymentStatus(order.id, e.target.value)} 
                        disabled={statusLoading}
                        className="text-xs border rounded px-2 py-1 w-full"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition flex-1"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => exportOrderInvoice(order)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition flex-1"
                        >
                          Invoice
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={updateOrderStatus}
      />
    </div>
  )
}