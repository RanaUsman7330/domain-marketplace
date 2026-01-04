'use client'
import { useState, useEffect } from 'react'

interface SEOSettings {
  id: number
  page: string
  title: string
  description: string
  keywords: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  structuredData: string
  robots: string
  priority: number
  lastModified: string
}

export default function AdminSEOPage() {
  const [seoSettings, setSeoSettings] = useState<SEOSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSetting, setEditingSetting] = useState<SEOSettings | null>(null)
  const [activeTab, setActiveTab] = useState('pages')

  useEffect(() => {
    loadSEOSettings()
  }, [])

  const loadSEOSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/seo', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setSeoSettings(data.settings || [])
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSEO = async (formData: FormData) => {
    if (!editingSetting) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/seo/${editingSetting.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          keywords: formData.get('keywords'),
          canonicalUrl: formData.get('canonicalUrl'),
          ogTitle: formData.get('ogTitle'),
          ogDescription: formData.get('ogDescription'),
          ogImage: formData.get('ogImage'),
          twitterCard: formData.get('twitterCard'),
          twitterTitle: formData.get('twitterTitle'),
          twitterDescription: formData.get('twitterDescription'),
          twitterImage: formData.get('twitterImage'),
          structuredData: formData.get('structuredData'),
          robots: formData.get('robots'),
          priority: parseInt(formData.get('priority') as string)
        })
      })
      
      const data = await response.json()
      if (data.success) {
        loadSEOSettings()
        setEditingSetting(null)
      }
    } catch (error) {
      console.error('Error updating SEO setting:', error)
    }
  }

  const generateSitemap = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/seo/sitemap', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Sitemap generated successfully!')
      }
    } catch (error) {
      console.error('Error generating sitemap:', error)
    }
  }

  const generateRobotsTxt = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/seo/robots-txt', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Robots.txt generated successfully!')
      }
    } catch (error) {
      console.error('Error generating robots.txt:', error)
    }
  }

  const filteredSettings = seoSettings.filter(setting =>
    setting.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pageSettings = seoSettings.filter(setting => setting.page !== 'sitemap' && setting.page !== 'robots.txt')
  const sitemapSettings = seoSettings.filter(setting => setting.page === 'sitemap')
  const robotsSettings = seoSettings.filter(setting => setting.page === 'robots.txt')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">SEO Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={generateSitemap}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate Sitemap
          </button>
          <button
            onClick={generateRobotsTxt}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Generate Robots.txt
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'pages', name: 'Page SEO' },
              { id: 'sitemap', name: 'Sitemap' },
              { id: 'robots', name: 'Robots.txt' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Page SEO Tab */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              {/* Search */}
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <div className="text-sm text-gray-600">
                  {filteredSettings.length} pages found
                </div>
              </div>

              {/* SEO Settings Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Page
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          Loading SEO settings...
                        </td>
                      </tr>
                    ) : filteredSettings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No SEO settings found
                        </td>
                      </tr>
                    ) : (
                      filteredSettings.map((setting) => (
                        <tr key={setting.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {setting.page}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {setting.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {setting.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {setting.priority}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setEditingSetting(setting)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sitemap Tab */}
          {activeTab === 'sitemap' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">XML Sitemap</h3>
                <p className="text-gray-600 mb-4">
                  Generate and manage your XML sitemap to help search engines discover your pages.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>URL:</strong> /sitemap.xml
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Last Generated:</strong> {sitemapSettings[0]?.lastModified || 'Never'}
                  </p>
                </div>
              </div>
              
              {sitemapSettings.map((setting) => (
                <div key={setting.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Sitemap Settings</h4>
                    <button
                      onClick={() => setEditingSetting(setting)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Priority:</strong> {setting.priority}
                    </div>
                    <div>
                      <strong>Change Frequency:</strong> {setting.ogDescription || 'daily'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Robots.txt Tab */}
          {activeTab === 'robots' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Robots.txt</h3>
                <p className="text-gray-600 mb-4">
                  Control how search engines crawl and index your website.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <strong>URL:</strong> /robots.txt
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Last Generated:</strong> {robotsSettings[0]?.lastModified || 'Never'}
                  </p>
                </div>
              </div>
              
              {robotsSettings.map((setting) => (
                <div key={setting.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Robots.txt Content</h4>
                    <button
                      onClick={() => setEditingSetting(setting)}
                      className="text-blue-600 hover:text-blue-900 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {setting.structuredData || 'User-agent: *\nAllow: /'}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSetting && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium mb-4">
              Edit SEO Settings - {editingSetting.page}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault()
              handleUpdateSEO(new FormData(e.currentTarget))
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic SEO */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Basic SEO</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page Title</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingSetting.title}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={60}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                    <textarea
                      name="description"
                      defaultValue={editingSetting.description}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Keywords</label>
                    <input
                      type="text"
                      name="keywords"
                      defaultValue={editingSetting.keywords}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Canonical URL</label>
                    <input
                      type="url"
                      name="canonicalUrl"
                      defaultValue={editingSetting.canonicalUrl}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Robots</label>
                    <select
                      name="robots"
                      defaultValue={editingSetting.robots}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="index, follow">Index, Follow</option>
                      <option value="noindex, follow">Noindex, Follow</option>
                      <option value="index, nofollow">Index, Nofollow</option>
                      <option value="noindex, nofollow">Noindex, Nofollow</option>
                    </select>
                  </div>
                </div>

                {/* Open Graph */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Open Graph</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">OG Title</label>
                    <input
                      type="text"
                      name="ogTitle"
                      defaultValue={editingSetting.ogTitle}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">OG Description</label>
                    <textarea
                      name="ogDescription"
                      defaultValue={editingSetting.ogDescription}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">OG Image URL</label>
                    <input
                      type="url"
                      name="ogImage"
                      defaultValue={editingSetting.ogImage}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Twitter Card */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Twitter Card</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Card Type</label>
                    <select
                      name="twitterCard"
                      defaultValue={editingSetting.twitterCard}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Title</label>
                    <input
                      type="text"
                      name="twitterTitle"
                      defaultValue={editingSetting.twitterTitle}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Description</label>
                    <textarea
                      name="twitterDescription"
                      defaultValue={editingSetting.twitterDescription}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter Image URL</label>
                    <input
                      type="url"
                      name="twitterImage"
                      defaultValue={editingSetting.twitterImage}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Advanced */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900">Advanced</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority (0.0 - 1.0)</label>
                    <input
                      type="number"
                      name="priority"
                      defaultValue={editingSetting.priority}
                      min="0"
                      max="1"
                      step="0.1"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Structured Data (JSON-LD)</label>
                    <textarea
                      name="structuredData"
                      defaultValue={editingSetting.structuredData}
                      rows={6}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-xs"
                      placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingSetting(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}