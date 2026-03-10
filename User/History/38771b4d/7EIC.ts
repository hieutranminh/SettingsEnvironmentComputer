import { printService } from '@/services/printService'
import { usePrintStore } from '@/stores/print/print'
import type { PrintData, PrintConfiguration, PrintActions } from '@/types/print'

export const usePrint = (): PrintActions => {
  const printStore = usePrintStore()

  const openPrintPreview = (data: PrintData) => {
    // Ensure default landscape orientation unless explicitly overridden
    const printDataWithDefaults = {
      ...data,
      enablePagination: data.enablePagination ?? true,
      rowsPerPage: data.rowsPerPage ?? 20,
    }

    printStore.openPrintPreview(printDataWithDefaults)
  }

  const closePrintPreview = () => {
    printStore.closePrintPreview()
  }

  const print = async (): Promise<void> => {
    if (!printStore.printData) {
      throw new Error('No print data available')
    }

    try {
      printStore.setProcessing(true)
      const blob = await printService.generatePDF(printStore.printData, printStore.configuration)

      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        throw new Error('Unable to open print window')
      }

      const url = URL.createObjectURL(blob)
      printWindow.document.write(`
        <html>
          <head>
            <title>${printStore.printData.title}</title>
          </head>
          <body>
            <embed src="${url}" type="application/pdf" width="100%" height="100%" />
          </body>
        </html>
      `)
      printWindow.document.close()

      // Wait for PDF to load then print
      printWindow.onload = () => {
        printWindow.print()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Print error:', error)
      throw error
    } finally {
      printStore.setProcessing(false)
    }
  }

  const downloadPDF = async (): Promise<void> => {
    if (!printStore.printData) {
      throw new Error('No print data available')
    }

    try {
      printStore.setProcessing(true)
      const blob = await printService.generatePDF(printStore.printData, printStore.configuration)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${printStore.printData.title}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF download error:', error)
      throw error
    } finally {
      printStore.setProcessing(false)
    }
  }

  const downloadExcel = async (): Promise<void> => {
    if (!printStore.printData) {
      throw new Error('No print data available')
    }

    try {
      printStore.setProcessing(true)
      const blob = await printService.generateExcel(printStore.printData)

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${printStore.printData.title}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Excel download error:', error)
      throw error
    } finally {
      printStore.setProcessing(false)
    }
  }

  const setPage = (page: number) => {
    printStore.setPage(page)
  }

  const setConfiguration = (config: Partial<PrintConfiguration>) => {
    printStore.setConfiguration(config)
  }

  return {
    openPrintPreview,
    closePrintPreview,
    print,
    downloadPDF,
    downloadExcel,
    setPage,
    setConfiguration,
  }
}
