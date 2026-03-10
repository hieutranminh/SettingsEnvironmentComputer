# Vue 3 Migration Plan

## 1. Overview of Current State

### Technology Stack
- **Vue**: 2.6.12
- **Vuex**: 3.2.0
- **Vue Router**: 3.0.2
- **Bootstrap-Vue**: 2.21.2 (2,180 usages across 477 files)
- **Build System**: Webpack 5.65.0
- **Total Components**: ~1,174 .vue files
- **Mixins**: 53 mixins
- **EventBus Pattern**: 2,084 occurrences in 729 files
- **Filters**: 8 global filters
- **Deep Selectors**: 750 `::v-deep` occurrences in 341 files

### Key Dependencies Issues
- `bootstrap-vue@^2.21.2` - No Vue 3 version, needs complete replacement
- `vue-good-table@2.16.3` - Vue 2 only
- `vue-multiselect@^2.1.3` - Vue 2 only
- `vue-pdf@^4.3.0` - Vue 2 only
- `vue-signature-pad@^2.0.5` - Vue 2 only
- `vue-upload-component@^2.8.20` - Vue 2 only
- `vue-gallery-slideshow@^1.5.0` - Vue 2 only
- `vue-cleave-component@^2.1.3` - Vue 2 only
- `v-calendar@^0.9.7` - Needs upgrade to v3.x
- `vuedraggable@^2.24.3` - Needs upgrade to v4.x
- `vue-chartjs@^3.5.0` - Needs upgrade to v5.x
- `@sentry/vue@^6.11.0` - Needs upgrade to v7.x or v8.x

## 2. Overview of Final State

### Target Technology Stack
- **Vue**: 3.4.x (latest stable)
- **Vuex**: 4.x (or migrate to Pinia)
- **Vue Router**: 4.x
- **Bootstrap-Vue Alternative**: `bootstrap-vue-next@^4.x` or `PrimeVue`
- **Build System**: Webpack 5 (compatible) or Vite (optional)
- **Composition API**: Gradually adopt for new code
- **Event System**: Replace EventBus with `mitt` or `provide/inject`
- **Filters**: Convert to methods/computed properties
- **Deep Selectors**: Migrate to `:deep()` syntax

### Migration Strategy
- **Approach**: Gradual migration using `@vue/compat` (migration build)
- **Timeline**: 3-4 months with 2-3 developers
- **Testing**: Comprehensive testing after each phase

## 3. Files to Change

### Phase 1: Build System & Core Dependencies
- `package.json` - Update all Vue 3 compatible dependencies
- `config/webpack/webpack.base.js` - Update Vue loader configuration
- `config/webpack/webpack.local.js` - Update dev server config
- `config/webpack/webpack.deploy.js` - Update production config
- `src/app.js` - Migrate Vue instance creation to Vue 3 API
- `src/app.vue` - Update lifecycle hooks and component structure
- `jest.config.js` - Update test configuration for Vue 3

### Phase 2: Event System Migration
- `src/plugins/EventBus.js` - Replace with `mitt` or custom event emitter
- `src/plugins/Bootstrap.js` - Update to use `bootstrap-vue-next` or alternative
- All 729 files using `$on`, `$off`, `$emit` - Replace with new event system
- `src/components/common/component-base/component-base.vue` - Update modal event handling

### Phase 3: Filters Migration
- `src/plugins/Filters.js` - Convert filters to composables or global methods
- All template files using filters (e.g., `{{ value | filterName }}`) - Convert to method calls

### Phase 4: Bootstrap-Vue Migration
- `src/plugins/Bootstrap.js` - Replace with `bootstrap-vue-next` or `PrimeVue`
- 477 files using bootstrap-vue components - Update component names and props
- Common components:
  - `b-modal` → `BModal` (bootstrap-vue-next) or `Dialog` (PrimeVue)
  - `b-button` → `BButton` or `Button`
  - `b-form` → `BForm` or `Form`
  - `b-table` → `BTable` or `DataTable`
  - `b-dropdown` → `BDropdown` or `Dropdown`
  - `b-tab` → `BTabs` or `TabView`
  - `b-card` → `BCard` or `Card`

### Phase 5: Mixins to Composables
- `src/helpers/mixins/*.js` (53 files) - Convert to composables
- All components using mixins - Update to use composables
- Key mixins to migrate:
  - `splash-screen-mixin.js`
  - `booking-mixin.js`
  - `sales-mixin.js`
  - `client-mixin.js`
  - `staff-mixin.js`
  - And 48 more...

### Phase 6: Lifecycle Hooks
- All components with `beforeDestroy` - Rename to `beforeUnmount`
- All components with `destroyed` - Rename to `unmounted`
- Estimated ~200+ files

