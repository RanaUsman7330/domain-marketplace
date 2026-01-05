import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  const lastUpdated = "December 29, 2024"

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                list a domain, make a purchase, or contact us for support. This may include:
              </p>
              <ul>
                <li>Name, email address, phone number, and mailing address</li>
                <li>Domain ownership information and payment details</li>
                <li>Communications with our customer support team</li>
                <li>Transaction history and account preferences</li>
              </ul>

              <h2>2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Process transactions and facilitate domain transfers</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important account-related notifications</li>
                <li>Improve our services and develop new features</li>
                <li>Comply with legal obligations and prevent fraud</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share information with:
              </p>
              <ul>
                <li>Service providers who assist in our operations (payment processors, escrow services)</li>
                <li>Domain registrars for transfer purposes</li>
                <li>Legal authorities when required by law</li>
                <li>Other parties with your explicit consent</li>
              </ul>

              <h2>4. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                secure servers, and regular security audits.
              </p>

              <h2>5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>

              <h2>6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul>
                <li>Maintain your session and preferences</li>
                <li>Analyze site usage and improve our services</li>
                <li>Provide personalized experiences</li>
                <li>Detect and prevent fraud</li>
              </ul>

              <h2>7. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy 
                practices of these websites and encourage you to review their privacy policies.
              </p>

              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new policy on this page and updating the "Last updated" date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:<br/>
                Email: privacy@domainhub.com<br/>
                Address: 123 Domain Street, Tech City, TX 75001<br/>
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}