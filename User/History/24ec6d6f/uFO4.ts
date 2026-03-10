import { BaseHandler } from './base-handler'
import { WORKER_TYPES } from '../../constants/print-preview.constants'

export class SalesHistoryHandler extends BaseHandler {
  readonly type = WORKER_TYPES.SALES_HISTORY

  protected getStreamUrl(): string {
    return '/api/sales/history/stream'
  }

  protected getTableIntro(): string {
    return 'Sales History Report'
  }

  protected getTableRowItem(rowItem: any): Record<string, any> {
    return {
      date: this.formatDate(rowItem.saleDate),
      clientName: this.sanitizeText(rowItem.clientName),
      serviceName: this.sanitizeText(rowItem.serviceName),
      staffName: this.sanitizeText(rowItem.staffName),
      amount: this.formatCurrency(rowItem.amount),
      paymentMethod: this.sanitizeText(rowItem.paymentMethod),
      status: this.sanitizeText(rowItem.status),
    }
  }

  protected isValidResponse(response: any): boolean {
    return response && response.success && Array.isArray(response.data) && response.data.length > 0
  }

  protected isInvalidResponse(response: any): boolean {
    return response && response.success && Array.isArray(response.data) && response.data.length === 0
  }

  protected async generateFiles(
    data: any[],
    context: HandlerContext,
  ): Promise<{ pdfBlobUrl: string; excelBlob: Blob }> {
    // This is a placeholder implementation
    // In a real implementation, you would use libraries like jsPDF and ExcelJS
    // to generate the actual PDF and Excel files

    const tableData = data.map((row) => this.getTableRowItem(row))

    // Mock PDF generation
    const pdfBlob = new Blob(['PDF content'], { type: 'application/pdf' })
    const pdfBlobUrl = URL.createObjectURL(pdfBlob)

    // Mock Excel generation
    const excelBlob = new Blob(['Excel content'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    return { pdfBlobUrl, excelBlob }
  }
}
