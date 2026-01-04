'use client'
import { useState, useEffect } from 'react'

interface Tag {
  id: number
  name: string
  color: string
  domainCount: number
  createdAt: string
  status: 'active' | 'inactive'
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const colorOptions = [
    'bg-red-100 text-red-800',
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800'
  ]

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/tags', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setTags(data.tags || [])
      }
    } catch (error) {
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = async (formData: FormData) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get('name'),
          color: formData.get('color')
        })
      })
      
      const data = await response.json()
      if (data.success) {
        loadTags()
        setShowAddModal(false)
      }
    } catch (error) {
      console.error('Error adding tag:', error)
    }
  }

  const handleUpdateTag = async (formData: FormData) => {
    if (!editingTag) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.get('name'),
          color: formData.get('color')
        })
      })
      
      const data = await response.json()
      if (data.success) {
        loadTags()
        setEditingTag(null)
      }
    } catch (error) {
      console.error('Error updating tag:', error)
    }
  }

  const handleStatusToggle = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken')
      const tag = tags.find(t => t.id === id)
      if (!tag) return

      const response = await fetch(`/api/admin/tags/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: tag.status === 'active' ? 'inactive' : 'active' 
        })
      })
      
      const data = await response.json()
      if (data.success) {
        loadTags()
      }
    } catch (error) {
      console.error('Error updating tag status:', error)
    }
  }

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tag?')) return
    
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/tags/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      if (data.success) {
        loadTags()
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
    }
  }

  const filteredTags = tags.filter(tag => {
    const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || tag.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tags Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Tag
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Tags</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{tags.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Active Tags</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {tags.filter(tag => tag.status === 'active').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Domains</div>
          <div className="mt-2 text-3xl font-bold text-purple-600">
            {tags.reduce((sum, tag) => sum + tag.domainCount, 0)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredTags.length} tags found
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">Loading tags...</p>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-500">No tags found</p>
          </div>
        ) : (
          filteredTags.map((tag) => (
            <div key={tag.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tag.color}`}>
                  {tag.name}
                </span>
                <button
                  onClick={() => handleStatusToggle(tag.id)}
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tag.status)} hover:opacity-80 cursor-pointer`}
                >
                  {tag.status}
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{tag.domainCount}</span> domains
                </div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(tag.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setEditingTag(tag)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingTag) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-medium mb-4">
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </h2>
            <form onSubmit={editingTag ? handleUpdateTag : handleAddTag}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tag Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingTag?.name}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Enter tag name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color</label>
                  <select
                    name="color"
                    defaultValue={editingTag?.color || colorOptions[0]}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {colorOptions.map((color, index) => (
                      <option key={index} value={color}>
                        {color.split(' ')[0].replace('bg-', '').replace('-100', '')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingTag(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingTag ? 'Update' : 'Add'} Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}