<template>
  <main class="dashboard">
    <h3 class="dashboard__title">{{ $t('dashboard.welcomeTitle') }}</h3>

    <div class="dashboard__grid">
      <Card
        v-for="card in dashboardCards"
        :key="card.routeName"
        class="dashboard__card"
        @click="navigateTo(card.routeName)"
      >
        <template #content>
          <div class="dashboard__card-body">
            <i :class="card.icon" class="dashboard__card-icon" />
            <div class="dashboard__card-info">
              <span class="dashboard__card-title">{{ $t(card.labelKey) }}</span>
              <span class="dashboard__card-desc">{{ $t(card.descKey) }}</span>
            </div>
            <i class="pi pi-chevron-right dashboard__card-arrow" />
          </div>
        </template>
      </Card>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouterNavigation } from '@/composables/useRouterNavigation'

import type { RouteNameType } from '@/constants'
import { ROUTE_NAMES } from '@/constants'

interface DashboardCard {
  routeName: RouteNameType
  labelKey: string
  descKey: string
  icon: string
}

const { navigateTo } = useRouterNavigation()

const dashboardCards: DashboardCard[] = [
  {
    routeName: ROUTE_NAMES.RELEASE,
    labelKey: 'menu.release',
    descKey: 'dashboard.releaseDesc',
    icon: 'pi pi-box',
  },
  {
    routeName: ROUTE_NAMES.MY_ISSUES,
    labelKey: 'menu.myIssues',
    descKey: 'dashboard.myIssuesDesc',
    icon: 'pi pi-flag',
  },
  {
    routeName: ROUTE_NAMES.MERGE_REQUESTS,
    labelKey: 'menu.mergeRequests',
    descKey: 'dashboard.mergeRequestsDesc',
    icon: 'pi pi-code',
  },
  {
    routeName: ROUTE_NAMES.PREFERENCES,
    labelKey: 'menu.preferences',
    descKey: 'dashboard.preferencesDesc',
    icon: 'pi pi-cog',
  },
]
</script>

<style scoped lang="scss">
.dashboard {
  &__title {
    color: var(--p-text-color);
    margin-bottom: 1rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  &__card {
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  &__card-body {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__card-icon {
    font-size: 1.75rem;
    color: var(--p-primary-color);
    flex-shrink: 0;
  }

  &__card-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }

  &__card-title {
    font-weight: 600;
    font-size: 1rem;
    color: var(--p-text-color);
  }

  &__card-desc {
    font-size: 0.85rem;
    color: var(--p-text-muted-color);
    margin-top: 0.25rem;
  }

  &__card-arrow {
    color: var(--p-text-muted-color);
    font-size: 0.875rem;
    flex-shrink: 0;
  }
}

@include respond-below(md) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
