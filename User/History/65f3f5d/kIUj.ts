import type { PrintPreviewOptions } from '@/types/print-preview.types'

export interface ProcessResult {
  pdfBlobUrl: string | null
  excelBlob: Blob | null
}

export type ProcessHandler = (
  options: PrintPreviewOptions,
  onProgress: (progress: number) => void,
) => Promise<ProcessResult>

// Common utilities
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    cancelled: 'Đã hủy',
  }
  return statusMap[status] || status
}
