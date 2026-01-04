// /app/dashboard/page.tsx - REMOVE DUPLICATE NAVIGATION
'use client'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function UserDashboard() {
  const { user } = useAuth()

  const dashboardCards = [
    {
      title: "My Domains",
      description: "View domains you've purchased",
      icon: "🌐",
      href: "/dashboard/my-domains",
      color: "bg-blue-50 border-blue-200"
    },
    {
      title: "Cart",
      description: "Your saved items",
      icon: "🛒",
      href: "/cart",
      color: "bg-green-50 border-green-200"
    },
    {
      title: "Watchlist",
      description: "Your favorite domains",
      icon: "❤️",
      href: "/watchlist",
      color: "bg-purple-50 border-purple-200"
    },
    {
      title: "Profile",
      description: "Manage your account",
      icon: "👤",
      href: "/dashboard/profile",
      color: "bg-gray-50 border-gray-200"
    }
  ]

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* REMOVE DashboardNavigation - صرف ویلکم میسج اور کارڈز دکھائیں */}
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage your domains and account settings</p>
        </div>
        
        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className={`${card.color} rounded-lg border p-6 hover:shadow-lg transition-shadow cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{card.icon}</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </Link>
          ))}
        </div>

        {/* Recent Activity or Stats */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Domains</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600 text-sm">Domains you've purchased</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cart Items</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-gray-600 text-sm">Items in your cart</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Watchlist</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-gray-600 text-sm">Favorite domains</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}