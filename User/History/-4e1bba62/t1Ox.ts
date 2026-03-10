import type { PrintPreviewOptions } from '@/types/print-preview.types'
import type { ProcessResult, ProcessHandler } from '@/workers/worker-handlers/base-handler'

// Import functional handlers
import { processSalesHistory } from './worker-handlers/sales-history.handler'

// Handler registry
const handlerMap = new Map<string, ProcessHandler>([
  ['SALES_HISTORY', processSalesHistory],
  // Dễ dàng thêm handlers mới ở đây
])
