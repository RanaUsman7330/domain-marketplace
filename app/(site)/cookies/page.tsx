import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl">Last updated: December 29, 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <h2>What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>

              <h2>How We Use Cookies</h2>
              <p>
                DomainHub uses cookies for several purposes:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> These help us understand how visitors use our website</li>
                <li><strong>Functionality Cookies:</strong> These remember your preferences and settings</li>
                <li><strong>Security Cookies:</strong> These help us detect and prevent fraud</li>
              </ul>

              <h2>Types of Cookies We Use</h2>
              
              <h3>1. Session Cookies</h3>
              <p>
                These are temporary cookies that expire when you close your browser. They are used to maintain your 
                session and remember your actions during a single visit.
              </p>

              <h3>2. Persistent Cookies</h3>
              <p>
                These remain on your device for a set period or until you delete them. They help us recognize you 
                when you return to our website.
              </p>

              <h3>3. First-Party Cookies</h3>
              <p>
                These are set by DomainHub and are essential for our services to function properly.
              </p>

              <h3>4. Third-Party Cookies</h3>
              <p>
                These are set by our service providers, such as payment processors and analytics services.
              </p>

              <h2>Specific Cookies We Use</h2>
              
              <h3>Essential Cookies</h3>
              <ul>
                <li><strong>session_id:</strong> Maintains your login session</li>
                <li><strong>csrf_token:</strong> Prevents cross-site request forgery</li>
                <li><strong>cart:</strong> Stores items in your shopping cart</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <ul>
                <li><strong>ga:</strong> Google Analytics for website usage analysis</li>
                <li><strong>_gid:</strong> Google Analytics user ID</li>
                <li><strong>_gat:</strong> Google Analytics request throttling</li>
              </ul>

              <h3>Functionality Cookies</h3>
              <ul>
                <li><strong>preferences:</strong> Stores your site preferences</li>
                <li><strong>language:</strong> Remembers your language selection</li>
                <li><strong>currency:</strong> Remembers your preferred currency</li>
              </ul>

              <h2>Managing Cookies</h2>
              <p>
                Most web browsers allow you to manage cookies through their settings. You can:
              </p>
              <ul>
                <li>View what cookies are stored on your device</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h2>Impact of Disabling Cookies</h2>
              <p>
                If you choose to disable cookies, some features of our website may not function properly. 
                You may not be able to complete transactions or access certain parts of the site.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}