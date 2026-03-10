<template>
  <section class="report-by-branch-header">
    <!-- Title -->
    <h1>{{ $t('report-by-branch.title') }}</h1>
  </section>

  <section class="report-by-branch-wrapper">
    <Card>
      <template #content>
        <!-- REPORT SALES ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-sales-analysis') }}</h3>

          <div class="report-by-branch-content">
            <router-link
              v-for="item in reportSalesAnalysis"
              :key="item.path"
              :to="{ path: item.path, query: route.query }"
            >
              {{ item.title }}
            </router-link>
          </div>
        </div>

        <!-- REPORT CLIENT ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-client-analysis') }}</h3>
          <div class="report-by-branch-content">
            <router-link
              v-for="item in reportClientAnalysis"
              :key="item.path"
              :to="{ path: item.path, query: route.query }"
            >
              {{ item.title }}
            </router-link>
          </div>
        </div>

        <!-- REPORT BOOKING ANALYSIS -->
        <div class="report-by-branch-column">
          <h3>{{ $t('report-by-branch.report-booking-analysis') }}</h3>
          <div class="report-by-branch-content">
            <router-link
              v-for="item in reportBookingAnalysis"
              :key="item.path"
              :to="{ path: item.path, query: route.query }"
            >
              {{ item.title }}
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
import { useRoute } from 'vue-router'

// Constants
import { REPORT_BY_BRANCH_ROUTES } from '@/constants/routeNames'

// Composables
const { t } = useI18n()
const route = useRoute()

const reportSalesAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.sales-by-date'),
      routeName: REPORT_BY_BRANCH_ROUTES.SALES_BY_DATE,
    },
    {
      title: t('report-by-branch.sales-by-month'),
      routeName: REPORT_BY_BRANCH_ROUTES.SALES_BY_MONTH,
    },
    {
      title: t('report-by-branch.service-sales'),
      routeName: REPORT_BY_BRANCH_ROUTES.SERVICE_SALES,
    },
    {
      title: t('report-by-branch.service-sales-by-item'),
      routeName: REPORT_BY_BRANCH_ROUTES.SERVICE_SALES_BY_ITEM,
    },
    {
      title: t('report-by-branch.service-sales-by-month'),
      routeName: REPORT_BY_BRANCH_ROUTES.SERVICE_SALES_BY_MONTH,
    },
    {
      title: t('report-by-branch.service-sales-by-sales-type'),
      routeName: REPORT_BY_BRANCH_ROUTES.SERVICE_SALES_BY_SALES_TYPE,
    },
    {
      title: t('report-by-branch.product-sales-by-item'),
      routeName: REPORT_BY_BRANCH_ROUTES.PRODUCT_SALES_BY_ITEM,
    },
    {
      title: t('report-by-branch.product-sales-by-month'),
      routeName: REPORT_BY_BRANCH_ROUTES.PRODUCT_SALES_BY_MONTH,
    },
    {
      title: t('report-by-branch.sales-by-discount-category'),
      routeName: REPORT_BY_BRANCH_ROUTES.SALES_BY_DISCOUNT_CATEGORY,
    },
    {
      title: t('report-by-branch.sales-by-repeat-clients'),
      routeName: REPORT_BY_BRANCH_ROUTES.SALES_BY_REPEAT_CLIENTS,
    },

    {
      title: t('report-by-branch.prepaid-goods-repurchase'),
      routeName: REPORT_BY_BRANCH_ROUTES.PREPAID_GOODS_REPURCHASE,
    },
  ]
})

const reportClientAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.clients-summary'),
      routeName: '/report/clients-summary',
    },
    {
      title: t('report-by-branch.clients-by-period'),
      routeName: '/report/clients-by-period',
    },
    {
      title: t('report-by-branch.clients-by-type'),
      routeName: '/report/clients-by-type',
    },
    {
      title: t('report-by-branch.new-clients-repeat'),
      routeName: '/report/new-clients-repeat',
    },
    {
      title: t('report-by-branch.new-clients-by-month'),
      routeName: '/report/new-clients-by-month',
    },
    {
      title: t('report-by-branch.recommended-clients-by-month'),
      routeName: '/report/recommended-clients-by-month',
    },
    {
      title: t('report-by-branch.new-clients-by-referral-source'),
      routeName: '/report/new-clients-by-referral-source',
    },
  ]
})

const reportBookingAnalysis = computed(() => {
  return [
    {
      title: t('report-by-branch.bookings-tally-details'),
      routeName: '/report/bookings-tally-details',
    },
    {
      title: t('report-by-branch.bookings-by-date'),
      routeName: '/report/bookings-by-date',
    },
    {
      title: t('report-by-branch.bookings-by-month'),
      routeName: '/report/bookings-by-month',
    },
    {
      title: t('report-by-branch.bookings-by-resource'),
      routeName: '/report/bookings-by-resource',
    },
    {
      title: t('report-by-branch.bookings-by-day-of-week'),
      routeName: '/report/bookings-by-day-of-week',
    },
    {
      title: t('report-by-branch.bookings-by-time'),
      routeName: '/report/bookings-by-time',
    },
    {
      title: t('report-by-branch.bookings-by-source'),
      routeName: '/report/bookings-by-source',
    },
    {
      title: t('report-by-branch.booking-ratio'),
      routeName: '/report/booking-ratio',
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
