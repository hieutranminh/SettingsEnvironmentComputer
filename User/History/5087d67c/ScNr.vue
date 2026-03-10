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
  LuxonExamples: defineAsyncComponent(() => import('./LuxonExamples.vue')),
  ValidationExamples: defineAsyncComponent(() => import('./ValidationExamples.vue')),
  FormExamples: defineAsyncComponent(() => import('./FormExamples.vue')),
}

const exampleOptions = [
  { label: 'Luxon Examples', value: 'LuxonExamples' },
  { label: 'Validation Examples', value: 'ValidationExamples' },
  { label: 'Form Examples', value: 'FormExamples' },
]

const selectedExample = ref<string>('LuxonExamples')
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
