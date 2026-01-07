'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [userEmail, setUserEmail] = useState('User')
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email)
      setUserName(user.firstName || user.email.split('@')[0] || 'User')
    } else if (user && typeof user === 'string' && user.includes('.')) {
      // If user is JWT token, decode it
      try {
        const payload = JSON.parse(atob(user.split('.')[1]))
        setUserEmail(payload.email || 'User')
        setUserName(payload.firstName || payload.email?.split('@')[0] || 'User')
      } catch {
        setUserEmail('User')
        setUserName('User')
      }
    } else if (user) {
      // Handle other user object formats
      setUserEmail(user.email || 'User')
      setUserName(user.firstName || user.email?.split('@')[0] || 'User')
    }
  }, [user])

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push('/signin?returnUrl=/dashboard')
    }
  }, [user, loading, router, isClient])

  if (loading || !isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Domains', href: '/dashboard/my-domains', icon: '🌐' },
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { name: 'Orders', href: '/dashboard/orders', icon: '📦' },
    { name: 'Watchlist', href: '/dashboard/watchlist', icon: '❤️' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Welcome</h2>
                <p className="text-sm text-gray-600">{userName}</p>
              </div>
              
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}