/**
 * Print Helper Functions
 * Common utilities extracted from print-preview.store.ts to reduce code duplication
 */

import type ExcelJS from 'exceljs'
import { DATE_PATTERNS, HTML_TAGS, CELL_TRACKER, ALIGNMENT_OPTIONS } from '@/constants/print.constants'

// ========== Error Handling Helpers ==========

/**
 * Creates a standardized error with context
 * @param operation - The operation that failed
 * @param originalError - The original error
 * @returns Formatted error message
 */
export const createOperationError = (operation: string, originalError: unknown): Error => {
  const message = originalError instanceof Error ? originalError.message : 'Unknown error'
  return new Error(`Failed to ${operation}: ${message}`)
}

/**
 * Safe error handler for async operations
 * @param operation - Async operation to execute
 * @param errorContext - Context for error messages
 * @returns Promise result or throws formatted error
 */
export const safeAsyncOperation = async <T>(operation: () => Promise<T>, errorContext: string): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    throw createOperationError(errorContext, error)
  }
}

// ========== Cell Processing Helpers ==========

/**
 * Parses cell value and determines if it's numeric
 * @param cellText - The text content of the cell
 * @returns Object with parsed value and numeric flag
 */
export const parseCellValue = (cellText: string): { value: string | number; isNumeric: boolean } => {
  // Check if the cell text is a date
  const isDateLike = DATE_PATTERNS.some((pattern) => pattern.test(cellText.trim()))
  if (isDateLike) {
    const date = new Date(cellText.trim())
    if (!isNaN(date.getTime())) {
      return { value: cellText, isNumeric: false }
    }
  }

  // Check if the cell text is a numeric value
  const numericValue = parseFloat(cellText.replace(/[^\d.-]/g, ''))
  if (!isNaN(numericValue) && cellText.match(/^\s*[\d,.-]+\s*$/)) {
    return { value: numericValue, isNumeric: true }
  }

  return { value: cellText, isNumeric: false }
}

/**
 * Gets column alignment with fallback
 * @param columnIndex - The column index
 * @param columnAlignments - Column alignment configuration
 * @returns Alignment value
 */
export const getColumnAlignment = (
  columnIndex: number,
  columnAlignments?: { [columnIndex: number]: 'left' | 'center' | 'right' },
): 'left' | 'center' | 'right' => {
  return columnAlignments?.[columnIndex] || ALIGNMENT_OPTIONS.HORIZONTAL.CENTER
}

/**
 * Extracts cell attributes safely
 * @param cell - HTML cell element
 * @returns Cell attributes with defaults
 */
export const extractCellAttributes = (
  cell: Element,
): {
  text: string
  colspan: number
  rowspan: number
} => {
  return {
    text: cell.textContent?.trim() || '',
    colspan: parseInt(cell.getAttribute('colspan') || CELL_TRACKER.DEFAULT_COLSPAN.toString()),
    rowspan: parseInt(cell.getAttribute('rowspan') || CELL_TRACKER.DEFAULT_ROWSPAN.toString()),
  }
}

// ========== Table Processing Helpers ==========

/**
 * Calculates the maximum number of columns in a table
 * @param tableElement - The HTML table element
 * @returns Maximum column count
 */
export const getTableColumnCount = (tableElement: HTMLTableElement): number => {
  let maxColumns = 0
  const allRows = tableElement.querySelectorAll('tr')

  allRows.forEach((row) => {
    let columnCount = 0
    const cells = row.querySelectorAll('th, td')

    cells.forEach((cell) => {
      const { colspan } = extractCellAttributes(cell)
      columnCount += colspan
    })

    maxColumns = Math.max(maxColumns, columnCount)
  })

  return maxColumns
}

/**
 * Applies standard cell styling to Excel cell
 * @param cell - Excel cell object
 * @param isHeader - Whether this is a header cell
 * @param alignment - Cell alignment
 */
export const applyStandardCellStyle = (
  cell: ExcelJS.Cell,
  isHeader = false,
  alignment: 'left' | 'center' | 'right' = 'center',
): void => {
  // Apply border
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  }

  // Apply alignment
  cell.alignment = {
    horizontal: alignment,
    vertical: 'middle',
    wrapText: true,
  }

  // Apply header-specific styling
  if (isHeader) {
    cell.font = { bold: true }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDCDFE6' },
    }
  }
}

