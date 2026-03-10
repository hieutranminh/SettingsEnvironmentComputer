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
  ValidationExamples: defineAsyncComponent(() => import('./ValidationExamples.vue')),
  ThemeExamples: defineAsyncComponent(() => import('./ThemeExamples.vue')),
  FormExamples: defineAsyncComponent(() => import('./FormExamples.vue')),
  LuxonAndTimezoneExamples: defineAsyncComponent(() => import('./LuxonAndTimezoneExamples.vue')),
}

const exampleOptions = [
  { label: 'Luxon & Timezone Examples', value: 'LuxonAndTimezoneExamples' },
  { label: 'Theme Examples', value: 'ThemeExamples' },
  { label: 'Validation Examples', value: 'ValidationExamples' },
  { label: 'Form Examples', value: 'FormExamples' },
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
  background-color: #f9fafb;
}
</style>
