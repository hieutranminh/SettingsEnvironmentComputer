# Architecture Review: Ahasoft Build

## 1. Current State Assessment

### Tech Stack (Excellent choices)
- **Vue 3.5** + **TypeScript 5.8** + **Vite 5** — modern, performant
- **PrimeVue 4** — rich enterprise UI library
- **Pinia 3** — official state management
- **Vue Router 4** — routing with guards
- **Vue I18n** — internationalization (en, ko, vi)
- **VeeValidate + Yup** — form validation
- **Axios** + CQRS gateway pattern — API layer
- **Luxon** — date/time handling
- **PWA** support via Workbox
- **Vitest** — unit testing
- **ESLint + Prettier + Stylelint + vue-tsc** — code quality toolchain

### Current Folder Structure

```
src/
├── api/                  # Centralized API layer (CQRS gateway)
│   ├── interceptors/     # Request/response interceptors
│   └── services/         # API service modules (flat)
├── assets/               # CSS, SCSS, images
├── components/           # Shared components
│   ├── common/           # Reusable UI components
│   │   └── form/         # Form field wrappers
│   ├── layouts/          # App layouts
│   └── template/         # Demo/example components
├── composables/          # Shared composables (flat)
├── config/               # App & service configuration
├── constants/            # Constants (flat)
├── locales/              # i18n translations
├── plugins/              # Vue plugins
├── router/               # Router with guards & modules
│   ├── guards/
│   └── modules/          # Route definitions (flat)
├── schemas/              # Yup validation schemas (flat)
├── services/             # Empty (unused)
├── stores/               # Pinia stores (flat)
├── sw/                   # Service worker (PWA)
├── test/                 # Test setup
├── types/                # TypeScript types (flat)
├── utils/                # Utility functions (flat)
└── views/                # Page components (flat by feature)
    ├── Admin/
    ├── Auth/
    └── Home/
```

---

## 2. What's Already Good (Keep These)

### ✅ API Layer Architecture
- **CQRS pattern** (read/cmd/aggr) with `gatewayService` — excellent for microservices backend
- **Service config** with versioned APIs (`ServiceConfig`, `ServiceReadOnlyConfig`, `ServiceCmdOnlyConfig`)
- **URL builder** is type-safe and clean
- **Interceptors** well-separated (request, response, token refresh, status handlers)
- **ApiResponse<T>** generic wrapper — consistent API contract

### ✅ Form Field System
- `BaseField.vue` pattern with wrapper components — good abstraction over PrimeVue
- Form validation with VeeValidate + Yup schemas

### ✅ Composables
- `useDataTable` — well-designed lazy/server-side DataTable composable
- `useAlert` — unified toast/confirm/error dialog API
- `useRouterNavigation` — navigation helpers

### ✅ Infrastructure
- Multi-environment build (localhost, development, staging, production)
- Router guards composable pattern (auth → permission pipeline)
- Global error handler
- Auto-import components (unplugin-vue-components)
- Code quality toolchain (ESLint, Prettier, Stylelint, type-check)

### ✅ Code Quality
- Strict TypeScript, no `any` usage visible
- Clean Composition API + `<script setup>`
- Constants properly extracted
- Good naming conventions

---

## 3. Critical Problems for a Large Project

### 🔴 Problem 1: FLAT Structure — Won't Scale

**Current state**: Mọi thứ đều flat — stores, types, composables, schemas, api/services, views.

**Khi project lớn lên** (Calendar, Service Sales, Payroll, Inventory, Messages, Clients...):
- `src/stores/` sẽ có 30-50 files phẳng
- `src/types/` sẽ có 50+ files phẳng
- `src/composables/` sẽ có 40+ files phẳng
- `src/api/services/` sẽ có 20+ files phẳng
- `src/views/` sẽ có 15-20 folders, mỗi folder 5-15 files

**Hệ quả**: Không ai biết file nào thuộc feature nào. Developer mới mất rất nhiều thời gian để hiểu. Merge conflict liên tục trên barrel exports.

### 🔴 Problem 2: No Feature/Module Isolation

Calendar Booking là một module phức tạp với riêng nó:
- 10+ views (booking list, add booking, checkout, cancel, reschedule...)
- 5+ stores (calendar state, booking form, services, time slots, checkout...)
- 10+ composables (useTimeSlots, useBookingForm, useServiceSelection...)
- 15+ types (Booking, TimeSlot, Service, Staff, CalendarView...)
- 5+ API services (bookings, services, staff availability...)
- 10+ components riêng (CalendarGrid, TimeSlotPicker, ServiceSelector...)

Hiện tại **không có pattern nào** để organize tất cả những thứ này theo feature.

### 🔴 Problem 3: No Lazy Loading Strategy for Modules

Router chỉ lazy load ở view level. Với project lớn, cần lazy load cả module (routes + components + stores + API).

### 🟡 Problem 4: Missing Cross-Module Communication Pattern

Khi Calendar cần thông tin từ Clients, hoặc Sales cần check Inventory — hiện tại không có pattern cho inter-module communication.

### 🟡 Problem 5: No Permission System Per Feature

