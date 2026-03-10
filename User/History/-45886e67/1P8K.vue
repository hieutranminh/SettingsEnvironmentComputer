<template>
  <div class="number-of-clients-chart">
    <div
      ref="displayItem"
      class="display-item"
    >
      <label>{{ $t('report.display-item') }}</label>
      <multiselect
        ref="multiselect"
        v-model="selectedItems"
        :options="multiselectOptions"
        :multiple="true"
        :searchable="false"
        :close-on-select="false"
        :clear-on-select="false"
        :show-labels="false"
        :preserve-search="true"
        :placeholder="$t('report.display-item')"
        label="text"
        track-by="value"
        class="multi-checkbox display-item__select"
        @mouseleave.native="onMouseleave"
      >
        <template
          slot="selection"
          slot-scope="{ values }"
        >
          <span
            v-if="values.length === displayItemOptions.length"
            class="selected"
          >
            {{ $t('general.all') }}
          </span>
          <span
            v-else-if="values.length > 0"
            class="selected"
          >
            {{ values.length }} {{ $t('general.items') }} {{ $t('general.selected') }}
          </span>
        </template>
      </multiselect>
    </div>

    <div class="chart-container">
      <template v-if="hasChartData">
        <chart-line
          :data="chartData"
          :is_decimal="false"
          class="chart-line"
        />
        <chart-legend
          :chart_data="chartData"
          class="chart-legend mt-2"
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
import { formatYearMonthLabel } from 'Utils/format-data.js'
import multiselect from 'vue-multiselect'
import ChartLine from 'CommonComponents/chart/chart-line.vue'
import ChartLegend from 'CommonComponents/chart/chart-legend.vue'

// Display item configuration with getValue function for each item
const DISPLAY_ITEMS = [
  {
    value:    'numberOfNewClients',
    i18nKey:  'report-client-by-period.new',
    color:    '#1976D2',
    getValue: (d) => d.numberOfNewClients || 0,
  },
  {
    value:    'numberOfRevisitClients',
    i18nKey:  'report-client-by-period.revisit',
    color:    '#FF9800',
    getValue: (d) => d.numberOfRevisitClients || 0,
  },
  {
    value:    'newPlusRevisit',
    i18nKey:  'report.new-plus-revisit',
    color:    '#4CAF50',
    getValue: (d) => (d.numberOfNewClients || 0) + (d.numberOfRevisitClients || 0),
  },
  {
    value:    'numberOfUnregisteredClients',
    i18nKey:  'report.unregistered',
    color:    '#9C27B0',
    getValue: (d) => d.numberOfUnregisteredClients || 0,
  },
  {
    value:    'totalClients',
    i18nKey:  'general.total',
    color:    '#F44336',
    getValue: (d) => d.totalClients || 0,
  },
]

export default {
  components: {
    multiselect,
    ChartLine,
    ChartLegend,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
  },

  data() {
    return {
      selectedItems: [],
    }
  },

  computed: {
    displayItemOptions() {
      return DISPLAY_ITEMS.map(item => ({
        value:    item.value,
        text:     this.$t(item.i18nKey),
        color:    item.color,
        getValue: item.getValue,
      }))
    },

    multiselectOptions() {
      return [
        { text: this.$t('report.display-item'), $isDisabled: true },
        ...this.displayItemOptions,
      ]
    },

    selectedDisplayItems() {
      return this.selectedItems.map(item => item.value)
    },

    chartLabels() {
      if (!this.sectionData?.data) {
        return []
      }
      return this.sectionData.data.map(item => formatYearMonthLabel(item.yearMonth))
    },

    hasChartData() {
      return this.chartLabels.length > 0 && this.selectedItems.length > 0
    },

    chartData() {
      const datasets = this.selectedItems.map(item => ({
        label: item.text,
        data:  this.getDatasetValues(item),
        color: item.color,
      }))

      return {
        labels:   this.chartLabels,
        datasets: datasets,
      }
    },
  },

  created() {
    // Initialize with all items selected
    this.selectedItems = [...this.displayItemOptions]
  },

  methods: {
    getDatasetValues(item) {
      if (!this.sectionData?.data) return []
      return this.sectionData.data.map(item.getValue)
    },

    onMouseleave() {
      if (this.$refs.multiselect?.isOpen) {
        this.$refs.multiselect.toggle()
      }
    },
  },
}
</script>

<style lang="scss">
.number-of-clients-chart {
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
      min-height: auto;
      width: 180px;

      .multiselect__select:before {
        border-width: 8px 4.5px 0;
        border-color: rgba(0, 0, 0, 0.6) transparent transparent;
      }

      .multiselect__tags {
        margin-top: 0;
        border: 1px solid $gray;
        border-radius: 0;

        .selected {
          color: $gray-dark;
        }
      }

      .multiselect__content {
        .multiselect__element {
          &:first-child {
            .multiselect__option.multiselect__option--disabled {
              background: transparent !important;
              cursor: default;

              span:before {
                display: none;
              }
            }
          }
        }
      }
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
