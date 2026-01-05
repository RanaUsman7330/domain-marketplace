// /components/admin/EnquiryDetailModal.tsx - Complete enquiry details modal
'use client'
import { useState } from 'react'

interface Enquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  type: string
  status: string
  domain_id?: number
  domain_name?: string
  domain_price?: number
  domain_description?: string
  created_at: string
  updated_at: string
}

interface EnquiryDetailModalProps {
  enquiry: Enquiry | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (enquiryId: number, newStatus: string) => void
}

export default function EnquiryDetailModal({ enquiry, isOpen, onClose, onStatusUpdate }: EnquiryDetailModalProps) {
  const [statusLoading, setStatusLoading] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  if (!enquiry || !isOpen) return null

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusLoading(true)
    try {
      await onStatusUpdate(enquiry.id, newStatus)
    } catch (error) {
      console.error('Status update error:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'read': return 'bg-blue-100 text-blue-800'
      case 'replied': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'domain': return 'bg-purple-100 text-purple-800'
      case 'support': return 'bg-red-100 text-red-800'
      case 'partnership': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Enquiry Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{enquiry.subject}</h3>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(enquiry.status)}`}>
                {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
              </span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeColor(enquiry.type)}`}>
                {enquiry.type.charAt(0).toUpperCase() + enquiry.type.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">From</p>
                <p className="font-medium">{enquiry.name}</p>
                <p className="text-gray-500">{enquiry.email}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-medium">{new Date(enquiry.created_at).toLocaleString()}</p>
                <p className="text-gray-500">Updated: {new Date(enquiry.updated_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Domain Information */}
          {enquiry.domain_name && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Related Domain</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-700">Domain Name</p>
                  <p className="font-medium text-blue-900">{enquiry.domain_name}</p>
                </div>
                {enquiry.domain_price && (
                  <div>
                    <p className="text-sm text-blue-700">Price</p>
                    <p className="font-medium text-blue-900">${enquiry.domain_price.toLocaleString()}</p>
                  </div>
                )}
              </div>
              {enquiry.domain_description && (
                <div className="mt-2">
                  <p className="text-sm text-blue-700">Description</p>
                  <p className="text-blue-900">{enquiry.domain_description}</p>
                </div>
              )}
            </div>
          )}

          {/* Message */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{enquiry.message}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusUpdate('read')}
                disabled={statusLoading || enquiry.status === 'read'}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  enquiry.status === 'read' 
                    ? 'bg-blue-600 text-white cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {statusLoading ? 'Updating...' : 'Mark as Read'}
              </button>
              <button
                onClick={() => handleStatusUpdate('replied')}
                disabled={statusLoading || enquiry.status === 'replied'}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  enquiry.status === 'replied' 
                    ? 'bg-yellow-600 text-white cursor-not-allowed' 
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                {statusLoading ? 'Updating...' : 'Mark as Replied'}
              </button>
              <button
                onClick={() => handleStatusUpdate('closed')}
                disabled={statusLoading || enquiry.status === 'closed'}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  enquiry.status === 'closed' 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {statusLoading ? 'Updating...' : 'Mark as Closed'}
              </button>
            </div>
          </div>

          {/* Reply Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Send Reply</h4>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply message here..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => {
                  if (replyMessage.trim()) {
                    // Here you would implement the reply sending logic
                    alert(`Reply sent to ${enquiry.email}:\n\n${replyMessage}`)
                    setReplyMessage('')
                  } else {
                    alert('Please type a reply message')
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Send Reply
              </button>
              <button
                onClick={() => setReplyMessage('')}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              Enquiry ID: {enquiry.id}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}