import type { ApiResponse, ListResponse } from '@/types/ApiResponse'

import { goodsReadService } from '../goods.read'

// Product Read types
export interface Product {
  productId: number
  productCode: string
  productName: string
  productCategoryId: number
  productCategoryName: string
  price: number
  status: number
  shopId: number
}

export interface ProductCategory {
  productCategoryId: number
  productCategoryName: string
  orderNo: number
  modificationDate: string
  registrationDate: string
  shared: boolean
  isHeadquarterGoods: boolean
  ownShopId: number
  numberOfActiveChildItems: number
  status: number
  shopId: number
}

export interface GetProductsRequest {
  productCategoryId?: number
  keyWord?: string
  usageStatus?: string
  pageSize?: number
  pageNumber?: number
  shopId?: number
  status?: number
  headquarterShopId?: number
}

export interface GetProductCategoriesRequest {
  pageSize?: number
  pageNumber?: number
  shopId?: number
  status?: number
  headquarterShopId?: number
}

// Product Read Service
export const productsReadService = {
  /**
   * Get all products for a shop - calls /goods/Product
   */
  getProducts: async (params?: GetProductsRequest): Promise<ApiResponse<ListResponse<Product>>> =>
    await goodsReadService.post<ListResponse<Product>>('Product', params),

  /**
   * Get product by ID - calls /goods/Product/{id}
   */
  getProductById: async (id: string): Promise<ApiResponse<Product>> =>
    await goodsReadService.get<Product>(`Product/${id}`),

  /**
   * Get product categories - calls /goods/ProductCategory
   */
  getProductCategories: async (
    params?: GetProductCategoriesRequest,
  ): Promise<ApiResponse<ListResponse<ProductCategory>>> =>
    await goodsReadService.post<ListResponse<ProductCategory>>('ProductCategory', params),

  /**
   * Get all products for a shop - calls /goods/Product
   */
  getAllProducts: async (params?: GetProductsRequest): Promise<ApiResponse<ListResponse<Product>>> =>
    await goodsReadService.post<ListResponse<Product>>('Product/GetAllProductId', params),
}
