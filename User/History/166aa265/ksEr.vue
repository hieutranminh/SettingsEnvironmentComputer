<template>
  <main class="app-content">
    <section class="content report-recommended-clients-by-month-page">
      <report-has-chart-wrapper
        :report-name="report_name"
        @print-report="onClickPrintReport"
      >
        <template #default="scope">
          <div class="filter-wrapper">
            <div class="row">
              <div class="col-12 col-sm-10 filter">
                <input-month-range @input="onInputMonthRange" />
              </div>
              <div class="col-12 col-sm-2">
                <div class="filter-search">
                  <aha-button
                    variant="blue"
                    class="btn-search"
                    @click.prevent="onSearch"
                  >
                    <i class="btn-search-white" /> <span>{{ $t('general.search') }}</span>
                  </aha-button>
                </div>
              </div>
            </div>
          </div>

          <div class="row main-content-wrapper">
            <div class="col-12 col-lg-6">
              <div
                ref="report_chart_ref"
                class="chart-wrapper"
              >
                <template v-if="hasChartData">
                  <chart-legend
                    :chart_data="chartData"
                    :chart_type="chart_view"
                  />
                  <chart-line
                    :data="chartData"
                    class="chart-line"
                    @chart-progressing="scope.chartProgressing"
                    @chart-updated="scope.chartUpdated"
                  />
                </template>
                <template v-else>
                  <div class="chart-no-data">
                    {{ no_data_for_chart }}
                  </div>
                </template>
              </div>
            </div>
            <div class="col-12 col-lg-6">
              <div class="table-wrapper">
                <view-table
                  ref="report_table_ref"
                  :data="tableData"
                />
              </div>
            </div>
          </div>
        </template>
      </report-has-chart-wrapper>
    </section>

    <report-print-preview-modal
      :print_sections="print_sections"
      :header_text="report_header_text"
      :modal_id="report_print_preview_modal_id"
      use_export_excel_default
    />
  </main>
</template>

<script>
import {
  formatDateLocalized,
  formatMoney,
  parseDateTSToMomentByCustomTimezone,
} from 'CommonHelpers'
import cloneDeep from 'lodash/cloneDeep'
import { options } from 'OptionsHelpers'
import ReportApi from 'API/sales/report-api'
import print_options from 'Options/print-options'
import { common_options } from 'Options/common-options'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ReportHasChartWrapper from '../report-has-chart-wrapper/report-has-chart-wrapper.vue'
import InputMonthRange from 'CommonComponents/form/input/input-month-range/input-month-range.vue'
import ReportPrintPreviewModal from 'CommonComponents/report-print-preview-modal/report-print-preview-modal.vue'

const DEFAULT_TABLE_FIELDS = [
  {field: 'month', label: 'general.month', width: '15%', sortable: false },
  {field: 'formattedRecommendedClients', label: 'report-recommended-clients-by-month.recommended-clients', width: '40%', sortable: false },
  {field: 'formattedNewClients', label: 'report-recommended-clients-by-month.new-clients', width: '30%', sortable: false },
  {field: 'ratio', label: 'general.ratio', width: '15%', sortable: false },
]

const DEFAULT_TABLE_PAGINATION = {
  total_pages: 1,
}

const DEFAULT_TABLE_OPTIONS = {
  pagination: false,
}

