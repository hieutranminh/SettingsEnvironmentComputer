import type { PrintPreviewOptions } from '@/types/print-preview.types'
import { generateReportPdf } from '@/workers/core/pdf-generator'

interface BranchSalesData {
  branchName: string
  totalSales: number
  totalQuantity: number
  totalAmount: number
  totalDiscount: number
  totalTax: number
  totalNet: number
}

const fetchBranchSalesData = async (): Promise<BranchSalesData[]> => {
  try {
    // Generate fake data for testing
    const fakeData: BranchSalesData[] = [
      {
        branchName: 'Branch A',
        totalSales: 150,
        totalQuantity: 450,
        totalAmount: 15000000,
        totalDiscount: 750000,
        totalTax: 1500000,
        totalNet: 15750000,
      },
      {
        branchName: 'Branch B',
        totalSales: 200,
        totalQuantity: 600,
        totalAmount: 20000000,
        totalDiscount: 1000000,
        totalTax: 2000000,
        totalNet: 21000000,
      },
      {
        branchName: 'Branch C',
        totalSales: 175,
        totalQuantity: 525,
        totalAmount: 17500000,
        totalDiscount: 875000,
        totalTax: 1750000,
        totalNet: 18375000,
      },
    ]
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In real implementation, this would be an API call
    return fakeData
  } catch (error) {
    throw new Error(`Failed to fetch branch sales data: ${error}`)
  }
}

const transformBranchSalesData = (salesData: BranchSalesData[]): BranchSalesData[] => {
  return salesData.map((sale) => ({
    branchName: `${sale.branchName}customize`,
    totalSales: sale.totalSales,
    totalQuantity: sale.totalQuantity,
    totalAmount: sale.totalAmount,
    totalDiscount: sale.totalDiscount,
    totalTax: sale.totalTax,
    totalNet: sale.totalNet,
  }))
}

export const processBranchSales = async (
  options: PrintPreviewOptions,
  onProgress: (progress: number) => void,
): Promise<{ pdfBlob: Blob; excelBlob: Blob }> => {
  try {
    onProgress(10)

    const salesData = await fetchBranchSalesData()
    onProgress(30)

    const tableData = transformBranchSalesData(salesData)
    onProgress(50)

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
    }

    const pdfBlob = await generateReportPdf(options, tableData, pdfConfig)

    const excelBlob = new Blob()
    onProgress(100)

    return { pdfBlob, excelBlob }
  } catch (error) {
    throw new Error(`Branch Sales processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
