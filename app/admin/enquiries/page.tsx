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
      
      const data = await response.json()
      if (data.success) {
        setEnquiries(data.enquiries || [])
      }
    } catch (error) {
      console.error('Error loading enquiries:', error)
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

  // Add this function to your admin enquiries page
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
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setSelectedEnquiry(data.enquiry)
      } else {
        setSelectedEnquiry(enquiry)
      }
    } catch (error) {
      console.error('Error loading enquiry details:', error)
      setSelectedEnquiry(enquiry)
    } finally {
      setIsModalOpen(true)
    }
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

      {/* Enquiries List */}
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
          filteredEnquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white p-6 rounded-lg shadow">
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
              {enquiry.type.charAt(0).toUpperCase() + enquiry.type.slice(1)}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            From: <span className="font-medium">{enquiry.name}</span> ({enquiry.email})
          </div>
          
          {/* Show domain if it's a domain-related enquiry */}
          {enquiry.domain_name && (
            <div className="text-sm text-gray-600 mb-2">
              Domain: <span className="font-medium">{enquiry.domain_name}</span>
            </div>
          )}
          
          {/* Show contact form source if no domain */}
          {!enquiry.domain_name && (
            <div className="text-sm text-gray-600 mb-2">
              Source: <span className="font-medium">Contact Form</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {new Date(enquiry.created_at).toLocaleString()}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-700">{enquiry.message}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => updateEnquiryStatus(enquiry.id, 'read')}
            className={`px-3 py-1 text-sm rounded ${
              enquiry.status !== 'new' ? 'bg-blue-600 text-white cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } transition-colors`}
            disabled={enquiry.status !== 'new'}
          >
            Mark as Read
          </button>
          <button
            onClick={() => updateEnquiryStatus(enquiry.id, 'replied')}
            className={`px-3 py-1 text-sm rounded ${
              enquiry.status === 'replied' ? 'bg-yellow-600 text-white cursor-not-allowed' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            } transition-colors`}
            disabled={enquiry.status === 'replied'}
          >
            Mark as Replied
          </button>
          <button
            onClick={() => updateEnquiryStatus(enquiry.id, 'closed')}
            className={`px-3 py-1 text-sm rounded ${
              enquiry.status === 'closed' ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-green-100 text-green-700 hover:bg-green-200'
            } transition-colors`}
            disabled={enquiry.status === 'closed'}
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
          View Details →
        </button>
      </div>
    </div>
          ))
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