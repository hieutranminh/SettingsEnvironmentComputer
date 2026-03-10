<template>
  <div>
    <b-modal
      v-bind="$attrs"
      :id="modalId"
      ref="sales_action_modal_ref"
      :title="modalTitle"
      :no-close-on-backdrop="true"
      :modal-class="['sales-action-modal', modalId]"
      hide-footer
      v-on="$listeners"
      @hide="onCancel"
      @show="onLoadForm"
      @hidden="onModalHidden"
    >
      <!-- this button is created to focus which needing for case press ESC to close nested modals -->
      <aha-button id="sales-action-modal-trigger-focus" />
      <div class="view-pc">
        <sales-action-client-account
          :client_account="clientAccount"
          :is-deleted-client="isDeletedClient"
          class="sales-action-client-account"
        >
          <template
            v-if="isSalesOfBookingNaver"
            slot="extra.information"
          >
            <sales-naver-information :naver-sales-info="sales.fields.naver_sales_info" />
          </template>
        </sales-action-client-account>

        <div class="sales-items-wrapper">
          <div
            v-if="!cannotEditSalesDetail"
            class="add-sales-item"
          >
            <div class="title">
              {{ $t('sales.select-sales-items') }}
            </div>
            <sales-goods-types
              :client="client"
              :is_show_modal="true"
              @clicked-goods-type="onClickedGoodsType"
            />
          </div>
          <div class="sales-items-table">
            <view-table :data="table_data">
              <template
                slot="deduction_points_col"
                slot-scope="{ column }"
              >
                <span class="deduction-points-title">{{ $t(column.label) }}</span>
              </template>
              <template
                slot="deduction_amount_col"
                slot-scope="{ column }"
              >
                <span class="deduction-amount-title">{{ $t(column.label) }}</span>
              </template>
              <template
                slot="goods_name"
                slot-scope="{ row }"
              >
                <div
                  :class="prepaidGoodsClass(row)"
                  class="active-block"
                >
                  {{ row.goods_name }}``
                </div>
              </template>
              <template
                slot="unit_price"
                slot-scope="{ row }"
              >
                <div
                  v-if="isDisabledSalesItemUnitPrice(row)"
                  class="disable-block"
                >
                  {{ formatMoney(row.unit_price, 0) }}
                </div>
                <div
                  v-else
                  class="active-block"
                  @click="onActionSalesItem(row, sales_options.sales_item_action_type.unit_price)"
                >
                  {{ formatMoney(row.unit_price, 0) }}
                </div>
              </template>

              <template
                slot="quantity"
                slot-scope="{ row }"
              >
                <div
                  v-if="isDisabledSalesItemQuantity(row)"
                  class="disable-block"
                >
                  {{ row.quantity }}
                </div>
                <div
                  v-else-if="!isMobile()"
                  class="active-block"
                >
                  <input-money-with-inline-control
                    :key="`input-money-with-inline-control-${row.ui_id}`"
                    v-model="row.quantity"
                    :allow-empty="false"
                    :max-length="maxSalesItemQuantityLength"
                    @input="onInputSalesItemQuantity(row)"
                  />
                </div>
              </template>

              <template
                slot="discount_value"
                slot-scope="{ row }"
              >
                <div
                  v-if="isDisabledSalesItemDiscount(row)"
                  class="disable-block"
                >
                  <div class="discount-value">
                    <span
                      v-if="row.discount_category_id > 0"
                      :id="'discount-' + row.key"
                      class="sales-items-table__discount-tag tag-dc"
                    >DC</span>
                    <div>{{ formatSalesItemDiscount(row) }}</div>
                  </div>
                  <aha-tooltip
                    v-if="row.discount_category_id > 0"
                    :target="'discount-' + row.key"
                    custom-class="discount-tooltip"
                    boundary="sales-items-table__discount-tag"
                  >
                    <p>{{ row.discount_category_name }}</p>
                  </aha-tooltip>
                </div>
                <div
                  v-else
                  class="active-block"
                >
                  <div
                    class="discount-value"
                    @click="onActionSalesItem(row, sales_options.sales_item_action_type.discount_action)"
                  >
                    <span
                      v-if="row.discount_category_id > 0"
                      :id="'discount-' + row.key"
                      class="sales-items-table__discount-tag tag-dc"
                    >DC</span>
                    <div>{{ formatSalesItemDiscount(row) }}</div>
                  </div>
                  <aha-tooltip
                    v-if="row.discount_category_id > 0"
                    :target="'discount-' + row.key"
                    custom-class="discount-tooltip"
                    boundary="sales-items-table__discount-tag"
                  >
                    <p>{{ row.discount_category_name }}</p>
                  </aha-tooltip>
                </div>
              </template>

              <template
                slot="amount"
                slot-scope="{ row }"
              >
                <div
                  v-if="isDisabledSalesItemAmount(row)"
                  :class="{ 'deduct-service': isSalesItemDeductPrepaidService(row) }"
                  class="disable-block"
                >
                  <div class="amount-calculated">
                    {{ formatDisabledSalesItemAmountOfPrepaidServiceOrDeductPrepaidService(row) }}
                  </div>
                </div>
                <div
                  v-else-if="isSalesItemDeductPrepaidService(row)"
                  class="deduct-service"
                >
                  <div class="amount-calculated">
                    {{ formatMoney(row.unit_price * row.quantity, 0) }}
                  </div>
                </div>
                <div
                  v-else
                  class="active-block"
                  @click="onActionSalesItem(row, sales_options.sales_item_action_type.amount)"
                >
                  {{ formatMoney(row.amount, 0) }}
                  <div
                    v-if="isDepositCard(row)"
                    class="initial-balance"
                  >
                    ({{ formatPrepaidCardInitialBalance(row) }})
                  </div>
                </div>
              </template>

              <template
                slot="staffs"
                slot-scope="{ row }"
              >
                <div
                  v-if="cannotEditSalesDetail"
                  class="disable-block"
                >
                  <p
                    v-for="(formattedValue, index) in getFormattedSalesItemStaffs(row)"
                    :key="index"
                    v-html="formattedValue"
                  />
                </div>
                <div
                  v-else-if="(row.staffs || []).length > 0"
                  class="active-block"
                  @click="onActionSalesItem(row, sales_options.sales_item_action_type.staff_action)"
                >
                  <p
                    v-for="(formattedValue, index) in getFormattedSalesItemStaffs(row)"
                    :key="index"
                    v-html="formattedValue"
                  />
                </div>
                <div
                  v-else
                  class="active-block"
                  @click="onActionSalesItem(row, sales_options.sales_item_action_type.staff_action)"
                />
              </template>

              <template
                slot="sales_type_name"
                slot-scope="{ row }"
              >
                <div
                  v-if="cannotEditSalesDetail"
                  class="disable-block"
                >
                  {{ row.sales_type_name }}
                </div>
                <div
                  v-else
                  class="active-block"
                  @click="onActionSalesItem(row, sales_options.sales_item_action_type.sales_type_action)"
                >
                  {{ row.sales_type_name }}
                </div>
              </template>

              <template
                slot="deduction_points"
                slot-scope="{ row }"
              >
                <div
                  v-if="isDisabledSalesItemDeductionPoints(row)"
                  class="disable-block"
                >
                  <template v-if="row.deduction_points > 0">
                    {{ formatMoney(row.deduction_points, 0) }}
                  </template>
                </div>
                <template v-else>
                  <div
                    v-if="hasClient"
                    class="active-block"
                    @click="onActionSalesItem(row, sales_options.sales_item_action_type.deduction_point_action)"
                  >
                    <template v-if="row.deduction_points > 0">
                      {{ formatMoney(row.deduction_points, 0) }}
                    </template>
                  </div>
                  <div
                    v-else
                    class="no-action"
                  />
                </template>
              </template>

              <template
                slot="deduction_amount"
                slot-scope="{ row, props }"
              >
                <div :id="`tooltip-sales-action-card-deduction-${props.index}`">
                  <div
                    v-if="isDisabledSalesItemDeductionBalance(row)"
                    class="disable-block"
                  >
                    <template v-if="isSalesItemDeductPrepaidCard(row)">
                      {{ formatMoney(row.deduction_amount, 0) }}
                    </template>
                    <template v-if="isSalesItemDeductPrepaidService(row)">
                      {{ $t('sales.service-deduct') }}
                    </template>
                  </div>
                  <template v-else>
                    <div
                      v-if="hasClient"
                      class="active-block"
                      @click="onActionSalesItem(row, sales_options.sales_item_action_type.balance_deduction_action)"
                    >
                      <template v-if="row.deduction_amount > 0">
                        {{ formatMoney(row.deduction_amount, 0) }}
                      </template>
                    </div>
                    <div
                      v-else
                      class="no-action"
                    />
                  </template>
                </div>

                <aha-tooltip
                  :disabled="!isSalesItemDeductPrepaidCard(row) || !row.deducted_prepaid_goods_ref_name"
                  :target="`tooltip-sales-action-card-deduction-${props.index}`"
                  boundary="vgt-responsive"
                  custom-class="balance-deduction-tooltip"
                >
                  <p>{{ row.deducted_prepaid_goods_ref_name }}</p>
                </aha-tooltip>
              </template>

              <template
                slot="delete"
                slot-scope="{ row }"
              >
                <div
                  v-if="cannotEditSalesDetail"
                  class="disable-block"
                >
                  <aha-button disabled>
                    x
                  </aha-button>
                </div>
                <div
                  v-else
                  class="active-block"
                >
                  <aha-button
                    v-if="!isSalesEditItemIncludePrepaidGoodsOrPrepaidGoodsDeduction(row)"
                    @click="onDeleteSalesItem(row)"
                  >
                    x
                  </aha-button>
                </div>
              </template>
            </view-table>

            <p class="guide">
              {{ guideText }}
            </p>
          </div>
        </div>
        <div class="check-out-wrapper">
          <div class="row">
            <div class="col-12 title">
              {{ $t('sales.payment') }}
            </div>
          </div>
          <div class="check-out-content check-out-wrapper__check-out-content">
            <div class="check-out-content__brief-payment">
              <div class="brief-payment__payment">
                <div class="check-out-brief">
                  <ul>
                    <li class="sales-total-amount">
                      <div>{{ $t('sales.sales-action.sales-amount') }}</div>
                      <div>{{ salesAmount | formatNumber(0) }}</div>
                    </li>
                    <li class="discount-amount">
                      <div>{{ $t('sales.sales-action.discount') }}</div>
                      <div>{{ totalDiscount | formatNumber(0) }}</div>
                    </li>
                    <li class="total-amount">
                      <div>{{ $t('sales.sales-action.total') }}</div>
                      <div>{{ sales.fields.total_amount | formatNumber(0) }}</div>
                    </li>
                    <li
                      v-if="isShowPointDeductionAmountSalesSumary || isShowBalanceDeductionAmountSalesSumnary"
                      class="point-balance-deduction"
                    >
                      <div
                        v-if="isShowPointDeductionAmountSalesSumary"
                        class="point-deduction"
                      >
                        <div>{{ $t('sales.point-deduction') }}</div>

                        <div class="deduction-amount">
                          {{ sales.fields.deduction_points | formatNumber(0) }}

                          <span
                            v-if="sales.fields.deduction_points"
                            @click="handlePointDedutionRemove"
                          >x</span>
                        </div>
                      </div>
                      <div
                        v-if="isShowBalanceDeductionAmountSalesSumnary"
                        class="balance-deduction"
                      >
                        <div>{{ $t('sales.balance-deduction') }}</div>

                        <div class="deduction-amount">
                          {{ sales.fields.balance_deduction | formatNumber(0) }}

                          <span
                            v-if="sales.fields.balance_deduction"
                            @click="handleBalanceDeductionRemove"
                          >x</span>
                        </div>
                      </div>
                    </li>

                    <li
                      v-for="(payment, i) in sales.fields.payments"
                      :key="i"
                      :class="getPaymentClass(payment, i)"
                    >
                      <div class="payment-name">
                        {{ payment.payment_method_name }}
                      </div>
                      <div class="payment-amount">
                        <div
                          :id="`payment-${i}`"
                          :class="getPaymentAmountClass(payment)"
                          @click="onClickUpdateBookingDeposit(payment)"
                        >
                          {{ formatPaymentAmount(payment) }}
                        </div>
                        <span
                          v-if="isEnabledSalesPaymentRemove(payment)"
                          @click="removeSalesPayment(payment)"
                        >x</span>
                        <aha-tooltip
                          v-if="isBookingDepositPaymentUpdatable(payment)"
                          :target="`payment-${i}`"
                          custom-class="update-booking-deposit-tooltip"
                        >
                          <p v-html="$t('sales.click-to-add-a-refund')" />
                        </aha-tooltip>
                      </div>
                      <div
                        v-if="payment.payment_date_time_ts > 0"
                        class="payment-date"
                      >
                        [{{ $t('sales.paid-date') }} {{ payment.payment_date_time }}]
                      </div>
                    </li>

                    <li
                      :class="{ 'change': sales.fields.outstanding < 0 }"
                      class="outstanding"
                    >
                      <template v-if="sales.fields.outstanding >= 0">
                        <div>{{ $t('sales.outstanding') }}</div>
                        <div>{{ sales.fields.outstanding | formatNumber(0) }}</div>
                      </template>
                      <template v-else>
                        <div>{{ $t('sales.change') }}</div>
                        <div>{{ sales.fields.outstanding * -1 | formatNumber(0) }}</div>
                      </template>
                    </li>

                    <li class="earn-loyalty-points">
                      <div>{{ $t('sales.earn-loyalty-points') }}</div>
                      <div
                        v-if="hasClient"
                        class="loyalty-points-contain"
                      >
                        <aha-input-money
                          v-model="sales.fields.earned_points"
                          :allow-empty="false"
                          :disabled="cannotEditSalesDetail"
                          :max-length="maxEarnLoyaltyPointsDisplayLength"
                          class="form-control input-money"
                        />
                        <span @click="loyaltyPointCalculate()">
                          <span><b-icon-calculator-fill class="loyalty-points-calculator" /></span>
                        </span>
                      </div>
                      <div v-else>
                        {{ formatMoney(sales.fields.earned_points, 0) }}
                      </div>
                    </li>
                  </ul>
                </div>
                <div
                  :class="{ 'payment-notes-date--edit': is_edit_mode }"
                  class="payment-notes-date"
                >
                  <div class="paying-notes">
                    <!-- <div class="title paying-notes__title">{{ $t('sales.discount-deduction') }}</div> -->
                    <div class="title paying-notes__title">
                      {{ $t('sales.deduction') }}
                    </div>
                    <div class="content paying-notes__content">
                      <div class="paying content__paying">
                        <div class="deduction-wrapper">
                          <div class="deduction-action">
                            <ul class="list-btn list-btn--discount-deduction">
                              <li :class="{ 'active': isHadSalesItem }">
                                <a
                                  v-if="isHadSalesItem"
                                  :class="{ 'disabled': !isShowDiscountBtn }"
                                  @click.prevent="onMultipleDiscountAction"
                                >{{ $t('sales.discount') }}</a>
                                <a v-else>{{ $t('sales.discount') }}</a>
                              </li>

                              <li :class="{ 'active': isRegisteredClientAndHadSalesItem }">
                                <a
                                  v-if="isRegisteredClientAndHadSalesItem"
                                  @click.prevent="onActionSalesDeductionPoints"
                                >{{
                                  $t('sales.point') }}</a>
                                <a v-else>{{ $t('sales.point') }}</a>
                              </li>

                              <li :class="{ 'active': isRegisteredClientAndHadSalesItem }">
                                <a
                                  v-if="isRegisteredClientAndHadSalesItem"
                                  @click.prevent="onActionSalesDeductionBalance"
                                >{{
                                  $t('sales.pay-by-balance') }}</a>

                                <a v-else>{{ $t('sales.pay-by-balance') }}</a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div class="payment-wrapper">
                          <select-payment-method-panel
                            v-if="form_showed"
                            :disabled="cannotEditSalesDetail"
                            :payment_method_setup="payment_method_setup"
                            :disable-payment-method-names="disablePaymentMethodNames"
                            @selected="onSelectedPaymentMethod"
                          />
                        </div>

                        <aha-naver-pay-at-salon
                          v-if="isShowNaverPayAtSalonButton"
                          :is-revise-external-payment="isRevisePayment"
                          @click="onClickNaverPayAtSalon"
                        />
                      </div>

                      <div
                        class="notes content__notes"
                      >
                        <!-- salesNotesTextarea wrapper first  -->
                        <b-form-textarea
                          ref="salesNotesTextareaFirst"
                          v-model="sales.fields.notes"
                          :rows="2"
                          :placeholder="$t('sales.notes')"
                          @input="handleNotesInput"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="date-time-wrapper">
                    <label>{{ $t('sales.sales-date') }}</label>
                    <div
                      :class="selectDateTimeWrapperClass"
                      @click="handleEditSalesDateClick"
                    >
                      <aha-date-picker
                        v-if="can_edit_sales_date && !isMobileView"
                        ref="salesDateRef"
                        v-model="invoice_date"
                        :popover-visibility="datePopoverVisibility"
                        class="date-time-wrapper__date-picker"
                        popover-direction="top"
                        @popover-did-appear="handleDatePopoverDidDAppear"
                      />
                      <div
                        v-else
                        class="invoice-date-disabled"
                      >
                        <span>{{ sales_invoice_date_text }}</span>
                      </div>
                      <select-time
                        v-model="invoice_time"
                        :disabled="!can_edit_sales_date"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="check-out-content__group-button">
              <div class="modal-footer sales-submit">
                <btn-action-group
                  :data="form_options"
                  :label_confirm="$t('general.complete')"
                  :class="{ 'sales-submit__group-button': sales.fields.sales_id }"
                  @cancel="onCancel"
                  @confirm="onClickSaveButton"
                />

                <slot
                  v-bind="draftSalesSlotProps"
                  name="draft-actions"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="view-mobile">
        <div class="sales-action-body">
          <div class="sales-client-info-wrapper">
            <sales-action-client-account
              :client_account="clientAccount"
              :is-deleted-client="isDeletedClient"
            />
          </div>

          <div class="sales-action-add-items--wrapper">
            <template v-if="isSalesOfBookingNaver">
              <sales-naver-information
                :triggers="'hover focus'"
                :naver-sales-info="sales.fields.naver_sales_info"
              />
            </template>

            <div
              v-if="!cannotEditSalesDetail"
              class="sales-action-add-items"
            >
              <aha-button
                class="btn-add-sales-item"
                @click="onClickedGoodsType(sales_options.sales_goods_type.service)"
              >
                {{ $t('sales.select-sales-items') }}
              </aha-button>
            </div>
          </div>

          <div class="total-amount-wrapper">
            <ul class="sales-items-wrapper">
              <li
                v-for="(row, i) in table_data.rows"
                :key="i"
                :class="{ 'show': row.show_sales_item }"
                class="sales-item-wrapper"
              >
                <div class="sales-item-header">
                  <label
                    :class="prepaidGoodsClass(row)"
                    class="goods-name"
                  >{{ row.goods_name }}</label>
                  <span>
                    <BIconTrash
                      v-if="!cannotEditSalesDetail && !isSalesEditItemIncludePrepaidGoodsOrPrepaidGoodsDeduction(row)"
                      class="sales-item__remove-icon"
                      @click="onDeleteSalesItem(row)"
                    />
                  </span>
                </div>

                <div :class="salesItemBodyClass(row.show_sales_item)">
                  <div class="sales-items-body__information-main">
                    <div class="information-main__content">
                      <div class="first-line">
                        <div class="unit-price">
                          <label>{{ $t('sales.unit-price') }}</label>
                          <div
                            v-if="isDisabledSalesItemUnitPrice(row)"
                            class="disable-block"
                          >
                            {{ formatMoney(row.unit_price, 0) }}
                          </div>
                          <div
                            v-else
                            class="active-block"
                            @click="onActionSalesItem(row, sales_options.sales_item_action_type.unit_price)"
                          >
                            {{ formatMoney(row.unit_price, 0) }}
                          </div>
                        </div>

                        <div class="qty">
                          <label>{{ $t('sales.q-ty') }}</label>
                          <div
                            v-if="isDisabledSalesItemQuantity(row)"
                            class="disable-block"
                          >
                            {{ row.quantity }}
                          </div>
                          <div
                            v-else-if="isMobile()"
                            class="active-block"
                          >
                            <aha-input-money
                              :key="`mobile-input-money-${row.ui_id}`"
                              v-model="row.quantity"
                              :max-length="maxSalesItemQuantityLength"
                              :allow-empty="false"
                              :min-value="0"
                              @input="onInputSalesItemQuantity(row)"
                            />
                          </div>
                        </div>

                        <div class="discount">
                          <label>{{ $t('sales.discount') }}</label>
                          <div class="discount-value-wrapper">
                            <div
                              v-if="isDisabledSalesItemDiscount(row)"
                              class="disable-block"
                            >
                              <div class="discount-value">
                                <span
                                  v-if="row.discount_category_id > 0"
                                  class="tag-dc"
                                >DC</span>
                                <div>{{ formatSalesItemDiscount(row) }}</div>
                              </div>
                            </div>
                            <div
                              v-else
                              class="active-block"
                            >
                              <div
                                class="discount-value"
                                @click="onActionSalesItem(row, sales_options.sales_item_action_type.discount_action)"
                              >
                                <span
                                  v-if="row.discount_category_id > 0"
                                  class="tag-dc"
                                >DC</span>
                                <div>{{ formatSalesItemDiscount(row) }}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="second-line">
                        <div class="amount">
                          <label>{{ $t('sales.amount') }}</label>

                          <div class="amount-value">
                            <div
                              v-if="isDisabledSalesItemAmount(row)"
                              :class="{ 'deduct-service': isSalesItemDeductPrepaidService(row) }"
                              class="disable-block"
                            >
                              <div class="amount-calculated">
                                {{ formatDisabledSalesItemAmountOfPrepaidServiceOrDeductPrepaidService(row) }}
                              </div>
                            </div>
                            <div
                              v-else-if="isSalesItemDeductPrepaidService(row)"
                              class="deduct-service"
                            >
                              <div class="amount-calculated">
                                {{ formatMoney(row.unit_price * row.quantity, 0) }}
                              </div>
                            </div>
                            <div
                              v-else
                              class="active-block"
                              @click="onActionSalesItem(row, sales_options.sales_item_action_type.amount)"
                            >
                              {{ formatMoney(row.amount, 0) }} <br>
                              <div
                                v-if="isDepositCard(row)"
                                class="initial-balance"
                              >
                                ({{ formatPrepaidCardInitialBalance(row) }})
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="staff">
                          <label>{{ $t('sales.staff') }}</label>
                          <div class="staff-value">
                            <div
                              v-if="cannotEditSalesDetail"
                              class="staff-content"
                            >
                              <div class="disable-block">
                                <p
                                  v-for="(formattedValue, index) in getFormattedSalesItemStaffs(row)"
                                  :key="index"
                                  v-html="formattedValue"
                                />
                              </div>
                            </div>
                            <div
                              v-else
                              class="staff-content"
                              @click="onActionSalesItem(row, sales_options.sales_item_action_type.staff_action)"
                            >
                              <p
                                v-if="row.staffs.length == 0"
                                class="btn-select-staff"
                              >
                                {{ $t('sales.not-selected') }}
                              </p>
                              <div
                                v-else
                                class="active-block"
                              >
                                <p
                                  v-for="(formattedValue, index) in getFormattedSalesItemStaffs(row)"
                                  :key="index"
                                  v-html="formattedValue"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="sales-item-body__information-sub">
                    <div class="third-line">
                      <div class="sales-type">
                        <label>{{ $t('sales.sales-type') }}</label>
                        <div
                          v-if="cannotEditSalesDetail"
                          class="disable-block"
                        >
                          {{ row.sales_type_name }}
                        </div>
                        <div
                          v-else
                          class="active-block"
                          @click="onActionSalesItem(row, sales_options.sales_item_action_type.sales_type_action)"
                        >
                          {{ row.sales_type_name }}
                        </div>
                      </div>

                      <div class="points-deduct">
                        <label>{{ $t('sales.points-deduct') }}</label>
                        <div
                          v-if="isDisabledSalesItemDeductionPoints(row)"
                          class="disable-block"
                        >
                          <template v-if="row.deduction_points > 0">
                            {{ formatMoney(row.deduction_points, 0) }}
                          </template>
                        </div>
                        <template v-else>
                          <div
                            v-if="hasClient"
                            class="active-block"
                            @click="onActionSalesItem(row, sales_options.sales_item_action_type.deduction_point_action)"
                          >
                            <template v-if="row.deduction_points > 0">
                              {{ formatMoney(row.deduction_points, 0) }}
                            </template>
                          </div>
                          <div
                            v-else
                            class="no-action"
                          />
                        </template>
                      </div>

                      <div class="balance-deduct">
                        <label>{{ $t('sales.balance-deduct') }}</label>
                        <div
                          v-if="isDisabledSalesItemDeductionBalance(row)"
                          :id="`tooltip-sales-action-card-deduction-mobile-${i}`"
                          class="disable-block"
                        >
                          <template v-if="isSalesItemDeductPrepaidService(row)">
                            {{ $t('sales.service-deduct') }}
                          </template>
                          <template v-if="isSalesItemDeductPrepaidCard(row)">
                            {{ formatMoney(row.deduction_amount, 0) }}
                          </template>

                          <aha-tooltip
                            :disabled="!isSalesItemDeductPrepaidCard(row) || !row.deducted_prepaid_goods_ref_name"
                            :target="`tooltip-sales-action-card-deduction-mobile-${i}`"
                            no-fade
                            placement="bottom"
                            boundary="balance-deduct"
                            custom-class="balance-deduction-tooltip"
                          >
                            <p>{{ row.deducted_prepaid_goods_ref_name }}</p>
                          </aha-tooltip>
                        </div>
                        <template v-else>
                          <div
                            v-if="hasClient"
                            class="active-block"
                            @click="onActionSalesItem(row, sales_options.sales_item_action_type.balance_deduction_action)"
                          >
                            <template v-if="row.deduction_amount > 0">
                              {{ formatMoney(row.deduction_amount, 0) }}
                            </template>
                          </div>
                          <div
                            v-else
                            class="no-action"
                          />
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="show checkout-wrapper">
            <div class="checkout-header">
              <label>{{ $t('sales.payment') }}</label>
            </div>
            <div class="checkout-body">
              <div class="check-out-brief">
                <ul>
                  <li
                    ref="totalAmountMobileRef"
                    class="sales-total-amount"
                  >
                    <div>{{ $t('sales.sales-action.sales-amount') }}</div>
                    <div>{{ salesAmount | formatNumber(0) }}</div>
                  </li>
                  <li class="discount-amount">
                    <div>{{ $t('sales.sales-action.discount') }}</div>
                    <div>{{ totalDiscount | formatNumber(0) }}</div>
                  </li>
                  <li class="total-amount">
                    <div>{{ $t('sales.sales-action.total') }}</div>
                    <div>{{ formatMoney(sales.fields.total_amount, 0) }}</div>
                  </li>
                  <li
                    v-if="isShowPointDeductionAmountSalesSumary || isShowBalanceDeductionAmountSalesSumnary"
                    class="point-balance-deduction"
                  >
                    <div
                      v-if="isShowPointDeductionAmountSalesSumary"
                      class="point-deduction"
                    >
                      <div>{{ $t('sales.point-deduction') }}</div>

                      <div class="deduction-amount">
                        {{ formatMoney(sales.fields.deduction_points, 0) }}

                        <span
                          v-if="sales.fields.deduction_points"
                          @click="handlePointDedutionRemove"
                        >x</span>
                      </div>
                    </div>
                    <div
                      v-if="isShowBalanceDeductionAmountSalesSumnary"
                      class="balance-deduction"
                    >
                      <div>{{ $t('sales.balance-deduction') }}</div>

                      <div class="deduction-amount">
                        {{ formatMoney(sales.fields.balance_deduction, 0) }}

                        <span
                          v-if="sales.fields.balance_deduction"
                          @click="handleBalanceDeductionRemove"
                        >x</span>
                      </div>
                    </div>
                  </li>

                  <li
                    v-for="(payment, i) in sales.fields.payments"
                    :key="i"
                    :class="getPaymentClass(payment, i)"
                  >
                    <div class="payment-content">
                      <div class="payment-name">
                        {{ payment.payment_method_name }}
                      </div>
                      <div class="payment-amount">
                        <div
                          :id="`mobile-payment-${i}`"
                          :class="getPaymentAmountClass(payment)"
                          @click="onClickUpdateBookingDeposit(payment)"
                        >
                          {{ formatPaymentAmount(payment) }}
                        </div>
                        <span
                          v-if="isEnabledSalesPaymentRemove(payment)"
                          @click="removeSalesPayment(payment)"
                        >x</span>
                        <aha-tooltip
                          v-if="isBookingDepositPaymentUpdatable(payment)"
                          :target="`mobile-payment-${i}`"
                          custom-class="update-booking-deposit-tooltip"
                        >
                          <p v-html="$t('sales.click-to-add-a-refund')" />
                        </aha-tooltip>
                      </div>
                    </div>
                    <div
                      v-if="payment.payment_date_time_ts > 0"
                      class="payment-date"
                    >
                      [{{ $t('sales.paid-date') }} {{ payment.payment_date_time }}]
                    </div>
                  </li>

                  <li
                    :class="{ 'change': sales.fields.outstanding < 0 }"
                    class="outstanding"
                  >
                    <template v-if="sales.fields.outstanding >= 0">
                      <div>{{ $t('sales.outstanding') }}</div>
                      <div>{{ formatMoney(sales.fields.outstanding, 0) }}</div>
                    </template>
                    <template v-else>
                      <div>{{ $t('sales.change') }}</div>
                      <div>{{ formatMoney(sales.fields.outstanding * -1, 0) }}</div>
                    </template>
                  </li>

                  <li class="earn-loyalty-points">
                    <div>{{ $t('sales.earn-loyalty-points') }}</div>
                    <div
                      v-if="hasClient"
                      class="loyalty-points-contain"
                    >
                      <aha-input-money
                        v-model="sales.fields.earned_points"
                        :allow-empty="false"
                        :max-length="maxEarnLoyaltyPointsDisplayLength"
                        class="form-control input-money"
                      />
                      <span @click="loyaltyPointCalculate()">
                        <span><b-icon-calculator-fill class="loyalty-points-calculator" /></span>
                      </span>
                    </div>
                    <div v-else>
                      {{ formatMoney(sales.fields.earned_points, 0) }}
                    </div>
                  </li>
                </ul>
              </div>

              <div class="deduction-wrapper">
                <!-- <div class="title">{{ $t('sales.discount-deduction') }}</div> -->
                <div class="title">
                  {{ $t('sales.deduction') }}
                </div>
                <div class="deduction-action">
                  <template>
                    <ul :class="['list-btn list-btn--discount-deduction', { disabled: cannotEditSalesDetail }]">
                      <li :class="{ 'active': isHadSalesItem }">
                        <a
                          v-if="isHadSalesItem"
                          :class="{ 'disabled': !isShowDiscountBtn }"
                          @click.prevent="onMultipleDiscountAction"
                        >{{ $t('sales.discount') }}</a>
                        <a v-else>{{ $t('sales.discount') }}</a>
                      </li>
                      <li
                        v-if="false"
                        :class="{ 'active': isHadSalesItem }"
                      >
                        <a
                          v-if="isHadSalesItem"
                          @click="onActionSalesDiscount"
                        >{{ $t('sales.discount') }}</a>
                        <a v-else>{{ $t('sales.discount') }}</a>
                      </li>

                      <li :class="{ 'active': isRegisteredClientAndHadSalesItem }">
                        <a
                          v-if="isRegisteredClientAndHadSalesItem"
                          @click="onActionSalesDeductionPoints"
                        >{{
                          $t('sales.point') }}</a>
                        <a v-else>{{ $t('sales.point') }}</a>
                      </li>

                      <li :class="{ 'active': isRegisteredClientAndHadSalesItem }">
                        <a
                          v-if="isRegisteredClientAndHadSalesItem"
                          @click="onActionSalesDeductionBalance"
                        >{{
                          $t('sales.pay-by-balance') }}</a>

                        <a v-else>{{ $t('sales.pay-by-balance') }}</a>
                      </li>
                    </ul>
                  </template>
                </div>
              </div>
              <div class="payment-wrapper">
                <select-payment-method-panel
                  v-if="form_showed"
                  :disabled="cannotEditSalesDetail"
                  :payment_method_setup="payment_method_setup"
                  :disable-payment-method-names="disablePaymentMethodNames"
                  @selected="onSelectedPaymentMethod"
                />
              </div>

              <aha-naver-pay-at-salon
                v-if="isShowNaverPayAtSalonButton"
                :is-revise-external-payment="isRevisePayment"
                @click="onClickNaverPayAtSalon"
              />

              <div class="notes-date-wrapper">
                <div class="notes">
                  <!-- salesNotesTextarea wrapper second  -->
                  <b-form-textarea
                    ref="salesNotesTextareaSecond"
                    v-model="sales.fields.notes"
                    :rows="noteTextareaDefaultRows"
                    :placeholder="$t('sales.notes')"
                    @input="handleNotesInput"
                  />
                </div>
                <div class="date-time-wrapper">
                  <label>{{ $t('sales.sales-date') }}</label>
                  <div
                    :class="selectDateTimeWrapperClass"
                    @click="handleEditSalesDateClick"
                  >
                    <aha-date-picker
                      v-if="can_edit_sales_date && isMobileView"
                      ref="salesDateRef"
                      v-model="invoice_date"
                      :popover-visibility="datePopoverVisibility"
                      class="date-time-wrapper__date-picker"
                      popover-direction="top"
                      @popover-did-appear="handleDatePopoverDidDAppear"
                    />
                    <div
                      v-else
                      class="invoice-date-disabled"
                    >
                      <span>{{ sales_invoice_date_text }}</span>
                    </div>
                    <select-time
                      v-model="invoice_time"
                      :disabled="!can_edit_sales_date"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer-action-bar class="sales-action-footter">
          <div :class="footerModalMobileClass">
            <slot
              v-bind="draftSalesSlotProps"
              name="draft-actions"
            />

            <btn-action-group
              :data="form_options"
              :label_confirm="$t('general.complete')"
              @confirm="onClickSaveButton"
              @cancel="onCancel"
            />
          </div>
        </footer-action-bar>
      </div>

      <!-- modals -->
      <sales-item-discount-action
        :sales-setup="salesSetup"
        :discount-for-sales="discountForSales"
        :original-amount="discountOriginalAmount"
        @apply-discount="onSalesItemDiscountApply"
        @apply-discount-for-sales="handleApplyDiscountForSales"
      />

      <sales-item-discount-card-apply
        :client="client"
        :sales-items="appliedDiscountSalesItems"
        :sales-item-goods-type="addedSalesItemGoodType"
        :expired-from-datetime-ts="currentSalesInvoiceDatetimeTs"
        :current-sales-invoice-datetime-ts="currentSalesInvoiceDatetimeTs"
        static
        @hidden="handleModalDiscountCardApplyHidden"
        @apply-discount="handleSalesItemsApplyDiscount"
      />

      <sales-item-staff-action
        :modal-id="'sales-item-staff-action-sales-modal'"
        :staff-options="staff_options"
        type="sales"
        @apply-staffs="onSalesItemStaffsApply"
      />

      <sales-item-sales-type-action @apply-sales-type="onSalesItemSalesTypeApply" />

      <balance-deduction-action
        v-if="hasClient"
        :client="client"
        :can-move-balance="!is_edit_mode"
        :visible="isBalanceDeductionOnSalesItemVisible"
        :current-sales-invoice-datetime-ts="currentSalesInvoiceDatetimeTs"
        :has-balance-deduction="prepaidCardsDeduction.hasBalanceDeduction"
        @complete="onClickSaveButton"
        @hide="handleBalanceDeductionActionHide"
        @apply-balance-deduction="onBalanceDeductionApply"
        @opened-balance-deduction-action="onOpenedBalanceDeductionAction"
        @on-confirm-reset-balance-deductions="onConfirmResetBalanceDeductions"
        @close-with-not-change-balance-deduction="onCloseWithNotChangeBalanceDeduction"
      />

      <input-money-calculator-panel-action
        :sales-or-refund-data="sales"
        :payment-mode="paymentMode.sales"
        :show-complete-btn="showCompleteBtn"
        :loyalty-points-setup="loyalty_points_setups"
        :is-validate-points-on-input="isValidatePointsOnInput"
        @complete="onClickSaveButton"
        @hidden="handleCalculatorHidden"
        @input-money-calculator="onInputMoneyCalculator"
      />

      <input-loyalty-point-panel-action
        :modal-id="loyaltyPointCalculatorModalId"
        :point-base-amount="pointBaseAmount"
        @apply-amount="handleApplyPointAmount"
        @apply-percent="handleApplyPointPercent"
      />
    </b-modal>

    <div v-if="form_showed">
      <alert-confirm
        :id="alert_confirm_outstanding_id"
        :data_alerts="alert_confirm_outstanding_data"
        :hide_yes="alert_confirm_outstanding_hide_yes"
        :label_no="alert_confirm_outstanding_label_no"
        @confirm="onAlertConfirmOutstanding"
      />

      <alert-confirm
        :id="alert_confirm_omit_staff_id"
        :data_alerts="alert_confirm_omit_staff_data"
        @confirm="onAlertConfirmOmitStaff"
      />

      <alert-confirm
        :id="alertEditSalesDateModalId"
        :data_alerts="alertEditSalesDateData"
        :is-static="false"
        @confirm="handleEditSalesDateConfirm"
      />

      <alert-confirm
        :id="alertAddSalesNaverBookingModalId"
        :title="$t('general.confirm')"
        :data_alerts="alertAddSalesNaverBookingMessages"
        @confirm="onConfirmAddSalesNaverBooking"
      />
      <alert-confirm
        :id="alertPayAtSalonModalId"
        :title="$t('general.confirm')"
        :label_no="$t('general.cancel')"
        :data_alerts="alertPayAtSalonMessages"
        :label_yes="$t('sales.request-payment')"
        @confirm="onClickPayAtSalon"
      />
      <alert-confirm
        :id="deleteNaverSalesFailedConfirmModalId"
        :title="$t('general.alert')"
        :label_yes="$t('general.close')"
        :data_alerts="deleteNaverSalesFailedAlertMessage"
        :data_alerts_detail="deleteNaverSalesFailedAlertDetail"
        hide_no
        @confirm="onDeleteNaverSalesFailedModalClosed"
      />
    </div>

    <sales-items-adding-action
      ref="sales_item_adding_action"
      :client="client"
      :staffs="staff_options"
      :has-client="hasClient"
      :selected-staff-id="selectedStaffId"
      :visible="isSalesItemsAddingActionVisible"
      :sales_item_number_can_add="sales_item_number_can_add"
      :is_loaded_client_prepaid_cards="isLoadedClientPrepaidCards"
      @hide="handleSalesItemsAddingHide"
      @add-sales-items="onAddSalesItems"
      @clicked-goods-type="onClickedGoodsType"
      @on-shown="onSalesItemsAddingActionShown"
    />

    <aha-naver-add-edit-style-keyword-modal
      :payment-amount="sales.fields.outstanding"
      :selected-style-keywords="$_naverStyleKeywordMixin_selectedStyleKeywords"
      :visible="$data.$_naverStyleKeywordMixin_isShowNaverAddEditStyleKeywordModal"
      no-close-on-backdrop
      @on-click-pay-payment-request="handleRequestPaymentExternalSystem"
      @hidden="$_naverStyleKeywordMixin_onHideNaverAddEditStyleKeywordModal"
      @on-click-add-style-keyword="$_naverHairTagInquiryMixin_setNaverHairTagInquiry"
      @on-click-edit-style-keyword="$_naverHairTagInquiryMixin_setNaverHairTagInquiry"
    />

    <aha-naver-select-style-keyword-modal
      v-model="$data.$_naverStyleKeywordMixin_naverSelectedKeywordCategories"
      :keyword-categories="$data.$_naverStyleKeywordMixin_keywordCategories"
      :visible="$data.$_naverStyleKeywordMixin_isShowNaverSelectStyleKeywordModal"
      no-close-on-backdrop
      @close="$_naverStyleKeywordMixin_onHideNaverSelectStyleKeywordModal"
      @on-exceed-max-selection-count="$_naverStyleKeywordMixin_onExceedMaxSelectionCount"
      @on-click-cancel-button="$_naverStyleKeywordMixin_onHideNaverSelectStyleKeywordModal"
      @on-click-save-button="$_naverStyleKeywordMixin_onClickSaveNaverSelectStyleKeywordModal"
      @on-save-with-empty-selection="$_naverStyleKeywordMixin_onSaveWithEmptyStyleKeywordSelection"
    />

    <aha-naver-request-payment-modal
      :is-revise-payment="isRevisePayment"
      :payment-amount="requestPaymentAmount"
      :visible="$data.$_naverRequestPaymentMixin_isShowNaverRequestPaymentModal"
      :is-show-payment-complete="$data.$_naverRequestPaymentMixin_isShowPaymentComplete"
      :payment-complete-info="$_naverRequestPaymentMixin_xPaymentCompleteInfoOfRequestingPayment"
      no-close-on-esc
      hide-header-close
      no-close-on-backdrop
      @update-payment-info="handleUpdatePaymentInfo"
      @on-show-payment-complete="handlePaymentComplete"
      @on-hidden-payment-complete="onHiddenPaymentComplete"
      @on-click-cancel-payment-request="onCancelNaverRequestPayment"
      @on-hide-payment-request="onHideNaverPaymmentRequestModal"
    />
    <alert-confirm
      :id="cancelRequestPaymentSuccess"
      :title="$t('general.alert')"
      :label_yes="$t('general.close')"
      :data_alerts="cancelRequestPaymentAlertMessage"
      hide_no
      @confirm="onCancelRequestPaymentSuccess"
    />
    <multiple-discount-modal
      v-if="isShowMultipleDiscountModal"
      :sales-setup="salesSetup"
      :sales="sales"
      :discount-sales-item="discountSalesItem"
      :visible="isShowMultipleDiscountModal"
      @hide="onHideMultipleDiscountModal"
      @apply-multiple-discount="onApplyDiscount"
    />
  </div>
