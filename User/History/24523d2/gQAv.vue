<template>
  <div class="bookable-items-action">
    <a-modal
      ref="modal"
      v-bind="$attrs"
      :title="modalTitle"
      :full="isMobileDevice"
      :body-class="bodyClass"
      :modal-class="modalClass"
      :dialog-class="dialogClass"
      :content-class="contentClass"
      :class="bookingItemsActionPopupClass"

      static
      hide-footer
      no-close-on-backdrop

      v-on="$listeners"
      @show="handleModalShow"
      @hidden="handleModalHidden"
    >
      <div class="bookable-items-action__container">
        <template>
          <a-wizard
            v-show="isServiceItem"
            ref="serviceWizard"
            :has-footer="false"
            :enable="isMobileDevice"
            :steps="wizardServiceSteps"
            :active="serviceActiveWizardStep"
            class="a-wizard"
            @step-change="handleWizardStepChange"
          >
            <div class="bookable-items-action__selection">
              <a-wizard-step
                name="categories"
                class="a-wizard-step"
              >
                <div class="bookable-items-action__categories">
                  <service-categories
                    :value="selectedServiceCategoryId"
                    @categories-load="handleCategoriesLoad"
                    @input="handleServiceCategoryChange"
                  />
                </div>
              </a-wizard-step>

              <a-wizard-step
                name="services"
                class="a-wizard-step"
              >
                <div class="bookable-items-action__items bookable-items-action__items--service-item">
                  <service-items
                    :environment-setup="environmentSetup"
                    :title="selectedCategory.serviceCategoryName"
                    :service-category-id="selectedServiceCategoryId"
                    @back-click="handleServiceBackClick"
                    @service-click="handleServiceItemClick"
                  />
                </div>
              </a-wizard-step>
            </div>
          </a-wizard>
        </template>

        <template>
          <div
            v-show="isBookingItem"
            class="bookable-items-action__selection"
          >
            <div class="bookable-items-action__items bookable-items-action__items--booking-item">
              <booking-items
                :scrollable="true"
                @booking-item-click="handleBookingItemClick"
              />
            </div>
          </div>
        </template>

        <div class="bookable-items-action__selected">
          <booked-items
            :booked-items="bookedItems"
            :service-active-wizard-step="serviceActiveWizardStep"
            :is-save-disabled="isSaveDisabled"
            @remove-click="handleBookedItemRemoveClick"
            @select-additional-item-click="handleServiceBackClick"
            @handle-save-click="handleSaveClick"
            @handle-cancel-click="handleCancelClick"
          />
        </div>

        <div
          v-if="isMobileDevice"
          class="bookable-items-action__form-submit"
        >
          <a-button
            :disabled="isSaveDisabled"
            variant="primary"
            class="bookable-items-action__button"
            @click.prevent="handleSaveClick"
          >
            {{ $t('general.confirm') }}111
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
    </a-modal>
  </div>
</template>

<script>
// Utilities
import { mapGetters } from 'vuex'
import { guid } from 'CommonHelpers'

// Components
import AModal from 'Modules/aha/a-modal/a-modal.vue'
import AButton from 'Modules/aha/a-button/a-button.vue'
import { AWizard, AWizardStep } from 'Modules/aha/a-wizard'
import BookedItems from './components/booked-items/booked-items.vue'
import ServiceItems from './components/service-items/service-items.vue'
import BookingItems from './components/booking-items/booking-items.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ServiceCategories from './components/service-categories/service-categories.vue'

// Mixins
import DeviceMixin from 'Modules/device/mixins/device'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'

// Models
import BookedItem from 'Models/booking/bookedItem'

// Constants
import { BOOKING_ITEM_TYPE, GOODS_STATUS } from 'Constant'

const MAX_BOOKED_ITEMS = 10

