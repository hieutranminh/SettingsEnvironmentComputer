<template>
  <div class="report-insights">
    <div class="report-insights-header">
      <div class="report-insights-title">
        <h3>{{ $t('report.insights') }}</h3>
      </div>

      <div class="report-insights-actions">
        <aha-button
          variant="blue"
          @click.prevent="onSearch"
        >
          <span>{{ $t('general.search') }}</span>
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
      insights: `
      ✔ Key Insight 1: The revenue increase came from
both higher client volume and a greater share of premium services.

More clients → expanded revenue base

Premium services → amplified growth impact

Months where both occurred (March and June) recorded the highest revenue.

✔ Key Insight 2: The growth constraint is

“fewer new clients + more unregistered clients.”

Especially in May–June:

Decrease in new clients

Increase in unregistered clients

→ Potential weakening of long-term retention structure`,
    }
  },
}
</script>

<style lang="scss">
@import './report-operational-trend-analysis-insights.scss';
</style>
