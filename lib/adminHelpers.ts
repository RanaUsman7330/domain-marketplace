// Helper functions for admin panel

export const formatPrice = (price: string | number): string => {
  if (typeof price === 'string') return price
  return `$${price.toLocaleString()}`
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Available': return 'green'
    case 'Auctioning': return 'yellow'
    case 'Sold': return 'gray'
    case 'Pending': return 'blue'
    default: return 'blue'
  }
}

export const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'Available': return 'bg-green-100 text-green-800'
    case 'Auctioning': return 'bg-yellow-100 text-yellow-800'
    case 'Sold': return 'bg-gray-100 text-gray-800'
    case 'Pending': return 'bg-blue-100 text-blue-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

export const calculatePercentage = (value: number, total: number): number => {
  return total === 0 ? 0 : Math.round((value / total) * 100)
}