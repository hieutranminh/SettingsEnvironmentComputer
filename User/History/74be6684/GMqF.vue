<template>
  <b-modal
    :id="modal_id"
    :class="modal_id"
    :title="modal_title"
    :no-close-on-backdrop="true"
    modal-class="report-print-preview-modal"
    hide-footer
    static
    @show="toggleIsModalShow(true)"
    @hide="toggleIsModalShow()"
  >
    <div
      v-if="is_loading"
      class="report-print-preview-modal__loader loader"
    >
      <b-spinner
        class="loader__item"
        variant="primary"
        label="Spinning"
      />
    </div>
    <report-print-preview
      v-else-if="is_modal_show"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </b-modal>
</template>

<script>
// Components
import ReportPrintPreview from 'CommonComponents/report-print-preview/report-print-preview.vue'

export default {
  components: {
    ReportPrintPreview,
  },
  inheritAttrs: false,
  props:        {
    modal_id: {
      type:    String,
      default: 'report-print-preview-modal',
    },
  },
  data() {
    return {
      is_loading:    false,
      is_modal_show: false,
    }
  },
  computed: {
    modal_title() {
      return this.$t('general.print-preview')
    },
  },
  created() {
    this.loadFonts()
  },
  methods: {
    async loadFonts() {
      this.is_loading = true
      await Promise.all([
        import('Utils/pdf-custom-fonts/NanumGothic-bold'),
        import('Utils/pdf-custom-fonts/NanumGothic-normal'),
        import('Utils/pdf-custom-fonts/Roboto'),
      ]).catch(error => error)
      this.is_loading = false
    },

    toggleIsModalShow(is_show = false) {
      this.is_modal_show = is_show
      if (!is_show) {
        this.$emit('hide')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./report-print-preview-modal.scss";
</style>
