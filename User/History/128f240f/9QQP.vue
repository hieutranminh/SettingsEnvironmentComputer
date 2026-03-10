<template>
  <div class="section-number-of-clients">
    <!-- Header + AI Summary -->
    <div ref="headerSection">
      <h3>{{ $t('report.number-of-clients') }}</h3>
      <report-ai-summary :ai-summary="aiSummary" />
    </div>

    <div>
      <pre>{{ sectionData }}</pre>
      <!-- Chart -->

      <!-- Table -->
    </div>
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

  mounted() {
    console.log('sectionData', this.sectionData)
  },
}
</script>

<style lang="scss">
@import './section-number-of-clients.scss';
</style>
