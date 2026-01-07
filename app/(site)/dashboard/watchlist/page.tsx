'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface WatchlistItem {
  id: number
  domain_id: number
  domain: {
    id: number
    name: string
    price: number
    status: string
    category: string
  }
  added_at: string
}

export default function WatchlistPage() {
  const { user } = useAuth()
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWatchlist()
  }, [])

  const loadWatchlist = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/users/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setItems(data.items || [])
        }
      } else if (response.status === 401) {
        // User not authenticated, show empty watchlist
        setItems([])
      }
    } catch (error) {
      console.error('Error loading watchlist:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (domainId: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/users/watchlist/${domainId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Remove from local state
        setItems(items.filter(item => item.domain_id !== domainId))
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading watchlist...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Watchlist</h1>
        <p className="text-gray-600">Domains you're tracking</p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.domain.name}</h3>
                <p className="text-sm text-gray-600">{item.domain.category}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">{item.domain.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Added:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(item.added_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium">${item.domain.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link 
                  href={`/domains/${item.domain.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition text-sm"
                >
                  View Details
                </Link>
                <button
                  onClick={() => removeFromWatchlist(item.domain_id)}
                  className="bg-red-100 text-red-600 py-2 px-4 rounded hover:bg-red-200 transition text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your watchlist is empty.</p>
          <Link href="/domains" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Browse Domains
          </Link>
        </div>
      )}
    </div>
  )
}