export default {
  components: {
    ViewTable,
    ChartLine,
    ChartLegend,
    InputMonthRange,
    ReportHasChartWrapper,
    ReportPrintPreviewModal,
  },
  extends: ComponentBase,
  data(){
    return {
      options,
      common_options,

      report_api: new ReportApi(),

      reportItems: [],

      table_filter: {
        from_date_ts: 0,
        to_date_ts:   0,
        shop_id:      0,
      },

      chart_view: options.chart_type.line,

      print_filter: {
        to_date_ts:   0,
        from_date_ts: 0,
      },
      report_print_preview_modal_id: 'report-print-preview-modal',
    }
  },
  computed: {
    text_total(){ return this.$t('general.total') },
    hasChartData(){ return this.tableDataRows?.length },
    text_average(){ return this.$i18n.t('report.average') },
    no_input_text(){ return this.$i18n.t('report.no-input') },
    text_sex(){ return this.$t('report-clients-by-type.sex') },
    no_data_for_chart(){ return this.$t('report.no_data_for_chart') },
    text_client_group(){ return this.$t('report-clients-by-type.client-group') },
    text_client_rating(){ return this.$t('report-clients-by-type.client-rating') },
    text_display(){ return this.$t('report-recommended-clients-by-month.recommended-clients') },
    error_date_range_can_not_exceed_1_year(){ return this.$i18n.t('report.error_date_range_can_not_exceed_1_year') },
    end_date_can_not_before_start_date(){ return this.$i18n.t('input-date-range.end-date-can-not-before-start-date') },

    date_filter_print_text() {
      return `( ${formatDateLocalized(this.print_filter.from_date_ts, this.app_language)} - ${formatDateLocalized(this.print_filter.to_date_ts, this.app_language)} )`
    },

    report_name() {
      return this.$t('report-recommended-clients-by-month.recommended-clients-by-month')
    },

    report_header_text() {
      return [
        this.report_name,
        this.date_filter_print_text,
      ]
    },

    excel_table_headers() {
      return this.tableData.fields.map(table_column => this.$t(table_column.label))
    },

    excel_table_rows() {
      const dataRows = this.tableDataRows ?? []

      return dataRows.map(row => {
        const row_data = []
        row_data.push(row.month)
        row_data.push(row.formattedRecommendedClients)
        row_data.push(row.formattedNewClients)
        row_data.push(row.ratio)
        return row_data
      })
    },

    print_sections() {
      // eslint-disable-next-line init-declarations
      let print_table_ref
      if (this.$refs.report_table_ref) {
        const vgt_table_wrapper_dom = this.$refs.report_table_ref.$el
        const vgt_responsive_table_wrapper_dom = vgt_table_wrapper_dom.getElementsByClassName('vgt-responsive')[0]
        const table_dom = vgt_responsive_table_wrapper_dom.getElementsByTagName('table')[0]

        print_table_ref = table_dom
      }

      return [
        {
          ref_type:    print_options.print_ref_type.canvas,
          section_ref: this.$refs.report_chart_ref,
        }, {
          ref_type:            print_options.print_ref_type.table,
          section_ref:         print_table_ref,
          section_excel_table: {
            headers: this.excel_table_headers,
            rows:    this.excel_table_rows,
          },
        },
      ]
    },

    tableData() {
      return {
        rows:       this.tableDataRows,
        fields:     DEFAULT_TABLE_FIELDS,
        options:    DEFAULT_TABLE_OPTIONS,
        pagination: DEFAULT_TABLE_PAGINATION,
      }
    },

    tableDataRows() {
      const tableDataItems = this.reportItems || []

      const { totalNewClients, totalRecommendedClients, tableDataFilterItems } = tableDataItems.reduce((dataPrevious ,tableDataItem) => {
        const itemFilter = {
          ...tableDataItem,

          newClients:                  tableDataItem?.new_clients ?? 0,
          ratio:                       `${formatMoney(tableDataItem?.ratio ?? 0, 1)}%`,
          recommendedClients:          tableDataItem?.recommended_clients ?? 0,
          formattedNewClients:         formatMoney(tableDataItem?.new_clients ?? 0, 0),
          formattedRecommendedClients: formatMoney(tableDataItem?.recommended_clients ?? 0, 0),
        }

        dataPrevious.tableDataFilterItems.push(itemFilter)
        dataPrevious.totalNewClients += Number(tableDataItem?.new_clients) || 0
        dataPrevious.totalRecommendedClients += Number(tableDataItem?.recommended_clients) || 0

        return dataPrevious
      }, {
        totalNewClients:         0,
        tableDataFilterItems:    [],
        totalRecommendedClients: 0,
      })

      // Add item total
      if(tableDataFilterItems?.length) {
        let ratioTotalItem = 0
        if(totalNewClients > 0){
          ratioTotalItem = totalRecommendedClients / totalNewClients * 100
        }

        const itemTotalObject = {
          month:                       this.text_total,
          newClients:                  totalNewClients,
          ratio:                       `${formatMoney(ratioTotalItem, 1)}%`,
          recommendedClients:          totalRecommendedClients,
          formattedNewClients:         formatMoney(totalNewClients, 0),
          formattedRecommendedClients: formatMoney(totalRecommendedClients, 0),
        }

        tableDataFilterItems.push(itemTotalObject)
      }

      return tableDataFilterItems
    },

    chartData() {
      // other labels & datasets
      const labels = []
      const datasetDisplay = {
        data:  [],
        color: 'green',
        label: this.text_display,
      }

      // average label
      const datasetAverage = {
        data:  [],
        color: 'orange',
        label: this.text_average,

        // view point
        pointRadius:      0,
        pointHoverRadius: 0,
        datalabels:       {
          display: false,
        },
      }

      const dataTableItemsWithoutTotalItem = this.tableDataRows.slice(0, -1) ?? []

      const totalNumberDisplay = dataTableItemsWithoutTotalItem.reduce((total, item) => total + (Number(item?.recommendedClients) || 0), 0)
      const totalNumberDisplayAverage = totalNumberDisplay / dataTableItemsWithoutTotalItem?.length
      datasetAverage.label += ` (${formatMoney(totalNumberDisplayAverage, 0)})`

      // set data to labels & datasets
      dataTableItemsWithoutTotalItem.forEach(itemData => {
        labels.push(itemData?.month ?? '')
        datasetDisplay.data.push(itemData?.recommendedClients ?? 0)
        datasetAverage.data.push(totalNumberDisplayAverage)
      })

      return {
        labels,
        datasets: [datasetDisplay, datasetAverage],
      }
    },
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableDataAsync()
  },
  methods: {
    formatMoney,

    // filter
    onInputMonthRange(month_range){
      this.table_filter.from_date_ts = month_range.from_date_ts
      this.table_filter.to_date_ts = month_range.to_date_end_ts
    },

    // table
    async loadTableDataAsync(){
      let errors = []
      let tmp_to_date_limit_ts = parseDateTSToMomentByCustomTimezone({ inputDateTS: this.table_filter.from_date_ts, customTimezone: -12 }).add(1, 'year').unix()

      if(this.table_filter.from_date_ts > this.table_filter.to_date_ts){
        errors.push(this.end_date_can_not_before_start_date)
      }
      if(this.table_filter.to_date_ts > tmp_to_date_limit_ts){
        errors.push(this.error_date_range_can_not_exceed_1_year)
      }
      if(errors.length > 0){
        this.showAlert(errors)
        return
      }

      this.preLoader()
      let response = await this.report_api.getRecommendedClientsByMonthAsync(this.table_filter)
      this.preLoader(false)
      if(response.is_ok){
        // table
        this.reportItems = response.data

        // chart
        this.chart_view = this.table_filter.chart_type

        // print
        this.setPrintFilterData()
      }
      else{
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // print
    onClickPrintReport() {
      this.showDialogById(this.report_print_preview_modal_id)
    },
    setPrintFilterData() {
      this.print_filter = cloneDeep(this.table_filter)
    },
  },
}
</script>

<style lang="scss">
@import './report-recommended-clients-by-month.scss';
</style>
