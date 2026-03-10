<template>
  <div class="content-print-template">
    <div class="custom-content-container" ref="contentContainer">
      <div v-if="printData.content" class="custom-content">
        <!-- Custom content will be rendered here -->
        <div class="content-placeholder">
          <i class="pi pi-file" style="font-size: 3rem; color: var(--primary-color)"></i>
          <p>Custom content will be rendered here</p>
        </div>
      </div>
      <div v-else class="content-placeholder">
        <i class="pi pi-file" style="font-size: 3rem; color: var(--primary-color)"></i>
        <p>No custom content available</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PrintData, PrintConfiguration } from '@/types/print'

interface Props {
  printData: PrintData
  currentPage: number
  configuration: PrintConfiguration
}

const props = defineProps<Props>()
const contentContainer = ref<HTMLElement>()

onMounted(() => {
  // If content is provided, render it
  if (props.printData.content && contentContainer.value) {
    const contentElement = props.printData.content.cloneNode(true) as HTMLElement
    if (contentElement) {
      // Remove any interactive elements for print
      const interactiveElements = contentElement.querySelectorAll('button, input, select, textarea')
      interactiveElements.forEach(el => el.remove())
      
      // Clear existing content and append custom content
      const customContent = contentContainer.value.querySelector('.custom-content')
      if (customContent) {
        customContent.innerHTML = ''
        customContent.appendChild(contentElement)
      }
    }
  }
})
</script>

<style scoped>
.content-print-template {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-content-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background-color: var(--surface-card);
}

.custom-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-color-secondary);
  text-align: center;
}

.content-placeholder p {
  margin: 0;
  font-size: 1.1rem;
}

@media print {
  .content-print-template {
    page-break-inside: avoid;
  }
  
  .custom-content-container {
    border: none;
    background-color: transparent;
  }
  
  .custom-content {
    padding: 0;
  }
}
</style> 