// hooks/useSiteSettings.ts
import { useSettings } from '@/contexts/SettingsContext'

export function useSiteSettings() {
  const { settings, loading, error, refreshSettings } = useSettings()

  return {
    // General settings
    siteName: settings.general.siteName,
    siteDescription: settings.general.siteDescription,
    siteUrl: settings.general.siteUrl,
    contactEmail: settings.general.contactEmail,
    contactPhone: settings.general.contactPhone,
    timezone: settings.general.timezone,
    currency: settings.general.currency,

    // Payment settings
    stripeEnabled: settings.payment.stripeEnabled,
    stripePublishableKey: settings.payment.stripePublishableKey,
    paypalEnabled: settings.payment.paypalEnabled,
    paypalClientId: settings.payment.paypalClientId,
    escrowEnabled: settings.payment.escrowEnabled,

    // Email settings
    smtpHost: settings.email.smtpHost,
    smtpPort: settings.email.smtpPort,
    smtpUsername: settings.email.smtpUsername,
    fromEmail: settings.email.fromEmail,
    fromName: settings.email.fromName,

    // Security settings
    enableTwoFactor: settings.security.enableTwoFactor,
    passwordMinLength: settings.security.passwordMinLength,
    requireStrongPassword: settings.security.requireStrongPassword,
    maxLoginAttempts: settings.security.maxLoginAttempts,
    lockoutDuration: settings.security.lockoutDuration,
    sessionTimeout: settings.security.sessionTimeout,

    // SEO settings
    metaTitle: settings.seo.metaTitle,
    metaDescription: settings.seo.metaDescription,
    metaKeywords: settings.seo.metaKeywords,
    googleAnalyticsId: settings.seo.googleAnalyticsId,
    googleSiteVerification: settings.seo.googleSiteVerification,

    // Loading states
    isLoading: loading,
    error,
    refreshSettings
  }
}