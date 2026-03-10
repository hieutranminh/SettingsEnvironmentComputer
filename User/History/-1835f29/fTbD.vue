<template>
  <Dialog
    :visible="props.visible"
    :header="props.header"
    :modal="props.modal"
    :closable="props.closable"
    :close-on-escape="props.closeOnEscape"
    :dismissable-mask="props.dismissableMask"
    :draggable="props.draggable"
    :style="props.style"
    @update:visible="handleClose"
  >
    <div class="notification-content">
      <div class="notification-icon" v-if="icon">
        <i :class="icon" :style="{ color: getIconColor() }"></i>
      </div>
      <div class="notification-message">
        {{ message }}
      </div>
    </div>

    <template #footer>
      <div class="notification-actions">
        <Button
          v-for="action in actions"
          :key="action.label"
          :label="action.label"
          :severity="action.severity || 'primary'"
          :disabled="action.disabled"
          @click="handleActionClick(action)"
        />
        <Button
          v-if="showCloseButton"
          label="Close"
          severity="secondary"
          @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import type { NotificationAction } from '@/types/Notification'

// Get data from DialogService
const dialogData = inject('dialogData', {
  message: '',
  icon: '',
  severity: 'info',
  actions: [] as NotificationAction[]
})

interface Props {
  visible: boolean
  header?: string
  modal?: boolean
  closable?: boolean
  closeOnEscape?: boolean
  dismissableMask?: boolean
  draggable?: boolean
  style?: Record<string, string>
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  modal: true,
  closable: true,
  closeOnEscape: true,
  dismissableMask: false,
  draggable: false
})

const emit = defineEmits<Emits>()

const message = computed(() => dialogData.message)
const icon = computed(() => dialogData.icon)
const severity = computed(() => dialogData.severity)
const actions = computed(() => dialogData.actions || [])

const showCloseButton = computed(() => {
  return actions.value.length === 0
})

const getIconColor = (): string => {
  switch (severity.value) {
    case 'success':
      return 'var(--green-500)'
    case 'warn':
    case 'warning':
      return 'var(--orange-500)'
    case 'danger':
    case 'error':
      return 'var(--red-500)'
    case 'info':
    default:
      return 'var(--blue-500)'
  }
}

const handleClose = (): void => {
  emit('update:visible', false)
}

const handleActionClick = (action: NotificationAction): void => {
  if (action.onClick) {
    action.onClick()
  }
  handleClose()
}
</script>

<style scoped lang="scss">
.notification-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.5rem 0;
}

.notification-icon {
  flex-shrink: 0;

  i {
    font-size: 1.5rem;
  }
}

.notification-message {
  flex: 1;
  line-height: 1.5;
}

.notification-actions {
    display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
