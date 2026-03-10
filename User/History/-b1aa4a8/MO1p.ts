// Authentication related types
export interface LoginCredentials {
  username: string
  password: string
  fcm_token: string
}

export interface AuthTokenData {
  access_token: string
  access_token_expired_at: string
  refresh_token: string
  refresh_token_expired_at: string
}

// Specific response types using the generic API structure
export type LoginResponse = AuthTokenData
