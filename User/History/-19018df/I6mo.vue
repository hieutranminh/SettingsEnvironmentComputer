<template>
  <div class="print-preview-example">
    <div class="example-header">
      <h1>Print Preview Module Examples</h1>
      <p>Demonstrating different ways to use the modern print preview functionality</p>
    </div>

    <!-- Example 1: Simple Button Usage -->
    <div class="example-section">
      <h2>1. Simple Button Usage</h2>
      <p>Using the PrintPreviewButton component for quick implementation</p>
      
      <PrintPreviewButton
        :worker-type="WORKER_TYPES.SALES_HISTORY"
        :table-headers="salesTableHeaders"
        :report-headers="salesReportHeaders"
        :request-payload="salesRequestPayload"
        :additional-options="salesAdditionalOptions"
        button-text="Generate Sales Report"
        variant="primary"
        size="lg"
        icon="pi pi-file-pdf"
        @start="handleSalesStart"
        @error="handleSalesError"
      />
    </div>

    <!-- Example 2: Composable Usage -->
    <div class="example-section">
      <h2>2. Composable Usage</h2>
      <p>Using the usePrintPreview composable for more control</p>
      
      <div class="composable-example">
        <div class="controls">
          <Button 
            :loading="isWorkerProcessing" 
            :disabled="!canStartPrint"
            @click="handleComposablePrint"
          >
            {{ isWorkerProcessing ? 'Generating...' : 'Generate Report' }}
          </Button>
          
          <div v-if="isWorkerProcessing" class="progress-info">
            <ProgressBar :value="progressPercentage" :show-value="true" />
            <span>Progress: {{ progressPercentage }}%</span>
          </div>
        </div>

        <div v-if="hasError" class="error-message">
          <i class="pi pi-exclamation-triangle"></i>
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          <i class="pi pi-check-circle"></i>
          {{ successMessage }}
        </div>
      </div>
    </div>

    <!-- Example 3: Full Component Usage -->
    <div class="example-section">
      <h2>3. Full Component Usage</h2>
      <p>Using the complete PrintPreview component with custom content</p>
      
      <PrintPreview
        :worker-type="WORKER_TYPES.SALES_HISTORY"
        :table-headers="salesTableHeaders"
        :report-headers="salesReportHeaders"
        :request-payload="salesRequestPayload"
        :report-name="'Sales History Report'"
        @start="handleFullComponentStart"
        @success="handleFullComponentSuccess"
        @error="handleFullComponentError"
        @download="handleDownload"
        @print="handlePrint"
      >
        <template #print-content>
          <div class="print-content">
            <div class="print-header">
              <h1>Sales History Report</h1>
              <p>Generated on {{ currentDate }}</p>
            </div>
            
            <div class="print-summary">
              <div class="summary-item">
                <span class="label">Total Sales:</span>
                <span class="value">{{ formatCurrency(totalSales) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Orders:</span>
                <span class="value">{{ totalOrders }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Average Order:</span>
                <span class="value">{{ formatCurrency(averageOrder) }}</span>
              </div>
            </div>

            <table class="print-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in sampleSalesData" :key="sale.id">
                  <td>{{ formatDate(sale.date) }}</td>
                  <td>{{ sale.clientName }}</td>
                  <td>{{ sale.serviceName }}</td>
                  <td>{{ formatCurrency(sale.amount) }}</td>
                  <td>{{ sale.status }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </PrintPreview>
    </div>

    <!-- Example 4: Custom Handler Usage -->
    <div class="example-section">
      <h2>4. Custom Handler Usage</h2>
      <p>Using a custom handler for specific business logic</p>
      
      <div class="custom-handler-example">
        <div class="form-group">
          <label>Report Type:</label>
          <Dropdown 
            v-model="selectedReportType" 
            :options="availableReportTypes"
            option-label="label"
            option-value="value"
            placeholder="Select report type"
          />
        </div>
        
        <div class="form-group">
          <label>Date Range:</label>
          <Calendar 
            v-model="dateRange" 
            selection-mode="range" 
            :show-icon="true"
            placeholder="Select date range"
          />
        </div>
        
        <Button 
          @click="handleCustomReport"
          :disabled="!selectedReportType || !dateRange"
        >
          Generate Custom Report
        </Button>
      </div>
    </div>

    <!-- Print Preview Modal -->
    <PrintPreviewModal 
      :report-name="currentReportName"
      @hide="handleModalHide"
      @retry="handleRetry"
      @download="handleDownload"
      @print="handlePrint"
    />

    <!-- Status Messages -->
    <div v-if="statusMessages.length > 0" class="status-messages">
      <div 
        v-for="message in statusMessages" 
        :key="message.id"
        :class="['status-message', message.type]"
      >
        <i :class="getStatusIcon(message.type)"></i>
        <span>{{ message.text }}</span>
        <Button 
          icon="pi pi-times" 
          variant="ghost" 
          size="sm"
          @click="removeStatusMessage(message.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import { 
  PrintPreview, 
  PrintPreviewButton, 
  PrintPreviewModal,
  usePrintPreview,
  WORKER_TYPES,
  formatDate,
  formatCurrency,
} from '../index'
import type { TableHeader, ReportHeader } from '../types/print-preview.types'

const { t } = useI18n()

// Print preview composable
const {
  isWorkerProcessing,
  canStartPrint,
  progressPercentage,
  hasError,
  errorMessage,
  successMessage,
  startPrintPreview,
  clearMessages,
  clearError,
  clearSuccess,
} = usePrintPreview()

// State
const selectedReportType = ref<string>('')
const dateRange = ref<[Date, Date] | null>(null)
const currentReportName = ref<string>('Sales Report')
const statusMessages = ref<Array<{ id: string; type: 'success' | 'error' | 'info'; text: string }>>([])

// Sample data
const currentDate = computed(() => new Date().toLocaleDateString())
const totalSales = ref(125000)
const totalOrders = ref(45)
const averageOrder = computed(() => totalSales.value / totalOrders.value)

const sampleSalesData = ref([
  { id: 1, date: '2024-01-15', clientName: 'John Doe', serviceName: 'Haircut', amount: 25000, status: 'Completed' },
  { id: 2, date: '2024-01-16', clientName: 'Jane Smith', serviceName: 'Manicure', amount: 15000, status: 'Completed' },
  { id: 3, date: '2024-01-17', clientName: 'Bob Johnson', serviceName: 'Facial', amount: 35000, status: 'Pending' },
  { id: 4, date: '2024-01-18', clientName: 'Alice Brown', serviceName: 'Haircut', amount: 30000, status: 'Completed' },
  { id: 5, date: '2024-01-19', clientName: 'Charlie Wilson', serviceName: 'Manicure', amount: 20000, status: 'Completed' },
])

// Table headers for sales report
const salesTableHeaders = ref<TableHeader[]>([
  { key: 'date', label: 'Date', format: 'date', width: 120 },
  { key: 'clientName', label: 'Client Name', format: 'text', width: 150 },
  { key: 'serviceName', label: 'Service', format: 'text', width: 120 },
  { key: 'amount', label: 'Amount', format: 'currency', width: 100, align: 'right' },
  { key: 'status', label: 'Status', format: 'text', width: 100 },
])

// Report headers
const salesReportHeaders = ref<ReportHeader[]>([
  { title: 'Sales History Report', subtitle: 'Monthly Summary' },
])

// Request payload
const salesRequestPayload = ref({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  includeDetails: true,
})

// Additional options
const salesAdditionalOptions = ref({
  includeTotals: true,
  groupBy: 'day',
  showCharts: false,
})

// Available report types
const availableReportTypes = ref([
  { label: 'Sales History', value: WORKER_TYPES.SALES_HISTORY },
  { label: 'Product Sales', value: WORKER_TYPES.PRODUCTS },
  { label: 'Booking List', value: WORKER_TYPES.CALENDAR_BOOKING_LIST_SUMMARY },
  { label: 'Stock Status', value: WORKER_TYPES.STOCK_STATUS },
])

// Event handlers
const handleSalesStart = () => {
  addStatusMessage('info', 'Sales report generation started...')
}

const handleSalesError = (error: string) => {
  addStatusMessage('error', `Sales report error: ${error}`)
}

const handleComposablePrint = async () => {
  try {
    await startPrintPreview(
      WORKER_TYPES.SALES_HISTORY,
      salesTableHeaders.value,
      salesReportHeaders.value,
      salesRequestPayload.value,
      salesAdditionalOptions.value
    )
    addStatusMessage('success', 'Report generated successfully!')
  } catch (error) {
    addStatusMessage('error', `Failed to generate report: ${error}`)
  }
}

const handleFullComponentStart = () => {
  addStatusMessage('info', 'Full component report generation started...')
}

const handleFullComponentSuccess = () => {
  addStatusMessage('success', 'Full component report completed successfully!')
}

const handleFullComponentError = (error: string) => {
  addStatusMessage('error', `Full component error: ${error}`)
}

const handleCustomReport = async () => {
  if (!selectedReportType.value || !dateRange.value) {
    addStatusMessage('error', 'Please select report type and date range')
    return
  }

  try {
    const [startDate, endDate] = dateRange.value
    const customPayload = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reportType: selectedReportType.value,
    }

    await startPrintPreview(
      selectedReportType.value as any,
      salesTableHeaders.value,
      salesReportHeaders.value,
      customPayload,
      { custom: true }
    )
    
    addStatusMessage('success', 'Custom report generated successfully!')
  } catch (error) {
    addStatusMessage('error', `Custom report failed: ${error}`)
  }
}

const handleModalHide = () => {
  addStatusMessage('info', 'Print preview modal closed')
}

const handleRetry = () => {
  addStatusMessage('info', 'Retrying report generation...')
}

const handleDownload = (type: 'pdf' | 'excel') => {
  addStatusMessage('success', `${type.toUpperCase()} file downloaded successfully!`)
}

const handlePrint = () => {
  addStatusMessage('success', 'Print job sent to printer!')
}

// Utility functions
const addStatusMessage = (type: 'success' | 'error' | 'info', text: string) => {
  const id = Date.now().toString()
  statusMessages.value.push({ id, type, text })
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeStatusMessage(id)
  }, 5000)
}

