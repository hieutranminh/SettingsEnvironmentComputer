<template>
  <div class="overall-revenue-chart">
    <div
      v-show="!hideDisplayItem"
      ref="displayItem"
      class="display-item"
    >
      <label>{{ $t('report.display-item') }}</label>
      <b-form-select
        v-model="selectedDisplayItem"
        :options="displayItemOptions"
        class="display-item__select"
        @input="onDisplayItemChange"
      />
    </div>

    <chart-line
      :data="chartData"
      :is_decimal="true"
      class="chart-line"
    />
    <chart-legend
      :chart_data="chartData"
      class="chart-legend mt-2"
    />
  </div>
</template>

<script>
import { formatYearMonthLabel } from 'Utils/format-data.js'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'

// Display item configuration
const DISPLAY_ITEMS = [
  { value: 'revenueTotal', i18nKey: 'report.revenue-total' },
  { value: 'servicesAmountTotal', i18nKey: 'report.service' },
  { value: 'productsAmountTotal', i18nKey: 'report.product' },
  { value: 'numberOfClients', i18nKey: 'report.no-of-clients' },
  { value: 'amountPerSale', i18nKey: 'report.amount-per-sale' },
  { value: 'prepaidCardAmountTotal', i18nKey: 'report.prepaid-card-sales' },
  { value: 'prepaidServicesAmountTotal', i18nKey: 'report.prepaid-service-sales' },
  { value: 'prepaidGoodsSalesTotal', i18nKey: 'report.prepaid-goods-sales-total' },
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
    hideDisplayItem: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedDisplayItem: this.defaultDisplayItem,
    }
  },

  computed: {
    // Map display item values to i18n labels — independent of disabledDisplayItem
    displayItemLabelMap() {
      const map = {}
      DISPLAY_ITEMS.forEach(item => {
        map[item.value] = this.$t(item.i18nKey)
      })
      return map
    },

    displayItemOptions() {
      return DISPLAY_ITEMS.map(item => ({
        value:    item.value,
        text:     this.displayItemLabelMap[item.value],
        disabled: this.disabledDisplayItem === item.value,
      }))
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
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
