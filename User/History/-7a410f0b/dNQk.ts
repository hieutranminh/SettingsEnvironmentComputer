// export class PrepaidCardsByClientsHandler {}
// workers/worker-handlers/sales-history.handler.ts
import { BaseHandler } from './base-handler'

import type { PrintPreviewOptions } from '../../types/print-preview.types'

import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'

export class SalesHistoryHandler extends BaseHandler {
  async process(options: PrintPreviewOptions, onProgress: (progress: number) => void): Promise<void> {
    try {
      onProgress(10)

      // 1. Fetch data từ API
      const salesData = await this.fetchSalesData(options.requestPayload)
      onProgress(30)

      // 2. Transform data cho table
      const tableData = this.transformToTableData(salesData)
      onProgress(50)

      // 3. Generate PDF
      this.pdfBlobUrl = await this.generatePdf(options, tableData)
      onProgress(75)

      // 4. Generate Excel
      this.excelBlob = await this.generateExcel(options, tableData)
      onProgress(100)
    } catch (error) {
      throw new Error(`Sales History processing failed: ${error.message}`)
    }
  }

  private async fetchSalesData(payload: any) {
    // Gọi API để lấy data
    const response = await fetch('/api/sales-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Failed to fetch sales data')
    return response.json()
  }

  private transformToTableData(salesData: any[]) {
    // Transform raw data thành format phù hợp cho table
    return salesData.map((sale) => ({
      date: new Date(sale.createdAt).toLocaleDateString('vi-VN'),
      invoiceNo: sale.invoiceNumber,
      customer: sale.customerName,
      items: sale.items.map((item) => item.name).join(', '),
      quantity: sale.items.reduce((sum, item) => sum + item.quantity, 0),
      total: this.formatCurrency(sale.totalAmount),
      status: this.getStatusText(sale.status),
      paymentMethod: sale.paymentMethod,
    }))
  }

  protected async generatePdf(options: PrintPreviewOptions, data: any[]): Promise<string> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // 1. Add header
    this.addPdfHeader(doc, options)

    // 2. Add table với jsPDF AutoTable
    const tableColumns = [
      { header: 'Ngày', dataKey: 'date' },
      { header: 'Số HĐ', dataKey: 'invoiceNo' },
      { header: 'Khách hàng', dataKey: 'customer' },
      { header: 'Sản phẩm', dataKey: 'items' },
      { header: 'SL', dataKey: 'quantity' },
      { header: 'Tổng tiền', dataKey: 'total' },
      { header: 'Trạng thái', dataKey: 'status' },
      { header: 'Thanh toán', dataKey: 'paymentMethod' },
    ]

    ;(doc as any).autoTable({
      head: [tableColumns.map((col) => col.header)],
      body: data.map((row) => tableColumns.map((col) => row[col.dataKey])),
      startY: 40,
      theme: 'grid',
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Ngày
        1: { cellWidth: 25 }, // Số HĐ
        2: { cellWidth: 40 }, // Khách hàng
        3: { cellWidth: 50 }, // Sản phẩm
        4: { cellWidth: 15, halign: 'center' }, // SL
        5: { cellWidth: 30, halign: 'right' }, // Tổng tiền
        6: { cellWidth: 25 }, // Trạng thái
        7: { cellWidth: 30 }, // Thanh toán
      },
      // Callback để add footer cho mỗi page
      didDrawPage: (data) => {
        this.addPdfFooter(doc, data.pageNumber)
      },
    })

    // 3. Add summary section
    this.addSummarySection(doc, data)

    // Convert to blob URL
    const pdfBlob = doc.output('blob')
    return URL.createObjectURL(pdfBlob)
  }

  protected async generateExcel(options: PrintPreviewOptions, data: any[]): Promise<Blob> {
    // 1. Create workbook
    const wb = XLSX.utils.book_new()

    // 2. Create main sheet với data
    const mainData = [
      // Header rows
      [options.reportName || 'BÁO CÁO LỊCH SỬ BÁN HÀNG'],
      [`Từ ngày: ${options.dateFrom || ''} - Đến ngày: ${options.dateTo || ''}`],
      [], // Empty row
      // Table headers
      ['Ngày', 'Số HĐ', 'Khách hàng', 'Sản phẩm', 'SL', 'Tổng tiền', 'Trạng thái', 'Thanh toán'],
      // Data rows
      ...data.map((row) => [
        row.date,
        row.invoiceNo,
        row.customer,
        row.items,
        row.quantity,
        row.total,
        row.status,
        row.paymentMethod,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(mainData)

    // 3. Style the sheet
    this.styleExcelSheet(ws, data.length)

    // 4. Add summary sheet
    const summaryData = this.createSummaryData(data)
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)

    // 5. Add sheets to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết')
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng hợp')

    // 6. Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  // ... các method helper khác
}

// workers/worker-handlers/base-handler.ts
import type { PrintPreviewOptions } from '../../types/print-preview.types'

export abstract class BaseHandler {
  protected pdfBlobUrl: string | null = null
  protected excelBlob: Blob | null = null

  abstract process(options: PrintPreviewOptions, onProgress: (progress: number) => void): Promise<void>

  getResults() {
    return {
      pdfBlobUrl: this.pdfBlobUrl,
      excelBlob: this.excelBlob,
    }
  }

  protected async generatePdf(data: any[]): Promise<string> {
    // PDF generation logic
    return ''
  }

  protected async generateExcel(data: any[]): Promise<Blob> {
    // Excel generation logic
    return new Blob()
  }
}
