import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function HelpPage() {
  const helpCategories = [
    {
      title: "Getting Started",
      articles: [
        { title: "How to search for domains", url: "/help/search" },
        { title: "Understanding domain pricing", url: "/help/pricing" },
        { title: "Creating an account", url: "/help/account" }
      ]
    },
    {
      title: "Buying Domains",
      articles: [
        { title: "How to purchase a domain", url: "/help/purchase" },
        { title: "Payment methods", url: "/help/payment" },
        { title: "Transfer process", url: "/help/transfer" }
      ]
    },
    {
      title: "Selling Domains",
      articles: [
        { title: "How to list your domain", url: "/help/list" },
        { title: "Setting the right price", url: "/help/price-domain" },
        { title: "Negotiating offers", url: "/help/negotiate" }
      ]
    }
  ]

  const popularArticles = [
    { title: "How long does domain transfer take?", url: "/help/transfer-time" },
    { title: "What payment methods do you accept?", url: "/help/payment-methods" },
    { title: "How do I reset my password?", url: "/help/reset-password" },
    { title: "What is your refund policy?", url: "/help/refunds" }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl">Find answers to your questions about domain buying and selling</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search for help..."
                  className="w-full px-6 py-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularArticles.map((article, index) => (
                  <Link key={index} href={article.url} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
                    <h3 className="font-medium text-gray-800">{article.title}</h3>
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <Link href={article.url} className="text-blue-600 hover:underline text-sm">
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact Support */}
            <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h3>
              <p className="text-gray-600 mb-4">Our support team is here to help you 24/7</p>
              <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}