// ========== HTML/Rich Text Processing Helpers ==========

/**
 * Parses HTML string to Excel rich text format
 * @param htmlString - HTML string with formatting tags
 * @returns Rich text object or plain text
 */
export const parseHtmlToRichText = (
  htmlString: string,
): {
  isRichText: boolean
  richText?: ExcelJS.RichText[]
  plainText?: string
} => {
  // Check if string contains HTML tags
  if (!HTML_TAGS.TAG_REGEX.test(htmlString)) {
    return {
      isRichText: false,
      plainText: htmlString,
    }
  }

  const richTextParts: ExcelJS.RichText[] = []
  let lastIndex = 0
  let match
  let isBold = false
  let isItalic = false

  while ((match = HTML_TAGS.HTML_REGEX.exec(htmlString)) !== null) {
    // Add text before the tag
    if (match.index > lastIndex) {
      const textBefore = htmlString.slice(lastIndex, match.index)
      if (textBefore) {
        richTextParts.push(createRichTextPart(textBefore, isBold, isItalic))
      }
    }

    // Update formatting based on tag
    const isClosing = match[1] === '/'
    const tagName = match[2].toLowerCase()

    if (HTML_TAGS.BOLD.includes(tagName)) {
      isBold = !isClosing
    } else if (HTML_TAGS.ITALIC.includes(tagName)) {
      isItalic = !isClosing
    }

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < htmlString.length) {
    const remainingText = htmlString.slice(lastIndex)
    if (remainingText) {
      richTextParts.push(createRichTextPart(remainingText, isBold, isItalic))
    }
  }

  // If no rich text parts found, return plain text
  if (richTextParts.length === 0) {
    return {
      isRichText: false,
      plainText: htmlString.replace(HTML_TAGS.TAG_REGEX, ''), // Strip HTML tags
    }
  }

  return {
    isRichText: true,
    richText: richTextParts,
  }
}

/**
 * Creates a rich text part with formatting
 * @param text - Text content
 * @param isBold - Whether text is bold
 * @param isItalic - Whether text is italic
 * @returns Rich text part object
 */
const createRichTextPart = (text: string, isBold: boolean, isItalic: boolean): ExcelJS.RichText => {
  return {
    text,
    font: {
      bold: isBold,
      italic: isItalic,
    },
  }
}

// ========== Validation Helpers ==========

/**
 * Validates if element exists and has required properties
 * @param element - Element to validate
 * @param elementType - Expected element type for error messages
 * @returns True if valid, throws error if invalid
 */
export const validateElement = (element: unknown, elementType: string): element is Element => {
  if (!element) {
    throw new Error(`${elementType} element is null or undefined`)
  }

  if (!(element as Element).textContent !== undefined) {
    throw new Error(`${elementType} element is not a valid HTML element`)
  }

  return true
}

/**
 * Validates PDF configuration
 * @param config - PDF configuration object
 * @returns True if valid, throws error if invalid
 */
export const validatePdfConfig = (config: unknown): boolean => {
  if (!config || typeof config !== 'object') {
    throw new Error('PDF configuration is required and must be an object')
  }

  return true
}

// ========== Canvas/Image Helpers ==========

/**
 * Calculates canvas dimensions with aspect ratio preservation
 * @param originalWidth - Original canvas width
 * @param originalHeight - Original canvas height
 * @param maxWidth - Maximum allowed width
 * @param maxHeight - Maximum allowed height
 * @returns Calculated dimensions
 */
export const calculateCanvasDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } => {
  const aspectRatio = originalHeight / originalWidth
  let scaledWidth = originalWidth
  let scaledHeight = originalHeight

  // Scale down if needed
  if (originalWidth > maxWidth) {
    scaledWidth = maxWidth
    scaledHeight = scaledWidth * aspectRatio
  }

  if (scaledHeight > maxHeight) {
    scaledHeight = maxHeight
    scaledWidth = scaledHeight / aspectRatio
  }

  return { width: scaledWidth, height: scaledHeight }
}