</template>

<script>

const UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION = {
  PLUS:  1,
  MINUS: 2,
}
// import Vue from 'vue'
// Utils
import moment from 'moment'
import { cloneDeep, find } from 'lodash'
import { options } from 'OptionsHelpers'
import SalesUtils from 'Utils/sales-utils'
import { sales_options } from 'Options/sales-options'
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import {
  escapeHtml,
  formatMoney,
  getCashText,
  calculateCutRound,
  formatDateBySetting,
  convertDateToTimezone,
  mapActionSecurityInfo,
  convertDateToTimeStamp,
  convertTimeStampToDate,
  convertTimeStampPlusLocalzone,
  convertDateFromLocalToTimezone,
  parseNumberToStringExcludeDecimal,
  parseDateTSToMomentWithAddingShopSettingTimezone,
} from 'CommonHelpers'

import { getCurrentUTCTimezoneTS } from 'DatetimeHelpers'
import { isPermissionGranted } from 'PermissionHelpers'

// Mixins
import StaffMixin from 'Mixins/staff-mixin'
import SalesValidateMixin from 'Mixins/sales-validate-mixin'
import SalesCacheMixin from 'Modules/cache/mixins/sales_cache'
import ClientDictionaryMixin from 'Mixins/client-dictionary-mixin'
import BookingCacheMixin from 'Modules/cache/mixins/booking_cache'
import ClientPrepaidCardsMixin from 'Mixins/client-prepaid-cards-mixin'
import NaverStyleKeywordMixin from 'Mixins/naver-style-keyword-mixin.js'
import NaverRequestPaymentMixin from 'Mixins/naver-request-payment-mixin.js'
import ClientPrepaidServiceMixin from 'Mixins/client-prepaid-services-mixin'
import NoteLengthValidatorMixin from 'Mixins/note-length-validator-mixin'

// Constant
import { SALES_DATA_RULES } from 'SystemDataRules'
import {
  BOOKING_SOURCE,
  MOBILE_MAX_WIDTH,
  SALES_DISCOUNT_TYPE,
  EXTERNAL_PAYMENT_REQUEST,
  NAVER_PAYMENT_METHOD_TEXT,
  EXTERNAL_SYSTEM_BOOKING_STATUS,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT,
  EXTERNAL_SYSTEM_BUSINESS_CATEGORY,
  BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER,
  PERMISSION_TYPE,
} from 'Constant'
// ViewModel, Class
import ClientViewModel from 'ViewModels/clients/client-view-model'
import SalesViewModel from 'ViewModels/sales/sales/sales-view-model'
import SalesItemViewModel from 'ViewModels/sales/sales-item/sales-item-view-model'
import ClientAccountViewModel from 'ViewModels/sales/outstanding/client-account-view-model'
import SalesItemStaffViewModel from 'ViewModels/sales/sales-item/sales-item-staff-view-model'

// Models
import externalSystemCouponInfo from 'Models/booking/externalSystemCouponInfo.js'

// API
import SalesApi from 'API/sales/sales-api'

// Components
import { BIconCalculatorFill, BIconTrash } from 'bootstrap-vue'
import ViewTable from 'CommonComponents/view-table/view-table.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ErrorBox from 'CommonComponents/form/error-box/error-box.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import SalesGoodsTypes from './sales-goods-types/sales-goods-types.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import SelectTime from 'CommonComponents/form/select/select-time/select-time.vue'
import AhaInputMoney from 'CommonComponents/aha-input-money/aha-input-money.vue'
import FooterActionBar from 'Components/common/footer-action-bar/footer-action-bar.vue'
import SalesItemStaffAction from '../sales-item-staff-action/sales-item-staff-action.vue'
import SalesNaverInformation from './sales-naver-information/sales-naver-information.vue'
import BtnActionGroup from 'CommonComponents/button/btn-action-group/btn-action-group.vue'
import BalanceDeductionAction from '../balance-deduction-action/balance-deduction-action.vue'
import SalesItemsAddingAction from './sales-items-adding-action/sales-items-adding-action.vue'
import SalesItemDiscountAction from '../sales-item-discount-action/sales-item-discount-action.vue'
import AhaNaverPayAtSalon from 'Components/sales/aha-naver-pay-at-salon/aha-naver-pay-at-salon.vue'
import SelectPaymentMethodPanel from '../select-payment-method-panel/select-payment-method-panel.vue'
import SalesActionClientAccount from '../sales-action-client-account/sales-action-client-account.vue'
import SalesItemSalesTypeAction from '../sales-item-sales-type-action/sales-item-sales-type-action.vue'
import SalesItemDiscountCardApply from '../sales-item-discount-card-apply/sales-item-discount-card-apply.vue'
import MultipleDiscountModal from 'Components/sales/sales-action/multiple-discount-modal/multiple-discount-modal.vue'
import InputMoneyWithInlineControl from 'CommonComponents/form/input/input-money/input-money-with-inline-control.vue'
import AhaNaverRequestPaymentModal from 'Components/sales/aha-naver-request-payment-modal/aha-naver-request-payment-modal.vue'
import InputLoyaltyPointPanelAction from 'Components/sales/input-loyalty-point-panel-action/input-loyalty-point-panel-action.vue'
import AhaNaverSelectStyleKeywordModal from 'Components/sales/aha-naver-select-style-keyword-modal/aha-naver-select-style-keyword-modal.vue'
import InputMoneyCalculatorPanelAction, { paymentMode } from '../input-money-calculator-panel-action/input-money-calculator-panel-action.vue'
import AhaNaverAddEditStyleKeywordModal from 'Components/sales/aha-naver-add-edit-style-keyword-modal/aha-naver-add-edit-style-keyword-modal.vue'

const BOOKING_NAVER_DEPOSIT_TYPE = [
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PREPAYMENT,
  BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON_DEPOSIT,
]

