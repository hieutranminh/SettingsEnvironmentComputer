<template>
  <div class="report-print-preview">
    <template v-if="is_loading">
      <div class="report-print-preview__loader loader">
        <b-spinner
          class="loader__item"
          variant="primary"
          label="Spinning"
        />
      </div>
    </template>

    <aha-print-preview
      v-else
      :pdf-blob-url="pdf_url"
      :is-landscape="is_landscape"
      :only-pdf="only_pdf"
      @on-click-save-as-pdf="onClickSaveAsPdf"
      @on-click-save-as-excel="onClickSaveAsExcel"
    />
  </div>
</template>

<script>
// Components
import AhaPrintPreview from 'CommonComponents/aha-print-preview/aha-print-preview.vue'

// Utils
if (!window.Promise) window.Promise = { prototype: null }
import {
  excel_cells,
  setRowStyles,
  setCellAlignment,
} from 'Utils/report-export-excel.js'
import moment from 'moment'
import { jsPDF } from 'jspdf'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import autoTable from 'jspdf-autotable'
import { isPlainObject, has } from 'lodash'
import print_options from 'Options/print-options.js'
import { common_options } from 'Options/common-options.js'
import { parseDateTSToMomentWithAddingShopSettingTimezone } from 'CommonHelpers'

const isInvalidRefType = ref_type => typeof ref_type !== 'string' || ![print_options.print_ref_type.table, print_options.print_ref_type.canvas, print_options.print_ref_type.text].includes(ref_type)
const isInvalidTextAlignment = alignment => typeof alignment !== 'string' || ![print_options.text_ref_type_alignment.left, print_options.text_ref_type_alignment.right, print_options.text_ref_type_alignment.center].includes(alignment)
const isInvalidArrayStringOrNumber = array => !Array.isArray(array) || array.some(value => typeof value !== 'string' && typeof value !== 'number')
const isInvalidExcelTableObject = excel_table => {
  if (!isPlainObject(excel_table)) {
    return true
  }

  if (!has(excel_table, 'headers') || !has(excel_table, 'rows')) {
    return true
  }

  return isInvalidArrayStringOrNumber(excel_table.headers) || !Array.isArray(excel_table.rows) || excel_table.rows.some(row => isInvalidArrayStringOrNumber(row))
}
// https://github.com/exceljs/exceljs#rich-text
const isInvalidExcelText = section_excel_text => !Array.isArray(section_excel_text) && typeof section_excel_text !== 'string'

const isInvalidPrintSection = print_section => {
  if (!isPlainObject(print_section)) {
    return true
  }

  const is_text_ref_type = print_section.ref_type === print_options.print_ref_type.text
  const is_table_ref_type = print_section.ref_type === print_options.print_ref_type.table

  const is_invalid_table_ref_type = is_table_ref_type && print_section.section_ref?.tagName !== print_options.print_ref_type.table
  const is_invalid_text_ref_type = is_text_ref_type && has(print_section, 'alignment') && isInvalidTextAlignment(print_section.alignment)

  if (!has(print_section, 'ref_type') || isInvalidRefType(print_section.ref_type) || is_invalid_table_ref_type) {
    return true
  }

  if (is_text_ref_type && (!has(print_section, 'section_excel_text') || isInvalidExcelText(print_section.section_excel_text) || is_invalid_text_ref_type)) {
    return true
  }

  if (!has(print_section, 'section_ref')) {
    return true
  }

  // Skip validation if custom Excel handler is provided
  if (is_table_ref_type && has(print_section, 'section_excel_custom_handler')) {
    return false
  }

  if (is_table_ref_type && has(print_section, 'section_excel_table')) {
    return isInvalidExcelTableObject(print_section.section_excel_table)
  }

  return false
}

const spaceSize = 10

