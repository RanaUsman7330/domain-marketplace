'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

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

export default function DomainDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const [domainId, setDomainId] = useState<string | null>(null)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [offerForm, setOfferForm] = useState({
    name: '',
    email: '',
    offerAmount: '',
    message: ''
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
      const response = await fetch(`/api/admin/domains/${domainId}`)
      const data = await response.json()
      
      if (data.success && data.domain) {
        setDomain(data.domain)
      }
    } catch (error) {
      console.error('Error loading domain:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (domain) {
      addToCart(domain)
      alert('Domain added to cart successfully!')
    }
  }

  const handleBuyNow = () => {
    if (!domain) return
    
    // Add to cart first
    addToCart(domain)
    
    // Redirect to cart page (which will handle auth flow)
    router.push('/cart')
  }

  const handleMakeOffer = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!domain) return
    
    // Here you would typically send the offer to your backend
    console.log('Offer submitted:', {
      domainId: domain.id,
      domainName: domain.name,
      ...offerForm
    })
    
    alert('Your offer has been submitted successfully! We will contact you soon.')
    setShowOfferModal(false)
    setOfferForm({ name: '', email: '', offerAmount: '', message: '' })
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
          <p className="text-gray-600 mb-8">The domain could not be found.</p>
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
        <meta property="og:url" content={`https://yourdomain.com/domains/${domain.id}`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={domain.meta_title || `${domain.name} - Premium Domain`} />
        <meta name="twitter:description" content={domain.meta_description || `Premium domain ${domain.name} available for purchase`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Fixed text visibility */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{domain.name}</h1>
              <p className="text-xl mb-2">.{domain.extension || domain.name.split('.').pop()}</p>
              <div className="flex justify-center items-center space-x-4 text-lg">
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-bold">${domain.price.toLocaleString()}</span>
                </span>
                <span className="bg-white bg-opacity-20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-white font-medium">{domain.category}</span>
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
                      <button 
                        onClick={handleBuyNow}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                      >
                        Buy Now
                      </button>
                      
                      <button 
                        onClick={() => setShowOfferModal(true)}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        Make an Offer
                      </button>
                      
                      <button 
                        onClick={handleAddToCart}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <p>This domain is not currently available.</p>
                    </div>
                  )}
                </div>
              </div>

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
            </div>
          </div>
        </div>
      </div>

      {/* Make an Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Make an Offer for {domain.name}</h3>
            <form onSubmit={handleMakeOffer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  value={offerForm.name}
                  onChange={(e) => setOfferForm({...offerForm, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={offerForm.email}
                  onChange={(e) => setOfferForm({...offerForm, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Offer ($)</label>
                <input
                  type="number"
                  value={offerForm.offerAmount}
                  onChange={(e) => setOfferForm({...offerForm, offerAmount: e.target.value})}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={offerForm.message}
                  onChange={(e) => setOfferForm({...offerForm, message: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}