const removeStatusMessage = (id: string) => {
  const index = statusMessages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    statusMessages.value.splice(index, 1)
  }
}

const getStatusIcon = (type: string) => {
  switch (type) {
    case 'success': return 'pi pi-check-circle'
    case 'error': return 'pi pi-exclamation-triangle'
    case 'info': return 'pi pi-info-circle'
    default: return 'pi pi-circle'
  }
}

// Cleanup on mount
onMounted(() => {
  clearMessages()
})
</script>

<style scoped lang="scss">
.print-preview-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.example-header {
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-color-secondary);
    font-size: 1.1rem;
  }
}

.example-section {
  margin-bottom: 3rem;
  padding: 2rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  background: var(--surface-card);
  
  h2 {
    color: var(--text-color);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  p {
    color: var(--text-color-secondary);
    margin-bottom: 1.5rem;
  }
}

.composable-example {
  .controls {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
    
    .progress-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .p-progressbar {
        flex: 1;
      }
    }
  }
  
  .error-message,
  .success-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: var(--border-radius);
    margin-top: 1rem;
    
    i {
      font-size: 1.1rem;
    }
  }
  
  .error-message {
    background-color: var(--red-50);
    color: var(--red-700);
    border: 1px solid var(--red-200);
  }
  
  .success-message {
    background-color: var(--green-50);
    color: var(--green-700);
    border: 1px solid var(--green-200);
  }
}

