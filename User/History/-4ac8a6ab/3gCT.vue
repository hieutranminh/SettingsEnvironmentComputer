<template>
  <div class="section-booking">
    <h3>{{ $t('report.booking') }}</h3>

    <report-ai-summary :ai-summary="aiSummary" />
  </div>
</template>

<script>
import ReportAiSummary from 'Modules/reports/report-ai-summary/report-ai-summary.vue'

export default {
  components: {
    ReportAiSummary,
  },

  props: {
    sectionData: {
      type:    Object,
      default: null,
    },
    aiSummary: {
      type:    Array,
      default: () => [],
    },
  },
}
</script>

<style lang="scss">
@import './section-booking.scss';
</style>