### Phase 7: Deep Selectors
- 341 files with `::v-deep` - Replace with `:deep()` syntax
- Update all SCSS files accordingly

### Phase 8: Router & Store
- `src/config/router.js` - Update to Vue Router 4 API
- `src/store/store.js` - Update to Vuex 4 API (or migrate to Pinia)
- All store modules - Update if needed for Vuex 4

### Phase 9: Third-party Components
- Replace `vue-good-table` with `vue-good-table-next`
- Replace `vue-multiselect` with `@vueform/multiselect`
- Replace `vue-pdf` with `@vue-pdf/viewer` or alternative
- Replace `vue-signature-pad` with Vue 3 compatible alternative
- Replace `vue-upload-component` with Vue 3 compatible version
- Replace `vue-gallery-slideshow` with `vue-easy-lightbox`
- Replace `vue-cleave-component` usage (already have `vue-imask`)
- Update `v-calendar` to v3.x
- Update `vuedraggable` to v4.x
- Update `vue-chartjs` to v5.x
- Update `@sentry/vue` to v7.x or v8.x

### Phase 10: Testing & Debugging
- Update all test files to use `@vue/test-utils@^2.x`
- Fix broken tests
- Update E2E tests if any
- Performance testing
- Cross-browser testing

## 4. Migration Checklist

### Phase 1: Preparation & Setup
- [ ] Create migration branch (`feature/vue3-migration`)
- [ ] Install `@vue/compat` for gradual migration
- [ ] Update `package.json` with Vue 3 core dependencies
  - [ ] `vue@^3.4.0`
  - [ ] `@vue/compat@^3.4.0`
  - [ ] `vuex@^4.1.0` or `pinia@^2.1.0`
  - [ ] `vue-router@^4.2.0`
- [ ] Update build tools
  - [ ] `vue-loader@^17.0.0`
  - [ ] `@vue/compiler-sfc@^3.4.0`
  - [ ] Remove `vue-template-compiler`
- [ ] Update test dependencies
  - [ ] `@vue/test-utils@^2.4.0`
  - [ ] `vue-jest@^5.0.0`
- [ ] Configure `@vue/compat` in webpack
- [ ] Update `src/app.js` to use Vue 3 createApp API
- [ ] Test basic app startup

### Phase 2: Event System Migration
- [ ] Install `mitt` or create custom event emitter
- [ ] Update `src/plugins/EventBus.js` to use new event system
- [ ] Create migration guide for event patterns
- [ ] Migrate `$root.$emit` calls (modal events)
  - [ ] Update `component-base.vue` modal methods
  - [ ] Update all `showDialogById` / `hideDialogById` calls
- [ ] Migrate component event listeners
  - [ ] Replace `this.$on` with new event bus
  - [ ] Replace `this.$off` with cleanup
  - [ ] Replace `this.$emit` with new event bus
- [ ] Test event communication across components

### Phase 3: Filters Migration
- [ ] Create composables for filter functions
  - [ ] `useDateFilters.js`
  - [ ] `useNumberFilters.js`
  - [ ] `usePhoneFilters.js`
- [ ] Update `src/plugins/Filters.js` to register global methods
- [ ] Find all filter usages in templates
- [ ] Replace `{{ value | filterName }}` with `{{ filterName(value) }}`
- [ ] Test all filter functionality

### Phase 4: Bootstrap-Vue Migration
- [ ] Research and decide: `bootstrap-vue-next` vs `PrimeVue` vs `BootstrapVue3`
- [ ] Install chosen library
- [ ] Update `src/plugins/Bootstrap.js`
- [ ] Create component mapping guide
- [ ] Migrate modal components (477 files)
  - [ ] `b-modal` → new modal component
  - [ ] Update props and events
- [ ] Migrate form components
  - [ ] `b-form-input` → new input component
  - [ ] `b-form-select` → new select component
  - [ ] `b-form-checkbox` → new checkbox component
- [ ] Migrate table components
  - [ ] `b-table` → new table component
- [ ] Migrate navigation components
  - [ ] `b-tabs` → new tabs component
  - [ ] `b-nav` → new nav component
- [ ] Migrate layout components
  - [ ] `b-card` → new card component
  - [ ] `b-row`, `b-col` → new grid components
- [ ] Test all bootstrap-vue functionality

### Phase 5: Mixins to Composables
- [ ] Create `src/composables` directory structure
- [ ] Migrate high-priority mixins first
  - [ ] `splash-screen-mixin.js` → `useSplashScreen.js`
  - [ ] `booking-mixin.js` → `useBooking.js`
  - [ ] `sales-mixin.js` → `useSales.js`
  - [ ] `client-mixin.js` → `useClient.js`
- [ ] Update components to use composables
  - [ ] Replace `mixins: [...]` with `setup()` function
  - [ ] Import and use composables
