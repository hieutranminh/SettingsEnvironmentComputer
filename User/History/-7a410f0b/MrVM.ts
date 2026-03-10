import type { PrintPreviewOptions } from '../../types/print-preview.types'
import { generateReportExcel } from '../core/excel-generator'
import { generateReportPdf } from '../core/pdf-generator'
import { formatCurrency, formatDate, getStatusText } from '../utils/common-utils'

import type { ProcessResult } from './base-handler'

interface SalesData {
  createdAt: string
  invoiceNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number }>
  totalAmount: number
  status: string
  paymentMethod: string
}

interface SalesTableRow {
  date: string
  invoiceNo: string
  customer: string
  items: string
  quantity: number
  total: string
  status: string
  paymentMethod: string
}

const fetchSalesData = async (payload: any): Promise<SalesData[]> => {
  const response = await fetch('/api/sales-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to fetch sales data')
  return response.json()
}

const transformSalesData = (salesData: SalesData[]): SalesTableRow[] => {
  return salesData.map((sale) => ({
    date: formatDate(sale.createdAt),
    invoiceNo: sale.invoiceNumber,
    customer: sale.customerName,
    items: sale.items.map((item) => item.name).join(', '),
    quantity: sale.items.reduce((sum, item) => sum + item.quantity, 0),
    total: formatCurrency(sale.totalAmount),
    status: getStatusText(sale.status),
    paymentMethod: sale.paymentMethod,
  }))
}

const getSalesSummary = (data: SalesTableRow[]) => [
  { label: 'Tổng số bản ghi', value: data.length },
  { label: 'Tổng số lượng', value: data.reduce((sum, row) => sum + row.quantity, 0) },
]

export const processSalesHistory = async (
  options: PrintPreviewOptions,
  onProgress: (progress: number) => void,
): Promise<ProcessResult> => {
  try {
    onProgress(10)

    const salesData = await fetchSalesData(options.requestPayload)
    onProgress(30)

    const tableData = transformSalesData(salesData)
    onProgress(50)

    const summaryData = getSalesSummary(tableData)

    // PDF Config
    const pdfConfig = {
      orientation: 'landscape' as const,
      tableColumns: [
        { header: 'Ngày', dataKey: 'date', width: 25 },
        { header: 'Số HĐ', dataKey: 'invoiceNo', width: 25 },
        { header: 'Khách hàng', dataKey: 'customer', width: 40 },
        { header: 'Sản phẩm', dataKey: 'items', width: 50 },
        { header: 'SL', dataKey: 'quantity', width: 15, align: 'center' as const },
        { header: 'Tổng tiền', dataKey: 'total', width: 30, align: 'right' as const },
        { header: 'Trạng thái', dataKey: 'status', width: 25 },
        { header: 'Thanh toán', dataKey: 'paymentMethod', width: 30 },
      ],
      summaryData,
    }

    const pdfBlobUrl = await generateReportPdf(options, tableData, pdfConfig)
    onProgress(75)

    // Excel Config
    const excelConfig = {
      columns: pdfConfig.tableColumns.map((col) => ({
        header: col.header,
        dataKey: col.dataKey,
        width: Math.floor(col.width / 3), // Convert mm to character width
      })),
      summaryData,
      mainSheetName: 'Lịch sử bán hàng',
      summarySheetName: 'Tổng hợp',
    }

    const excelBlob = await generateReportExcel(options, tableData, excelConfig)
    onProgress(100)

    return { pdfBlobUrl, excelBlob }
  } catch (error) {
    throw new Error(`Sales History processing failed: ${error.message}`)
  }
}
