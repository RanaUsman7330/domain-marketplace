'use client'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import DomainCard from '@/components/DomainCard'
import SearchBar from '@/components/SearchBar'
import FilterSidebar from '@/components/FilterSidebar'
import Link from 'next/link'



interface Domain {
  id: number
  name: string
  price: number
  category: string
  status: string
  length: number
  extension: string
  description: string
  imageUrl?: string
  isFeatured?: boolean
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    categories: [] as string[],
    extensions: [] as string[],
    status: [] as string[],
    priceMin: '',
    priceMax: '',
    lengthMin: '',
    lengthMax: '',
    sortBy: 'newest'
  })
  const domainsPerPage = 12

  // Fetch domains from API
  const fetchDomains = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/domains')
      const data = await response.json()
      
      if (data.success) {
        setDomains(data.domains || [])
        setFilteredDomains(data.domains || [])
      } else {
        setDomains([])
        setFilteredDomains([])
      }
    } catch (error) {
      console.error('Error fetching domains:', error)
      setDomains([])
      setFilteredDomains([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch domains on component mount
  useEffect(() => {
    fetchDomains()
  }, [])

  // Handle filters change
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    applyFilters(newFilters, searchTerm)
    setCurrentPage(1)
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(filters, term)
    setCurrentPage(1)
  }

  // Apply filters and search
  const applyFilters = (currentFilters: any, searchTerm: string) => {
    let filtered = [...domains]

    // Apply category filter
    if (currentFilters.categories.length > 0) {
      filtered = filtered.filter(domain => 
        currentFilters.categories.includes(domain.category)
      )
    }

    // Apply extension filter
    if (currentFilters.extensions.length > 0) {
      filtered = filtered.filter(domain => 
        currentFilters.extensions.includes(domain.extension)
      )
    }

    // Apply price range filter
    if (currentFilters.priceMin || currentFilters.priceMax) {
      filtered = filtered.filter(domain => {
        const price = Number(domain.price)
        const min = currentFilters.priceMin ? Number(currentFilters.priceMin) : 0
        const max = currentFilters.priceMax ? Number(currentFilters.priceMax) : Infinity
        return price >= min && price <= max
      })
    }

    // Apply length filter
    if (currentFilters.lengthMin || currentFilters.lengthMax) {
      filtered = filtered.filter(domain => {
        const length = domain.name.length
        const min = currentFilters.lengthMin ? Number(currentFilters.lengthMin) : 0
        const max = currentFilters.lengthMax ? Number(currentFilters.lengthMax) : Infinity
        return length >= min && length <= max
      })
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(domain => 
        domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    switch (currentFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    }

    setFilteredDomains(filtered)
  }

  // Apply filters when domains or filters change
  useEffect(() => {
    applyFilters(filters, searchTerm)
  }, [domains, filters, searchTerm])

  // Pagination
  const totalPages = Math.ceil(filteredDomains.length / domainsPerPage)
  const startIndex = (currentPage - 1) * domainsPerPage
  const endIndex = startIndex + domainsPerPage
  const currentDomains = filteredDomains.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading domains...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Premium Domain Marketplace</h1>
            <p className="text-xl mb-8">
              Discover exclusive domains curated for discerning entrepreneurs and businesses
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Domains Grid with Filters */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Premium Domains</h2>
                <p className="text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDomains.length)} of {filteredDomains.length} domains
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select 
                  value={filters.sortBy}
                  onChange={(e) => handleFiltersChange({...filters, sortBy: e.target.value})}
                  className="border border-gray-300 rounded px-4 py-2"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <div className="lg:w-1/4">
                <FilterSidebar onFiltersChange={handleFiltersChange} domains={domains} />
              </div>
              
              {/* Domains List */}
              <div className="lg:w-3/4">
                {/* Domain Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentDomains.map((domain) => (
                    <DomainCard 
                      key={domain.id}
                      id={domain.id}
                      name={domain.name}
                      price={domain.price}
                      category={domain.category}
                      status={domain.status as any}
                      length={domain.length}
                      extension={domain.extension}
                      description={domain.description}
                      imageUrl={domain.imageUrl}
                      isFeatured={domain.isFeatured}
                    />
                  ))}
                </div>

                {/* No Results */}
                {currentDomains.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m8 0V7a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h8a2 2 0 012 2v1.306z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No domains found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search terms</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <div className="flex space-x-2 bg-white rounded-lg shadow-sm p-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === index + 1
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}