<template>
  <main>
    <section>
      <div class="app-title">
        <span>{{ $t('payments.title') }}</span>

        <div class="app-title-buttons" v-if="authStore.shop.expired">
          <Button :label="$t('general.go-to-login')" severity="primary" />
        </div>
      </div>

      <div class="app-content">
        <div class="payment-section">
          <div class="summary-grid">
            <div class="shop-name">{{ shopName }}</div>
            <div class="balance">
              {{ $t('payments.netmoney-balance') }} :
              {{ formatCurrency(shopNetMoneyBalance) }}
            </div>
            <div class="expiry" v-if="!monthlyFeeInfo?.autoTransfer">
              {{ $t('payments.expiry-date') }} :
              {{ formatTimeStampToDate(shopExpiryDate) }}
            </div>
            <div class="expiry" v-else>
              {{ $t('payments.fee-is-on-automatic-transfer') }}
            </div>
          </div>

          <div v-if="!depositlessPaymentSuccess" class="pay-select">
            <DataTable
              :value="settingsRows"
              class="payment-table"
              :showGridlines="false"
              responsive-layout="scroll"
            >
              <Column field="label" class="pay-th">
                <template #body="{ data }">
                  <div class="pay-th">{{ data.label }}</div>
                </template>
              </Column>
              <Column>
                <template #body="{ data }">
                  <div class="bd-none">
                    <!-- Purpose row -->
                    <template v-if="data.key === 'purpose'">
                      <span v-if="!monthlyFeeInfo?.autoTransfer" class="radio-tab">
                        <span
                          v-for="option in purposeOptions"
                          :key="option.value"
                          class="radio-item"
                        >
                          <RadioButton
                            :inputId="'purpose-' + option.value"
                            name="purpose-options"
                            :value="option.value"
                            v-model="purposeCheck"
                            @change="onChangePurpose"
                          />
                          <label :for="'purpose-' + option.value">{{ option.label }}</label>
                        </span>
                      </span>
                      <span v-else class="radio-tab">
                        <span
                          v-for="option in PAYMENT_PURPOSE_OPTIONS_FOR_AUTO_TRANSFER"
                          :key="option.value"
                          class="radio-item"
                        >
                          <RadioButton
                            :inputId="'purpose-' + option.value"
                            name="purpose-options"
                            :value="option.value"
                            v-model="purposeCheck"
                            @change="onChangePurpose"
                          />
                          <label :for="'purpose-' + option.value">{{ $t(option.text) }}</label>
                        </span>
                      </span>
                    </template>
                    <!-- Payment method row -->
                    <template v-else-if="data.key === 'method'">
                      <div class="radio-tab">
                        <span
                          v-for="option in paymentMethodCheck"
                          :key="option.value"
                          class="radio-item"
                        >
                          <RadioButton
                            :inputId="'method-' + option.value"
                            :value="option.value"
                            name="method-options"
                            v-model="methodCheck"
                          />
                          <label :for="'method-' + option.value">{{ $t(option.text) }}</label>
                        </span>
                      </div>
                    </template>
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>

          <NetmoneyChargePayment
            v-if="
              purposeCheck === ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE && isOnlinePayment
            "
            :data="purposeCheck"
            :payment-method="methodCheck"
          />

          <CalculateBaseFeePayment
            v-if="purposeCheck === ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE"
            :payment-method="methodCheck"
            :purpose-check="purposeCheck"
            :netmoney-balance="shopNetMoneyBalance"
          />

          <AutomaticTransfer
            v-if="
              methodCheck === ADMIN_SALES_ENUMS.PAYMENT_METHOD.AUTOMATIC_TRANSFER &&
              purposeCheck === ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE &&
              isEnableNetMoneyChargeByAutoTransfer
            "
            :outstanding-amount="outStandingAmount"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePayment } from '@/composables/payment/usePayment'
import { useFormat } from '@/composables/useFormat'
import { ADMIN_SALES_ENUMS, PAYMENT_PURPOSE_OPTIONS_FOR_AUTO_TRANSFER } from '@/constants'
import { useAuthStore } from '@/stores/auth/auth'
import AutomaticTransfer from '@/views/payment/paymentView/partial/AutomaticTransfer.vue'
import CalculateBaseFeePayment from '@/views/payment/paymentView/partial/CalculateBaseFeePayment.vue'
import NetmoneyChargePayment from '@/views/payment/paymentView/partial/NetmoneyChargePayment.vue'

// Helpers
const { t } = useI18n()
const { formatCurrency } = useFormat()
const authStore = useAuthStore()

// Reactives
const isExpired = ref(false)
const language = ref('')

// Computed
const isOnlinePayment = computed(() => {
  return (
    methodCheck.value === ADMIN_SALES_ENUMS.PAYMENT_METHOD.CARD ||
    methodCheck.value === ADMIN_SALES_ENUMS.PAYMENT_METHOD.REAL_TIME_BANK_TRANSFER ||
    methodCheck.value === ADMIN_SALES_ENUMS.PAYMENT_METHOD.DEPOSITLESS_VIRTUAL
  )
})

const purposeOptions = computed(() => [
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.NETMONEY_CHARGE,
    label: t('payments.netmoney-charge-texting'),
  },
  {
    value: ADMIN_SALES_ENUMS.PAYMENT_PURPOSE.BASE_FEE,
    label: t('payments.expiry-date-extension'),
  },
])

