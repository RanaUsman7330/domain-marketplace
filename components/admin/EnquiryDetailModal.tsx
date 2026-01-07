// components/admin/EnquiryDetailModal.tsx
'use client'
import { useState, useEffect } from 'react'

interface Enquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  type: string
  status: 'new' | 'read' | 'replied' | 'closed'
  domain_id?: number
  domain_name?: string
  domain?: string
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
  const [status, setStatus] = useState(enquiry?.status || 'new')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status)
    }
  }, [enquiry])

  if (!isOpen || !enquiry) return null

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      await onStatusUpdate(enquiry.id, newStatus)
      setStatus(newStatus)
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const parseMessage = (message: string) => {
    const lines = message.split('\n').filter(line => line.trim())
    const parsed: any = {
      originalMessage: '',
      inquiryType: '',
      company: '',
      phone: ''
    }

    lines.forEach(line => {
      const trimmed = line.trim()
      if (trimmed.startsWith('Inquiry Type:')) {
        parsed.inquiryType = trimmed.replace('Inquiry Type:', '').trim()
      } else if (trimmed.startsWith('Company:')) {
        parsed.company = trimmed.replace('Company:', '').trim()
      } else if (trimmed.startsWith('Phone:')) {
        parsed.phone = trimmed.replace('Phone:', '').trim()
      } else if (trimmed && !parsed.inquiryType) {
        parsed.originalMessage = trimmed
      }
    })

    return parsed
  }

  const parsedMessage = parseMessage(enquiry.message)
  const statusColors = {
    new: 'bg-green-100 text-green-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-yellow-100 text-yellow-800',
    closed: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Enquiry Details</h2>
              <p className="text-blue-100 mt-1">Complete information about this enquiry</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{enquiry.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-900 font-medium">
                    <a href={`mailto:${enquiry.email}`} className="text-blue-600 hover:underline">
                      {enquiry.email}
                    </a>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  <p className="text-gray-900 font-medium">
                    {parsedMessage.phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                Enquiry Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900 font-medium">{enquiry.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800`}>
                    {enquiry.type}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900 font-medium">
                    {parsedMessage.company || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Inquiry Type</label>
                  <p className="text-gray-900 font-medium">
                    {parsedMessage.inquiryType || 'General'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Domain Information */}
          {(enquiry.domain_name || enquiry.domain) && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <span className="bg-blue-200 text-blue-700 p-2 rounded-full mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </span>
                Domain Information
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-blue-600">Domain</label>
                  <p className="text-blue-900 font-medium text-lg">
                    {enquiry.domain_name || enquiry.domain}
                  </p>
                </div>
                {enquiry.domain_id && (
                  <div>
                    <label className="text-sm font-medium text-blue-600">Domain ID</label>
                    <p className="text-blue-900">#{enquiry.domain_id}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
              <span className="bg-yellow-200 text-yellow-700 p-2 rounded-full mr-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </span>
              Message Content
            </h3>
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {parsedMessage.originalMessage || enquiry.message}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="bg-gray-200 text-gray-700 p-2 rounded-full mr-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">Enquiry Created</p>
                  <p className="text-sm text-gray-600">{new Date(enquiry.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-800">Last Updated</p>
                  <p className="text-sm text-gray-600">{new Date(enquiry.updated_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Management</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[enquiry.status]}`}>
                  {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                </span>
                <span className="text-sm text-gray-600">Current Status</span>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleStatusUpdate('read')}
                  disabled={isUpdating || enquiry.status === 'read'}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleStatusUpdate('replied')}
                  disabled={isUpdating || enquiry.status === 'replied'}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => handleStatusUpdate('closed')}
                  disabled={isUpdating || enquiry.status === 'closed'}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mark as Closed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}