<template>
  <div class="report-insights">
    <div class="report-insights-header">
      <div class="report-insights-title">
        <div class="icon-ai" />
        <h3>{{ $t('report.insights') }}</h3>
      </div>

      <div
        v-if="!hideActions && !isLoading"
        class="report-insights-actions"
      >
        <aha-button
          variant="blue"
          @click.prevent="onRequestAnalysis"
        >
          <span>{{ buttonText }}</span>
        </aha-button>
      </div>
    </div>

    <div
      v-if="hasInsightsContent || isLoading"
      class="report-insights-body"
    >
      <p v-if="isLoading">
        {{ $t('report.ai-is-analyzing') }}
      </p>
      <p
        v-else
        v-html="sanitizedInsights"
      />
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import print_options from 'Options/print-options.js'

export default {
  props: {
    insightsContent: {
      type:    String,
      default: '',
    },
    hideActions: {
      type:    Boolean,
      default: false,
    },
    isLoading: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    hasInsightsContent() {
      return !!this.insightsContent
    },

    buttonText() {
      return this.hasInsightsContent
        ? this.$t('general.regenerate')
        : this.$t('general.request-analysis')
    },

    sanitizedInsights() {
      const rawHtml = marked(this.insightsContent)
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

    getPrintSections() {
      if (!this.hasInsightsContent) return []

      return [
        {
          ref_type:          print_options.print_ref_type.canvas,
          section_ref:       this.$el,
          page_break_before: true,
        },
      ]
    },
  },
}
</script>

<style lang="scss">
@import './report-insights.scss';
</style>
