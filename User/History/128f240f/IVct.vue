<template>
  <div class="section-number-of-clients">
    <h1>Number of Clients</h1>

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
      default: null,
    },
  },

  watch: {
    sectionData: {
      immediate: true,
      handler(value) {
        console.log('[SectionNumberOfClients] sectionData:', value)
      },
    },
    aiSummary: {
      immediate: true,
      handler(value) {
        console.log('[SectionNumberOfClients] aiSummary:', value)
      },
    },
  },
}
</script>

<style lang="scss">
@import './section-number-of-clients.scss';
</style>
