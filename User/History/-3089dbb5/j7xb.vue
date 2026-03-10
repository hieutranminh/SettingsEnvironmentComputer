<template>
  <div class="print-configuration">
    <div class="config-item">
      <label for="pageSize">Page Size</label>

      <Dropdown
        id="pageSize"
        v-model="localConfiguration.pageSize"
        :options="pageSizeOptions"
        option-label="label"
        option-value="value"
        placeholder="Select page size"
        @change="handleConfigurationChange"
      />
    </div>
    <div class="config-item">
      <label for="orientation">Orientation</label>
      <Dropdown
        id="orientation"
        v-model="localConfiguration.orientation"
        :options="orientationOptions"
        option-label="label"
        option-value="value"
        placeholder="Select orientation"
        @change="handleConfigurationChange"
      />
    </div>
    <div class="config-item">
      <label for="marginTop">Top Margin (mm)</label>
      <InputNumber
        id="marginTop"
        v-model="localConfiguration.margins.top"
        :min="0"
        :max="50"
        @change="handleConfigurationChange"
      />
    </div>

    <div class="config-item">
      <label for="marginRight">Right Margin (mm)</label>
      <InputNumber
        id="marginRight"
        v-model="localConfiguration.margins.right"
        :min="0"
        :max="50"
        @change="handleConfigurationChange"
      />
    </div>

    <div class="config-item">
      <label for="marginBottom">Bottom Margin (mm)</label>
      <InputNumber
        id="marginBottom"
        v-model="localConfiguration.margins.bottom"
        :min="0"
        :max="50"
        @change="handleConfigurationChange"
      />
    </div>

    <div class="config-item">
      <label for="marginLeft">Left Margin (mm)</label>
      <InputNumber
        id="marginLeft"
        v-model="localConfiguration.margins.left"
        :min="0"
        :max="50"
        @change="handleConfigurationChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import type { PrintConfiguration } from '@/types/print'

interface Props {
  configuration: PrintConfiguration
}

interface Emits {
  (e: 'update:configuration', config: PrintConfiguration): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Local configuration for real-time preview
const localConfiguration = ref<PrintConfiguration>({ ...props.configuration })

// Options for configuration
const pageSizeOptions = [
  { label: 'A4', value: 'A4' },
  { label: 'A3', value: 'A3' },
  { label: 'Letter', value: 'Letter' },
  { label: 'Legal', value: 'Legal' },
]

const orientationOptions = [
  { label: 'Landscape', value: 'landscape' },
  { label: 'Portrait', value: 'portrait' },
]

const handleConfigurationChange = () => {
  emit('update:configuration', localConfiguration.value)
}

// Watch for external configuration changes
watch(
  () => props.configuration,
  (newConfig) => {
    localConfiguration.value = { ...newConfig }
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.print-configuration {
  @include flex-center;
  flex-wrap: wrap;
  gap: 1rem;
}

.config-item {
  display: flex;
}
</style>
