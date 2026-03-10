<template>
  <div class="simple-example">
    <h2>Print Preview - Ví Dụ Đơn Giản</h2>
    
    <!-- Cách 1: Sử dụng Button Component -->
    <div class="example-section">
      <h3>Cách 1: PrintPreviewButton</h3>
      <PrintPreviewButton
        :worker-type="WORKER_TYPES.SALES_HISTORY"
        :table-headers="tableHeaders"
        :report-headers="reportHeaders"
        :request-payload="requestPayload"
        button-text="Tạo Báo Cáo Doanh Thu"
        variant="primary"
        @start="handleStart"
        @error="handleError"
      />
    </div>

    <!-- Cách 2: Sử dụng Composable -->
    <div class="example-section">
      <h3>Cách 2: usePrintPreview Composable</h3>
      <Button 
        :loading="isWorkerProcessing" 
        :disabled="!canStartPrint"
        @click="handleComposablePrint"
      >
        {{ isWorkerProcessing ? 'Đang tạo...' : 'Tạo Báo Cáo (Composable)' }}
      </Button>
      
      <div v-if="isWorkerProcessing" class="progress">
        <ProgressBar :value="progressPercentage" :show-value="true" />
      </div>
      
      <div v-if="hasError" class="error">
        <i class="pi pi-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success">
        <i class="pi pi-check-circle"></i>
        {{ successMessage }}
      </div>
    </div>

    <!-- Cách 3: Sử dụng Full Component -->
    <div class="example-section">
      <h3>Cách 3: PrintPreview Component</h3>
      <PrintPreview
        :worker-type="WORKER_TYPES.SALES_HISTORY"
        :table-headers="tableHeaders"
        :report-headers="reportHeaders"
        :request-payload="requestPayload"
        :report-name="'Báo Cáo Doanh Thu'"
        @start="handleFullStart"
        @success="handleFullSuccess"
        @error="handleFullError"
        @download="handleDownload"
      >
        <template #print-content>
          <div class="print-content">
            <h1>Báo Cáo Doanh Thu</h1>
            <p>Ngày tạo: {{ new Date().toLocaleDateString('vi-VN') }}</p>
            
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Khách Hàng</th>
                  <th>Dịch Vụ</th>
                  <th>Số Tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in sampleData" :key="item.id">
                  <td>{{ formatDate(item.date) }}</td>
                  <td>{{ item.clientName }}</td>
                  <td>{{ item.serviceName }}</td>
                  <td>{{ formatCurrency(item.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </PrintPreview>
    </div>

    <!-- Print Preview Modal -->
    <PrintPreviewModal 
      :report-name="'Báo Cáo Doanh Thu'"
      @hide="handleModalHide"
      @retry="handleRetry"
      @download="handleDownload"
      @print="handlePrint"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
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

// Print preview composable
const {
  isWorkerProcessing,
  canStartPrint,
  progressPercentage,
  hasError,
  errorMessage,
  successMessage,
  startPrintPreview,
} = usePrintPreview()

// Sample data
const sampleData = ref([
  { id: 1, date: '2024-01-15', clientName: 'Nguyễn Văn A', serviceName: 'Cắt Tóc', amount: 50000 },
  { id: 2, date: '2024-01-16', clientName: 'Trần Thị B', serviceName: 'Nhuộm Tóc', amount: 150000 },
  { id: 3, date: '2024-01-17', clientName: 'Lê Văn C', serviceName: 'Massage', amount: 200000 },
])

// Table headers
const tableHeaders = ref<TableHeader[]>([
  { key: 'date', label: 'Ngày', format: 'date', width: 120 },
  { key: 'clientName', label: 'Tên Khách Hàng', format: 'text', width: 150 },
  { key: 'serviceName', label: 'Dịch Vụ', format: 'text', width: 120 },
  { key: 'amount', label: 'Số Tiền', format: 'currency', width: 100, align: 'right' },
])

// Report headers
const reportHeaders = ref<ReportHeader[]>([
  { title: 'Báo Cáo Doanh Thu', subtitle: 'Tháng 1/2024' },
])

// Request payload
const requestPayload = ref({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
  includeDetails: true,
})

// Event handlers
const handleStart = () => {
  console.log('✅ Bắt đầu tạo báo cáo (Button)')
}

const handleError = (error: string) => {
  console.error('❌ Lỗi (Button):', error)
}

const handleComposablePrint = async () => {
  try {
    await startPrintPreview(
      WORKER_TYPES.SALES_HISTORY,
      tableHeaders.value,
      reportHeaders.value,
      requestPayload.value
    )
    console.log('✅ Báo cáo tạo thành công (Composable)')
  } catch (error) {
    console.error('❌ Lỗi (Composable):', error)
  }
}

const handleFullStart = () => {
  console.log('✅ Bắt đầu tạo báo cáo (Full Component)')
}

const handleFullSuccess = () => {
  console.log('✅ Báo cáo tạo thành công (Full Component)')
}

const handleFullError = (error: string) => {
  console.error('❌ Lỗi (Full Component):', error)
}

const handleModalHide = () => {
  console.log('📋 Modal đã đóng')
}

const handleRetry = () => {
  console.log('🔄 Thử lại tạo báo cáo')
}

const handleDownload = (type: 'pdf' | 'excel') => {
  console.log(`📥 Đã tải xuống file ${type.toUpperCase()}`)
}

const handlePrint = () => {
  console.log('🖨️ Đã gửi lệnh in')
}
</script>

<style scoped lang="scss">
.simple-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  
  h2 {
    color: var(--primary-color);
    text-align: center;
    margin-bottom: 2rem;
  }
}

.example-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--surface-border);
  border-radius: var(--border-radius);
  background: var(--surface-card);
  
  h3 {
    color: var(--text-color);
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
  
  .progress {
    margin-top: 1rem;
  }
  
  .error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: var(--red-50);
    color: var(--red-700);
    border: 1px solid var(--red-200);
    border-radius: var(--border-radius);
  }
  
  .success {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background-color: var(--green-50);
    color: var(--green-700);
    border: 1px solid var(--green-200);
    border-radius: var(--border-radius);
  }
}

.print-content {
  padding: 2rem;
  background: #fff;
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 1rem;
  }
  
  p {
    text-align: center;
    color: #666;
    margin-bottom: 2rem;
  }
  
  .data-table {
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
  }
}
</style> 