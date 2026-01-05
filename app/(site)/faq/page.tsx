'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How long does domain transfer take?",
      answer: "Domain transfers typically take 5-7 business days. The exact timeline depends on the domain extension and current registrar. We provide step-by-step guidance throughout the process."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and cryptocurrency payments. All transactions are secured with bank-level encryption."
    },
    {
      question: "Is domain ownership transfer secure?",
      answer: "Yes, absolutely! We use an escrow service to ensure secure transactions. The domain is only transferred to the buyer after payment is confirmed, protecting both parties."
    },
    {
      question: "Can I negotiate the price?",
      answer: "Yes, many of our domains accept offers. You can submit an offer through the domain listing page, and the seller will review and respond to your proposal."
    },
    {
      question: "What happens after I purchase a domain?",
      answer: "After purchase, you'll receive detailed instructions for domain transfer. Our team will assist you throughout the process until the domain is successfully transferred to your account."
    },
    {
      question: "Do you offer domain financing?",
      answer: "Yes, we offer financing options for domains over $10,000. Contact our sales team to discuss payment plans that fit your budget."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee if the domain cannot be transferred due to issues on our end. Once the domain is successfully transferred, the sale is final."
    },
    {
      question: "How do you verify domain ownership?",
      answer: "We verify domain ownership through multiple methods including WHOIS verification, DNS verification, and direct communication with current registrars before listing any domain."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl">Find answers to common questions about domain buying and selling</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {openIndex === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-4">Our support team is here to help you 24/7</p>
              <a href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}