import type { RuntimeConfig } from "@/types/config";

export const loadRuntimeConfig = async (): Promise<RuntimeConfig> => {
  const hostname = window.location.hostname;

  // Try to load from server first

  // Fallback to domain-based configuration
  return getDomainBasedConfig(hostname);
};

const getDomainBasedConfig = (hostname: string): RuntimeConfig => {
  const baseConfig: Partial<RuntimeConfig> = {
    security: {
      enableCSP: true,
      allowedOrigins: [hostname],
      enableCORS: true,
      jwtExpiration: 3600
    }
  };

  if (hostname.includes('dev')) {
    return {
      ...baseConfig,
      environment: 'development',
      debug: true,
      sourceMap: true,
      features: {
        analytics: false,
        logging: true,
        debugging: true,
        betaFeatures: true,
        paymentGateway: false, // Use sandbox
        realTimeNotifications: true
      },
      theme: {
        primaryColor: '#ff6b6b',
        secondaryColor: '#4ecdc4',
        darkMode: true,
        logo: '/assets/logo-dev.svg',
        favicon: '/assets/favicon-dev.ico',
        customCSS: '/styles/dev-theme.css'
      },
      api: {
        baseUrl: 'https://api-dev.hieu.com',
        timeout: 30000,
        retryAttempts: 3,
        enableMocking: true,
        version: 'v1'
      },
      security: {
        ...baseConfig.security!,
        enableCSP: false, // Relaxed for development
        jwtExpiration: 86400 // 24 hours for dev
      },
      monitoring: {
        sentryDsn: undefined, // No error tracking in dev
        googleAnalyticsId: undefined,
        hotjarId: undefined,
        logLevel: 'debug',
        enablePerformanceMonitoring: true
      },
      customizations: {
        welcomeMessage: '🚀 Welcome to Development Environment!',
        supportEmail: 'dev-support@hieu.com',
        maxFileUploadSize: 100 * 1024 * 1024, // 100MB
        enabledLanguages: ['en', 'vi', 'ja'],
        currency: 'USD',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    } as RuntimeConfig;
  }

  else if (hostname.includes('stag')) {
    return {
      ...baseConfig,
      environment: 'staging',
      debug: false,
      sourceMap: false,
      features: {
        analytics: true,
        logging: true,
        debugging: false,
        betaFeatures: true,
        paymentGateway: true, // Sandbox mode
        realTimeNotifications: true
      },
      theme: {
        primaryColor: '#ffa726',
        secondaryColor: '#26a69a',
        darkMode: false,
        logo: '/assets/logo-staging.svg',
        favicon: '/assets/favicon-staging.ico'
      },
      api: {
        baseUrl: 'https://api-staging.hieu.com',
        timeout: 15000,
        retryAttempts: 2,
        enableMocking: false,
        version: 'v1'
      },
      security: {
        ...baseConfig.security!,
        jwtExpiration: 7200 // 2 hours
      },
      monitoring: {
        sentryDsn: 'https://staging-sentry-dsn@sentry.io/staging',
        googleAnalyticsId: 'GA-STAGING-123',
        hotjarId: 'staging-hotjar-id',
        logLevel: 'info',
        enablePerformanceMonitoring: true
      },
      customizations: {
        welcomeMessage: '⚡ Staging Environment - Please test thoroughly!',
        supportEmail: 'staging-support@hieu.com',
        maxFileUploadSize: 50 * 1024 * 1024, // 50MB
        enabledLanguages: ['en', 'vi'],
        currency: 'USD',
        timezone: 'Asia/Ho_Chi_Minh'
      }
    } as RuntimeConfig;
  }

  else {
    // Production
    return {
      ...baseConfig,
      environment: 'production',
      debug: false,
      sourceMap: false,
      features: {
        analytics: true,
        logging: false,
        debugging: false,
        betaFeatures: false,
        paymentGateway: true, // Live mode
        realTimeNotifications: true
      },
      theme: {
        primaryColor: '#2196f3',
        secondaryColor: '#ff9800',
        darkMode: false,
        logo: '/assets/logo.svg',
        favicon: '/assets/favicon.ico'
      },
      api: {
        baseUrl: 'https://api.hieu.com',
        timeout: 10000,
        retryAttempts: 1,
        enableMocking: false,
        version: 'v1'
      },
      security: {
        ...baseConfig.security!,
        jwtExpiration: 3600 // 1 hour
      },
      monitoring: {
        sentryDsn: 'https://prod-sentry-dsn@sentry.io/prod',
        googleAnalyticsId: 'GA-PROD-456',
        hotjarId: 'prod-hotjar-id',
        logLevel: 'error',
        enablePerformanceMonitoring: false
      },
      customizations: {
        welcomeMessage: 'Welcome to our platform!',
        supportEmail: 'support@hieu.com',
        maxFileUploadSize: 25 * 1024 * 1024, // 25MB
        enabledLanguages: ['en'],
        currency: 'USD',
        timezone: 'UTC'
      }
    } as RuntimeConfig;
  }
};
