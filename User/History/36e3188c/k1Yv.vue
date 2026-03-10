<template>
  <Transition name="pwa-slide">
    <div v-if="needRefresh" class="pwa-update-banner" role="alert">
      <div class="pwa-update-content">
        <i class="pi pi-refresh pwa-update-icon" />
        <span class="pwa-update-text">
          {{ $t('pwa.updateAvailable', 'A new version is available.') }}
        </span>
      </div>
      <div class="pwa-update-actions">
        <button class="pwa-btn pwa-btn-update" type="button" @click="onUpdate">
          {{ $t('pwa.update', 'Update') }}
        </button>
        <button class="pwa-btn pwa-btn-dismiss" type="button" @click="onDismiss">
          {{ $t('pwa.dismiss', 'Later') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { usePwaUpdate } from '@/composables/usePwaUpdate'

const { needRefresh, updateServiceWorker, close } = usePwaUpdate()

const onUpdate = async (): Promise<void> => {
  await updateServiceWorker()
}

const onDismiss = (): void => {
  close()
}
</script>

<style scoped lang="scss">
.pwa-update-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background-color: var(--p-primary-color, #3b82f6);
  color: var(--p-primary-contrast-color, white);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
}

.pwa-update-content {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pwa-update-icon {
  font-size: 1.125rem;
}

.pwa-update-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.pwa-update-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pwa-btn {
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 0.7;
  }
}

.pwa-btn-update {
  background-color: white;
  color: var(--p-primary-color, #3b82f6);
}

.pwa-btn-dismiss {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

// Slide-up transition
.pwa-slide-enter-active,
.pwa-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.pwa-slide-enter-from,
.pwa-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
