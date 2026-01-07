// /app/domains/[id]/page.tsx - FIXED VERSION (remove duplicate header/footer)
'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useWatchlist } from '@/contexts/WatchlistContext'
import MakeOfferModal from '@/components/MakeOfferModal'
import { use } from 'react'



export default function DomainDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params)
  
  const [domain, setDomain] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { addToWatchlist, isInWatchlist } = useWatchlist()

  // Fetch domain details from API
  const fetchDomain = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/domains/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setDomain(data.domain)
      } else {
        setError(data.error || 'Failed to load domain')
      }
    } catch (error) {
      console.error('Frontend fetch error:', error)
      setError('Network error while loading domain')
    } finally {
      setLoading(false)
    }
  }

  // Fetch domain on component mount
  useEffect(() => {
    if (id) {
      fetchDomain()
    }
  }, [id])

  const handleBuyNow = () => {
    if (domain) {
      addToCart({
        id: domain.id,
        name: domain.name,
        price: domain.price,
        category: domain.category || 'General',
        extension: domain.extension || '.com'
      })
      setIsAddedToCart(true)
      setTimeout(() => setIsAddedToCart(false), 2000)
    }
  }

  const handleMakeOffer = () => {
    setIsOfferModalOpen(true)
  }

  const handleAddToWatchlist = () => {
    if (domain) {
      addToWatchlist({
        id: domain.id,
        name: domain.name,
        price: domain.price,
        category: domain.category || 'General',
        extension: domain.extension || '.com',
        status: domain.status || 'available'
      })
      setIsAddedToWatchlist(true)
      setTimeout(() => setIsAddedToWatchlist(false), 2000)
    }
  }

  const handleOfferSubmit = (offer: { name: string; email: string; phone: string; message: string; offerPrice: string }) => {
    if (domain) {
      console.log('Offer submitted:', offer)
      alert(`Offer of $${offer.offerPrice} submitted for ${domain.name}! We'll contact you within 24 hours.`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading domain details...</div>
      </div>
    )
  }

  if (error || !domain) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Domain Not Found</h1>
          <p className="text-gray-600 mb-4">Domain with ID {id} was not found.</p>
          <a href="/domains" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Back to Domains
          </a>
        </div>
      </div>
    )
  }

  const isAlreadyInWatchlist = domain ? isInWatchlist(domain.id) : false

  return (
    <div className="py-8">
      <MakeOfferModal 
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        domainName={domain.name}
        domainPrice={`$${parseFloat(domain.price).toLocaleString()}`}
        onSubmit={handleOfferSubmit}
        domainId={domain.id}
      />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{domain.name}</h1>
            <p className="text-xl">Premium Domain for Sale</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Domain Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 mb-2">{domain.name}</h2>
                  <p className="text-gray-600">{domain.description || 'No description available'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Listed Price</p>
                  <p className="text-3xl font-bold text-gray-800">${parseFloat(domain.price).toLocaleString()}</p>
                  <p className="text-sm text-green-600">{domain.status || 'available'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleBuyNow}
                  disabled={domain.status !== 'available'}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                    domain.status !== 'available'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isAddedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isAddedToCart ? 'Added to Cart!' : 'Buy Now'}
                </button>
                
                <button
                  onClick={handleMakeOffer}
                  disabled={domain.status !== 'available'}
                  className={`flex-1 py-3 px-6 rounded-lg font-semibold border-2 transition-all ${
                    domain.status !== 'available'
                      ? 'border-gray-300 text-gray-500 cursor-not-allowed'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Make Offer
                </button>
                
                <button
                  onClick={handleAddToWatchlist}
                  disabled={isAlreadyInWatchlist}
                  className={`px-6 py-3 rounded-lg font-semibold border-2 transition-all ${
                    isAlreadyInWatchlist
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isAlreadyInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                </button>
              </div>
            </div>

            {/* Domain Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Domain Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Length</p>
                  <p className="font-semibold">{domain.length || domain.name?.length || 0} chars</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Extension</p>
                  <p className="font-semibold">{domain.extension || '.com'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{domain.category || 'General'}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold">{domain.status || 'available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}