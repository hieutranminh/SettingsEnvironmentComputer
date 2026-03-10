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
