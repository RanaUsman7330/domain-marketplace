// File: /app/(site)/cart/page.tsx - FIXED WITH NULL CHECKS

'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CartItem {
  cartId: number
  id: number
  name: string
  price: number | null
  years?: number
  category?: string
  extension?: string
}

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, updateItemYears } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('CartPage mounted, cart items:', cart)
    setTimeout(() => setLoading(false), 500)
  }, [cart])

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      router.push('/signin?returnUrl=/checkout')
    } else {
      router.push('/checkout')
    }
  }

  const handleRemoveItem = async (cartId: number) => {
    console.log('Removing item:', cartId)
    await removeFromCart(cartId)
  }

  const handleYearsChange = (cartId: number, years: number) => {
    updateItemYears(cartId, years)
  }

  const handleClearCart = async () => {
    for (const item of cart) {
      await removeFromCart(item.cartId)
    }
  }

  // Helper function to safely get price with fallback
  const getSafePrice = (price: number | null | undefined): number => {
    return price ?? 0
  }

  // Helper function to safely calculate total price
  const calculateTotalPrice = (item: CartItem): number => {
    const price = getSafePrice(item.price)
    const years = item.years ?? 1
    return price * years
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading cart...</div>
        </div>
      </div>
    )
  }

  const total = getCartTotal()
  
  console.log('Cart items count:', cart.length)
  console.log('Cart items:', cart)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review your domain selections</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Your cart is empty.</p>
            <Link href="/domains" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
              Browse Domains
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Cart Items</h2>
                    <button 
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
                
                <div className="divide-y">
                  {cart.map((item) => {
                    const safePrice = getSafePrice(item.price)
                    const totalPrice = calculateTotalPrice(item)
                    const years = item.years ?? 1
                    
                    return (
                      <div key={item.cartId} className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Category: {item.category || 'Uncategorized'}
                            </p>
                            <p className="text-sm text-gray-500">{item.extension}</p>
                            
                            {/* Years Selection */}
                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Registration Period
                              </label>
                              <select 
                                value={years}
                                onChange={(e) => handleYearsChange(item.cartId, parseInt(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={1}>1 Year</option>
                                <option value={2}>2 Years</option>
                                <option value={3}>3 Years</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <p className="text-xl font-bold text-gray-800">
                              ${totalPrice.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              (${safePrice.toLocaleString()}/year)
                            </p>
                            <button
                              onClick={() => handleRemoveItem(item.cartId)}
                              className="text-red-600 hover:text-red-800 mt-2 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-4">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items</span>
                      <span className="font-medium">{cart.length}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleProceedToCheckout}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-semibold mb-3"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <Link 
                    href="/domains"
                    className="block w-full text-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}