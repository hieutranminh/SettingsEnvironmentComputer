# Goods Service

This service handles all goods-related API operations for the salon management system.

## Structure

```
services/goods/
├── goods.read.ts    # Read operations (GET requests)
├── goods.cmd.ts     # Command operations (POST, PUT, PATCH, DELETE requests)
├── index.ts         # Main exports
└── README.md        # This documentation
```

## Usage Examples

### Importing the service

```typescript
// Import everything
import { goodsReadService, goodsCmdService, type Goods } from '@/services/goods'

// Or import specific functions
import { goodsReadService } from '@/services/goods'
```

### Read Operations

```typescript
// Get all goods with pagination
const response = await goodsReadService.getAll({
  page: 1,
  limit: 20,
  category: 'haircare',
  isActive: true,
})

// Get goods by ID
const goods = await goodsReadService.getById('goods-123')

// Search goods
const searchResults = await goodsReadService.search('shampoo')

// Get low stock items
const lowStock = await goodsReadService.getLowStock(5)
```

### Command Operations

```typescript
// Create new goods
const newGoods = await goodsCmdService.create({
  name: 'Professional Shampoo',
  description: 'High-quality shampoo for salon use',
  price: 25.99,
  category: 'haircare',
  stockQuantity: 50,
  isActive: true,
})

// Update goods
const updatedGoods = await goodsCmdService.update('goods-123', {
  price: 29.99,
  stockQuantity: 45,
})

// Update stock quantity
const stockUpdate = await goodsCmdService.updateStock('goods-123', 10, 'add')

// Delete goods
await goodsCmdService.delete('goods-123')
```

### TypeScript Types

The service provides comprehensive TypeScript types:

- `Goods` - Basic goods information
- `GoodsDetail` - Extended goods information with images and supplier
- `GoodsFilter` - Filter options for queries
- `CreateGoodsRequest` - Data structure for creating goods
- `UpdateGoodsRequest` - Data structure for updating goods
- `BulkUpdateStockRequest` - Data structure for bulk stock updates

## API Endpoints

This service uses the following API endpoints:

- `GET /goods` - Get all goods with filtering
- `GET /goods/:id` - Get goods by ID
- `GET /goods/category/:category` - Get goods by category
- `GET /goods/search` - Search goods
- `GET /goods/active` - Get active goods
- `GET /goods/low-stock` - Get low stock goods
- `POST /goods` - Create new goods
- `PUT /goods/:id` - Update goods
- `PATCH /goods/:id` - Partially update goods
- `DELETE /goods/:id` - Delete goods
- `POST /goods/bulk-delete` - Bulk delete goods
- `PATCH /goods/:id/stock` - Update stock
- `POST /goods/bulk-stock-update` - Bulk update stock
- `PATCH /goods/:id/activate` - Activate goods
- `PATCH /goods/:id/deactivate` - Deactivate goods
- `POST /goods/:id/images` - Upload images
- `DELETE /goods/:id/images` - Remove images
