import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsPage() {
  const lastUpdated = "December 29, 2024"

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using DomainHub, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable 
                to such services.
              </p>

              <h2>2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on DomainHub's 
                website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>

              <h2>3. Domain Transactions</h2>
              <p>
                <strong>3.1 Escrow Service:</strong> All domain transactions are processed through our secure escrow system. 
                Payment is held until domain transfer is confirmed.<br/>
                <strong>3.2 Transfer Timeline:</strong> Domain transfers typically take 5-7 business days but may vary by registrar.<br/>
                <strong>3.3 Refunds:</strong> Refunds are available within 30 days if domain transfer fails due to seller issues.
              </p>

              <h2>4. User Responsibilities</h2>
              <p>
                You agree to provide accurate and complete information during registration and transactions. You are responsible 
                for maintaining the confidentiality of your account credentials.
              </p>

              <h2>5. Prohibited Activities</h2>
              <p>
                Users are prohibited from: engaging in fraudulent activities, attempting to manipulate prices, using automated 
                systems without permission, violating any applicable laws or regulations.
              </p>

              <h2>6. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by DomainHub and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                In no event shall DomainHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
                for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits.
              </p>

              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to 
                its conflict of law provisions.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will notify users 
                of any significant changes via email or prominent notice on our website.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:<br/>
                Email: legal@domainhub.com<br/>
                Address: 123 Domain Street, Tech City, TX 75001
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}