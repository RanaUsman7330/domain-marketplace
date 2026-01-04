import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function DisputePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Dispute Policy</h1>
          <p className="text-xl">Last updated: December 29, 2024</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none">
              <h2>1. Overview</h2>
              <p>
                DomainHub is committed to providing a fair and transparent marketplace for domain transactions. 
                This Dispute Policy outlines the procedures for resolving disputes between buyers and sellers 
                using our platform.
              </p>

              <h2>2. Scope of Policy</h2>
              <p>
                This policy applies to disputes related to:
              </p>
              <ul>
                <li>Domain ownership and transfer issues</li>
                <li>Payment and pricing disputes</li>
                <li>Misrepresentation of domain properties</li>
                <li>Service-related issues</li>
                <li>Breach of transaction terms</li>
              </ul>

              <h2>3. Escrow Protection</h2>
              <p>
                <strong>3.1 Secure Transactions:</strong> All transactions are processed through our escrow service 
                to protect both buyers and sellers.<br/>
                <strong>3.2 Payment Hold:</strong> Funds are held in escrow until the domain transfer is confirmed.<br/>
                <strong>3.3 Dispute Hold:</strong> If a dispute is filed, funds remain in escrow until resolution.
              </p>

              <h2>4. Filing a Dispute</h2>
              
              <h3>4.1 Eligibility</h3>
              <p>
                You may file a dispute if:
              </p>
              <ul>
                <li>You are a registered user who participated in the transaction</li>
                <li>The dispute is filed within 30 days of the transaction date</li>
                <li>You have attempted to resolve the issue with the other party</li>
                <li>You provide supporting documentation</li>
              </ul>

              <h3>4.2 Dispute Process</h3>
              <ol>
                <li><strong>Initial Filing:</strong> Submit dispute form with detailed description and evidence</li>
                <li><strong>Review Period:</strong> We review the dispute within 5 business days</li>
                <li><strong>Investigation:</strong> We may request additional information from both parties</li>
                <li><strong>Resolution:</strong> We provide a decision within 30 days of complete filing</li>
              </ol>

              <h2>5. Common Dispute Scenarios</h2>
              
              <h3>5.1 Domain Transfer Issues</h3>
              <p>
                If a domain cannot be transferred due to technical issues, we will work with both parties 
                to resolve the issue. If resolution is not possible, a full refund will be issued to the buyer.
              </p>

              <h3>5.2 Misrepresentation Claims</h3>
              <p>
                If a domain is found to be significantly different from its description (traffic, revenue, 
                age, etc.), the buyer may be eligible for a partial or full refund depending on the severity 
                of the misrepresentation.
              </p>

              <h3>5.3 Payment Disputes</h3>
              <p>
                Payment-related disputes are handled through our payment processors and may require 
                additional documentation from both parties.
              </p>

              <h2>6. Resolution Options</h2>
              <ul>
                <li><strong>Full Refund:</strong> Buyer receives full purchase price</li>
                <li><strong>Partial Refund:</strong> Buyer receives portion of purchase price</li>
                <li><strong>Domain Return:</strong> Buyer returns domain and receives refund</li>
                <li><strong>Price Adjustment:</strong> Seller provides partial refund without return</li>
                <li><strong>Transaction Cancellation:</strong> Both parties agree to cancel</li>
              </ul>

              <h2>7. Arbitration</h2>
              <p>
                If parties cannot reach agreement through our dispute process, either party may request 
                binding arbitration. Arbitration will be conducted by a neutral third party and their 
                decision will be final and binding.
              </p>

              <h2>8. Time Limits</h2>
              <ul>
                <li>Disputes must be filed within 30 days of transaction</li>
                <li>Response to dispute requests: 5 business days</li>
                <li>Complete investigation: 30 days from complete filing</li>
                <li>Arbitration request: 10 days after dispute decision</li>
              </ul>

              <h2>9. Contact Information</h2>
              <p>
                To file a dispute or ask questions about this policy:<br/>
                Email: disputes@domainhub.com<br/>
                Phone: +1 (555) 123-4567<br/>
                Address: 123 Domain Street, Tech City, TX 75001
              </p>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3>Need to File a Dispute?</h3>
                <p className="mb-4">Our dispute resolution team is here to help you resolve any issues fairly and efficiently.</p>
                <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium inline-block">
                  Contact Dispute Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}