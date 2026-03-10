<template>
  <div class="report-has-chart-wrapper">
    <div class="page-title">
      <h3>{{ reportName }}</h3>

      <div class="actions">
        <aha-button-back />
        <aha-button-print-report
          :disabled="isPrintDisabled"
          @click="$emit('print-report')"
        />
      </div>
    </div>
    <slot
      :chart-progressing="setPrintButtonDisabled"
      :chart-updated="setPrintButtonEnabled"
    />
  </div>
</template>

<script>
import AhaButtonBack from 'CommonComponents/aha-button/aha-button-back.vue'
import AhaButtonPrintReport from 'CommonComponents/aha-button/aha-button-print-report.vue'

export default {
  components: {
    AhaButtonBack,
    AhaButtonPrintReport,
  },

  props: {
    reportName: {
      type:    String,
      default: '',
    },
  },

  data() {
    return {
      isPrintDisabled: false,
    }
  },

  methods: {
    setPrintButtonDisabled() {
      if (!this.isPrintDisabled) this.isPrintDisabled = true
    },

    setPrintButtonEnabled() {
      this.isPrintDisabled = false
    },

  },
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  .aha-button-print-report {
    margin-left: 5px;
  }
}

@media (max-width: 767.98px) {
  .actions {
    .aha-button-back {
      width: 96px!important;
    }
  }
}
</style>
