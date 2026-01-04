'use client'
import { useAdminData } from '@/contexts/AdminDataContext'

export default function AdminStats() {
  const { domains, loading } = useAdminData()
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  const totalDomains = domains?.length || 0
  const availableDomains = domains?.filter((d: any) => d.status === 'available').length || 0
  const activeAuctions = domains?.filter((d: any) => d.status === 'auction').length || 0
  const totalValue = domains?.reduce((sum: number, d: any) => sum + d.price, 0) || 0

  const stats = [
    {
      title: 'Total Domains',
      value: totalDomains,
      color: 'text-blue-600'
    },
    {
      title: 'Available',
      value: availableDomains,
      color: 'text-green-600'
    },
    {
      title: 'Active Auctions',
      value: activeAuctions,
      color: 'text-yellow-600'
    },
    {
      title: 'Total Inventory Value',
      value: `$${(totalValue / 1000).toFixed(0)}K`,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
        </div>
      ))}
    </div>
  )
}