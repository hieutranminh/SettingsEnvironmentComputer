import type { PrintPreviewOptions } from '@/types/print-preview.types'
import { generateReportExcel } from '@/workers/core/excel-generator'
import { generateReportPdf } from '@/workers/core/pdf-generator'
import { formatCurrency, formatDate, getStatusText } from '@/workers/utils/common-utils'

import type { ProcessResult } from './base-handler'
interface BranchSalesData {
  createdAt: string
  invoiceNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number }>
  totalAmount: number
  status: string
  paymentMethod: string
}

interface BranchSalesTableRow {
  date: string
  invoiceNo: string
  customer: string
  items: string
  quantity: number
  total: string
  status: string
  paymentMethod: string
}

const fetchBranchSalesData = async (payload: unknown): Promise<BranchSalesData[]> => {
  const response = await fetch('/api/sales-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Failed to fetch sales data')
  return response.json()
}

const transformBranchSalesData = (salesData: BranchSalesData[]): BranchSalesTableRow[] => {
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

const getBranchSalesSummary = (data: BranchSalesTableRow[]) => [
  { label: 'Tổng số bản ghi', value: data.length },
  { label: 'Tổng số lượng', value: data.reduce((sum, row) => sum + row.quantity, 0) },
]

export const processBranchSales = async (
  options: PrintPreviewOptions,
  onProgress: (progress: number) => void,
): Promise<ProcessResult> => {
  try {
    onProgress(10)

    const salesData = await fetchBranchSalesData(options.requestPayload)
    onProgress(30)

    const tableData = transformBranchSalesData(salesData)
    onProgress(50)

    const summaryData = getBranchSalesSummary(tableData)

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

    const pdfBlob = await generateReportPdf(options, tableData, pdfConfig)
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

    return { pdfBlob, excelBlob }
  } catch (error) {
    throw new Error(`Branch Sales processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
