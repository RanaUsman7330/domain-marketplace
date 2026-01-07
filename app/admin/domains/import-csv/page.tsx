// /app/admin/domains/import-csv/page.tsx
'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function ImportDomainsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMessage('')
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setProgress(0)
    setMessage('')

    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/domains/import-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (data.success) {
        setMessage(`Successfully imported ${data.imported} domains! ${data.autoCreatedCategories} categories were auto-created.`)
        setTimeout(() => {
          router.push('/admin/domains')
        }, 2000)
      } else {
        setMessage('Error: ' + data.error)
      }
    } catch (error) {
      console.error('Import error:', error)
      setMessage('Error importing domains')
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }
// In CSV import, add support for SEO fields:
const { name, category, price, status, description, tags, meta_title, meta_description, meta_keywords, seo_tags } = record

// Update the insert query:
const domainResult = await executeQuery(`
  INSERT INTO domains (name, category, price, status, description, tags, meta_title, meta_description, meta_keywords, seo_tags, created_at, updated_at) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
`, [name, categoryName, parseFloat(price), status, description || '', tags || '', 
    meta_title || '', meta_description || '', meta_keywords || '', seo_tags || ''])


// Update the CSV template in /app/admin/domains/import-csv/page.tsx:

const downloadTemplate = () => {
  const csvContent = `name,category,price,status,description,tags,meta_title,meta_description,meta_keywords,seo_tags
example.com,Premium,1000,available,Great domain for tech startups,"tech, premium","Premium Domain for Sale - example.com","High-quality domain perfect for tech startups and innovative companies","premium domain, tech domain, startup domain","premium-domain, tech-domain, startup-domain"
myshop.net,E-commerce,500,available,Perfect for online store,"shop, e-commerce","E-commerce Domain - myshop.net","Ideal domain for e-commerce websites and online retail businesses","ecommerce domain, online store, retail domain","ecommerce-domain, online-store, retail-domain"
brand.io,Brandable,2000,available,Short and brandable domain,"brand, short","Brandable Domain - brand.io","Short and memorable domain perfect for building a strong brand","brandable domain, short domain, memorable domain","brandable-domain, short-domain, memorable-domain"
`
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'domain-import-template-with-seo.csv'
  a.click()
  window.URL.revokeObjectURL(url)
}

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Import Domains from CSV</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h2>
          <p className="text-gray-600 mb-4">
            Upload a CSV file with domain information. Categories that don't exist will be automatically created.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="text-gray-600">
                {file ? (
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm">Size: {(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <p>Drop your CSV file here or click to browse</p>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Choose File
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">CSV Format</h3>
          <p className="text-gray-600 mb-3">
            Your CSV file should include these columns:
          </p>
          <div className="bg-gray-50 p-3 rounded text-sm font-mono">
            name,category,price,status,description,tags
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={downloadTemplate}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Download Template
          </button>
          
          <button
            type="button"
            onClick={handleImport}
            disabled={!file || loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? 'Importing...' : 'Import Domains'}
          </button>
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {message && (
          <div className={`p-4 rounded-md ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}