<template>
  <div class="calendar-waitings">
    <div
      v-if="isLoaded"
      class="calendar-waitings__header"
    >
      <h3
        v-if="isWaitingMode"
        class="calendar-waitings__title"
      >
        {{ $t('bookings.waiting-list') }}
      </h3>
      <h3
        v-else
        class="calendar-waitings__title"
      >
        {{ $t('bookings.notes') }}
      </h3>

      <div class="calendar-waitings__actions">
        <a
          v-if="isWaitingMode"
          v-b-tooltip.hover
          :class="[
            'calendar-waitings__action-button',
            {
              'calendar-waitings__action-button--disabled': isActionsNotAllowed,
            }
          ]"
          @click="handleAddWaitingClick"
        >
          <b-icon-plus />
        </a>

        <a
          v-if="isWaitingMode"
          v-b-tooltip.hover
          :class="[
            'calendar-waitings__action-button',
            {
              'calendar-waitings__action-button--disabled': isActionsNotAllowed,
            }
          ]"
          @click="handleOpenWaitingList"
        >
          <b-icon-list />
        </a>

        <a
          ref="target"
          v-b-tooltip.hover
          :class="[
            'calendar-waitings__action-button',
            {
              'calendar-waitings__action-button--disabled': isActionsNotAllowed,
            }
          ]"
          @click="handleOpenMenu"
        >
          <img
            :src="iconBadgeNaver"
            alt="menu"
            class="calendar-waitings--menu"
          >
        </a>

        <div
          v-if="isShowSelectMenu"
          class="calendar-waitings--menu-popup"
        >
          <ul class="calendar-waitings--menu-popup__list">
            <li class="calendar-waitings--menu-popup__item">
              <a
                class="calendar-waitings--menu-popup__link"
                @click.stop="isWaitingMode = false; isShowSelectMenu = false"
              >{{ $t('bookings.notes') }}</a>
            </li>

            <li class="calendar-waitings--menu-popup__item">
              <a
                class="calendar-waitings--menu-popup__link"
                @click.stop="isWaitingMode = true; isShowSelectMenu = false"
              >{{ $t('waiting-list.reservation-waiting-list') }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      v-if="isWaitingMode"
      class="calendar-waitings__body"
    >
      <ul
        v-if="hasWaitings"
        class="calendar-waitings__list"
      >
        <li
          v-for="waiting in waitings"
          :key="`waiting_${waiting.waitingId}`"
          class="calendar-waitings__item"
        >
          <calendar-waiting
            :waiting="waiting"
            class="calendar-waitings__waiting-item"
            @booking-added="handleBookingAdded"
            @cancel-waiting="handleCancelWatitingClick($event)"
          />
        </li>
      </ul>
      <!-- <div v-else class="calendar-waitings__empty">
        <div class="calendar-waitings__empty-icon" />

        <p class="calendar-waitings__empty-text">No data!!</p>

        <a class="calendar-waitings__empty-button" @click="handleAddWaitingClick">Add a waiting</a>
      </div> -->
    </div>

    <div
      v-else
      class="calendar-notes__body"
    >
      <div
        class="calendar-notes__content calendar-notes__content-full-area"
        @click="handleEditNote(notes)"
      >
        <aha-note-sidebar
          :value="notes"
          :is-set-full-area="true"
          :is-disabled-tooltip="true"
          tooltip-id="calendar-notes"
          custom-class="booking-list-note-tooltip"
        />
      </div>
    </div>

    <notes-action
      ref="notesActionRef"
      :is-small-note="true"
      :is-max-big-notes="true"
      :is-show-save-button="true"
      :modal-title-text="$t('bookings.notes')"
      @submit="handleUpdateBookingNote"
    />
  </div>
</template>

<script>
// Utilities
import { CalendarEventBus } from 'Modules/calendar/utils/index'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'

// Models
import Waiting from 'Models/waiting/waiting'

// Apis
import { getShopInfo } from 'Modules/api/account/shop-info-api'
import { getSidebarNotes, updateSidebarNotes } from 'Modules/api/booking/waiting-api.js'

// Constants
import { NOTIFICATON_TYPE} from 'Constant'

// Components
import { BIconPlus, BIconList } from 'bootstrap-vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import AhaNoteSidebar from 'CommonComponents/aha-note-sidebar/aha-note-sidebar.vue'

// Constant
import { options } from 'OptionsHelpers'

const RELEASE_89_DATE = '2025-03-05'

export default {
  components: {
    BIconPlus,
    BIconList,
    AhaNoteSidebar,
    CalendarWaiting: () => import('./components/calendar-waiting/calendar-waiting.vue'),
    NotesAction:     () => import('Components//bookings/notes-action/notes-action.vue'),
  },

  extends: ComponentBase,

  data() {
    return {
      filter: {
        clientId:               0,
        ascOrdering:            true,
        fromWaitingDateTS:      0,
        bookingResourceSetupId: 0,
      },
      isNewShopAfterImplementation: false,
      isLoaded:                     false,
      isShowSelectMenu:             false,
      isWaitingMode:                true,
      notes:                        '',
    }
  },

  computed: {
    ...mapState('_calendar', [
      'isCalendarSlotAccessible',
    ]),

    ...mapState('_calendar/waitings', [
      'waitings',
    ]),

    ...mapState('authentication', [
      'user',
    ]),

    hasWaitings() {
      return this.waitings.length > 0
    },

    isActionsNotAllowed() {
      return this.isCalendarSlotAccessible
    },

    iconBadgeNaver() {
      return '/template/images/icon-menu.png'
    },
  },

  watch: {
    isWaitingMode: {
      handler(newVal) {
        localStorage.setItem('isWaitingMode', JSON.stringify(newVal))
      },
    },
  },

  async mounted() {
    const cacheKey = `shop_registration_date_${this.shop_data.shop_id}`
    const cachedRegistrationDate = sessionStorage.getItem(cacheKey)
    
    if (cachedRegistrationDate) {
      this.isNewShopAfterImplementation = moment(cachedRegistrationDate).isAfter(moment(RELEASE_89_DATE))
      this.isLoaded = true
    } else {
      await this.loadShopInformations()
    }
    
    this.loadWaitings()
    this.loadSidebarNotes()

    if (localStorage.getItem('isWaitingMode')) {
      this.isWaitingMode = JSON.parse(localStorage.getItem('isWaitingMode'))
    } else if (this.isNewShopAfterImplementation) {
      this.isWaitingMode = false
    } else {
      this.isWaitingMode = true
    }

    window.addEventListener('click', this.handleOuterClick)
    this.$signalR.on(options.notification_type.waitings_updated, this.handleReceiveWaitingEvent)
    this.$signalR.on(options.notification_type.waitings_created, this.handleReceiveWaitingEvent)
    this.$signalR.on(options.notification_type.waitings_changed_to_bookings, this.handleReceiveWaitingChangedToBooking)
    this.$signalR.on(NOTIFICATON_TYPE.CALENDAR_NOTE_CHANGED, this.handleCalendarNoteChanged)
  },

  beforeDestroy() {
    window.removeEventListener('click', this.handleOuterClick)
    this.$signalR.off(options.notification_type.waitings_updated, this.handleReceiveWaitingEvent)
    this.$signalR.off(options.notification_type.waitings_created, this.handleReceiveWaitingEvent)
    this.$signalR.off(options.notification_type.waitings_changed_to_bookings, this.handleReceiveWaitingChangedToBooking)
    this.$signalR.off(NOTIFICATON_TYPE.CALENDAR_NOTE_CHANGED, this.handleCalendarNoteChanged)
  },

  methods: {
    ...mapActions('_calendar/waitings', [
      'getAllWaitingsFromToday',
    ]),

    ...mapActions('_calendar/waitingAction', [
      'openWaitingAction',
    ]),

    async loadWaitings() {
      try {
        await this.getAllWaitingsFromToday()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadSidebarNotes() {
      try {
        const payload = { shopId: this.shop_data.shop_id }
        const result = await getSidebarNotes(payload)

        this.notes = result.data?.result?.content || ''
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    /**@param {MouseEvent} event */
    handleOpenWaitingList(event) {
      if(this.isActionsNotAllowed) return
      
      event.preventDefault()

      CalendarEventBus.$emit('open-waiting-list')
    },

    /**@param {MouseEvent} event */
    handleOpenMenu(event) {
      if(this.isActionsNotAllowed) return
      
      event.preventDefault()

      this.isShowSelectMenu = !this.isShowSelectMenu
    },

    /**@param {MouseEvent} event */
    async handleAddWaitingClick(event) {
      if(this.isActionsNotAllowed) return

      try {
        this.preLoader()

        event.preventDefault()

        const waiting = new Waiting()

        this.openWaitingAction(waiting)
        
        CalendarEventBus.$emit('load-calendar-setup')
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleCancelWatitingClick(data) {
      try {
        this.preLoader()

        /**@type {Waiting} */
        const waiting = Waiting.build(data)
        waiting.cancelById = this.x_user.user_id
        waiting.cancelByName = this.x_user.user_name
        waiting.sessionToken = this.x_user.session_token

        await waiting.cancel()

        this.loadWaitings()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },
    
    handleBookingAdded() {
      this.loadWaitings()
    },

    handleReceiveWaitingChangedToBooking() {
      this.loadWaitings()
    },

    handleReceiveWaitingEvent(data) {
      const sessionToken = data.sessionToken
      const userSessionToken = this.x_user.session_token
      
      if (sessionToken === userSessionToken) return

      this.loadWaitings()
    },

    /**@param {MouseEvent} event */
    handleOuterClick(event) {
      if (!this.$refs.target.contains(event.target)) {
        this.isShowSelectMenu = false
      }
    },

    handleEditNote(notes) {
      this.$refs.notesActionRef.showModal({
        notes,
        isEditable: true,
      })
    },

    async handleUpdateBookingNote({ notes }) {
      try {
        this.preLoader()
        const payload = {
          content:      notes,
          shopId:       this.shop_data.shop_id,
          sessionToken: this.user.session_token,
        }
        
        await updateSidebarNotes(payload)
        
        this.notes = notes
        this.$refs?.notesActionRef.hideModal?.()
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleCalendarNoteChanged(data) {
      const sessionToken = data?.sessionToken
      if (sessionToken === this.user.session_token || data?.shopId !== this.shop_data.shop_id) {
        return
      }

      this.notes = data.content
    },

    async loadShopInformations() {
      try {
        this.preLoader()
        const payload = {
          shopId: this.shop_data.shop_id,
        }
        const response = await getShopInfo(payload)

        const registrationDate = response?.data?.result?.registrationDate || null

        this.isNewShopAfterImplementation = registrationDate
          ? moment(registrationDate).isAfter(moment(RELEASE_89_DATE))
          : false

        // Cache registrationDate in sessionStorage to avoid duplicate API calls
        if (registrationDate) {
          const cacheKey = `shop_registration_date_${this.shop_data.shop_id}`
          sessionStorage.setItem(cacheKey, registrationDate)
        }
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.isLoaded = true
        this.preLoader(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./calendar-waitings.scss";
</style>

