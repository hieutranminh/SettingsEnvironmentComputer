<template>
  <div
    class="report-ai-summary"
  >
    <div class="report-ai-summary-content">
      <p
        v-for="(item, index) in sanitizedAiSummaryItems"
        :key="index"
        v-html="item"
      />
    </div>

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
    aiSummary: {
      type:    Array,
      default: null,
    },
  },

  computed: {
    sanitizedAiSummaryItems() {
      if (!this.aiSummary) {
        return []
      }
      return this.aiSummary.map(item => {
        const rawHtml = marked(item)
        return sanitizeHtml(rawHtml, {
          allowedTags:       ['p', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
          allowedAttributes: {
            a: ['href', 'target'],
          },
          disallowedTagsMode: 'escape',
        })
      })
    },
  },
}
</script>

<style lang="scss">
@import './report-ai-summary.scss';
</style>
