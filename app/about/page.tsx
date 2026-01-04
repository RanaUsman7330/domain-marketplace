import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
      bio: "10+ years in domain industry, former GoDaddy executive"
    },
    {
      name: "Michael Chen", 
      role: "CTO",
      image: "/api/placeholder/150/150",
      bio: "Full-stack developer with expertise in marketplace platforms"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Sales",
      image: "/api/placeholder/150/150",
      bio: "Domain brokerage expert with $50M+ in sales"
    }
  ]

  const stats = [
    { number: "50,000+", label: "Premium Domains" },
    { number: "10,000+", label: "Happy Customers" },
    { number: "$500M+", label: "Domains Sold" },
    { number: "24/7", label: "Customer Support" }
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About DomainHub</h1>
          <p className="text-xl">Your trusted partner in premium domain transactions</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2020, DomainHub emerged from a simple vision: to create the most trusted and 
                efficient marketplace for premium domain names. We recognized that buying and selling 
                high-value domains needed a specialized platform that understands the unique challenges 
                and opportunities in the domain industry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  To democratize access to premium digital real estate by providing a secure, 
                  transparent, and efficient marketplace for domain transactions.
                </p>
                <p className="text-gray-600">
                  We believe that every great business deserves a great domain name, and we're 
                  here to make that connection happen seamlessly.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-gray-600 mb-4">
                  To become the world's most trusted platform for premium domain transactions, 
                  setting the standard for security, transparency, and customer satisfaction.
                </p>
                <p className="text-gray-600">
                  We envision a future where premium domains are accessible to businesses of all sizes, 
                  empowering entrepreneurs to build stronger brands online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                Every transaction is backed by our secure escrow system and clear communication. 
                We believe in building long-term relationships through honesty.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Speed & Efficiency</h3>
              <p className="text-gray-600">
                Time is money in business. Our streamlined processes ensure quick domain transfers 
                and responsive customer support around the clock.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your success is our success. We provide personalized service and expert guidance 
                to help you find the perfect domain for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced team combines deep domain industry knowledge with cutting-edge technology 
              to deliver exceptional service to our clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">👤</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Domain?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers who found their ideal domain with DomainHub</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/domains" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Browse Domains
            </Link>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}