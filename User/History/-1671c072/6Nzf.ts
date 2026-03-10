export interface BaseHandlerConfig {
  printDate: string
  requestHeaders: Record<string, string>
  requestPayload: Record<string, any>
  isLandscapePrintContent: boolean
  locale: string
}

export interface HandlerContext extends BaseHandlerConfig {
  tableHeaders: any[]
  reportHeaders: any[]
  additionalOptions: Record<string, any>
}

export interface StreamResponse {
  data: any[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface ApiError {
  message: string
  code: string
  field?: string
}

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  errors?: ApiError[]
  message?: string
}

export interface WorkerHandler {
  readonly type: string
  handle(context: HandlerContext): Promise<{
    pdfBlobUrl: string
    excelBlob: Blob
  }>
}

export interface ProgressCallback {
  (progress: number): void
}

export interface ErrorCallback {
  (error: Error): void
}

export interface WorkerEventHandlers {
  onProgress?: ProgressCallback
  onError?: ErrorCallback
  onComplete?: (result: { pdfBlobUrl: string; excelBlob: Blob }) => void
}

export interface WorkerTask {
  id: string
  type: string
  context: HandlerContext
  handlers: WorkerEventHandlers
  createdAt: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface WorkerPool {
  maxWorkers: number
  activeWorkers: number
  queue: WorkerTask[]
  addTask(task: Omit<WorkerTask, 'id' | 'createdAt' | 'status'>): string
  removeTask(taskId: string): boolean
  getTask(taskId: string): WorkerTask | undefined
  processQueue(): void
}

export interface WorkerMessageData {
  type: 'task' | 'progress' | 'error' | 'complete' | 'terminate'
  payload: any
  taskId?: string
}

export interface TaskMessage {
  type: 'task'
  taskId: string
  context: HandlerContext
}

export interface ProgressMessage {
  type: 'progress'
  taskId: string
  progress: number
}

export interface ErrorMessage {
  type: 'error'
  taskId: string
  error: string
  details?: any
}

export interface CompleteMessage {
  type: 'complete'
  taskId: string
  result: {
    pdfBlobUrl: string
    excelBlob: Blob
  }
}

export interface TerminateMessage {
  type: 'terminate'
  taskId: string
}

export type WorkerMessage = TaskMessage | ProgressMessage | ErrorMessage | CompleteMessage | TerminateMessage