const DISCOUNT_TYPE = {
  AMOUNT:  2,
  PERCENT: 1,
}
export default {
  components: {
    ErrorBox,
    ViewTable,
    BIconTrash,
    AhaTooltip,
    SelectTime,
    AlertConfirm,
    AhaInputMoney,
    AhaDatePicker,
    BtnActionGroup,
    SalesGoodsTypes,
    FooterActionBar,
    AhaNaverPayAtSalon,
    BIconCalculatorFill,
    SalesItemStaffAction,
    MultipleDiscountModal,
    SalesNaverInformation,
    SalesItemsAddingAction,
    BalanceDeductionAction,
    SalesItemDiscountAction,
    SalesItemSalesTypeAction,
    SalesActionClientAccount,
    SelectPaymentMethodPanel,
    SalesItemDiscountCardApply,
    InputLoyaltyPointPanelAction,
    InputMoneyWithInlineControl,
    AhaNaverRequestPaymentModal,
    AhaNaverSelectStyleKeywordModal,
    InputMoneyCalculatorPanelAction,
    AhaNaverAddEditStyleKeywordModal,
  },

  extends: ComponentBase,

  mixins: [
    StaffMixin,
    SalesCacheMixin,
    BookingCacheMixin,
    SalesValidateMixin,
    ClientDictionaryMixin,
    NaverStyleKeywordMixin,
    ClientPrepaidCardsMixin,
    NaverRequestPaymentMixin,
    ClientPrepaidServiceMixin,
    NoteLengthValidatorMixin,
  ],

  props: {
    modalId: {
      type:    String,
      default: 'sales-action-modal',
    },
    clientId: {
      default: 0,
      type:    Number,
    },
    clientShopId: {
      default: 0,
      type:    Number,
    },
    selectedStaffId: {
      type:    Number,
      default: 0,
    },
    draftDocumentId: {
      type:    Number,
      default: null,
    },
    canUpdateBookingDeposit: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      // modal
      shouldUpdateQuantity: true,
      form_options:         {
        delete: false,
      },

      form_showed:     false,
      showCompleteBtn: true,
      options,
      sales_options,

      salesSetup: {},

      sales_api:     new SalesApi(),
      sales:         new SalesViewModel(),
      client:        new ClientViewModel().fields,
      clientAccount: new ClientAccountViewModel().fields,

      invoice_date: new Date(),
      invoice_time: '00:00',

      appliedDiscountSalesItems: [],

      alert_confirm_outstanding_id:   'alert-confirm-sales-action-submit',
      alert_confirm_outstanding_data: [],

      alert_confirm_omit_staff_id:   'alert-confirm-omit-staff',
      alert_confirm_omit_staff_data: [],

      deleteNaverSalesFailedConfirmModalId: 'alert-confirm-delete-naver-sales-failed',
      cancelRequestPaymentSuccess:          'alert-cancel-request-payment-success',
      cancelRequestPaymentAlertMessage:     [],
      deleteNaverSalesFailedAlertMessage:   [],
      deleteNaverSalesFailedAlertDetail:    [],

      is_allow_edit_inovice_date: sales_options.security_level_enum.master,

      isLoadedClientPrepaidCards:    false,
      isLoadedClientPrepaidServices: false,
      addedSalesItemGoodType:        0,

      // mobile
      is_show_total_amount: true,
      is_show_checkout:     true,

      errors:                               [],
      isBalanceDeductingOnSalesItem:        false,
      isBalanceDeductionOnSalesItemVisible: false,

      isDeletedClient:                 false,
      isConfirmedEditSalesDate:        false,
      isSalesItemsAddingActionVisible: false,

      hasPrepaidGoods: false,

      //date picker popover
      datePopoverVisibility: 'focus',

      bookingCalendarSetups: {},

      isMobileView: false,

      isDeductionOrPayment:            false,
      isNaverRequestPaymentCalled:     false,
      isRevisePaymentProcessingFailed: false,

      // Discount
      discountForSales:       false,
      discountOriginalAmount: 0,

      isShowMultipleDiscountModal: false,
      discountSalesItem:           null,
    }
  },

  computed: {
    ...mapState('authentication', {
      x_user: 'user',
    }),

    ...mapGetters('client_dictionary', [
      'getClientInformationById',
    ]),

    ...mapGetters('notification', {
      x_session_token_requesting_payment: 'getSessionTokenRequestingPayment',
    }),

    ...mapGetters('sales', {
      x_sales_action:                                            'getSalesAction',
      x_sales_action_helper:                                     'getSalesActionHelper',
      x_sales_item_action:                                       'getSalesItemAction',
      x_money_calculator_panel_action:                           'getMoneyCalculatorPanelAction',
      x_is_sales_edit_include_prepaid_card_or_deduct_balance:    'getIsSalesEditIncludePrepaidCardOrDeductBalance',
      x_is_sales_edit_include_prepaid_service_or_deduct_service: 'getIsSalesEditIncludePrepaidServiceOrDeductService',
      x_globalSalesNpay:                                         'getGlobalSalesNpay',
      x_sales_item_discount_action:                              'getSalesItemDiscountAction',
    }),

    ...mapGetters('staff', {
      x_staff_options: 'getStaffOptions',
    }),

    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction',
    }),

    ...mapState('_calendar/bookings', [
      'bookingItem',
    ]),

    staff_options() {
      let tmp_staff_options = []
      for (let staff of this.x_staff_options) {
        let tmp_staff = new SalesItemStaffViewModel()
        tmp_staff.mapFieldsFromStaffInfo(staff)
        tmp_staff_options.push(tmp_staff.getFields())
      }
      this.setSalesActionHelperStaffOptions(tmp_staff_options)
      return tmp_staff_options
    },

    pointBaseAmount() {
      const totalAmount = this.sales.fields.total_amount
      const pointDeduction = this.sales.fields.deduction_points
      const balanceDeduction = this.sales.fields.balance_deduction

      const pointBaseAmount = totalAmount - pointDeduction - balanceDeduction
      return pointBaseAmount
    },

    modalTitle() {
      if (this.is_add_mode)
        return this.$t('sales.add-sales')
      if (this.is_edit_mode)
        return this.$t('sales.edit-sales')
      return ''
    },

    guideText() {
      if (this.cannotEditSalesDetail) {
        return this.$t('sales.cant-update-sales-has-prepaid-goods-to-deleted-client')
      }
      return this.$t('sales.click-cell-to-edit')
    },

    loyaltyPointCalculatorModalId() {
      return 'input-loyalty-point-calculator-panel-action-modal'
    },

    // Translate
    warning_max_number() { return this.$t('validate_messages.maxLength') },
    text_prepaid_card_initital_balance() { return this.$t('sales.prepaid-card-initial-balance') },
    warning_sales_balance_deduction_max() { return this.$t('sales.warning-sales-balance-deduction-max') },
    warning_can_not_add_sales_in_future() { return this.$t('sales.warning-can-not-add-sales-in-future') },
    text_prepaid_service_initital_quantity() { return this.$t('sales.prepaid-service-initial-quantity') },
    warning_sales_item_balance_deduct_max() { return this.$t('sales.warning-sales-item-balance-deduct-max') },
    warning_deduct_qty_larger_existing_qty() { return this.$t('sales.warning-deduct-qty-larger-existing-qty') },
    warning_sales_amount_can_not_be_negative() { return this.$t('sales.warning-sales-amount-can-not-be-negative') },
    warning_sales_items_list_can_not_be_empty() { return this.$t('sales.warning-sales-items-list-can-not-be-empty') },
    warning_deposit_can_not_exceed_sales_amount() { return this.$t('sales.warning_deposit_can_not_exceed_sales_amount') },
    warning_points_deduction_exceed_client_points() { return this.$t('sales.warning-can-not-using-exceed-client-points') },
    warning_sales_confirm_omit_staff_allow_alert() { return this.$t('sales.warning-sales-confirm-omit-staff-allow-alert') },
    warning_sales_item_amount_can_not_be_negative() { return this.$t('sales.warning-sales-item-amount-can-not-be-negative') },
    warning_points_deduction_of_sales_item_exceed_amount() { return this.$t('sales.warning-sales-item-points-deduct-and-amount') },
    warning_the_deducted_amount_exceeds_total_amount() { return this.$t('sales.warning-the-deducted-amount-exceeds-total-amount') },
    warning_sales_has_outstanding_with_shared_client() { return this.$t('sales.warning-sales-has-outstanding-with-shared-client') },
    warning_sales_item_quantity_must_larger_than_zero() { return this.$t('sales.warning-sales-item-quantity-must-larger-than-zero') },
    warning_sales_not_allow_change_for_multiple_payments() { return this.$t('sales.warning-sales-not-allow-change-for-multiple-payments') },
    warning_sales_has_outstanding_with_unregistered_client() { return this.$t('sales.warning-sales-has-outstanding-with-unregistered-client') },
    warning_client_prepaid_service_used_and_can_not_decrease() { return this.$t('sales.warning-client-prepaid-service-used-and-can-not-decrease') },
    warning_can_not_exceed_sales_items_max() { return this.$t('sales.warning_can_not_exceed_sales_items_max', { items_max: sales_options.sales_items_max }) },
    warning_sales_item_amount_can_not_exceed_unit_price_multiply_quantity() { return this.$t('sales.warning-sales-item-amount-can-not-exceed-unit-price-multiply-quantity') },
    warning_sales_amount_can_not_exceed_max_characters() { return this.$t('sales.warning-sales-amount-can-not-exceed-max-characters', { number: sales_options.sales_total_amount_maxcharacters }) },
    warning_sales_item_amount_can_not_exceed_max_characters() { return this.$t('sales.warning-sales-item-amount-can-not-exceed-max-characters', { number: sales_options.sales_item_amount_maxcharacters }) },
    // End Translate

    alert_confirm_outstanding_hide_yes() {
      if (this.hasClient) return false
      return true
    },
    alert_confirm_outstanding_label_no() {
      let tmp_label_no = ''
      if (!this.hasClient) tmp_label_no = this.$t('general.close')
      return tmp_label_no
    },
    table_data() {
      return {
        fields: [
          { field: 'goods_name', label: 'sales.sales-items', width: '25%', sortable: false, expand: true, tdClass: 'sales-items' },
          { field: 'unit_price', label: 'sales.unit-price', width: '10%', sortable: false, expand: true, tdClass: 'unit-price' },
          { field: 'quantity', label: 'sales.q-ty', width: '8%', sortable: false, expand: true, tdClass: 'quantity' },
          { field: 'discount_value', label: 'sales.discount', width: '7%', sortable: false, expand: true, tdClass: 'discount' },
          { field: 'amount', label: 'sales.amount', width: '10%', sortable: false, expand: true, tdClass: 'amount' },
          { field: 'staffs', label: 'sales.staff', width: '15%', sortable: false, expand: true, tdClass: 'staff' },
          { field: 'sales_type_name', label: 'sales.sales-type', width: '7%', sortable: false, expand: true, tdClass: 'sales-type' },
          { field: 'deduction_points', label: 'sales.points-deduct', width: '7%', sortable: false, expand: true, tdClass: 'points-deduct', column_expand: true },
          { field: 'deduction_amount', label: 'sales.balance-deduct', width: '7%', sortable: false, expand: true, tdClass: 'balance-deduct', column_expand: true },
          { field: 'delete', label: 'general.delete', width: '5%', sortable: false, expand: true, tdClass: 'delete' },
        ],
        rows:       this.sales.fields.sales_items,
        pagination: {
          total_pages: 1,
        },
        options: {
          fixed_header: true,
        },
      }
    },

    hasClient() {
      return this.client && this.client.id > 0
    },

    client_balance() {
      let tmp_balance = this.client.balance
      if (this.client.family_id > 0)
        tmp_balance = this.client.family_balance
      return tmp_balance
    },

    isClientCurrentShop() {
      return this.shop_data.shop_id == this.client.shop_id
    },

    is_permitted_edit_sales_date() {
      if (this.isStaffRole || this.isManagerRole) {
        const permissionType = this.isStaffRole
          ? PERMISSION_TYPE.STAFF
          : PERMISSION_TYPE.MANAGER

        return isPermissionGranted(permissionType, this.is_allow_edit_inovice_date)
      }

      return true
    },

    sales_invoice_date_text() {
      if (this.sales.fields.invoice_date_time) {
        return formatDateBySetting(this.sales.fields.invoice_date_time)
      }
      return ''
    },

    isHadSalesItem() {
      return this.sales.fields.sales_items.length && !this.cannotEditSalesDetail
    },

    isRegisteredClientAndHadSalesItem() {
      return (
        this.hasClient &&
        this.sales.fields.sales_items.length > 0
      )
    },

    is_sales_include_prepaid_good_or_prepaid_deduction() {
      return this.x_is_sales_edit_include_prepaid_card_or_deduct_balance || this.x_is_sales_edit_include_prepaid_service_or_deduct_service
    },
    sales_item_number_can_add() {
      return sales_options.sales_items_max - this.sales.fields.sales_items.length
    },

    can_edit_sales_date() {
      return this.is_permitted_edit_sales_date && !this.isDeletedClient
    },

    is_add_mode() {
      return this.x_sales_action.action === options.form_actions.add
    },

    is_edit_mode() {
      return this.x_sales_action.action === options.form_actions.edit
    },

    maxEarnLoyaltyPointsDisplayLength() {
      return SALES_DATA_RULES.MAX_EARN_LOYALTY_POINTS_DISPLAY_LENGTH
    },

    maxSalesItemQuantityLength() {
      return SALES_DATA_RULES.MAX_SALES_ITEM_QUANTITY_LENGTH
    },

    maxNoteLength() {
      return SALES_DATA_RULES.MAX_NOTES_SALES_FORM_LENGTH
    },

    isValidatePointsOnInput() {
      return this.hasClient && this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_payment
    },

    paymentMode() {
      return paymentMode || {}
    },

    prepaidCardsDeduction() {
      let deductedPrepaidCardIds = []
      let isMultiplePrepaidCardsDeduction = false
      for (let sales_item of this.sales.fields.sales_items) {
        if (sales_item.deduction_amount > 0) {
          const deductedPrepaidCardId = sales_item?.deducted_by_prepaid_goods_guid || sales_item?.deducted_prepaid_goods_ref
          if (
            deductedPrepaidCardId &&
            !deductedPrepaidCardIds.includes(deductedPrepaidCardId)
          ) {
            deductedPrepaidCardIds.push(sales_item?.deducted_by_prepaid_goods_guid || sales_item?.deducted_prepaid_goods_ref)
          }
        }

        if (deductedPrepaidCardIds.length > 1) {
          isMultiplePrepaidCardsDeduction = true
          break
        }
      }

      return {
        isMultiplePrepaidCardsDeduction,
        hasBalanceDeduction: !!deductedPrepaidCardIds.length,
      }
    },

    currentSalesInvoiceDatetimeTs() {
      return this.getInvoiceDateTimeTS()
    },

    isClientExisted() {
      return this.hasClient && this.sales.fields.client_id === this.client.id
    },

    alertAddSalesNaverBookingModalId() {
      return 'alert-all-sales-naver-booking-modal'
    },

    alertPayAtSalonModalId() {
      return 'alert-pay-at-salon-modal-id'
    },

    alertPayAtSalonMessages() {
      return [this.$t('sales.different-from-pay-at-salon-selected-payment-method-warning')]
    },

    alertAddSalesNaverBookingMessages() {
      if (
        this.isSalesOfNaverBookingWithNPaySelectedPaymentMethod
      ) {
        return [this.$t('sales.checkout-booking-pay-at-salon-with-deposit-warning')]
      }

      return [
        this.$t('general.warning-really-save'),
        '',
        this.$t('sales.save-naver-sales-note'),
      ]
    },

    isSalesOfNaverBookingWithNPaySelectedPaymentMethod() {
      return this.sales?.fields?.naver_sales_info?.selected_payment_provider === BOOKING_EXTERNAL_SYSTEM_SELECTED_PAYMENT_PROVIDER.NAVER_PAY
    },

    /**
     * @description
     * cannotEditSalesDetail use for checking the sales detail can update or not
     * When Sales were added to completely deleted client and have prepaid good.
     * The sales allow to updating only notes
     */
    cannotEditSalesDetail() {
      return !this.isClientExisted && this.is_sales_include_prepaid_good_or_prepaid_deduction
    },

    alertEditSalesDateData() {
      return [this.$t('sales.edit-sales-date-edit')]
    },

    alertEditSalesDateModalId() {
      return 'alert-edit-sales-date-modal'
    },

    isSalesDateTimeDisabled() {
      return this.is_edit_mode && !this.isConfirmedEditSalesDate && this.hasPrepaidGoods
    },

    selectDateTimeWrapperClass() {
      return ['date-time-wrapper__select-date-time', {
        'date-time-wrapper__select-date-time--disabled': this.isSalesDateTimeDisabled && this.can_edit_sales_date,
      }]
    },

    loyalty_points_setups() {
      return this.salesSetup.loyalty_points_setups ?? {}
    },
    payment_method_setup() {
      return this.salesSetup.payment_method_setup ?? []
    },

    clientLoyaltyPoints() {
      if (this.clientAccount.family_id) {
        return this.clientAccount.family_loyalty_points
      }

      return this.clientAccount.loyalty_points
    },

    isSalesOfBookingNaver() {
      return this.checkoutSalesOfNaverBooking(this.sales)
    },
    isSalesOfNaverBookingPayAtSalon() {
      return this.sales?.fields?.naver_sales_info?.booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON
    },
    isSalesOfNaverBookingPayAtSalonWithDeposit() {
      return this.sales?.fields?.naver_sales_info?.booking_type === BOOKING_EXTERNAL_SYSTEM_PAYMENT.NAVER_PAY_AT_SALON_DEPOSIT
    },

    naverPayAtSalonPayment() {
      return (this.sales?.fields?.payments || []).find(
        payment => payment.payment_type === sales_options.sales_payment_type.add_external_system_payment,
      )
    },

    hasPaidByNaverPayAtSalon() {
      return !!this.naverPayAtSalonPayment
    },

    requestPaymentAmount() {
      return this.sales?.fields?.outstanding + (this.naverPayAtSalonPayment?.payment_amount || 0)
    },

    isNaverPayAtSalon() {
      const isInvalidPayAtSalonStatus = [
        EXTERNAL_SYSTEM_BOOKING_STATUS.NO_SHOW,
        EXTERNAL_SYSTEM_BOOKING_STATUS.CANCELLED,
        EXTERNAL_SYSTEM_BOOKING_STATUS.COMPLETED,
      ].includes(this.sales?.fields?.naver_sales_info?.booking_status)

      return (
        !isInvalidPayAtSalonStatus &&
        this.requestPaymentAmount > 0 &&
        (
          this.isSalesOfNaverBookingPayAtSalon ||
          this.isSalesOfNaverBookingPayAtSalonWithDeposit
        ) &&
        (
          (
            this.is_add_mode &&
            this.sales.fields.outstanding > 0
          ) ||
          (
            this.is_edit_mode &&
            !this.hasPaidByNaverPayAtSalon
          )
        )
      )
    },

    isRevisePayment() {
      return (
        this.requestPaymentAmount > 0 &&
        this.sales?.fields?.naver_sales_info?.booking_status === EXTERNAL_SYSTEM_BOOKING_STATUS.COMPLETED &&
        (
          this.isSalesOfNaverBookingPayAtSalon ||
          this.isSalesOfNaverBookingPayAtSalonWithDeposit
        ) &&
        this.hasPaidByNaverPayAtSalon &&
        (this.sales.fields.outstanding > 0 || this.sales.fields.outstanding < 0)
      )
    },

    hasMultiplePaymentMethods() {
      const allPayments = this.sales?.fields?.payments || []
      const paymentMethodIdsHasPaid = []
      for (let index = 0; index < allPayments.length; index++) {
        const payment = allPayments[index]
        if (
          !paymentMethodIdsHasPaid.includes(payment.payment_method_id) &&
          payment.payment_type === sales_options.sales_payment_type.sales
        ) {
          paymentMethodIdsHasPaid.push(payment.payment_method_id)
        }

      }

      return paymentMethodIdsHasPaid.length > 1
    },

    isShowNaverPayAtSalonButton() {
      if (this.hasMultiplePaymentMethod && this.sales.fields.outstanding < 0) {
        return false
      }

      if (!this.isRevisePayment && !this.isNaverPayAtSalon) {
        return false
      }

      if (this.isSalesOfCheckedoutNaverBooking) {
        return false
      }

      return true
    },

    noteTextareaDefaultRows() { // used for improve ux by set default rows to textarea
      let defaultRows = 2

      if (this.isSalesOfNaverBookingPayAtSalon) {
        defaultRows = 4
      }

      if (this.isSalesOfNaverBookingPayAtSalonWithDeposit) {
        defaultRows = 5
      }

      return defaultRows
    },

    isHairBusinessTypeExternalLink() {
      return this.bookingCalendarSetups?.booking_naver_link_setup?.businessCategory === EXTERNAL_SYSTEM_BUSINESS_CATEGORY.HAIR_SHOP
    },

    isShowPointDeductionAmountSalesSumary() {
      return this.sales.fields.deduction_points
    },

    isShowBalanceDeductionAmountSalesSumnary() {
      return this.sales.fields.balance_deduction
    },

    disablePaymentMethodNames() {
      if (this.isShowNaverPayAtSalonButton) {
        return [NAVER_PAYMENT_METHOD_TEXT]
      }
      return []
    },

    isEnableSaveDraft() {
      const hasBalanceMoves = this.x_sales_action_helper?.balance_moves?.length > 0

      const payments = [...this.sales.fields.payments].filter(payment => {
        const isNotBookingDeposit = payment?.payment_type !== sales_options.sales_payment_type.booking_deposit
        const isNotRefundBookingDeposit = payment?.payment_type !== sales_options.sales_payment_type.booking_deposit_refund
        return isNotBookingDeposit && isNotRefundBookingDeposit
      })

      return !this.sales.fields.sales_id && !payments.length && !hasBalanceMoves
    },

    isEnableDeleteDraft() {
      return this.draftDocumentId
    },

    isEnableSalesDraft() {
      return this.isEnableSaveDraft || this.isEnableDeleteDraft
    },

    draftSalesSlotProps() {
      return {
        sales:               this.sales,
        invoiceDate:         this.invoice_date,
        invoiceTime:         this.invoice_time,
        isEnableSaveDraft:   this.isEnableSaveDraft,
        isEnableSalesDraft:  this.isEnableSalesDraft,
        isEnableDeleteDraft: this.isEnableDeleteDraft,
        balanceMoves:        this.x_sales_action_helper.balance_moves,
      }
    },

    footerModalMobileClass() {
      return [
        'modal-footer sales-submit',
        {
          'sales-submit--save-draft': this.isEnableSaveDraft && !this.isEnableDeleteDraft,
        },
      ]
    },

    bookingCheckedOutStatus() {
      return [
        options.booking.booking_status.checked_out,
        options.booking.booking_status.external_checked_out,
        options.booking.booking_status.external_auto_checked_out,
      ]
    },

    isSalesOfCheckedoutNaverBooking() {
      return this.checkSalesOfCheckedOutBooking(this.sales)
    },

    canUsingSalesDeductionBalance() {
      return (this.is_edit_mode && this.isRegisteredClientAndHadSalesItem) || (this.isRegisteredClientAndHadSalesItem && !this.isAllSalesItemHasPrepaidCard)
    },

    isAllSalesItemHasPrepaidCard() {
      return this.sales.fields.sales_items.every(saleItem => {
        return saleItem.goods_type === sales_options.sales_goods_type.prepaid_card && !saleItem.client_prepaid_goods_id
      })
    },

    salesAmount() {
      const sales = this.sales.fields
      const salesItems = sales?.sales_items || []
      if (!salesItems.length) {
        return 0
      }

      return salesItems.reduce((totalAmount, item) => {
        const isDeductService = item.deduction_type === sales_options.deduction_type.prepaid_service &&
          (
            item.deducted_prepaid_goods_ref > 0 ||
            item.deducted_by_prepaid_goods_guid
          )

        const quantity = Number(item.quantity || 0)
        const unitPrice = Number(item.unit_price || 0)

        return totalAmount + Number(!isDeductService) * quantity * unitPrice
      }, 0)
    },

    totalDiscount() {
      const sales = this.sales.fields
      const salesItems = sales?.sales_items || []

      const discountAmountCutOffType = this.salesSetup?.sales_general_setup?.discount_amount_cut_off_enum ?? 0
      const valueCutRoundOff = SalesUtils.getAmountCutRoundOffByEnum(discountAmountCutOffType)

      const totalDiscountValue = salesItems.reduce((total, item) => {
        const itemDiscountValue = Number(item?.discount_value || 0)

        const isDiscountAmount = item?.discount_type === sales_options.discount_type.amount
        const isDiscountPercentage = item?.discount_type === sales_options.discount_type.percentage

        const amountItem = item?.unit_price * item?.quantity

        const discountAmount = (() => {
          if (isDiscountPercentage) {
            return amountItem * (itemDiscountValue / 100)
          }

          if (isDiscountAmount) {
            return itemDiscountValue
          }
        })()

        if (isDiscountPercentage && itemDiscountValue && valueCutRoundOff) {
          return total + (amountItem - calculateCutRound({ value: amountItem - discountAmount, type: discountAmountCutOffType }))
        }

        return total + discountAmount
      }, 0)

      return totalDiscountValue
    },

    isShowDiscountBtn() {
      return this.sales.fields.sales_items.some(item => item.deduction_type !== sales_options.deduction_type.prepaid_service)
    },
  },

  watch: {
    invoice_date() {
      this.updateExpiryDatePrepaidCardsSalesItemsAddingTemporarily()
      this.updateExpiryDatePrepaidServicesSalesItemsAddingTemporarily()
    },
    invoice_time() {
      this.updateExpiryDatePrepaidCardsSalesItemsAddingTemporarily()
      this.updateExpiryDatePrepaidServicesSalesItemsAddingTemporarily()
    },
    '$data.$_naverRequestPaymentMixin_isShowPaymentComplete': {
      immediate: true,
      handler(isShowPaymentComplete) {
        if (isShowPaymentComplete) {
          this.isNaverRequestPaymentCalled = false
        }
      },
    },
  },
  async created() {
    const environment_setup = await this.$salesCacheMixin_getEnvironmentSetup({
      shopId:      this.shop_data.shop_id,
      countryCode: this.shop_data.country,
    })

    if (this.isNullObject(environment_setup)) {
      this.showMissingSalesSetupAlert()
      return
    }
    else {
      this.is_allow_edit_inovice_date = environment_setup.data_protection_security.fields.allow_edit_invoice_date
    }

    this.loadStaffOptions()
  },

  mounted() {
    this.checkMobileView()
    window.addEventListener('resize', this.checkMobileView)

    this.$nextTick(() => {
      this.$bus.on('loaded-sale-detail-data', this.handleOnLoadedSaleDetailData)
    })

  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileView)
    this.$bus.off('loaded-sale-detail-data', this.handleOnLoadedSaleDetailData)
  },

  methods: {
    ...mapMutations('sales', [
      'setSalesAction',
      'setSalesItemActionItemFields',
      'setSalesActionShowedGoodsType',
      'setMoneyCalculatorPanelAction',
      'setLoyaltyPointCalculatorPanelAction',
      'updatePrepaidCardBalanceToStore',
      'setSalesActionHelperStaffOptions',
      'setSalesActionHelperBalanceMoves',
      'setIsLoadingClientPrepaidServices',
      'updatePrepaidServiceQuantityToStore',
      'setSalesActionHelperClientPrepaidCards',
      'deleteItemFromClientPrepaidServicesAll',
      'setSalesActionHelperClientPrepaidCardsOrigin',
      'setSalesActionHelperClientPrepaidServicesAll',
      'setIsSalesEditIncludePrepaidCardOrDeductBalance',
      'setIsSalesEditIncludePrepaidServiceOrDeductService',
      'setGlobalSalesNpay',
      'setClientIdUsingSales',
    ]),
    ...mapMutations('staff', [
      'setStaffOptions',
    ]),
    ...mapMutations('booking', [
      'setRecentlySelectedClient',
    ]),
    ...mapActions('client_dictionary', [
      'getClient',
      'getClientAccount',
    ]),

    ...mapActions('booking_deposit', [
      'setBookingDepositRefundActionData',
    ]),

    ...mapActions('_calendar/checkoutAction', ['getClientInformation']),

    formatMoney,

    handleApplyPointPercent(newPoint) {
      const earnLoyaltyPoint = Math.round((this.pointBaseAmount * newPoint) / 100)
      this.sales.fields.earned_points = earnLoyaltyPoint
    },

    handleApplyPointAmount(newPoint) {
      this.sales.fields.earned_points = newPoint
    },

    reloadClientInformationForNewCalendar() {
      this.getClientInformation({ clientId: this.client.id, shopId: this.client.shop_id })
    },

    hideModal() {
      this.hideDialogById(this.modalId)
      this.form_showed = false

      // // todo: clear x_client for sales & sales history page only is anti-pattern -> should seperate cases on sales-action
      // const shouldResetClientInformationRoutes = ['sales', 'sales-history']
      // if(shouldResetClientInformationRoutes.includes(this.$route.name)){
      //   this.clearClientInformation()
      // }
    },

    loyaltyPointCalculate() {
      const loyaltyPointCalculatorPanelAction = {
        action: sales_options.calculator_type.sales_loyalty_point,
        data:   '',
      }

      const salesTotalAmount = this?.sales?.fields.total_amount
      const errorMessageSalesTotalAmount = this.salesValidateMixin_validateSalesTotalAmount({ salesTotalAmount })

      if (errorMessageSalesTotalAmount.length > 0) {
        this._showDialogAlert(errorMessageSalesTotalAmount)
        return
      }

      this.setLoyaltyPointCalculatorPanelAction(loyaltyPointCalculatorPanelAction)
      this.showDialogById(this.loyaltyPointCalculatorModalId)
    },

    getPaymentAmountClass(payment) {
      return [
        'payment-amount__amount-number',
        { 'payment-amount__amount-number--booking-deposit-updatable': this.isBookingDepositPaymentUpdatable(payment) },
      ]
    },

    isPrepaidGoodItem(sales_item) {
      const isPrepaidGoodsItem = [options.sales_enum.goods_type.prepaid_card, options.sales_enum.goods_type.prepaid_service].includes(sales_item.goods_type)
      const isDeductionPrepaidService = sales_item.goods_type === options.sales_enum.goods_type.prepaid_service && sales_item.deduction_type === sales_options.deduction_type.prepaid_service

      return isPrepaidGoodsItem && !isDeductionPrepaidService
    },

    prepaidGoodsClass(row) {
      const isPrepaidGoods = this.isPrepaidGoodItem(row)
      return {
        'prepaid-goods': isPrepaidGoods,
      }
    },

    getPaymentClass(payment, i) {
      return [
        'payment', { first: i == 0 },
        sales_options.salesPaymentColors[payment.payment_type] ?? '',
      ]
    },

    onCancel() {
      if (this.$refs.sales_item_adding_action) {
        this.$refs.sales_item_adding_action.setInitGoodsTypesViewState()
      }

      this.isConfirmedEditSalesDate = false
      this.hideModal()
    },
    onModalHidden() {
      this.isDeletedClient = false
      this.isLoadedClientPrepaidCards = false
      this.isLoadedClientPrepaidServices = false
      this.client = new ClientViewModel().fields,
      this.clientAccount = new ClientAccountViewModel().fields,

      // reset to init data -> this will avoid trigger onInputSalesItemQuantity when v-model changed
      this.sales = new SalesViewModel()
      this.$emit('hidden')
    },

    onDeleteNaverSalesFailedModalClosed() {
      if (this.isRevisePayment && this.isRevisePaymentProcessingFailed) {
        this.$emit('on-cancelled-naver-revise-payment')
        this.hideDialogById(this.deleteNaverSalesFailedConfirmModalId)
        this.onCancel()
      }

      this.hideDialogById(this.deleteNaverSalesFailedConfirmModalId)
    },

    onCancelRequestPaymentSuccess() {
      this.hideDialogById(this.cancelRequestPaymentSuccess)
      this.onHiddenPaymentComplete()
      this.$data.$_naverRequestPaymentMixin_isShowNaverRequestPaymentModal = false
      this.$bus.emit('on-update-requesting-npay-payment', {}, { status: false })
    },

    handleSalesItemsAddingHide() {
      this.isSalesItemsAddingActionVisible = false
    },

    async loadStaffOptions() {
      try {
        const result = await this.getStaffsAsyncMixin()

        if (result.is_ok) {
          this.setStaffOptions(result.data.items)
        } else {
          this._showDialogAlert(result.error_messages)
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async loadClientPrepaidCardsAsync(clientId, extendPrepaidCards = []) {
      try {
        if (!clientId) return []

        if (this.isLoadedClientPrepaidCards) {
          return [...this.x_sales_action_helper?.client_prepaid_cards, ...extendPrepaidCards] || []
        }

        const response = await this.getClientPrepaidCardsAsyncMixin(clientId, sales_options.prepaid_card_type.all, true, true)

        if (response.is_ok) {
          this.setSalesActionHelperClientPrepaidCards([...response.data.items, ...extendPrepaidCards])
          this.setSalesActionHelperClientPrepaidCardsOrigin([...cloneDeep(response.data.items), ...extendPrepaidCards])

          this.isLoadedClientPrepaidCards = true
          return [...response.data.items, ...extendPrepaidCards]
        }

        this._showDialogAlert(response.error_messages)
      } catch (error) {
        this._showDialogAlert(error.message)
      }

      return []
    },

    mergeClientPrepaidServices: (clientPrepaidServices, extendPrepaidServices = []) => {
      const mergedPrepaidServices = [...clientPrepaidServices]

      extendPrepaidServices.forEach(extendPrepaidService => {
        const existedPrepaidService = clientPrepaidServices.find(prepaidService => prepaidService.id === extendPrepaidService.id)

        if (existedPrepaidService) {
          return
        }

        mergedPrepaidServices.push(extendPrepaidService)
      })

      return mergedPrepaidServices
    },

    async loadClientPrepaidServicesAsync(clientId, extendPrepaidServices = []) {
      try {
        if (!clientId) return []

        if (this.isLoadedClientPrepaidServices) {
          return this.mergeClientPrepaidServices(this.x_sales_action_helper?.client_prepaid_services_all, extendPrepaidServices)
        }

        this.setIsLoadingClientPrepaidServices(true)

        const response = await this.getClientPrepaidServicesAsyncMixin(clientId, true)

        this.setIsLoadingClientPrepaidServices(false)

        if (response.is_ok) {
          this.setSalesActionHelperClientPrepaidServicesAll([...response.data.items, ...extendPrepaidServices])
          this.isLoadedClientPrepaidServices = true

          return this.mergeClientPrepaidServices(response.data.items, extendPrepaidServices)
        }

        this._showDialogAlert(response.error_messages)
      } catch (error) {
        this._showDialogAlert(error.message)
      }

      return []
    },

    async fetchSalesSetup() {
      // Clear the cache before fetching the data
      await this.$salesCacheMixin_clearAllSalesSetup()

      const salesSetup = await this.$salesCacheMixin_getAllSalesSetup({
        shopId: this.shop_data.shop_id,
      })

      if (this.isMissingSalesSetup(salesSetup)) {
        this._showDialogAlert(salesSetup.error_messages)
      } else {
        this.salesSetup = salesSetup
      }
    },

    async getBookingCalendarSetup() {
      this.bookingCalendarSetups = await this.$bookingCacheMixin_getAllCalendarSetup({
        shopId: this.shop_data.shop_id,
      })

      if (this.isMissingCalendarSetup(this.bookingCalendarSetups)) {
        this._showDialogAlert(this.bookingCalendarSetups.error_messages)
      }
    },

    async fetchClient({ clientId, shopId }) {
      if (!clientId) return new ClientViewModel().fields

      const response = await this.getClient({
        shopId,
        clientId,
      })

      if (!response.is_ok && !this.is_edit_mode) {
        this._showDialogAlert(response.error_messages, {
          onConfirm: () => {
            this.handleConfirmAlert()

            if (response?.error_codes.includes('CLN02R')) {
              this.handleClientNotExistConfirm()
            }
          },
        })
      }

      return response?.data
    },

    async fetchClientAccount({ clientId, shopId }) {
      if (!clientId) return new ClientAccountViewModel().fields

      const response = await this.getClientAccount({
        shopId,
        clientId,
      })

      if (!response.is_ok && !this.is_edit_mode) {
        this._showDialogAlert(response.error_messages, { onConfirm: this.handleConfirmAlert })
      }

      return response?.data ?? new ClientAccountViewModel().fields
    },

    async fetchSalesClientInformation(sales = new SalesViewModel()) {
      const clientId = sales.fields.client_id || this.clientId
      const optionsClientId = this.x_sales_action.options?.client?.id
      const optionsClientAccountId = this.x_sales_action.options?.clientAccount?.client_id

      if (clientId && clientId === optionsClientId && clientId === optionsClientAccountId) {
        return {
          client:        this.x_sales_action.options?.client,
          clientAccount: this.x_sales_action.options?.clientAccount,
        }
      }

      const shopId = sales.fields.client_shop_id || this.clientShopId || this.shop_data.shop_id

      const filterClient = { clientId, shopId }
      const [client, clientAccount] = await Promise.all([
        this.fetchClient(filterClient),
        this.fetchClientAccount(filterClient),
      ])

      if (!clientAccount.client_id && sales.fields.booking_id > 0) {
        clientAccount.client_name = sales.fields.client_name
      }
      return { client, clientAccount }
    },

    async onLoadForm() {
      try {
        this.preLoader()
        const clientId = this.x_sales_action.data.client_id || this.clientId
        if (clientId) this.clientAccount = this.getClientAccountById(clientId)

        this.errors = []
        this.form_showed = true

        // sales setup
        await Promise.all([
          this.fetchSalesSetup(),
          this.getBookingCalendarSetup(),
        ])

        // reset IsSalesIncludePrepaidGoods
        this.setIsSalesEditIncludePrepaidCardOrDeductBalance(false)
        this.setIsSalesEditIncludePrepaidServiceOrDeductService(false)
        const sales = new SalesViewModel()

        sales.setFields(this.x_sales_action.data)

        const { client, clientAccount } = await this.fetchSalesClientInformation(sales)
        const hasClient = client && client?.id
        sales.fields.sales_items = this.attachSalesItemsKey(sales.fields?.sales_items ?? [])

        // Assign client, shop information to sales
        sales.setFields({
          chain_id:      this.shop_data.chain_id,
          shop_name:     this.shop_data.shop_name,
          branch_number: this.shop_data.branch_number,
          ...(hasClient && {
            client_id:      client.id,
            client_shop_id: client.shop_id,
          }),
        })

        const isNaverBooking = !!sales?.fields?.naver_sales_info
        if (this.draftDocumentId && isNaverBooking) {
          sales.setFields({
            booking_status: this.bookingItem?.data?.status || this.x_booking_action?.data?.status,
          })
        }

        // clear balance_moves
        if (!this.isNaverRequestPaymentCalled) {
          this.setSalesActionHelperBalanceMoves([])
          if (this.$refs.sales_item_adding_action) {
            this.$refs.sales_item_adding_action.prepaid_cards_balance_moves = []
          }
        }

        const hasBookingId = sales.fields.booking_id > 0
        const hasPayments = sales.fields.payments?.length > 0
        const hasSalesItems = sales.fields.sales_items?.length > 0

        if (hasSalesItems || hasPayments || hasBookingId) {
          if (this.draftDocumentId || this.is_edit_mode) {
            sales.setFields(this.calculateSalesAmount(sales, false).fields)
          } else {
            sales.setFields(this.calculateSalesAmount(sales, hasPayments).fields)
          }
        }

        if (this.is_add_mode) {
          const isSalesOfBookingNaver = this.checkoutSalesOfNaverBooking(sales)
          const isSalesOfCheckedoutNaverBooking = this.checkSalesOfCheckedOutBooking(sales)

          if (this.draftDocumentId) {
            sales.fields.invoice_date_time = convertDateToTimezone(new Date())
          } else if (isSalesOfBookingNaver && isSalesOfCheckedoutNaverBooking && sales.fields.invoice_date_time_ts > 0) {
            // Case add the naver booking to sales when the booking was checkedout
            // The sales invoice date is naver booking completed use time
            const invoiceMoment = moment.unix(sales.fields.invoice_date_time_ts).utc()
            sales.fields.invoice_date_time = new Date(invoiceMoment.year(), invoiceMoment.month(), invoiceMoment.date(), invoiceMoment.hours(), invoiceMoment.minute())
          } else {
            sales.fields.invoice_date_time = convertDateToTimezone(new Date())
          }

          this.isSalesItemsAddingActionVisible = !hasSalesItems
        }

        if (this.is_edit_mode && this.x_sales_action.data.sales_id > 0) {
          sales.fields.invoice_date_time = convertDateToTimezone(new Date(sales.fields.invoice_date_time_ts * 1000))
          this.hasPrepaidGoods = this.checkSalesEditHasPrepaidGoods(sales.fields.sales_items)
        }

        // client prepaid cards & client prepaid services
        if (hasSalesItems) {
          let isSalesIncludePrepaidCardOrDeductBalance = this.isSalesEditIncludePrepaidCardOrDeductBalance(sales.fields.sales_items)
          let isSalesEditIncludePrepaidServiceOrDeductService = this.isSalesEditIncludePrepaidServiceOrDeductService(sales.fields.sales_items)

          this.setIsSalesEditIncludePrepaidCardOrDeductBalance(isSalesIncludePrepaidCardOrDeductBalance)
          this.setIsSalesEditIncludePrepaidServiceOrDeductService(isSalesEditIncludePrepaidServiceOrDeductService)

          if (hasClient) {
            const mustLoadClientPrepaidCards = this.isSalesItemsIncludePrepaidCardOrDeductBalance(sales.fields.sales_items)
            const mustLoadClientPrepaidServices = this.isSalesItemsIncludePrepaidServiceOrDeductService(sales.fields.sales_items)

            if (mustLoadClientPrepaidCards && !this.isLoadedClientPrepaidCards) {
              await this.loadClientPrepaidCardsAsync(client.id)
            }

            if (mustLoadClientPrepaidServices && !this.isLoadedClientPrepaidServices) {
              await this.loadClientPrepaidServicesAsync(client.id)
            }

            if (!this.draftDocumentId && this.is_add_mode) {
              for (let tmpSalesItem of sales.fields.sales_items) {
                this.updateClientPrepaidServiceQuantityToStoreBySalesItem(tmpSalesItem)
              }
              if (!hasBookingId) {
                sales.fields.sales_items = this.checkSalesItemsPreferredStaff(sales.fields.sales_items, client)
              }
            }
          }
        }

        const negativeCashChangeIndex = sales.fields?.payments?.findIndex(payment => payment.payment_amount < 0 && payment.payment_type === sales_options.sales_payment_type.sales)

        if (negativeCashChangeIndex !== -1) {
          const negativeCashPayment = sales.fields?.payments?.splice(negativeCashChangeIndex, 1)
          sales.fields.outstanding += negativeCashPayment?.[0]?.payment_amount
        }

        this.sales = sales
        this.client = client
        this.clientAccount = clientAccount
        this.isDeletedClient = !!this.x_sales_action.data.client_id && !this.client?.id

        this.invoice_date = sales.fields.invoice_date_time
        this.invoice_time = moment(sales.fields.invoice_date_time).format(options.standard_hour_format.h24)

        this.$emit('show', { sales, client, clientAccount })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    updateClientPrepaidServiceQuantityToStoreBySalesItem(sales_item) {
      let tmp_prepaid_service_ref = this.x_sales_action_helper.client_prepaid_services_all.find(c => c.id == sales_item.deducted_prepaid_goods_ref)
      if (tmp_prepaid_service_ref != undefined && !tmp_prepaid_service_ref.no_limit) {
        this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service_ref.id, Number(tmp_prepaid_service_ref.quantity - 1))
      }
    },
    isSalesItemDisabledAction(sales_item) {
      return (
        this.cannotEditSalesDetail ||
        sales_item.gift_card_type === sales_options.gift_card_type.redeem ||
        (
          // is prepaid service deduction item
          sales_item.deduction_type === sales_options.deduction_type.prepaid_service &&
          (
            sales_item.deducted_prepaid_goods_ref > 0 ||
            sales_item.deducted_by_prepaid_goods_guid
          )
        )
      )
    },
    canEditQuantityOfPrepaidGoods(sales_item) {
      let is_editable = true
      let is_discount_card = sales_item.goods_type === sales_options.sales_goods_type.prepaid_card &&
        sales_item.prepaid_card_type === sales_options.prepaid_card_type.discount_card &&
        sales_item.gift_card_type !== sales_options.gift_card_type.sales
      let is_prepaid_service_no_limit_quantity = sales_item.goods_type === sales_options.sales_goods_type.prepaid_service &&
        sales_item.prepaid_service_initial_quantity === options.enum_no_limit
      if (this.is_add_mode && is_discount_card || is_prepaid_service_no_limit_quantity) {
        is_editable = false
      }

      if (
        this.is_edit_mode &&
        (sales_item.goods_type === sales_options.sales_goods_type.prepaid_card || sales_item.goods_type === sales_options.sales_goods_type.prepaid_service)
      ) {
        if (sales_item.client_prepaid_goods_id > 0) {
          is_editable = false
        }
        else {
          if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_card &&
            sales_item.prepaid_card_type === sales_options.prepaid_card_type.discount_card &&
            (sales_item.gift_card_type === sales_options.gift_card_type.none || sales_item.gift_card_type === sales_options.gift_card_type.redeem)
          ) {
            is_editable = false
          }
        }
      }
      return is_editable
    },

    // add & delete sales-items
    async onClickedGoodsType(sales_goods_type) {
      if (sales_goods_type === sales_options.sales_goods_type.prepaid_card) {
        await this.loadClientPrepaidCardsAsync(this.client.id)
      }
      // not catch deduct_prepaid_service because sales-item-prepaid-services must setDefaultActiveTab
      if (sales_goods_type === sales_options.sales_goods_type.prepaid_service) {
        await this.loadClientPrepaidServicesAsync(this.client.id)
      }

      this.setSalesActionShowedGoodsType(sales_goods_type)
      this.isSalesItemsAddingActionVisible = true
    },

    async onAddSalesItems(salesItems = []) {
      // update sales items
      this.is_show_total_amount = true // view on mobile

      const attachedKeySalesItems = this.attachSalesItemsKey(salesItems, 'temp')

      this.sales.fields.sales_items = [
        ...this.sales.fields.sales_items,
        ...attachedKeySalesItems,
      ]

      // handle discount card | goods-type is sames for all sales-item added by sales-item-adding
      this.handleDiscountCardBaseSalesItems({
        clientId:       this.client?.id,
        salesItems:     attachedKeySalesItems,
        salesGoodsType: this.x_sales_action.options.sales_goods_type,
      })

      // Update expiry date of temporary adding prepaid service
      this.updateExpiryDatePrepaidServicesSalesItemsAddingTemporarily()

      // update checkout info
      this.updateSalesCheckout()
    },
    async handleDiscountCardBaseSalesItems({ clientId, salesItems, salesGoodsType }) {
      // when onAddSalesItems finish
      // then sales-items-adding-action-modal will hide immediately and setSalesActionShowedGoodsType = service
      const canUseDiscountCard = [sales_options.sales_goods_type.service, sales_options.sales_goods_type.product]
      const isContainProductOrService = salesItems.some(item => canUseDiscountCard.includes(item.goods_type))
      if (clientId && (canUseDiscountCard.includes(salesGoodsType) || isContainProductOrService)) {
        await this.loadClientPrepaidCardsAsync(clientId)
        const applyDiscountCards = SalesUtils.getDiscountCardsToApply(this.currentSalesInvoiceDatetimeTs, salesItems)

        if (applyDiscountCards.product.length > 0 || applyDiscountCards.service.length > 0) {
          this.addedSalesItemGoodType = salesGoodsType
          this.appliedDiscountSalesItems = salesItems
          this.updateExpiryDatePrepaidCardsSalesItemsAddingTemporarily()
          this.showDialogById('sales-item-discount-card-apply-modal')
          return
        }
      }

      this.sales.fields.sales_items = this.attachSalesItemsKey([...this.sales.fields.sales_items])
      // this.updateSalesCheckout()
    },
    handleSalesItemsApplyDiscount(discountedSalesItems) {
      for (let salesItem of discountedSalesItems) {
        this.updateSalesItemAmount(salesItem)
      }

      this.sales.fields.sales_items = this.attachSalesItemsKey([...this.sales.fields.sales_items])
      this.updateSalesCheckout()
    },
    handleModalDiscountCardApplyHidden() {
      this.sales.fields.sales_items = this.attachSalesItemsKey([...this.sales.fields.sales_items])
      // this.updateSalesCheckout()
    },
    onDeleteSalesItem(deleted_sales_item) {
      if (
        deleted_sales_item?.deducted_prepaid_goods_ref &&
        deleted_sales_item?.deduction_type === sales_options.deduction_type.prepaid_card
      ) {
        const selectedDeductedPrepaidCard = (this.x_sales_action_helper?.client_prepaid_cards || []).find(
          prepaidCard => (
            prepaidCard.id === deleted_sales_item.deducted_prepaid_goods_ref ||
            prepaidCard.id === deleted_sales_item.deducted_by_prepaid_goods_guid
          ),
        )

        if (!selectedDeductedPrepaidCard) {
          this._showDialogAlert([this.$t('sales.delete-sales-item-paid-by-balance-deduct-famaily-after-remove-family')])
          return
        }

        const currentDateTsByShopSettingMoment = parseDateTSToMomentWithAddingShopSettingTimezone({
          inputDateTS:       moment().unix(),
          inputDateTimezone: 0,
        }).unix()
        const isPrepaidCardExpiredByPassingExpiryDate = (
          selectedDeductedPrepaidCard.expiry_date_ts !== -1 &&
          selectedDeductedPrepaidCard.expiry_date_ts < currentDateTsByShopSettingMoment
        )

        if (isPrepaidCardExpiredByPassingExpiryDate) {
          this._showDialogAlert([this.$t('sales.delete-expired-prepaid-card-deduction-warning')])
          return
        }
      }

      let tmp_error_messages = []
      // 1. sales-item is prepaid-card
      if (deleted_sales_item.goods_type === sales_options.sales_goods_type.prepaid_card
        && deleted_sales_item.deduction_type === sales_options.deduction_type.none) {
        // can not delete prepaid-card which deducted
        for (let tmp_sales_item of this.sales.fields.sales_items) {
          if (tmp_sales_item.key === deleted_sales_item.key) continue
          if (this.isDeductedInSales(deleted_sales_item, tmp_sales_item)) {
            const tmp_error_message = this.$t('sales.warning-client-prepaid-card-used-and-can-not-delete', {
              'sales-item-name': escapeHtml(tmp_sales_item.goods_name || ''),
            })
            tmp_error_messages.push(tmp_error_message)
          }
        }

        if (tmp_error_messages.length === 0) {
          // remove client-prepaid-card out of store
          this.x_sales_action_helper.client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards.filter(c => (
            deleted_sales_item.prepaid_goods_guid && c.id !== deleted_sales_item.prepaid_goods_guid ||
            deleted_sales_item.client_prepaid_goods_id && c.id !== deleted_sales_item.client_prepaid_goods_id
          ))

          // restore merged cards to before merged
          let tmp_balance_moves_to_deleted_card = this.x_sales_action_helper.balance_moves.filter(bm => bm.to_prepaid_card_guid == deleted_sales_item.prepaid_goods_guid)
          if (tmp_balance_moves_to_deleted_card.length > 0) {
            let tmp_merged_client_prepaid_cards = []
            for (let tmp_balance_move of tmp_balance_moves_to_deleted_card) {
              let tmp_client_prepaid_card_origin = this.x_sales_action_helper.client_prepaid_cards_origin.find(c => c.id == tmp_balance_move.from_client_prepaid_card_id)
              if (tmp_client_prepaid_card_origin) {
                // remove merged card out of viewing-list
                this.x_sales_action_helper.client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards.filter(
                  c => c.id !== tmp_client_prepaid_card_origin.id,
                )

                // recalculated merged card
                // 1. restore original
                // 2. calculate remaining balance of restore card
                let tmp_merged_client_prepaid_card = cloneDeep(tmp_client_prepaid_card_origin)
                let tmp_sales_item_total_deduction_amount = 0
                for (let tmp_sales_item of this.sales.fields.sales_items) {
                  if (tmp_merged_client_prepaid_card.id === tmp_sales_item.deducted_prepaid_goods_ref
                    || tmp_merged_client_prepaid_card.id === tmp_sales_item.deducted_by_prepaid_goods_guid) {
                    tmp_sales_item_total_deduction_amount += Number(tmp_sales_item.deduction_amount)
                  }
                }
                tmp_merged_client_prepaid_card.balance -= tmp_sales_item_total_deduction_amount
                tmp_merged_client_prepaid_cards.push(tmp_merged_client_prepaid_card)
              }
            }

            // re-add merged card to viewing-list
            this.x_sales_action_helper.client_prepaid_cards = [...this.x_sales_action_helper.client_prepaid_cards, ...tmp_merged_client_prepaid_cards]
            this.setSalesActionHelperBalanceMoves(this.x_sales_action_helper.balance_moves.filter(bm => {
              return bm.to_prepaid_card_guid != deleted_sales_item.prepaid_goods_guid
            }))
          }
        }
      }

      // prepaid service
      if (deleted_sales_item.goods_type === sales_options.sales_goods_type.prepaid_service) {
        for (let tmp_sales_item of this.sales.fields.sales_items) {
          if (tmp_sales_item.key === deleted_sales_item.key) continue

          if (this.isDeductedInSales(deleted_sales_item, tmp_sales_item)) {
            const tmp_error_message = this.$t('sales.warning-client-prepaid-service-used-and-can-not-delete', {
              'sales-item-name': escapeHtml(tmp_sales_item.goods_name || ''),
            })
            tmp_error_messages.push(tmp_error_message)
          }
        }

        if (tmp_error_messages.length == 0) {
          //3. sales item is deducted prepaid service
          if (this.isSalesItemAsDeductPrepaidService(deleted_sales_item)) {
            let deducted_prepaid_goods_ref = deleted_sales_item.deducted_prepaid_goods_ref // deducted from existing prepaid service
            if (!deleted_sales_item.deducted_prepaid_goods_ref > 0) {
              deducted_prepaid_goods_ref = deleted_sales_item.deducted_by_prepaid_goods_guid // deducted from new prepaid service
            }

            let tmp_prepaid_service_ref = find(this.x_sales_action_helper.client_prepaid_services_all, c => c.id === deducted_prepaid_goods_ref)
            if (tmp_prepaid_service_ref !== undefined && !tmp_prepaid_service_ref.no_limit) {
              this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service_ref.id, Number(tmp_prepaid_service_ref.quantity) + Number(deleted_sales_item.quantity))
            }
          }

          // 4. sales item: prepaid service
          if (this.isSalesItemAsPrepaidService(deleted_sales_item)) {
            this.deleteItemFromClientPrepaidServicesAll(deleted_sales_item.prepaid_goods_guid) // when just added
            this.deleteItemFromClientPrepaidServicesAll(deleted_sales_item.client_prepaid_goods_id) // when added before
          }
        }
      }

      // 2. sales item has prepaid card deduction (goods-type is service, product, prepaid-service)
      // recalculated balance of cards by sales items have deduction balance
      if (tmp_error_messages.length === 0 && deleted_sales_item.deduction_type === sales_options.deduction_type.prepaid_card) {
        let to_card = null
        for (let tmp_balance_move of this.x_sales_action_helper.balance_moves) {
          if (tmp_balance_move.from_client_prepaid_card_id === deleted_sales_item.deducted_prepaid_goods_ref
            || tmp_balance_move.from_client_prepaid_card_id === deleted_sales_item.deducted_by_prepaid_goods_guid) {
            to_card = this.x_sales_action_helper.client_prepaid_cards.find(c => c.id === tmp_balance_move.to_prepaid_card_guid)

            // update balance move
            tmp_balance_move.move_balance += Number(deleted_sales_item.deduction_amount)
          }
        }

        // deducted-card merged to new-card
        if (to_card) {
          // update card
          for (let client_prepaid_card of this.x_sales_action_helper.client_prepaid_cards) {
            if (to_card.id === client_prepaid_card.id) {
              client_prepaid_card.balance += Number(deleted_sales_item.deduction_amount)
              break
            }
          }
        }
        // deducted-card not merged to new-card
        else {
          for (let client_prepaid_card of this.x_sales_action_helper.client_prepaid_cards) {
            if (client_prepaid_card.id === deleted_sales_item.deducted_prepaid_goods_ref
              || client_prepaid_card.id === deleted_sales_item.deducted_by_prepaid_goods_guid) {
              client_prepaid_card.balance += Number(deleted_sales_item.deduction_amount)
              break
            }
          }
        }
      }

      if (tmp_error_messages.length === 0) {
        const deletedSalesItems = this.sales.fields.sales_items.filter(salesItem => salesItem.key !== deleted_sales_item.key)
        this.sales.fields.sales_items = this.attachSalesItemsKey(deletedSalesItems)
        this.updateSalesCheckout()
      }
      else {
        this._showDialogAlert(tmp_error_messages)
      }
    },
    isSalesItemAsPrepaidService(sales_item) {
      return sales_item.goods_type === sales_options.sales_goods_type.prepaid_service
        && (sales_item.amount > 0 || (sales_item.amount == 0 && sales_item.deduction_type !== sales_options.deduction_type.prepaid_service))
    },
    isSalesItemAsDeductPrepaidService(sales_item) {
      return sales_item.goods_type === sales_options.sales_goods_type.prepaid_service
        && sales_item.deduction_type === sales_options.deduction_type.prepaid_service
        && sales_item.amount === 0
    },
    isDeductedInSales(sales_item_deleted, sales_item_other) {
      let is_deducted_in_sales = false

      if (sales_item_deleted.prepaid_goods_guid !== null
        && sales_item_deleted.prepaid_goods_guid !== 0
        && sales_item_deleted.prepaid_goods_guid === sales_item_other.deducted_by_prepaid_goods_guid) {
        is_deducted_in_sales = true
      }

      if (this.is_edit_mode
        && sales_item_deleted.client_prepaid_goods_id !== null
        && sales_item_deleted.client_prepaid_goods_id !== 0
        && sales_item_deleted.client_prepaid_goods_id === sales_item_other.deducted_prepaid_goods_ref) {
        is_deducted_in_sales = true
      }

      return is_deducted_in_sales
    },

    attachSalesItemsKey(salesItems = [], prefix = '') {
      return salesItems.map((item, key) => ({
        ...item,
        key: `${prefix}${key}`,
      }))
    },

    // edit sales-item
    onInputSalesItemUnitPrice(new_unit_price) { // input unit-price by input-money-calculator-panel
      const sales_item = this.x_sales_item_action.data
      let previous_unit_price = sales_item.unit_price
      let previous_sales_item_amount = sales_item.amount

      // sales item: check sales-item-amount
      sales_item.unit_price = new_unit_price
      const errorMessages = this.validateSalesItemAmount(sales_item, previous_sales_item_amount)
      if (errorMessages.length > 0) {
        this._showDialogAlert(errorMessages)
        sales_item.unit_price = previous_unit_price
        return
      }
      this.updateSalesItemAmount(sales_item)
    },
    validateSalesItemAmount(sales_item, previous_sales_item_amount) {
      let errorMessages = []
      const newSalesItemAmount = this.preCalculateSalesItemAmount(sales_item)
      const newSalesItemAmountString = parseNumberToStringExcludeDecimal(newSalesItemAmount)
      const newSalesTotalAmount = this.sales.fields.total_amount - previous_sales_item_amount + newSalesItemAmount
      const newSalesTotalAmountString = parseNumberToStringExcludeDecimal(newSalesTotalAmount)
      if (newSalesItemAmount < 0) {
        errorMessages = [this.warning_sales_item_amount_can_not_be_negative]
      }
      else if (newSalesItemAmountString.length > sales_options.sales_item_amount_maxcharacters) {
        errorMessages = [this.warning_sales_item_amount_can_not_exceed_max_characters]
      }
      else if (newSalesTotalAmountString.length > sales_options.sales_total_amount_maxcharacters) {
        errorMessages = [this.warning_sales_amount_can_not_exceed_max_characters]
      }
      return errorMessages
    },
    preCalculateSalesItemAmount(salesItem) {
      const tempSalesItem = cloneDeep(salesItem)
      const discountedSalesItem = this.updateSalesItemAmountByDiscount(tempSalesItem)
      if (discountedSalesItem.deduction_type === sales_options.deduction_type.prepaid_service
        || discountedSalesItem.gift_card_type === sales_options.gift_card_type.redeem) {
        discountedSalesItem.amount = 0
      }
      return discountedSalesItem.amount
    },

    async onInputSalesItemQuantity(sales_item) { // input to sales-items table directly
      this.shouldUpdateQuantity = true
      await this.$nextTick()
      if (this.shouldUpdateQuantity) {
        let previous_quantity = sales_item.previous_quantity
        let previous_sales_item = cloneDeep(sales_item)
        let new_quantity = Number(sales_item.quantity)

        previous_sales_item.quantity = previous_quantity

        if (new_quantity === previous_quantity) return

        let previous_sales_item_amount = this.preCalculateSalesItemAmount(previous_sales_item)

        for (let tmp_sales_item of this.sales.fields.sales_items) {
          if (tmp_sales_item.key === sales_item.key) {
            tmp_sales_item.quantity = new_quantity

            // sales item: check sales-item-amount
            const errorMessages = this.validateSalesItemAmount(sales_item, previous_sales_item_amount)
            if (errorMessages.length > 0) {
              this._showDialogAlert(errorMessages)
              tmp_sales_item.quantity = previous_quantity
              this.shouldUpdateQuantity = false
              return
            }

            // sales item: deducted prepaid service
            if (this.isSalesItemAsDeductPrepaidService(sales_item)) {
              let tmp_prepaid_service_ref = this.x_sales_action_helper.client_prepaid_services_all.find(c => c.id === sales_item.deducted_prepaid_goods_ref || c.id === sales_item.deducted_by_prepaid_goods_guid)

              if (!tmp_prepaid_service_ref) {
                this._showDialogAlert([this.warning_deduct_qty_larger_existing_qty])
                tmp_sales_item.quantity = previous_quantity
                this.shouldUpdateQuantity = false
                return
              }

              if (tmp_prepaid_service_ref.no_limit) {
                break
              }

              let tmp_deducted_quantity_new = new_quantity
              let tmp_remaining_quantity_new = Number(tmp_prepaid_service_ref.quantity) + Number(previous_quantity)

              if (tmp_deducted_quantity_new > tmp_remaining_quantity_new) {
                this._showDialogAlert([this.warning_deduct_qty_larger_existing_qty])
                tmp_sales_item.quantity = previous_quantity
                this.shouldUpdateQuantity = false
                return
              }
            }
            break
          }
        }

        // prepaid card: update store
        if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_card) {
          // deposit card change balance
          if (sales_item.prepaid_card_type === sales_options.prepaid_card_type.deposit_card) {
            let tmp_initial_balance = new_quantity * Number(sales_item.prepaid_card_initial_balance)
            let tmp_deduct_balance = 0
            for (let tmp_sales_item of this.sales.fields.sales_items) {
              if (tmp_sales_item.deducted_by_prepaid_goods_guid == sales_item.prepaid_goods_guid) {
                tmp_deduct_balance += Number(tmp_sales_item.deduction_amount)
              }
            }
            let tmp_client_prepaid_card = {
              id:          sales_item.prepaid_goods_guid,
              new_balance: tmp_initial_balance - tmp_deduct_balance,
            }
            this.updatePrepaidCardBalanceToStore(tmp_client_prepaid_card)
          }
        }

        // prepaid service: update store
        if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_service) {
          let tmp_current_quantity = 0
          let tmp_deducted_quantity = 0
          let tmp_remaining_quantity = 0

          // sales item: deducted prepaid service
          if (this.isSalesItemAsDeductPrepaidService(sales_item)) {
            let tmp_prepaid_service = find(this.x_sales_action_helper.client_prepaid_services_all,
              ps => ps.id === sales_item.deducted_prepaid_goods_ref || ps.id == sales_item.deducted_by_prepaid_goods_guid,
            )
            if (tmp_prepaid_service && !tmp_prepaid_service.no_limit) {
              tmp_current_quantity = Number(tmp_prepaid_service.quantity) + Number(previous_quantity)
              tmp_deducted_quantity = new_quantity
              tmp_remaining_quantity = this.calRemainingQuantityOfPrepaidService(tmp_current_quantity, tmp_deducted_quantity)
              this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service.id, tmp_remaining_quantity)
            }
          }

          // sales item: new prepaid service
          if (this.isSalesItemAsPrepaidService(sales_item)) {
            if (sales_item.prepaid_service_initial_quantity !== options.enum_no_limit) {
              tmp_current_quantity = new_quantity * Number(sales_item.prepaid_service_initial_quantity)

              for (let tmp_sales_item of this.sales.fields.sales_items) {
                if (tmp_sales_item.deducted_by_prepaid_goods_guid == sales_item.prepaid_goods_guid) {
                  tmp_deducted_quantity += Number(tmp_sales_item.quantity)
                }
              }

              if (tmp_current_quantity < tmp_deducted_quantity) {
                new_quantity = previous_quantity
                sales_item.quantity = previous_quantity

                const errorMessage = this.$t('sales.warning-client-prepaid-service-used-and-can-not-decrease', {
                  'sales-item-name': escapeHtml(sales_item.related_service_name || ''),
                })

                this._showDialogAlert([errorMessage])
              } else {
                tmp_remaining_quantity = this.calRemainingQuantityOfPrepaidService(tmp_current_quantity, tmp_deducted_quantity)

                this.updateClientPrepaidServiceQuantityToStore(sales_item.prepaid_goods_guid, tmp_remaining_quantity)
              }
            }
          }
        }

        sales_item.previous_quantity = new_quantity
        this.updateSalesItemAmount(sales_item)
      }

    },

    getTotalDeductedQuantityOfDeductedPrepaidService(client_prepaid_service_id) {
      let tmp_deducted_quantity = 0
      for (let sales_item of this.sales.fields.sales_items) {
        if (client_prepaid_service_id === sales_item.deducted_prepaid_goods_ref
          || client_prepaid_service_id === sales_item.deducted_by_prepaid_goods_guid) {
          tmp_deducted_quantity += Number(sales_item.quantity)
        }
      }
      return tmp_deducted_quantity
    },

    updateClientPrepaidServiceQuantityToStore(client_prepaid_service_id, new_quantity) {
      let tmp_client_prepaid_service_changed_quantity = {
        id:           client_prepaid_service_id,
        new_quantity: new_quantity,
      }
      this.updatePrepaidServiceQuantityToStore(tmp_client_prepaid_service_changed_quantity)
    },

    calRemainingQuantityOfPrepaidService(current_quantity, deducted_quantity) {
      return current_quantity - deducted_quantity
    },

    async onActionSalesItem(salesItem, salesItemActionType) {
      this.setSalesItemActionItemFields(cloneDeep(salesItem))

      switch (salesItemActionType) {
        case sales_options.sales_item_action_type.discount_action:
          this.discountForSales = false
          this.discountOriginalAmount = salesItem?.unit_price * salesItem?.quantity
          this.isShowMultipleDiscountModal = true
          this.discountSalesItem = salesItem
          break
        case sales_options.sales_item_action_type.staff_action:
          this.showDialogById('sales-item-staff-action-sales-modal')
          break
        case sales_options.sales_item_action_type.sales_type_action:
          this.showDialogById('sales-item-sales-type-action-modal')
          break
        // Points Deduct = Min (Current Points, Min ((Outstanding + Balance Deduct of the Item + Payment not paid), Sales Amount of the item))
        // Calculate point can paid
        case sales_options.sales_item_action_type.deduction_point_action: {
          let tmpDeductionPoints = salesItem.deduction_points

          if (tmpDeductionPoints === 0) {
            const tmpCanPaidAmount = Math.min((this.sales.fields.outstanding + salesItem.deduction_amount + this.calculationPayment().notPaid), salesItem.amount)
            tmpDeductionPoints = Math.min(this.clientLoyaltyPoints, tmpCanPaidAmount)
            tmpDeductionPoints = Math.max(0, tmpDeductionPoints)
          }
          const moneyCalculatorPanelAction = {
            data:   tmpDeductionPoints,
            action: sales_options.calculator_type.sales_item_deduction_points,
          }
          this.setMoneyCalculatorPanelAction(moneyCalculatorPanelAction)
          this.showDialogById('input-money-calculator-panel-action-modal')
          break
        }
        //Balance Deduct = Min (Current Balance, Min ((Outstanding + Payment not paid), (Sales Amount of the item - Points Deduct of the item))
        case sales_options.sales_item_action_type.balance_deduction_action: {
          let tmpDeductionAmount = salesItem.deduction_amount
          if (tmpDeductionAmount > 0) {
            await this.loadClientPrepaidCardsAsync(this.client.id)
            this.updateClientPrepaidCardBySalesItemBalanceDeduction(salesItem, UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.PLUS)
          } else {
            // Default Value = Item Sales Amount – Item Points Deduction
            // Note: The same rule as the Points Deduction apply, except that the Points Deduction amount is subtracted.

            // Determine available balance for default value
            let availableBalance = 0
            const selectedPrepaidCardKey = salesItem.deducted_prepaid_goods_ref || salesItem.deducted_by_prepaid_goods_guid
            await this.loadClientPrepaidCardsAsync(this.client.id)
            if (selectedPrepaidCardKey) {
              const selectedCard = this.x_sales_action_helper?.client_prepaid_cards?.find(c => c.id === selectedPrepaidCardKey)
              availableBalance = Number(selectedCard?.balance || 0)
            } else {
              const totalPrepaidBalance = this.totalClientPrepaidCardsBalance()
              // Current balance may include newly(temporarily) added prepaid cards' balance
              availableBalance = Math.max(this.clientAccount.balance, totalPrepaidBalance)
            }

            // Apply the same logic as Points Deduction: Min((Outstanding + Current Balance Deduct + Not Paid), (Item Amount - Points Deduct))
            const tmpCanPaidAmount = Math.min(
              (this.sales.fields.outstanding + salesItem.deduction_amount + this.calculationPayment().notPaid),
              (Number(salesItem.amount || 0) - Number(salesItem.deduction_points || 0)),
            )
            tmpDeductionAmount = Math.min(availableBalance, Math.max(0, tmpCanPaidAmount))

          }
          const moneyCalculatorPanelAction = {
            data:    tmpDeductionAmount,
            action:  sales_options.calculator_type.sales_item_deduction_balance,
            options: {
              deducting_prepaid_card_id: salesItem.deducted_prepaid_goods_ref,
            },
          }
          this.setMoneyCalculatorPanelAction(moneyCalculatorPanelAction)
          this.setupDataAndShowBalanceDeductionModal(true)
          break
        }
        case sales_options.sales_item_action_type.amount: {
          const moneyCalculatorPanelAction = {
            data:   salesItem.amount,
            action: sales_options.calculator_type.sales_item_amount,
          }
          this.showCompleteBtn = false
          this.setMoneyCalculatorPanelAction(moneyCalculatorPanelAction)
          this.showDialogById('input-money-calculator-panel-action-modal')
          break
        }
        case sales_options.sales_item_action_type.unit_price: {
          const moneyCalculatorPanelAction = {
            action: sales_options.calculator_type.sales_item_unit_price,
            data:   salesItem.unit_price,
          }
          this.showCompleteBtn = false
          this.setMoneyCalculatorPanelAction(moneyCalculatorPanelAction)
          this.showDialogById('input-money-calculator-panel-action-modal')
          break
        }
      }
    },

    calculationPayment() {
      const payments = this.sales?.fields?.payments || []

      return payments.reduce((total, payment) => {
        if (!payment.payment_date_time_ts) {
          total.notPaid += payment.payment_amount
        } else if (payment.payment_type === sales_options.sales_payment_type.booking_deposit_refund) {
          total.paid -= payment.payment_amount
        } else {
          total.paid += payment.payment_amount
        }

        return total
      }, {
        paid:    0,
        notPaid: 0,
      })
    },

    //Should consider to move to computed if this one is used more than once
    totalClientPrepaidCardsBalance() {
      return this.x_sales_action_helper?.client_prepaid_cards?.reduce((total, { balance = 0 }) => total + balance, 0)
    },

    onSalesItemDiscountApply(discount) {
      const tmpSalesItem = this.sales.fields.sales_items[this.x_sales_item_action.data.key]

      tmpSalesItem.discount_type = discount.discount_type
      tmpSalesItem.discount_value = discount.discount_value
      tmpSalesItem.discount_category_id = discount.discount_category_id
      tmpSalesItem.discount_category_name = discount.discount_category_name

      this.discountForSales = false
      this.discountOriginalAmount = 0
      this.updateSalesItemAmount(tmpSalesItem)
    },

    handleApplyDiscountForSales(discount) {
      // Reset Point/Balance Deduction
      this.sales.fields.deduction_points = 0
      this.sales.fields.balance_deduction = 0

      const sales = this.sales
      const salesItems = sales.fields.sales_items || []
      /**
       * @description Filter item !== deduction prepaid service
       */
      const updatedSalesItems = salesItems.filter(salesItem => {
        return salesItem.deduction_type !== sales_options.deduction_type.prepaid_service ||
          (
            salesItem.deducted_prepaid_goods_ref <= 0 &&
            !salesItem.deducted_by_prepaid_goods_guid
          )
      })
      const salesItemsLength = updatedSalesItems?.length
      const salesAmount = updatedSalesItems.reduce((total, item) => {
        return Number(total) + (Number(item?.unit_price * item?.quantity) || 0)
      }, 0)

      const discountAmount = (() => {
        const discountValue = discount?.discount_value
        const discountTypeForSales = discount?.discount_type

        if (discountTypeForSales === sales_options.discount_type.percentage) {
          const roundCutOffType = this.salesSetup?.sales_general_setup?.discount_amount_cut_off_enum ?? 0
          return calculateCutRound({ value: salesAmount * discount?.discount_value / 100, type: roundCutOffType })
        }

        return discountValue
      })()

      /**
       * @description In case, when cut/round than discount amount is larger than then sales amount
       */
      const updatedDiscountAmount = Math.min(discountAmount, salesAmount)

      let lastDiscountAmount = updatedDiscountAmount
      for (let i = 0; i < salesItemsLength - 1; i++) {
        const salesItem = updatedSalesItems[i]
        const salesItemAmount = Number(salesItem?.unit_price * salesItem?.quantity) || 0
        const calculateDiscountValue = +Number(updatedDiscountAmount * salesItemAmount / salesAmount).toFixed() || 0
        const discountValue = Math.min(calculateDiscountValue, lastDiscountAmount)
        salesItem.discount_value = discountValue
        salesItem.discount_type = sales_options.discount_type.amount

        if (discountValue) {
          salesItem.discount_category_id = discount.discount_category_id
          salesItem.discount_category_name = discount.discount_category_name
        }

        lastDiscountAmount -= discountValue
        lastDiscountAmount = Math.max(lastDiscountAmount, 0)
        this.updateSalesItemAmount(salesItem)
      }

      const salesItem = updatedSalesItems.at(-1)
      salesItem.discount_value = Math.max(lastDiscountAmount, 0)
      salesItem.discount_type = sales_options.discount_type.amount

      if (salesItem?.discount_value) {
        salesItem.discount_category_id = discount.discount_category_id
        salesItem.discount_category_name = discount.discount_category_name
      }
      this.updateSalesItemAmount(salesItem)

      this.discountForSales = false
      this.discountOriginalAmount = 0
    },

    onSalesItemStaffsApply(staffs, splitSalesType, isCheckMultipleStaff) {
      for (let sales_item of this.sales.fields.sales_items) {
        if (sales_item.key === this.x_sales_item_action.data.key) {
          sales_item.staffs = staffs
          sales_item.split_sales_type = splitSalesType
          sales_item.is_check_multiple_staff = isCheckMultipleStaff
        }
      }
    },
    onSalesItemSalesTypeApply(sales_type) {
      for (let sales_item of this.sales.fields.sales_items) {
        if (sales_item.key === this.x_sales_item_action.data.key) {
          sales_item.sales_type_id = sales_type.sales_type_id
          sales_item.sales_type_name = sales_type.sales_type_name
        }
      }
    },
    async onOpenedBalanceDeductionAction(callback) {
      await this.loadClientPrepaidCardsAsync(this.client.id)
      // Todo: need to be refactored
      callback()
    },
    onCloseWithNotChangeBalanceDeduction(sales_item_deducted_balance) {
      if (!sales_item_deducted_balance) {
        return
      }

      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_item_deduction_balance) {
        this.updateClientPrepaidCardBySalesItemBalanceDeduction(sales_item_deducted_balance, UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.MINUS)
      }
      else if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_deduction_balance) {
        for (let sales_item of this.sales.fields.sales_items) {
          this.updateClientPrepaidCardBySalesItemBalanceDeduction(sales_item, UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.MINUS)
        }
      }
    },

    onConfirmResetBalanceDeductions(deductingPrepaidCardId, deductingBalance = 0) {
      let isAlreadyExcludedReturnBalance = false
      for (let salesItem of this.sales.fields.sales_items) {
        this.clearSalesItemBalanceDeduction(
          salesItem,
          !this.isBalanceDeductingOnSalesItem,
          deductingPrepaidCardId &&
          (
            salesItem.deducted_prepaid_goods_ref === deductingPrepaidCardId ||
            salesItem.deducted_by_prepaid_goods_guid === deductingPrepaidCardId
          ) &&
          !isAlreadyExcludedReturnBalance && deductingBalance ||
          0,
        )

        if (
          (
            salesItem.deducted_prepaid_goods_ref === deductingPrepaidCardId ||
            salesItem.deducted_by_prepaid_goods_guid === deductingPrepaidCardId
          ) &&
          this.isBalanceDeductingOnSalesItem &&
          !isAlreadyExcludedReturnBalance &&
          deductingBalance > 0
        ) {
          isAlreadyExcludedReturnBalance = true
        }
      }
      this.updateSalesCheckout()
    },

    handleBalanceDeductionRemove() {
      for (let salesItem of this.sales.fields.sales_items) {
        this.clearSalesItemBalanceDeduction(salesItem)
      }

      this.updateSalesCheckout()
    },

    handlePointDedutionRemove() {
      for (let salesItem of this.sales.fields.sales_items) {
        salesItem.deduction_points = 0
      }

      this.updateSalesCheckout()
    },

    updateExpiryDatePrepaidCardsSalesItemsAddingTemporarily() {
      this.setSalesActionHelperClientPrepaidCards(
        (this.x_sales_action_helper?.client_prepaid_cards || []).map(prepaidCard => {
          if (prepaidCard.is_adding_temporarily) {
            return {
              ...prepaidCard,
              expiry_date_ts: (
                prepaidCard.validity &&
                prepaidCard.validity_type &&
                this.getNewPrepaidGoodsExpiryDateTS(prepaidCard.validity, prepaidCard.validity_type, this.currentSalesInvoiceDatetimeTs) ||
                prepaidCard.expiry_date_ts
              ),
            }
          }

          return prepaidCard
        }),
      )
    },

    updateExpiryDatePrepaidServicesSalesItemsAddingTemporarily() {
      this.setSalesActionHelperClientPrepaidServicesAll(
        (this.x_sales_action_helper?.client_prepaid_services_all || []).map(prepaidService => {
          return {
            ...prepaidService,
            expiry_date_ts: (
              prepaidService.validity && prepaidService.validity_type &&
              this.getNewPrepaidGoodsExpiryDateTS(prepaidService.validity, prepaidService.validity_type, this.currentSalesInvoiceDatetimeTs) ||
              prepaidService.expiry_date_ts
            ),
          }
        }),
      )
    },

    updateClientPrepaidCardBySalesItemBalanceDeduction(sales_item, update_type) {
      let is_plus = update_type === UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.PLUS
      let is_minus = update_type === UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.MINUS

      let previous_balance_deduction = {
        id:     sales_item.deducted_prepaid_goods_ref > 0 ? sales_item.deducted_prepaid_goods_ref : sales_item.deducted_by_prepaid_goods_guid,
        amount: Number(sales_item.deduction_amount),
      }

      let to_card = this.getToCardByFromCardId(previous_balance_deduction.id)
      if (to_card) {
        // update card
        for (let tmp_client_prepaid_card of this.x_sales_action_helper.client_prepaid_cards) {
          if (tmp_client_prepaid_card.id === to_card.id) {
            if (is_plus) {
              tmp_client_prepaid_card.balance += previous_balance_deduction.amount
            }
            else if (is_minus) {
              tmp_client_prepaid_card.balance -= previous_balance_deduction.amount
            }
            break
          }
        }
        // update balance move
        for (let tmp_balance_move of this.x_sales_action_helper.balance_moves) {
          if (tmp_balance_move.from_client_prepaid_card_id === previous_balance_deduction.id) {
            if (is_plus) {
              tmp_balance_move.move_balance += previous_balance_deduction.amount
            }
            else if (is_minus) {
              tmp_balance_move.move_balance -= previous_balance_deduction.amount
            }
            break
          }
        }
      }
      else {
        let deducted_prepaid_card = this.x_sales_action_helper.client_prepaid_cards.find(c => c.id === sales_item.deducted_prepaid_goods_ref ||
          c.id === sales_item.deducted_by_prepaid_goods_guid)
        if (deducted_prepaid_card) {
          let tmp_new_balance = Number(deducted_prepaid_card.balance)
          if (is_plus) {
            tmp_new_balance += previous_balance_deduction.amount
          }
          else if (is_minus) {
            tmp_new_balance -= previous_balance_deduction.amount
          }

          // update card
          let tmp_client_prepaid_card = {
            id:          deducted_prepaid_card.id,
            new_balance: tmp_new_balance,
          }
          this.updatePrepaidCardBalanceToStore(tmp_client_prepaid_card)
        }
      }
    },

    onBalanceDeductionApply(balanceDeduction, clientPrepaidCardDeducted, salesItemDeductedBalance, completeCallback) {
      const tmpClientPrepaidCards = this.x_sales_action_helper.client_prepaid_cards
      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_item_deduction_balance) {
        for (let salesItem of this.sales.fields.sales_items) {
          if (salesItem.key !== this.x_sales_item_action.data.key) {
            continue
          }

          // validate with deduction_points
          const tmpSalesItemAmountNotDeducted = salesItem.amount - salesItem.deduction_points
          if (balanceDeduction > tmpSalesItemAmountNotDeducted) {
            this.onCloseWithNotChangeBalanceDeduction(salesItemDeductedBalance)
            this._showDialogAlert(this.warning_sales_item_balance_deduct_max)
            return
          }

          // update sales item deducted info
          this.updateSalesItemDeductedInfo(salesItem, clientPrepaidCardDeducted)

          // deduction_amount
          salesItem.deduction_amount = balanceDeduction

          break
        }
      }

      let tmpSalesBalanceDeduction = 0
      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_deduction_balance) {
        let tmpRemainBalance = balanceDeduction
        for (let salesItem of this.sales.fields.sales_items) {
          // exclude
          if (
            salesItem.deduction_type === sales_options.deduction_type.prepaid_service ||
            [options.prepaid_card_type.discount_card, options.prepaid_card_type.deposit_card].includes(salesItem.prepaid_card_type)
          ) {
            continue
          }

          // update sales item deducted info
          this.updateSalesItemDeductedInfo(salesItem, clientPrepaidCardDeducted)

          // deduction_amount
          const tmpSalesItemAmountNotDeducted = salesItem.amount - salesItem.deduction_points
          salesItem.deduction_amount = Math.min(tmpRemainBalance, tmpSalesItemAmountNotDeducted)
          tmpRemainBalance = Math.max(0, tmpRemainBalance - tmpSalesItemAmountNotDeducted)
        }

        tmpSalesBalanceDeduction = balanceDeduction - tmpRemainBalance
      }

      // re-calculate client-prepaid-cards in store
      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_deduction_balance) {
        for (let tmpClientPrepaidCard of tmpClientPrepaidCards) {
          if (tmpClientPrepaidCard.id === clientPrepaidCardDeducted.id) {
            tmpClientPrepaidCard.balance -= Number(tmpSalesBalanceDeduction)
          }
        }
      }

      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_item_deduction_balance) {
        // subtract balance from new applied card
        for (let tmpClientPrepaidCard of tmpClientPrepaidCards) {
          if (tmpClientPrepaidCard.id === clientPrepaidCardDeducted.id) {
            tmpClientPrepaidCard.balance -= Number(balanceDeduction)
          }
        }
      }

      /**
       * @description Update payment method: Clear payment not paid when update balance deduct
       */
      this.sales.fields.payments = this.sales.fields.payments.filter(payment => payment.payment_method_id && payment.payment_date_time_ts)

      this.updateSalesCheckout()

      // Scroll total amount to top when click confirm payment or deduction
      if (this.isDeductionOrPayment) {
        this.scrollTotalAmountAtTop()
      }

      completeCallback?.()
    },

    updateSalesItemDeductedInfo(sales_item, client_prepaid_card_deducted) {
      if (isNaN(client_prepaid_card_deducted.id)) {
        sales_item.deducted_prepaid_goods_ref = 0
        sales_item.deducted_by_prepaid_goods_guid = client_prepaid_card_deducted.id // deduct by new card
      }
      else {
        sales_item.deducted_prepaid_goods_ref = client_prepaid_card_deducted.id // deduct by old card
        sales_item.deducted_by_prepaid_goods_guid = ''
      }
      sales_item.deducted_prepaid_goods_ref_name = client_prepaid_card_deducted.prepaid_card_name
      sales_item.deduction_type = sales_options.deduction_type.prepaid_card
    },
    getToCardByFromCardId(from_card_id) {
      let to_card = null
      for (let tmp_balance_move of this.x_sales_action_helper.balance_moves) {
        if (tmp_balance_move.from_client_prepaid_card_id === from_card_id) {
          to_card = this.x_sales_action_helper.client_prepaid_cards.find(c => c.id === tmp_balance_move.to_prepaid_card_guid)
          break
        }
      }
      return to_card
    },

    onInputMoneyCalculator(moneyCalculator, updatedPayments, options) {
      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_payment) {
        this.onInputPaymentMethodAmount(moneyCalculator, updatedPayments)
      }

      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_item_deduction_points) {
        let tmpClientPoints = this.clientLoyaltyPoints
        if (this.is_edit_mode) {
          tmpClientPoints += this.x_money_calculator_panel_action.data
        }

        if (moneyCalculator > tmpClientPoints) {
          this._showDialogAlert(this.warning_points_deduction_exceed_client_points)
          return
        }

        for (let salesItem of this.sales.fields.sales_items) {
          if (salesItem.key !== this.x_sales_item_action.data.key) {
            continue
          }

          if (moneyCalculator > salesItem.amount) {
            this._showDialogAlert([this.warning_points_deduction_of_sales_item_exceed_amount])
            return
          }
          salesItem.deduction_points = moneyCalculator
          this.clearSalesItemBalanceDeduction(salesItem)

          break
        }

        /**
         * @description Update payment method: Clear payment not paid when update point deduct & Point deduction has paymentMethodId as null
         */
        this.sales.fields.payments = updatedPayments.filter(payment => payment.payment_method_id && payment.payment_date_time_ts)
      }

      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_deduction_points) {
        let tmpClientPoints = this.clientLoyaltyPoints
        if (this.is_edit_mode) {
          tmpClientPoints += this.x_money_calculator_panel_action.data
        }

        if (moneyCalculator > tmpClientPoints) {
          this._showDialogAlert(this.warning_points_deduction_exceed_client_points)
          return
        }

        let tmpRemainPoints = moneyCalculator
        for (let salesItem of this.sales.fields.sales_items) {
          salesItem.deduction_points = Math.min(tmpRemainPoints, salesItem.amount)
          tmpRemainPoints = Math.max(0, tmpRemainPoints - salesItem.amount)

          this.clearSalesItemBalanceDeduction(salesItem)
        }

        /**
         * @description Update payment method: Clear payment not paid when update point deduct & Point deduction has paymentMethodId as null
         */
        this.sales.fields.payments = updatedPayments.filter(payment => payment.payment_method_id && payment.payment_date_time_ts)
      }

      if (this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_item_amount) {
        const tmpSalesItem = this.x_sales_item_action.data
        const tmpSalesItemAmount = tmpSalesItem.unit_price * tmpSalesItem.quantity
        if (moneyCalculator > tmpSalesItemAmount) {
          this._showDialogAlert(this.$t('sales.warning-sales-item-amount-can-not-exceed-unit-price-multiply-quantity', {
            amount: formatMoney(tmpSalesItemAmount, 0),
          }))
          return
        } else {
          const tmpDiscount = {
            discount_category_id:   0,
            discount_category_name: '',
            discount_type:          sales_options.discount_type.amount,
            discount_value:         tmpSalesItemAmount - moneyCalculator,
          }
          this.onSalesItemDiscountApply(tmpDiscount)
        }
      }

      if (this.x_money_calculator_panel_action.action === sales_options.calculator_type.sales_item_unit_price) {
        this.onInputSalesItemUnitPrice(moneyCalculator)
      }

      this.updateSalesCheckout()
      if (options?.callback) {
        options?.callback()
      }
      // Scroll total amount to top when click confirm payment or deduction
      if (this.isDeductionOrPayment) {
        this.scrollTotalAmountAtTop()
      }
    },

    clearSalesItemBalanceDeduction(sales_item, isIgnoreReturnBalance = false, deductingBalance = 0) {
      let tmp_prepaid_card = this.x_sales_action_helper.client_prepaid_cards.find(c => c.id === sales_item.deducted_by_prepaid_goods_guid ||
        c.id === sales_item.deducted_prepaid_goods_ref)
      if (tmp_prepaid_card && !isIgnoreReturnBalance) {
        tmp_prepaid_card.balance += (sales_item.deduction_amount - deductingBalance)
      }
      sales_item.deduction_amount = 0
    },
    updateSalesItemAmount(sales_item) {
      const clonedSalesItem = cloneDeep(sales_item)

      const discountedSalesItem = this.updateSalesItemAmountByDiscount(clonedSalesItem)
      const salesItems = [...this.sales.fields.sales_items]

      const salesItemIndex = salesItems.findIndex(salesItem => salesItem.key === discountedSalesItem.key)
      if (salesItemIndex !== -1) {
        const tempSalesItem = salesItems[salesItemIndex]
        if (discountedSalesItem.deduction_type === sales_options.deduction_type.prepaid_card && discountedSalesItem.deduction_amount > 0) {
          const tempPrepaidCard = this.x_sales_action_helper.client_prepaid_cards.find(c => {
            return c.id === discountedSalesItem.deducted_by_prepaid_goods_guid || c.id === discountedSalesItem.deducted_prepaid_goods_ref
          })
          if (tempPrepaidCard) {
            let to_card = this.getToCardByFromCardId(tempPrepaidCard.id)
            if (to_card) {
              // update card
              to_card.balance += discountedSalesItem.deduction_amount

              // update balance move
              for (let tmp_balance_move of this.x_sales_action_helper.balance_moves) {
                if (tmp_balance_move.from_client_prepaid_card_id === tempPrepaidCard.id) {
                  tmp_balance_move.move_balance += discountedSalesItem.deduction_amount
                  break
                }
              }
            }
            else {
              tempPrepaidCard.balance += discountedSalesItem.deduction_amount
            }
          }
          discountedSalesItem.deduction_amount = 0
        }
        discountedSalesItem.deduction_points = 0

        if (discountedSalesItem.deduction_type === sales_options.deduction_type.prepaid_service
          || discountedSalesItem.gift_card_type === sales_options.gift_card_type.redeem) {
          discountedSalesItem.amount = 0
        }

        salesItems[salesItemIndex] = {
          ...tempSalesItem,
          ...discountedSalesItem,
        }
      }

      this.sales.fields.sales_items = salesItems
      this.updateSalesCheckout()
    },

    updateSalesItemAmountByDiscount(salesItem) {
      const clonedSalesItem = cloneDeep(salesItem)

      const itemDiscountValue = Number(clonedSalesItem?.discount_value || 0)

      const isDiscountAmount = clonedSalesItem?.discount_type === sales_options.discount_type.amount
      const isDiscountPercentage = clonedSalesItem?.discount_type === sales_options.discount_type.percentage

      const amountItem = clonedSalesItem?.unit_price * clonedSalesItem?.quantity

      const discountAmount = (() => {
        if (isDiscountPercentage) {
          return amountItem * (itemDiscountValue / 100)
        }

        if (isDiscountAmount) {
          return itemDiscountValue
        }
      })()

      const amountItemDiscounted = amountItem - discountAmount

      // discount amount cut off or round off
      let discountAmountCutOffEnum = 0
      let amountItemDiscountedRound = amountItemDiscounted

      const discountAmountCutOffType = this.salesSetup?.sales_general_setup?.discount_amount_cut_off_enum ?? 0
      const valueCutRoundOff = SalesUtils.getAmountCutRoundOffByEnum(discountAmountCutOffType)

      if (isDiscountPercentage && itemDiscountValue && valueCutRoundOff) {
        amountItemDiscountedRound = calculateCutRound({ value: amountItemDiscounted, type: discountAmountCutOffType })
        discountAmountCutOffEnum = discountAmountCutOffType
      }

      clonedSalesItem.amount = amountItemDiscountedRound
      clonedSalesItem.discount_amount_cut_off_enum = discountAmountCutOffEnum
      clonedSalesItem.staffs = SalesUtils.updateStaffsAmountOfSalesItem(clonedSalesItem?.staffs, clonedSalesItem)

      return clonedSalesItem
    },

    // sales deduction & payment
    handleBalanceDeductionActionHide() {
      this.isBalanceDeductionOnSalesItemVisible = false
    },
    setupDataAndShowBalanceDeductionModal(isBalanceDeductingOnSalesItem) {
      this.isBalanceDeductingOnSalesItem = isBalanceDeductingOnSalesItem
      this.updateExpiryDatePrepaidCardsSalesItemsAddingTemporarily()
      this.isBalanceDeductionOnSalesItemVisible = true
    },

    onActionSalesDeductionPoints() {
      const totalAmount = this.sales.fields.total_amount - this.calculationPayment().paid
      const suggestedPointsDeduction = (() => {
        const value = Math.min(
          totalAmount,
          this.clientLoyaltyPoints,
        )

        return Math.max(0, value)
      })()

      const moneyCalculatorPanelActionData = {
        data:   suggestedPointsDeduction,
        action: sales_options.calculator_type.sales_deduction_points,
      }

      this.setMoneyCalculatorPanelAction(moneyCalculatorPanelActionData)
      this.showDialogById('input-money-calculator-panel-action-modal')

      this.isDeductionOrPayment = true
    },

    onActionSalesDeductionBalance() {
      if (this.is_edit_mode && this.prepaidCardsDeduction?.isMultiplePrepaidCardsDeduction) { // this sales had multiple prepaid cards deduction
        this._showDialogAlert(this.$t('sales.multiple-prepaid-cards-deduction'))
        return
      }

      this.setSalesItemActionItemFields(new SalesItemViewModel().fields)

      let suggestedBalanceDeduction = this.sales?.fields?.balance_deduction || 0
      if (suggestedBalanceDeduction > 0) {
        // return balance-deductions to client-prepaid-cards
        for (let sales_item of this.sales.fields.sales_items) {
          if (sales_item.deduction_amount > 0) {
            this.updateClientPrepaidCardBySalesItemBalanceDeduction(sales_item, UPDATE_CLIENT_PREPAID_CARD_BALANCE_BY_SALES_ITEM_BALANCE_DEDUCTION.PLUS)
          }
        }
      }

      const totalAmount = this.sales.fields.total_amount - Number(this.sales?.fields?.deduction_points || 0)
      suggestedBalanceDeduction = totalAmount - this.getPrepaidCardSalesItemsTotalOutstandingAmount()

      // Exclude booking deposit from default deduction ONLY when there are prepaid card sales
      const hasPrepaidCardSales = (this.sales?.fields?.sales_items || []).some(salesItem => {
        return (
          salesItem.goods_type === sales_options.sales_goods_type.prepaid_card &&
          [options.prepaid_card_type.discount_card, options.prepaid_card_type.deposit_card].includes(salesItem.prepaid_card_type)
        )
      })

      if (!hasPrepaidCardSales) {
        for (const payment of this.sales.fields.payments) {
          if (payment.payment_type === sales_options.sales_payment_type.booking_deposit) {
            suggestedBalanceDeduction -= payment.payment_amount
          }

          if (payment.payment_type === sales_options.sales_payment_type.booking_deposit_refund) {
            suggestedBalanceDeduction += payment.payment_amount
          }
        }
      }

      const totalPrepaidBalance = this.totalClientPrepaidCardsBalance()
      // Current balance may include newly(temporarily) added prepaid cards' balance
      const currentBalance = Math.max(this.clientAccount.balance, totalPrepaidBalance)
      suggestedBalanceDeduction = Math.min(currentBalance, suggestedBalanceDeduction)
      suggestedBalanceDeduction = Math.max(0, suggestedBalanceDeduction)

      const deductingPrepaidCardId = (this.sales?.fields?.sales_items || []).find(salesItem => salesItem.deducted_prepaid_goods_ref)

      if (suggestedBalanceDeduction < 0) suggestedBalanceDeduction = 0

      const moneyCalculatorPanelActionData = {
        data:    suggestedBalanceDeduction,
        action:  sales_options.calculator_type.sales_deduction_balance,
        options: {
          deducting_prepaid_card_id: deductingPrepaidCardId?.deducted_prepaid_goods_ref,
        },
      }
      this.setMoneyCalculatorPanelAction(moneyCalculatorPanelActionData)
      this.setupDataAndShowBalanceDeductionModal(false)

      this.isDeductionOrPayment = true
    },

    onMultipleDiscountAction() {
      if (!this.isShowDiscountBtn) {
        return
      }
      this.isShowMultipleDiscountModal = true
    },

    onActionSalesDiscount() {
      this.discountForSales = true
      const salesItems = this.sales.fields.sales_items || []
      /**
       * @description Filter item !== deduction prepaid service
       */
      const updatedSalesItems = salesItems.filter(salesItem => {
        return salesItem.deduction_type !== sales_options.deduction_type.prepaid_service ||
          (
            salesItem.deducted_prepaid_goods_ref <= 0 &&
            !salesItem.deducted_by_prepaid_goods_guid
          )
      })
      const salesAmount = updatedSalesItems.reduce((total, item) => {
        return Number(total) + (Number(item?.unit_price * item?.quantity) || 0)
      }, 0)
      this.discountOriginalAmount = salesAmount
      this.setSalesItemActionItemFields(new SalesItemViewModel().fields)

      this.showDialogById('sales-item-discount-action-modal')
    },

    onSelectedPaymentMethod(payment_method_selected) {
      this.showCompleteBtn = true
      let money_calculator_panel_action = {
        action:  sales_options.calculator_type.sales_payment,
        data:    0,
        options: {
          payment_method_selected: payment_method_selected,
        },
      }

      if (this.sales.fields.outstanding > 0) {
        money_calculator_panel_action.data = this.sales.fields.outstanding
      }

      for (let payment of this.sales.fields.payments) {

        if (payment.payment_type === sales_options.sales_payment_type.sales && payment.payment_method_id === payment_method_selected.id) {
          money_calculator_panel_action.data = payment.payment_amount
        }
      }

      this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
      this.showDialogById('input-money-calculator-panel-action-modal')

      this.isDeductionOrPayment = true
    },
    onInputPaymentMethodAmount(money_calculator, updated_payments) {

      this.sales.fields.payments = updated_payments
      // this.updateSalesCheckout()
    },
    removeSalesPayment(payment_removed) {
      this.sales.fields.payments = this.sales.fields.payments.filter(p => {
        return p.sales_payment_id !== payment_removed.sales_payment_id
      })

      this.updateSalesCheckout()
    },

    calculateSalesAmount(sales = new SalesViewModel(), isCalculateEarnPoints = true) {
      const clonedSales = new SalesViewModel()
      clonedSales.setFields(cloneDeep(sales.fields))

      let tmpTotalAmount = 0
      // points deduction & balance deduction
      let tmpTotalPointsDeduction = 0
      let tmpTotalBalanceDeduction = 0

      for (let salesItem of clonedSales.fields.sales_items) {
        const isDeductServiceType = salesItem.deduction_type === sales_options.deduction_type.prepaid_service

        const hasDeductedPrepaidGoods = (
          salesItem.deducted_prepaid_goods_ref > 0 ||
          salesItem.deducted_by_prepaid_goods_guid
        )

        if (isDeductServiceType && hasDeductedPrepaidGoods) {
          continue
        }
        tmpTotalAmount += Number(salesItem.amount)
        tmpTotalPointsDeduction += Number(salesItem.deduction_points)
        tmpTotalBalanceDeduction += Number(salesItem.deduction_amount)
      }

      clonedSales.fields.total_amount = tmpTotalAmount
      clonedSales.fields.deduction_points = tmpTotalPointsDeduction
      clonedSales.fields.balance_deduction = tmpTotalBalanceDeduction

      clonedSales.fields.sales_items = this.clearSalesItemBalanceDeductionInfo(clonedSales.fields.sales_items)

      let tmpTotalPayments = 0
      for (let payment of clonedSales.fields.payments) {
        if (payment.payment_type !== sales_options.sales_payment_type.booking_deposit_refund) {
          tmpTotalPayments += payment.payment_amount
        }
        else {
          tmpTotalPayments -= payment.payment_amount
        }
      }
      clonedSales.fields.outstanding = tmpTotalAmount - tmpTotalPointsDeduction - tmpTotalBalanceDeduction - tmpTotalPayments

      if (clonedSales.fields.client_id > 0 && isCalculateEarnPoints) {
        clonedSales.fields.earned_points = SalesUtils.calPointsByPayments(clonedSales.fields, this.loyalty_points_setups, 0)
      }

      return clonedSales
    },

    updateSalesCheckout() {
      this.sales = this.calculateSalesAmount(this.sales)
    },
    clearSalesItemBalanceDeductionInfo(salesItems = []) {
      return salesItems.map(salesItem => {
        if (salesItem.deduction_type === sales_options.deduction_type.prepaid_card && salesItem.deduction_amount == 0) {
          return {
            ...salesItem,
            deducted_prepaid_goods_ref:      0,
            deducted_by_prepaid_goods_guid:  '',
            deducted_prepaid_goods_ref_name: '',
            deduction_type:                  sales_options.deduction_type.none,
          }
        }

        return salesItem
      })
    },

    getPrepaidCardSalesItemsTotalOutstandingAmount() {
      const allSalesItems = this.sales?.fields?.sales_items || []
      return allSalesItems.reduce((totalAmountPayable, salesItem) => {
        if (
          salesItem.goods_type === sales_options.sales_goods_type.prepaid_card &&
          [options.prepaid_card_type.discount_card, options.prepaid_card_type.deposit_card].includes(salesItem.prepaid_card_type)
        ) {
          totalAmountPayable += Number(salesItem.amount || 0)
          totalAmountPayable -= Number(salesItem.deduction_points || 0)
        }

        return totalAmountPayable
      }, 0)
    },

    getTotalAmountSubtractBookingDeposit() {
      return this.sales.fields.total_amount - this.getBookingDepositRemaining()
    },
    getBookingDepositRemaining() {
      return this.getBookingDepositAmount() - this.getBookingDepositRefundAmount()
    },
    getBookingDepositAmount() {
      let tmp_amount = 0
      let tmp_booking_deposit = this.sales.fields.payments.find(p => p.payment_type == sales_options.sales_payment_type.booking_deposit)
      if (tmp_booking_deposit !== undefined) {
        tmp_amount = tmp_booking_deposit.payment_amount
      }
      return Number(tmp_amount)
    },
    getBookingDepositRefundAmount() {
      let tmp_amount = 0
      let tmp_booking_deposit_refund = this.sales.fields.payments.find(p => p.payment_type == sales_options.sales_payment_type.booking_deposit_refund)
      if (tmp_booking_deposit_refund !== undefined) {
        tmp_amount = tmp_booking_deposit_refund.payment_amount
      }
      return Number(tmp_amount)
    },
    isBookingDepositPaymentUpdatable(payment) {
      const isNaverBookingDepositType = (() => {
        if (this.isSalesOfBookingNaver) {
          return BOOKING_NAVER_DEPOSIT_TYPE.includes(this.sales?.fields?.naver_sales_info?.booking_type)
        }

        return false
      })()

      return (
        !isNaverBookingDepositType &&
        this.canUpdateBookingDeposit &&
        this.isBookingDepositPaymentHasNoRefund(payment)
      )
    },
    isBookingDepositPaymentHasNoRefund(payment) {
      const isExistRefundDeposit = this.sales?.fields?.payments.find(sales => sales.payment_type === sales_options.sales_payment_type.booking_deposit_refund)
      return (
        payment &&
        payment.payment_type === sales_options.sales_payment_type.booking_deposit &&
        !isExistRefundDeposit

      )
    },
    onClickUpdateBookingDeposit(payment) {
      if (this.isBookingDepositPaymentUpdatable(payment)) {
        const refundActionData = {
          action: options.form_actions.add,
        }

        this.setBookingDepositRefundActionData(refundActionData)
        this.$emit('on-click-update-booking-deposit')
      }
    },
    onConfirmAddSalesNaverBooking() {
      this.onConfirm()
    },
    onClickSaveButton() {
      if (this.is_add_mode && this.isSalesOfBookingNaver) {
        this.showDialogById(this.alertAddSalesNaverBookingModalId)
        return
      }

      this.onConfirm()
    },

    getExtraSalesFieldsDataOnClickSave(currentSales = {}) {
      const parsedSales = cloneDeep(currentSales)

      // set expire-date to new prepaid goods
      for (let salesItem of parsedSales.fields.sales_items) {
        const salesItemValidity = salesItem.goods_ref.validity || salesItem.validity
        const salesItemValidityType = salesItem.goods_ref.validity_type || salesItem.validity_type

        if (this.isNewPrepaidGoods(salesItem) && salesItemValidity && salesItemValidityType) {
          salesItem.prepaid_goods_expiry_date_ts = this.getNewPrepaidGoodsExpiryDateTS(
            salesItem.goods_ref.validity || salesItem.validity,
            salesItem.goods_ref.validity_type || salesItem.validity_type,
            parsedSales.fields.invoice_date_time_ts,
          )
        }
      }

      // pre-sending data
      parsedSales.fields.hour_of_day = this.getInvoiceTime()[0]
      parsedSales.fields.invoice_date_time_ts = this.getInvoiceDateTimeTS()
      parsedSales.fields.balance_moves = this.x_sales_action_helper.balance_moves

      if (parsedSales.fields.outstanding < 0) {
        parsedSales.fields.change = Math.abs(parsedSales.fields.outstanding)
        parsedSales.fields.outstanding = 0
      }

      return parsedSales
    },
    async onConfirm() {
      // todo: should use getExtraSalesFieldsDataOnClickSave here for consistence
      // pre-sending data
      this.sales.fields.hour_of_day = this.getInvoiceTime()[0]
      this.sales.fields.invoice_date_time_ts = this.getInvoiceDateTimeTS()
      this.sales.fields.balance_moves = this.x_sales_action_helper.balance_moves

      // set expire-date to new prepaid goods
      for (let sales_item of this.sales.fields.sales_items) {
        if (this.isNewPrepaidGoods(sales_item)) {
          sales_item.prepaid_goods_expiry_date_ts = this.getNewPrepaidGoodsExpiryDateTS(
            sales_item.goods_ref.validity || sales_item.validity,
            sales_item.goods_ref.validity_type || sales_item.validity_type,
            this.sales.fields.invoice_date_time_ts,
          )
        }
      }

      // validate ui
      if (!await this.salesValidateMixin_isValidateUISalesAction()) return

      this.submitActionAsync()

    },
    getInvoiceDateTimeTS() {
      let tmp_date = moment(this.invoice_date).format(options.standard_date_format.ymd)
      tmp_date = new Date(tmp_date)
      if (tmp_date.getTimezoneOffset() > 0) {
        tmp_date = convertDateFromLocalToTimezone(tmp_date)
      }

      let tmp_hour = this.getInvoiceTime()
      let tmp_second = moment(this.sales.fields.invoice_date_time).format(options.standard_hour_format.h24_seconds)
      tmp_second = tmp_second.substr(6, 2)
      tmp_date.setHours(tmp_hour[0], tmp_hour[1], tmp_second)
      let tmp_date_time_ts = convertDateToTimeStamp(tmp_date, false, true)
      return tmp_date_time_ts || null // value can be NaN when invoice_date is empty
    },
    getInvoiceTime() {
      return this.invoice_time.trim().split(':')
    },
    isNewPrepaidGoods(sales_item) {
      let is_new_prepaid_goods = false
      let is_old_prepaid_goods = sales_item.client_prepaid_goods_id > 0
      if (!is_old_prepaid_goods) {
        if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_card) {
          is_new_prepaid_goods = true
        }
        if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_service
          && sales_item.deduction_type !== sales_options.deduction_type.prepaid_service) {
          is_new_prepaid_goods = true // incase: buy-new or buy-new-and-deducted-balance
        }
      }
      return is_new_prepaid_goods
    },
    getNewPrepaidGoodsExpiryDateTS(validity, validity_type, sales_invoice_date_time_ts) {
      let tmp_date = convertTimeStampToDate(sales_invoice_date_time_ts)
      let tmp_expiry_date_ts = 0

      if (validity == options.enum_no_limit)
        tmp_expiry_date_ts = options.enum_no_limit
      else {
        if (validity_type) {
          let tmp_date_moment = moment(tmp_date)
          if (validity_type === options.validity_type.months) {
            tmp_date_moment = tmp_date_moment.add(validity, 'months')
          }
          if (validity_type === options.validity_type.days) {
            tmp_date_moment = tmp_date_moment.add(validity, 'days')
          }
          tmp_date_moment = tmp_date_moment.add(1, 'days')
          tmp_date = tmp_date_moment.format(options.standard_date_format.ymd)
        }
        tmp_expiry_date_ts = convertDateToTimeStamp(tmp_date) - 1
      }
      return tmp_expiry_date_ts
    },

    async handleUpdateSalesNotes() {
      const salesNotes = {
        notes:         this.sales.fields.notes,
        shop_id:       this.shop_data.shop_id,
        session_token: this.x_user.session_token,
        refund_id:     this.x_sales_action.data.ref_id,
        shop_location: this.shop_data.shop_location,
        client_id:     this.x_sales_action.data.client_id,
        sales_number:  this.x_sales_action.data.sales_number,
      }

      const result = await this.sales_api.updateSalesNotesAsync(salesNotes)

      if (result.is_ok) {
        this.hideModal()
        this.$emit('edited', result?.data)
      } else {
        this._showDialogAlert(result.error_messages)
      }
    },

    getMappedSalesViewModelForSubmitting({
      salesData = {},
      formAction = null,
      draftDocumentId,
      isEdit = false,
      isRecalculatePayments = true,
      countryCode = '',
    }) {
      const tempSalesViewModel = cloneDeep(salesData)
      const currentDatetimeTs = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      tempSalesViewModel.fields = mapActionSecurityInfo(tempSalesViewModel.fields, formAction, currentDatetimeTs)

      if (isEdit) {
        tempSalesViewModel.fields.edited_date_time_ts = convertTimeStampPlusLocalzone(currentDatetimeTs)
      } else {
        tempSalesViewModel.fields.created_date_time_ts = convertTimeStampPlusLocalzone(currentDatetimeTs)
      }

      // re-calculate outstanding < 0
      if (isRecalculatePayments && tempSalesViewModel.fields.outstanding < 0) {
        this.reCalculatePaymentsByChange(tempSalesViewModel)
        const outstanding = tempSalesViewModel.fields.outstanding
        if (outstanding < 0) {
          tempSalesViewModel.fields.change = Math.abs(outstanding)
          tempSalesViewModel.fields.outstanding = 0
        }
      }

      const sales = tempSalesViewModel.mapFieldsToApi()

      if (countryCode !== '') {
        sales.countryCode = countryCode
      }

      if (draftDocumentId) {
        sales.draftDocumentId = draftDocumentId
      }

      return sales
    },
    async handleUpdateSalesDetail() {
      const sales = this.getMappedSalesViewModelForSubmitting({
        salesData:       this.sales,
        isEdit:          this.is_edit_mode,
        draftDocumentId: this.draftDocumentId,
        formAction:      this.x_sales_action.action,
      })

      if (sales.change > 0) {
        const isActiveCashPayment = this.payment_method_setup.findIndex(payment => payment?.name === getCashText())
        if (isActiveCashPayment === -1) {
          this._showDialogAlert(this.$t('sales.warning-change-is-not-allowed-because-the-payment-method-cash-is-inactive', {
            cashText: getCashText(),
          }))
          return
        }
      }

      const salesApi = new SalesApi()
      const { result, successAction } = await (async () => {
        if (this.is_add_mode) {
          if (this.isSalesOfCheckedoutNaverBooking) {
            sales.importId = this.x_booking_action?.data?.import_id
            let requestPayload = sales
            const result = await salesApi.addSalesByCheckoutBookingNoSales(requestPayload)
            return { result, successAction: 'added' }
          }
          const result = await salesApi.addSalesAsync(sales)
          return { result, successAction: 'added' }
        }
        if (this.is_edit_mode) {
          const result = await salesApi.updateSalesAsync(sales)
          return { result, successAction: 'edited' }
        }
      })()

      // sending
      if (result.is_ok) {
        if (this.draftDocumentId) {
          result.data.draftDocumentId = this.draftDocumentId
        }

        this.hideModal()

        this.$emit(successAction, result.data)
      } else {
        this._showDialogAlertNotCheckOtherErrors(result.error_messages)
      }
    },

    validateNaverSalesWithCoupon() {
      return [this.$t('naver-booking-description.coupon')]
    },

    async submitActionAsync() {
      try {
        const sales = this.sales
        const salesItems = sales?.fields?.sales_items
        for (const salesItem of salesItems) {
          if (!salesItem?.unit_price && salesItem?.discount_value) {
            salesItem.discount_value = 0
            salesItem.discount_category_id = 0
            salesItem.discount_category_name = ''
            salesItem.discount_type = SALES_DISCOUNT_TYPE.PERCENTAGE
          }
        }
        this.sales = sales

        // validate view model
        this.errors = this.sales.isValid()

        if (this.errors.length > 0) {
          this._showDialogAlert(this.errors)
          return
        }

        this.preLoader()

        if (!this.cannotEditSalesDetail) {
          await this.handleUpdateSalesDetail()
        } else if (this.sales.fields.notes !== this.x_sales_action.data.notes) {
          await this.handleUpdateSalesNotes()
        } else {
          this.hideModal()
          this.$emit('canceled')
        }

        if (this.clientAccount && this.clientAccount.client_id > 0) {
          this.setRecentlySelectedClient({
            id:               this.clientAccount.client_id || 0,
            shop_id:          this.clientAccount.shop_id || 0,
            client_shop_name: this.client?.shop_name || '',
            client_name:      this.clientAccount.client_name || '',
          })
        }
        this.setSalesActionHelperBalanceMoves([])
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    reCalculatePaymentsByChange(sales) {
      const tmpSalesPayments = []
      const reversePayments = sales.fields.payments.reverse()
      for (const payment of reversePayments) {
        if (payment.payment_method_name !== getCashText() || payment.payment_type !== sales_options.sales_payment_type.sales) {
          tmpSalesPayments.push(payment)
          continue
        }

        if (Math.abs(sales.fields.outstanding) >= payment.payment_amount) {
          sales.fields.outstanding += payment.payment_amount
          payment.payment_amount = 0
        } else {
          payment.payment_amount += sales.fields.outstanding
          sales.fields.outstanding = 0
        }

        tmpSalesPayments.push(payment)
      }

      const updatedSalesPayments = tmpSalesPayments.filter(payment => payment.payment_amount > 0)
      sales.fields.payments = updatedSalesPayments.reverse()
    },

    onClickNaverPayAtSalon() {
      if (this.isSalesOfNaverBookingWithNPaySelectedPaymentMethod) {
        this.onClickPayAtSalon()
        return
      }

      this.showDialogById(this.alertPayAtSalonModalId)
    },
    async onClickPayAtSalon() {
      const invoiceDateTimeTs = this.getInvoiceDateTimeTS()
      const currentUTCTimezoneTS = getCurrentUTCTimezoneTS()

      if (this.isHairBusinessTypeExternalLink && !this.hasPaidByNaverPayAtSalon) {
        if (invoiceDateTimeTs > currentUTCTimezoneTS) {
          this._showDialogAlert(this.warning_can_not_add_sales_in_future)
        } else {
          this.$data.$_naverStyleKeywordMixin_isShowNaverAddEditStyleKeywordModal = true
          await this.$_naverBookingHairTagInquiryMixin_getExistingBookingHairTagInquiry()
        }

        return
      }

      this.handleRequestPaymentExternalSystem()
    },

    handlePaymentComplete() {
      /**
       * Emit event to reload sales history when revise payment is called
       * This event is emitted to draft-sales-action component
       * @event handle-request-payment-success
      */
      this.$emit('handle-request-payment-success')
      this.$bus.emit('on-update-requesting-npay-payment', {}, { status: false })
      this.$_naverRequestPaymentMixin_onHideNaverRequestPaymentModal()
    },

    onHideNaverPaymmentRequestModal(isActionClose = false) {
      /**
       * Emit event to reload sales history when revise payment is called
       * This event is emitted to draft-sales-action component
       * @event hide-naver-payment-request
      */
      this.$emit('hide-naver-payment-request')
      this.$_naverRequestPaymentMixin_onHideNaverRequestPaymentModal()

      if (isActionClose) {
        this.hideModal()
      }
    },

    handleUpdatePaymentInfo(data) {
      if (!this.isRevisePayment) {
        this.$bus.emit('on-payment-success')
        return
      }

      const xSalesAction = this.x_sales_action

      const naverInfo = data
      if (!naverInfo) {
        this.$emit('update-sales-detail-after-revise-payment-completed', xSalesAction)
        return
      }

      const salesNaverInfo = this.sales?.fields?.naver_sales_info
      const extSystemBookingIdBySales = salesNaverInfo?.booking_id

      const extSystemBookingIdByNaver = data?.extSystemBookingId

      if (extSystemBookingIdBySales !== extSystemBookingIdByNaver) {
        this.$emit('update-sales-detail-after-revise-payment-completed', xSalesAction)
        return
      }

      const updatedCouponInfo = (() => {
        if (!data?.externalSystemCouponInfo) {
          return null
        }

        return externalSystemCouponInfo.build(data?.externalSystemCouponInfo)
      })()

      xSalesAction.data.naver_sales_info.description_base.externalSystemCouponInfo = updatedCouponInfo
      this.$emit('update-sales-detail-after-revise-payment-completed', xSalesAction, { isUpdateCoupon: true, updatedCouponInfo })
    },

    handleRequestPaymentExternalSuccess({ response, unhandledErrorMessages = [] }) {
      this.$_naverStyleKeywordMixin_onHideNaverAddEditStyleKeywordModal()
      // this.hideDialogById(this.modalId)

      if (this.isRevisePayment) {
        this.isRevisePaymentProcessingFailed = response.original_error_messages.find(
          error => error.errorCode === EXTERNAL_PAYMENT_REQUEST.API_ERROR_CODES.PAYMENT_PROCESSING_HAS_FAILED,
        )
      }

      const event = this.is_edit_mode ? 'on-edited-sales-when-requesting-payment' : 'on-created-sales-when-requesting-payment'

      this.$emit(event, this.$data.$_naverRequestPaymentMixin_requestPaymentSales, () => {
        if (unhandledErrorMessages && unhandledErrorMessages?.length) {
          this._showDialogAlert(unhandledErrorMessages)
        }

        if (response?.is_ok) {
          if (this.is_edit_mode) {
            this.setSalesAction({
              action: options.form_actions.edit,
              data:   {
                ...response?.data?.sales,
              },
            })
          }

          this.$data.$_naverRequestPaymentMixin_isShowNaverRequestPaymentModal = true
        }
      })
    },

    getNaverPaymentEarnedPoints(salesFields) {
      if (!(salesFields.client_id > 0)) return null

      const naverPaymentMethod = this.payment_method_setup.find(
        method => method.name === NAVER_PAYMENT_METHOD_TEXT,
      )
      if (!naverPaymentMethod) return null

      const existingPayments = (salesFields.payments || []).filter(
        payment => payment.payment_type !== sales_options.sales_payment_type.add_external_system_payment,
      )
      const virtualPayments = [
        ...existingPayments,
        {
          payment_method_id: naverPaymentMethod.id,
          payment_amount:    this.requestPaymentAmount,
          payment_type:      sales_options.sales_payment_type.add_external_system_payment,
        },
      ]

      return SalesUtils.calPointsByPayments(
        { ...salesFields, payments: virtualPayments },
        this.loyalty_points_setups,
        0,
      )
    },

    handleRequestPaymentExternalSystem() {
      const salesData = this.getExtraSalesFieldsDataOnClickSave(this.sales)

      const naverEarnedPoints = this.getNaverPaymentEarnedPoints(salesData.fields)
      if (naverEarnedPoints !== null) {
        salesData.fields.earned_points = naverEarnedPoints
      }

      const requestPaymentSales = this.getMappedSalesViewModelForSubmitting({
        isEdit:                this.is_edit_mode,
        draftDocumentId:       this.draftDocumentId,
        formAction:            this.x_sales_action.action,
        isRecalculatePayments: !this.is_edit_mode,
        salesData,
        countryCode:           this.shop_data.country,
      })

      if (this.is_edit_mode) {
        /**
         * Emit event to reload sales history when revise payment is called
         * This event is emitted to draft-sales-action component
         * @event handle-revise-payment
         */
        this.$emit('handle-revise-payment')
        this.$_naverRequestPaymentMixin_revisePayment({
          ...requestPaymentSales,
          naverSalesInfo: {
            ...(requestPaymentSales?.naverSalesInfo || {}),
            isRevisePayment: this.isRevisePayment,
          },
        }).then(this.handleRequestPaymentExternalSuccess).catch(error => {

          this.$emit('cancel-revise-payment-failed')

          return error
        })

        return
      }

      this.isNaverRequestPaymentCalled = true

      this.$_naverRequestPaymentMixin_requestPayment({
        sales: requestPaymentSales,
      }).then(this.handleRequestPaymentExternalSuccess).catch(error => error)
    },
    onHiddenPaymentComplete() {
      this.$_naverRequestPaymentMixin_onHiddenPaymentComplete()
      this.$emit('on-hidden-payment-complete-modal')
      this.hideDialogById(this.modalId)
    },

    // alert confirm
    async onAlertConfirmOutstanding() {
      if (!await this.salesValidateMixin_isValidateUISalesAction(true)) return

      this.submitActionAsync()
    },
    onAlertConfirmOmitStaff() {
      this.submitActionAsync()
    },
    handleEditSalesDateClick() {
      if (this.isSalesDateTimeDisabled && this.can_edit_sales_date) {
        this.showDialogById(this.alertEditSalesDateModalId)
      }
    },
    handleEditSalesDateConfirm() {
      this.isConfirmedEditSalesDate = true
      this.datePopoverVisibility = 'visible'
    },

    handleNotesInput() {
      this.validateAndTruncateNote(
        'sales.fields.notes',
        this.maxNoteLength,
        'sales-note-alert',
        null,
        this.setCursorToEndAfterTruncate('salesNotesTextareaFirst'),
      )
    },

    // mobile
    onChangeShowSalesItem(row) {
      row.show_sales_item = !row.show_sales_item
      this.$forceUpdate()
    },

    // sales disabled rules
    isSalesItemAsNewPrepaidCard(sales_item) {
      return sales_item.goods_type == sales_options.sales_goods_type.prepaid_card && !sales_item.client_prepaid_goods_id
    },

    isSalesEditItemIsPrepaidService(sales_item) {
      return (
        this.is_edit_mode &&
        sales_item.sales_item_id > 0 && // items which was added when Adding Sales
        sales_item.goods_type === sales_options.sales_goods_type.prepaid_service &&
        sales_item.deduction_type !== sales_options.deduction_type.prepaid_service
      )
    },
    isSalesEditItemIncludePrepaidGoodsOrPrepaidGoodsDeduction(sales_item) {
      return (
        this.is_edit_mode &&
        sales_item.sales_item_id > 0 && // items which was added when Adding Sales
        (
          this.isSalesEditItemIsPrepaidService(sales_item) ||
          (
            sales_item.goods_type === sales_options.sales_goods_type.prepaid_card &&
            sales_item.prepaid_card_type === options.prepaid_card_type.deposit_card
          )
        )
      )
    },
    isSalesItemsIncludePrepaidCardOrDeductBalance(salesItems = []) {
      for (let salesItem of salesItems) {
        // let is_prepaid_card   = salesItem.client_prepaid_goods_id > 0 && salesItem.goods_type == sales_options.sales_goods_type.prepaid_card
        let isPrepaidCard = salesItem.goods_type == sales_options.sales_goods_type.prepaid_card
        // let is_deduct_balance = sales_item.deducted_prepaid_goods_ref && sales_item.deduction_type == sales_options.deduction_type.prepaid_card
        let isDeductBalance = salesItem.deduction_type == sales_options.deduction_type.prepaid_card
        if (isPrepaidCard || isDeductBalance) {
          return true
        }
      }
      return false
    },
    isSalesEditIncludePrepaidCardOrDeductBalance(salesItems = []) {
      for (let salesItem of salesItems) {
        if (salesItem.sales_item_id > 0) {
          // let is_prepaid_card   = salesItem.client_prepaid_goods_id > 0 && salesItem.goods_type == sales_options.sales_goods_type.prepaid_card
          let isPrepaidCard = salesItem.goods_type == sales_options.sales_goods_type.prepaid_card
          // let is_deduct_balance = sales_item.deducted_prepaid_goods_ref && sales_item.deduction_type == sales_options.deduction_type.prepaid_card
          let isDeductBalance = salesItem.deduction_type == sales_options.deduction_type.prepaid_card
          if (isPrepaidCard || isDeductBalance) {
            return true
          }
        }
      }
      return false
    },
    isSalesItemsIncludePrepaidServiceOrDeductService(salesItems = []) {
      for (let salesItem of salesItems) {
        // let is_prepaid_service = sales_item.client_prepaid_goods_id > 0 && sales_item.goods_type == sales_options.sales_goods_type.prepaid_service
        let is_prepaid_service = salesItem.goods_type == sales_options.sales_goods_type.prepaid_service
        // let is_deduct_service  = sales_item.deducted_prepaid_goods_ref && sales_item.deduction_type == sales_options.deduction_type.prepaid_service
        let is_deduct_service = salesItem.deduction_type == sales_options.deduction_type.prepaid_service
        if (is_prepaid_service || is_deduct_service) {
          return true
        }
      }
      return false
    },
    isSalesEditIncludePrepaidServiceOrDeductService(salesItems = []) {
      for (let salesItem of salesItems) {
        if (salesItem.sales_item_id > 0) {
          // let is_prepaid_service = sales_item.client_prepaid_goods_id > 0 && sales_item.goods_type == sales_options.sales_goods_type.prepaid_service
          let is_prepaid_service = salesItem.goods_type == sales_options.sales_goods_type.prepaid_service
          // let is_deduct_service  = sales_item.deducted_prepaid_goods_ref && sales_item.deduction_type == sales_options.deduction_type.prepaid_service
          let is_deduct_service = salesItem.deduction_type == sales_options.deduction_type.prepaid_service
          if (is_prepaid_service || is_deduct_service) {
            return true
          }
        }
      }
      return false
    },

    checkSalesEditHasPrepaidGoods(salesIitems = []) {
      if (this.is_edit_mode) {
        for (let salesItem of salesIitems) {
          const isSalesItemPrepaidCard = salesItem.client_prepaid_goods_id > 0 && salesItem.goods_type == sales_options.sales_goods_type.prepaid_card
          const isSalesItemPrepaidService = salesItem.client_prepaid_goods_id > 0 && salesItem.goods_type == sales_options.sales_goods_type.prepaid_service
          if (isSalesItemPrepaidCard || isSalesItemPrepaidService) {
            return true
          }
        }
      }
      return false
    },
    isDisabledSalesItemUnitPrice(row) {
      return this.cannotEditSalesDetail || row.gift_card_type == sales_options.gift_card_type.redeem
    },
    isDisabledSalesItemQuantity(row) {
      return this.cannotEditSalesDetail || !this.canEditQuantityOfPrepaidGoods(row) || this.isSalesEditItemIsPrepaidService(row)
    },
    isDisabledSalesItemDiscount(row) {
      return this.cannotEditSalesDetail || this.isSalesItemDisabledAction(row)
    },
    isDisabledSalesItemAmount(row) {
      return this.cannotEditSalesDetail || this.isSalesItemDisabledAction(row)
    },
    isDisabledSalesItemDeductionPoints(row) {
      return this.cannotEditSalesDetail || this.isSalesItemDisabledAction(row)
    },
    isDisabledSalesItemDeductionBalance(row) {
      return (
        this.cannotEditSalesDetail ||
        this.isSalesItemDisabledAction(row) ||
        this.isSalesItemAsNewPrepaidCard(row) ||
        row.goods_type === sales_options.sales_goods_type.prepaid_card
      )
    },
    isEnabledSalesPaymentRemove(payment) {
      const isNotPaymentTypeBookingDeposit = payment.payment_type != sales_options.sales_payment_type.booking_deposit
      const isNotPaymentTypeBookingDepositRefund = payment.payment_type != sales_options.sales_payment_type.booking_deposit_refund
      const isNotAddExternalSystemPaymentType = payment.payment_type != sales_options.sales_payment_type.add_external_system_payment

      return (
        !this.cannotEditSalesDetail &&
        isNotPaymentTypeBookingDeposit &&
        isNotAddExternalSystemPaymentType &&
        isNotPaymentTypeBookingDepositRefund
      )
    },

    // ultils
    isSalesItemDeductPrepaidCard(row) {
      return row.deduction_type == sales_options.deduction_type.prepaid_card
    },
    isSalesItemDeductPrepaidService(row) {
      return row.deduction_type == sales_options.deduction_type.prepaid_service
    },

    // format for template
    formatSalesItemDiscount(sales_item) {
      let tmp_discount_text = ''
      let tmp_discount_value = Number(sales_item.discount_value)
      if (sales_item.discount_value != null && sales_item.discount_value != undefined) {
        if (tmp_discount_value > 0) {
          if (sales_item.discount_type == sales_options.discount_type.percentage)
            tmp_discount_text = sales_item.discount_value + '%'
          else
            tmp_discount_text = formatMoney(sales_item.discount_value, 0)
        }
      }
      return tmp_discount_text
    },
    isDepositCard(row) {
      return row.goods_type == sales_options.sales_goods_type.prepaid_card
        && row.prepaid_card_type == options.prepaid_card_type.deposit_card
    },
    formatPrepaidCardInitialBalance(row) {
      let tmp_initial_balance = 0
      if (row.client_prepaid_goods_id > 0) {
        tmp_initial_balance = row.prepaid_card_initial_balance
      }
      else {
        tmp_initial_balance = row.prepaid_card_initial_balance * row.quantity
      }
      return formatMoney(tmp_initial_balance, 0)
    },
    formatDisabledSalesItemAmountOfPrepaidServiceOrDeductPrepaidService(row) {
      let amount = row.amount
      if (this.isSalesItemDeductPrepaidService(row)) {
        amount = row.unit_price * row.quantity
      }
      return formatMoney(amount, 0)
    },
    getFormattedSalesItemStaffs(sales_item) {
      return SalesUtils.getFormattedSalesItemStaffs(sales_item)
    },
    formatPaymentAmount(payment) {
      let tmp_amount = formatMoney(payment.payment_amount, 0)
      if (payment.payment_type === sales_options.sales_payment_type.booking_deposit_refund) {
        tmp_amount = `-${tmp_amount}`
      }
      return tmp_amount
    },

    async onSalesItemsAddingActionShown() {
      await this.loadClientPrepaidCardsAsync(this.client.id)
      this.$emit('on-sales-item-adding-action-shown')
    },

    async applyDiscountService({ sales, client }) {
      const serviceSalesItems = sales.fields.sales_items.filter(salesItem => {
        return salesItem.goods_type == sales_options.sales_goods_type.service
      })

      if (serviceSalesItems.length > 0) {
        this.handleDiscountCardBaseSalesItems({
          clientId:       client?.id,
          salesItems:     serviceSalesItems,
          salesGoodsType: sales_options.sales_goods_type.service,
        })
      }
    },

    handleDatePopoverDidDAppear() {
      this.datePopoverVisibility = 'focus'
      this.$refs.salesDateRef.focusin()
    },

    checkMobileView() {
      if (window.innerWidth < MOBILE_MAX_WIDTH) {
        this.isMobileView = true
      }
      else {
        this.isMobileView = false
      }
    },

    salesItemBodyClass(isShowItemExpand) {
      const itemClass = 'sales-item-body'
      const itemClassExpand = 'sales-item-body-expand'

      return isShowItemExpand ? `${itemClass} ${itemClassExpand}` : itemClass
    },

    scrollTotalAmountAtTop() {
      this.isDeductionOrPayment = false

      if (!this.isMobileView) return

      this.$nextTick(() => {
        // Scroll total amount on the top when deduction or payment is entered
        const totalAmountMobileRef = this.$refs?.totalAmountMobileRef ?? {}
        const modalSalesActionMobileRef = this.$refs?.sales_action_modal_ref?.$refs?.modal ?? {}

        const positionTotalAmount = totalAmountMobileRef?.offsetTop ?? 0
        const positionCurrentPage = modalSalesActionMobileRef?.scrollTop ?? 0

        const checkPositionTotalAmountAtTop = positionTotalAmount === positionCurrentPage

        if (!checkPositionTotalAmountAtTop) {
          let start = 0
          const duration = 200
          const accelerate = Math.abs(positionCurrentPage - positionTotalAmount) / duration

          window.requestAnimationFrame(function animate(timestamp) {
            if (!start) start = timestamp

            const elapsed = Math.min(timestamp - start, duration)
            const distance = elapsed * accelerate

            const top = positionCurrentPage > positionTotalAmount ? positionCurrentPage - distance : positionCurrentPage + distance

            modalSalesActionMobileRef.scrollTo({ top })

            if (elapsed < duration) {
              window.requestAnimationFrame(animate)
            }
          })
        }
      })
    },

    handleConfirmAlert() {
      this.$emit('confirm-error-alert')
    },

    checkShowPayment(payment) {
      if (this.isSalesOfBookingNaver && this.isSalesOfCheckedoutNaverBooking) {
        const isPaymentBookingDeposit = payment?.payment_type === sales_options.sales_payment_type.booking_deposit

        if (isPaymentBookingDeposit) {
          return false
        }
      }

      return true
    },

    checkoutSalesOfNaverBooking(sales) {
      return sales?.fields?.booking_source === BOOKING_SOURCE.NAVER
    },

    checkSalesOfCheckedOutBooking(sales) {
      return this.bookingCheckedOutStatus.includes(sales.fields.booking_status)
    },

    onCancelNaverRequestPayment() {
      this.$_naverRequestPaymentMixin_cancelPaymentRequest().then(async (response) => {
        this.isNaverRequestPaymentCalled = false

        // Update actions:
        if (response?.data?.externalSystemPaymentStatus !== undefined) {
          this.$bus.emit('on-update-requesting-npay-payment', {}, { status: response?.data?.externalSystemPaymentStatus === sales_options.requesting_npay_status_type.requested })
        }

        // If user cancel revise payment - close sales form
        if (this.isRevisePayment) {
          this.$emit('on-cancelled-naver-revise-payment')
          this.$data.$_naverRequestPaymentMixin_isShowNaverRequestPaymentModal = false
          this.reloadClientInformationForNewCalendar()
          this.onCancel()

          return
        }

        if (response?.data?.isSalesDeleted) {
          this.$emit('naver-payment-request-canceled')
          this.$_naverRequestPaymentMixin_resetXRequestingPayment()
          this.client = new ClientViewModel().fields
          this.clientAccount = new ClientAccountViewModel().fields

          // reset to init data (just some pieces of data, other info of sales items need to be kept)
          let sales = new SalesViewModel()
          let currentSalesActionData = cloneDeep(this.x_sales_action.data)

          currentSalesActionData.sales_id = 0
          currentSalesActionData.sales_number = 0
          currentSalesActionData.sales_items.map(sales_item => {
            sales_item.sales_item_id = 0
            sales_item.client_prepaid_goods_id = 0

            const defaultGuid = '00000000-0000-0000-0000-000000000000'
            if (sales_item.deducted_by_prepaid_goods_guid === defaultGuid) {
              sales_item.deducted_by_prepaid_goods_guid = ''
            }
            sales_item.deducted_prepaid_goods_ref = !sales_item.deducted_by_prepaid_goods_guid
              ? sales_item.deducted_prepaid_goods_ref
              : 0

            if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_card) {
              const currentPrepaidCardInfo = this.x_sales_action_helper.client_prepaid_cards.find(prepaidCard => prepaidCard.id === sales_item.prepaid_goods_guid)
              const salesGoodValidity = currentPrepaidCardInfo?.validity
              const salesGoodValidityType = currentPrepaidCardInfo?.validity_type

              sales_item.validity = salesGoodValidity
              sales_item.validity_type = salesGoodValidityType
            }

            if (sales_item.goods_type === sales_options.sales_goods_type.prepaid_service) {
              const currentPrepaidServiceInfo = this.x_sales_action_helper.client_prepaid_services_all.find(prepaidService => prepaidService.id === sales_item.prepaid_goods_guid)
              const salesGoodValidity = currentPrepaidServiceInfo?.validity
              const salesGoodValidityType = currentPrepaidServiceInfo?.validity_type

              sales_item.validity = salesGoodValidity
              sales_item.validity_type = salesGoodValidityType
            }
          })

          currentSalesActionData.payments.map(payment => {
            const canSalesPaymentBeCleared =
              ![sales_options.sales_payment_type.booking_deposit,
                sales_options.sales_payment_type.booking_deposit_refund,
                sales_options.sales_payment_type.add_external_system_payment].includes(payment.payment_type)

            if (canSalesPaymentBeCleared) {
              payment.payment_date_time = ''
              payment.payment_date_time_ts = 0
            }
          })

          sales.setFields(currentSalesActionData)

          const { client, clientAccount } = await this.fetchSalesClientInformation(sales)
          const hasClient = client && client?.id
          sales.fields.sales_items = this.attachSalesItemsKey(sales.fields?.sales_items ?? [])
          // Assign client, shop information to sales
          sales.setFields({
            chain_id:      this.shop_data.chain_id,
            shop_name:     this.shop_data.shop_name,
            branch_number: this.shop_data.branch_number,
            ...(hasClient && {
              client_id:      client.id,
              client_shop_id: client.shop_id,
            }),
          })

          // Update expiry date of temporary adding prepaid service
          this.updateExpiryDatePrepaidServicesSalesItemsAddingTemporarily()

          await this.loadClientPrepaidCardsAsync(client.id)
          await this.loadClientPrepaidServicesAsync(client.id)
          this.sales = sales
          this.client = client
          this.clientAccount = clientAccount

          // Reset IsSalesIncludePrepaidGoods even if the prepaid good already exist
          this.setIsSalesEditIncludePrepaidCardOrDeductBalance(false)
          this.setIsSalesEditIncludePrepaidServiceOrDeductService(false)
        }
      })
    },

    handleClientNotExistConfirm() {
      this.$bus.emit('client-not-existed', {
        from: 'sales-action',
      })
    },

    handleCalculatorHidden() {
      this.showCompleteBtn = true
    },

    shouldRemoveSalesItemsStaffs(client) {
      if (this.shop_data?.shop_id !== client?.shop_id) {
        return true
      }

      if (!client?.preferred_staff_id) return false

      const isActivePreferredStaff = this.x_staff_options.some(item => item.id === client?.preferred_staff_id)
      return !isActivePreferredStaff
    },

    checkSalesItemsPreferredStaff(salesItems, client) {
      if (this.shouldRemoveSalesItemsStaffs(client)) {
        return salesItems.map(item => {
          item.staffs = []
          return item
        })
      }
      return salesItems
    },

    handleOnLoadedSaleDetailData() {
      if (this.x_globalSalesNpay) {
        //
        // Processing the data for open NPay Payment requesting modal:
        //
        this.sales.setFields(this.x_sales_action.data)
        const status = this.sales?.fields?.naver_sales_info?.latest_POST_payment?.status === sales_options.requesting_npay_status_type.requested

        // The selected pages will not show the Request Payment popup
        const isRequestPaymentPopupHidden = [
          'sales-by-staff',
          'my-shop-sales',
          'outstanding-collection-history',
          'sales-transfer-history',
          'sales-edit-delete-history',
        ]
        const isOpenRequestPaymentPopupFromDetail =
          !!document.querySelector('.prepaid-service-histories__modal.a-modal--visible') ||
          !!document.querySelector('.prepaid-card-histories__modal.a-modal--visible')

        if (!isRequestPaymentPopupHidden.includes(this.$route.name) && !isOpenRequestPaymentPopupFromDetail) {
          this.$data.$_naverRequestPaymentMixin_isShowNaverRequestPaymentModal = status
        }

        //
        // Preparing response data for cancle requesting payment: Because Mixin $_naverRequestPaymentMixin_onRequestPaymentSuccessfully need a response data:
        //
        const preparingResponseData = {
          data: {
            naverPaymentInfo: {
              requestExternalSystemPaymentId: this.sales?.fields?.naver_sales_info?.latest_POST_payment?.paymentId,
            },
            sales: {
              ...this.sales.fields,
              session_token: this.x_session_token_requesting_payment,
            },
          },
        }

        this.$_naverRequestPaymentMixin_onRequestPaymentSuccessfully(preparingResponseData)
        this.setGlobalSalesNpay(false)
      }
    },

    onHideMultipleDiscountModal() {
      this.discountSalesItem = null
      this.isShowMultipleDiscountModal = false
    },

    updateSalesItemAmountForMultipleDiscount(sales_item) {
      const clonedSalesItem = cloneDeep(sales_item)
      for (let i = 0; i < clonedSalesItem.length; i++) {
        const discountedSalesItem = this.updateSalesItemAmountByDiscount(clonedSalesItem[i])
        const salesItems = [...this.sales.fields.sales_items]

        const salesItemIndex = salesItems.findIndex(salesItem => salesItem.key === discountedSalesItem.key)
        if (salesItemIndex !== -1) {
          const tempSalesItem = salesItems[salesItemIndex]
          if (discountedSalesItem.deduction_type === sales_options.deduction_type.prepaid_card && discountedSalesItem.deduction_amount > 0) {
            const tempPrepaidCard = this.x_sales_action_helper.client_prepaid_cards.find(c => {
              return c.id === discountedSalesItem.deducted_by_prepaid_goods_guid || c.id === discountedSalesItem.deducted_prepaid_goods_ref
            })
            if (tempPrepaidCard) {
              let to_card = this.getToCardByFromCardId(tempPrepaidCard.id)
              if (to_card) {
                // update card
                to_card.balance += discountedSalesItem.deduction_amount

                // update balance move
                for (let tmp_balance_move of this.x_sales_action_helper.balance_moves) {
                  if (tmp_balance_move.from_client_prepaid_card_id === tempPrepaidCard.id) {
                    tmp_balance_move.move_balance += discountedSalesItem.deduction_amount
                    break
                  }
                }
              }
              else {
                tempPrepaidCard.balance += discountedSalesItem.deduction_amount
              }
            }
            discountedSalesItem.deduction_amount = 0
          }
          discountedSalesItem.deduction_points = 0

          if (discountedSalesItem.deduction_type === sales_options.deduction_type.prepaid_service
            || discountedSalesItem.gift_card_type === sales_options.gift_card_type.redeem) {
            discountedSalesItem.amount = 0
          }

          salesItems[salesItemIndex] = {
            ...tempSalesItem,
            ...discountedSalesItem,
          }
        }

        this.sales.fields.sales_items = salesItems
        this.updateSalesCheckout()
      }

    },

    onApplyDiscount(data) {
      const tmpSalesItem = [...data.salesItem]

      for (let i = 0; i <= this.sales.fields.sales_items.length; i++) {
        const salesItemDiscount = this.x_sales_item_discount_action.data[i]

        if (!salesItemDiscount) {
          continue
        }
        if (data.discountType === 1 && salesItemDiscount) {
          if (!tmpSalesItem[i].isSelected) {
            tmpSalesItem[i].discount_type = DISCOUNT_TYPE.AMOUNT
            tmpSalesItem[i].discount_value = 0
            tmpSalesItem[i].discount_category_id = null
            tmpSalesItem[i].discount_category_name = ''
          } else {
            tmpSalesItem[i].discount_type = data.discountType
            tmpSalesItem[i].discount_value = data.discountValue
            tmpSalesItem[i].discount_category_id = data?.discountCategoryId || 0
            tmpSalesItem[i].discount_category_name = data?.discountCategoryName || ''
          }
        } else {
          if (tmpSalesItem[i].discount_value) {
            tmpSalesItem[i].discount_category_id = data?.discountCategoryId || 0
            tmpSalesItem[i].discount_category_name = data?.discountCategoryName || ''
          }

        }
      }

      this.updateSalesItemAmountForMultipleDiscount(tmpSalesItem)
    },
  },
}
</script>

<style lang='scss'>
@import './sales-action.scss';
</style>

<style lang="scss" scoped>
::v-deep .aha-tooltip.update-booking-deposit-tooltip {
  .tooltip-inner {
    max-width: 210px;
  }
}

::v-deep .aha-tooltip.discount-tooltip {
  z-index: 99 !important;
}

::v-deep .aha-tooltip.balance-deduction-tooltip {
  z-index: 99 !important;
}

::v-deep #alert-pay-at-salon-modal-id {
  .modal-footer button {
    width: auto !important; // override fixed width by _modal.scss
  }
}
</style>
