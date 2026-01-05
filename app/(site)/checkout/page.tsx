// /app/checkout/page.tsx - MULTI-STEP CHECKOUT WITH DETAILED LOGGING
'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'

interface BillingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  country: string
  city: string
  state: string
  zipCode: string
}

interface PaymentMethod {
  type: 'card' | 'bank' | 'email'
  cardNumber?: string
  cardName?: string
  expiryDate?: string
  cvv?: string
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    state: '',
    zipCode: ''
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card'
  })

  const total = getCartTotal()

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [cart, router])

  // Step 1: Billing info
  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  // Step 2: Payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('=== SUBMITTING ORDER ===')
      console.log('Cart items:', cart)
      console.log('Cart items length:', cart.length)
      console.log('Billing Info:', billingInfo)
      console.log('Payment Method:', paymentMethod)
      console.log('Total:', total)

      // Validate required fields
      if (!billingInfo.firstName || !billingInfo.lastName || !billingInfo.email || !billingInfo.phone) {
        alert('Please fill in all required billing information')
        setLoading(false)
        return
      }

      // Prepare request payload
      const requestPayload = {
        items: cart,
        billingInfo,
        paymentMethod,
        total
      }
      console.log('Request payload:', JSON.stringify(requestPayload, null, 2))

      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'guest-token'}`
        },
        body: JSON.stringify(requestPayload)
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('Response data:', JSON.stringify(data, null, 2))

      if (data.success) {
        console.log('Order created successfully. Order ID:', data.orderId)
        await clearCart()
        router.push(`/order-success?orderId=${data.orderId}`)
      } else {
        console.error('Order creation failed:', data)
        alert(data.error || 'Failed to create order')
      }
    } catch (error: any) {
      console.error('Order creation error:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      alert('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-semibold">1</span>
              <span className="ml-2 font-medium">Billing Information</span>
            </div>
            <div className={`flex-1 h-px ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-semibold">2</span>
              <span className="ml-2 font-medium">Payment Method</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Billing Information</h2>
                <form onSubmit={handleBillingSubmit} className="space-y-4">
                  {/* Billing fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, firstName: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({ ...billingInfo, lastName: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={billingInfo.phone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company (Optional)</label>
                    <input
                      type="text"
                      value={billingInfo.company}
                      onChange={(e) => setBillingInfo({ ...billingInfo, company: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <select
                        required
                        value={billingInfo.country}
                        onChange={(e) => setBillingInfo({ ...billingInfo, country: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                        <option value="PK">Pakistan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.state}
                        onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                      <input
                        type="text"
                        required
                        value={billingInfo.zipCode}
                        onChange={(e) => setBillingInfo({ ...billingInfo, zipCode: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    {[
                      { type: 'card', title: 'Credit/Debit Card', desc: 'Visa, Mastercard, American Express' },
                      { type: 'bank', title: 'Bank Transfer', desc: 'Direct bank wire transfer (3-5 business days)' },
                      { type: 'email', title: 'Email Purchase Request', desc: 'Send payment instructions via email' }
                    ].map((method) => (
                      <label key={method.type} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="paymentType"
                          value={method.type}
                          checked={paymentMethod.type === method.type}
                          onChange={() => setPaymentMethod({ type: method.type as any })}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">{method.title}</p>
                          <p className="text-sm text-gray-600">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Payment Details */}
                  {paymentMethod.type === 'card' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod.type === 'bank' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Bank transfer details will be provided after order confirmation. 
                        Please complete the transfer within 3-5 business days.
                      </p>
                    </div>
                  )}

                  {paymentMethod.type === 'email' && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        Payment instructions will be sent to your email address after order confirmation.
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-semibold"
                    >
                      {loading ? 'Processing...' : 'Complete Order'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow sticky top-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">{item.years || 1} year{item.years > 1 ? 's' : ''}</p>
                      </div>
                      <p className="font-medium">${(item.price * (item.years || 1)).toLocaleString()}</p>
                    </div>
                  ))}

                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-green-600">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
