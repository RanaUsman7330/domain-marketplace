'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const systems = [
    { name: 'Website', status: 'operational', uptime: '99.9%' },
    { name: 'Domain Search', status: 'operational', uptime: '99.8%' },
    { name: 'Payment Processing', status: 'operational', uptime: '99.7%' },
    { name: 'Domain Transfer', status: 'operational', uptime: '99.6%' },
    { name: 'Customer Support', status: 'operational', uptime: '99.5%' }
  ]

  const recentIncidents = [
    {
      date: '2024-12-15',
      time: '14:30 UTC',
      title: 'Brief search slowdown',
      description: 'Search functionality experienced 2-minute delay',
      status: 'resolved'
    },
    {
      date: '2024-12-10',
      time: '09:15 UTC', 
      title: 'Scheduled maintenance',
      description: 'System updates completed successfully',
      status: 'resolved'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800'
      case 'degraded': return 'bg-yellow-100 text-yellow-800'
      case 'down': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">System Status</h1>
          <p className="text-xl">All systems operational</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Current Status</h2>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Last updated</p>
                  <p className="font-medium">{currentTime.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {systems.map((system, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{system.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                        {system.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Uptime: {system.uptime}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Incidents */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Recent Incidents</h2>
              
              {recentIncidents.length === 0 ? (
                <p className="text-gray-600">No recent incidents reported.</p>
              ) : (
                <div className="space-y-4">
                  {recentIncidents.map((incident, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{incident.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{incident.description}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {incident.date} at {incident.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscribe to Updates */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Subscribe to Status Updates</h3>
              <p className="text-gray-600 mb-4">Get notified about any system issues or maintenance</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Subscribe to Updates
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}