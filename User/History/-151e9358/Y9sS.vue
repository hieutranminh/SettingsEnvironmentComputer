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
            <router-link v-for="index in 10" :key="index" :to="`/report-by-branch/sales-by-date`">
              - Recommended Clients by Month
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

<script setup lang="ts"></script>

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
        gap: 30px;
      }
    }
  }

  .report-by-branch-column {
    h3 {
      text-transform: uppercase;
      font-size: 1rem;
      font-weight: 900;
    }

    .report-by-branch-content {
      a {
        display: block;
        text-decoration: none;
        color: var(--p-gray-950);
      }
    }
  }
}
</style>
