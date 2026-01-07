// app/admin/settings/page.tsx
'use client'
import { useState, useEffect } from 'react'

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

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [error, setError] = useState('')

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

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        setSettings(data.data)
      } else {
        setError('Failed to load settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setError('Failed to load settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (section: keyof Settings) => {
    setIsSaving(true)
    setSaveMessage('')
    setError('')
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: section,
          settings: settings[section]
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setSaveMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
        // Update the frontend metadata if SEO settings were changed
        if (section === 'seo') {
          updateFrontendMetadata(settings.seo)
        }
      } else {
        setError(data.error || 'Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      setError('Failed to save settings')
    } finally {
      setIsSaving(false)
      setTimeout(() => setSaveMessage(''), 3000)
    }
  }

  const updateFrontendMetadata = (seoSettings: Settings['seo']) => {
    // Update document title
    document.title = seoSettings.metaTitle
    
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
    updateMetaTag('description', seoSettings.metaDescription)
    updateMetaTag('keywords', seoSettings.metaKeywords)
    
    // Update Open Graph tags
    updatePropertyTag('og:title', seoSettings.metaTitle)
    updatePropertyTag('og:description', seoSettings.metaDescription)
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', seoSettings.metaTitle)
    updateMetaTag('twitter:description', seoSettings.metaDescription)
    
    // Update Google Analytics if ID is provided
    if (seoSettings.googleAnalyticsId) {
      updateGoogleAnalytics(seoSettings.googleAnalyticsId)
    }
  }

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

  const handleInputChange = (section: keyof Settings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'seo', name: 'SEO', icon: '🔍' }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Site URL</label>
          <input
            type="url"
            value={settings.general.siteUrl}
            onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            type="tel"
            value={settings.general.contactPhone}
            onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Currency</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )

  // Similar functions for other settings tabs (payment, email, security, seo)
  // I'll continue with the remaining code...

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="border-b pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stripe</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment.stripeEnabled}
              onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable Stripe</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publishable Key</label>
            <input
              type="password"
              value={settings.payment.stripePublishableKey}
              onChange={(e) => handleInputChange('payment', 'stripePublishableKey', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pk_live_..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Secret Key</label>
            <input
              type="password"
              value={settings.payment.stripeSecretKey}
              onChange={(e) => handleInputChange('payment', 'stripeSecretKey', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="sk_live_..."
            />
          </div>
        </div>
      </div>

      <div className="border-b pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">PayPal</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment.paypalEnabled}
              onChange={(e) => handleInputChange('payment', 'paypalEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable PayPal</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Client ID</label>
            <input
              type="text"
              value={settings.payment.paypalClientId}
              onChange={(e) => handleInputChange('payment', 'paypalClientId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Secret</label>
            <input
              type="password"
              value={settings.payment.paypalSecret}
              onChange={(e) => handleInputChange('payment', 'paypalSecret', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Escrow</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.payment.escrowEnabled}
              onChange={(e) => handleInputChange('payment', 'escrowEnabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">Enable Escrow</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              value={settings.payment.escrowApiKey}
              onChange={(e) => handleInputChange('payment', 'escrowApiKey', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Continue with remaining render functions...
  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
          <input
            type="number"
            value={settings.email.smtpPort}
            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SMTP Username</label>
          <input
            type="text"
            value={settings.email.smtpUsername}
            onChange={(e) => handleInputChange('email', 'smtpUsername', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
          <input
            type="password"
            value={settings.email.smtpPassword}
            onChange={(e) => handleInputChange('email', 'smtpPassword', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleInputChange('email', 'fromEmail', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">From Name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleInputChange('email', 'fromName', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.enableTwoFactor}
            onChange={(e) => handleInputChange('security', 'enableTwoFactor', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Enable Two-Factor Authentication</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.requireStrongPassword}
            onChange={(e) => handleInputChange('security', 'requireStrongPassword', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">Require Strong Passwords</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Password Length</label>
          <input
            type="number"
            min="6"
            max="32"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Max Login Attempts</label>
          <input
            type="number"
            min="3"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lockout Duration (minutes)</label>
          <input
            type="number"
            min="5"
            max="1440"
            value={settings.security.lockoutDuration}
            onChange={(e) => handleInputChange('security', 'lockoutDuration', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Timeout (minutes)</label>
          <input
            type="number"
            min="15"
            max="1440"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Title</label>
          <input
            type="text"
            value={settings.seo.metaTitle}
            onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description</label>
          <textarea
            value={settings.seo.metaDescription}
            onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Keywords</label>
          <textarea
            value={settings.seo.metaKeywords}
            onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
            rows={2}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="comma, separated, keywords"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
            <input
              type="text"
              value={settings.seo.googleAnalyticsId}
              onChange={(e) => handleInputChange('seo', 'googleAnalyticsId', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Site Verification</label>
            <input
              type="text"
              value={settings.seo.googleSiteVerification}
              onChange={(e) => handleInputChange('seo', 'googleSiteVerification', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        {saveMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {saveMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && renderGeneralSettings()}
          {activeTab === 'payment' && renderPaymentSettings()}
          {activeTab === 'email' && renderEmailSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
          {activeTab === 'seo' && renderSEOSettings()}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => handleSave(activeTab as keyof Settings)}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}