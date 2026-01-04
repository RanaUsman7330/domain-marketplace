'use client'
import { useState } from 'react'

interface Page {
  _id: string
  title: string
  slug: string
  content: string
  status: 'draft' | 'published' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function AdminCMSPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)

  // Mock pages data - in real app this would come from API
  const [pages, setPages] = useState<Page[]>([
    {
      _id: '1',
      title: 'About Us',
      slug: 'about',
      content: 'DomainHub is your premier destination for buying and selling premium domains...',
      status: 'published',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    {
      _id: '2',
      title: 'How It Works',
      slug: 'how-it-works',
      content: 'Our platform makes it easy to buy and sell domains...',
      status: 'published',
      createdAt: '2024-01-02',
      updatedAt: '2024-01-10'
    },
    {
      _id: '3',
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'Your privacy is important to us...',
      status: 'published',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-12'
    }
  ])

  const filteredPages = pages.filter((page: Page) => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddPage = async (formData: FormData) => {
    const newPage = {
      _id: Date.now().toString(),
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'draft' | 'published' | 'archived',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPages(prev => [...prev, newPage])
    setShowAddModal(false)
  }

  const handleUpdatePage = async (formData: FormData) => {
    if (!editingPage) return
    
    const updatedPage = {
      ...editingPage,
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      status: formData.get('status') as 'draft' | 'published' | 'archived',
      updatedAt: new Date().toISOString()
    }
    
    setPages(prev => prev.map(p => p._id === editingPage._id ? updatedPage : p))
    setEditingPage(null)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    setPages(prev => prev.map(p => 
      p._id === id ? { ...p, status: newStatus as Page['status'], updatedAt: new Date().toISOString() } : p
    ))
  }

  const handleDeletePage = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      setPages(prev => prev.filter(p => p._id !== id))
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">CMS Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Page
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Pages</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{pages.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Published</div>
          <div className="mt-2 text-3xl font-bold text-green-600">
            {pages.filter((p: Page) => p.status === 'published').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Drafts</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {pages.filter((p: Page) => p.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Archived</div>
          <div className="mt-2 text-3xl font-bold text-gray-600">
            {pages.filter((p: Page) => p.status === 'archived').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search pages..."
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
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredPages.length} pages found
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPages.map((page: Page) => (
              <tr key={page._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {page.content}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    /{page.slug}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={page.status}
                    onChange={(e) => handleStatusChange(page._id, e.target.value)}
                    className={`text-xs rounded-full px-2 py-1 border-0 ${getStatusColor(page.status)}`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(page.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(page.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => setSelectedPage(page)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingPage(page)}
                    className="text-green-600 hover:text-green-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePage(page._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Page Modal */}
      {selectedPage && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-medium">{selectedPage.title}</h2>
              <button
                onClick={() => setSelectedPage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug</label>
                  <p className="mt-1 text-sm text-gray-900">/{selectedPage.slug}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPage.status)}`}>
                    {selectedPage.status}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedPage.content}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPage.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedPage.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPage(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingPage) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">
              {editingPage ? 'Edit Page' : 'Add New Page'}
            </h2>
            <form onSubmit={editingPage ? handleUpdatePage : handleAddPage}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingPage?.title}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      defaultValue={editingPage?.slug}
                      required
                      pattern="[a-z0-9-]+"
                      title="Only lowercase letters, numbers, and hyphens allowed"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    name="content"
                    defaultValue={editingPage?.content}
                    rows={10}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select name="status" defaultValue={editingPage?.status || 'draft'} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingPage(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingPage ? 'Update' : 'Add'} Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}