export default {
  components: {
    AModal,
    AButton,
    AWizard,
    AWizardStep,
    BookedItems,
    BookingItems,
    ServiceItems,
    ServiceCategories,
  },

  extends: ComponentBase,

  mixins: [
    DeviceMixin,
    SalesCacheMixin,
  ],

  props: {
    bookingItemType: {
      type:    Number,
      default: BOOKING_ITEM_TYPE.SERVICE_ITEM,
    },

    totalBookedItems: {
      default: 0,
      type:    Number,
    },
  },

  data() {
    return {
      bookedItems: [],

      serviceCategories:         [],
      selectedServiceCategoryId: null,

      serviceActiveWizardStep: 'categories',

      type:             BOOKING_ITEM_TYPE.SERVICE_ITEM,
      environmentSetup: null,
    }
  },

  computed: {
    ...mapGetters('cache/booking', [
      'allCalendarSetup',
    ]),

    modalTitle() {
      return this.$t('bookings.select-booking-items')
    },

    modalClass() {
      return ['bookable-items-action__modal', this.$attrs['modal-class']]
    },

    bodyClass() {
      return ['bookable-items-action__modal-body', this.$attrs['body-class']]
    },

    dialogClass() {
      return ['bookable-items-action__modal-dialog bookable-items-action__modal-dialog-scrollable', this.$attrs['dialog-class']]
    },

    contentClass() {
      return ['bookable-items-action__modal-content', this.$attrs['content-class']]
    },

    bookingItemsActionPopupClass() {
      return ['bookable-items-action__popup', {
        'bookable-items-action__popup--mobile': this.isMobileDevice,
      }]
    },

    isServiceItem() {
      return this.type === BOOKING_ITEM_TYPE.SERVICE_ITEM
    },

    isSaveDisabled() {
      return this.bookedItems.length === 0
    },

    isBookingItem() {
      return this.type === BOOKING_ITEM_TYPE.BOOKING_ITEM
    },

    selectedCategory() {
      const selectedCategory = this.serviceCategories.find(serviceCategory => {
        return serviceCategory.serviceCategoryId === this.selectedServiceCategoryId
      })

      return selectedCategory ?? {}
    },

    wizardServiceSteps() {
      return ['categories', 'services']
    },

    isShowBookingItems() {
      const bookingItems = this.allCalendarSetup?.booking_items_setup?.items || []
      return bookingItems.find(bookingItem => bookingItem.status === GOODS_STATUS.ACTIVE)
    },

    itemsCanBeAdded() {
      return MAX_BOOKED_ITEMS - Number(this.totalBookedItems)
    },
  },

  methods: {
    async handleModalShow() {
      this.$emit('show')

      this.type = this.bookingItemType
      this.environmentSetup = await this.$salesCacheMixin_getEnvironmentSetup({ shopId: this.shop_data.shop_id, countryCode: this.shop_data.country })
    },

    handleModalHidden() {
      this.$emit('hidden')

      this.handleResetOptionsData()

      this.handleCategoriesLoad(this.serviceCategories)
    },

    handleResetOptionsData() {
      this.bookedItems = []
      this.environmentSetup = null
      this.errors = []
      this.selectedServiceCategoryId = null
      this.serviceActiveWizardStep = 'categories'
      this.type = BOOKING_ITEM_TYPE.SERVICE_ITEM
    },

    handleNavigatorServiceClick() {
      this.type = BOOKING_ITEM_TYPE.SERVICE_ITEM
    },

    handleNavigatorBookingItemClick() {
      this.type = BOOKING_ITEM_TYPE.BOOKING_ITEM
    },

    handleCategoriesLoad(categories = []) {
      const [category] = categories

      this.serviceCategories = categories
      this.selectedServiceCategoryId = !this.isMobileDevice ? category?.serviceCategoryId : 0
    },

    handleServiceCategoryChange(selectedServiceCategoryId) {
      this.serviceActiveWizardStep = 'services'
      this.selectedServiceCategoryId = selectedServiceCategoryId
    },

    validateBookedItems() {
      if(this.bookedItems.length === this.itemsCanBeAdded) {
        const warningCannotExceedBookedItemMax = this.$t('bookings.warning_can_not_exceed_booked_items_max', {
          items_max: MAX_BOOKED_ITEMS,
        })

        const warningAddMaxBookedItems = this.$t('bookings.warning_add_max_booked_items', {
          number: this.itemsCanBeAdded,
        })

        this._showDialogAlert(`${warningCannotExceedBookedItemMax} ${warningAddMaxBookedItems}`)

        return false
      }

      return true
    },

    handleServiceItemClick(service) {
      const isValid = this.validateBookedItems()
      if(!isValid) {
        return
      }

      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)

      bookedItem.bookedItemId = guid()
      bookedItem.bookedRefId = service.serviceId
      bookedItem.bookedRefName = service.serviceName
      bookedItem.bookedType = BOOKING_ITEM_TYPE.SERVICE_ITEM
      bookedItem.setEsimatedTime(service?.estimatedTime ?? 0)

      this.bookedItems.push(bookedItem)
    },

    handleServiceBackClick() {
      this.serviceActiveWizardStep = 'categories'
    },

    handleBookingItemClick(bookingItem) {
      const isValid = this.validateBookedItems()
      if(!isValid) {
        return
      }

      const bookedItem = new BookedItem()
      bookedItem.setIsNew(true)

      bookedItem.bookedItemId = guid()
      bookedItem.bookedRefId = bookingItem.id
      bookedItem.bookedRefName = bookingItem.bookingItemName
      bookedItem.bookedType = BOOKING_ITEM_TYPE.BOOKING_ITEM
      bookedItem.setEsimatedTime(bookingItem?.estimatedTime ?? 0)

      this.bookedItems.push(bookedItem)
    },

    handleBookedItemRemoveClick(bookedItemIndex) {
      this.bookedItems.splice(bookedItemIndex, 1)
    },

    handleCancelClick() {
      this.$refs.modal.hide()
    },

    handleSaveClick() {
      this.$refs.modal.hide()
      this.$emit('booked-items-add', this.bookedItems)
    },

    handleWizardStepChange(serviceActiveWizardStep) {
      this.serviceActiveWizardStep = serviceActiveWizardStep
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./bookable-items-action.scss";
</style>
