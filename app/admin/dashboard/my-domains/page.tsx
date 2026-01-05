// /app/dashboard/my-domains/page.tsx - FIXED VERSION
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Domain {
  id: string
  name: string
  price: number
  status: 'purchased' | 'processing' | 'completed'
  created_at: string
  // Add these fields to track purchased domains
  purchase_status: 'bought' | 'in_process' | 'completed'
  purchase_date?: string
}

export default function MyDomains() {
  const { user } = useAuth()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDomains()
  }, [])

  const fetchUserDomains = async () => {
    try {
      // This should fetch domains that user has BOUGHT from your website
      // Not domains they want to sell
      const response = await fetch('/api/users/purchased-domains', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        // Filter to show only purchased domains
        const purchasedDomains = data.domains?.filter((domain: Domain) => 
          domain.purchase_status === 'bought' || domain.purchase_status === 'in_process'
        ) || []
        setDomains(purchasedDomains)
      } else {
        // If API doesn't exist yet, show empty state
        setDomains([])
      }
    } catch (error) {
      console.error('Error fetching purchased domains:', error)
      setDomains([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your purchased domains...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Purchased Domains</h1>
          <p className="text-gray-600 mt-2">Domains you've purchased from our marketplace</p>
        </div>
        
        {domains.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9-3 4.03-3 9 1.343 9 3 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchased domains yet</h3>
            <p className="text-gray-600 mb-6">You haven't purchased any domains from our marketplace yet.</p>
            <Link
              href="/domains"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Browse Domains
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <div key={domain.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{domain.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      domain.purchase_status === 'bought' ? 'bg-green-100 text-green-800' :
                      domain.purchase_status === 'in_process' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {domain.purchase_status === 'bought' ? 'Owned' : 'Processing'}
                    </span>
                  </div>
                  
                  <p className="text-2xl font-bold text-blue-600 mb-2">${domain.price.toLocaleString()}</p>
                  
                  {domain.purchase_date && (
                    <div className="text-sm text-gray-600 mb-4">
                      <p>Purchased on {new Date(domain.purchase_date).toLocaleDateString()}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link
                      href={`/domains/${domain.id}`}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition text-center"
                    >
                      View Domain
                    </Link>
                    <button className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300 transition">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}