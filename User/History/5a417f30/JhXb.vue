<template>
  <div class="mixed-content-template">
    <div
      v-for="(section, index) in printData.printSections"
      :key="index"
      class="content-section"
      :class="`section-${section.type}`"
    >
      <!-- Chart Section -->
      <div v-if="section.type === 'chart'" class="chart-section">
        <h4 v-if="section.title" class="section-title">{{ section.title }}</h4>
        <div class="chart-container" ref="chartContainers">
          <div v-if="section.element" class="chart-content">
            <!-- Chart content will be rendered here -->
            <div class="chart-placeholder">
              <i class="pi pi-chart-bar" style="font-size: 2rem; color: var(--primary-color)"></i>
              <p>Chart content</p>
            </div>
          </div>
          <div v-else class="chart-placeholder">
            <i class="pi pi-chart-bar" style="font-size: 2rem; color: var(--primary-color)"></i>
            <p>No chart content available</p>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else-if="section.type === 'table'" class="table-section">
        <h4 v-if="section.title" class="section-title">{{ section.title }}</h4>
        <div class="table-container">
          <table class="content-table" v-if="section.data && section.columns">
            <thead>
              <tr>
                <th
                  v-for="column in section.columns"
                  :key="column.field"
                  :class="column.align ? `text-${column.align}` : ''"
                >
                  {{ column.header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in section.data"
                :key="rowIndex"
                class="table-row"
              >
                <td
                  v-for="column in section.columns"
                  :key="column.field"
                  :class="column.align ? `text-${column.align}` : ''"
                >
                  {{ formatCellValue(row[column.field]) }}
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else class="table-placeholder">
            <i class="pi pi-table" style="font-size: 2rem; color: var(--primary-color)"></i>
            <p>No table data available</p>
          </div>
        </div>
      </div>

      <!-- Custom Content Section -->
      <div v-else-if="section.type === 'content'" class="content-section">
        <h4 v-if="section.title" class="section-title">{{ section.title }}</h4>
        <div class="custom-content-container">
          <div v-if="section.content" class="custom-content">
            <!-- Custom content will be rendered here -->
            <div class="content-placeholder">
              <i class="pi pi-file" style="font-size: 2rem; color: var(--primary-color)"></i>
              <p>Custom content</p>
            </div>
          </div>
          <div v-else class="content-placeholder">
            <i class="pi pi-file" style="font-size: 2rem; color: var(--primary-color)"></i>
            <p>No custom content available</p>
          </div>
        </div>
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
const chartContainers = ref<HTMLElement[]>()

onMounted(() => {
  // Render chart elements if available
  if (props.printData.printSections && chartContainers.value) {
    props.printData.printSections.forEach((section, index) => {
      if (section.type === 'chart' && section.element && chartContainers.value?.[index]) {
        const chartElement = section.element.cloneNode(true) as HTMLElement
        if (chartElement) {
          // Remove interactive elements
          const interactiveElements = chartElement.querySelectorAll('button, input, select, textarea')
          interactiveElements.forEach(el => el.remove())
          
          const chartContent = chartContainers.value[index].querySelector('.chart-content')
          if (chartContent) {
            chartContent.innerHTML = ''
            chartContent.appendChild(chartElement)
          }
        }
      }
    })
  }
})

const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return ''
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  
  return String(value)
}
</script>

<style scoped>
.mixed-content-template {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 1rem;
}

.content-section {
  margin-bottom: 2rem;
  page-break-inside: avoid;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 1rem 0;
  color: var(--text-color);
  font-size: 1.2rem;
  font-weight: 600;
}

/* Chart Section */
.chart-section {
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--surface-card);
}

.chart-container {
  width: 100%;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-align: center;
}

/* Table Section */
.table-section {
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--surface-card);
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.content-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--surface-border);
}

.content-table th,
.content-table td {
  padding: 0.5rem;
  border: 1px solid var(--surface-border);
  text-align: left;
}

.content-table th {
  background-color: var(--surface-100);
  font-weight: 600;
}

.table-row:nth-child(even) {
  background-color: var(--surface-50);
}

.table-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-align: center;
  min-height: 100px;
}

/* Custom Content Section */
.custom-content-container {
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--surface-card);
}

.custom-content {
  width: 100%;
  min-height: 100px;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-color-secondary);
  text-align: center;
  min-height: 100px;
}

/* Text alignment classes */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

/* Placeholder text styles */
.chart-placeholder p,
.table-placeholder p,
.content-placeholder p {
  margin: 0;
  font-size: 0.9rem;
}

@media print {
  .mixed-content-template {
    overflow: visible;
    padding: 0;
  }
  
  .content-section {
    page-break-inside: avoid;
    margin-bottom: 1rem;
  }
  
  .chart-section,
  .table-section,
  .custom-content-container {
    border: none;
    background-color: transparent;
    padding: 0.5rem;
  }
}
</style> 