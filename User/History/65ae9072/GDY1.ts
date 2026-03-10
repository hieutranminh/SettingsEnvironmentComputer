// Type definitions for Chrome Extension

export type FakeDataType =
  | 'fullName'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'address'
  | 'city'
  | 'country'
  | 'zipCode'
  | 'company'
  | 'jobTitle'
  | 'username'
  | 'password'
  | 'creditCard'
  | 'date'
  | 'uuid'
  | 'lorem'

export type GeneratedData = string | number

export interface DataTypeConfig {
  id: FakeDataType
  label: string
  icon: string
  category: DataCategory
}

export type DataCategory = 'personal' | 'contact' | 'business' | 'security' | 'misc'

export interface CategoryConfig {
  id: DataCategory
  label: string
  icon: string
}

// Message types for Chrome Extension messaging
export interface MessageRequest {
  action: 'generateData' | 'generateMultiple' | 'fillForm' | 'openPopup'
  dataType?: FakeDataType
  dataTypes?: FakeDataType[]
  formData?: Record<string, string>
}

export interface MessageResponse {
  success: boolean
  data?: GeneratedData | Record<string, GeneratedData>
  error?: string
}

export interface ContentMessage {
  action: 'fillInput' | 'fillForm'
  data?: string
  formData?: Record<string, string>
}

// Storage types
export interface ExtensionSettings {
  locale: 'en' | 'vi'
  showFloatingButton: boolean
  autoDetectFields: boolean
  recentDataTypes: FakeDataType[]
  favorites: FakeDataType[]
}

export interface StorageData {
  settings: ExtensionSettings
  history: GeneratedHistoryItem[]
}

export interface GeneratedHistoryItem {
  id: string
  type: FakeDataType
  value: string
  timestamp: number
}

// Form field detection
export interface DetectedField {
  element: HTMLInputElement | HTMLTextAreaElement
  suggestedType: FakeDataType
  confidence: number
}

