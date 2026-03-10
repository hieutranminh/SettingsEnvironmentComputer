/**
 * Custom error class for PDF generation failures
 * Provides detailed error information with stage tracking
 */

import type { PdfGenerationStage } from '../constants/output'

export class PdfGenerationError extends Error {
  constructor(
    message: string,
    public readonly stage: PdfGenerationStage,
    public readonly originalError?: Error,
  ) {
    super(message)
    this.name = 'PdfGenerationError'
    
    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PdfGenerationError)
    }
  }

  /**
   * Creates a detailed error message with stage information
   * @returns Formatted error message with context
   */
  getDetailedMessage(): string {
    const stageMessage = `[${this.stage.toUpperCase()}]`
    const originalMessage = this.originalError ? ` - Original: ${this.originalError.message}` : ''
    return `${stageMessage} ${this.message}${originalMessage}`
  }

  /**
   * Converts error to JSON for logging purposes
   * @returns Error object in JSON format
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      stage: this.stage,
      originalError: this.originalError?.message,
      stack: this.stack,
    }
  }
}
