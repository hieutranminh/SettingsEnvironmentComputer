/**
 * Web Worker Communication Composable
 *
 * Manages communication with Web Worker for true streaming data processing.
 * Uses Fetch API with ReadableStream for incremental data processing.
 * Handles API request proxying to ensure token refresh works correctly.
 *
 * @example
 *   const { startStreaming, progress, cancelStreaming } = useStreamingWorker()
 *   await startStreaming({
 *     endpoint: 'goods/Product/StreamExcel',
 *     filters: { shopId: 1, totalItems: 10000 }
 *   })
 *
 * Key Features:
 * - True streaming with Fetch API ReadableStream
 * - Incremental chunk processing (memory efficient)
 * - Automatic token refresh support
 * - Progress tracking
 * - Cancellation support
 * - Error handling
 *
 * Architecture:
 * - Worker sends API_REQUEST to main thread
 * - Main thread streams via Fetch API (with auth)
 * - Chunks sent to worker via CHUNK_DATA messages
 * - Worker parses incrementally and reports progress
 * - Main thread signals completion via API_RESPONSE
 */

import { ref, computed, onUnmounted, type ComputedRef } from 'vue'
import { fetchWithAuth } from '@/utils/fetchWithAuth'
import { API_TYPES, DEFAULT_API_CONFIG } from '@/constants/apiEndpoints'
import {
  WorkerMessageType,
  type IStreamingConfig,
  type IProgressPayload,
  type ICompletePayload,
  type IWorkerMessage,
} from '@/types/print/streaming'

/**
 * Streaming worker composable return type
 */
export interface IUseStreamingWorkerReturn {
  isProcessing: ComputedRef<boolean>
  progress: ComputedRef<IProgressPayload | null>
  error: ComputedRef<string | null>

  startStreaming: (config: IStreamingConfig) => Promise<ICompletePayload>
  cancelStreaming: () => void
}

/**
 * Sends message to worker with type-safe payload
 *
 * @param worker - Worker instance
 * @param type - Message type
 * @param payload - Message payload
 *
 * Example:
 *   sendMessageToWorker(worker, WorkerMessageType.API_RESPONSE, { requestId: 'req-123', data: '...' })
 */
const sendMessageToWorker = <T extends WorkerMessageType>(
  worker: Worker,
  type: T,
  payload: Extract<IWorkerMessage, { type: T }>['payload'],
): void => {
  worker.postMessage({ type, payload } as IWorkerMessage)
}

/**
 * Builds full API endpoint with type and version
 *
 * @param endpoint - Endpoint path (e.g., 'goods/Product/StreamExcel')
 * @returns Full endpoint path (e.g., 'read/v1/goods/Product/StreamExcel')
 *
 * Example:
 *   buildFullEndpoint('goods/Product/StreamExcel')
 *   // Returns: 'read/v1/goods/Product/StreamExcel'
 */
