# Services Documentation

This directory contains all the API service modules for the salon management system. Each service corresponds to a specific domain entity and provides CRUD operations and domain-specific functionality.

## Overview

Based on the `.env` file configuration, the following services are implemented:

- **Admin Service** - Management of salon administrators
- **Good Service** - Management of products and services
- **Client Service** - Customer management
- **Staff Service** - Employee management with scheduling
- **Booking Service** - Appointment scheduling and calendar management
- **Sale Service** - Sales transactions and reporting

## Service Architecture

All services follow a consistent pattern:

1. **Type Safety** - Full TypeScript interfaces for all data structures
2. **Error Handling** - Explicit error throwing with descriptive messages
3. **Pagination** - Consistent pagination support for list operations
4. **Filtering** - Flexible filtering options for all list endpoints
5. **File Upload** - Image upload functionality where applicable

## Available Services

### Admin Service (`adminService.ts`)

Manages salon administrators with role-based access control.

**Key Features:**

- CRUD operations for admin accounts
- Role-based filtering (Super Admin, Headquarter Admin, Salon Admin)
- Profile management
- Salon association

**Main Methods:**

```typescript
// List admins with filters
getAdmins(params?: AdminListParams): Promise<PaginatedResponse<Admin>>

// Get specific admin
getAdminById(id: string): Promise<Admin>

// Create new admin
createAdmin(data: CreateAdminRequest): Promise<Admin>

// Update admin
updateAdmin(id: string, data: UpdateAdminRequest): Promise<Admin>

// Delete admin
deleteAdmin(id: string): Promise<void>

// Profile operations
getAdminProfile(): Promise<Admin>
updateAdminProfile(data: UpdateAdminRequest): Promise<Admin>
```

### Good Service (`goodService.ts`)

Manages salon products and services with inventory tracking.

**Key Features:**

- Product and service management
- Category-based organization
- Price management
- Image upload support
- Stock quantity tracking

**Main Methods:**

```typescript
// List goods with filters
getGoods(params?: GoodListParams): Promise<PaginatedResponse<Good>>

// Get specific good
getGoodById(id: string): Promise<Good>

// Create new good
createGood(data: CreateGoodRequest): Promise<Good>

// Update good
updateGood(id: string, data: UpdateGoodRequest): Promise<Good>

// Delete good
deleteGood(id: string): Promise<void>

// Additional features
getGoodCategories(): Promise<string[]>
uploadGoodImage(file: File): Promise<{ imageUrl: string }>
```

### Client Service (`clientService.ts`)

Manages customer information and relationships.

**Key Features:**

- Customer profile management
- Visit tracking
- Statistics and analytics
- Image upload support

**Main Methods:**

```typescript
// List clients with filters
getClients(params?: ClientListParams): Promise<PaginatedResponse<Client>>

// Get specific client
getClientById(id: string): Promise<Client>

// Create new client
createClient(data: CreateClientRequest): Promise<Client>

// Update client
updateClient(id: string, data: UpdateClientRequest): Promise<Client>

// Delete client
deleteClient(id: string): Promise<void>

// Additional features
uploadClientImage(file: File): Promise<{ imageUrl: string }>
getClientStatistics(salonId?: string): Promise<ClientStatistics>
```

### Staff Service (`staffService.ts`)

Manages salon employees with scheduling capabilities.

**Key Features:**

- Employee management
- Position-based organization
- Working hours and scheduling
- Specialization tracking
- Salary management

**Main Methods:**

```typescript
// List staff with filters
getStaffs(params?: StaffListParams): Promise<PaginatedResponse<Staff>>

// Get specific staff
getStaffById(id: string): Promise<Staff>

// Create new staff
createStaff(data: CreateStaffRequest): Promise<Staff>

// Update staff
updateStaff(id: string, data: UpdateStaffRequest): Promise<Staff>

// Delete staff
deleteStaff(id: string): Promise<void>

// Scheduling features
getStaffSchedule(id: string): Promise<WorkingHours>
updateStaffSchedule(id: string, schedule: WorkingHours): Promise<WorkingHours>
uploadStaffImage(file: File): Promise<{ imageUrl: string }>
```

### Booking Service (`bookingService.ts`)

Manages appointments and calendar functionality.

**Key Features:**

- Appointment scheduling
- Calendar integration
- Available slot checking
- Status management
- Multi-service bookings

**Main Methods:**

