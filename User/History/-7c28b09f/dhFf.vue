<template>
  <main class="app-content">
    <section class="content report-menu-page">
      <div class="page-title">
        <h3>{{ $t('report.report') }}</h3>
      </div>

      <div class="report-menu-wrapper">
        <ul>
          <li>
            <router-link :to="{ name: 'report-operational-trend-analysis' }">
              {{ $t('report.comprehensive-analysis') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'report-staff-performance-analysis' }">
              {{ $t('report.staff-performance-analysis') }}
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'report-operational-trend-analysis' }">
              {{ $t('report.operational-trend-analysis') }}
            </router-link>
          </li>
        </ul>
      </div>

      <div class="report-menu-wrapper">
        <div class="row">
          <div
            v-if="is_manager_or_high_permission"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="report-type">
              <div class="report-type-title">
                {{ $t('report.sales-analysis') }}
              </div>
              <div class="report-type-items">
                <ul>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-sales-by-date' }">
                      - {{ $t('report.sales-by-date') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-sales-by-month' }">
                      - {{ $t('report.sales-by-month') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-staff-sales-by-month' }">
                      - {{ $t('report.staff-sales-by-month.staff-sales-by-month') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-service-sales' }">
                      - {{ $t('report.service-sales') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-service-sales-by-item' }">
                      - {{ $t('report.service-sales-by-item') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-service-sales-by-month' }">
                      - {{ $t('report.service-sales-by-month') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-service-sales-by-sales-type' }">
                      - {{ $t('report.service-sales-by-sales-type') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-product-sales-by-item' }">
                      - {{ $t('report.product-sales-by-item') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-product-sales-by-month' }">
                      - {{ $t('report.product-sales-by-month') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-sales-by-discount-category' }">
                      - {{ $t('report.sales-by-discount-category') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-sales-by-repeat-clients' }">
                      - {{ $t('report.sales-by-repeat-clients') }}
                    </router-link>
                  </li>
                  <li v-if="is_master_permission">
                    <router-link :to="{ name: 'report-prepaid-goods-repurchase' }">
                      - {{ $t('report.prepaid-goods-repurchase') }}
                    </router-link>
                  </li>
                  <li v-if="is_manager_or_high_permission">
                    <router-link :to="{ name: 'report-income-statement' }">
                      - {{ $t('report.income-statement') }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            v-if="is_master_permission"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="report-type">
              <div class="report-type-title">
                {{ $t('report.client-analysis') }}
              </div>
              <div class="report-type-items">
                <ul>
                  <li>
                    <router-link :to="{ name: 'report-clients-summary' }">
                      - {{ $t('report.clients-summary') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-clients-by-period' }">
                      - {{ $t('report.clients-by-period') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-clients-by-type' }">
                      - {{ $t('report-clients-by-type.clients-by-type') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-new-clients-repeat' }">
                      - {{ $t('report.new-clients-repeat') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-new-clients-by-month' }">
                      - {{ $t('report.new-clients-by-month') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-recommended-clients-by-month' }">
                      - {{ $t('report-recommended-clients-by-month.recommended-clients-by-month') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-new-clients-by-referral-source' }">
                      - {{ $t('report.new-clients-by-referral-source') }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            v-if="is_master_permission"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="report-type">
              <div class="report-type-title">
                {{ $t('report.booking-analysis') }}
              </div>
              <div class="report-type-items">
                <ul>
                  <li>
                    <router-link :to="{name: 'report-tally-bookings'}">
                      - {{ $t('report.bookings-tally-details') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-bookings-by-date' }">
                      - {{ $t('report.bookings-by-date') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-bookings-by-month' }">
                      - {{ $t('report.bookings-by-month') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-booking-by-resource' }">
                      - {{ $t('report.booking-by-resource') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-booking-by-date-of-week' }">
                      - {{ $t('report.booking-by-date-of-week') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-booking-by-time' }">
                      - {{ $t('report.booking-by-time') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-booking-by-source' }">
                      - {{ $t('report.booking-by-source') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-bookings-ratio' }">
                      - {{ $t('report.booking-ratio') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-utilization-rate' }">
                      - {{ $t('report.utilization-rate') }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            v-if="is_master_permission"
            class="col-12 col-sm-6 col-lg-3"
          >
            <div class="report-type">
              <div class="report-type-title">
                {{ $t('report.prepaid-goods-and-points') }}
              </div>
              <div class="report-type-items">
                <ul>
                  <li>
                    <router-link :to="{ name: 'report-prepaid-cards-by-client' }">
                      - {{ $t('report.prepaid-cards-by-client') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-prepaid-card-summary' }">
                      - {{ $t('report.prepaid-card-summary') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-prepaid-services-by-client' }">
                      - {{ $t('report.prepaid-services-by-client') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-prepaid-service-summary' }">
                      - {{ $t('report.prepaid-service-summary.prepaid-service-summary-title') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-loyalty-points-by-client' }">
                      - {{ $t('report.loyalty-points-by-client') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-prepaid-goods-expired-balance' }">
                      - {{ $t('report.prepaid-goods-expired.prepaid-goods-expired-balance') }}
                    </router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'report-expired-balance-by-month' }">
                      - {{ $t('report.prepaid-goods-expired.expired-balance-by-month') }}
                    </router-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// Utils
import { options } from 'OptionsHelpers'
import { isPermittedBySetupRole } from 'CommonHelpers'
import { sales_options } from 'Options/sales-options.js'
import { common_options } from 'Options/common-options.js'

//Components
import AlertConfirm from 'Components/common/alert/alert-confirm.vue'
import ComponentBase from 'Components/common/component-base/component-base.vue'

export default {
  components: {
    AlertConfirm,
  },

  extends: ComponentBase,

  data(){
    return {
      options,
      common_options,
      sales_options,
      alertData:            [],
      alertConfirmReportId: 'alert-confirm-report-id',
    }
  },

  computed: {
    is_manager_or_high_permission(){
      return isPermittedBySetupRole(sales_options.security_level_enum.manager_or_higher)
    },
    is_master_permission(){
      return isPermittedBySetupRole(sales_options.security_level_enum.master)
    },
  },

  methods: {
    isPermittedBySetupRole,

    goBack() {
      this.$router.push({ name: 'home' })
    },
  },
}
</script>

<style lang="scss">
@import './report-menu.scss';
</style>