Guards chỉ có `checkAuth` và `checkPermission` cơ bản. Dự án lớn cần RBAC per feature/module.

### 🟡 Problem 6: Test Organization

Chỉ có 1 test file (`dateUtils.test.ts`). Cần testing pattern per module.

---

## 4. Recommended Architecture: Feature-Based Modules

### Target Folder Structure

```
src/
├── api/                          # KEEP — Core API infrastructure
│   ├── interceptors/             # KEEP — Request/response interceptors
│   ├── services/                 # KEEP — Only base.ts (gateway service)
│   ├── axios.ts                  # KEEP
│   └── url-builder.ts            # KEEP
│
├── assets/                       # KEEP — Global assets
│
├── components/                   # KEEP — SHARED components only
│   ├── common/                   # KEEP — AppDataTable, AppError, form fields...
│   │   └── form/                 # KEEP
│   └── layouts/                  # KEEP — MainLayout, AuthLayout, AppHeader...
│
├── composables/                  # KEEP — SHARED composables only
│   ├── useAlert.ts               # KEEP
│   ├── useDataTable.ts           # KEEP
│   └── ...                       # Only truly shared composables
│
├── config/                       # KEEP
├── constants/                    # KEEP — Only global constants
├── locales/                      # KEEP
├── plugins/                      # KEEP
│
├── router/                       # MODIFY — Auto-collect routes from modules
│   ├── guards/                   # KEEP
│   └── index.ts                  # MODIFY — Import module routes dynamically
│
├── schemas/                      # KEEP — Only shared validation rules
│   └── rules.ts
│
├── stores/                       # KEEP — Only global stores
│   ├── auth.ts                   # KEEP (global)
│   └── loading.ts                # KEEP (global)
│
├── types/                        # KEEP — Only shared/core types
│   ├── api.ts                    # KEEP
│   ├── auth.ts                   # KEEP
│   └── router.ts                 # KEEP
│
├── utils/                        # KEEP — Only shared utilities
│
├── modules/                      # ⭐ NEW — Feature-based modules
│   ├── calendar/                 # Example: Calendar Booking module
│   │   ├── api/                  # Module-specific API services
│   │   │   ├── bookingApi.ts
│   │   │   └── timeSlotApi.ts
│   │   ├── components/           # Module-specific components
│   │   │   ├── CalendarGrid.vue
│   │   │   ├── TimeSlotPicker.vue
│   │   │   └── BookingForm.vue
│   │   ├── composables/          # Module-specific composables
│   │   │   ├── useCalendarView.ts
│   │   │   ├── useBookingForm.ts
│   │   │   └── useTimeSlots.ts
│   │   ├── stores/               # Module-specific stores
│   │   │   ├── calendarStore.ts
│   │   │   └── bookingStore.ts
│   │   ├── types/                # Module-specific types
│   │   │   ├── booking.ts
│   │   │   └── calendar.ts
│   │   ├── views/                # Module pages
│   │   │   ├── CalendarView.vue
│   │   │   ├── BookingCreate.vue
│   │   │   ├── BookingDetail.vue
│   │   │   └── CheckoutView.vue
│   │   ├── schemas/              # Module validation schemas
│   │   │   └── bookingSchema.ts
│   │   ├── constants/            # Module constants (optional)
│   │   │   └── bookingStatus.ts
│   │   ├── routes.ts             # Module route definitions
│   │   └── index.ts              # Module public API (barrel export)
│   │
│   ├── service-sales/            # Service Sales module
│   │   ├── api/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── views/
│   │   ├── routes.ts
│   │   └── index.ts
│   │
│   ├── payroll/                  # Payroll module
│   │   └── ... (same pattern)
│   │
│   ├── clients/                  # Client management module
│   │   └── ... (same pattern)
│   │
│   ├── staffs/                   # Staff management module
│   │   └── ... (same pattern)
│   │
│   ├── inventory/                # Inventory module
│   │   └── ... (same pattern)
│   │
│   └── admin/                    # Admin/Settings module
│       └── ... (same pattern)
│
└── views/                        # KEEP — Only standalone views
    ├── Auth/                     # Auth is NOT a module (no sidebar nav)
    │   ├── LoginView.vue
    │   ├── ForgotPassword.vue
    │   └── ResetPassword.vue
    ├── Home/
    │   └── HomeView.vue
    └── NotFound.vue
```

### Key Rules for Module Architecture

1. **Each module is self-contained**: Contains its own api, components, composables, stores, types, views, routes
2. **Module public API via `index.ts`**: Only export what other modules need (types, specific composables)
3. **No cross-module direct imports**: Modules communicate through shared stores or composables only
4. **Module routes are auto-registered**: Router collects `routes.ts` from all modules
5. **Shared things stay in `src/` root**: Only truly shared/reusable code lives in root folders

---

## 5. Implementation Checklist

### Phase 1: Foundation (Do Now)
- [ ] Create `src/modules/` directory
- [ ] Move `src/views/Admin/` → `src/modules/admin/views/`
- [ ] Move Admin-related types, stores, API into `src/modules/admin/`
- [ ] Create module `routes.ts` pattern
- [ ] Update router `index.ts` to import module routes
- [ ] Remove empty `src/services/` directory
- [ ] Remove `src/components/template/` (demo components — remove before production)

