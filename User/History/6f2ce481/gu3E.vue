<template>
  <div class="report-insights">
    <div class="report-insights-header">
      <div class="report-insights-title">
        <div class="icon-ai" />
        <h3>{{ $t('report.insights') }}</h3>
      </div>

      <div class="report-insights-actions">
        <aha-button
          variant="blue"
          @click.prevent="onRequestAnalysis"
        >
          <span>{{ $t('general.request-analysis') }}</span>
        </aha-button>
      </div>
    </div>

    <div
      class="report-insights-body"
      v-html="sanitizedInsights"
    />
  </div>
</template>

<script>
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export default {
  data() {
    return {
      insights: `1. Dear Valued Client,
We are pleased to inform you that your monthly performance **_report_** has been successfully **_analyzed_**. This analysis highlights key trends in **_service usage_**, **_customer retention_**, and **_revenue growth_**, allowing you to make **_data-driven decisions_** to optimize future campaigns.

2. Based on the **_report findings_**, we have identified specific areas for **_improvement_** and **_opportunity_**, including adjustments in **_marketing strategy_**, enhancement of **_customer experience_**, and refinement of **_service offerings_**. A detailed **_consultation_** can be arranged should you require further clarification or strategic recommendations.`,
    }
  },

  computed: {
    sanitizedInsights() {
      const rawHtml = marked(this.insights)
      return sanitizeHtml(rawHtml, {
        allowedTags:       ['p', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
        allowedAttributes: {
          a: ['href', 'target'],
        },
        disallowedTagsMode: 'escape',
      })
    },
  },

  methods: {
    onRequestAnalysis() {
      this.$emit('request-analysis')
    },
  },
}
</script>

<style lang="scss">
@import './report-insights.scss';
</style>
