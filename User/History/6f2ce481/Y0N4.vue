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

    <div class="report-insights-body">
      <p v-html="sanitizedInsights" />
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export default {
  data() {
    return {
      insights: ````markdown\n**Applied Menu**: Clients with Prepaid Cards\n\n**Menu Filter**:\n    - Prepaid card sales period: 2024-01-12 ~ 2026-01-12\n    - Expiration period: 2026-01-12 ~ No limit\n\n```
 `,
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