const buildFullEndpoint = (endpoint: string): string => {
  const type = API_TYPES.READ
  const version = DEFAULT_API_CONFIG.version
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${type}/${version}/${cleanEndpoint}`
}

/**
 * Reads stream chunks and sends to worker incrementally
 *
 * @param worker - Worker instance
 * @param requestId - Request ID
 * @param reader - ReadableStream reader
 *
 * Example:
 *   await streamResponseToWorker(worker, 'req-123', reader)
 */
const streamResponseToWorker = async (
  worker: Worker,
  requestId: string,
  reader: ReadableStreamDefaultReader<Uint8Array>,
): Promise<void> => {
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()

    if (done) {
      break
    }

    // Decode chunk and send to worker
    const chunk = decoder.decode(value, { stream: true })
    sendMessageToWorker(worker, WorkerMessageType.CHUNK_DATA, { requestId, chunk })
  }
}

/**
 * Handles streaming API requests from worker using Fetch API
 * Reads response as stream and sends chunks to worker incrementally
 *
 * @param worker - Worker instance
 * @param requestId - Unique request ID for request/response mapping
 * @param endpoint - API endpoint to call
 * @param params - Request parameters
 *
 * Example:
 *   await handleWorkerApiRequest(worker, 'req-123', 'goods/Product/StreamExcel', { shopId: 1 })
 */
const handleWorkerApiRequest = async (
  worker: Worker,
  requestId: string,
  endpoint: string,
  params: Record<string, unknown>,
): Promise<void> => {
  try {
    // Build full endpoint path
    const fullEndpoint = buildFullEndpoint(endpoint)

    // Make streaming fetch request with auth
    const response = await fetchWithAuth(fullEndpoint, {
      method: 'POST',
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    // Get readable stream
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }

    // Stream response chunks to worker
    await streamResponseToWorker(worker, requestId, reader)

    // Signal completion
    sendMessageToWorker(worker, WorkerMessageType.API_RESPONSE, { requestId, data: '' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'API request failed'
    sendMessageToWorker(worker, WorkerMessageType.API_ERROR, { requestId, error: errorMessage })
  }
}

/**
 * Composable for managing Web Worker data streaming with Fetch API
 * Proxies API calls through main thread to ensure token refresh works
 *
 * Flow:
 * 1. Main thread initializes worker
 * 2. Main thread sends START message with config
 * 3. Worker requests data via API_REQUEST messages
 * 4. Main thread streams response using Fetch API (with token refresh)
 * 5. Main thread sends data chunks to worker via CHUNK_DATA messages
 * 6. Worker parses chunks incrementally and reports PROGRESS
 * 7. Main thread signals API_RESPONSE when stream complete
 * 8. Worker sends COMPLETE with parsed data
 *
 * @returns Worker state and control functions
 */
export const useStreamingWorker = (): IUseStreamingWorkerReturn => {
  const worker = ref<Worker | null>(null)
  const isProcessing = ref(false)
  const progress = ref<IProgressPayload | null>(null)
  const error = ref<string | null>(null)

  /**
   * Initializes worker instance with API request handler
   * Sets up message listeners for API_REQUEST messages
   *
   * Example:
   *   const workerInstance = initWorker()
   */
  const initWorker = (): Worker => {
    if (worker.value) {
      return worker.value
    }

    // Create worker instance
    const newWorker = new Worker(
      new URL('../../../workers/streaming/dataStreaming.worker.ts', import.meta.url),
      { type: 'module' },
    )

    worker.value = newWorker
    return newWorker
  }

  /**
   * Handles API request errors
   */
  const handleApiRequestError = (workerInstance: Worker, requestId: string, err: unknown): void => {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('Failed to handle worker API request:', err)
    }
    sendMessageToWorker(workerInstance, WorkerMessageType.API_ERROR, {
      requestId,
      error: err instanceof Error ? err.message : 'API request failed',
    })
  }

  /**
   * Creates message handler for worker with cleanup
   */
  const createWorkerMessageHandler = (
    workerInstance: Worker,
    resolve: (value: ICompletePayload) => void,
    reject: (reason: Error) => void,
    cleanup: () => void,
  ): ((event: MessageEvent<IWorkerMessage>) => void) => {
    return (event: MessageEvent<IWorkerMessage>): void => {
      const { type, payload } = event.data

      if (type === WorkerMessageType.API_REQUEST) {
        handleWorkerApiRequest(
          workerInstance,
          payload.requestId,
          payload.endpoint,
          payload.params,
        ).catch((err) => handleApiRequestError(workerInstance, payload.requestId, err))
      } else if (type === WorkerMessageType.PROGRESS) {
        progress.value = payload as IProgressPayload
      } else if (type === WorkerMessageType.COMPLETE) {
        isProcessing.value = false
        cleanup()
        resolve(payload as ICompletePayload)
      } else if (type === WorkerMessageType.ERROR) {
        isProcessing.value = false
        error.value = (payload as { message: string }).message
        cleanup()
        reject(new Error((payload as { message: string }).message))
      }
    }
  }

  /**
   * Starts streaming data processing
   */
  const startStreaming = (config: IStreamingConfig): Promise<ICompletePayload> => {
    return new Promise((resolve, reject) => {
      const workerInstance = initWorker()
      isProcessing.value = true
      progress.value = null
      error.value = null

      const messageHandler = createWorkerMessageHandler(workerInstance, resolve, reject, () =>
        workerInstance.removeEventListener('message', messageHandler),
      )
      workerInstance.addEventListener('message', messageHandler)

      workerInstance.postMessage({
        type: WorkerMessageType.START,
        payload: config,
      } as IWorkerMessage)
    })
  }

  /**
   * Cancels ongoing streaming operation
   * Sends CANCEL message to worker
   *
   * Example:
   *   cancelStreaming()
   */
  const cancelStreaming = (): void => {
    if (worker.value) {
      const message: IWorkerMessage = {
        type: WorkerMessageType.CANCEL,
      }
      worker.value.postMessage(message)
      isProcessing.value = false
    }
  }

  /**
   * Cleanup worker on unmount
   */
  const cleanup = (): void => {
    if (worker.value) {
      worker.value.terminate()
      worker.value = null
    }
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    isProcessing: computed(() => isProcessing.value),
    progress: computed(() => progress.value),
    error: computed(() => error.value),

    startStreaming,
    cancelStreaming,
  }
}
