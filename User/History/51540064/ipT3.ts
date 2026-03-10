export interface FeatureFlags {
  analytics: boolean;
  logging: boolean;
  debugging: boolean;
  betaFeatures: boolean;
  paymentGateway: boolean;
  realTimeNotifications: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  darkMode: boolean;
  logo: string;
  favicon: string;
  customCSS?: string;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  enableMocking: boolean;
  version: string;
}

export interface SecurityConfig {
  enableCSP: boolean;
  allowedOrigins: string[];
  enableCORS: boolean;
  jwtExpiration: number;
}

export interface MonitoringConfig {
  sentryDsn?: string;
  googleAnalyticsId?: string;
  hotjarId?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  enablePerformanceMonitoring: boolean;
}

export interface RuntimeConfig {
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
  sourceMap: boolean;
  features: FeatureFlags;
  theme: ThemeConfig;
  api: ApiConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
  customizations: {
    welcomeMessage: string;
    supportEmail: string;
    maxFileUploadSize: number;
    enabledLanguages: string[];
    currency: string;
    timezone: string;
  };
}
