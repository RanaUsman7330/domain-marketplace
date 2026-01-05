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

export default function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onStatusUpdate
}: OrderDetailModalProps) {
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
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - ${order.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .invoice-header { text-align: center; margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #ddd; }
    .total { text-align: right; font-size: 18px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="invoice-header">
    <h1>DOMAIN MARKETPLACE</h1>
    <h2>INVOICE</h2>
    <p>Order #: ${order.orderNumber}</p>
    <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
  </div>

  <h3>Bill To</h3>
  <p><strong>${order.buyerName}</strong></p>
  <p>${order.buyerEmail}</p>
  <p>${order.buyerPhone || ''}</p>

  <h3>Order Details</h3>
  <table>
    <tr>
      <td><strong>Domain</strong></td>
      <td>${order.domainName}</td>
    </tr>
    <tr>
      <td><strong>Payment Method</strong></td>
      <td>${order.paymentMethod.replace('_', ' ')}</td>
    </tr>
    <tr>
      <td><strong>Status</strong></td>
      <td>${order.status}</td>
    </tr>
  </table>

  <p class="total">Total: $${order.totalAmount.toLocaleString()}</p>
</body>
</html>
`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(invoiceHTML)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-2xl">×</button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold mb-4">Order Information</h3>
              <p><b>Order #:</b> {order.orderNumber}</p>
              <p><b>Date:</b> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><b>Total:</b> ${order.totalAmount.toLocaleString()}</p>
              <p><b>Payment:</b> {order.paymentMethod}</p>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Domain Details</h3>
              <p>{order.domainName}</p>
              <p>ID: {order.domainId}</p>
            </div>
          </div>

                    {/* Buyer Information - Complete Details with NULL handling */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Buyer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{order.buyerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email Address</p>
                <p className="font-medium">{order.buyerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
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
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Complete Address</p>
                    <p className="font-medium">
                      {order.billingInfo.city}, {order.billingInfo.state} {order.billingInfo.zipCode}, {order.billingInfo.country}
                    </p>
                  </div>
                  {order.billingInfo.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Street Address</p>
                      <p className="font-medium">{order.billingInfo.address}</p>
                    </div>
                  )}
                </>
              )}
              
              {!order.billingInfo && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 italic">No additional billing information available</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={handleExportInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Export Invoice
            </button>

            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
