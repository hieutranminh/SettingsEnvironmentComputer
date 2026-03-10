<template>
  <div class="overall-revenue-chart">
    <div class="display-item">
      <label>{{ $t('report.display-item') }}</label>
      <b-form-select
        v-model="selectedDisplayItem"
        :options="displayItemOptions"
        class="display-item__select"
        @input="onDisplayItemChange"
      />
    </div>

    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-line
          :data="chartData"
          :is_decimal="true"
          class="chart-line"
        />
        <chart-legend
          :chart_data="chartData"
          class="chart-legend"
        />
      </template>

      <div
        v-else
        class="chart-no-data"
      >
        {{ $t('report.no_data_for_chart') }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatYearMonthShort } from 'Utils/format-data.js'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'

// Display item configuration
const DISPLAY_ITEMS = [
  { value: 'revenueTotal',              i18nKey: 'report.revenue-total' },
  { value: 'servicesAmountTotal',       i18nKey: 'report.service' },
  { value: 'productsAmountTotal',       i18nKey: 'report.product' },
  { value: 'numberOfClients',           i18nKey: 'report.no-of-clients' },
  { value: 'amountPerSale',             i18nKey: 'report.amount-per-sale' },
  { value: 'prepaidCardAmountTotal',    i18nKey: 'report.prepaid-card-sales' },
  { value: 'prepaidServicesAmountTotal', i18nKey: 'report.prepaid-service-sales' },
  { value: 'prepaidGoodsSalesTotal',    i18nKey: 'report.prepaid-goods-sales-total' },
]

const DEFAULT_DISPLAY_ITEM = 'revenueTotal'

export default {
  components: {
    ChartLine,
    ChartLegend,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
    disabledDisplayItem: {
      type:    String,
      default: null,
    },
    defaultDisplayItem: {
      type:    String,
      default: DEFAULT_DISPLAY_ITEM,
    },
  },

  data() {
    return {
      selectedDisplayItem: this.defaultDisplayItem,
    }
  },

  computed: {
    // Map display item values to i18n keys — independent of disabledDisplayItem
    displayItemLabelMap() {
      return {
        [DISPLAY_ITEM_TYPES.REVENUE_TOTAL]:         this.$t('report.revenue-total'),
        [DISPLAY_ITEM_TYPES.SERVICE]:               this.$t('report.service'),
        [DISPLAY_ITEM_TYPES.PRODUCT]:               this.$t('report.product'),
        [DISPLAY_ITEM_TYPES.NO_OF_CLIENTS]:         this.$t('report.no-of-clients'),
        [DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE]:       this.$t('report.amount-per-sale'),
        [DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES]:    this.$t('report.prepaid-card-sales'),
        [DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES]: this.$t('report.prepaid-service-sales'),
        [DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL]:   this.$t('report.prepaid-goods-sales-total'),
      }
    },

    displayItemOptions() {
      return [
        { value: DISPLAY_ITEM_TYPES.REVENUE_TOTAL, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.REVENUE_TOTAL], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.REVENUE_TOTAL },
        { value: DISPLAY_ITEM_TYPES.SERVICE, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.SERVICE], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.SERVICE },
        { value: DISPLAY_ITEM_TYPES.PRODUCT, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.PRODUCT], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PRODUCT },
        { value: DISPLAY_ITEM_TYPES.NO_OF_CLIENTS, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.NO_OF_CLIENTS], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.NO_OF_CLIENTS },
        { value: DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE },
        { value: DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES },
        { value: DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES },
        { value: DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL, text: this.displayItemLabelMap[DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL], disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL },
      ]
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthShort(item.yearMonth))
    },

    chartDataValues() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => item[this.selectedDisplayItem] || 0)
    },

    // Get labels from the map — dependent only on selectedDisplayItem, not on disabledDisplayItem
    selectedDisplayItemLabel() {
      return this.displayItemLabelMap[this.selectedDisplayItem] || ''
    },

    hasChartData() {
      return this.chartDataValues.length > 0
    },

    chartData() {
      return {
        labels:   this.chartLabels,
        datasets: [
          {
            label: this.selectedDisplayItemLabel,
            data:  this.chartDataValues,
            color: '#1976D2',
          },
        ],
      }
    },
  },

  watch: {
    disabledDisplayItem(newValue) {
      // If currently selected item becomes disabled, switch to default
      if (newValue === this.selectedDisplayItem) {
        this.selectedDisplayItem = this.defaultDisplayItem
        this.$emit('display-item-change', this.selectedDisplayItem)
      }
    },
  },

  mounted() {
    // Emit initial display item on mount
    this.$emit('display-item-change', this.selectedDisplayItem)
  },

  methods: {
    onDisplayItemChange() {
      this.$emit('display-item-change', this.selectedDisplayItem)
    },
  },
}
</script>

<style lang="scss" scoped>
.overall-revenue-chart {
  flex: 1;
  min-width: 0;
  border: 1px solid $gray;
  padding: 10px;
  display: flex;
  flex-direction: column;

  .display-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;

    label {
      margin: 0;
      white-space: nowrap;
    }

    &__select {
      max-width: 200px;
    }
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
    min-height: 330px;
  }

  .chart-no-data {
    margin-top: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chart-line {
    max-height: 300px;
  }
}
</style>
