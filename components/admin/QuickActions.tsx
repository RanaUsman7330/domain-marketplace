'use client'
import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    { name: 'Add New Domain', href: '/admin/domains', icon: '🌐', color: 'bg-blue-500 hover:bg-blue-600' },
    { name: 'View All Orders', href: '/admin/orders', icon: '📋', color: 'bg-green-500 hover:bg-green-600' },
    { name: 'Manage Users', href: '/admin/users', icon: '👥', color: 'bg-purple-500 hover:bg-purple-600' },
    { name: 'System Settings', href: '/admin/settings', icon: '⚙️', color: 'bg-gray-500 hover:bg-gray-600' },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 flex flex-col items-center text-center`}
          >
            <span className="text-2xl mb-2">{action.icon}</span>
            <span className="text-sm font-medium">{action.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}