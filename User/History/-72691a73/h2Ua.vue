<template>
  <div class="report-ai-summary">
    <p
      class="report-ai-summary-content"
      v-html="sanitizedAiSummary"
    />

    <div
      v-if="isDesktopDevice"
      v-b-tooltip.right
      :title="$t('report.ai-generated')"
      class="icon-ai"
    />
  </div>
</template>

<script>
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import DeviceMixin from 'Modules/device/mixins/device'

export default {
  mixins: [
    DeviceMixin,
  ],

  props: {
  },

  data() {
    return {
      aiSummary: '**Total revenue** this month reached 120 million VND',
    }
  },

  computed: {
    sanitizedAiSummary() {
      const rawHtml = marked(this.aiSummary)
      return sanitizeHtml(rawHtml, {
        allowedTags:       ['p', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
        allowedAttributes: {
          a: ['href', 'target'],
        },
        disallowedTagsMode: 'escape',
      })
    },
  },

}
</script>

<style lang="scss">
@import './report-ai-summary.scss';
</style>
