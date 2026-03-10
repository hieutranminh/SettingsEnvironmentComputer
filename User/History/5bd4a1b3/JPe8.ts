/**
 * Shared API utility functions that can be used across multiple features
 */

import { ERROR_MESSAGES } from '@/constants'

// Interface for API error response - can be used by any feature
export interface IApiErrorResponse {
  message?: string
  errorMessages?: { errorMessage: string }[]
}

const MINUTES_PER_HOUR = 60

// Helper function to extract detailed error messages from API response - shared utility
export const extractErrorMessages = (
  response: IApiErrorResponse,
  fallback = ERROR_MESSAGES.UNKNOWN_ERROR,
): string => {
  const base = (response.message ?? '').toString().trim()
  const list = Array.isArray(response.errorMessages)
    ? response.errorMessages.map((e) => e?.errorMessage?.toString().trim()).filter(Boolean)
    : []
  return list.length ? list.join('\n') : base || fallback
}

// Helper function to calculate time in minutes - can be used by features with time calculations
export const calculateTimeMinutes = (hours: string | number, minutes: string | number): number => {
  return (
    parseInt(hours?.toString() ?? '0') * MINUTES_PER_HOUR + parseInt(minutes?.toString() ?? '0')
  )
}

// Helper function to parse numeric value with fallback - shared utility
export const parseNumericValue = (
  value: string | number | null | undefined,
  fallback = 0,
): number => {
  if (value === null || value === undefined) return fallback
  const parsed = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(parsed) ? fallback : parsed
}