const settingsRows = computed(() => [
  { key: 'purpose', label: t('payments.purpose') },
  { key: 'method', label: t('payments.payment-method') },
])

// Composables
const {
  purposeCheck,
  methodCheck,
  depositlessPaymentSuccess,
  shopName,
  monthlyFeeInfo,
  shopExpiryDate,
  paymentMethodCheck,
  shopNetMoneyBalance,
  outStandingAmount,
  isEnableNetMoneyChargeByAutoTransfer,
  loadShopUsage,
  onChangePurpose,
  formatTimeStampToDate,
} = usePayment()

onMounted(async () => {
  if (authStore.shop.expired) {
    isExpired.value = true
    nextTick(() => {
      language.value = authStore.user.language
    })
  } else {
    isExpired.value = false
  }

  await loadShopUsage(authStore.shop.shopId)
})
</script>

<style scoped lang="scss">
.app-title {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .app-title-buttons {
    button {
      padding: 8px 10px;

      :deep(span) {
        font-size: 14px;
        margin-left: 0;
      }
    }
  }
}

.app-content {
  padding: 20px 0;

  .setup-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h3 {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .payment-section {
    background: $white;
    padding: 10px;

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px 16px;
      font-weight: 900;
      align-items: center;
      margin-bottom: 12px;
      background-color: var(--p-gray-200);
      border: 1px dotted var(--p-gray-300);
      height: 60px;
      color: var(--p-gray-500);

      .shop-name,
      .balance,
      .expiry {
        text-align: center;
      }
    }

    .pay-select {
      margin-bottom: 16px;
    }

    .payment-table {
      width: 100%;
      overflow: hidden;

      .pay-th {
        text-align: center;
        font-weight: 600;
        height: 100%;
      }

      :deep(.p-datatable-table-container) {
        .p-datatable-thead {
          display: none;
        }

        .p-datatable-tbody > tr {
          > td {
            vertical-align: middle;
            padding: 0;

            &:first-child {
              width: 200px;
              background: var(--p-neutral-500);
              border-bottom: 1px solid var(--p-gray-300);

              @media (width <= 767px) {
                width: auto;
              }

              .pay-th {
                color: $white;
                text-align: center;
                font-weight: 500;
                font-size: 0.875rem;
              }
            }

            &:last-child {
              border: none;

              .bd-none {
                padding: 12px 16px;
              }
            }
          }

          &:not(:first-child) > td {
            border-top: 0;
          }

          &:last-child > td {
            border-bottom: 0;
          }
        }
      }
    }

    .radio-tab {
      display: inline-flex;
      gap: 24px;

      @media (width <= 767px) {
        flex-direction: column;
        gap: 5px;
      }
    }

    .radio-item {
      display: inline-flex;
      align-items: center;
      gap: 8px;

      :deep(.p-radiobutton) {
        width: 18px;
        height: 18px;

        .p-radiobutton-box {
          width: 18px;
          height: 18px;

          &.p-highlight {
            border-color: var(--p-sky-500);
            background: $white;

            .p-radiobutton-icon {
              background: var(--p-sky-500);
              width: 10px;
              height: 10px;
              border-radius: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }
        }
      }

      label {
        font-size: 0.875rem;
        color: var(--p-gray-700);
        cursor: pointer;
      }
    }

    .depositless-area {
      .panel {
        border: 1px solid #e5e7eb;
        border-radius: 4px;
        background: #fff;
        display: grid;
        grid-template-columns: 160px 1fr;
      }

      .depositless-title {
        font-weight: 700;
        margin-bottom: 8px;
      }

      .panel-left {
        background: #4b5563;
        color: #fff;
        padding: 16px;
        font-weight: 600;
      }

      .panel-right {
        padding: 16px;
      }

      .controls {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .amount-select {
        height: 36px;
        padding: 0 10px;
      }

      .issue-btn {
        padding: 0.5rem 1rem;
        margin-left: auto;
      }

      .helper-text {
        color: #ef4444;
        margin: 0;
        flex: 1;

        .underline {
          text-decoration: underline;
        }
      }

      .notes {
        margin-top: 16px;
        border: 1px solid #e5e7eb;
        padding: 16px;
        background: #fff;

        ul {
          list-style: none;
          padding-left: 0;
          margin: 0 0 12px;

          li::before {
            content: '※ ';
            color: #111827;
          }
        }
      }

      .tax-info {
        color: #ef4444;
      }
    }
  }

  /* Responsive (mobile) */
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
  @media (width <= 768px) {
    .payment-section {
      .summary-grid {
        height: auto;
        grid-template-columns: 1fr;
        padding: 12px 16px;

        .shop-name,
        .balance,
        .expiry {
          text-align: left;
        }
      }

      .payment-table {
        .pay-th {
          width: 120px;
          padding: 10px 12px;
        }
      }

      .depositless-area {
        .panel {
          grid-template-columns: 120px 1fr;
        }
      }

      .controls {
        flex-direction: column;
        align-items: flex-start;
      }

      .issue-btn {
        width: fit-content;
        margin-left: 0;
      }
    }
  }
}
</style>
