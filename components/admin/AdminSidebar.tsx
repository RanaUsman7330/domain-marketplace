'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useRouter } from 'next/navigation'

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Domains', href: '/admin/domains', icon: '🌐' },
  { name: 'Enquiries', href: '/admin/enquiries', icon: '💬' },
  { name: 'Orders', href: '/admin/orders', icon: '📋' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Categories', href: '/admin/categories', icon: '🏷️' },
  { name: 'Tags', href: '/admin/tags', icon: '🏷️' },
  { name: 'CMS', href: '/admin/cms', icon: '📝' },
  { name: 'SEO', href: '/admin/seo', icon: '🔍' },
  { name: 'Logs', href: '/admin/logs', icon: '📋' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
]

export default function AdminSidebar({ 
  sidebarOpen, 
  setSidebarOpen 
}: { 
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void 
}) {
  const pathname = usePathname()
  const { user, logout } = useAdminAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-white text-xl font-bold">DomainHub Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email || 'admin@example.com'}
              </p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back to Website
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}