// /app/admin/domains/add/page.tsx - FIXED TO SHOW FORM AND CSV IMPORT
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddDomainPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [csvLoading, setCsvLoading] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  // Single domain form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Technology',
    price: '',
    status: 'available',
    description: '',
    tags: ''
  })

  const categories = [
    'Technology', 'Business', 'E-commerce', 'Finance', 'Health', 
    'Education', 'Real Estate', 'Fashion', 'Food', 'Entertainment',
    'Sports', 'Travel', 'Automotive', 'Marketing', 'Consulting'
  ]

  const statuses = ['available', 'sold', 'auction', 'pending']

  // CSV Template Download
  const downloadCSVTemplate = () => {
    const template = `name,category,price,status,description,tags
example.com,Technology,1000,available,Premium domain example,premium tech
test.com,Business,500,available,Great for business use,business brandable
app.io,Technology,2000,available,Perfect for app developers,tech app
brand.co,Marketing,1500,available,Brandable marketing domain,brand marketing`

    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'domain-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Single Domain Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Submitting single domain:', formData)
      const token = localStorage.getItem('adminToken')
      
      const response = await fetch('/api/admin/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      const data = await response.json()
      console.log('Add domain response:', data)
      
      if (data.success) {
        alert('Domain added successfully!')
        router.push('/admin/domains')
      } else {
        alert('Error: ' + (data.error || 'Failed to add domain'))
      }
    } catch (error) {
      console.error('Error adding domain:', error)
      alert('Failed to add domain')
    } finally {
      setLoading(false)
    }
  }

  // CSV File Upload
  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    setCsvLoading(true)

    try {
      console.log('Uploading CSV file:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/domains/import-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      console.log('CSV import response:', data)
      
      if (data.success) {
        alert(`CSV imported successfully! ${data.imported} domains added, ${data.failed} failed.`)
        if (data.imported > 0) {
          router.push('/admin/domains')
        }
      } else {
        alert('Error: ' + (data.error || 'Failed to import CSV'))
      }
    } catch (error) {
      console.error('Error importing CSV:', error)
      alert('Failed to import CSV')
    } finally {
      setCsvLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Domain</h1>
          <Link
            href="/admin/domains"
            className="text-gray-600 hover:text-gray-800 flex items-center"
          >
            ← Back to Domains
          </Link>
        </div>

        {/* CSV Import Section - MOVED TO TOP AND FIXED */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border border-blue-200 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Bulk Import Domains (CSV)
          </h2>
          <p className="text-gray-600 mb-6">Import multiple domains at once using CSV file - Perfect for adding your 500+ domains!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={downloadCSVTemplate}
              className="bg-white text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center border border-blue-200"
            >
              <span className="mr-2">📥</span>
              Download Template
            </button>
            
            <label className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer flex items-center justify-center">
              <span className="mr-2">📁</span>
              {csvFile ? csvFile.name : 'Choose CSV File'}
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => csvFile && handleCSVUpload({ target: { files: [csvFile] } } as any)}
              disabled={!csvFile || csvLoading}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              <span className="mr-2">📤</span>
              {csvLoading ? 'Importing...' : 'Import CSV'}
            </button>
          </div>

          {csvFile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">✅ Selected: {csvFile.name}</p>
            </div>
          )}
        </div>

        {/* Single Domain Form - FIXED TO ALWAYS SHOW */}
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <span className="mr-2">➕</span>
            Add Single Domain
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="example.com"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1000"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe this domain..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="premium, brandable, short"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link href="/admin/domains" className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Adding...' : 'Add Domain'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}