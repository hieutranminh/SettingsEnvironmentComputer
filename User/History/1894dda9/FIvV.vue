<template>
  <Dialog
    v-model:visible="isVisible"
    :header="formTitle"
    :modal="true"
    :draggable="false"
    :resizable="false"
    :pt="{ root: { style: { width: '600px' } } }"
    :key="`prepaid-card-action-${prepaidCardActionData.prepaidCardId || 'new'}`"
    class="prepaid-card-action"
    @show="onLoadForm"
    @hide="handleDialogHide"
  >
    <div class="prepaid-card-form">
      <!-- Prepaid Card Type -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}Type`"
          :width="'40%'"
          :label="$t('prepaid-cards.prepaid-card-type')"
        />
        <div class="inline-group">
          <RadioButtonGroup
            v-model="prepaidCardActionData.prepaidCardType"
            class="prepaid-card-type-group"
            @change="handlePrepaidCardTypeChange"
          >
            <div class="radio-item">
              <RadioButton
                :value="PREPAID_CARD_TYPE.DEPOSIT"
                :disabled="!isAllowEdit"
                inputId="prepaidCardTypeDeposit"
              />
              <label for="prepaidCardTypeDeposit">{{ $t('prepaid-cards.deposit-card') }}</label>
            </div>
            <div class="radio-item">
              <RadioButton
                :value="PREPAID_CARD_TYPE.DISCOUNT"
                :disabled="!isAllowEdit"
                inputId="prepaidCardTypeDiscount"
              />
              <label for="prepaidCardTypeDiscount">{{ $t('prepaid-cards.discount-card') }}</label>
            </div>
          </RadioButtonGroup>
        </div>
      </div>

      <!-- Prepaid Card Name -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}Name`"
          :width="fieldWidth"
          :label="$t('prepaid-cards.prepaid-card-name')"
          :required="true"
        />
        <InputText
          ref="prepaidCardNameRef"
          v-model="prepaidCardActionData.prepaidCardName"
          :disabled="!isAllowEdit"
          class="w-full"
          :maxLength="PREPAID_CARD_DATA_RULES.MAX_NAME_LENGTH"
        />
      </div>

      <!-- Sales Price -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}SalesPrice`"
          :width="'40%'"
          :label="$t('prepaid-cards.sales-price')"
          :required="true"
        />
        <AhaInputMoney
          v-model="prepaidCardActionData.price"
          align="left"
          :allow-empty="!editForm"
          :default-zero-when-empty="editForm"
          :show-empty-when-zero="false"
          :max-length="MAX_SALES_LENGTH"
        />
      </div>

      <!-- Earned Amount / Initial Balance -->
      <div class="field" v-if="prepaidCardActionData.prepaidCardType === PREPAID_CARD_TYPE.DEPOSIT">
        <LabelField
          :field-id="`${idPrefix}Earned`"
          :width="'40%'"
          :label="$t('prepaid-cards.earned-amount')"
          :required="true"
        />
        <div class="earn-help">
          <AhaInputMoney
            v-model="prepaidCardActionData.chargeAmount"
            align="left"
            :allow-empty="true"
            :max-length="MAX_SALES_LENGTH"
          />
          <span class="charge-amount-help">{{
            $t('prepaid-cards.please-enter-the-actual-amount-available')
          }}</span>
        </div>
      </div>

      <!-- Salary(Sales) -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}Salary`"
          :width="'40%'"
          :label="$t('prepaid-cards.salary-sales')"
        />
        <div class="salary-group">
          <AhaInputMoney
            ref="saleSalaryRef"
            v-model="saleSalary"
            align="left"
            :max-value="maxSalaryValue"
            :max-length="maxLengthSalary"
            :allow-empty="true"
            class="salary-input"
          />
          <div class="inline-group">
            <RadioButtonGroup
              v-model="prepaidCardActionData.salarySalesType"
              class="salary-sales-type-group"
              :disabled="!isAllowEdit"
              @change="handleChangeSalary"
            >
              <div class="radio-item">
                <RadioButton inputId="salarySalesTypePercent" :value="SALARY_TYPE.PERCENT" />
                <label for="salarySalesTypePercent">%</label>
              </div>
              <div class="radio-item">
                <RadioButton inputId="salarySalesTypeAmount" :value="SALARY_TYPE.AMOUNT" />
                <label for="salarySalesTypeAmount">{{ $t('goods.prepaid-services.amount') }}</label>
              </div>
            </RadioButtonGroup>
          </div>
        </div>
      </div>

      <!-- Validity -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}Validity`"
          :width="'40%'"
          :label="$t('prepaid-cards.validity')"
          :required="true"
        />
        <div class="validity-group">
          <div class="validity-input">
            <AhaInputMoney
              ref="validityRef"
              v-model="prepaidCardActionData.validity"
              align="left"
              class="validity-money-input"
              :disabled="noLimit"
              :max-value="validityMaxValue"
              :max-length="validityLength"
              :no-limit="noLimit"
              :allow-empty="true"
            />
            <div class="inline-group">
              <RadioButtonGroup
                v-model="prepaidCardActionData.validityType"
                class="validity-type-group"
                @change="handleValidityChange"
              >
                <div class="radio-item">
                  <RadioButton
                    :value="VALIDITY_TYPE.MONTH"
                    inputId="validityTypeMonth"
                    :disabled="noLimit"
                  />
                  <label for="validityTypeMonth">{{ $t('general.month') }}</label>
                </div>
                <div class="radio-item">
                  <RadioButton
                    :value="VALIDITY_TYPE.DAY"
                    inputId="validityTypeDay"
                    :disabled="noLimit"
                  />
                  <label for="validityTypeDay">{{ $t('general.days') }}</label>
                </div>
              </RadioButtonGroup>
            </div>
          </div>

          <div class="checkbox-field">
            <Checkbox :inputId="`${idPrefix}NoLimit`" v-model="noLimit" binary />
            <label :for="`${idPrefix}NoLimit`">{{ $t('prepaid-cards.no-limit') }}</label>
          </div>
        </div>
      </div>

      <!-- Discount for Clients having this card -->
      <div class="field">
        <div class="checkbox-field">
          <Checkbox
            :inputId="`${idPrefix}DiscountHavingCard`"
            v-model="prepaidCardActionData.discountForClient"
            :disabled="isDisabledCheckbox"
            binary
          />
          <label
            :for="`${idPrefix}DiscountHavingCard`"
            :class="{ 'not-allowed-discount-client': isDisabledCheckbox }"
            >{{ $t('prepaid-cards.discount-for-having-card') }}</label
          >
        </div>
      </div>

      <!-- Discount for Services -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}DiscountService`"
          :width="'40%'"
          :label="$t('prepaid-cards.discount-for-services')"
        />
        <div class="percent-input">
          <InputMoneyImask
            v-model="prepaidCardActionData.discountForService"
            align="left"
            :decimal="1"
            :disabled="!prepaidCardActionData.discountForClient || !isAllowEdit"
            :max-value="COMMON_DATA_RULES.MAX_PERCENT_VALUE"
            :max-length="SALARY_PERCENT_MAX_LENGTH"
          />
          <span class="unit">%</span>
        </div>
      </div>

      <!-- Discount for Products -->
      <div class="field">
        <LabelField
          :field-id="`${idPrefix}DiscountProduct`"
          :width="'40%'"
          :label="$t('prepaid-cards.discount-for-products')"
        />
        <div class="percent-input">
          <InputMoneyImask
            v-model="prepaidCardActionData.discountForProduct"
            align="left"
            :decimal="1"
            :disabled="!prepaidCardActionData.discountForClient || !isAllowEdit"
            :max-value="COMMON_DATA_RULES.MAX_PERCENT_VALUE"
            :max-length="SALARY_PERCENT_MAX_LENGTH"
          />
          <span class="unit">%</span>
        </div>
      </div>

      <div v-if="editForm" class="field">
        <LabelField
          :field-id="`${idPrefix}DiscountForClient`"
          :width="'40%'"
          :label="$t('general.status')"
        />

        <div class="inline-group">
          <ToggleSwitch v-model="status" :disabled="!isAllowEdit" @change="handleStatusChange" />
          <span>{{ statusText }}</span>
        </div>
      </div>
    </div>

    <FormErrorList :errors="errors" />

    <template #footer>
      <div class="dialog-footer">
        <Button severity="primary" @click="handleSave">{{ $t('general.save') }}</Button>
        <Button severity="info" @click="handleCancel">{{ $t('general.cancel') }}</Button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import AhaInputMoney from '@/components/common/AhaInputMoney.vue'
