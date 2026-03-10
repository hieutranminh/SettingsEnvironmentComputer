<template>
  <div class="booked-items">
    <div class="booked-items__top">
      <h3 class="booked-items__title">
        {{ $t('bookings.selected-items') }}
      </h3>

      <a-button
        v-show="isMobileDevice && serviceActiveWizardStep === TAB_SERVICES"
        variant="primary"
        class="service-items__back"
        @click.prevent="handleSelectAdditionalItemClick"
      >
        {{ $t('bookings.select-additional-item') }}
      </a-button>
    </div>
    <ul class="booked-items__list">
      <template v-if="isSaveDisabled">
        <li class="booked-items__item">
          <div class="booked-items__booked-item">
            <div class="booked-items__booked-item-name" />
          </div>
        </li>
      </template>
      <template v-else>
        <li
          v-for="(bookedItem, bookedItemIndex) in bookedItems"
          :key="`booked_item_${bookedItem.bookedItemId}`"
          class="booked-items__item"
        >
          <div class="booked-items__booked-item">
            <div class="booked-items__booked-item-name">
              {{ bookedItem.bookedRefName }}
            </div>

            <a
              class="booked-items__booked-item-remove"
              @click="handleBookedItemRemoveClick(bookedItemIndex)"
            >
              <b-icon-trash-fill />
            </a>
          </div>
        </li>
      </template>
    </ul>
    <div
      v-if="!isMobileDevice"
      class="bookable-items-action__form-submit"
    >
      <a-button
        :disabled="isSaveDisabled"
        variant="primary"
        class="bookable-items-action__button"
        @click.prevent="handleSaveClick"
      >
        {{ $t('general.confirm') }}222
      </a-button>
      <a-button
        class="bookable-items-action__button"
        variant="blue-light"
        @click="handleCancelClick"
      >
        {{ $t('general.cancel') }}
      </a-button>
    </div>
  </div>
</template>

<script>
// Components
import {BIconTrashFill} from 'bootstrap-vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'

const TAB_SERVICES = 'services'

export default {
  components: {
    AButton,
    BIconTrashFill,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
  ],

  props: {
    bookedItems: {
      type:    Array,
      default: () => [],
    },
    serviceActiveWizardStep: {
      type:    String,
      default: '',
    },
    isSaveDisabled: {
      type:    Boolean,
      default: false,
    },
  },

  data () {
    return {
      TAB_SERVICES,
    }
  },

  methods: {
    handleBookedItemRemoveClick(bookedItemIndex) {
      this.$emit('remove-click', bookedItemIndex)
    },

    handleSelectAdditionalItemClick() {
      this.$emit('select-additional-item-click')
    },

    handleSaveClick() {
      this.$emit('handle-save-click')
    },

    handleCancelClick() {
      this.$emit('handle-cancel-click')
    },
  },
}
</script>

<style lang="scss" scoped>
@import './booked-items.scss';
</style>
