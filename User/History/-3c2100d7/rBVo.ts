export interface Good {
  id: string
  name: string
  description?: string
  price: number
  category: GoodCategory
  isActive: boolean
  imageUrl?: string
  salonId: string
  stockQuantity?: number
  unit: string
  createdAt: string
  updatedAt: string
}

export enum GoodCategory {
  PRODUCT = 'product',
  SERVICE = 'service',
  EQUIPMENT = 'equipment',
  SUPPLY = 'supply'
}

export interface CreateGoodRequest {
  name: string
  description?: string
  price: number
  category: GoodCategory
  imageUrl?: string
  salonId: string
  stockQuantity?: number
  unit: string
}

export interface UpdateGoodRequest {
  name?: string
  description?: string
  price?: number
  category?: GoodCategory
  imageUrl?: string
  isActive?: boolean
  stockQuantity?: number
  unit?: string
}

export interface GoodListParams {
  page?: number
  limit?: number
  search?: string
  category?: GoodCategory
  isActive?: boolean
  salonId?: string
  minPrice?: number
  maxPrice?: number
}
