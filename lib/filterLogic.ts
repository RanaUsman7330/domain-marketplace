import { sampleDomains } from './sampleData'

export function filterDomains(domains: any[], filters: any) {
  let filtered = [...domains]

  // Filter by categories
  if (filters.categories.length > 0) {
    filtered = filtered.filter(domain => 
      filters.categories.includes(domain.category)
    )
  }

  // Filter by extensions
  if (filters.extensions.length > 0) {
    filtered = filtered.filter(domain => 
      filters.extensions.includes(domain.extension)
    )
  }

  // Filter by status
  if (filters.status.length > 0) {
    filtered = filtered.filter(domain => 
      filters.status.includes(domain.status)
    )
  }

  // Filter by price range
  if (filters.priceMin || filters.priceMax) {
    filtered = filtered.filter(domain => {
      const price = parseInt(domain.price.replace(/[$,]/g, ''))
      const min = filters.priceMin ? parseInt(filters.priceMin) : 0
      const max = filters.priceMax ? parseInt(filters.priceMax) : Infinity
      return price >= min && price <= max
    })
  }

  // Filter by length range
  if (filters.lengthMin || filters.lengthMax) {
    filtered = filtered.filter(domain => {
      const min = filters.lengthMin ? parseInt(filters.lengthMin) : 0
      const max = filters.lengthMax ? parseInt(filters.lengthMax) : Infinity
      return domain.length >= min && domain.length <= max
    })
  }

  // Sort domains
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => parseInt(a.price.replace(/[$,]/g, '')) - parseInt(b.price.replace(/[$,]/g, '')))
      break
    case 'price-high':
      filtered.sort((a, b) => parseInt(b.price.replace(/[$,]/g, '')) - parseInt(a.price.replace(/[$,]/g, '')))
      break
    case 'popularity':
      filtered.sort((a, b) => b.popularity - a.popularity)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      // Keep original order (newest first)
      break
  }

  return filtered
}