.custom-handler-example {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      font-weight: 600;
      color: var(--text-color);
    }
  }
}

.print-content {
  padding: 2rem;
  background: #fff;
  
  .print-header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #333;
    padding-bottom: 1rem;
    
    h1 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    
    p {
      margin: 0;
      color: #666;
    }
  }
  
  .print-summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: var(--border-radius);
    
    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .label {
        font-weight: 600;
        color: #666;
        margin-bottom: 0.25rem;
      }
      
      .value {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
      }
    }
  }
  
  .print-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    
    th,
    td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #333;
    }
    
    td {
      color: #666;
    }
    
    tr:hover {
      background-color: #f5f5f5;
    }
  }
}

.status-messages {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
  
  .status-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    animation: slideIn 0.3s ease-out;
    
    i {
      font-size: 1.1rem;
    }
    
    span {
      flex: 1;
      font-size: 0.875rem;
    }
    
    &.success {
      background-color: var(--green-50);
      color: var(--green-700);
      border: 1px solid var(--green-200);
    }
    
    &.error {
      background-color: var(--red-50);
      color: var(--red-700);
      border: 1px solid var(--red-200);
    }
    
    &.info {
      background-color: var(--blue-50);
      color: var(--blue-700);
      border: 1px solid var(--blue-200);
    }
  }
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .print-preview-example {
    padding: 1rem;
  }
  
  .example-section {
    padding: 1rem;
  }
  
  .print-summary {
    grid-template-columns: 1fr !important;
  }
  
  .status-messages {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
}
</style> 