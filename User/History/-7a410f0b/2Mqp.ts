import type { PrintPreviewOptions } from '@/types/print-preview.types'

export class PrepaidCardsByClientsHandler {
  async process(options: PrintPreviewOptions, onProgress: (progress: number) => void) {
    // prepaid-cards-by-clients handler logic will be added here
    onProgress(100)
    return {
      pdfBlobUrl: 'https://www.google.com',
      excelBlob: new Blob(),
    }
  }
}
