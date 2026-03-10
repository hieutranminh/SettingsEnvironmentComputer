<template>
  <div class="calendar-booking-list">
    <a-modal
      ref="modal"
      v-bind="$attrs"
      :visible="visible"
      :class="modalClass"
      :full="isMobileDevice"
      :title="$t('booking-list.booking-list')"

      static
      hide-footer
      no-close-on-esc
      no-close-on-backdrop

      v-on="$listeners"
    >
      <booking-list
        v-if="visible"
        :initial-search-query="initialSearchQuery"
        @hide="handleFormHide"
      />
    </a-modal>
  </div>
</template>

<script>
// Components
import AModal from 'Modules/aha/a-modal/a-modal.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

export default {
  components: {
    AModal,

    BookingList: () => import('./components/booking-list/booking-list.vue'),
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
  },

  computed: {
    modalClass() {
      return ['calendar-booking-list__modal', {
        'calendar-booking-list__modal--mobile': this.isMobileDevice || this.isAndroidSmallTablet,
      }]
    },
  },

  methods: {
    handleFormHide() {
      this.$refs.modal.hide()
    },
  },
}
</script>

<style lang="scss" scoped>
@import './calendar-booking-list.scss';
</style>

