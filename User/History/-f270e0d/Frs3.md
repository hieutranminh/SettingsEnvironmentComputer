---
name: Frontend Coding Convention Document
overview: Review the current ahasoft-build source code against ESLint, clean code, Vue best practices, and Pinia rules, then produce a comprehensive Front-end Coding Convention document (Markdown) in the tmp/ directory with detailed "Should" / "Should Not" examples tailored to the actual codebase patterns.
todos:
  - id: review-summary
    content: Write brief review summary comparing old PDF vs current codebase (included in the document intro)
    status: completed
  - id: create-document
    content: Create tmp/frontend-coding-convention.md with all 16 sections, Should/Should Not examples
    status: completed
  - id: verify-accuracy
    content: Cross-check all examples against actual codebase code to ensure accuracy
    status: completed
isProject: false
---

# Front-end Coding Convention Document

## Review Summary

After reviewing the current source code, ESLint config, Cursor skills (clean-code, vue-best-practices, pinia), and the old PDF convention, here are the key findings:

### Current Codebase Strengths (already follows good patterns)
- Composition API with `<script setup lang="ts">` everywhere
- Type-based `defineProps` / `defineEmits` with interfaces
- Pinia setup stores (function style) with proper typing
- Constants as `as const` objects with derived union types
- BEM-style CSS with scoped SCSS
- `useX` composable naming convention
- Proper error handling with `try/catch` and typed errors
- Separated API layer with CQRS gateway pattern
- Strong ESLint config (security, async safety, TypeScript strict, Vue composition)
- Prettier + Stylelint + EditorConfig consistency

### Differences from Old PDF Convention
- Old PDF was Vue 2 + Options API; current project is Vue 3 + Composition API
- Old PDF used `moment.js`; current uses `luxon`
- Old PDF referenced mixins; current uses composables
- Old PDF had `this._showDialogAlert`; current uses `useAlert()` composable
- Old PDF had `showDialogById`; current uses `v-model:visible` (already improved)
- Date format constants updated from old `'yy-mm-dd'` to proper PrimeVue/Luxon constants
- Store usage guideline from old PDF is preserved (direct store in components for global data)

### Minor Improvement Opportunities Noted
- Some composables (e.g. `useRouterNavigation`) use arrow function export instead of `function` declaration (inconsistent with others like `useAlert`, `useDataTable`)
- Some handlers use `handleX` prefix, some use action verbs directly (mild inconsistency with the old PDF's final decision to use action verbs)

---

## Document Structure

The convention document will be created at **[tmp/frontend-coding-convention.md](tmp/frontend-coding-convention.md)** with these sections:

### 1. Project Overview & Tech Stack
- Vue 3 + TypeScript + Vite + PrimeVue 4 + Pinia + Vue Router 4

### 2. Editor & Formatting Configuration
- EditorConfig, Prettier, Stylelint settings (indent 2 spaces, single quotes, no semi, etc.)
- How to run `pnpm validate`

### 3. File & Folder Structure
- Directory conventions (`views/`, `components/`, `composables/`, `stores/`, `types/`, `constants/`, `api/`, `utils/`, `schemas/`)
- File naming rules (PascalCase for components, camelCase for ts files)

### 4. Naming Conventions
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE with `as const`
- Components: PascalCase (multi-word)
- Composables: `useX` prefix
- Types/Interfaces: PascalCase (no `I` prefix)
- Boolean: question-form (`isX`, `hasX`, `canX`, `shouldX`)
- Functions: start with verb
- CSS: BEM (`block__element--modifier`)

### 5. Vue Component Conventions
- `<template>` -> `<script setup lang="ts">` -> `<style scoped lang="scss">` order
- Props: type-based `defineProps<Props>()` with `withDefaults()`
- Emits: type-based `defineEmits<{...}>()`
- Auto-imported vs manual-imported components
- Attribute ordering (ESLint rule)
- v-for + key, no v-if with v-for
- i18n: use `$t()` for all user-facing text

### 6. Script Setup Organization
- Import order: Vue -> libraries -> stores -> composables -> types -> constants -> utils
- Spacing between logical blocks
- `const` over `let`; no `var`

### 7. TypeScript Conventions
- Strict typing: no `any` in production
- `interface` for object shapes, `type` for unions/primitives
- `type` imports with `import type`
- Const objects + derived types pattern
- Generic typing for API responses

### 8. Composable Conventions
- When to create a composable vs utility function
- Structure: `export function useX()` with typed return
- Side-effect isolation

### 9. Pinia Store Conventions
- Setup store pattern (function-based)
- State: `ref()`, Getters: `computed()`, Actions: functions
- Return explicit object grouping (state, getters, actions)
- `$reset()` method
- When to use store directly in components

### 10. API & Service Layer Conventions
- Gateway pattern (read/command/aggregate)
- `ApiResponse<T>` typing
- Service file structure
- Error handling in API calls

### 11. Form & Validation Conventions
- VeeValidate + Yup schema approach
- `BaseField` wrapper pattern
- `v-model` with computed get/set

### 12. CSS / SCSS Conventions
- Scoped styles required
- BEM naming with `&__element` / `&--modifier`
- PrimeVue CSS variables for colors
- No `!important` (except 3rd-party overrides)
- No static inline styles

### 13. Error Handling Conventions
- `try/catch` with typed errors
- `useAlert()` for user-facing errors
- `import.meta.env.DEV` for dev-only logging
- JSON.parse always in try/catch
- Never silently ignore errors

### 14. Constants & Configuration
- Date/number formats as constants, never hardcoded
- Route names as typed constants
- Auth keys as constants
- Use `as const` pattern

### 15. Security Rules
- No `eval`, `new Function`, dynamic script injection
- No `v-html` with unsanitized content
- No hardcoded secrets

### 16. ESLint & CI Rules Reference
- Quick reference of key rules enforced
- CI vs dev severity differences
- How to run lint checks

Each section will include concrete **Should** and **Should Not** code examples drawn from the actual codebase patterns.