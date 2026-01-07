// File: /app/(site)/domains/[domain]/page.tsx - ADVANCED USER DOMAIN DETAIL

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'

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
  extension: string
  length: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  seo_tags?: string
}

export default function DomainDetailPage({ params }: { params: { domain: string } }) {
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    offer: ''
  })

  const domainName = decodeURIComponent(params.domain)

  useEffect(() => {
    loadDomain()
  }, [domainName])

  const loadDomain = async () => {
    try {
      // Try to load by name first (for clean URLs)
      let response = await fetch(`/api/domains?name=${encodeURIComponent(domainName)}`)
      let data = await response.json()
      
      // If not found by name, try by ID
      if (!data.success || !data.domain) {
        response = await fetch(`/api/domains/${domainName}`)
        data = await response.json()
      }
      
      if (data.success && data.domain) {
        setDomain(data.domain)
        
        // Track view
        if (data.domain.status === 'available') {
          await fetch(`/api/domains/${data.domain.id}/view`, { method: 'POST' })
        }
      }
    } catch (error) {
      console.error('Error loading domain:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/domains/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          domainId: domain?.id,
          domainName: domain?.name
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert('Your message has been sent successfully!')
        setShowContactForm(false)
        setContactForm({ name: '', email: '', message: '', offer: '' })
      }
    } catch (error) {
      console.error('Error sending contact form:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading domain details...</p>
        </div>
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Domain Not Found</h1>
          <p className="text-gray-600 mb-8">The domain "{domainName}" could not be found.</p>
          <Link href="/domains" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Browse Available Domains
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{domain.meta_title || `${domain.name} - Premium Domain for Sale`}</title>
        <meta name="description" content={domain.meta_description || domain.description || `Premium domain ${domain.name} available for purchase`} />
        <meta name="keywords" content={domain.meta_keywords || `${domain.name}, premium domain, ${domain.category}`} />
        {domain.seo_tags && <meta name="seo:tags" content={domain.seo_tags} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={domain.meta_title || `${domain.name} - Premium Domain`} />
        <meta property="og:description" content={domain.meta_description || `Purchase premium domain ${domain.name}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://yourdomain.com/domains/${encodeURIComponent(domain.name)}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={domain.meta_title || `${domain.name} - Premium Domain`} />
        <meta name="twitter:description" content={domain.meta_description || `Premium domain ${domain.name} available for purchase`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{domain.name}</h1>
              <p className="text-xl mb-2">.{domain.extension || domain.name.split('.').pop()}</p>
              <div className="flex justify-center items-center space-x-4 text-lg">
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  ${domain.price.toLocaleString()}
                </span>
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                  {domain.category}
                </span>
                <span className={`px-4 py-2 rounded-lg ${
                  domain.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {domain.status === 'available' ? 'Available Now' : 'Not Available'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Domain Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Domain Description</h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {domain.description || `Premium domain ${domain.name} is now available for purchase. This ${domain.category} domain offers excellent branding potential and memorable appeal.`}
                </p>
              </div>

              {/* Domain Stats */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Domain Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{domain.views}</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{domain.offers}</div>
                    <div className="text-sm text-gray-500">Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{domain.name.split('.')[0].length}</div>
                    <div className="text-sm text-gray-500">Characters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">.{domain.extension || domain.name.split('.').pop()}</div>
                    <div className="text-sm text-gray-500">Extension</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {domain.tags && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {domain.tags.split(',').map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Tags */}
              {domain.seo_tags && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">SEO Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {domain.seo_tags.split(',').map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase This Domain</h2>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${domain.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">One-time payment</div>
                  </div>

                  {domain.status === 'available' ? (
                    <div className="space-y-3">
                      <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold">
                        Buy Now
                      </button>
                      
                      <button 
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        Make an Offer
                      </button>
                      
                      <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-semibold">
                        Add to Cart
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>This domain is not currently available.</p>
                      <button 
                        onClick={() => setShowContactForm(true)}
                        className="mt-3 text-blue-600 hover:text-blue-800"
                      >
                        Contact for alternatives
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              {showContactForm && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Offer (Optional)</label>
                      <input
                        type="number"
                        value={contactForm.offer}
                        onChange={(e) => setContactForm({...contactForm, offer: e.target.value})}
                        placeholder="$"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={4}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}

              {/* Domain Info */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Domain Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{domain.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{domain.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Added:</span>
                    <span className="font-medium">{new Date(domain.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Domain Length:</span>
                    <span className="font-medium">{domain.name.split('.')[0].length} characters</span>
                  </div>
                </div>
              </div>

              {/* Similar Domains */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Domains</h3>
                <div className="space-y-3">
                  {/* This would be populated with actual similar domains */}
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-sm">Similar domains in {domain.category} category</p>
                  </div>
                </div>
                <Link href="/domains" className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block">
                  View all {domain.category} domains →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Content */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose {domain.name}?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Brand Ready</h3>
              <p className="text-gray-600 text-sm">Perfect for building a strong brand identity</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SEO Optimized</h3>
              <p className="text-gray-600 text-sm">Built-in SEO advantages for better rankings</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600 text-sm">High-quality domain with excellent potential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}