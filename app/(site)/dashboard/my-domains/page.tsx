'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface Domain {
  id: number
  name: string
  price: number
  status: string
  purchased_at: string
  category: string
}

export default function MyDomainsPage() {
  const { user } = useAuth()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMyDomains()
  }, [])

  const loadMyDomains = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/users/my-domains', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setDomains(data.domains || [])
        }
      }
    } catch (error) {
      console.error('Error loading my domains:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading your domains...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Domains</h1>
        <p className="text-gray-600">Domains you have purchased</p>
      </div>

      {domains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain) => (
            <div key={domain.id} className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{domain.name}</h3>
                <p className="text-sm text-gray-600">{domain.category}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium text-green-600">{domain.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Purchased:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(domain.purchased_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="text-sm font-medium">${domain.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link 
                  href={`/domains/${domain.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't purchased any domains yet.</p>
          <Link href="/domains" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            Browse Domains
          </Link>
        </div>
      )}
    </div>
  )
}