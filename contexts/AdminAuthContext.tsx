'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AdminAuthContextType {
  user: AdminUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 🔥 FIX: Use admin-specific API endpoint
      const response = await fetch('/api/admin/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('Admin login response:', data)

      if (response.ok && data.success) {
        // Store admin-specific token
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUserData', JSON.stringify(data.user))
        
        setUser(data.user)
        return true
      } else {
        console.log('Admin login failed:', data.error)
        return false
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUserData')
    router.push('/admin/login')
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      // 🔥 FIX: Use admin-specific auth check
      const response = await fetch('/api/admin/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user.role === 'admin') {
          setUser(data.user)
        } else {
          // Not an admin, redirect to user dashboard
          router.push('/dashboard')
        }
      } else {
        // Invalid token
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUserData')
      }
    } catch (error) {
      console.error('Admin auth check error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AdminAuthContext.Provider value={{
      user,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}