import { HTTP_STATUS_CODES, ERROR_MESSAGES } from '../../constants/print-preview.constants'
import type {
  HandlerContext,
  WorkerHandler,
  StreamResponse,
  ApiResponse,
  ProgressCallback,
  ErrorCallback,
} from '../../types/worker.types'

export abstract class BaseHandler implements WorkerHandler {
  abstract readonly type: string

  protected abstract getStreamUrl(): string
  protected abstract getTableIntro(): string
  protected abstract getTableRowItem(rowItem: any): Record<string, any>
  protected abstract isValidResponse(response: any): boolean
  protected abstract isInvalidResponse(response: any): boolean

  async handle(context: HandlerContext): Promise<{
    pdfBlobUrl: string
    excelBlob: Blob
  }> {
    try {
      const data = await this.fetchStreamData(context)
      const { pdfBlobUrl, excelBlob } = await this.generateFiles(data, context)

      return { pdfBlobUrl, excelBlob }
    } catch (error) {
      throw new Error(`Handler ${this.type} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  protected async fetchStreamData(context: HandlerContext): Promise<any[]> {
    const url = this.getStreamUrl()
    const allData: any[] = []
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await this.makeRequest(
        url,
        {
          ...context.requestPayload,
          page,
          limit: 100, // Adjust based on your API
        },
        context.requestHeaders,
      )

      if (!this.isValidResponse(response)) {
        throw new Error(
          this.isInvalidResponse(response) ? ERROR_MESSAGES.NO_DATA_TO_PRINT : ERROR_MESSAGES.NETWORK_ERROR,
        )
      }

      const streamResponse = response as StreamResponse
      allData.push(...streamResponse.data)

      hasMore = streamResponse.hasMore
      page++

      // Update progress
      this.updateProgress(allData.length, streamResponse.total)
    }

    return allData
  }

  protected async makeRequest(
    url: string,
    payload: Record<string, any>,
    headers: Record<string, string>,
  ): Promise<ApiResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
      }
      if (response.status === HTTP_STATUS_CODES.FORBIDDEN) {
        throw new Error(ERROR_MESSAGES.FORBIDDEN)
      }
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }

    return response.json()
  }

  protected async generateFiles(
    data: any[],
    context: HandlerContext,
  ): Promise<{ pdfBlobUrl: string; excelBlob: Blob }> {
    // This will be implemented by specific handlers
    // For now, return empty results
    throw new Error('generateFiles method must be implemented by subclass')
  }

  protected updateProgress(current: number, total: number): void {
    const percentage = Math.round((current / total) * 100)
    // This will be overridden by the worker to send progress updates
    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'progress',
        progressPercentage: percentage,
      })
    }
  }

  protected formatDate(date: string | Date, format: string = 'YYYY-MM-DD'): string {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  protected formatCurrency(amount: number, currency: string = 'KRW'): string {
    if (amount === null || amount === undefined) return ''
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  protected formatNumber(value: number, decimals: number = 0): string {
    if (value === null || value === undefined) return ''
    return new Intl.NumberFormat('ko-KR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  protected formatPercentage(value: number, decimals: number = 2): string {
    if (value === null || value === undefined) return ''
    return `${this.formatNumber(value, decimals)}%`
  }

  protected sanitizeText(text: string): string {
    if (!text) return ''
    return text.replace(/[<>]/g, '')
  }

  protected truncateText(text: string, maxLength: number = 50): string {
    if (!text || text.length <= maxLength) return text
    return `${text.substring(0, maxLength)}...`
  }

  protected getDefaultCellStyle(isHeader: boolean = false): Record<string, any> {
    return isHeader
      ? {
          backgroundColor: '#f8f9fa',
          color: '#212529',
          fontWeight: 'bold',
          fontSize: 12,
          alignment: 'center',
        }
      : {
          backgroundColor: '#ffffff',
          color: '#212529',
          fontWeight: 'normal',
          fontSize: 11,
          alignment: 'left',
        }
  }

  protected validateData(data: any[]): boolean {
    return Array.isArray(data) && data.length > 0
  }

  protected handleError(error: Error): void {
    console.error(`Handler ${this.type} error:`, error)

    if (typeof self !== 'undefined' && self.postMessage) {
      self.postMessage({
        type: 'error',
        errors: [error.message],
        isError: true,
      })
    }
  }
}
