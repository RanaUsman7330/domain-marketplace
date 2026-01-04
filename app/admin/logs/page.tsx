'use client'
import { useState, useEffect } from 'react'

interface Log {
  _id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
  user?: string
  ip?: string
  action: string
  details?: string
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Mock logs data - in real app this would come from API
  useEffect(() => {
    const mockLogs: Log[] = [
      {
        _id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        level: 'info',
        message: 'User login successful',
        user: 'admin@example.com',
        ip: '192.168.1.1',
        action: 'user.login',
        details: 'Successful login from admin panel'
      },
      {
        _id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        level: 'warning',
        message: 'Failed login attempt',
        user: 'unknown@example.com',
        ip: '192.168.1.2',
        action: 'user.login.failed',
        details: 'Invalid credentials provided'
      },
      {
        _id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        level: 'error',
        message: 'Database connection failed',
        ip: 'localhost',
        action: 'database.error',
        details: 'Connection timeout after 30 seconds'
      },
      {
        _id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        level: 'info',
        message: 'Domain added successfully',
        user: 'admin@example.com',
        ip: '192.168.1.1',
        action: 'domain.add',
        details: 'Added new domain: premium.com'
      },
      {
        _id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        level: 'debug',
        message: 'Cache cleared',
        user: 'system',
        action: 'cache.clear',
        details: 'System cache cleared successfully'
      }
    ]
    
    setLogs(mockLogs)
    
    // Simulate real-time logs if auto-refresh is enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        const newLog: Log = {
          _id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: ['info', 'warning', 'debug'][Math.floor(Math.random() * 3)] as Log['level'],
          message: 'System heartbeat',
          action: 'system.heartbeat',
          details: 'System is running normally'
        }
        setLogs(prev => [newLog, ...prev.slice(0, 99)]) // Keep only last 100 logs
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const filteredLogs = logs.filter((log: Log) => {
    const matchesSearch = 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter
    
    const now = new Date()
    const logDate = new Date(log.timestamp)
    let matchesDate = true
    
    if (dateFilter === 'today') {
      matchesDate = logDate.toDateString() === now.toDateString()
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= weekAgo
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = logDate >= monthAgo
    }
    
    return matchesSearch && matchesLevel && matchesDate
  })

  const getLevelColor = (level: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      debug: 'bg-gray-100 text-gray-800',
    }
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      setLogs([])
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Message', 'User', 'IP', 'Action', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.level,
        log.message,
        log.user || '',
        log.ip || '',
        log.action,
        log.details || ''
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoRefresh" className="ml-2 text-sm text-gray-700">
              Auto-refresh (5s)
            </label>
          </div>
          <button
            onClick={exportLogs}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={clearLogs}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
          >
            Clear Logs
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Logs</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">{logs.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Info</div>
          <div className="mt-2 text-3xl font-bold text-blue-600">
            {logs.filter((l: Log) => l.level === 'info').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Warnings</div>
          <div className="mt-2 text-3xl font-bold text-yellow-600">
            {logs.filter((l: Log) => l.level === 'warning').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Errors</div>
          <div className="mt-2 text-3xl font-bold text-red-600">
            {logs.filter((l: Log) => l.level === 'error').length}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Debug</div>
          <div className="mt-2 text-3xl font-bold text-gray-600">
            {logs.filter((l: Log) => l.level === 'debug').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="debug">Debug</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredLogs.length} logs found
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log: Log) => (
                <tr key={log._id} className={log.level === 'error' ? 'bg-red-50' : log.level === 'warning' ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {log.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ip || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-medium">Log Details</h2>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(selectedLog.level)}`}>
                    {selectedLog.level}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <p className="mt-1 text-sm text-gray-900">{selectedLog.message}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Action</label>
                <p className="mt-1 text-sm font-mono text-gray-900">{selectedLog.action}</p>
              </div>
              
              {selectedLog.details && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Details</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedLog.details}
                    </pre>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.user || 'System'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLog.ip || 'Local'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}