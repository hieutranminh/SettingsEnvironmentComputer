<template>
  <div class="section-revenue-by-staff">
    <h1>Revenue by Staff</h1>

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
        console.log('[SectionRevenueByStaff] sectionData:', value)
      },
    },
    aiSummary: {
      immediate: true,
      handler(value) {
        console.log('[SectionRevenueByStaff] aiSummary:', value)
      },
    },
  },
}
</script>

<style lang="scss">
@import './section-revenue-by-staff.scss';
</style>
