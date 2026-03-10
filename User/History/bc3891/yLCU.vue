<template>
  <div class="section-revenue-by-staff">
    <h3>{{ $t('report.revenue-by-staff') }}</h3>

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
@import './section-revenue-by-staff.scss';
</style>