export default {
  components: {
    AhaPrintPreview,
  },
  props: {
    print_sections: {
      /*
        print_sections: Array(PRINT_SECTION: Object)

        PRINT_SECTION: Object {
          ref_type [required]: "TABLE" | "CANVAS" | "TEXT",
          section_ref [required]: DOM Element (must be a HTML TABLE Element if ref_type is "TABLE"),
          section_excel_table [optional]: EXCEL_TABLE Object => is used when ref_type is "TABLE", to define table structure when export excel,
          section_excel_text [optional]: String | Array(EXCEL_TEXT: Object) => is used when ref_type is "TEXT", to define a text row (String) or rich text (Array(EXCEL_TEXT: Object)) row when export excel,
          alignment [optional]: 'left' | 'right' | 'center' (default) => is used when ref_type is "TEXT", to define text alignment when export excel,
          page_break_before [optional]: Boolean => is used to force a page break before this section in PDF output,
        }

        EXCEL_TABLE: Object {
          // Will be used if use_export_excel_default prop is TRUE
          headers [required]: Array(string|number) => is used to define table headers, order by index,
          rows [required]: Array(EXCEL_TABLE_ROW: Array) => is used to define table rows data,
        }

        EXCEL_TABLE_ROW: Array(string|number) // Will be used to define each row data in EXCEL_TABLE rows (each value's index in this array will be mapped with EXCEL_TABLE headers value index)

        EXCEL_TEXT: Object // Use to define rich text with styles as ExcelJS format, please take a look at: https://github.com/exceljs/exceljs#rich-text

        Example prop structure:
        [
          {
            "ref_type": "CANVAS",
            "section_ref": "HTMLDivElement"
          },
          {
            "ref_type": "TEXT",
            "section_ref": "HTMLDivElement",
            "section_excel_text": [
              {
                "text": "All "
              },
              {
                "text": "4 ",
                "font": {
                  "bold": true
                }
              },
              {
                "text": "Clients "
              },
              {
                "text": "/ "
              },
              {
                "text": "Points "
              },
              {
                "text": "Total "
              },
              {
                "text": "404,925",
                "font": {
                  "bold": true
                }
              }
            ],
            "alignment": "left"
          },
          {
            "ref_type": "TABLE",
            "section_ref": "[object HTMLTableElement]",
            "section_excel_table": {
              "headers": [
                "Client Number",
                "Client Name",
                "Remain Loyalty Points"
              ],
              "rows": [
                [
                  "1",
                  "Tai Cli 1",
                  "719,850 (Family)"
                ],
                [
                  "3",
                  "Tai Client 3",
                  "719,850 (Family)"
                ],
                [
                  "",
                  "Cli Int 0",
                  "45,000 (Family)"
                ],
                [
                  "",
                  "Cli Int 1",
                  "45,000 (Family)"
                ]
              ]
            }
          }
        ]
      */
      type:      Array,
      required:  true,
      validator: prop_data => !prop_data.some(print_section => isInvalidPrintSection(print_section)),
    },

    header_text: {
      // Array(string | number)
      type:      Array,
      default:   () => [],
      validator: prop_data => !isInvalidArrayStringOrNumber(prop_data),
    },

    only_pdf: {
      type:    Boolean,
      default: false,
    },

    use_export_excel_default: {
      type:    Boolean,
      default: false,
    },
    // when ref_type is table, add aha-ignore-print to element's attribute if you want to ignore it when printing
  },

  data() {
    return {
      doc:               null,
      pdf_url:           '',
      doc_padding:       30,
      doc_header_height: 0,
      doc_footer_height: 0,

      canvas_images: {},
      is_loading:    true,
    }
  },

  computed: {
    is_landscape() {
      const a4_page_width_portrait = 595.28 // 595.28 is the width of a4
      return this.print_sections.some(print_section => print_section.section_ref && print_section.section_ref.scrollWidth > a4_page_width_portrait)
    },

    current_date_moment() {
      // convert from local computer's datetime to shop settings datetime
      return parseDateTSToMomentWithAddingShopSettingTimezone({
        inputDateTS:       moment().unix(),
        inputDateTimezone: 0,
      }).utc()
    },

    print_date() {
      return this.current_date_moment.format(common_options.standard_date_format.ymdh)
    },

    file_name() {
      const report_name = this.header_text.length ? this.header_text[0] : this.$t('report.report')
      return `${report_name} (${this.current_date_moment.format(`${common_options.standard_date_format.ymd} ${common_options.standard_hour_format.h24_seconds}`)})`
    },

    doc_width() {
      return this.doc.internal.pageSize.width
    },

    doc_height() {
      return this.doc.internal.pageSize.height
    },

    doc_body_width() {
      return this.doc_width - this.doc_padding * 2
    },

    doc_body_height() {
      return this.doc_height - this.doc_header_height - this.doc_footer_height
    },

    maximum_excel_table_length() {
      const excel_table_length_numbers = this.print_sections.map(print_section => {
        let length = 0
        const ref_type = print_section.ref_type
        const section_excel_table = print_section.section_excel_table

        if (ref_type === print_options.print_ref_type.table && section_excel_table) {
          length = section_excel_table.headers.length
        }

        return length
      })

      return Math.max(...excel_table_length_numbers)
    },

    docBottomSpacing() {
      return this.doc_padding + spaceSize
    },
  },

  created() {
    this.initDocData()
  },

  methods: {
    async initDocData() {
      const pdf_config = {
        unit:        'pt',
        format:      'a4',
        orientation: this.is_landscape ? 'landscape' : 'portrait',
      }

      this.doc = new jsPDF(pdf_config)
      this.addHeader()
      this.addFooter(1)

      this.is_loading = true
      await this.generateReportContentAsync()
      this.is_loading = false
      this.pdf_url = this.doc.output('bloburl')
    },

    addHeader() {
      let margin_top = this.doc_padding - spaceSize
      this.header_text.forEach((text, index) => {
        let font_size = index === 0 ? 28 : 16

        // check case text length too long but printed in the portrait mode
        if (text.split('&')?.length > 2 && !this.is_landscape) {
          font_size = 24
        }

        const font_style = index === 0 ? 'bold' : 'normal'
        this.doc.setFontSize(font_size)
        this.doc.setFont('NanumGothic', font_style)
        margin_top += this.doc.getTextDimensions(text).h
        this.doc.text(text, this.doc_width / 2, margin_top, 'center')

        this.doc_header_height = margin_top
        margin_top += spaceSize // add spacing between lines
      })
      this.doc_header_height = margin_top
      margin_top += spaceSize
      this.doc.setFont('Roboto', 'italic')
      this.doc.setFontSize(13)

      this.doc.setTextColor('#9e9d9d')
      this.doc.text(this.print_date, this.doc_width - this.doc_padding, this.doc_height - this.doc_padding + spaceSize, 'right')

      this.doc_header_height += this.doc.getTextDimensions(this.print_date).h
    },

    addFooter(page_number) {
      let page_text = this.$t('general.page')
      page_text = page_text.charAt(0).toUpperCase() + page_text.slice(1)
      this.doc.setFont('NanumGothic', 'normal')
      this.doc.setFontSize(12)
      this.doc.setTextColor('#000000')
      this.doc.text(`${page_text} ${page_number}`, this.doc_width / 2, this.doc_height - this.doc_padding + spaceSize, 'center')
      this.doc_footer_height = this.doc.getTextDimensions(page_text).h
    },

    addNewPage(currentPage) {
      this.doc.addPage()
      this.addHeader()
      this.addFooter(currentPage)
    },

    async generateReportContentAsync() {
      const init_start_y_position = this.doc_header_height + spaceSize
      const auto_table_config = {
        tableWidth:   'auto',
        rowPageBreak: 'avoid',
        margin:       { top: init_start_y_position, right: this.doc_padding, left: this.doc_padding },
        theme:        'grid',
        headStyles:   {
          lineWidth: 1,
          // minCellHeight: 27,
          textColor: '#000',
          fontStyle: 'normal',
          fillColor: '#DCDFE6',
        },
        styles: {
          font:          'NanumGothic',
          fontSize:      12,
          halign:        'center',
          valign:        'middle',
          minCellHeight: 24,
        },
      }

      return new Promise(async (resolve, reject) => {
        try {
          let index = 0
          let current_page = 1
          let current_start_y_position = init_start_y_position

          for (let print_section of this.print_sections) {
            const ref_type = print_section.ref_type
            let section_ref = print_section.section_ref
            const customStyles = print_section.customStyles
            const capture_options = print_section.capture_options
            const pageBreakBefore = print_section.page_break_before === true

            const is_text_ref_type = ref_type === print_options.print_ref_type.text
            const is_table_ref_type = ref_type === print_options.print_ref_type.table
            const is_canvas_ref_type = ref_type === print_options.print_ref_type.canvas
            const isTextRefHasExcelText = !!print_section.section_excel_text
            const isBoldNumber = print_section?.isBoldNumber || false
            const isPrepaidGoodsExpiredBalance = print_section?.isPrepaidGoodsExpiredBalance || false

            if (is_table_ref_type) {
              section_ref = section_ref.cloneNode(true)
              const ignore_elements = section_ref.querySelectorAll(['[aha-ignore-print]'])
              Array.from(ignore_elements).forEach(element => element.remove())
            }

            // Force page break before this section if requested
            if (pageBreakBefore && current_start_y_position !== init_start_y_position) {
              current_page += 1
              this.addNewPage(current_page)
              current_start_y_position = init_start_y_position
            }

            const docBodyRemainAvailableSize = this.doc_body_height - this.docBottomSpacing
            if (current_start_y_position > docBodyRemainAvailableSize) {
              current_page += 1
              this.addNewPage(current_page)
              current_start_y_position = init_start_y_position
            }

            await new Promise((resolve, reject) => {
              try {
                if (current_start_y_position !== init_start_y_position) {
                  current_start_y_position += spaceSize // add spacing between contents in same doc page
                }

                if (is_table_ref_type) {
                  // draw table
                  const table_format = {
                    html:        section_ref,
                    ...auto_table_config,
                    startY:      current_start_y_position,
                    didDrawPage: ({ doc }) => {
                      const currentNumberOfPage = doc.getNumberOfPages()
                      if (currentNumberOfPage > 1 || current_page !== currentNumberOfPage) {
                        this.addHeader()
                        this.addFooter(currentNumberOfPage)
                        current_page = currentNumberOfPage
                      }
                    },

                    didParseCell: data => {
                      if (data.cell && data.cell.section === 'body') {
                        const columnIndex = data.column.index
                        if (customStyles?.length && Object.keys(customStyles?.[columnIndex])?.length) {
                          data.cell.styles = { ...data.cell.styles, ...customStyles[columnIndex] }
                        }
                      }
                    },
                  }
                  autoTable(this.doc, table_format)

                  current_start_y_position = this.doc.lastAutoTable.finalY // add 10 for margin bottom 10 in auto_table_config
                  resolve()
                } else if (is_canvas_ref_type || is_text_ref_type && !isTextRefHasExcelText) {
                  // IMPROVED SECTION: For sectioned canvas rendering
                  const html2canvasOptions = {
                    width:   section_ref.clientWidth,
                    // Fix unexpected white space on top of image
                    scrollX: 0,
                    scrollY: -window.scrollY || -window.pageYOffset,
                  }

                  // If we have capture options, use them for sectioned capture
                  if (capture_options) {
                    html2canvasOptions.height = capture_options.height
                    html2canvasOptions.y = capture_options.y

                    // Scroll to required position if needed
                    if (capture_options.scrollY !== undefined) {
                      section_ref.scrollTop = capture_options.scrollY
                    }
                  } else {
                    html2canvasOptions.height = section_ref.clientHeight
                  }

                  // draw chart and text
                  html2canvas(section_ref, html2canvasOptions).then(canvas => {

                    // Convert canvas pixel to point unit to match with doc format unit (pt = 3/4*px)
                    let canvas_width = 3 / 4 * canvas.width // unit is px
                    let canvas_height = 3 / 4 * canvas.height // unit is px

                    if (canvas_width > this.doc_body_width) {
                      canvas_width = this.doc_body_width - 20
                      canvas_height = canvas_width * canvas.height / canvas.width // scale height by canvas width
                    }

                    let start_x_position = (this.doc_width - canvas_width) / 2 // default center
                    if (is_text_ref_type && print_section.alignment === print_options.text_ref_type_alignment.left) {
                      start_x_position = this.doc_padding
                    }

                    if (is_text_ref_type && print_section.alignment === print_options.text_ref_type_alignment.right) {
                      start_x_position = this.doc_width - canvas_width - this.doc_padding
                    }
                    const is_content_over_page_body = canvas_height + current_start_y_position >= this.doc_body_height

                    if (is_content_over_page_body) {
                      canvas_height = this.doc_body_height - current_start_y_position
                      canvas_width = canvas_height * canvas.width / canvas.height
                      if (canvas_width > this.doc_body_width) canvas_width = this.doc_body_width
                      start_x_position = (this.doc_width - canvas_width) / 2
                    }

                    const startYPositionAfterAddCanvas = current_start_y_position + canvas_height
                    const docBodyRemainAvailableSize = this.doc_body_height - this.docBottomSpacing

                    if (startYPositionAfterAddCanvas > docBodyRemainAvailableSize && !this.is_landscape) {
                      current_page += 1
                      this.addNewPage(current_page)
                      current_start_y_position = init_start_y_position
                    }

                    this.doc.addImage(canvas, 'JPEG', start_x_position, current_start_y_position, canvas_width, canvas_height)
                    this.canvas_images[index] = canvas
                    // calculate next y position
                    current_start_y_position += canvas_height
                    resolve()
                  }).catch(error => reject(error))
                }
                else if (is_text_ref_type && isTextRefHasExcelText) {
                  const textParts = print_section.section_excel_text.split(/(\d{1,3}(?:,\d{3})*)/g)
                  let xPosition = this.doc_padding

                  textParts.forEach(part => {
                    if ((part.match(/^\d{1,3}(?:,\d{3})*$/) && isBoldNumber) || isPrepaidGoodsExpiredBalance) {
                      this.doc.setFont('NanumGothic', 'bold')
                    } else {
                      this.doc.setFont('NanumGothic', 'normal')
                    }

                    this.doc.setFontSize(12)
                    this.doc.text(part || '', xPosition, current_start_y_position + spaceSize, print_section?.alignment || 'left')

                    xPosition += this.doc.getTextWidth(part) + 2
                  })

                  current_start_y_position += this.doc.getTextDimensions(print_section.section_excel_text).h
                  resolve()
                }
              } catch (error) {
                reject(error)
              }
            })

            index += 1
          }

          // draw all successful
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },

    // excel
    async saveReportAsExcel() {
      // excel rows, cols start at 1
      // workbook
      const wb = new ExcelJS.Workbook()
      const ws = wb.addWorksheet(this.report_name)
      ws.properties.defaultColWidth = 25

      // worksheet title
      this.header_text.forEach((text, index) => {
        const row_title = ws.addRow([text])
        if (index === 0) {
          row_title.font = { bold: true, size: 16 }
        } else {
          row_title.font = { bold: true, size: 14 }
        }
      })

      // set print sections to excel
      this.setPrintSectionsToExcel(wb, ws)

      // Add print date at the bottom
      const output_date_row = [...new Array(this.maximum_excel_table_length - 1), this.print_date]
      const ws_row = ws.addRow(output_date_row)
      const cellAddress = `${excel_cells[output_date_row.length - 1]}${ws_row.number}`
      setCellAlignment(cellAddress, ws, 'right')
      ws.getCell(cellAddress).font = { italic: true, color: { argb: 'FF808080' } }

      // Save
      const buf = await wb.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `${this.file_name}.xlsx`)
    },

    setChartSectionToExcel(wb, ws, canvas, row_add_canvas) {
      const image = wb.addImage({
        base64:    canvas.toDataURL('image/png'),
        extension: 'png',
      })

      let canvasWidth = this.maximum_excel_table_length * (ws.properties.defaultColWidth * 7) // convert to px
      let canvasHeight = canvasWidth * canvas.height / canvas.width

      ws.getRow(row_add_canvas).height = 3 / 4 * canvasHeight
      ws.addImage(image, {
        tl:  { col: 0, row: row_add_canvas - 1 }, // col, row: start at 0
        ext: {
          width:  canvasWidth,
          height: canvasHeight,
        },
      })
    },

    setTableSectionToExcel(ws, excel_table_headers = [], excel_table_rows = [], customStyles = []) {
      // Table header
      const cell_header = ws.addRow(excel_table_headers)
      cell_header.font = { bold: true, size: 12 }
      setRowStyles(ws, excel_table_headers.length, cell_header.number, true)

      // Table rows
      excel_table_rows.forEach(row => {
        const ws_row = ws.addRow(row)
        if (customStyles?.length) {
          setRowStyles(ws, excel_table_headers.length, ws_row.number, false, customStyles)
        } else {
          setRowStyles(ws, excel_table_headers.length, ws_row.number)
        }
      })
    },

    setTextSectionToExcel(ws, section_excel_text, text_align = 'center') {
      const ws_row = ws.addRow([section_excel_text])
      const tmp_cell_address = `${excel_cells[0]}${ws_row.number}`
      ws.mergeCells(`${tmp_cell_address}:${excel_cells[this.maximum_excel_table_length - 1]}${ws_row.number}`)
      ws.getCell(tmp_cell_address).alignment = {
        vertical:   'middle',
        horizontal: text_align,
      }

      if (Array.isArray(section_excel_text)) { // is richText
        ws.getCell(tmp_cell_address).value = {
          richText: section_excel_text,
        }
      }
    },

    setPrintSectionsToExcel(wb, ws) {
      let index = 0
      let row_set_canvas = this.header_text.length + 1 + 1 // after header text rows, 1 for output_date_row, 1 for spacing

      this.print_sections.forEach(print_section => {
        const ref_type = print_section.ref_type

        if (ref_type === print_options.print_ref_type.table) {
          ws.addRow() // for spacing before table

          // Custom Excel handler for complex table structures (colspan/rowspan)
          if (typeof print_section.section_excel_custom_handler === 'function') {
            print_section.section_excel_custom_handler(ws, ws.rowCount)
            ws.addRow() // for spacing after table
            // Sync row_set_canvas with actual worksheet row count after custom handler
            row_set_canvas = ws.rowCount
          } else {
            const section_excel_table = print_section.section_excel_table
            const customStyles = print_section.customStyles
            const total_table_rows = section_excel_table.headers.length + section_excel_table.rows.length
            this.setTableSectionToExcel(ws, section_excel_table.headers, section_excel_table.rows, customStyles)
            if (!section_excel_table.rows.length) {
              this.setTextSectionToExcel(ws, this.$t('general.no-data-for-table'))
            }
            row_set_canvas += total_table_rows + 1 // +1 for spacing after table
          }
        }

        if (ref_type === print_options.print_ref_type.canvas) {
          row_set_canvas += 1
          this.setChartSectionToExcel(wb, ws, this.canvas_images[index], row_set_canvas)
        }

        if (ref_type === print_options.print_ref_type.text) {
          ws.addRow() // for spacing before text
          this.setTextSectionToExcel(ws, print_section.section_excel_text, print_section.alignment)
          ws.addRow() // for spacing after text
          // Sync row_set_canvas with actual worksheet row count
          row_set_canvas = ws.rowCount
        }

        index += 1
      })
    },

    onClickSaveAsPdf() {
      this.doc.save(`${this.file_name}.pdf`)
    },

    onClickSaveAsExcel() {
      if (this.use_export_excel_default) {
        this.saveReportAsExcel()
        return
      }

      this.$emit('on-click-save-as-excel', {
        file_name:     this.file_name,
        print_date:    this.print_date,
        header_text:   this.header_text,
        canvas_images: this.canvas_images,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./report-print-preview.scss";
</style>
