// app/admin/enquiries/page.tsx - Updated with detailed information display
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import EnquiryDetailModal from '@/components/admin/EnquiryDetailModal'

interface Enquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  type: 'general' | 'domain' | 'support' | 'partnership'
  status: 'new' | 'read' | 'replied' | 'closed'
  domain_id?: number
  domain_name?: string
  domain?: string // For contact form enquiries
  created_at: string
  updated_at: string
}

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadEnquiries()
  }, [])

  const loadEnquiries = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/enquiries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Enquiries response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Enquiries API error:', response.status, errorText)
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Enquiries data:', data)
      
      if (data.success) {
        setEnquiries(data.enquiries || [])
      } else {
        console.error('Failed to load enquiries:', data.error)
        setEnquiries([])
      }
    } catch (error) {
      console.error('Error loading enquiries:', error)
      setEnquiries([])
      // Show user-friendly error
      alert('Failed to load enquiries: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateEnquiryStatus = async (enquiryId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/enquiries/${enquiryId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        loadEnquiries() // Refresh list
        alert(`Enquiry marked as ${newStatus}. Email notification sent to customer.`)
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error)
      alert('Error updating enquiry status')
    }
  }

  const deleteEnquiry = async (enquiryId: number) => {
    if (!confirm('Are you sure you want to delete this enquiry? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/enquiries/${enquiryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Enquiry deleted successfully')
        loadEnquiries() // Refresh the list
      } else {
        alert('Failed to delete enquiry: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error)
      alert('Error deleting enquiry')
    }
  }

  const viewEnquiryDetails = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry)
    setIsModalOpen(true)
  }

  const parseMessage = (message: string) => {
    const lines = message.split('\n').filter(line => line.trim())
    const parsed: any = {
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
      }
    })

    return parsed
  }

  const filteredEnquiries = enquiries.filter(enquiry => {
    const matchesSearch = enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || enquiry.type === typeFilter
    const matchesStatus = statusFilter === 'all' || enquiry.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const enquiryTypes = ['general', 'domain', 'support', 'partnership']
  const enquiryStatuses = ['new', 'read', 'replied', 'closed']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Enquiry Management</h1>
        <div className="text-sm text-gray-600">
          Total Enquiries: {filteredEnquiries.length}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Enquiries</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredEnquiries.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">New Enquiries</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredEnquiries.filter(e => e.status === 'new').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Awaiting Reply</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredEnquiries.filter(e => e.status === 'read').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Closed</h3>
          <p className="text-2xl font-bold text-gray-600">
            {filteredEnquiries.filter(e => e.status === 'closed').length}
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
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {enquiryTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {enquiryStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries List - Enhanced with detailed information */}
       <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No enquiries found</p>
          </div>
        ) : (
          filteredEnquiries.map((enquiry) => {
            const parsedInfo = parseMessage(enquiry.message)
            return (
              <div key={enquiry.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{enquiry.subject}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        enquiry.status === 'new' ? 'bg-green-100 text-green-800' :
                        enquiry.status === 'read' ? 'bg-blue-100 text-blue-800' :
                        enquiry.status === 'replied' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">
                        {enquiry.type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">From:</span> <span className="text-gray-900">{enquiry.name}</span>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <span className="font-medium">Email:</span> <span className="text-blue-600 hover:underline">{enquiry.email}</span>
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> <span className="text-gray-900">{parsedInfo.phone || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Company:</span> <span className="text-gray-900">{parsedInfo.company || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Inquiry Type:</span> <span className="text-gray-900">{parsedInfo.inquiryType || 'General'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Domain:</span> <span className="text-gray-900">{enquiry.domain_name || enquiry.domain || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> <span className="text-gray-900">{new Date(enquiry.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(enquiry.created_at).toLocaleString()}
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Message:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                      {parsedInfo.originalMessage || enquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateEnquiryStatus(enquiry.id, 'read')}
                      disabled={enquiry.status !== 'new'}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        enquiry.status !== 'new' 
                          ? 'bg-blue-600 text-white cursor-not-allowed' 
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => updateEnquiryStatus(enquiry.id, 'replied')}
                      disabled={enquiry.status === 'replied'}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        enquiry.status === 'replied' 
                          ? 'bg-yellow-600 text-white cursor-not-allowed' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                    >
                      Mark as Replied
                    </button>
                    <button
                      onClick={() => updateEnquiryStatus(enquiry.id, 'closed')}
                      disabled={enquiry.status === 'closed'}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        enquiry.status === 'closed' 
                          ? 'bg-green-600 text-white cursor-not-allowed' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Mark as Closed
                    </button>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteEnquiry(enquiry.id)}
                      className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <button
                    onClick={() => viewEnquiryDetails(enquiry)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Full Details →
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <EnquiryDetailModal
        enquiry={selectedEnquiry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={updateEnquiryStatus}
      />
    </div>
  )
}