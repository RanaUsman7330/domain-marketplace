'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Domain {
  id: number
  name: string
  category: string
  price: number
  status: 'available' | 'sold' | 'auction' | 'pending'
  description: string
  tags: string
  views: number
  offers: number
  created_at: string
  updated_at: string
}

interface AdminDataContextType {
  domains: Domain[]
  loading: boolean
  addDomain: (domain: Partial<Domain>) => Promise<void>
  updateDomain: (id: string, domain: Partial<Domain>) => Promise<void>
  deleteDomain: (id: string) => Promise<void>
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined)

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)

  // Load domains from admin API
  const loadDomains = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/domains', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      console.log('Admin domains data:', data)
      
      if (data.success) {
        setDomains(data.domains || [])
      } else {
        console.error('Failed to load admin domains:', data.error)
        setDomains([])
      }
    } catch (error) {
      console.error('Error loading admin domains:', error)
      setDomains([])
    }
  }

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true)
      await loadDomains()
      setLoading(false)
    }

    loadAllData()
  }, [])

  const addDomain = async (domain: Partial<Domain>) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/domains', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(domain),
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadDomains() // Refresh the list
        alert(`Domain "${data.domain.name}" added successfully!`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error('Error adding domain:', error)
      alert('Failed to add domain. Please try again.')
    }
  }

  const updateDomain = async (id: string, domain: Partial<Domain>) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(domain),
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadDomains() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating domain:', error)
    }
  }

  const deleteDomain = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/admin/domains/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        await loadDomains() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting domain:', error)
    }
  }

  return (
    <AdminDataContext.Provider value={{
      domains,
      loading,
      addDomain,
      updateDomain,
      deleteDomain,
    }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const context = useContext(AdminDataContext)
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider')
  }
  return context
}