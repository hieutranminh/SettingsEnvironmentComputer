import type { PrintPreviewOptions } from '@/types/print-preview.types'
import { generateReportExcel } from '@/workers/core/excel-generator'
import { generateReportPdf } from '@/workers/core/pdf-generator'

import type { ProcessResult } from './base-handler'
interface BranchSalesData {
  branchName: string
  totalSales: number
  totalQuantity: number
  totalAmount: number
  totalDiscount: number
  totalTax: number
  totalNet: number
}

interface BranchSalesTableRow {
  branchName: string
  totalSales: number
  totalQuantity: number
  totalAmount: number
  totalDiscount: number
  totalTax: number
  totalNet: number
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
    branchName: sale.branchName,
    totalSales: sale.totalSales,
    totalQuantity: sale.totalQuantity,
    totalAmount: sale.totalAmount,
    totalDiscount: sale.totalDiscount,
    totalTax: sale.totalTax,
    totalNet: sale.totalNet,
  }))
}

const getBranchSalesSummary = (data: BranchSalesTableRow[]) => [
  { label: 'Tổng số bản ghi', value: data.length },
  { label: 'Tổng số lượng', value: data.reduce((sum, row) => sum + row.totalQuantity, 0) },
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
        { header: 'Chi nhánh', dataKey: 'branchName', width: 25 },
        { header: 'Tổng doanh số', dataKey: 'totalSales', width: 25 },
        { header: 'Tổng số lượng', dataKey: 'totalQuantity', width: 25 },
        { header: 'Tổng tiền', dataKey: 'totalAmount', width: 25 },
        { header: 'Tổng chiết khấu', dataKey: 'totalDiscount', width: 25 },
        { header: 'Tổng thuế', dataKey: 'totalTax', width: 25 },
        { header: 'Tổng cộng', dataKey: 'totalNet', width: 25 },
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
