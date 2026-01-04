// /components/MakeOfferModal.tsx - FIXED TO SAVE TO DATABASE
'use client'
import { useState } from 'react'

interface MakeOfferModalProps {
  isOpen: boolean
  onClose: () => void
  domainName: string
  domainPrice: string
  onSubmit: (offer: any) => void
  domainId: number
}

export default function MakeOfferModal({ 
  isOpen, 
  onClose, 
  domainName, 
  domainPrice, 
  onSubmit,
  domainId
}: MakeOfferModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    offerPrice: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Submit offer to database
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domainId: domainId,
          offerAmount: parseFloat(formData.offerPrice),
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          message: formData.message,
          offerType: 'negotiable'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Offer submitted successfully! We will contact you within 24 hours.')
        onSubmit(formData)
        onClose()
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          offerPrice: '',
          message: ''
        })
      } else {
        alert('Error: ' + (data.error || 'Failed to submit offer'))
      }
    } catch (error) {
      console.error('Offer submission error:', error)
      alert('Failed to submit offer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Make an Offer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="font-semibold">{domainName}</p>
          <p className="text-sm text-gray-600">Listed price: {domainPrice}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Your Offer ($) *</label>
            <input
              type="number"
              name="offerPrice"
              value={formData.offerPrice}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about your offer..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Offer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}