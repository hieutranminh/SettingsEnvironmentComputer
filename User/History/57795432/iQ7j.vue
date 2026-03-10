<template>
  <div class="navigation-example">
    <h3>Navigation Example</h3>

    <!-- Example navigation buttons using route constants -->
    <div class="nav-buttons">
      <button @click="navigateToHome">Go to Home</button>
      <button @click="navigateToUsers">Go to Users</button>
      <button @click="navigateToUserDetail">Go to User Detail (ID: 123)</button>
      <button @click="navigateToPayment">Go to Payment</button>
      <button @click="navigateToGoods">Go to Goods</button>
      <button @click="navigateToHeadquarterNotice">Go to Headquarter Notice</button>
      <button @click="navigateToHeadquarterNoticeDetail">Go to Notice Detail (ID: 456)</button>
    </div>

    <!-- Example of checking current route -->
    <div class="current-route-info">
      <p>Current Route: {{ currentRouteName }}</p>
      <p>Is Home Route: {{ isHomeRoute }}</p>
      <p>Is Board Route: {{ isBoardRoute }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { HOME_ROUTES, USER_ROUTES, PAYMENT_ROUTES, GOODS_ROUTES, BOARD_ROUTES } from '@/constants/routeNames'
import { useRouterNavigation, useRouteMatcher } from '@/utils/router'

const router = useRouter()
const { navigateTo, navigateToWithParamsAndQuery } = useRouterNavigation()
const { isCurrentRoute, isCurrentRouteIn } = useRouteMatcher()

// Computed properties for current route information
const currentRouteName = computed(() => router.currentRoute.value.name)
const isHomeRoute = computed(() => isCurrentRoute(HOME_ROUTES.HOME))
const isBoardRoute = computed(() =>
  isCurrentRouteIn([
    BOARD_ROUTES.HEADQUARTER_NOTICE,
    BOARD_ROUTES.BRANCH_BOARD,
    BOARD_ROUTES.POPUPS,
    BOARD_ROUTES.AHASOFT_NOTICE,
  ]),
)

// Navigation methods using route constants
const navigateToHome = () => {
  navigateTo(HOME_ROUTES.HOME)
}

const navigateToUsers = () => {
  navigateTo(USER_ROUTES.USERS)
}

const navigateToUserDetail = () => {
  navigateToWithParamsAndQuery(USER_ROUTES.USER_DETAIL, { id: '123' })
}

const navigateToPayment = () => {
  navigateTo(PAYMENT_ROUTES.PAYMENT)
}

const navigateToGoods = () => {
  navigateTo(GOODS_ROUTES.GOODS)
}

const navigateToHeadquarterNotice = () => {
  navigateTo(BOARD_ROUTES.HEADQUARTER_NOTICE)
}

const navigateToHeadquarterNoticeDetail = () => {
  navigateToWithParamsAndQuery(BOARD_ROUTES.HEADQUARTER_NOTICE_DETAIL, { id: '456' })
}
</script>

<style scoped>
.navigation-example {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 1rem 0;
}

.nav-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.nav-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
}

.nav-buttons button:hover {
  background: #e5e5e5;
}

.current-route-info {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
}

.current-route-info p {
  margin: 0.25rem 0;
}
</style>
