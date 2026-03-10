// eslint-disable-next-line import/no-unresolved
import { jsPDF } from 'jspdf'
// eslint-disable-next-line import/no-unresolved
import 'jspdf-autotable'
// eslint-disable-next-line import/no-unresolved
import * as XLSX from 'xlsx'

import type { PrintPreviewOptions } from '../../types/print-preview.types'

import type { ProcessResult } from './base-handler'
import { formatCurrency, getStatusText } from './base-handler'

// Types
interface SalesData {
  createdAt: string
  invoiceNumber: string
  customerName: string
  items: Array<{ name: string; quantity: number }>
  totalAmount: number
  status: string
  paymentMethod: string
}

interface TableRow {
  date: string
  invoiceNo: string
  customer: string
  items: string
  quantity: number
  total: string
  status: string
  paymentMethod: string
}

// Data fetching
const fetchSalesData = async (payload: unknown): Promise<SalesData[]> => {
  const response = await fetch('/api/sales-history', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Failed to fetch sales data')
  return response.json()
}

// Data transformation
const transformToTableData = (salesData: SalesData[]): TableRow[] => {
  return salesData.map((sale) => ({
    date: new Date(sale.createdAt).toLocaleDateString('vi-VN'),
    invoiceNo: sale.invoiceNumber,
    customer: sale.customerName,
    items: sale.items.map((item) => item.name).join(', '),
    quantity: sale.items.reduce((sum, item) => sum + item.quantity, 0),
    total: formatCurrency(sale.totalAmount),
    status: getStatusText(sale.status),
    paymentMethod: sale.paymentMethod,
  }))
}

// PDF Generation
const addPdfHeader = (doc: jsPDF, options: PrintPreviewOptions): void => {
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(options.reportName || 'BÁO CÁO LỊCH SỬ BÁN HÀNG', 20, 20)

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Từ ngày: ${options.dateFrom || ''} - Đến ngày: ${options.dateTo || ''}`, 20, 30)
}

const addPdfFooter = (doc: jsPDF, pageNumber: number): void => {
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(10)
  doc.text(`Trang ${pageNumber}`, 20, pageHeight - 10)
  doc.text(`In ngày: ${new Date().toLocaleDateString('vi-VN')}`, 200, pageHeight - 10)
}

const addSummarySection = (doc: jsPDF, data: TableRow[]): void => {
  const totalQuantity = data.reduce((sum, row) => sum + row.quantity, 0)
  const totalRecords = data.length

  const finalY = (doc as any).lastAutoTable?.finalY || 100

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('TỔNG HỢP:', 20, finalY + 20)

  doc.setFont('helvetica', 'normal')
  doc.text(`Tổng số bản ghi: ${totalRecords}`, 20, finalY + 30)
  doc.text(`Tổng số lượng: ${totalQuantity}`, 20, finalY + 40)
}

const generatePdf = async (options: PrintPreviewOptions, data: TableRow[]): Promise<string> => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  // Add header
  addPdfHeader(doc, options)

  // Add table
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
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 40 },
      3: { cellWidth: 50 },
      4: { cellWidth: 15, halign: 'center' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 25 },
      7: { cellWidth: 30 },
    },
    didDrawPage: (pageData: any) => {
      addPdfFooter(doc, pageData.pageNumber)
    },
  })

  // Add summary
  addSummarySection(doc, data)

  const pdfBlob = doc.output('blob')
  return URL.createObjectURL(pdfBlob)
}

// Excel Generation
const styleExcelSheet = (ws: XLSX.WorkSheet, dataLength: number): void => {
  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, // Ngày
    { wch: 15 }, // Số HĐ
    { wch: 25 }, // Khách hàng
    { wch: 40 }, // Sản phẩm
    { wch: 8 }, // SL
    { wch: 15 }, // Tổng tiền
    { wch: 15 }, // Trạng thái
    { wch: 20 }, // Thanh toán
  ]

  // Style header row (row 4)
  const headerRow = 4
  for (let col = 0; col < 8; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: headerRow - 1, c: col })
    if (!ws[cellRef]) ws[cellRef] = { v: '' }
    ws[cellRef].s = {
      fill: { fgColor: { rgb: 'CCE5FF' } },
      font: { bold: true },
      alignment: { horizontal: 'center' },
    }
  }
}

const createSummaryData = (data: TableRow[]): any[][] => {
  const totalQuantity = data.reduce((sum, row) => sum + row.quantity, 0)
  const totalRecords = data.length

  return [
    ['TỔNG HỢP BÁO CÁO'],
    [],
    ['Tổng số bản ghi:', totalRecords],
    ['Tổng số lượng:', totalQuantity],
    ['Ngày tạo báo cáo:', new Date().toLocaleDateString('vi-VN')],
  ]
}

const generateExcel = async (options: PrintPreviewOptions, data: TableRow[]): Promise<Blob> => {
  const wb = XLSX.utils.book_new()

  // Main sheet
  const mainData = [
    [options.reportName || 'BÁO CÁO LỊCH SỬ BÁN HÀNG'],
    [`Từ ngày: ${options.dateFrom || ''} - Đến ngày: ${options.dateTo || ''}`],
    [],
    ['Ngày', 'Số HĐ', 'Khách hàng', 'Sản phẩm', 'SL', 'Tổng tiền', 'Trạng thái', 'Thanh toán'],
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
  styleExcelSheet(ws, data.length)

  // Summary sheet
  const summaryData = createSummaryData(data)
  const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)

  // Add sheets
  XLSX.utils.book_append_sheet(wb, ws, 'Chi tiết')
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng hợp')

  // Generate file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

// Main handler function
export const processSalesHistory = async (
  options: PrintPreviewOptions,
  onProgress: (progress: number) => void,
): Promise<ProcessResult> => {
  try {
    onProgress(10)

    // Fetch data
    const salesData = await fetchSalesData(options.requestPayload)
    onProgress(30)

    // Transform data
    const tableData = transformToTableData(salesData)
    onProgress(50)

    // Generate PDF
    const pdfBlobUrl = await generatePdf(options, tableData)
    onProgress(75)

    // Generate Excel
    const excelBlob = await generateExcel(options, tableData)
    onProgress(100)

    return {
      pdfBlobUrl,
      excelBlob,
    }
  } catch (error) {
    throw new Error(`Sales History processing failed: ${error.message}`)
  }
}
