<template>
  <Card>
    <template #content>
      <div ref="chartRef">
        <template v-if="data.length">
          <Chart
            :type="chartDisplayType"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartDisplayType === CHART_DISPLAY_TYPE.BAR ? [ChartDataLabels] : []"
            :height="480"
          />
        </template>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { ref, computed } from 'vue'

// Composables
import { useI18n } from 'vue-i18n'
</script>

<style scoped lang="scss"></style>
