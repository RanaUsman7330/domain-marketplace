'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Domain {
  id: number
  name: string
  category: string
  price: number
  status: string
  description: string
  tags: string
  views: number
  offers: number
  created_at: string
  updated_at: string
  extension: string
  length: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  seo_tags?: string
}

export default function AdminDomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [domainId, setDomainId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    status: 'available',
    description: '',
    tags: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    seo_tags: ''
  })

  // Unwrap params properly
  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params
      setDomainId(unwrappedParams.id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (domainId) {
      loadDomain()
    }
  }, [domainId])

  const loadDomain = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${domainId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success && data.domain) {
        setDomain(data.domain)
        setFormData({
          name: data.domain.name,
          category: data.domain.category,
          price: data.domain.price.toString(),
          status: data.domain.status,
          description: data.domain.description || '',
          tags: data.domain.tags || '',
          meta_title: data.domain.meta_title || '',
          meta_description: data.domain.meta_description || '',
          meta_keywords: data.domain.meta_keywords || '',
          seo_tags: data.domain.seo_tags || ''
        })
      }
    } catch (error) {
      console.error('Error loading domain:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${domainId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Domain updated successfully!')
        setEditing(false)
        loadDomain()
      }
    } catch (error) {
      console.error('Error updating domain:', error)
      alert('Failed to update domain')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this domain?')) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${domainId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Domain deleted successfully!')
        router.push('/admin/domains')
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading domain details...</div>
        </div>
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Domain not found</p>
            <Link href="/admin/domains" className="text-blue-600 hover:text-blue-800">
              ← Back to domains
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/admin/domains" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
              ← Back to domains
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Domain Details</h1>
            <p className="text-gray-600 mt-2">{domain.name}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editing ? 'Cancel Edit' : 'Edit Domain'}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete Domain
            </button>
          </div>
        </div>

        {/* Domain Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Domain Name</h3>
            <p className="text-xl font-bold text-gray-900">{domain.name}</p>
            <p className="text-sm text-gray-500">.{domain.extension || domain.name.split('.').pop()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="text-2xl font-bold text-green-600">${domain.price.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              domain.status === 'available' ? 'bg-green-100 text-green-800' :
              domain.status === 'sold' ? 'bg-red-100 text-red-800' :
              domain.status === 'auction' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {domain.status}
            </span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="text-lg font-semibold text-gray-900">{domain.category || 'Uncategorized'}</p>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Domain</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="auction">Auction</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="premium, brandable, short"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SEO Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                      placeholder="Premium Domain for Sale - {domain.name}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                      rows={3}
                      placeholder="Brief description for search engines"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords</label>
                    <input
                      type="text"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({...formData, meta_keywords: e.target.value})}
                      placeholder="domain, premium, brandable"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SEO Tags</label>
                    <input
                      type="text"
                      value={formData.seo_tags}
                      onChange={(e) => setFormData({...formData, seo_tags: e.target.value})}
                      placeholder="premium-domain, business-domain, tech-domain"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Domain Info Display */}
        {!editing && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Domain Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-gray-900">{domain.description || 'No description available'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {domain.tags ? domain.tags.split(',').map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                        {tag.trim()}
                      </span>
                    )) : <span className="text-gray-500">No tags</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Preview */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Preview</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Meta Title</h3>
                  <p className="text-gray-900 font-medium">{domain.meta_title || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Meta Description</h3>
                  <p className="text-gray-900">{domain.meta_description || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Meta Keywords</h3>
                  <p className="text-gray-900">{domain.meta_keywords || 'Not set'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">SEO Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {domain.seo_tags ? domain.seo_tags.split(',').map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                        {tag.trim()}
                      </span>
                    )) : <span className="text-gray-500">No SEO tags</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}