<template>
  <div class="print-test-view">
    <div class="container">
      <h1>Print System Test</h1>
      
      <div class="test-section">
        <h2>Table Print Test</h2>
        <Button
          icon="pi pi-print"
          label="Print Table"
          @click="handlePrintTable"
          class="mb-3"
        />
        
        <DataTable
          :value="tableData"
          :columns="tableColumns"
          stripedRows
          class="mb-4"
        >
          <Column
            v-for="col in tableColumns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            :style="{ width: col.width ? `${col.width}px` : 'auto' }"
          />
        </DataTable>
      </div>

      <div class="test-section">
        <h2>Chart Print Test</h2>
        <Button
          icon="pi pi-print"
          label="Print Chart"
          @click="handlePrintChart"
          class="mb-3"
        />
        
        <div
          ref="chartRef"
          class="chart-container"
        >
          <h3>Sample Chart</h3>
          <div class="chart-placeholder">
            <i
              class="pi pi-chart-bar"
              style="font-size: 4rem; color: var(--primary-color)"
            />
            <p>This is a sample chart that would be printed</p>
          </div>
        </div>
      </div>

      <div class="test-section">
        <h2>Mixed Content Print Test</h2>
        <Button
          icon="pi pi-print"
          label="Print Mixed Content"
          @click="handlePrintMixed"
          class="mb-3"
        />
        
        <div class="mixed-content">
          <div class="chart-section">
            <h4>Chart Section</h4>
            <div class="chart-placeholder">
              <i
                class="pi pi-chart-line"
                style="font-size: 2rem; color: var(--primary-color)"
              />
              <p>Chart content</p>
            </div>
          </div>
          
          <div class="table-section">
            <h4>Table Section</h4>
            <DataTable
              :value="mixedTableData"
              :columns="mixedTableColumns"
              stripedRows
            >
              <Column
                v-for="col in mixedTableColumns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
              />
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { usePrint } from '@/composables/usePrint'
import type { PrintData, TableColumn } from '@/types/print'

const { openPrintPreview } = usePrint()

const chartRef = ref<HTMLElement>()

// Sample table data
const tableData = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', department: 'Engineering', salary: 75000 },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', department: 'Marketing', salary: 65000 },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', department: 'Sales', salary: 70000 },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', department: 'HR', salary: 60000 },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', department: 'Engineering', salary: 80000 },
])

const tableColumns: TableColumn[] = [
  { field: 'id', header: 'ID', width: 60, align: 'center' },
  { field: 'name', header: 'Name', width: 150 },
  { field: 'email', header: 'Email', width: 200 },
  { field: 'department', header: 'Department', width: 120 },
  { field: 'salary', header: 'Salary', width: 100, align: 'right' },
]

const mixedTableData = ref([
  { product: 'Product A', sales: 150, revenue: 15000 },
  { product: 'Product B', sales: 200, revenue: 20000 },
  { product: 'Product C', sales: 100, revenue: 10000 },
])

const mixedTableColumns: TableColumn[] = [
  { field: 'product', header: 'Product' },
  { field: 'sales', header: 'Sales', align: 'center' },
  { field: 'revenue', header: 'Revenue', align: 'right' },
]

const handlePrintTable = () => {
  const printData: PrintData = {
    title: 'Employee Report',
    printType: 'table',
    printData: tableData.value,
    columns: tableColumns,
    enablePagination: true,
    rowsPerPage: 3,
  }

  openPrintPreview(printData)
}

const handlePrintChart = () => {
  const printData: PrintData = {
    title: 'Sales Chart Report',
    printType: 'chart',
    sectionRef: chartRef.value,
  }

  openPrintPreview(printData)
}

const handlePrintMixed = () => {
  const printData: PrintData = {
    title: 'Mixed Content Report',
    printType: 'mixed',
    printSections: [
      {
        type: 'chart',
        title: 'Sales Overview',
        element: chartRef.value,
      },
      {
        type: 'table',
        title: 'Product Sales',
        data: mixedTableData.value,
        columns: mixedTableColumns,
      },
    ],
  }

  openPrintPreview(printData)
}
</script>

<style scoped>
.print-test-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.container {
  background-color: var(--surface-card);
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.test-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background-color: var(--surface-ground);
}

.test-section h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.chart-container {
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: var(--surface-card);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-color-secondary);
  text-align: center;
}

.mixed-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.chart-section,
.table-section {
  padding: 1rem;
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  background-color: var(--surface-card);
}

.chart-section h4,
.table-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-color);
}

@media (width <= 768px) {
  .mixed-content {
    grid-template-columns: 1fr;
  }
}
</style> 