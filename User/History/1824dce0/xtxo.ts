import moment from 'moment'
import { PRINT_PREVIEW_CONFIG, TABLE_FORMATS, ALIGNMENT_OPTIONS } from '../constants/print-preview.constants'
import type { TableHeader, TableRowItem, CellStyle } from '../types/print-preview.types'

export const formatDate = (date: string | Date, format: string = PRINT_PREVIEW_CONFIG.STANDARD_DATE_FORMAT): string => {
  if (!date) return ''
  return moment(date).format(format)
}

export const formatCurrency = (amount: number, currency: string = 'KRW'): string => {
  if (amount === null || amount === undefined) return ''
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatNumber = (value: number, decimals: number = 0): string => {
  if (value === null || value === undefined) return ''
  return new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export const formatPercentage = (value: number, decimals: number = 2): string => {
  if (value === null || value === undefined) return ''
  return `${formatNumber(value, decimals)}%`
}

export const formatCellValue = (
  value: any,
  format: string = TABLE_FORMATS.TEXT,
  options: Record<string, any> = {}
): string => {
  if (value === null || value === undefined) return ''

  switch (format) {
    case TABLE_FORMATS.DATE:
      return formatDate(value, options.dateFormat)
    case TABLE_FORMATS.CURRENCY:
      return formatCurrency(Number(value), options.currency)
    case TABLE_FORMATS.NUMBER:
      return formatNumber(Number(value), options.decimals)
    case TABLE_FORMATS.PERCENTAGE:
      return formatPercentage(Number(value), options.decimals)
    default:
      return String(value)
  }
}

export const getCellAlignment = (header: TableHeader): string => {
  if (header.align) return header.align
  
  switch (header.format) {
    case TABLE_FORMATS.NUMBER:
    case TABLE_FORMATS.CURRENCY:
    case TABLE_FORMATS.PERCENTAGE:
      return ALIGNMENT_OPTIONS.RIGHT
    case TABLE_FORMATS.DATE:
      return ALIGNMENT_OPTIONS.CENTER
    default:
      return ALIGNMENT_OPTIONS.LEFT
  }
}

export const getColumnWidth = (header: TableHeader, defaultWidth: number = 100): number => {
  if (header.width) return header.width
  
  switch (header.format) {
    case TABLE_FORMATS.DATE:
      return 120
    case TABLE_FORMATS.CURRENCY:
    case TABLE_FORMATS.NUMBER:
      return 100
    case TABLE_FORMATS.PERCENTAGE:
      return 80
    default:
      return defaultWidth
  }
}

export const generateFileName = (
  reportName: string,
  date: Date = new Date(),
  extension: string = ''
): string => {
  const formattedDate = moment(date).format(`${PRINT_PREVIEW_CONFIG.STANDARD_DATE_FORMAT} ${PRINT_PREVIEW_CONFIG.STANDARD_HOUR_FORMAT}`)
  const baseName = `${reportName} (${formattedDate})`
  return extension ? `${baseName}${extension}` : baseName
}

export const calculateProgressPercentage = (current: number, total: number): number => {
  if (total === 0) return 0
  return Math.round((current / total) * 100)
}

export const validateTableHeaders = (headers: TableHeader[]): boolean => {
  if (!Array.isArray(headers) || headers.length === 0) return false
  
  return headers.every(header => 
    header.key && 
    header.label && 
    typeof header.key === 'string' && 
    typeof header.label === 'string'
  )
}

export const validateTableData = (data: TableRowItem[], headers: TableHeader[]): boolean => {
  if (!Array.isArray(data)) return false
  
  const requiredKeys = headers.map(header => header.key)
  
  return data.every(row => 
    typeof row === 'object' && 
    row !== null &&
    requiredKeys.every(key => key in row)
  )
}

export const applyCellStyles = (
  baseStyles: CellStyle,
  customStyles: CellStyle = {}
): CellStyle => {
  return {
    ...baseStyles,
    ...customStyles,
  }
}

export const getDefaultCellStyle = (isHeader: boolean = false): CellStyle => {
  return isHeader 
    ? {
        backgroundColor: '#f8f9fa',
        color: '#212529',
        fontWeight: 'bold',
        fontSize: 12,
        alignment: ALIGNMENT_OPTIONS.CENTER,
      }
    : {
        backgroundColor: '#ffffff',
        color: '#212529',
        fontWeight: 'normal',
        fontSize: 11,
        alignment: ALIGNMENT_OPTIONS.LEFT,
      }
}

export const sanitizeHtml = (html: string): string => {
  if (!html) return ''
  
  // Remove potentially dangerous HTML tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
}

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text || text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const escapeHtml = (text: string): string => {
  if (!text) return ''
  
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export const unescapeHtml = (html: string): string => {
  if (!html) return ''
  
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || ''
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
} 