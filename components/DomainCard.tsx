// /components/DomainCard.tsx - FIX CART INTEGRATION
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { useWatchlist } from '@/contexts/WatchlistContext'

interface DomainCardProps {
  id: number
  name: string
  price: number
  category: string
  status?: string
  length: number
  extension: string
  description?: string
  imageUrl?: string
  isFeatured?: boolean
}

export default function DomainCard({ 
  id, 
  name, 
  price, 
  category, 
  status = 'available',
  length, 
  extension, 
  description = '',
  imageUrl,
  isFeatured = false
}: DomainCardProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isWatchlistAdded, setIsWatchlistAdded] = useState(false)
  const { addToCart, isInCart } = useCart()
  const { addToWatchlist, isInWatchlist } = useWatchlist()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (status === 'available') {
      console.log('Adding domain to cart:', { id, name, price, category, extension })
      
      await addToCart({
        id,
        name,
        price,
        category,
        extension
      })
      
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  const handleAddToWatchlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (status === 'available') {
      addToWatchlist({
        id,
        name,
        price,
        category,
        extension,
        status
      })
      setIsWatchlistAdded(true)
      setTimeout(() => setIsWatchlistAdded(false), 2000)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'auctioning': return 'bg-yellow-100 text-yellow-800'
      case 'sold': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'available': return 'Ready to purchase'
      case 'auctioning': return 'Active auction ongoing'
      case 'sold': return 'Currently unavailable'
      default: return 'Status unknown'
    }
  }

  const isCurrentlyInCart = isInCart(id)
  const isCurrentlyInWatchlist = isInWatchlist(id)

  return (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden cursor-pointer">
      <Link href={`/domains/${id}`} className="block">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{name}</h3>
              <p className="text-sm opacity-90">{name.length} chars • {extension}</p>
            </div>
            <div className="text-right">
              <div className="flex gap-1 mb-1 flex-wrap">
                {isFeatured && <span className="bg-white/20 px-2 py-1 rounded text-xs">Featured</span>}
                {name.length <= 10 && <span className="bg-white/20 px-2 py-1 rounded text-xs">Short</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-semibold capitalize">{category}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Extension</p>
              <p className="font-semibold">{extension}</p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Price</p>
            <p className="text-3xl font-bold text-gray-800">${price.toLocaleString()}</p>
          </div>

          {/* Status */}
          <div className="mb-4">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {status.toUpperCase()}
            </span>
            <p className="text-sm text-gray-600 mt-1">{getStatusText()}</p>
          </div>

          {/* Description */}
          {description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={status !== 'available'}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-all ${
              status !== 'available'
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : isCurrentlyInCart
                ? 'bg-green-100 text-green-700'
                : isAdded
                ? 'bg-green-500 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {status !== 'available' ? 'Unavailable' : isCurrentlyInCart ? 'In Cart' : isAdded ? 'Added!' : 'Add to Cart'}
          </button>
          
          <button
            onClick={handleAddToWatchlist}
            className={`px-3 py-2 rounded text-sm border transition-all ${
              isCurrentlyInWatchlist
                ? 'border-green-500 text-green-600 bg-green-50'
                : isWatchlistAdded
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
            title="Add to Watchlist"
          >
            {isCurrentlyInWatchlist ? '❤️' : isWatchlistAdded ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  )
}