'use client'
import { useAdminData } from '@/contexts/AdminDataContext'

export default function DomainStatusChart() {
  const { domains, loading } = useAdminData()
  
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Status Overview</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    )
  }

  // Calculate stats from domains data
  const available = domains?.filter((d: any) => d.status === 'available').length || 0
  const auctioning = domains?.filter((d: any) => d.status === 'auction').length || 0
  const sold = domains?.filter((d: any) => d.status === 'sold').length || 0
  const total = domains?.length || 0

  const statusData = [
    { name: 'Available', value: available, color: 'bg-green-500' },
    { name: 'Auctioning', value: auctioning, color: 'bg-yellow-500' },
    { name: 'Sold', value: sold, color: 'bg-gray-500' },
  ].filter(item => item.value > 0) // Only show categories with data

  if (statusData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Status Overview</h2>
        <p className="text-gray-500 text-sm">No domain data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Status Overview</h2>
      
      <div className="space-y-4">
        {statusData.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-900">
                {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${item.color} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${total > 0 ? (item.value / total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-sm font-semibold text-gray-900">{total} domains</span>
        </div>
      </div>
    </div>
  )
}