import { usePrepaidCardAction } from '@/composables/goods/prepaid-card/usePrepaidCardAction'
import { computed } from 'vue'
import LabelField from '@/components/common/LabelField.vue'
import { FORM_ACTION, PREPAID_CARD_TYPE, SALARY_TYPE, VALIDITY_TYPE } from '@/constants'
import { COMMON_DATA_RULES, PREPAID_CARD_DATA_RULES } from '@/constants/systemRules'
import { usePrepaidCardStore } from '@/stores/goods/PrepaidCard'
import InputMoneyImask from '@/components/forms/InputMoneyImask.vue'
// Props
const props = defineProps<{
  visible: boolean
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

// Constants
const MAX_SALES_LENGTH = 12

// Helpers
const prepaidCardStore = usePrepaidCardStore()

// Computed
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const {
  formTitle,
  prepaidCardActionData,
  errors,
  status,
  maxLengthSalary,
  saleSalary,
  validityLength,
  isAllowEdit,
  noLimit,
  validityMaxValue,
  fieldWidth,
  statusText,
  editForm,
  maxSalaryValue,
  isDisabledCheckbox,
  prepaidCardNameRef,
  saleSalaryRef,
  validityRef,
  onLoadForm,
  resetForm,
  handleChangeSalary,
  handleValidityChange,
  handleAddPrepaidCard,
  handleEditPrepaidCard,
  handlePrepaidCardTypeChange,
  handleStatusChange,
} = usePrepaidCardAction()

const idPrefix = 'prepaidCard_'
const SALARY_PERCENT_MAX_LENGTH = 3

const handleDialogHide = (): void => {
  resetForm()
}

const handleSave = async (): Promise<void> => {
  if (prepaidCardStore.prepaidCardAction.action === FORM_ACTION.ADD) {
    const response = await handleAddPrepaidCard()
    if (response?.isOK) {
      emit('success')
      emit('update:visible', false)
    }
  } else {
    const response = await handleEditPrepaidCard()
    if (response?.isOK) {
      emit('success')
      emit('update:visible', false)
    }
  }
}

const handleCancel = (): void => {
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.prepaid-card-action {
  width: 600px;
}
.prepaid-card-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  .field:first-child {
    background-color: red;
  }
}

.field {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  :deep(.label-field) {
    @include mobile {
      font-weight: bold;
    }
  }

  @include mobile {
    flex-direction: column;
    gap: 5px;
  }

  input {
    flex: 1;
    height: 32px;

    @include mobile {
      width: 100%;
      flex: unset;
    }
  }
}

.inline-group {
  display: inline-flex;
  align-items: center;
  gap: 14px;

  .prepaid-card-type-group,
  .salary-sales-type-group,
  .validity-type-group {
    display: flex;
    align-items: center;
    gap: 14px;
  }
}

.radio-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.earn-help {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  .charge-amount-help {
    color: $blue-color;
  }

  .help {
    color: $primary-color;
  }
}

.salary-group {
  display: flex;
  align-items: center;
  gap: 12px;

  :deep(.aha-input-money) {
    width: 170px;

    @include mobile {
      width: 100%;
    }
  }

  @include mobile {
    flex-direction: column;
    align-items: flex-start;
    width: 200px;
  }
}

.validity-group {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-direction: column;
  align-items: flex-start;

  .validity-input {
    display: flex;
    gap: 12px;
    max-width: 200px;
    width: 200px;

    .validity-money-input {
      min-width: 170px;

      @include mobile {
        width: 100%;
        min-width: 100%;
      }
    }

    @include mobile {
      flex-direction: column;
    }
  }
}

.checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  .not-allowed-discount-client {
    color: $gray-400;
    cursor: not-allowed;
  }
}

.percent-input {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  :deep(.aha-input-number) {
    width: 170px;
  }

  @include mobile {
    width: 224px;

    input {
      width: 100%;
    }
  }
}

.dialog-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  :deep(button) {
    min-width: 100px;
    padding: 10px 0;
  }
}
</style>