### Phase 2: Module Pattern (Before Starting Calendar)
- [ ] Create `src/modules/calendar/` with full structure (api, components, composables, stores, types, views, routes.ts, index.ts)
- [ ] Define module boundary rules (what can import what)
- [ ] Setup ESLint boundaries plugin (`eslint-plugin-boundaries`) to enforce module isolation
- [ ] Create module route auto-registration helper

### Phase 3: Scalability Patterns (As Needed)
- [ ] Add feature-flag system (for gradual rollout of new modules)
- [ ] Add RBAC per module (extend `permission.guard.ts` with module-level permissions)
- [ ] Add per-module error boundaries (Vue `onErrorCaptured`)
- [ ] Consider `provide/inject` for module-level services
- [ ] Setup module-level lazy loading (async route components + async stores)

---

## 6. Specific Improvements

### 6.1 Router — Module Route Auto-Registration

```typescript
// src/router/index.ts — AFTER refactor
import { authRoutes } from './modules/auth.routes'

// Auto-import module routes
const moduleRoutes = import.meta.glob('../modules/*/routes.ts', { eager: true })
const moduleRoutesList = Object.values(moduleRoutes)
  .flatMap((mod: any) => mod.routes || mod.default || [])

const router = createRouter({
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: () => import('@/components/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        ...homeRoutes,
        ...moduleRoutesList, // All module routes auto-registered
      ],
    },
    // 404 catch-all
  ],
})
```

### 6.2 Module Route Pattern

```typescript
// src/modules/calendar/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/calendar',
    meta: { title: 'Calendar', module: 'calendar', permission: 'calendar:view' },
    children: [
      {
        path: '',
        name: 'calendar-view',
        component: () => import('./views/CalendarView.vue'),
      },
      {
        path: 'booking/new',
        name: 'booking-create',
        component: () => import('./views/BookingCreate.vue'),
        meta: { permission: 'calendar:booking:create' },
      },
    ],
  },
]
```

### 6.3 Module Index Pattern

```typescript
// src/modules/calendar/index.ts
// Public API — only export what other modules may need
export type { Booking, BookingStatus } from './types/booking'
export type { CalendarEvent } from './types/calendar'

// If another module needs to navigate to calendar
export { CALENDAR_ROUTE_NAMES } from './constants/routeNames'
```

### 6.4 Module API Service Pattern

```typescript
// src/modules/calendar/api/bookingApi.ts
import { gatewayService } from '@/api'
import { BOOKINGS_SERVICE } from '@/config/services'
import type { ApiResponse } from '@/types/api'
import type { Booking, BookingCreatePayload } from '../types/booking'

export const bookingApi = {
  async getList(params: BookingListParams): Promise<ApiResponse<Booking[]>> {
    return gatewayService.read<Booking[]>(BOOKINGS_SERVICE, 'Booking/List', params)
  },

  async create(payload: BookingCreatePayload): Promise<ApiResponse<Booking>> {
    return gatewayService.command<Booking>(BOOKINGS_SERVICE, 'Booking/Create', payload)
  },
}
```

---

## 7. What NOT to Change (Overkill for this project)

- ❌ **Micro-frontends**: Overkill. Module-based monolith is the right scale.
- ❌ **Nx/Turborepo monorepo**: Single app is fine. Module boundaries via ESLint rules are sufficient.
- ❌ **Global state bus (EventBus/mitt)**: Use Pinia shared stores instead.
- ❌ **Module federation**: Only needed if you deploy modules independently.
- ❌ **Abstract factory for API services**: Current gateway pattern is already clean.

---

## 8. Summary Score Card

| Aspect | Current | After Refactor | Notes |
|--------|---------|----------------|-------|
| **API Layer** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excellent. Keep as-is. |
| **Build/Tooling** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Excellent. Keep as-is. |
| **Code Quality** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Good. Add ESLint boundaries. |
| **Component Design** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Good. Module components will help. |
| **Scalability** | ⭐⭐ | ⭐⭐⭐⭐⭐ | Critical gap. Module architecture fixes this. |
| **Team Collaboration** | ⭐⭐ | ⭐⭐⭐⭐⭐ | Modules allow parallel development. |
| **Maintainability** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Feature isolation = easier maintenance. |
| **Testing** | ⭐ | ⭐⭐⭐⭐ | Need per-module test patterns. |

### Bottom Line

**Foundation code quality là rất tốt** — API layer, composables, form system, TypeScript usage, build tooling đều production-ready.

**Vấn đề duy nhất nhưng critical là thiếu module architecture** — tất cả flat structure hiện tại sẽ không thể maintain được khi project lớn. Cần chuyển sang feature-based modules TRƯỚC KHI bắt đầu implement Calendar hay bất kỳ feature lớn nào.

**Effort ước tính**: 1-2 ngày refactor để setup module pattern + migrate Admin module hiện tại. Sau đó mỗi feature mới tự động follow pattern.
