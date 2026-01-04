'use client'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminStats from '@/components/admin/AdminStats'
import RecentDomains from '@/components/admin/RecentDomains'
import QuickActions from '@/components/admin/QuickActions'

export default function AdminDashboardPage() {
  const { user, isLoading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/admin/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-600">
          Welcome back, {user.name}
        </div>
      </div>

      {/* Stats */}
      <AdminStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Domains */}
        <div className="lg:col-span-2">
          <RecentDomains />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}