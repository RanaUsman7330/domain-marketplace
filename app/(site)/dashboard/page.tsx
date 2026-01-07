'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface UserStats {
  totalDomains: number
  activeOrders: number
  watchlistCount: number
  totalSpent: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalDomains: 0,
    activeOrders: 0,
    watchlistCount: 0,
    totalSpent: 0
  })
  const [recentDomains, setRecentDomains] = useState<any[]>([])
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    // Get user name from auth
    if (user?.email) {
      setUserName(user.firstName || user.email.split('@')[0] || 'User')
    } else if (user && typeof user === 'string' && user.includes('.')) {
      try {
        const payload = JSON.parse(atob(user.split('.')[1]))
        setUserName(payload.firstName || payload.email?.split('@')[0] || 'User')
      } catch {
        setUserName('User')
      }
    }

    loadDashboardData()
  }, [user])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Load user stats
      const statsResponse = await fetch('/api/users/dashboard-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setStats(statsData.stats)
        }
      }

      // Load recent domains
      const domainsResponse = await fetch('/api/users/recent-domains', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (domainsResponse.ok) {
        const domainsData = await domainsResponse.json()
        if (domainsData.success) {
          setRecentDomains(domainsData.domains || [])
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userName}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-4">🌐</div>
            <div>
              <p className="text-sm text-blue-600 font-medium">My Domains</p>
              <p className="text-2xl font-bold text-blue-900">{stats.totalDomains}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-4">📦</div>
            <div>
              <p className="text-sm text-green-600 font-medium">Active Orders</p>
              <p className="text-2xl font-bold text-green-900">{stats.activeOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-4">❤️</div>
            <div>
              <p className="text-sm text-purple-600 font-medium">Watchlist</p>
              <p className="text-2xl font-bold text-purple-900">{stats.watchlistCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-4">💰</div>
            <div>
              <p className="text-sm text-orange-600 font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-orange-900">${stats.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Domains */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Domains</h2>
          {recentDomains.length > 0 ? (
            <div className="space-y-3">
              {recentDomains.slice(0, 5).map((domain) => (
                <div key={domain.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{domain.name}</p>
                    <p className="text-sm text-gray-600">{domain.status}</p>
                  </div>
                  <span className="text-sm font-medium">${domain.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No domains found</p>
          )}
          <Link href="/dashboard/my-domains" className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm">
            View all domains →
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/domains" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <div className="flex items-center">
                <span className="text-xl mr-3">🔍</span>
                <div>
                  <p className="font-medium">Browse Domains</p>
                  <p className="text-sm text-gray-600">Find your perfect domain</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/watchlist" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <div className="flex items-center">
                <span className="text-xl mr-3">❤️</span>
                <div>
                  <p className="font-medium">My Watchlist</p>
                  <p className="text-sm text-gray-600">View saved domains</p>
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/orders" className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
              <div className="flex items-center">
                <span className="text-xl mr-3">📋</span>
                <div>
                  <p className="font-medium">Order History</p>
                  <p className="text-sm text-gray-600">Track your purchases</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}