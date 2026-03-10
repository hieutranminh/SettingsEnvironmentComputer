<template>
  <Panel header="Template Examples">
    <div class="examples-container">
      <div class="examples-selector">
        <Select
          v-model="selectedExample"
          :options="exampleOptions"
          option-label="label"
          option-value="value"
          placeholder="Select an example"
        />
      </div>
      <div class="examples-content">
        <component :is="exampleComponents[selectedExample]" v-if="selectedExample" />
      </div>
    </div>
  </Panel>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent, type Component } from 'vue'

const exampleComponents: Record<string, Component> = {
  LuxonAndTimezoneExamples: defineAsyncComponent(() => import('./LuxonAndTimezoneExamples.vue')),
  ThemeExamples: defineAsyncComponent(() => import('./ThemeExamples.vue')),
  AlertExamples: defineAsyncComponent(() => import('./AlertExamples.vue')),
  FormExamples: defineAsyncComponent(() => import('./FormExamples.vue')),
  ValidationExamples: defineAsyncComponent(() => import('./ValidationExamples.vue')),
}

const exampleOptions = [
  { label: 'Luxon & Timezone Examples', value: 'LuxonAndTimezoneExamples' },
  { label: 'Theme Examples', value: 'ThemeExamples' },
  { label: 'Alert Examples', value: 'AlertExamples' },
  { label: 'Form Examples', value: 'FormExamples' },
  { label: 'Validation Examples', value: 'ValidationExamples' },
]

const selectedExample = ref<string>('LuxonAndTimezoneExamples')
</script>

<style lang="scss" scoped>
.examples-selector {
  margin-bottom: 1rem;
}

.examples-content {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
</style>
