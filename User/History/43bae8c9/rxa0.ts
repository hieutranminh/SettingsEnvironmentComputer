/**
 * HTML parsing utilities for print generation
 *
 * Example usage:
 *   const result = parseHtmlToRichText('<b>Bold</b> text')
 *   // Returns: { isRichText: true, richText: [...] }
 */

import type ExcelJS from 'exceljs'
import { SUPPORTED_HTML_TAGS } from '../constants'

/**
 * Text formatting state for Excel rich text
 */
export interface TextFormatState {
  isBold: boolean
  isItalic: boolean
}

/**
 * Result of HTML to Excel conversion
 */
export interface HtmlToExcelResult {
  isRichText: boolean
  plainText?: string
  richText?: ExcelJS.RichText[]
}

/**
 * Creates a regex pattern for matching HTML tags
 * @returns RegExp for HTML tag matching
 */
const createHtmlTagRegex = (): RegExp => {
  return /<(\/?)(b|i|strong|em)>/gi
}

/**
 * Strips all HTML tags from a string
 * @param htmlString - String containing HTML tags
 * @returns Plain text without HTML tags
 *
 * Example:
 *   stripHtmlTags('<b>Bold</b> text') // Returns: 'Bold text'
 */
export const stripHtmlTags = (htmlString: string): string => {
  return htmlString.replace(/<[^>]*>/g, '')
}

/**
 * Checks if a string contains HTML tags
 * @param text - Text to check
 * @returns True if HTML tags are present
 */
export const hasHtmlTags = (text: string): boolean => {
  return /<[^>]*>/.test(text)
}

/**
 * Creates a rich text part with current formatting
 * @param text - Text content to format
 * @param formatState - Current formatting state
 * @returns ExcelJS RichText object with applied formatting
 *
 * Example:
 *   createRichTextPart('Bold Text', { isBold: true, isItalic: false })
 *   // Returns: { text: 'Bold Text', font: { bold: true, italic: false } }
 */
export const createRichTextPart = (text: string, formatState: TextFormatState): ExcelJS.RichText => ({
  text,
  font: {
    bold: formatState.isBold,
    italic: formatState.isItalic,
  },
})

/**
 * Updates formatting state based on HTML tag
 * @param tagName - HTML tag name (b, strong, i, em)
 * @param isClosing - Whether this is a closing tag
 * @param currentState - Current formatting state
 * @returns Updated formatting state
 *
 * Example:
 *   updateFormatting('b', false, { isBold: false, isItalic: false })
 *   // Returns: { isBold: true, isItalic: false }
 */
export const updateFormatting = (
  tagName: string,
  isClosing: boolean,
  currentState: TextFormatState,
): TextFormatState => {
  const { isBold, isItalic } = currentState
  const normalizedTag = tagName.toLowerCase()

  if (SUPPORTED_HTML_TAGS.BOLD.includes(normalizedTag as 'b' | 'strong')) {
    return { isBold: !isClosing, isItalic }
  }

  if (SUPPORTED_HTML_TAGS.ITALIC.includes(normalizedTag as 'i' | 'em')) {
    return { isBold, isItalic: !isClosing }
  }

  return currentState
}

/**
 * Adds text content to rich text parts array if text exists
 * @param text - Text content to add
 * @param formatState - Current formatting state
 * @param richTextParts - Array to add text parts to
 */
const addTextIfExists = (text: string, formatState: TextFormatState, richTextParts: ExcelJS.RichText[]): void => {
  if (text) {
    richTextParts.push(createRichTextPart(text, formatState))
  }
}

/**
 * Parses HTML string to Excel rich text format
 * Supports <b>, <strong>, <i>, <em> tags
 * @param htmlString - HTML string to parse
 * @returns Object containing either rich text array or plain text
 *
 * Example:
 *   parseHtmlToRichText('Hello <b>World</b>!')
 *   // Returns: { isRichText: true, richText: [...] }
 */
export const parseHtmlToRichText = (htmlString: string): HtmlToExcelResult => {
  // Return plain text if no HTML tags found
  if (!hasHtmlTags(htmlString)) {
    return { isRichText: false, plainText: htmlString }
  }

  const richTextParts: ExcelJS.RichText[] = []
  const htmlTagRegex = createHtmlTagRegex()
  let lastIndex = 0
  let formatState: TextFormatState = { isBold: false, isItalic: false }

  // Process each HTML tag match
  let match: RegExpExecArray | null
  while ((match = htmlTagRegex.exec(htmlString)) !== null) {
    // Add text content before current tag
    const textBefore = htmlString.slice(lastIndex, match.index)
    addTextIfExists(textBefore, formatState, richTextParts)

    // Update formatting state based on current tag
    const [, closingFlag, tagName] = match
    const isClosing = closingFlag === '/'
    formatState = updateFormatting(tagName, isClosing, formatState)

    lastIndex = match.index + match[0].length
  }

  // Add remaining text after last tag
  const remainingText = htmlString.slice(lastIndex)
  addTextIfExists(remainingText, formatState, richTextParts)

  // Return plain text if no rich text parts were created
  if (richTextParts.length === 0) {
    return {
      isRichText: false,
      plainText: stripHtmlTags(htmlString),
    }
  }

  return { isRichText: true, richText: richTextParts }
}

/**
 * Splits text by bold tags for PDF rendering
 * @param text - Text containing <b> tags
 * @returns Array of text parts with bold indicators
 *
 * Example:
 *   splitByBoldTags('Normal <b>Bold</b> text')
 *   // Returns: [
 *   //   { text: 'Normal ', isBold: false },
 *   //   { text: 'Bold', isBold: true },
 *   //   { text: ' text', isBold: false }
 *   // ]
 */
export const splitByBoldTags = (text: string): Array<{ text: string; isBold: boolean }> => {
  const parts = text.split(/(<b>.*?<\/b>)/g)

  return parts
    .filter((part) => part.trim())
    .map((part) => {
      if (part.startsWith('<b>') && part.endsWith('</b>')) {
        return {
          text: part.replace(/<\/?b>/g, ''),
          isBold: true,
        }
      }
      return { text: part, isBold: false }
    })
}
