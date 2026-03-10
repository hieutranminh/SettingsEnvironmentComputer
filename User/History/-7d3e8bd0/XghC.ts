/**
 * PDF output format constants
 * Defines available output formats for jsPDF
 */
export const PDF_OUTPUT_FORMATS = {
  BLOB: 'blob',
  DATA_URL: 'dataurlnewwindow', 
  ARRAY_BUFFER: 'arraybuffer',
  DATA_URI: 'datauri',
  DATA_URL_STRING: 'dataurlstring',
} as const

export type PdfOutputFormat = (typeof PDF_OUTPUT_FORMATS)[keyof typeof PDF_OUTPUT_FORMATS]

/**
 * PDF generation stages for error tracking
 */
export const PDF_GENERATION_STAGES = {
  CONFIG: 'config',
  PROCESSING: 'processing', 
  FINALIZATION: 'finalization',
} as const

export type PdfGenerationStage = (typeof PDF_GENERATION_STAGES)[keyof typeof PDF_GENERATION_STAGES]
