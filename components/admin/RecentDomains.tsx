'use client'
import Link from 'next/link'
import { useAdminData } from '@/contexts/AdminDataContext'

export default function RecentDomains() {
  const { domains, loading } = useAdminData()
  
  // Handle loading and empty data
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Domains</h2>
        <div className="animate-pulse space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const recentDomains = domains?.slice(0, 5) || []

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Domains</h2>
        <Link href="/admin/domains" className="text-sm text-blue-600 hover:text-blue-800">
          View All
        </Link>
      </div>
      
      {recentDomains.length === 0 ? (
        <p className="text-gray-500 text-sm">No domains found</p>
      ) : (
        <div className="space-y-3">
          {recentDomains.map((domain) => (
            <div key={domain._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Link href={`/admin/domains/${domain._id}`} className="font-medium text-blue-600 hover:underline">
                  {domain.name}
                </Link>
                <p className="text-sm text-gray-500">{domain.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${domain.price.toLocaleString()}</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  domain.status === 'available' ? 'bg-green-100 text-green-800' :
                  domain.status === 'sold' ? 'bg-red-100 text-red-800' :
                  domain.status === 'auction' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {domain.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}