```typescript
// List bookings with filters
getBookings(params?: BookingListParams): Promise<PaginatedResponse<Booking>>

// Get specific booking
getBookingById(id: string): Promise<Booking>

// Create new booking
createBooking(data: CreateBookingRequest): Promise<Booking>

// Update booking
updateBooking(id: string, data: UpdateBookingRequest): Promise<Booking>

// Delete booking
deleteBooking(id: string): Promise<void>

// Calendar features
getCalendarEvents(startDate: string, endDate: string, salonId?: string): Promise<CalendarEvent[]>
getAvailableSlots(date: string, staffId?: string, salonId?: string): Promise<AvailableSlot[]>
```

### Sale Service (`saleService.ts`)

Manages sales transactions and reporting.

**Key Features:**

- Sales transaction management
- Payment processing
- Discount handling
- Statistics and reporting
- Multi-item sales

**Main Methods:**

```typescript
// List sales with filters
getSales(params?: SaleListParams): Promise<PaginatedResponse<Sale>>

// Get specific sale
getSaleById(id: string): Promise<Sale>

// Create new sale
createSale(data: CreateSaleRequest): Promise<Sale>

// Update sale
updateSale(id: string, data: UpdateSaleRequest): Promise<Sale>

// Delete sale
deleteSale(id: string): Promise<void>

// Analytics features
getSalesStatistics(salonId?: string, startDate?: string, endDate?: string): Promise<SaleStatistics>
getSalesReports(reportType: 'daily' | 'weekly' | 'monthly', salonId?: string, startDate?: string, endDate?: string): Promise<any>
```

## Usage Examples

### Basic CRUD Operations

```typescript
import { adminService, Admin } from '@/services'

// Create a new admin
const newAdmin = await adminService.createAdmin({
  email: 'admin@salon.com',
  firstName: 'John',
  lastName: 'Doe',
  password: 'securepassword',
  role: AdminRole.SALON_ADMIN,
  salonId: 'salon-123',
})

// Get admins with filters
const admins = await adminService.getAdmins({
  page: 1,
  limit: 10,
  role: AdminRole.SALON_ADMIN,
  isActive: true,
})

// Update admin
const updatedAdmin = await adminService.updateAdmin('admin-123', {
  firstName: 'Jane',
  isActive: false,
})
```

### Working with Bookings

```typescript
import { bookingService } from '@/services'

// Create a booking
const booking = await bookingService.createBooking({
  clientId: 'client-123',
  staffId: 'staff-456',
  salonId: 'salon-789',
  serviceIds: ['service-1', 'service-2'],
  scheduledDate: '2024-01-15',
  scheduledTime: '14:00',
  duration: 120,
})

// Get calendar events
const events = await bookingService.getCalendarEvents('2024-01-01', '2024-01-31', 'salon-789')

// Check available slots
const slots = await bookingService.getAvailableSlots('2024-01-15', 'staff-456', 'salon-789')
```

### File Upload

```typescript
import { clientService } from '@/services'

// Upload client image
const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
const file = fileInput.files?.[0]

if (file) {
  const result = await clientService.uploadClientImage(file)
  console.log('Image uploaded:', result.imageUrl)
}
```

## Error Handling

All services follow a consistent error handling pattern:

```typescript
try {
  const admins = await adminService.getAdmins()
  // Handle success
} catch (error) {
  // Error is always an Error object with a descriptive message
  console.error('Failed to fetch admins:', error.message)
  // Handle error appropriately in your UI
}
```

## Type Safety

All services are fully typed with TypeScript interfaces:

```typescript
import type { Admin, CreateAdminRequest, UpdateAdminRequest, PaginatedResponse } from '@/services'

// Type-safe function parameters
const createAdmin = async (data: CreateAdminRequest): Promise<Admin> => {
  return await adminService.createAdmin(data)
}

// Type-safe response handling
const admins: PaginatedResponse<Admin> = await adminService.getAdmins()
```

## Configuration

Services are configured through the `.env` file and use the centralized API client from `@/plugins/axios`. The base URL and API versions are automatically handled by the axios configuration.

## Best Practices

1. **Always handle errors** - Wrap service calls in try-catch blocks
2. **Use TypeScript** - Leverage the provided types for better development experience
3. **Implement loading states** - Show loading indicators during API calls
4. **Cache when appropriate** - Consider caching frequently accessed data
5. **Validate input** - Validate data before sending to services
6. **Use pagination** - Implement pagination for large datasets
7. **Handle file uploads properly** - Validate file types and sizes before upload
