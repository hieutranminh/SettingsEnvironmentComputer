import { apiService } from '../api'
import type { ApiResponse } from '@/types/ApiResponse'

// Types for Naver operations
export interface NaverLoginRequest {
  code: string
  state: string
}

export interface NaverUserInfoRequest {
  accessToken: string
}

export interface NaverLoginResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface NaverUserInfoResponse {
  id: string
  email: string
  name: string
  nickname: string
  profileImage: string
  age?: string
  gender?: string
  mobile?: string
  birthday?: string
}

export interface NaverSearchRequest {
  query: string
  display?: number
  start?: number
  sort?: 'sim' | 'date'
  filter?: 'all' | 'large' | 'medium' | 'small'
}

export interface NaverSearchResponse {
  items: Array<{
    title: string
    link: string
    description: string
    thumbnail?: string
  }>
  total: number
  start: number
  display: number
}

export interface NaverMapRequest {
  query: string
  coordinate?: string
  bounds?: string
  page?: number
  display?: number
}

export interface NaverMapResponse {
  items: Array<{
    title: string
    link: string
    category: string
    description: string
    telephone: string
    address: string
    roadAddress: string
    mapx: string
    mapy: string
  }>
  total: number
  start: number
  display: number
}

// Naver authentication functions
export const naverLogin = async (data: NaverLoginRequest): Promise<ApiResponse<NaverLoginResponse>> => {
  return apiService.post<NaverLoginResponse>('/api/auth/v1/Naver/Login', data)
}

export const getNaverUserInfo = async (accessToken: string): Promise<ApiResponse<NaverUserInfoResponse>> => {
  // Store the access token temporarily for this request
  const originalToken = localStorage.getItem('auth_token')
  localStorage.setItem('auth_token', accessToken)

  try {
    return await apiService.get<NaverUserInfoResponse>('/api/auth/v1/Naver/UserInfo')
  } finally {
    // Restore the original token
    if (originalToken) {
      localStorage.setItem('auth_token', originalToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }
}

// Naver search functions
export const searchNaver = async (params: NaverSearchRequest): Promise<ApiResponse<NaverSearchResponse>> => {
  const queryParams = new URLSearchParams()

  queryParams.append('query', params.query)
  if (params.display) queryParams.append('display', params.display.toString())
  if (params.start) queryParams.append('start', params.start.toString())
  if (params.sort) queryParams.append('sort', params.sort)
  if (params.filter) queryParams.append('filter', params.filter)

  const queryString = queryParams.toString()
  const endpoint = `/api/search/v1/Naver/Search${queryString ? `?${queryString}` : ''}`

  return apiService.get<NaverSearchResponse>(endpoint)
}

// Naver map functions
export const searchNaverMap = async (params: NaverMapRequest): Promise<ApiResponse<NaverMapResponse>> => {
  const queryParams = new URLSearchParams()

  queryParams.append('query', params.query)
  if (params.coordinate) queryParams.append('coordinate', params.coordinate)
  if (params.bounds) queryParams.append('bounds', params.bounds)
  if (params.page) queryParams.append('page', params.page.toString())
  if (params.display) queryParams.append('display', params.display.toString())

  const queryString = queryParams.toString()
  const endpoint = `/api/map/v1/Naver/Search${queryString ? `?${queryString}` : ''}`

  return apiService.get<NaverMapResponse>(endpoint)
}

// Naver callback URL generation
export const getNaverAuthUrl = (): string => {
  const clientId = import.meta.env.VITE_NAVER_CLIENT_ID
  const redirectUri = import.meta.env.VITE_NAVER_REDIRECT_URI
  const state = Math.random().toString(36).substring(2, 15)

  return `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
}
