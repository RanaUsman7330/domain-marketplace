// /app/page.tsx - FIXED VERSION
'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DomainCard from '@/components/DomainCard'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleSearch = (term: string) => {
    if (term) {
      router.push(`/domains?search=${encodeURIComponent(term)}`)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            🚀 Find Your Perfect Domain
          </h1>
          <p className="text-xl mb-8">
            Discover thousands of premium, luxury, and brandable domains. Whether you're starting a startup or scaling an empire, find the perfect digital address.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Popular: startup.co</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">nexus.io</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">vision.tech</span>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Featured Domains */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Premium Domains
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Hand-picked domains for discerning entrepreneurs
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DomainCard 
              id={1}
              name="venture.co"
              price={45000}
              category="premium"
              status="available"
              length={7}
              extension=".co"
              description="Premium business domain perfect for startups and ventures"
              imageUrl=""
              isFeatured={true}
            />
            <DomainCard 
              id={2}
              name="nexus.io"
              price={35000}
              category="premium"
              status="available"
              length={5}
              extension=".io"
              description="Tech-focused domain ideal for innovative platforms"
              imageUrl=""
              isFeatured={true}
            />
            <DomainCard 
              id={3}
              name="luxe.com"
              price={125000}
              category="luxury"
              status="available"
              length={4}
              extension=".com"
              description="Ultra-premium luxury brand domain"
              imageUrl=""
              isFeatured={true}
            />
          </div>
          <div className="text-center mt-8">
            <Link href="/domains" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
              Browse All Domains
            </Link>
          </div>
        </div>
      </section>

      {/* Rest of your page content remains the same */}
      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Domain Categories
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Find the perfect domain for your business type
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Technology', 'E-commerce', 'Finance', 'Health', 'Education', 'Real Estate', 'Fashion', 'Food'].map((category) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                <h3 className="font-semibold text-lg">{category}</h3>
                <p className="text-gray-600 text-sm mt-2">125 domains</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose DomainHub?
          </h2>
          <p className="text-center text-gray-600 mb-12">
            The premier destination for domain buyers and sellers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Verified Sellers</h3>
              <p className="text-gray-600">All domains verified and registered with legitimate ownership</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Transfer</h3>
              <p className="text-gray-600">Quick domain transfers with 24/7 support team assistance</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with no hidden fees or surprise charges</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated team ready to help with any questions or concerns</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-lg mb-2">Search & Browse</h3>
              <p className="text-gray-600">Find the perfect domain from our curated collection of premium names</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-lg mb-2">Make an Offer</h3>
              <p className="text-gray-600">Submit an offer or negotiate with the seller for the best price</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-lg mb-2">Secure Transfer</h3>
              <p className="text-gray-600">Complete payment and transfer your domain in minutes with our secure system</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/how-it-works" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials section would go here if you have it */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
          <p className="text-gray-600">Join thousands of satisfied customers</p>
        </div>
      </div>
    </main>
  )
}