- [ ] Migrate remaining 49 mixins gradually
- [ ] Test all mixin functionality

### Phase 6: Lifecycle Hooks
- [ ] Find all `beforeDestroy` hooks
- [ ] Rename to `beforeUnmount`
- [ ] Find all `destroyed` hooks
- [ ] Rename to `unmounted`
- [ ] Test component cleanup

### Phase 7: Deep Selectors
- [ ] Find all `::v-deep` occurrences (341 files)
- [ ] Replace with `:deep()` syntax
- [ ] Test styling across components

### Phase 8: Router & Store
- [ ] Update `src/config/router.js` to Vue Router 4
  - [ ] Update router instance creation
  - [ ] Update navigation guards syntax
- [ ] Update `src/store/store.js` to Vuex 4
  - [ ] Update store instance creation
  - [ ] Or migrate to Pinia (recommended)
- [ ] Test routing functionality
- [ ] Test store functionality

### Phase 9: Third-party Components
- [ ] Replace `vue-good-table`
  - [ ] Install `vue-good-table-next`
  - [ ] Update component imports
  - [ ] Update props and events
- [ ] Replace `vue-multiselect`
  - [ ] Install `@vueform/multiselect`
  - [ ] Update component usage
- [ ] Replace `vue-pdf`
  - [ ] Install `@vue-pdf/viewer` or alternative
  - [ ] Update PDF viewer components
- [ ] Replace `vue-signature-pad`
  - [ ] Find Vue 3 compatible alternative
  - [ ] Update signature components
- [ ] Replace `vue-upload-component`
  - [ ] Install Vue 3 compatible version
  - [ ] Update upload components
- [ ] Replace `vue-gallery-slideshow`
  - [ ] Install `vue-easy-lightbox`
  - [ ] Update gallery components
- [ ] Update `v-calendar` to v3.x
- [ ] Update `vuedraggable` to v4.x
- [ ] Update `vue-chartjs` to v5.x
- [ ] Update `@sentry/vue` to v7.x or v8.x
- [ ] Test all third-party component functionality

### Phase 10: Testing & Quality Assurance
- [ ] Update unit tests
  - [ ] Fix broken tests
  - [ ] Update test utilities
- [ ] Update integration tests
- [ ] Manual testing checklist
  - [ ] Test all major features
  - [ ] Test calendar module (complex)
  - [ ] Test sales module
  - [ ] Test booking module
  - [ ] Test client management
  - [ ] Test staff management
  - [ ] Test reporting features
- [ ] Performance testing
  - [ ] Bundle size comparison
  - [ ] Runtime performance
  - [ ] Memory leaks check
- [ ] Cross-browser testing
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari
- [ ] Mobile device testing
- [ ] Fix all identified bugs
- [ ] Code review
- [ ] Documentation update

### Phase 11: Deployment
- [ ] Update CI/CD pipeline if needed
- [ ] Create migration documentation
- [ ] Train team on Vue 3 patterns
- [ ] Deploy to staging environment
- [ ] Monitor for issues
- [ ] Deploy to production

## 5. Risk Mitigation

### High Risk Areas
1. **Bootstrap-Vue Migration** - 477 files affected
   - Mitigation: Create component wrapper library, migrate incrementally
2. **EventBus Pattern** - 729 files affected
   - Mitigation: Use `@vue/compat` initially, migrate gradually
3. **Mixins** - 53 mixins, many components
   - Mitigation: Migrate high-priority mixins first, keep others working
4. **Third-party Components** - Multiple replacements needed
   - Mitigation: Test each replacement thoroughly before full migration

### Rollback Plan
- Keep Vue 2 branch active
- Use feature flags for gradual rollout
- Monitor error rates closely
- Have rollback procedure documented

## 6. Timeline Estimate

- **Phase 1**: 1 week
- **Phase 2**: 2-3 weeks
- **Phase 3**: 1 week
- **Phase 4**: 4-6 weeks (highest risk)
- **Phase 5**: 2-3 weeks
- **Phase 6**: 1 week
- **Phase 7**: 2-3 days
- **Phase 8**: 1-2 weeks
- **Phase 9**: 2-3 weeks
- **Phase 10**: 3-4 weeks
- **Phase 11**: 1 week

**Total: 3-4 months** with 2-3 developers

## 7. Additional Notes

### Recommended Approach
1. Start with `@vue/compat` for gradual migration
2. Migrate one module at a time (e.g., start with simpler modules)
3. Keep Vue 2 code working alongside Vue 3 code during transition
4. Use Composition API for all new code
5. Consider migrating to Pinia instead of Vuex 4 (better DX)

### Alternative: Vue 2.7 Upgrade Path
- Upgrade to Vue 2.7 first (supports Composition API)
- Gradually adopt Composition API
- Then migrate to Vue 3 later (easier transition)

