# Event System Migration Guide

## Current State
- **EventBus**: Custom Vue instance-based event bus
- **Usage**: 2,084 occurrences in 729 files
- **Patterns**: `$on`, `$off`, `$emit`, `$root.$emit`

## Migration Strategy

### Option 1: mitt (Recommended)
Lightweight event emitter library, perfect replacement for EventBus.

### Option 2: provide/inject
For parent-child communication, use Vue 3's provide/inject.

### Option 3: Custom Event Emitter
Create a simple event emitter class.

## Implementation with mitt

### 1. Install mitt
```bash
pnpm add mitt
```

### 2. Update EventBus.js
```javascript
// src/plugins/EventBus.js
import mitt from 'mitt'

class EventBus {
  constructor() {
    this.bus = mitt()
  }

  on(event, handler) {
    this.bus.on(event, handler)
  }

  once(event, handler) {
    const wrapper = (...args) => {
      handler(...args)
      this.off(event, wrapper)
    }
    this.bus.on(event, wrapper)
  }

  off(event, handler) {
    this.bus.off(event, handler)
  }

  emit(event, ...args) {
    this.bus.emit(event, ...args)
  }
}

export default {
  install(app) {
    const bus = new EventBus()
    app.config.globalProperties.$bus = bus
    app.provide('$bus', bus) // For Composition API
  }
}
```

### 3. Update Modal Events

**Before (Vue 2):**
```javascript
// component-base.vue
showDialogById(dialog_id, return_focus_id) {
  this.$root.$emit('bv::show::modal', dialog_id, return_focus_id)
}

hideDialogById(dialog_id) {
  this.$root.$emit('bv::hide::modal', dialog_id)
}
```

**After (Vue 3 with bootstrap-vue-next):**
```javascript
// component-base.vue
import { useModal } from 'bootstrap-vue-next'

showDialogById(dialog_id, return_focus_id) {
  const { show } = useModal()
  show(dialog_id, { returnFocus: return_focus_id })
}

hideDialogById(dialog_id) {
  const { hide } = useModal()
  hide(dialog_id)
}
```

### 4. Update Component Event Listeners

**Before:**
```javascript
// Component
created() {
  this.$on('some-event', this.handleEvent)
},
beforeDestroy() {
  this.$off('some-event', this.handleEvent)
},
methods: {
  handleEvent(data) {
    // handle event
  },
  emitEvent() {
    this.$emit('some-event', { data: 'value' })
  }
}
```

**After (Options API):**
```javascript
// Component
created() {
  this.$bus.on('some-event', this.handleEvent)
},
beforeUnmount() {
  this.$bus.off('some-event', this.handleEvent)
},
methods: {
  handleEvent(data) {
    // handle event
  },
  emitEvent() {
    this.$bus.emit('some-event', { data: 'value' })
  }
}
```

**After (Composition API):**
```javascript
// Component
import { onMounted, onBeforeUnmount } from 'vue'
import { useBus } from '@/composables/useBus'

export default {
  setup() {
    const bus = useBus()
    
    const handleEvent = (data) => {
      // handle event
    }
    
    onMounted(() => {
      bus.on('some-event', handleEvent)
    })
    
    onBeforeUnmount(() => {
      bus.off('some-event', handleEvent)
    })
    
    const emitEvent = () => {
      bus.emit('some-event', { data: 'value' })
    }
    
    return {
      emitEvent
    }
  }
}
```

### 5. Create useBus Composable
```javascript
// src/composables/useBus.js
import { inject } from 'vue'

export function useBus() {
  const bus = inject('$bus')
  if (!bus) {
    throw new Error('EventBus not found. Make sure EventBus plugin is installed.')
  }
  return bus
}
```

## Common Patterns to Migrate

### Pattern 1: Component Communication
```javascript
// Before
// Parent component
this.$refs.child.$emit('event-name', data)

// Child component
this.$on('event-name', handler)

// After
// Use provide/inject or props/emits
// Or use EventBus if cross-component
```

### Pattern 2: Global Events
```javascript
// Before
this.$root.$emit('global-event', data)
this.$root.$on('global-event', handler)

// After
this.$bus.emit('global-event', data)
this.$bus.on('global-event', handler)
```

### Pattern 3: Modal Events
```javascript
// Before
this.$root.$emit('bv::show::modal', 'modal-id')
this.$root.$emit('bv::hide::modal', 'modal-id')

// After (with bootstrap-vue-next)
import { useModal } from 'bootstrap-vue-next'
const { show, hide } = useModal()
show('modal-id')
hide('modal-id')
```

## Migration Checklist

- [ ] Install `mitt`
- [ ] Update `EventBus.js` plugin
- [ ] Update modal event methods in `component-base.vue`
- [ ] Find all `$root.$emit` calls (grep pattern)
- [ ] Replace `$root.$emit` with appropriate solution
- [ ] Find all `this.$on` calls
- [ ] Replace with `this.$bus.on`
- [ ] Find all `this.$off` calls
- [ ] Replace with `this.$bus.off`
- [ ] Find all `this.$emit` calls (component events)
- [ ] Keep `this.$emit` for parent-child communication
- [ ] Update lifecycle hooks (`beforeDestroy` → `beforeUnmount`)
- [ ] Test all event communication

## Files to Update

Based on grep results:
- Files with `$on`: ~400 files
- Files with `$off`: ~300 files
- Files with `$emit`: ~1,000+ files (includes component emits)
- Files with `$root.$emit`: ~50 files

**Total: ~729 files need event system updates**

