<template>
  <div class="overall-revenue-chart-right">
    <div class="display-item">
      <label>{{ $t('report.display-item') }}</label>
      <b-form-select
        v-model="selectedDisplayItem"
        :options="displayItemOptions"
        class="display-item__select"
        @input="onDisplayItemChange"
      />
    </div>

    <div
      class="chart-container"
    >
      <template v-if="hasChartData">
        <chart-line
          :key="chartKey"
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
import { guid } from 'CommonHelpers'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'

// Display item types for overall revenue
const DISPLAY_ITEM_TYPES = {
  REVENUE_TOTAL:         'revenueTotal',
  SERVICE:               'servicesAmountTotal',
  PRODUCT:               'productsAmountTotal',
  NO_OF_CLIENTS:         'numberOfClients',
  AMOUNT_PER_SALE:       'amountPerSale',
  PREPAID_CARD_SALES:    'prepaidCardAmountTotal',
  PREPAID_SERVICE_SALES: 'prepaidServicesAmountTotal',
  PREPAID_GOODS_TOTAL:   'prepaidGoodsSalesTotal',
}

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
  },

  data() {
    return {
      selectedDisplayItem: DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE,
      chartKey:            '',
    }
  },

  computed: {
    displayItemOptions() {
      return [
        { value: DISPLAY_ITEM_TYPES.REVENUE_TOTAL, text: this.$t('report.revenue-total'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.REVENUE_TOTAL },
        { value: DISPLAY_ITEM_TYPES.SERVICE, text: this.$t('report.service'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.SERVICE },
        { value: DISPLAY_ITEM_TYPES.PRODUCT, text: this.$t('report.product'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PRODUCT },
        { value: DISPLAY_ITEM_TYPES.NO_OF_CLIENTS, text: this.$t('report.no-of-clients'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.NO_OF_CLIENTS },
        { value: DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE, text: this.$t('report.amount-per-sale'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE },
        { value: DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES, text: this.$t('report.prepaid-card-sales'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_CARD_SALES },
        { value: DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES, text: this.$t('report.prepaid-service-sales'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_SERVICE_SALES },
        { value: DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL, text: this.$t('report.prepaid-goods-sales-total'), disabled: this.disabledDisplayItem === DISPLAY_ITEM_TYPES.PREPAID_GOODS_TOTAL },
      ]
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => this.formatYearMonth(item.yearMonth))
    },

    chartDataValues() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => item[this.selectedDisplayItem] || 0)
    },

    selectedDisplayItemLabel() {
      const option = this.displayItemOptions.find(opt => opt.value === this.selectedDisplayItem)
      return option?.text || ''
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
    sectionData: {
      immediate: true,
      handler() {
        this.chartKey = guid()
      },
    },
    disabledDisplayItem(newValue) {
      // If currently selected item becomes disabled, switch to default
      if (newValue === this.selectedDisplayItem) {
        this.selectedDisplayItem = DISPLAY_ITEM_TYPES.AMOUNT_PER_SALE
        this.$emit('display-item-change', this.selectedDisplayItem)
      }
    },
  },

  methods: {
    formatYearMonth(yearMonth) {
      if (!yearMonth || yearMonth.length !== 6) {
        return yearMonth
      }
      const year = yearMonth.substring(2, 4)
      const month = yearMonth.substring(4, 6)
      return `${month}-${year}`
    },

    onDisplayItemChange() {
      this.chartKey = guid()
      this.$emit('display-item-change', this.selectedDisplayItem)
    },
  },
}
</script>

<style lang="scss" scoped>
.overall-revenue-chart-right {
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

    &__select {
      max-width: 200px;
    }
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    position: relative;
    flex: 1;
    min-height: 300px;
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
