// Export all goods service functions and types
export * from './goods.read'
export * from './goods.cmd'

// Re-export commonly used types for convenience
export type {
  Goods,
  GoodsDetail,
  GoodsFilter
} from './goods.read'

export type {
  CreateGoodsRequest,
  UpdateGoodsRequest,
  BulkUpdateStockRequest
} from './goods.cmd'
