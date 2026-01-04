// /components/FilterSidebar.tsx
'use client'
import { useState, useEffect } from 'react'

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void
  domains: any[]
}

export default function FilterSidebar({ onFiltersChange, domains }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    extensions: [] as string[],
    priceMin: '',
    priceMax: '',
    lengthMin: '',
    lengthMax: '',
    sortBy: 'newest'
  })

  // Get unique values from domains
  const categories = [...new Set(domains.map(d => d.category).filter(Boolean))]
  const extensions = [...new Set(domains.map(d => d.extension).filter(Boolean))]

  const handleFilterChange = (filterType: string, value: any) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCheckboxChange = (filterType: string, value: string) => {
    const currentArray = filters[filterType as keyof typeof filters] as string[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    handleFilterChange(filterType, newArray)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Filters</h3>
      
      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <label key={`category-${category}-${index}`} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCheckboxChange('categories', category)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Extensions */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Extensions</h4>
        <div className="space-y-2">
          {extensions.map((extension, index) => (
            <label key={`extension-${extension}-${index}`} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.extensions.includes(extension)}
                onChange={() => handleCheckboxChange('extensions', extension)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">{extension}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Domain Length */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Domain Length</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min Length</label>
            <input
              type="number"
              value={filters.lengthMin}
              onChange={(e) => handleFilterChange('lengthMin', e.target.value)}
              placeholder="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Length</label>
            <input
              type="number"
              value={filters.lengthMax}
              onChange={(e) => handleFilterChange('lengthMax', e.target.value)}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const clearedFilters = {
            categories: [],
            extensions: [],
            priceMin: '',
            priceMax: '',
            lengthMin: '',
            lengthMax: '',
            sortBy: 'newest'
          }
          setFilters(clearedFilters)
          onFiltersChange(clearedFilters)
        }}
        className="w-full px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}