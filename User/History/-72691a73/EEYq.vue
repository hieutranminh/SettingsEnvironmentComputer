<template>
  <div class="report-ai-summary">
    <p v-html="sanitizedAiSummary" />
  </div>
</template>

<script>
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

export default {
  props: {
  },

  data() {
    return {
      aiSummary: '',
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
