import { SalesHistoryHandler } from './worker-handlers/sales-history.handler'
import type { WorkerMessage, WorkerResponse } from '../types/print-preview.types'
import { WORKER_TYPES, ERROR_MESSAGES } from '../constants/print-preview.constants'

// Handler registry
const handlers = new Map<string, any>()

// Register handlers
handlers.set(WORKER_TYPES.SALES_HISTORY, new SalesHistoryHandler())
// Add more handlers here as they are implemented

// Worker message handler
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event

  if (!data) {
    postError(ERROR_MESSAGES.WORKER_ERROR)
    return
  }

  try {
    const { workerType, ...context } = data

    // Get handler for the worker type
    const handler = handlers.get(workerType)

    if (!handler) {
      postError(ERROR_MESSAGES.INVALID_WORKER_TYPE)
      return
    }

    // Execute handler
    const result = await handler.handle(context)

    // Post success response
    postSuccess(result)
  } catch (error) {
    console.error('Worker error:', error)
    postError(error instanceof Error ? error.message : ERROR_MESSAGES.WORKER_ERROR)
  }
}

// Worker error handler
self.onerror = (error: ErrorEvent) => {
  console.error('Worker error:', error)
  postError(ERROR_MESSAGES.WORKER_ERROR)
}

// Helper functions
function postProgress(percentage: number): void {
  const response: WorkerResponse = {
    isDone: false,
    errors: [],
    isError: false,
    excelBlob: null,
    pdfBlobUrl: null,
    progressPercentage: percentage,
    status: 200,
  }

  self.postMessage(response)
}

function postSuccess(result: { pdfBlobUrl: string; excelBlob: Blob }): void {
  const response: WorkerResponse = {
    isDone: true,
    errors: [],
    isError: false,
    excelBlob: result.excelBlob,
    pdfBlobUrl: result.pdfBlobUrl,
    progressPercentage: 100,
    status: 200,
  }

  self.postMessage(response)
}

function postError(error: string, status: number = 500): void {
  const response: WorkerResponse = {
    isDone: true,
    errors: [error],
    isError: true,
    excelBlob: null,
    pdfBlobUrl: null,
    progressPercentage: 0,
    status,
  }

  self.postMessage(response)
}

// Progress update function that can be called by handlers
function updateProgress(current: number, total: number): void {
  const percentage = Math.round((current / total) * 100)
  postProgress(percentage)
}

// Export for use in handlers
export { updateProgress }
