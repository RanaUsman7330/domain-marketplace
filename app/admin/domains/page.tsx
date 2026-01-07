// File: /app/admin/domains/page.tsx - COMPLETE UPDATE

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

interface Domain {
  id: number
  name: string
  category: string
  price: number
  status: 'available' | 'sold' | 'auction' | 'pending'
  description: string
  tags: string
  views: number
  offers: number
  created_at: string
  updated_at: string
  extension: string
  length: number
}

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const { user } = useAdminAuth()

  useEffect(() => {
    loadDomains()
  }, [])

  const loadDomains = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/domains', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setDomains(data.domains || [])
      }
    } catch (error) {
      console.error('Error loading domains:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteDomain = async (id: number) => {
    if (!confirm('Are you sure you want to delete this domain?')) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        loadDomains() // Refresh list
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  // Filter and sort domains
  const filteredDomains = domains
    .filter(domain => {
      const matchesSearch = domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           domain.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || domain.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || domain.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Domain]
      const bValue = b[sortBy as keyof Domain]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

  const categories = Array.from(new Set(domains.map(d => d.category).filter(Boolean)))
  const statuses = ['available', 'sold', 'auction', 'pending']

  // Helper function to format date properly
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return 'Invalid Date'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Domain Management</h1>
        <Link
          href="/admin/domains/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <span className="mr-2">+</span>
          Add New Domain
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search domains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-desc">Price High-Low</option>
              <option value="price-asc">Price Low-High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Domains</h3>
          <p className="text-2xl font-bold text-blue-600">{filteredDomains.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="text-2xl font-bold text-green-600">
            {filteredDomains.filter(d => d.status === 'available').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">In Auction</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredDomains.filter(d => d.status === 'auction').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Sold</h3>
          <p className="text-2xl font-bold text-gray-600">
            {filteredDomains.filter(d => d.status === 'sold').length}
          </p>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Offers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Loading domains...
                  </td>
                </tr>
              ) : filteredDomains.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No domains found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredDomains.map((domain) => (
                  <tr key={domain.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <Link 
                          href={`/admin/domains/${encodeURIComponent(domain.name)}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {domain.name}
                        </Link>
                        <div className="text-sm text-gray-500">
                          .{domain.name.split('.').pop()?.toLowerCase() || 'com'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.category || 'Uncategorized'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${domain.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        domain.status === 'available' ? 'bg-green-100 text-green-800' :
                        domain.status === 'sold' ? 'bg-red-100 text-red-800' :
                        domain.status === 'auction' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {domain.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {domain.offers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(domain.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/admin/domains/${domain.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteDomain(domain.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}