export interface Sale {
  id: string
  clientId: string
  staffId: string
  salonId: string
  items: SaleItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  saleDate: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface SaleItem {
  goodId: string
  goodName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  BANK_TRANSFER = 'bank_transfer',
  MOBILE_PAYMENT = 'mobile_payment'
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface CreateSaleRequest {
  clientId: string
  staffId: string
  salonId: string
  items: {
    goodId: string
    quantity: number
  }[]
  discountAmount?: number
  paymentMethod: PaymentMethod
  notes?: string
}

export interface UpdateSaleRequest {
  items?: {
    goodId: string
    quantity: number
  }[]
  discountAmount?: number
  paymentMethod?: PaymentMethod
  paymentStatus?: PaymentStatus
  notes?: string
}

export interface SaleListParams {
  page?: number
  limit?: number
  clientId?: string
  staffId?: string
  salonId?: string
  paymentStatus?: PaymentStatus
  startDate?: string
  endDate?: string
}

export interface SaleStatistics {
  totalSales: number
  totalRevenue: number
  averageSaleValue: number
  salesThisMonth: number
  revenueThisMonth: number
  topSellingItems: {
    goodId: string
    goodName: string
    quantity: number
    revenue: number
  }[]
}
