# Vue 3 Project Structure

This document outlines the structure and organization of the Vue 3 application based on the index.mdc specifications.

## Directory Structure

```
src/
├── assets/                 # Static resources
│   ├── fonts/             # Font files
│   ├── icons/             # Icon assets
│   ├── images/            # Image assets
│   └── styles/            # Global CSS/SCSS files
│       └── main.scss      # Main stylesheet with CSS variables
├── components/            # Reusable Vue components
│   ├── common/            # Generic reusable components
│   │   └── BaseButton.vue # Base button component
│   ├── forms/             # Form-related components
│   │   └── BaseInput.vue  # Base input component
│   ├── layout/            # Layout-specific components
│   └── modals/            # Modal components
├── composables/           # Reusable Composition API logic
│   └── useAuth.ts         # Authentication composable
├── constants/             # Application constants
│   └── API_ENDPOINTS.ts   # API endpoint definitions
├── locales/               # i18n translation files
│   ├── en.json           # English translations
│   └── ko.json           # Korean translations
├── router/                # Vue Router configuration
│   ├── index.ts          # Main router configuration
│   ├── guards.ts         # Route guards (auth, permissions)
│   └── modules/          # Route modules
│       ├── auth.routes.ts # Authentication routes
│       └── user.routes.ts # User management routes
├── services/              # API calls and HTTP client
│   └── api.ts            # API service with HTTP client
├── stores/                # Pinia stores for state management
│   ├── auth.ts           # Authentication store
│   └── counter.ts        # Example counter store
├── types/                 # TypeScript interfaces, types, enums
│   ├── User.ts           # User-related types
│   └── ApiResponse.ts    # API response types
├── utils/                 # Pure utility functions
│   └── validation.ts     # Form validation utilities
├── views/                 # Page components
│   ├── auth/             # Authentication pages
│   ├── users/            # User management pages
│   └── HomeView.vue      # Home page
├── App.vue               # Root component
└── main.ts               # Application entry point
```

## Key Features Implemented

### 1. TypeScript Configuration

- Strict TypeScript mode enabled
- Proper type definitions for all components and functions
- Interface-based type safety

### 2. Authentication System

- Complete authentication flow with login/logout/register
- Route guards for protected routes
- Pinia store for state management
- JWT token handling

### 3. Internationalization (i18n)

- Support for Korean (ko) and English (en) languages
- Structured translation files
- Ready for vue-i18n integration

### 4. Component Architecture

- Reusable base components (BaseButton, BaseInput)
- Accessibility features (ARIA labels, keyboard navigation)
- Consistent styling with CSS custom properties

### 5. API Integration

- Centralized API service with error handling
- Type-safe API responses
- Authentication token management

### 6. Form Validation

- Comprehensive validation utilities
- Type-safe validation rules
- Error handling and display

### 7. Routing

- Modular route organization
- Authentication and permission guards
- Lazy-loaded components

### 8. Styling

- SCSS with CSS custom properties
- Responsive design utilities
- Consistent design system

## Development Guidelines

### Code Style

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Implement proper error handling
- Use TypeScript for type safety

### Component Naming

- Components: PascalCase (e.g., `BaseButton.vue`)
- Composables: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Types: PascalCase (e.g., `User.ts`)
- Constants: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### File Organization

- Keep components focused and single-purpose
- Use proper directory structure for organization
- Separate business logic from presentation

## Next Steps

1. **Add vue-i18n**: Integrate internationalization library
2. **Create View Components**: Implement the actual view components referenced in routes
3. **Add Testing**: Set up unit and integration tests
4. **Add Error Boundaries**: Implement error handling components
5. **Add Loading States**: Implement loading indicators
6. **Add Form Components**: Create more form components as needed
7. **Add Layout Components**: Implement header, footer, and navigation components

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Vue 3 Application
VITE_APP_VERSION=1.0.0
```
