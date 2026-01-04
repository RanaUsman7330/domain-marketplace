// /contexts/CartContext.tsx - ADVANCED CART WITH YEARS
'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  cartId: number
  id: number
  name: string
  price: number
  category: string
  extension: string
  description: string
  imageUrl?: string
  addedAt: string
  years?: number  // Add years field
}

interface CartContextType {
  cart: CartItem[]
  cartCount: number
  addToCart: (item: Omit<CartItem, 'cartId' | 'addedAt'>) => Promise<void>
  removeFromCart: (cartId: number) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  isInCart: (domainId: number) => boolean
  updateItemYears: (cartId: number, years: number) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Fetch cart from API on mount
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      console.log('Fetching cart...')
      const token = localStorage.getItem('token') || 'guest-token'
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Cart response status:', response.status)
      const data = await response.json()
      console.log('Cart data:', data)
      
      if (data.success) {
        setCart(data.cart || [])
      } else {
        console.log('Cart fetch failed:', data.error)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addToCart = async (item: Omit<CartItem, 'cartId' | 'addedAt'>) => {
    try {
      console.log('Adding to cart:', item)
      const token = localStorage.getItem('token') || 'guest-token'
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          domainId: item.id,
          userId: 0
        })
      })
      
      console.log('Add to cart response status:', response.status)
      const data = await response.json()
      console.log('Add to cart response:', data)
      
      if (data.success) {
        // Add to local state with proper structure
        const newItem: CartItem = {
          ...item,
          years: item.years || 1, // Default to 1 year
          cartId: data.cartId,
          addedAt: new Date().toISOString()
        }
        setCart(prev => [...prev, newItem])
        console.log('Item added to cart successfully')
      } else if (data.error === 'Domain already in cart') {
        alert('This domain is already in your cart!')
      } else {
        alert(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    }
  }

  const removeFromCart = async (cartId: number) => {
    try {
      console.log('Removing from cart:', cartId)
      const token = localStorage.getItem('token') || 'guest-token'
      
      const response = await fetch(`/api/cart?id=${cartId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Remove from cart response status:', response.status)
      
      if (response.ok) {
        setCart(prev => prev.filter(item => item.cartId !== cartId))
        console.log('Item removed from cart successfully')
      } else {
        const errorData = await response.json()
        console.error('Remove failed:', errorData.error)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const clearCart = async () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.years || 1)), 0)
  }

  const isInCart = (domainId: number) => {
    return cart.some(item => item.id === domainId)
  }

  const updateItemYears = (cartId: number, years: number) => {
    setCart(prev => prev.map(item => 
      item.cartId === cartId ? { ...item, years } : item
    ))
  }

  return (
    <CartContext.Provider value={{
      cart,
      cartCount: cart.length,
      addToCart,
      removeFromCart,
      clearCart,
      getCartTotal,
      isInCart,
      updateItemYears
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}