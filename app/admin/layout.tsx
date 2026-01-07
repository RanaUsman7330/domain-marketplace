// app/admin/layout.tsx - Updated with SettingsProvider
'use client'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { AdminDataProvider } from '@/contexts/AdminDataContext'
import { SettingsProvider } from '@/contexts/SettingsContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken')
      if (!token && pathname !== '/admin/login') {
        router.push('/admin/login')
      } else {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (isCheckingAuth && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  // For login page, show only the login form
  if (pathname === '/admin/login') {
    return (
      <AdminAuthProvider>
        <AdminDataProvider>
          <SettingsProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </SettingsProvider>
        </AdminDataProvider>
      </AdminAuthProvider>
    )
  }

  // For other admin pages, show full admin layout
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <SettingsProvider>
          <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`flex-1 lg:ml-64 transition-all duration-300`}>
              <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <main className="p-6">{children}</main>
            </div>
          </div>
        </SettingsProvider>
      </AdminDataProvider>
    </AdminAuthProvider>
  )
}