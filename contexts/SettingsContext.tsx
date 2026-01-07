// contexts/SettingsContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
    currency: string;
  };
  payment: {
    stripeEnabled: boolean;
    stripePublishableKey: string;
    stripeSecretKey: string;
    paypalEnabled: boolean;
    paypalClientId: string;
    paypalSecret: string;
    escrowEnabled: boolean;
    escrowApiKey: string;
  };
  email: {
    smtpHost: string;
    smtpPort: string;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  security: {
    enableTwoFactor: boolean;
    passwordMinLength: number;
    requireStrongPassword: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
    googleAnalyticsId: string;
    googleSiteVerification: string;
  };
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    general: {
      siteName: 'DomainHub',
      siteDescription: 'Your premier destination for buying and selling premium domains',
      siteUrl: 'https://domainhub.com',
      contactEmail: 'admin@domainhub.com',
      contactPhone: '+1-555-0123',
      timezone: 'UTC',
      currency: 'USD'
    },
    payment: {
      stripeEnabled: true,
      stripePublishableKey: '',
      stripeSecretKey: '',
      paypalEnabled: true,
      paypalClientId: '',
      paypalSecret: '',
      escrowEnabled: false,
      escrowApiKey: ''
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      fromEmail: 'noreply@domainhub.com',
      fromName: 'DomainHub'
    },
    security: {
      enableTwoFactor: true,
      passwordMinLength: 8,
      requireStrongPassword: true,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 60
    },
    seo: {
      metaTitle: 'DomainHub - Premium Domain Marketplace',
      metaDescription: 'Buy and sell premium domains with ease',
      metaKeywords: 'domains, premium domains, domain marketplace, buy domains, sell domains',
      googleAnalyticsId: '',
      googleSiteVerification: ''
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
        setError(null)
      } else {
        setError('Failed to load settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // Update document metadata when SEO settings change
  useEffect(() => {
    if (!loading && settings.seo.metaTitle) {
      document.title = settings.seo.metaTitle
      
      // Update meta tags
      const updateMetaTag = (name: string, content: string) => {
        let metaTag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.name = name
          document.head.appendChild(metaTag)
        }
        metaTag.content = content
      }

      const updatePropertyTag = (property: string, content: string) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
        if (!metaTag) {
          metaTag = document.createElement('meta')
          metaTag.property = property
          document.head.appendChild(metaTag)
        }
        metaTag.content = content
      }

      // Update SEO meta tags
      updateMetaTag('description', settings.seo.metaDescription)
      updateMetaTag('keywords', settings.seo.metaKeywords)
      
      // Update Open Graph tags
      updatePropertyTag('og:title', settings.seo.metaTitle)
      updatePropertyTag('og:description', settings.seo.metaDescription)
      
      // Update Twitter Card tags
      updateMetaTag('twitter:title', settings.seo.metaTitle)
      updateMetaTag('twitter:description', settings.seo.metaDescription)
      
      // Update Google Analytics if ID is provided
      if (settings.seo.googleAnalyticsId) {
        updateGoogleAnalytics(settings.seo.googleAnalyticsId)
      }
    }
  }, [settings.seo, loading])

  const updateGoogleAnalytics = (gaId: string) => {
    // Remove existing GA script if any
    const existingScript = document.querySelector('script[data-ga-id]')
    if (existingScript) {
      existingScript.remove()
    }

    // Add new GA script
    const script = document.createElement('script')
    script.setAttribute('data-ga-id', gaId)
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script)

    const configScript = document.createElement('script')
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `
    document.head.appendChild(configScript)
  }

  const refreshSettings = async () => {
    await fetchSettings()
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}