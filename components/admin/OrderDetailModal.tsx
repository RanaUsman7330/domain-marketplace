// /components/admin/OrderDetailModal.tsx - COMPLETE ORDER DETAIL MODAL
'use client'
import { useState } from 'react'

interface Order {
  id: number
  orderNumber: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  domainName: string
  domainId: number
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod: string
  createdAt: string
  billingInfo?: {
    firstName: string
    lastName: string
    company: string
    country: string
    city: string
    state: string
    zipCode: string
  }
}

interface OrderDetailModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: number, newStatus: string) => void
}

export default function OrderDetailModal({ order, isOpen, onClose, onStatusUpdate }: OrderDetailModalProps) {
  const [statusLoading, setStatusLoading] = useState(false)

  if (!order || !isOpen) return null

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusLoading(true)
    try {
      await onStatusUpdate(order.id, newStatus)
    } catch (error) {
      console.error('Status update failed:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const handleExportInvoice = () => {
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
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>DOMAIN MARKETPLACE</h1>
          <h2>INVOICE</h2>
          <p>Order #: ${order.orderNumber}</p>
          <p>Date: ${invoiceData.date}</p>
        </div>
        
        <div class="invoice-details">
          <h3>Bill To:</h3>
          <p><strong>${order.buyerName}</strong></p>
          <p>${order.buyerEmail}</p>
          <p>${order.buyerPhone}</p>
          ${order.billingInfo ? `
            <p>${order.billingInfo.company || ''}</p>
            <p>${order.billingInfo.city}, ${order.billingInfo.state} ${order.billingInfo.zipCode}</p>
            <p>${order.billingInfo.country}</p>
          ` : ''}
        </div>
        
        <div class="order-details">
          <h3>Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td><strong>Domain:</strong></td>
              <td>${order.domainName}</td>
            </tr>
            <tr>
              <td><strong>Amount:</strong></td>
              <td>$${parseFloat(order.totalAmount).toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Payment Method:</strong></td>
              <td>${order.paymentMethod.replace('_', ' ')}</td>
            </tr>
            <tr>
              <td><strong>Payment Status:</strong></td>
              <td><span class="status status-${order.paymentStatus}">${order.paymentStatus}</span></td>
            </tr>
            <tr>
              <td><strong>Order Status:</strong></td>
              <td><span class="status status-${order.status}">${order.status}</span></td>
            </tr>
          </table>
        </div>
        
        <div class="total">
          <p>Total Amount: $${parseFloat(order.totalAmount).toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; color: #666;">
          <p>Thank you for your order!</p>
          <p>For support, contact: support@domainmarketplace.com</p>
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
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order #:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-semibold">${parseFloat(order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span>{order.paymentMethod.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Domain Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain:</span>
                  <span className="font-medium">{order.domainName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Domain ID:</span>
                  <span>{order.domainId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Buyer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{order.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{order.buyerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{order.buyerPhone || 'Not provided'}</p>
              </div>
              {order.billingInfo && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">{order.billingInfo.company || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Country</p>
                    <p className="font-medium">{order.billingInfo.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{order.billingInfo.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State/Province</p>
                    <p className="font-medium">{order.billingInfo.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ZIP Code</p>
                    <p className="font-medium">{order.billingInfo.zipCode}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={statusLoading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => {
                    // You can add payment status update here
                    console.log('Payment status update:', e.target.value)
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-3">
              <button
                onClick={handleExportInvoice}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Export Invoice
              </button>
              <button
                onClick={() => {
                  // Send status update email
                  console.log('Sending status email...')
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                Send Status Email
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}