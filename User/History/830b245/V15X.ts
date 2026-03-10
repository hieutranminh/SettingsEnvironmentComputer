import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx'
import type { PrintData, PrintConfiguration, TableColumn } from '@/types/print'

export class PrintService {
  private static instance: PrintService

  static getInstance(): PrintService {
    if (!PrintService.instance) {
      PrintService.instance = new PrintService()
    }
    return PrintService.instance
  }

  async generatePDF(data: PrintData, config: PrintConfiguration): Promise<Blob> {
    const doc = new jsPDF({
      orientation: config.orientation,
      unit: 'mm',
      format: config.pageSize
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = config.margins

    let yPosition = margin.top

    // Add title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(data.title, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    // Add content based on print type
    switch (data.printType) {
      case 'table':
        yPosition = await this.drawTable(doc, data, config, yPosition)
        break
      case 'chart':
        yPosition = await this.drawChart(doc, data, config, yPosition)
        break
      case 'mixed':
        yPosition = await this.drawMixedContent(doc, data, config, yPosition)
        break
      case 'content':
        yPosition = await this.drawCustomContent(doc, data, config, yPosition)
        break
    }

    // Add footer with page numbers
    this.addFooter(doc, config)

    return doc.output('blob')
  }

  private async drawTable(
    doc: jsPDF,
    data: PrintData,
    config: PrintConfiguration,
    startY: number
  ): Promise<number> {
    if (!data.printData || !data.columns) {
      return startY
    }

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = config.margins
    const availableWidth = pageWidth - margin.left - margin.right
    let yPosition = startY

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(data.columns, availableWidth)

    // Draw table header
    yPosition = this.drawTableHeader(doc, data.columns, columnWidths, margin.left, yPosition)

    // Draw table rows
    const rowsPerPage = data.rowsPerPage || 20
    const startIndex = (data.enablePagination ? (data.currentPage - 1) * rowsPerPage : 0)
    const endIndex = data.enablePagination 
      ? Math.min(startIndex + rowsPerPage, data.printData.length)
      : data.printData.length

    for (let i = startIndex; i < endIndex; i++) {
      const row = data.printData[i]
      yPosition = this.drawTableRow(doc, row, data.columns, columnWidths, margin.left, yPosition)

      // Check if we need a page break
      if (yPosition > doc.internal.pageSize.getHeight() - margin.bottom - 30) {
        doc.addPage()
        yPosition = margin.top
        // Redraw header on new page
        yPosition = this.drawTableHeader(doc, data.columns, columnWidths, margin.left, yPosition)
      }
    }

    return yPosition
  }

  private calculateColumnWidths(columns: TableColumn[], availableWidth: number): number[] {
    const totalWidth = columns.reduce((sum, col) => sum + (col.width || 1), 0)
    return columns.map(col => {
      const ratio = (col.width || 1) / totalWidth
      return availableWidth * ratio
    })
  }

  private drawTableHeader(
    doc: jsPDF,
    columns: TableColumn[],
    columnWidths: number[],
    startX: number,
    startY: number
  ): number {
    let xPosition = startX
    const yPosition = startY

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(240, 240, 240)

    columns.forEach((column, index) => {
      const width = columnWidths[index]
      
      // Draw header cell background
      doc.rect(xPosition, yPosition - 5, width, 10, 'F')
      
      // Draw header text
      doc.text(column.header, xPosition + width / 2, yPosition, {
        align: column.align || 'center'
      })
      
      xPosition += width
    })

    // Draw header border
    doc.setDrawColor(200, 200, 200)
    doc.rect(startX, yPosition - 5, xPosition - startX, 10)

    return yPosition + 15
  }

  private drawTableRow(
    doc: jsPDF,
    row: any,
    columns: TableColumn[],
    columnWidths: number[],
    startX: number,
    startY: number
  ): number {
    let xPosition = startX
    const yPosition = startY

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    columns.forEach((column, index) => {
      const width = columnWidths[index]
      const value = row[column.field] || ''
      
      doc.text(String(value), xPosition + width / 2, yPosition, {
        align: column.align || 'center'
      })
      
      xPosition += width
    })

    // Draw row border
    doc.setDrawColor(200, 200, 200)
    doc.line(startX, yPosition + 2, xPosition, yPosition + 2)

    return yPosition + 8
  }

  private async drawChart(
    doc: jsPDF,
    data: PrintData,
    config: PrintConfiguration,
    startY: number
  ): Promise<number> {
    if (!data.sectionRef) {
      return startY
    }

    try {
      const canvas = await html2canvas(data.sectionRef, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      const imgData = canvas.toDataURL('image/png')
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = config.margins
      const availableWidth = pageWidth - margin.left - margin.right

      // Calculate image dimensions to fit within page
      const imgWidth = availableWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      doc.addImage(imgData, 'PNG', margin.left, startY, imgWidth, imgHeight)

      return startY + imgHeight + 10
    } catch (error) {
      console.error('Error rendering chart:', error)
      return startY
    }
  }

  private async drawMixedContent(
    doc: jsPDF,
    data: PrintData,
    config: PrintConfiguration,
    startY: number
  ): Promise<number> {
    if (!data.printSections) {
      return startY
    }

    let yPosition = startY

    for (const section of data.printSections) {
      switch (section.type) {
        case 'chart':
          if (section.element) {
            yPosition = await this.drawChart(doc, { ...data, sectionRef: section.element }, config, yPosition)
          }
          break
        case 'table':
          if (section.data && section.columns) {
            yPosition = await this.drawTable(doc, { ...data, printData: section.data, columns: section.columns }, config, yPosition)
          }
          break
        case 'content':
          if (section.content) {
            yPosition = await this.drawCustomContent(doc, { ...data, content: section.content }, config, yPosition)
          }
          break
      }

      // Add spacing between sections
      yPosition += 10
    }

    return yPosition
  }

  private async drawCustomContent(
    doc: jsPDF,
    data: PrintData,
    config: PrintConfiguration,
    startY: number
  ): Promise<number> {
    if (!data.content) {
      return startY
    }

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = config.margins
    const availableWidth = pageWidth - margin.left - margin.right

    try {
      const canvas = await html2canvas(data.content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: availableWidth
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = availableWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      doc.addImage(imgData, 'PNG', margin.left, startY, imgWidth, imgHeight)

      return startY + imgHeight + 10
    } catch (error) {
      console.error('Error rendering custom content:', error)
      return startY
    }
  }

  private addFooter(doc: jsPDF, config: PrintConfiguration): void {
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = config.margins

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(
      `Page ${doc.getCurrentPageInfo().pageNumber}`,
      pageWidth / 2,
      pageHeight - margin.bottom / 2,
      { align: 'center' }
    )
  }

  async generateExcel(data: PrintData): Promise<Blob> {
    if (!data.printData || !data.columns) {
      throw new Error('No data or columns provided for Excel generation')
    }

    const worksheet = XLSX.utils.json_to_sheet(data.printData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, data.title)

    return XLSX.write(workbook, { bookType: 'xlsx', type: 'blob' })
  }

  async generateCSV(data: PrintData): Promise<Blob> {
    if (!data.printData || !data.columns) {
      throw new Error('No data or columns provided for CSV generation')
    }

    const headers = data.columns.map(col => col.header).join(',')
    const rows = data.printData.map(row => 
      data.columns!.map(col => row[col.field] || '').join(',')
    ).join('\n')
    
    const csvContent = `${headers}\n${rows}`
    return new Blob([csvContent], { type: 'text/csv' })
  }
}

export const printService = PrintService.getInstance() 