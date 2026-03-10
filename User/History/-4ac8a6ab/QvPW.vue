<template>
  <div class="section-booking">
    <h3>{{ $t('report.booking') }}</h3>

    <report-ai-summary :ai-summary="[]" />
  </div>
</template>

<script>
import ReportAiSummary from 'Modules/reports/report-ai-summary/report-ai-summary.vue'

export default {
  components: {
    ReportAiSummary,
  },

  props: {
  },
}
</script>

<style lang="scss">
@import './section-booking.scss';
</style>
