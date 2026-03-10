<template>
  <div class="chart-print-template">
    <div
      class="chart-container"
      ref="chartContainer"
    >
      <div
        v-if="printData.sectionRef"
        class="chart-content"
      >
        <!-- Chart content will be rendered here via sectionRef -->
        <div class="chart-placeholder">
          <i
            class="pi pi-chart-bar"
            style="font-size: 3rem; color: var(--primary-color)"
          ></i>
          <p>Chart content will be rendered here</p>
        </div>
      </div>
      <div
        v-else
        class="chart-placeholder"
      >
        <i
          class="pi pi-chart-bar"
          style="font-size: 3rem; color: var(--primary-color)"
        ></i>
        <p>No chart content available</p>
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
const chartContainer = ref<HTMLElement>()

onMounted(() => {
  // If sectionRef is provided, render the chart content
  if (props.printData.sectionRef && chartContainer.value) {
    // Clone the chart element and append it to the container
    const chartElement = props.printData.sectionRef.cloneNode(true) as HTMLElement
    if (chartElement) {
      // Remove any interactive elements for print
      const interactiveElements = chartElement.querySelectorAll('button, input, select, textarea')
      interactiveElements.forEach((el) => el.remove())

      // Clear existing content and append chart
      const chartContent = chartContainer.value.querySelector('.chart-content')
      if (chartContent) {
        chartContent.innerHTML = ''
        chartContent.appendChild(chartElement)
      }
    }
  }
})
</script>

<style scoped>
.chart-print-template {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background-color: var(--surface-card);
}

.chart-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--text-color-secondary);
  text-align: center;
}

.chart-placeholder p {
  margin: 0;
  font-size: 1.1rem;
}

@media print {
  .chart-print-template {
    page-break-inside: avoid;
  }

  .chart-container {
    border: none;
    background-color: transparent;
  }
}
</style>
