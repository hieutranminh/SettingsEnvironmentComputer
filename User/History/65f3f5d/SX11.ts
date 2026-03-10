// workers/worker-handlers/base-handler.ts
import type { PrintPreviewOptions } from '../../types/print-preview.types'

export abstract class BaseHandler {
  protected pdfBlobUrl: string | null = null
  protected excelBlob: Blob | null = null

  abstract process(options: PrintPreviewOptions, onProgress: (progress: number) => void): Promise<void>

  getResults() {
    return {
      pdfBlobUrl: this.pdfBlobUrl,
      excelBlob: this.excelBlob,
    }
  }

  protected async generatePdf(data: any[]): Promise<string> {
    // PDF generation logic
    return ''
  }

  protected async generateExcel(data: any[]): Promise<Blob> {
    // Excel generation logic
    return new Blob()
  }
}
