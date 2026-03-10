<template>
  <div class="report-insights">
    <div class="report-insights-header">
      <div class="report-insights-title">
        <h3>{{ $t('report.insights') }}</h3>
      </div>

      <div class="report-insights-actions">
        <aha-button
          variant="blue"
          @click.prevent="onGenerateInsights"
        >
          <span>{{ $t('general.generate') }}</span>
        </aha-button>
      </div>
    </div>

    <div class="report-insights-body">
      <pre>{{ insights }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      insights: `✔ Key Insight 1: The revenue increase came from
both higher client volume and a greater share of premium services.
More clients → expanded revenue base
Premium services → amplified growth impact
Months where both occurred (March and June) recorded the highest revenue.
`,
    }
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis-insights.scss';
</style>
