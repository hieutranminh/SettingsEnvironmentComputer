<template>
  <section class="report-by-branch-header">
    <!-- Title -->
    <h1>{{ $t('report-by-branch.title') }}</h1>
  </section>

  <section class="report-by-branch-wrapper">
    <Card>
      <template #content>
        <!-- RERPORT SALES ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-sales-analysis') }}</h3>

          <div class="report-by-branch-content">
            <router-link v-for="item in reportSalesAnalysis" :key="item.link" :to="item.link">
              {{ item.title }}
            </router-link>
          </div>
        </div>

        <!-- REPORT CLIENT ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-client-analysis') }}</h3>
          <div class="report-by-branch-content">
            <router-link v-for="index in 10" :key="index" :to="`/report-by-branch/sales-by-date`">
              - Recommended Clients by Month
            </router-link>
          </div>
        </div>

        <!-- REPORT BOOKING ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-booking-analysis') }}</h3>
          <div class="report-by-branch-content">
            <router-link v-for="index in 10" :key="index" :to="`/report-by-branch/sales-by-date`">
              - Recommended Clients by Month
            </router-link>
          </div>
        </div>
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const reportSalesAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.sales-by-date'),
      link: '/report/sales-by-date',
    },
    {
      title: t('report-by-branch.sales-by-month'),
      link: '/report/sales-by-month',
    },
    {
      title: t('report-by-branch.service-sales'),
      link: '/report/service-sales',
    },
    {
      title: t('report-by-branch.service-sales-by-item'),
      link: '/report/service-sales-by-item',
    },
    {
      title: t('report-by-branch.service-sales-by-month'),
      link: '/report/service-sales-by-month',
    },
    {
      title: t('report-by-branch.service-sales-by-sales-type'),
      link: '/report/service-sales-by-sales-type',
    },
    {
      title: t('report-by-branch.product-sales-by-item'),
      link: '/report/product-sales-by-item',
    },
    {
      title: t('report-by-branch.product-sales-by-month'),
      link: '/report/product-sales-by-month',
    },
    {
      title: t('report-by-branch.sales-by-discount-category'),
      link: '/report/sales-by-discount-category',
    },
    {
      title: t('report-by-branch.sales-by-repeat-clients'),
      link: '/report/sales-by-repeat-clients',
    },

    {
      title: t('report-by-branch.prepaid-goods-repurchase'),
      link: '/report/prepaid-goods-repurchase',
    },
  ]
})

const reportClientAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.clients-summary'),
      link: '/report/clients-summary',
    },
    {
      title: t('report-by-branch.clients-by-period'),
      link: '/report/clients-by-period',
    },
    {
      title: t('report-by-branch.clients-by-type'),
      link: '/report/clients-by-type',
    },
    {
      title: t('report-by-branch.new-clients-repeat'),
      link: '/report/new-clients-repeat',
    },
    {
      title: t('report-by-branch.new-clients-by-month'),
      link: '/report/new-clients-by-month',
    },
    {
      title: t('report-by-branch.recommended-clients-by-month'),
      link: '/report/recommended-clients-by-month',
    },
    {
      title: t('report-by-branch.new-clients-by-referral-source'),
      link: '/report/new-clients-by-referral-source',
    },
  ]
})

const reportBookingAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.bookings-tally-details'),
      link: '/report/bookings-tally-details',
    },
    {
      title: t('report-by-branch.bookings-by-date'),
      link: '/report/bookings-by-date',
    },
    {
      title: t('report-by-branch.bookings-by-month'),
      link: '/report/bookings-by-month',
    },
    {
      title: t('report-by-branch.bookings-by-resource'),
      link: '/report/bookings-by-resource',
    },
    {
      title: t('report-by-branch.bookings-by-day-of-week'),
      link: '/report/bookings-by-day-of-week',
    },
    {
      title: t('report-by-branch.bookings-by-time'),
      link: '/report/bookings-by-time',
    },
    {
      title: t('report-by-branch.bookings-by-source'),
      link: '/report/bookings-by-source',
    },
    {
      title: t('report-by-branch.booking-ratio'),
      link: '/report/booking-ratio',
    },
  ]
})
</script>

<style lang="scss" scoped>
.report-by-branch-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);
  min-height: 45px;

  h1 {
    font-size: 18px;
    font-weight: 900;
  }
}

.report-by-branch-wrapper {
  :deep(.p-card) {
    .p-card-body {
      .p-card-content {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
      }
    }
  }

  .report-by-branch-column {
    width: calc((100% - 60px) / 3);

    @include maxResponsive(ipad) {
      width: calc((100% - 60px) / 2);
    }

    @include maxResponsive(mobile) {
      width: 100%;
    }

    h3 {
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: 900;
      color: $green-navbar;
      border-bottom: 3px solid $green-navbar;
      padding-bottom: 10px;
    }

    .report-by-branch-content {
      border: 1px solid var(--p-gray-400);
      border-top: none;

      a {
        display: block;
        text-decoration: none;
        color: $black;
        padding: 12px 10px;
        transition: all 0.3s ease;
      }

      a:not(:last-child) {
        border-bottom: 1px solid var(--p-gray-400);
      }

      a:hover {
        background-color: $green-navbar;
        color: $white;
      }
    }
  }
}
</style>
