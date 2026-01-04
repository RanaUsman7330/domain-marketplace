// /contexts/WatchlistContext.tsx - BASIC IMPLEMENTATION
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WatchlistItem {
  id: number
  name: string
  price: number
  category: string
  extension: string
  status: string
}

interface WatchlistContextType {
  watchlist: WatchlistItem[]
  addToWatchlist: (item: WatchlistItem) => void
  removeFromWatchlist: (id: number) => void
  isInWatchlist: (id: number) => boolean
  itemCount: number
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function useWatchlist() {
  const context = useContext(WatchlistContext)
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider')
  }
  return context
}

interface WatchlistProviderProps {
  children: ReactNode
}

export function WatchlistProvider({ children }: WatchlistProviderProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      try {
        const parsedWatchlist = JSON.parse(savedWatchlist)
        setWatchlist(parsedWatchlist)
      } catch (error) {
        console.error('Error parsing saved watchlist:', error)
        localStorage.removeItem('watchlist')
      }
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (item: WatchlistItem) => {
    setWatchlist(prevWatchlist => {
      // Check if item already exists
      const exists = prevWatchlist.find(watchlistItem => watchlistItem.id === item.id)
      if (exists) {
        return prevWatchlist // Don't add duplicates
      }
      return [...prevWatchlist, item]
    })
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prevWatchlist => prevWatchlist.filter(item => item.id !== id))
  }

  const isInWatchlist = (id: number) => {
    return watchlist.some(item => item.id === id)
  }

  const itemCount = watchlist.length

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    itemCount
  }

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  )
}