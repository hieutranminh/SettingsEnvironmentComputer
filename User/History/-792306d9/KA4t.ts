// API Client for Ahasoft Salon
// Handles API calls to create clients

import type { CreateClientPayload, ApiConfig, ApiResponse } from '../types'

const API_BASE_URL =
  'https://ahasoft-salon-admin-http-aggregator-dev.azurewebsites.net/api/aggr/v1'

// Default configuration - can be overridden via settings
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: API_BASE_URL,
  sessionToken: 'ec770cbb-c88a-4162-c8e2-e9ecb74aeea3',
  shopId: 608232,
  shopLocation: 'kr-ko',
  clientGroupId: 22751,
  clientGroupName: '그룹A',
  clientRatingId: 45688,
  clientRatingName: '우대',
  preferredStaffId: 75253,
  preferredStaffName: 'nnpay',
  clientReferralSourceId: 55019,
  clientReferralSourceName: '인터넷',
}

// Korean names for more realistic data
const KOREAN_FIRST_NAMES = [
  '민준',
  '서준',
  '도윤',
  '예준',
  '시우',
  '하준',
  '주원',
  '지호',
  '지후',
  '준서',
  '서연',
  '서윤',
  '지우',
  '서현',
  '민서',
  '하은',
  '하윤',
  '윤서',
  '지민',
  '채원',
]

const KOREAN_LAST_NAMES = [
  '김',
  '이',
  '박',
  '최',
  '정',
  '강',
  '조',
  '윤',
  '장',
  '임',
  '한',
  '오',
  '서',
  '신',
  '권',
  '황',
  '안',
  '송',
  '류',
  '홍',
]

// Helper functions
function getRandomElement<T>(array: T[]): T {
  const index = Math.floor(Math.random() * array.length)
  return array[index] as T
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateKoreanName(): string {
  const lastName = getRandomElement(KOREAN_LAST_NAMES)
  const firstName = getRandomElement(KOREAN_FIRST_NAMES)
  return `${lastName}${firstName}`
}

function generateKoreanPhone(): string {
  const prefix = '010'
  const middle = getRandomNumber(1000, 9999).toString()
  const last = getRandomNumber(1000, 9999).toString()
  return `${prefix}-${middle}-${last}`
}

function generateKoreanMobile(): string {
  return generateKoreanPhone()
}

function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

// Generate random client payload
export function generateClientPayload(config: Partial<ApiConfig> = {}): CreateClientPayload {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }
  const now = getCurrentTimestamp()

  return {
    sex: getRandomNumber(1, 2), // 1: Male, 2: Female
    email: `test${getRandomNumber(1000, 9999)}@example.com`,
    shopId: mergedConfig.shopId,
    country: 'KR',
    birthDD: getRandomNumber(1, 28),
    memberType: 1,
    phoneNumber: generateKoreanPhone(),
    birthYear: getRandomNumber(1970, 2005),
    mobileNumber: generateKoreanMobile(),
    memberNumber: getRandomNumber(1, 9999),
    birthdayType: 1,
    birthMonth: getRandomNumber(1, 12),
    sessionToken: mergedConfig.sessionToken,
    shopLocation: mergedConfig.shopLocation,
    notes: `Auto generated at ${new Date().toLocaleString()}`,
    mobileNumber2: null,
    recommenderId: null,
    clientGroupId: mergedConfig.clientGroupId,
    clientRatingId: mergedConfig.clientRatingId,
    clientGroupName: mergedConfig.clientGroupName,
    postcode: getRandomNumber(10000, 99999).toString(),
    address1: `서울시 강남구 테헤란로 ${getRandomNumber(1, 500)}`,
    address2: `${getRandomNumber(1, 30)}층 ${getRandomNumber(100, 999)}호`,
    clientRatingName: mergedConfig.clientRatingName,
    preferredStaffId: mergedConfig.preferredStaffId,
    createdDateTimeTS: now,
    clientName: generateKoreanName(),
    allowedMessageType: 3,
    preferredStaffName: mergedConfig.preferredStaffName,
    clientInputDateTimeTS: now - getRandomNumber(0, 3600),
    clientReferralSourceId: mergedConfig.clientReferralSourceId,
    clientReferralSourceName: mergedConfig.clientReferralSourceName,
  }
}

// Create client via API
export async function createClient(
  payload: CreateClientPayload,
  config: Partial<ApiConfig> = {},
): Promise<ApiResponse<unknown>> {
  const baseUrl = config.baseUrl || DEFAULT_CONFIG.baseUrl

  try {
    const response = await fetch(`${baseUrl}/Client/CreateClient`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `API Error: ${response.status} - ${errorText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      data,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: `Network Error: ${errorMessage}`,
    }
  }
}

// Create multiple clients
export async function createMultipleClients(
  count: number,
  config: Partial<ApiConfig> = {},
): Promise<Array<ApiResponse<unknown>>> {
  const results: Array<ApiResponse<unknown>> = []

  for (let i = 0; i < count; i++) {
    const payload = generateClientPayload(config)
    const result = await createClient(payload, config)
    results.push(result)

    // Small delay to avoid rate limiting
    if (i < count - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  return results
}

// Get saved API config from storage
export async function getApiConfig(): Promise<ApiConfig> {
  const result = await chrome.storage.sync.get('apiConfig')
  return { ...DEFAULT_CONFIG, ...result.apiConfig }
}

// Save API config to storage
export async function saveApiConfig(config: Partial<ApiConfig>): Promise<void> {
  const currentConfig = await getApiConfig()
  const newConfig = { ...currentConfig, ...config }
  await chrome.storage.sync.set({ apiConfig: newConfig })
}

