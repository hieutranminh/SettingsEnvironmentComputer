<template>
  <div class="group-btn">
    <Button
      v-if="options.confirm"
      :severity="'primary'"
      :size="size"
      :disabled="disabled.confirm"
      :isLoading="loading.confirm"
      :aria-label="labels.confirm"
      @click="emit('confirm')"
    >
      {{ labels.confirm }}
    </Button>
    <Button
      v-if="options.save"
      :severity="'primary'"
      :size="size"
      :disabled="disabled.save"
      :isLoading="loading.save"
      :aria-label="labels.save"
      @click="emit('save')"
    >
      {{ labels.save }}
    </Button>
    <Button
      v-if="options.add"
      :severity="'primary'"
      :size="size"
      :disabled="disabled.add"
      :isLoading="loading.add"
      :aria-label="labels.add"
      @click="emit('add')"
    >
      {{ labels.add }}
    </Button>

    <Button
      v-if="options.delete"
      :severity="'primary'"
      :size="size"
      :disabled="disabled.delete"
      :isLoading="loading.delete"
      :aria-label="labels.delete"
      @click="emit('delete')"
    >
      {{ labels.delete }}
    </Button>

    <Button
      v-if="options.cancel"
      :severity="'info'"
      :size="size"
      :disabled="disabled.cancel"
      :isLoading="loading.cancel"
      :aria-label="labels.cancel"
      @click="emit('cancel')"
    >
      {{ labels.cancel }}
    </Button>

    <Button
      v-if="options.close"
      :severity="'success'"
      :size="size"
      :disabled="disabled.close"
      :isLoading="loading.close"
      :aria-label="labels.close"
      @click="emit('close')"
    >
      {{ labels.close }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useTranslation } from '@/composables/useTranslation'

type ButtonSize = 'small' | 'medium' | 'large'

interface ToggleOptions {
  add?: boolean
  confirm?: boolean
  cancel?: boolean
  delete?: boolean
  close?: boolean
  save?: boolean
}

interface ButtonStates {
  add?: boolean
  confirm?: boolean
  cancel?: boolean
  delete?: boolean
  close?: boolean
  save?: boolean
}

interface ButtonLabels {
  add?: string
  confirm?: string
  cancel?: string
  delete?: string
  close?: string
  save?: string
}

interface Props {
  options?: ToggleOptions
  labels?: ButtonLabels
  disabled?: ButtonStates
  loading?: ButtonStates
  size?: ButtonSize
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({ add: false, delete: false, close: false, save: false, confirm: false }),
  labels: () => ({
    add: 'add',
    confirm: 'confirm',
    cancel: 'cancel',
    delete: 'delete',
    close: 'close',
    save: 'save',
  }),
  disabled: () => ({ add: false, delete: false, close: false }),
  loading: () => ({ add: false, delete: false, close: false }),
  size: 'medium',
})

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'cancel'): void
  (e: 'delete'): void
  (e: 'close'): void
  (e: 'save'): void
  (e: 'confirm'): void
}>()

const { t } = useTranslation()

const options = computed(() => ({
  add: props.options?.add ?? false,
  confirm: props.options?.confirm ?? false,
  cancel: props.options?.cancel ?? false,
  delete: props.options?.delete ?? false,
  close: props.options?.close ?? false,
  save: props.options?.save ?? false,
}))

const labels = computed(() => ({
  add: props.labels?.add ?? t('general.add'),
  confirm: props.labels?.confirm ?? t('general.confirm'),
  cancel: props.labels?.cancel ?? t('general.cancel'),
  delete: props.labels?.delete ?? t('general.delete'),
  close: props.labels?.close ?? t('general.close'),
  save: props.labels?.save ?? t('general.save'),
}))

const disabled = computed(() => ({
  add: props.disabled?.add ?? false,
  confirm: props.disabled?.confirm ?? false,
  cancel: props.disabled?.cancel ?? false,
  delete: props.disabled?.delete ?? false,
  close: props.disabled?.close ?? false,
  save: props.disabled?.save ?? false,
}))

const loading = computed(() => ({
  add: props.loading?.add ?? false,
  confirm: props.loading?.confirm ?? false,
  cancel: props.loading?.cancel ?? false,
  delete: props.loading?.delete ?? false,
  close: props.loading?.close ?? false,
}))
</script>

<style scoped lang="scss">
.group-btn {
  display: inline-flex;
  gap: 8px;
  margin-top: 20px;
  width: 100%;
  justify-content: center;

  button {
    padding: 10px 15px;
    min-width: 100px;
  }
}
</style>
