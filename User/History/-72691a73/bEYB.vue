<template>
  <div
    class="report-ai-summary"
  >
    <!-- Content -->
    <ul class="report-ai-summary-content">
      <template v-if="aiSummary && aiSummary.length">
        <li
          v-for="(item, index) in sanitizedAiSummaryItems"
          :key="index"
          v-html="item"
        />
      </template>

      <p v-else>
        {{ $t('report.ai-is-analyzing') }}
      </p>
    </ul>

    <!-- Icon AI -->
    <div
      v-if="isDesktopDevice"
      v-b-tooltip.right
      :title="$t('report.ai-generated')"
      class="icon-ai"
    />
    <div
      v-else
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
      default: () => ([]),
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
