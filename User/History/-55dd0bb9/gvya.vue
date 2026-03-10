<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-admin/-/issues/3 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <div
    ref="test"
    class="contents shops"
  >
    <div class="table-box">
      <!-- Tabs -->
      <div class="tab shop-tab">
        <ul class="cf">
          <!-- Tab subscriber -->
          <li :class="{ 'plus-bg-color': !detail_list[0] }">
            {{ $t('shops.search-by-subscriber') }}
            <button
              ref="subscriber_tab"
              :class="{ 'minus': detail_list[0], 'plus': !detail_list[0] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.subscriber, 'subscriber_tab', 'subscriber_tab2')"
            >
              {{ detail_list[0] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab subscriber status and date -->
          <li :class="{ 'plus-bg-color': !detail_list[1] }">
            {{ $t('shops.search-by-subscriber-status-and-date') }}
            <button
              ref="subscriber_status_and_date_tab"
              :class="{ 'minus': detail_list[1], 'plus': !detail_list[1] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.subscriber_status_and_date, 'subscriber_status_and_date_tab', 'subscriber_status_and_date_tab2')"
            >
              {{ detail_list[1] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab solution information -->
          <li :class="{ 'plus-bg-color': !detail_list[2] }">
            {{ $t('shops.search-solution-information') }}
            <button
              ref="solution_information_tab"
              :class="{ 'minus': detail_list[2], 'plus': !detail_list[2] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.solution_information, 'solution_information_tab', 'solution_information_tab2')"
            >
              {{ detail_list[2] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab chain/reseller -->
          <li :class="{ 'plus-bg-color': !detail_list[3] }">
            {{ $t('shops.search-chain-reseller') }}
            <button
              ref="chain_reseller_tab"
              :class="{ 'minus': detail_list[3], 'plus': !detail_list[3] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.chain_reseller, 'chain_reseller_tab', 'chain_reseller_tab2')"
            >
              {{ detail_list[3] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab payment information -->
          <li :class="{ 'plus-bg-color': !detail_list[4] }">
            {{ $t('shops.search-payment-information') }}
            <button
              ref="payment_information_tab"
              :class="{ 'minus': detail_list[4], 'plus': !detail_list[4] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.payment_information, 'payment_information_tab', 'payment_information_tab2')"
            >
              {{ detail_list[4] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab contact/discount information -->
          <li :class="{ 'plus-bg-color': !detail_list[5] }">
            {{ $t('shops.search-contact-discount-information') }}
            <button
              ref="contact_discount_information_tab"
              :class="{ 'minus': detail_list[5], 'plus': !detail_list[5] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.contact_discount_information, 'contact_discount_information_tab', 'contact_discount_information_tab2')"
            >
              {{ detail_list[5] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab additional service information -->
          <li :class="{ 'plus-bg-color': !detail_list[6] }">
            {{ $t('shops.search-additional-service-information') }}
            <button
              ref="additional_service_information_tab"
              :class="{ 'minus': detail_list[6], 'plus': !detail_list[6] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.additional_service_information, 'additional_service_information_tab', 'additional_service_information_tab2')"
            >
              {{ detail_list[6] ? '-' : '+' }}
            </button>
          </li>

          <!-- Tab ETC -->
          <li :class="{ 'plus-bg-color': !detail_list[7] }">
            {{ $t('shops.search-etc') }}
            <button
              ref="etc_tab"
              :class="{ 'minus': detail_list[7], 'plus': !detail_list[7] }"
              class="minus btn-small"
              @click="onClickDetail(options.search_shop_tab.etc, 'etc_tab', 'etc_tab2')"
            >
              {{ detail_list[7] ? '-' : '+' }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Content -->
      <table
        class="type-left wd-10"
        :class="{'table-ko': isKorean}"
      >
        <!-- Search by subscriber -->
        <tr v-show="detail_list[0]">
          <td>
            {{ $t('shops.search-by-subscriber') }}
            <button
              ref="subscriber_tab2"
              :class="{ 'minus': detail_list[0], 'plus': !detail_list[0] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.subscriber, 'subscriber_tab', 'subscriber_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-first">
              <li class="padding-none w100p">
                <b-form-radio-group
                  v-model="table_filter.radio_type"
                  label="Individual radios"
                  class="radio-secondary form-group-radio dib"
                  @input="onFoucsInput"
                >
                  <div class="block-1">
                    <span class="p3 mr-4">
                      <b-form-radio
                        :value="options.search_shop_radio_type.shop"
                        name="subscriber_info"
                        class="radio-click"
                        selcted
                      >{{ $t('shops.field-subscriber-name-and-number') }}</b-form-radio>
                      <input
                        ref="shop"
                        v-model="table_filter.shop_name"
                        :disabled="!(table_filter.radio_type == options.search_shop_radio_type.shop)"
                        type="text"
                        @keyup.enter="onSearch"
                      >
                    </span>
                    <span class="p3 mr-4">
                      <b-form-radio
                        :value="options.search_shop_radio_type.phone"
                        name="subscriber_info"
                        class="radio-click"
                      >{{ $t('shops.field-phone-and-mobile') }}</b-form-radio>
                      <input-mobile-number
                        ref="phone"
                        v-model="table_filter.phone_number_or_mp"
                        :refs="'phone'"
                        :disabled="!(table_filter.radio_type == options.search_shop_radio_type.phone)"
                        :maxlength="20"
                        class="input-box"
                        @keyup.native.enter="onSearch"
                      />
                    </span>
                    <span class="p3">
                      <b-form-radio
                        :value="options.search_shop_radio_type.id"
                        name="subscriber_info"
                        class="radio-click"
                      >{{ $t('shops.field-id') }}</b-form-radio>
                      <input
                        ref="id"
                        v-model="table_filter.user_id"
                        :disabled="!(table_filter.radio_type == options.search_shop_radio_type.id)"
                        type="text"
                        @keyup.enter="onSearch"
                      >
                    </span>
                    <span class="p3">
                      <b-form-checkbox
                        v-model="table_filter.is_master"
                        class="check-custom"
                      >{{ $t('shops.field-master-id-only') }}</b-form-checkbox>
                    </span>
                  </div>
                  <div class="block-2">
                    <span class="p3 mr-4">
                      <b-form-radio
                        :value="options.search_shop_radio_type.owner_name"
                        name="subscriber_info"
                        class="radio-click"
                      >{{ $t('shops.owner-name') }}</b-form-radio>
                      <input
                        ref="owner_name"
                        v-model="table_filter.owner_name"
                        :disabled="!(table_filter.radio_type == options.search_shop_radio_type.owner_name)"
                        type="text"
                        @keyup.enter="onSearch"
                      >
                    </span>
                    <span class="p3 mr-4">
                      <b-form-radio
                        :value="options.search_shop_radio_type.business_number"
                        name="subscriber_info"
                        class="radio-click"
                      >{{ $t('tax-invoice-info.business-number') }}</b-form-radio>
                      <input-number
                        ref="business_number"
                        v-model="table_filter.business_number"
                        :refs="'business_number'"
                        :disabled="!(table_filter.radio_type == options.search_shop_radio_type.business_number)"
                        :negative="true"
                        class="input-box"
                        @keyup.native.enter="onSearch"
                      />
                    </span>
                    <span class="p3 mr-4">
                      <span class="label">
                        {{ $t('shops.field-subscriber-information') }}
                      </span>
                      <select-control
                        v-model="table_filter.shop_info_type"
                        :options="options.search_shop_info_type"
                        class="dib"
                        text-field="text"
                        value-field="value"
                      />
                      <input
                        class="ml-2"
                        v-model="table_filter.shop_info_content"
                        type="text"
                        @keyup.enter="onSearch"
                      >
                    </span>
                  </div>
                </b-form-radio-group>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search by subscriber status and date -->
        <tr v-show="detail_list[1]">
          <td>
            {{ $t('shops.search-by-subscriber-status-and-date') }}
            <button
              ref="subscriber_status_and_date_tab2"
              :class="{ 'minus': detail_list[1], 'plus': !detail_list[1] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.subscriber_status_and_date, 'subscriber_status_and_date_tab', 'subscriber_status_and_date_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-second">
              <li class="mr-4">
                <span>{{ $t('shops.field-subscriber-status') }}</span>
                <span>
                  <multiselect
                    :id="multi_select_ids.shop_status"
                    v-model="shop_statuses"
                    :options="shop_status_select"
                    :multiple="true"
                    :searchable="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :show-labels="false"
                    :placeholder="$t('general.select-info')"
                    class="multi-checkbox select-day-of-week dib"
                    label="text"
                    track-by="text"
                    @input="onInputMultiSelect"
                    @select="onSelectMultiSelect"
                  ><!-- @mouseleave.native="onMouseleave()"> -->
                    <template
                      v-if="shop_statuses.length && isOpen!=undefined"
                      slot="selection"
                      slot-scope="{ isOpen }"
                    >
                      <span
                        v-if="shop_statuses.length > 1"
                        class="selected tac"
                      >{{ shop_statuses.length }} {{ $t('general.selected') }}</span>
                      <span
                        v-else
                        class="selected tac"
                      >
                        <span
                          v-for="item in shop_statuses"
                          :key="item.index"
                        >
                          {{ item.text }}
                        </span>
                      </span>
                    </template>
                  </multiselect>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-subscriber-rating') }}</span>
                <span>
                  <input
                    v-model="table_filter.shop_rating_number_from"
                    type="number"
                    class="w70"
                    @keyup.enter="onSearch"
                  > ~
                  <input
                    v-model="table_filter.shop_rating_number_to"
                    type="number"
                    class="w70"
                    @keyup.enter="onSearch"
                  >
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-days-since-last-visit') }}</span>
                <span>
                  <input
                    v-model="table_filter.unvisited_date"
                    class="w70"
                    type="number"
                    @keyup.enter="onSearch"
                  > ~
                  <input
                    v-model="table_filter.unvisited_date_to"
                    class="w70"
                    type="number"
                    @keyup.enter="onSearch"
                  >
                </span>
              </li>
              <li>
                <span>{{ $t('shops.referral-source') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.referral_source_id"
                    :options="referral_source_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                  />
                </span>
              </li>
              <br>
              <li class="mr-4">
                <span>
                  <b-form-checkbox
                    v-model="table_filter.registration_date_check"
                    :value="true"
                    :unchecked-value="false"
                    class="check-custom"
                    @change="onSearchRangeDate(options.search_date_ragne_type.registration_date)"
                  >{{ $t('shops.field-registered-date') }}</b-form-checkbox>
                </span>
                <span class="i-w70">
                  <v-date-picker v-model="table_filter.registration_date_from" class="shop-date-picker" />
                  ~
                  <v-date-picker v-model="table_filter.registration_date_to" class="shop-date-picker" />
                </span>
              </li>
              <li class="mr-4">
                <span>
                  <b-form-checkbox
                    v-model="table_filter.expiry_date_check"
                    :value="true"
                    :unchecked-value="false"
                    class="check-custom mr-0"
                    @change="onSearchRangeDate(options.search_date_ragne_type.expiry_date)"
                  >{{ $t('shops.field-expiry-date') }}</b-form-checkbox>
                </span>
                <span>
                  <v-date-picker v-model="table_filter.expiry_date_from" class="shop-date-picker"/>
                  ~
                  <v-date-picker v-model="table_filter.expiry_date_to" class="shop-date-picker"/>
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search by solution information -->
        <tr v-show="detail_list[2]">
          <td>
            {{ $t('shops.search-solution-information') }}
            <button
              ref="solution_information_tab2"
              :class="{ 'minus': detail_list[2], 'plus': !detail_list[2] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.solution_information, 'solution_information_tab', 'solution_information_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-third">
              <li class="mr-4">
                <span>{{ $t('shops.field-solution-type') }}</span>
                <span>
                  <multiselect
                    :id="multi_select_ids.solution"
                    v-model="solutions"
                    :options="solution_select"
                    :multiple="true"
                    :searchable="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :show-labels="false"
                    :placeholder="$t('general.select-info')"
                    class="multi-checkbox select-day-of-week dib"
                    label="text"
                    track-by="value"
                    @input="onInputMultiSelect"
                    @select="onSelectMultiSelect"
                  >
                    <template
                      v-if="solutions.length && isOpen!=undefined"
                      slot="selection"
                      slot-scope="{ isOpen }"
                    >
                      <span
                        v-if="solutions.length > 1"
                        class="selected tac"
                      >{{ solutions.length }} {{ $t('general.selected') }}</span>
                      <span
                        v-else
                        class="selected tac"
                      >
                        <span
                          v-for="item in solutions"
                          :key="item.index"
                        >
                          {{ item.text }}
                        </span>
                      </span>
                    </template>
                  </multiselect>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-service-type') }}</span>
                <span>
                  <multiselect
                    :id="multi_select_ids.service_type"
                    v-model="service_types"
                    :options="service_type_select"
                    :multiple="true"
                    :searchable="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :show-labels="false"
                    :placeholder="$t('general.select-info')"
                    class="multi-checkbox select-day-of-week dib"
                    label="text"
                    track-by="value"
                    @select="onSelectMultiSelect"
                    @input="onInputMultiSelect"
                  >
                    <template
                      v-if="service_types.length && isOpen!=undefined"
                      slot="selection"
                      slot-scope="{ isOpen }"
                    >
                      <span
                        v-if="service_types.length > 1"
                        class="selected tac"
                      >{{ service_types.length }} {{ $t('general.selected') }}</span>
                      <span
                        v-else
                        class="selected tac"
                      >
                        <span
                          v-for="item in service_types"
                          :key="item.index"
                        >
                          {{ item.text }}
                        </span>
                      </span>
                    </template>
                  </multiselect>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-business-type') }}</span>
                <span>
                  <multiselect
                    :id="multi_select_ids.business_type"
                    v-model="business_types"
                    :options="business_type_select"
                    :multiple="true"
                    :searchable="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :show-labels="false"
                    :placeholder="$t('general.select-info')"
                    class="multi-checkbox select-day-of-week dib"
                    label="text"
                    track-by="value"
                    @select="onSelectMultiSelect"
                    @input="onInputMultiSelect"
                  >
                    <template
                      v-if="business_types.length && isOpen!=undefined"
                      slot="selection"
                      slot-scope="{ isOpen }"
                    >
                      <span
                        v-if="business_types.length > 1"
                        class="selected tac"
                      >{{ business_types.length }} {{ $t('general.selected') }}</span>
                      <span
                        v-else
                        class="selected tac"
                      >
                        <span
                          v-for="item in business_types"
                          :key="item.index"
                        >
                          {{ item.text }}
                        </span>
                      </span>
                    </template>
                  </multiselect>
                </span>
              </li>
              <br>
              <li class="mr-4">
                <span>{{ $t('shops.field-sales-user') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.sales_user_id"
                    :options="sales_user_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-cs-user') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.cs_user_id"
                    :options="cs_user_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                  />
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search chain/reseller -->
        <tr v-show="detail_list[3]">
          <td>
            {{ $t('shops.search-chain-reseller') }}
            <button
              ref="chain_reseller_tab2"
              :class="{ 'minus': detail_list[3], 'plus': !detail_list[3] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.chain_reseller, 'chain_reseller_tab', 'chain_reseller_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-fourth">
              <li class="mr-4">
                <span>{{ $t('shops.field-chain-number') }}</span>
                <span>
                  <input
                    v-model="table_filter.chain_id"
                    type="number"
                    @keyup.enter="onSearch"
                  >
                </span>
                <span>
                  <b-form-checkbox
                    v-model="table_filter.is_not_chain"
                    :value="true"
                    :unchecked-value="false"
                    class="check-custom"
                  >{{ $t('shops.field-not-a-member') }}</b-form-checkbox>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-reseller-number') }}</span>
                <span>
                  <input
                    v-model="table_filter.reseller_id"
                    type="number"
                    @keyup.enter="onSearch"
                  >
                </span>
                <span>
                  <b-form-checkbox
                    v-model="table_filter.is_not_reseller"
                    :value="true"
                    :unchecked-value="false"
                    class="check-custom"
                  >{{ $t('shops.field-not-a-member') }}</b-form-checkbox>
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search payment information -->
        <tr v-show="detail_list[4]">
          <td>
            {{ $t('shops.search-payment-information') }}
            <button
              ref="payment_information_tab2"
              :class="{ 'minus': detail_list[4], 'plus': !detail_list[4] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.payment_information, 'payment_information_tab', 'payment_information_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-fifth">
              <li class="mr-4">
                <span>{{ $t('shops.field-billing-type') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.billing_type"
                    :options="billing_type_select"
                    class="dib"
                    text-field="text"
                    value-field="value"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-payment-type') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.autotransfer"
                    :options="options.auto_transfer_type"
                    class="dib"
                    text-field="text"
                    value-field="value"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-overdue-months') }}</span>
                <span>
                  <input
                    v-model="table_filter.overdue_months_from"
                    type="number"
                    class="w70"
                    @keyup.enter="onSearch"
                  > ~
                  <input
                    v-model="table_filter.overdue_months_to"
                    type="number"
                    class="w70"
                    @keyup.enter="onSearch"
                  >
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search contact/discount information -->
        <tr v-show="detail_list[5]">
          <td>
            {{ $t('shops.search-contact-discount-information') }}
            <button
              ref="contact_discount_information_tab2"
              :class="{ 'minus': detail_list[5], 'plus': !detail_list[5] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.contact_discount_information, 'contact_discount_information_tab', 'contact_discount_information_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-sixth">
              <li class="mr-4">
                <span>{{ $t('shops.field-contract-and-discount-type') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.contract_type_id"
                    :options="contract_type_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-contract-and-discount-end-date') }}</span>
                <span class="i-w70">
                  <v-date-picker v-model="table_filter.contract_end_date_from" class="shop-date-picker"/>
                  ~
                  <v-date-picker v-model="table_filter.contract_end_date_to" class="shop-date-picker"/>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-contract-and-discount-notes') }}</span>
                <span>
                  <input
                    v-model="table_filter.contract_notes"
                    type="text"
                    @keyup.enter="onSearch"
                  >
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search additional service information -->
        <tr v-show="detail_list[6]">
          <td>
            {{ $t('shops.search-additional-service-information') }}
            <button
              ref="additional_service_information_tab2"
              :class="{ 'minus': detail_list[6], 'plus': !detail_list[6] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.additional_service_information, 'additional_service_information_tab', 'additional_service_information_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="cf form-list form-list-seventh">
              <li class="mr-4">
                <span>{{ $t('shops.field-cid') }}</span>
                <span>
                  <multiselect
                    :id="multi_select_ids.cid"
                    v-model="cids"
                    :options="cid_select"
                    :multiple="true"
                    :searchable="false"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    :show-labels="false"
                    :placeholder="$t('general.select-info')"
                    class="multi-checkbox select-day-of-week dib"
                    label="text"
                    track-by="value"
                    @input="onInputMultiSelect"
                    @select="onSelectMultiSelect"
                  ><!-- @mouseleave.native="onMouseleave()"> -->
                    <template
                      v-if="cids.length && isOpen!=undefined"
                      slot="selection"
                      slot-scope="{ isOpen }"
                    >
                      <span
                        v-if="cids.length > 1"
                        class="selected tac"
                      >{{ cids.length }} {{ $t('general.selected') }}</span>
                      <span
                        v-else
                        class="selected tac"
                      >
                        <span
                          v-for="item in cids"
                          :key="item.index"
                        >
                          {{ item.text }}
                        </span>
                      </span>
                    </template>
                  </multiselect>
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-van') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.van"
                    :options="van_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                    @change="onLoadDetailSelect(options.dropdown_list_type.van)"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-van-model') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.van_model"
                    :options="van_model_select"
                    :not-translate="true"
                    class="dib"
                    text-field="name"
                    value-field="id"
                  />
                </span>
              </li>
              <li class="mr-4">
                <span>{{ $t('shops.field-booking-link') }}</span>
                <span>
                  <select-control
                    v-model="table_filter.external_system_state"
                    :options="options.search_booking_external_system_link_state"
                    class="dib"
                    text-field="text"
                    value-field="value"
                    @change="onLoadExternalBookingLinkSelect(options.booking_external_system_link_code.naver)"
                  />

                </span>
              </li>
              <li >
                <span>{{ $t('shops.field-connected-date') }}</span>
                <span class="i-w70">
                  <v-date-picker v-model="table_filter.connected_date_from" class="shop-date-picker"/>
                  ~
                  <v-date-picker v-model="table_filter.connected_date_to" class="shop-date-picker"/>
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Search etc. -->
        <tr v-show="detail_list[7]">
          <td>
            {{ $t('shops.search-etc') }}
            <button
              ref="etc_tab2"
              :class="{ 'minus': detail_list[7], 'plus': !detail_list[7] }"
              class="btn-small"
              @click="onClickDetail(options.search_shop_tab.etc, 'etc_tab', 'etc_tab2')"
            >
              -
            </button>
          </td>
          <td>
            <ul class="form-list cf form-list-eighth">
              <li>
                <span>
                  <b-form-checkbox
                    v-model="table_filter.monitoring"
                    :value="true"
                    :unchecked-value="false"
                    class="check-custom"
                  >{{ $t('education.monitoring') }}</b-form-checkbox>
                </span>
                <span>
                  <select-control
                    v-model="table_filter.monitoring_status"
                    :options="lesson_select"
                    class="dib"
                    text-field="text"
                    value-field="value"
                  />
                </span>
              </li>
            </ul>
          </td>
        </tr>

        <!-- Actions -->
        <tr class="bottom">
          <td colspan="2">
            <div class="form-actions">
              <div class="content-left">
                <button
                  class="btn2 green"
                  @click="onClearTableFilter(false)"
                >
                  {{ $t('shops.reset-filter') }}
                </button>
              </div>

              <div class="content-right">
                <div>
                  <span>{{ $t('shops.search-purpose') }}</span>
                  <span>
                    <select v-model="table_filter.search_purpose">
                      <option :value="options.shop_search_purpose_type.screen">{{ $t('shops.view-on-screen') }}</option>
                      <option :value="options.shop_search_purpose_type.message">{{ $t('shops.sending-text') }}</option>
                      <option :value="options.shop_search_purpose_type.popup">{{ $t('shops.show-popup') }}</option>
                    </select>
                  </span>
                </div>

                <b-form-checkbox
                  id="checkbox-11"
                  v-model="table_filter.is_deleted_shop"
                  :value="true"
                  :unchecked-value="false"
                  class="check-custom"
                >{{ $t('shops.include-deleted') }} </b-form-checkbox>

                <button
                  class="btn2"
                  @click="onSearch"
                >
                  {{ $t('general.search') }}
                </button>
              </div>
            </div>
          </td>
        </tr>
      </table>

      <div class="type-top-box">
        <p v-html="$i18n.t('general.all').replace('{0}', table_data.pagination.total_items || 0)" />
        <!-- {{ searched_purpose }} {{ checked }} {{ excludes }} -->
        <div class="por">
          <select-control
            v-model="table_filter.page_size"
            :options="options.show_item"
            class="dib"
            text-field="text"
            value-field="value"
            @change="onSearch"
          />
          <b-button
            class="btn2"
            @click="onActionShop(options.form_actions.add)"
          >
            {{ $t('shops.add-new-shop') }}
          </b-button>
          <b-button
            v-show="searched_purpose == options.shop_search_purpose_type.message"
            class="btn2"
            @click="onSendTextMessage"
          >
            {{ $t('shops.send-text-message') }}
          </b-button>
          <b-button
            v-show="searched_purpose == options.shop_search_purpose_type.popup"
            class="btn2"
            @click="onShowPopup"
          >
            {{ $t('shops.showing-popup') }}
          </b-button>
        </div>
        <view-table
          :data="table_data"
          @change-page="onChangePage"
        >
          <template slot="chk_col">
            <span
              v-if="searched_purpose == options.shop_search_purpose_type.message || searched_purpose == options.shop_search_purpose_type.popup"
              class="dib"
              style="width:15px;"
            >
              <b-form-checkbox
                v-model="checked_all"
                @change="onCheckedAllClick"
              />
            </span>
          </template>
          <template
            slot="chk"
            slot-scope="{ row }"
          >
            <span
              v-if="searched_purpose == options.shop_search_purpose_type.message || searched_purpose == options.shop_search_purpose_type.popup"
              class="dib"
              style="width:15px;"
            >
              <b-form-checkbox
                v-model="checked"
                :value="row.shop_id"
                @click.native="onCheckedClick"
              />
            </span>
          </template>
          <template
            slot="registration_expiry_date"
            slot-scope="{ row }"
          >
            {{ formatDateCol(row.registration_date) }}
            <br>{{ formatTimeStampToDate(row.expiry_date_ts) }}
          </template>
          <template
            slot="shop_id"
            slot-scope="{ row }"
          >
            <div class="click-menu-por">
              <span
                class="click-menu"
                @click.prevent="onClickShopMenu($event, row.shop_id, row.shop_name)"
              >{{ row.shop_id }}</span>
              <span
                class="copy01-icon cursor"
                @click="copyToClipBoard(row.shop_id)"
              />
            </div>
          </template>
          <template
            slot="shop_name_monthly_fee"
            slot-scope="{ row }"
          >
            <span
              :class="{'bg-green' : row.issue_shop }"
              class="dib"
            >
              {{ row.shop_name }}
              <br>
              <span
                v-if="!nullOrEmpty(row.phone_number)"
                class="nav-sm-phone-icon"
                style="cursor:pointer;"
                @click="onSendCall(row.phone_number)"
              />
              <span
                v-if="!nullOrEmpty(row.owner_mobile_number)"
                class="nav-sm-mobile-icon"
                style="cursor:pointer;"
                @click="onSendCall(row.owner_mobile_number)"
              />
              <span
                v-if="!nullOrEmpty(row.owner_mobile_number)"
                class="nav-sm-message-icon"
                style="cursor:pointer;"
                @click="onSendMessage(row.shop_id, row.owner_mobile_number)"
              />
              <font>
                {{ formatMoneyCol(row.monthly_fee) }}
              </font>
              <span
                class="copy02-icon cursor"
                @click="copyToClipBoard(row.shop_id +' ' + row.shop_name)"
              />
            </span>
          </template>
          <template
            slot="owner_name_matser_id"
            slot-scope="{ row }"
          >
            {{ row.owner_name }}
            <br>{{ row.master_id }}
          </template>
          <template
            slot="service_type_business_type"
            slot-scope="{ row }"
          >
            {{ formatServiceTypeCol(row.service_type_code) }}
            <br>{{ formatBusinessTypeCol(row.business_type_code) }}
          </template>
          <template
            slot="status_netmoney_balance"
            slot-scope="{ row }"
          >
            {{ $t(options.shop_status.find(x => x.value == row.shop_status).text) }}
            <br>{{ formatMoneyCol(row.netmoney_balance) }}
          </template>
          <template
            slot="chain"
            slot-scope="{ row }"
          >
            <template v-if="row.chain_id != null">
              <span
                :id="'tooltip' + row.shop_id"
                class="text-ellip note-text"
              >
                <u
                  style="cursor:pointer;"
                  @click="onChainMembers(row.chain_id)"
                >{{ row.chain_id }}</u>
              </span>
              <b-tooltip
                :target="'tooltip' + row.shop_id"
                class="tooltip"
                placement="right"
              >
                {{ row.chain_name }}
              </b-tooltip>
            </template>
            <br>
            - todo
          </template>
          <template
            slot="reseller_sales_cs"
            slot-scope="{ row }"
          >
            <template v-if="row.reseller_id != null">
              <span
                :id="'tooltip' + row.shop_id + '2'"
                class="text-ellip note-text"
              >
                <u
                  style="cursor:pointer;"
                  @click="onResellerMembers(row.reseller_id)"
                >{{ row.reseller_id }}</u>
              </span>
              <b-tooltip
                :target="'tooltip' + row.shop_id + '2'"
                class="tooltip"
                placement="bottom"
              >
                {{ row.reseller_name }}
              </b-tooltip>
            </template>
            <br>
            {{ row.sales_user_name }}
            {{ row.sales_user_id != null && row.cs_user_id != null ? '/' : '' }}
            {{ row.cs_user_name }}
          </template>
          <template
            slot="shop_rating"
            slot-scope="{ row }"
          >
            <!-- eslint-disable-next-line -->
            <template v-if="row.rating_color != null" :style="{ background: row.rating_color + ' !important' } ">
              {{ row.shop_rating }}
            </template>
            <template v-else>
              {{ row.shop_rating }}
            </template>
          </template>
          <template
            slot="billing_type"
            slot-scope="{ row }"
          >
            {{ $t(options.billing_type_select.find(x => x.value == row.billing_type).text) }}
          </template>
          <template
            slot="autotransfer"
            slot-scope="{ row }"
          >
            {{ row.auto_transfer ? 'C(' + row.auto_transfer_day + ')' : '' }}
          </template>
          <template
            slot="overdue_months"
            slot-scope="{ row }"
          >
            <font
              v-if="row.overdue_months > 0"
              :class="{'font-red': row.overdue_months >= 3}"
            >
              {{ row.overdue_months }}
            </font>
          </template>
          <template
            slot="external_booking_link"
            slot-scope="{ row }"
          >
            {{ formatExternalBookingLinkCol(row) }}
          </template>
          <template
            slot="contract"
            slot-scope="{ row }"
          >
            <font
              v-if="row.contract_start_date_ts > 0"
              :class="{ 'font-line': 0 > onCalculateContractDate(row.contract_start_date_ts, row.contract_end_date_ts) }"
            >
              {{ onCalculateContractMonth(row.contract_start_date_ts, row.contract_end_date_ts) }}({{ onCalculateContractDate(row.contract_start_date_ts, row.contract_end_date_ts) }})
            </font>
          </template>
          <template
            slot="cid"
            slot-scope="{ row }"
          >
            {{ row.cid }}
            <span v-html="formatCidCol(row)" />
          </template>
          <template
            slot="unvisited_date"
            slot-scope="{ row }"
          >
            <span
              :id="'tooltip' + row.shop_id + '3'"
              class="text-ellip note-text shop-list-base-tooltip"
              style="cursor: pointer;"
              @mouseover="startTooltipTimerForConsult(row.shop_id)"
              @mouseleave="cancelTooltipTimerForConsult"
              @click="onActionShop(options.form_actions.edit, row.shop_id, options.shop_tab_type.manager_consult)"
            >
              <font :class="{'font-red': row.unvisited_date >= 5}">
                <template v-if="row.unvisited_date == null">
                  &nbsp;
                </template>
                <template v-else>
                  {{ row.unvisited_date }}
                </template>
              </font>
            </span>
            <b-tooltip
              v-show="consultList.length > 0 && isTooltipVisibleForConsult"
              :target="'tooltip' + row.shop_id + '3'"
              :custom-class="consultTooltipClass"
              class="tooltip"
              placement="left"
              noninteractive
            >
              <div
                v-show="consultList.length > 0 && isTooltipVisibleForConsult"
                :class="{'none-consult': consultList.length === 0}"
              >
                <div class="tooltip-header">
                  <h5 class="tooltip-title">
                    {{ $t('consult.tab-title') }}
                  </h5>
                </div>
                <!-- <div class="loader-base">
                  <div v-if="isShowConsultTooltip" class="tooltip-loader"/>
                </div> -->
                <div class="consult-table">
                  <table>
                    <tr class="h40px">
                      <th class="w130px">
                        <b>{{ $t('consult.consult-type') }}</b>
                      </th>
                      <th class="w82p">
                        <b>{{ $t('consult.consult-content') }}</b>
                      </th>
                    </tr>
                    <tr
                      v-for="(consult, index) in consultList"
                      :key="index"
                    >
                      <th>{{ consult.consult_type_name }}</th>
                      <td>
                        [{{ $t('consult.write') }}{{ formatDateCol(consult.modification_date, options.standard_date_format.ymd) }}_{{ consult.user_name }}]
                        <div v-html="replaceLineBreaks(consult.consult_detail)" />
                        <template v-if="consult.opinions.length > 0">
                          <font
                            v-for="(opinion, index) in consult.opinions"
                            :key="index"
                          >
                            [{{ $t('consult.opinion') }}{{ formatDateCol(opinion.registration_date, options.standard_date_format.ymd) }}] {{ opinion.opinion }} ({{ opinion.user_name }}) <br>
                          </font>
                        </template>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </b-tooltip>
          </template>
          <template
            slot="lesson"
            slot-scope="{ row }"
          >
            <div
              :id="'tooltip' + row.shop_id + '4'"
              :title="''"
              class="text-ellip note-text shop-list-base-tooltip"
              style="cursor: pointer;"
              @mouseover="startTooltipTimerForEducation(row.shop_id)"
              @mouseleave="cancelTooltipTimerForEducation"
              @click="onActionShop(options.form_actions.edit, row.shop_id, options.shop_tab_type.education_management)"
              v-html="onShowLessonStatus([row.monitoring_required])"
            />
            <b-tooltip
              v-show="isTooltipVisibleForEducation"
              :class="{ 'education-tooltip': true, 'no-display-tooltip': !isTooltipVisibleForEducation }"
              :target="'tooltip' + row.shop_id + '4'"
              :custom-class="educationTooltipClass"
              class="tooltip"
              placement="left"
              noninteractive
            >
              <div
                v-show="isTooltipVisibleForEducation"
                :class="{'none-education': !isTooltipVisibleForEducation}"
              >
                <div class="tooltip-header">
                  <h5 class="tooltip-title">
                    {{ $t('education.tooltip-title') }}
                  </h5>
                </div>
                <div>
                  <table class="education-table">
                    <tr>
                      <th style="width: 20%;">
                        <b>{{ $t('education.monitoring') }}</b>
                      </th>
                      <td style="width: 80%;">
                        {{ formatEducationStatus(education.monitoring_required) }}
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%;">
                        <b>{{ $t('education.noted-item') }}</b>
                      </th>
                      <td style="width: 80%;">
                        {{ education.lesson_note }}
                      </td>
                    </tr>
                  </table>
                  <table
                    v-show="educationList.length > 0"
                    class="education-table"
                  >
                    <tr class="h40px">
                      <th class="w130px">
                        <b>{{ $t('education.registration-date') }}</b>
                      </th>
                      <th class="w130px">
                        <b>{{ $t('education.desired-date') }}</b>
                      </th>
                      <th class="w130px">
                        <b>{{ $t('education.education-day') }}</b>
                      </th>
                      <th class="w130px">
                        <div><b>{{ $t('education.status') }}</b></div>
                        <div><b>{{ $t('education.manager') }}</b></div>
                      </th>
                      <th class="w130px">
                        <b>{{ $t('education.note') }}</b>
                      </th>
                    </tr>
                    <tr
                      v-for="(education, index) in educationList"
                      :key="index"
                    >
                      <td
                        class="tac"
                        style="width: 13%;"
                      >
                        {{ formatConvertDateCol(education.registration_date) }}
                      </td>
                      <td
                        class="tac"
                        style="width: 13%;"
                      >
                        {{ formatTimeStampCol(education.desired_date) }}
                      </td>
                      <td
                        class="tac"
                        style="width: 13%;"
                      >
                        {{ formatTimeStampCol(education.education_date) }}
                      </td>
                      <td
                        class="tac"
                        style="width: 13%;"
                      >
                        <div>{{ formatStatusCol(education.education_status) }}</div>
                        <div>{{ education.manger_user_name }}</div>
                      </td>
                      <td
                        class="tal"
                        style="width: 49%; white-space: pre-wrap;"
                      >{{ education.notes }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </b-tooltip>
          </template>
          <!-- <template slot="review_posted" slot-scope="{ row }">
            {{ row.review_posted == 1? 'Y' : 'N' }}
          </template> -->
          <template
            slot="sales"
            slot-scope="{ row }"
          >
            <b-button
              class="btn1"
              @click="onActionAdminSales(row.shop_id)"
            >
              {{ $t('shops.sales') }}
            </b-button>
          </template>
          <template
            slot="edit"
            slot-scope="{ row }"
          >
            <template v-if="!nullOrEmpty(row.notes)">
              <span
                :id="'tooltip' + row.shop_id + '5'"
                class="text-ellip note-text"
              >
                <b-button
                  class="btn1"
                  @click="onActionShop(options.form_actions.edit, row.shop_id)"
                >{{ $t('general.edit') }}</b-button>
              </span>
              <b-tooltip
                :target="'tooltip' + row.shop_id + '5'"
                class="tooltip"
                placement="bottom"
              >
                {{ row.notes }}
              </b-tooltip>
            </template>
            <template v-else>
              <div v-if="shopStatusCreating(row.shop_status)" />
              <div v-else>
                <b-button
                  class="btn1"
                  @click="onActionShop(options.form_actions.edit, row.shop_id)"
                >
                  {{ $t('general.edit') }}
                </b-button>
              </div>
            </template>
          </template>
        </view-table>
        <div class="flr">
          <b-button
            v-show="searched_purpose==options.shop_search_purpose_type.message"
            class="btn2"
            @click="onSendTextMessage"
          >
            {{ $t('shops.send-text-message') }}
          </b-button>
          <b-button
            v-show="searched_purpose==options.shop_search_purpose_type.popup"
            class="btn2"
            @click="onShowPopup"
          >
            {{ $t('shops.showing-popup') }}
          </b-button>
          <b-button
            class="btn2"
            @click="onActionShop(options.form_actions.add)"
          >
            {{ $t('shops.add-new-shop') }}
          </b-button>
        </div>
      </div>
      <br>
    </div>
    <!-- =============== modal components =============== -->
    <shop-action
      v-if="shop_action"
      :data="shop_action"
      :is_context_menu="false"
      @reload-page="onReloadPage"
      @hidden="shop_action=null"
    />
    <sales-action
      v-if="is_show_sales_action_modal"
      :add_shop_id="shop_id"
      @hidden="is_show_sales_action_modal=false"
      @reload-page="onShopUsageUpdatePage"
    />
    <send-message-modal
      v-if="mobile_number > '' && isShowSendMessagemodal"
      :shop_id="shop_id"
      :mobile_number="mobile_number"
      :modal-type="options.message_modal_type.shop_list"
      @close-send-message="onCloseSendMessageModal"
    />
    <send-call-modal :call_number="call_number" />
    <education-detail-modal :shop_id="shop_id" />
    <!-- ================================================ -->
    <shop-menu
      ref="shopMenu"
      @reload-page="onReloadPage"
    />
  </div>
</template>

<script>
import { mapGetters
  , mapActions } from 'vuex'
import _ from 'lodash'
import multiselect from 'vue-multiselect'
import moment from 'moment-timezone'
import { options } from 'OptionsHelpers'
import { SHOP_STATUS } from 'Constant'

import SolutionsDropdwonListApi from 'API/solutions/dropdown-list-api'
import ShopsDropdwonListApi from 'API/shops/dropdown-list-api'
import IdentitiesDropdwonListApi from 'API/identities/dropdown-list-api'
import ShopApi from 'API/shops/shop-api'
import ConsultApi from 'API/shops/consult-api'
import EducationApi from 'API/shops/education-api'

import component_base from 'CommonComponents/component-base/component-base'
import DatePicker from 'CommonComponents/datepicker/datepicker'
import view_table from 'CommonComponents/view-table/view-table.vue'
import input_number from 'CommonComponents/form/input/input-number/input-number'
import input_mobile_number from 'CommonComponents/form/input/input-number/input-mobile-number'
import select_control from 'CommonComponents/form/select/select-control'
import shop_action from 'Components/shop/shop-action/shop-action'
import sales_action from 'Components/payment/sales-action.vue'
import send_message_modal from 'Components/shop/send-message-modal'
import send_call_modal from 'Components/solution/cid/cid-send-call-action.vue'
import education_detail_modal from 'Components/shop/education-detail-modal.vue'

import { formatDate, formatMoney
  , convertDateFromUtcToTimezone
  , convertTimeStampToDate
  , nullOrEmpty
  , convertDateFromTimezoneToTimestamp
  , convertDateToTimezone
  , replaceLineBreaks
  , formatDateBySetting } from 'CommonHelpers'

const LIMIT_TABS = 8
export default {
  components: {
    'view-table':             view_table,
    'shop-action':            shop_action,
    'shop-menu':              () => import('../../components/shop/shop-menu'),
    'v-date-picker':          DatePicker,
    'select-control':         select_control,
    'sales-action':           sales_action,
    'send-message-modal':     send_message_modal,
    'send-call-modal':        send_call_modal,
    'education-detail-modal': education_detail_modal,
    'input-number':           input_number,
    'input-mobile-number':    input_mobile_number,
    multiselect,
  },
  extends: component_base,
  data() {
    return {
      modal_id:  'education-detail-modal',
      modal_id2: 'send-message-modal',
      modal_id3: 'cid-send-call-modal',
      modal_id4: 'sales-action-modal',
      modal_id5: 'action-shop-modal',

      options:     options,
      shop_action: null, // {},
      table_data:  {
        fields: [
          { field: 'chk', width: '1%', sortable: false, expand: true, multi_th: false, label: 'general.idx', thClass: this.showChkCol, tdClass: this.showChkCol, column_expand: true },
          { field: 'registration_expiry_date', width: '5%', sortable: false, expand: true, multi_th: true, label: { regi: 'shops.registered-date', expiry: 'shops.expiry-date' } },
          { field: 'shop_id', width: '5%', sortable: false, expand: true, multi_th: false, label: 'shops.shop-number' },
          { field: 'shop_name_monthly_fee', width: '8%', sortable: false, expand: true, multi_th: true, label: { shop_name: 'shops.shop-name', monthly_fee: 'payment-info.monthly-fee' } },
          { field: 'solution_name', width: '6%', sortable: false, expand: false, multi_th: false, label: 'shops.solution-name' },
          { field: 'owner_name_matser_id', width: '6%', sortable: false, expand: true, multi_th: true, label: { owern_name: 'shops.owner-name', master_id: 'general.id' } },
          { field: 'service_type_business_type', width: '5%', sortable: false, expand: true, multi_th: true, label: { service_type: 'shops.service-type', business_type: 'shops.business-type' } },
          { field: 'status_netmoney_balance', width: '5%', sortable: false, expand: true, multi_th: true, label: { status: 'shops.shop-status', netmoney_balance: 'shops.netmoney-balance' } },
          { field: 'chain', width: '5%', sortable: false, expand: true, multi_th: true, label: { chain: 'shops.chain', clients: 'shops.clients-download' } },
          { field: 'reseller_sales_cs', width: '6%', sortable: false, expand: true, multi_th: true, label: { resller: 'payment-info.reseller', sales_cs: 'shops.sales-cs' } },
          { field: 'shop_rating', width: '3%', sortable: false, expand: true, multi_th: false, label: 'shops.rating' },
          { field: 'billing_type', width: '3%', sortable: false, expand: true, multi_th: false, label: 'shops.billing', formatFn: this.formatDateCol },
          { field: 'autotransfer', width: '3%', sortable: false, expand: true, multi_th: false, label: 'shops.payment' },
          { field: 'overdue_months', width: '3%', sortable: false, expand: true, multi_th: false, label: 'payment-info.overdue' },
          { field: 'external_booking_link', width: '3%', sortable: false, expand: true, multi_th: false, label: 'shops.booking' }, // #297
          { field: 'contract', width: '4%', sortable: false, expand: true, multi_th: false, label: 'shops.contract' },
          { field: 'cid', width: '3%', sortable: false, expand: true, multi_th: false, label: 'misc-codes.cid' },
          { field: 'van', width: '3%', sortable: false, expand: false, multi_th: false, label: 'misc-codes.van' },
          { field: 'van_model', width: '4%', sortable: false, expand: false, multi_th: false, label: 'misc-codes.van-model' },
          { field: 'unvisited_date', width: '3%', sortable: false, expand: true, multi_th: false, label: 'shops.not-visit' },
          { field: 'lesson', width: '5%', sortable: false, expand: true, multi_th: false, label: 'education.monitoring' },
          // { field: 'review_posted',              width: '3%', sortable: false, expand: true,  multi_th: false, label: 'shops.review' },
          { field: 'sales', width: '5%', sortable: false, expand: true, multi_th: false, label: 'shops.sales' },
          { field: 'edit', width: '5%', sortable: false, expand: true, multi_th: false, label: 'general.edit' },
        ],
        rows:       [],
        pagination: {
          total_pages: 1,
        },
        options: {
          drag:                  false,
          pagination:            true,
          clickable:             false,
          shop_status_row_color: true,
        },
        style: 'type-top',
      },
      table_filter: {},
      detail_list:  new Array(8),

      shop_status_select:     [],
      billing_type_select:    [],
      solution_select:        [],
      service_type_select:    [],
      business_type_select:   [],
      cid_select:             [],
      van_select:             [],
      van_model_select:       [],
      sales_user_select:      [],
      cs_user_select:         [],
      referral_source_select: [],
      contract_type_select:   [],

      lesson_select:              [],
      is_show_sales_action_modal: false,
      shop_id:                    null,

      checked_all:      true,
      checked:          [],
      excludes:         [],
      searched_purpose: '',

      call_number:   '',
      mobile_number: '',

      shop_statuses:    [],
      solutions:        [],
      service_types:    [],
      business_types:   [],
      cids:             [],
      multi_select_ids: {
        shop_status:   'shopStatus',
        solution:      'solution',
        service_type:  'serviceType',
        business_type: 'businessType',
        cid:           'cid',
      },
      consultList:                  [],
      education:                    {},
      educationList:                [],
      tooltipTimerForEducation:     null,
      isTooltipVisibleForEducation: false,
      tooltipTimerForConsult:       null,
      isTooltipVisibleForConsult:   false,
      isShowSendMessagemodal:       false,
    }
  },
  computed: {
    ...mapGetters('shop', {
      shops_data: 'getShops',
    }),

    isKorean() {
      return this.app_language === options.language.korean
    },

    consultTooltipClass() {
      if(this.consultList.length === 0) return 'no-display-tooltip'
      else return 'consult-tooltip'
    },
    educationTooltipClass() {
      if(!this.isTooltipVisibleForEducation) return 'no-display-tooltip'
      else return 'education-tooltip'
    },
  },
  beforeMount() {
    if(localStorage.getItem('searchTab') == null){
      console.log('before')
      for (let index = 0; index < this.detail_list.length; index++) {
        this.detail_list[index] = true
      }
    }
  },
  mounted() {
    this.onClearTableFilter(false)

    if(localStorage.getItem('searchTab') != null){
      const temp_detail_list = localStorage.getItem('searchTab').split(',')

      // Check if the stored list has fewer than 8 items (older version)
      if (temp_detail_list.length < LIMIT_TABS) {
        // Create a new array with 8 items, all set to true
        this.detail_list = Array(LIMIT_TABS).fill(true)
        // Update localStorage with the new value
        localStorage.setItem('searchTab', this.detail_list.toString())
      } else {
        // Use the existing values from localStorage
        this.detail_list = temp_detail_list.map(e => e === 'true')
      }
    }

    this.onLoadSelect()
    //this.shop_statuses = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
    this.loadTableData()
  },
  methods: {
    ...mapActions('shop', [
      'getShopsDataAsync',
      'updateShopUsageData',
      'setShopActionDataAsync',
    ]),
    ...mapActions('admin_sales', [
      'setAdminSalesActionDataAsync',
    ]),
    ...mapActions('popup', [
      'setPageFilterData',
      'setPOPUpActionData',
    ]),
    nullOrEmpty,
    replaceLineBreaks,
    moment,
    showChkCol(){
      let class_name = ''
      if(this.searched_purpose != options.shop_search_purpose_type.message && this.searched_purpose != options.shop_search_purpose_type.popup) class_name='hide'
      return class_name
    },
    shopStatusCreating(data){
      if(data == SHOP_STATUS.CREATING) return true
      else return false
    },
    async loadTableData() {
      this.preLoader()
      this.table_filter.detail_list = this.detail_list
      this.table_filter.country_code = this.shop_data.country
      this.table_filter.shop_statuses = _.map(this.shop_statuses, 'value').join()
      this.table_filter.solution_ids = _.map(this.solutions, 'value').join()
      this.table_filter.service_type_codes = _.map(this.service_types, 'value').join()
      this.table_filter.business_type_codes = _.map(this.business_types, 'value').join()
      this.table_filter.cid = _.map(this.cids, 'value').join()
      //this.table_filter.page_size = 2 //test
      this.checked =[]
      this.checked_all =true

      await this.getShopsDataAsync(this.table_filter)
      if(this.shops_data.is_ok){
        this.table_data.rows = this.shops_data.data.items
        this.table_data.pagination = this.shops_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)

        this.table_data.rows.forEach(row => {
          if(row.has_important_consult) {
            row.class_col += '$edit$bg-brown#'
          }
          if(row.issue_shop) {
            row.class_col += '$shop_name_monthly_fee$bg-green#'
          }
          if(row.contract_start_date_ts != 0 && row.contract_end_date_ts != 0
              && this.onCalculateContractDate(row.contract_start_date_ts, row.contract_end_date_ts) >= 0 && row.overdue_months >= 3){
            row.class_col += '$contract$bg-orange#'
          }

          if(nullOrEmpty(this.excludes.find(x => x == row.shop_id))) this.checked.push (row.shop_id)
        })
      }
      else this.showAlert(this.shops_data.error_messages)

      this.preLoader(false)
    },
    onActionShop(action, shopId = null, tabIndex = null){
      this.shop_action = {
        action:   action,
        shop_id:  shopId,
        tabIndex: tabIndex,
      }
      this.$nextTick(() => {
        this.showDialogById(this.modal_id5)
      })
    },
    onSendMessage(shop_id, owner_mobile_number){
      this.shop_id = shop_id
      this.mobile_number = owner_mobile_number
      this.isShowSendMessagemodal = true
      this.$nextTick(() => {
        this.showDialogById(this.modal_id2)
      })
    },
    onSendCall(phone_number){
      this.call_number = phone_number
      this.$nextTick(() => {
        this.showDialogById(this.modal_id3)
      })
    },
    onClickDetail(item, detail, detail2){
      if(this.detail_list[item]){
        this.$set(this.detail_list, item, false)
        this.$refs[detail].innerHTML = '+'
        this.$refs[detail2].innerHTML = '+'
      }
      else{
        this.$set(this.detail_list, item, true)
        this.$refs[detail].innerHTML = '-'
        this.$refs[detail2].innerHTML = '-'
      }
      localStorage.setItem('searchTab', this.detail_list)
    },
    onLoadExternalBookingLinkSelect(external_booking_link_code){
      this.table_filter.external_system_code = external_booking_link_code
      if(this.table_filter.external_system_state==options.booking_external_system_link_state.disconnected)
        this.table_filter.external_system_code = options.booking_external_system_link_code.none
      if(this.table_filter.external_system_state==null)
        this.table_filter.external_system_code = null
    },
    async onLoadSelect(){
      this.shop_statuses = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.solutions = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.service_types = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.business_types = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.cids = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]

      this.billing_type_select = _.cloneDeep(this.options.billing_type_select)
      this.billing_type_select.unshift({ text: 'general.all-select', value: null })

      this.options.shop_status.forEach(e => {
        if(e.value != this.options.shop_status_value.creating)
          this.shop_status_select.push({ text: this.$i18n.t(e.text), value: e.value})
      })
      this.shop_status_select.unshift({ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all })
      this.shop_status_select.unshift({ text: this.$i18n.t('general.select-info'), $isDisabled: true })

      this.lesson_select = _.cloneDeep(this.options.education_status_select)
      this.lesson_select.unshift({ text: 'general.select-info', value: null })

      // Solution DropdownList
      let data_send = {
        item_types:   [ options.dropdown_list_type.country_solution ],
        country_code: this.shop_data.country,
        solution_id:  0,
      }

      let dropdown_list_api = new SolutionsDropdwonListApi()
      this.preLoader()
      let result = await dropdown_list_api.getDropdownListAsync(data_send)
      this.preLoader(false)

      if(result.is_ok){
        result.data.items.forEach(e => {
          this.solution_select = [
            { text: this.$i18n.t('general.select-info'), $isDisabled: true },
            { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all },
          ]
          e.items.forEach(x => {
            this.solution_select.push({ text: x.name, value: x.id})
          })
        })
      }
      else this.showAlert(result.error_messages)

      // ServiceType, BusinessType DropdownList
      await this.onLoadDetailSelect(options.dropdown_list_type.country_solution)

      // Shop DropdownList
      data_send = {
        item_types:   [ options.dropdown_list_type.VAN, options.dropdown_list_type.CID, options.dropdown_list_type.referral_source, options.dropdown_list_type.contract_type ],
        country_code: this.shop_data.country,
        check_code:   null,
      }
      dropdown_list_api = new ShopsDropdwonListApi()
      this.preLoader()
      result = await dropdown_list_api.getDropdownListAsync(data_send)
      this.preLoader(false)

      if(result.is_ok){
        result.data.items.forEach(e => {
          if(e.item_type == 'MISC' + options.dropdown_list_type.VAN){
            this.van_select = e.items
            this.van_select.unshift({ id: null, name: this.$i18n.t('general.all-select') })
          }
          else if(e.item_type == 'MISC' + options.dropdown_list_type.CID){
            this.cid_select = [
              { text: this.$i18n.t('general.select-info'), $isDisabled: true },
              { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all },
            ]
            e.items.forEach(x => {
              this.cid_select.push({ text: x.name, value: x.id})
              this.cid_select.push({ text: this.formatNotUsedCid(x.name), value: 'XX#' + x.id})
            })

            this.cid_select.push({ value: 'M#', text: this.$t('misc-codes.cid-mobile') })
            this.cid_select.push({ value: 'XX#M#', text: this.$t('misc-codes.cid-not-used-mobile') })
          }
          else if(e.item_type == 'MISC' + options.dropdown_list_type.referral_source){
            this.referral_source_select = e.items
            this.referral_source_select.unshift({ id: options.search_shop_no_selection_type, name: this.$i18n.t('general.no-selection') })
            this.referral_source_select.unshift({ id: 0, name: this.$i18n.t('general.all-select') })
          }
          else if(e.item_type == 'MISC' + options.dropdown_list_type.contract_type){
            this.contract_type_select = e.items
            this.contract_type_select.unshift({ id: 0, name: this.$i18n.t('general.all-select') })
          }
        })
      }
      else this.showAlert(result.error_messages)

      // Staff DropdownList
      dropdown_list_api = new IdentitiesDropdwonListApi()
      this.preLoader()
      result = await dropdown_list_api.getDropdownListAsync(this.shop_data.shop_id)
      this.preLoader(false)

      if(result.is_ok){
        this.sales_user_select = result.data.sales_staffs
        this.sales_user_select.unshift({ id: options.search_shop_no_selection_type, name: this.$i18n.t('general.no-selection') })
        this.sales_user_select.unshift({ id: 0, name: this.$i18n.t('general.all-select') })
        this.cs_user_select = result.data.cs_staffs
        this.cs_user_select.unshift({ id: options.search_shop_no_selection_type, name: this.$i18n.t('general.no-selection') })
        this.cs_user_select.unshift({ id: 0, name: this.$i18n.t('general.all-select') })
      }
      else this.showAlert(result.error_messages)

      this.van_model_select.push({ id: null, name: this.$i18n.t('general.all-select') })
    },
    async onLoadDetailSelect(type){
      if(type == options.dropdown_list_type.country_solution){
        this.table_filter.service_type_code = null
        this.table_filter.business_type_code = null

        const data_send = {
          item_types:   [ options.dropdown_list_type.country_all_business_type, options.dropdown_list_type.country_all_service_type ],
          country_code: this.shop_data.country,
          //solution_id: this.table_filter.solution_id,
        }

        const dropdown_list_api = new SolutionsDropdwonListApi()
        this.preLoader()
        const result = await dropdown_list_api.getDropdownListAsync(data_send)
        this.preLoader(false)

        if(result.is_ok){
          result.data.items.forEach(e => {
            if(e.item_type == options.dropdown_list_type.country_all_business_type){
              this.business_type_select = [
                { text: this.$i18n.t('general.select-info'), $isDisabled: true },
                { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all },
              ]
              e.items.forEach(x => {
                this.business_type_select.push({ text: x.name, value: x.id })
              })
            }
            else{
              this.service_type_select = [
                { text: this.$i18n.t('general.select-info'), $isDisabled: true },
                { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all },
              ]
              e.items.forEach(x => {
                this.service_type_select.push({ text: x.name, value: x.id })
              })
            }
          })
        }else this.showAlert(result.error_messages)
      }else{
        this.table_filter.van_model = null

        const data_send = {
          item_types:   [ options.dropdown_list_type.VAN_model ],
          country_code: this.shop_data.country,
          check_code:   this.table_filter.van,
        }

        const dropdown_list_api = new ShopsDropdwonListApi()
        this.preLoader()
        const result = await dropdown_list_api.getDropdownListAsync(data_send)
        this.preLoader(false)

        if(result.is_ok){
          result.data.items.forEach(e => {
            this.van_model_select = e.items
            this.van_model_select.unshift({ id: null, name: this.$i18n.t('general.all-select') })
          })
        } else this.showAlert(result.error_messages)
      }
    },
    onShowLessonStatus(type){
      let result = ''
      type.forEach(e => {
        if(e == options.education_status.required) result += '<strong class="color-red">' + this.$i18n.t('shops.education-require') + '</strong>'
        else if (e == options.education_status.not_required) result += this.$i18n.t('shops.education-not-require')
        else result += this.$i18n.t('shops.education-finish')
        result += '/'
      })
      return result.slice(0, -1)
    },
    onCalculateContractDate(start_date_ts, end_date_ts){
      if(start_date_ts != 0){
        const zone = this.shop_data.timezone
        const contractDate = moment(end_date_ts * 1000).utcOffset(zone)
        const today = moment(convertDateFromTimezoneToTimestamp(convertDateToTimezone(new Date())) * 1000)

        const diff_month = contractDate.diff(today, 'months', true)
        if(diff_month > 0) return Math.floor(contractDate.diff(today, 'months', true))
        return Math.floor(contractDate.diff(today, 'months', true))
      }
      else return null
    },
    onCalculateContractMonth(start_date_ts, end_date_ts){
      if(start_date_ts != 0){
        const zone = this.shop_data.timezone
        const start_date = moment(start_date_ts * 1000).utcOffset(zone)
        const end_date = moment(end_date_ts * 1000).utcOffset(zone)

        return Math.ceil(end_date.diff(start_date, 'months', true))
      }
      return null
    },
    onClearTableFilter(flag){
      if(flag) { // not call in mounted()
        for (let index = 0; index < this.detail_list.length; index++) {
          this.detail_list[index] = true
          localStorage.setItem('searchTab', this.detail_list)
        }
      }
      this.table_filter = {
        page_size:               options.pagination.default,
        page_number:             1,
        country_code:            null,
        shop_id:                 0,
        shop_name:               null,
        phone_number_or_mp:      null,
        shop_statuses:           null,
        billing_type:            null,
        autotransfer:            null,
        shop_info_type:          1,
        shop_info_content:       '',
        overdue_months_from:     null,
        overdue_months_to:       null,
        shop_rating_number_from: null,
        shop_rating_number_to:   null,
        referral_source_id:      0,
        registration_date_check: false,
        registration_date_from:  null,
        registration_date_to:    null,
        expiry_date_check:       false,
        expiry_date_from:        null,
        expiry_date_to:          null,
        contract_type_id:        0,
        solution_id:             0,
        service_type_code:       null,
        business_type_code:      null,
        sales_user_id:           0,
        cs_user_id:              0,
        cid:                     null,
        cid_mobile:              null,
        van:                     null,
        van_model:               null,
        monitoring:              false,
        monitoring_status:       null,
        is_deleted_shop:         false,
        owner_name:              null,
        business_number:         null,
        user_id:                 null,
        is_master:               false,
        chain_id:                null,
        is_not_chain:            false,
        reseller_id:             null,
        is_not_reseller:         false,
        consult_detail:          null,
        search_purpose:          options.shop_search_purpose_type.screen,

        radio_type: options.search_shop_radio_type.shop,

        unvisited_date:               null,
        unvisited_date_to:            null,
        is_previous_data_search:      false,
        is_deleted_data_search:       false,
        is_only_previous_data_search: false,
        previous_code:                null,

        contract_notes:         '',
        contract_end_date_from: null,
        contract_end_date_to:   null,
        external_system_code:   null,
        external_system_state:  null,
        connected_date_from:    null,
        connected_date_to:      null,
      }
      this.shop_statuses = [{ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all }]
      this.solutions = [{ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all }]
      this.service_types = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.business_types = [ { text: this.$i18n.t('general.all-select'), value: options.admins_enums.all } ]
      this.cids = [{ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all }]
    },
    onSearchRangeDate(type){
      const today = convertDateToTimezone(new Date())

      if(type == options.search_date_ragne_type.registration_date){
        this.table_filter.registration_date_from = new Date(today.getFullYear(), today.getMonth(), 1)
        this.table_filter.registration_date_to = today
      }else{
        this.table_filter.expiry_date_from = new Date(today.getFullYear(), today.getMonth(), 1)
        this.table_filter.expiry_date_to = today
      }
    },
    onChainMembers(chain_id){
      this.$router.push({ name: 'branches', params: { chain_id: chain_id } })
    },
    onResellerMembers(reseller_id){
      this.$router.push({ name: 'reseller-subscribers', params: { reseller_id: reseller_id } })
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },
    onSearch(){
      this.searched_purpose = this.table_filter.search_purpose
      this.excludes =[]
      this.onChangePage(1)
    },
    onReloadPage(){
      this.loadTableData()
    },
    onShopUsageUpdatePage(shop_usage){
      this.updateShopUsageData(shop_usage)
    },
    onCheckedClick(evt) {
      if (evt.target.tagName !== 'INPUT') return
      const shop_id = Number(evt.target.value)
      const found = this.excludes.find(x => x == shop_id)
      const idx = this.excludes.indexOf(found)
      const is_exist = (idx > -1)
      if (evt.target.checked) {
        if(is_exist) this.excludes.splice(idx, 1)
      }
      else {
        if (! is_exist) this.excludes.push(shop_id)
      }
    },
    onCheckedAllClick(tf){
      this.checked =[]
      const rows = this.table_data.rows

      if (tf) {
        rows.forEach(r => {
          this.checked.push( r.shop_id)
          _.remove(this.excludes, (a) => a == r.shop_id )
        })
      }else {
        rows.forEach(r => {
          if(nullOrEmpty(this.excludes.find(x => x == r.shop_id))) this.excludes.push (r.shop_id)
        })
      }
    },
    startTooltipTimerForEducation(shopId) {
      this.cancelTooltipTimerForEducation()
      this.tooltipTimerForEducation = setTimeout(async () => {
        await this.onShowEducationTooltipAsync(shopId)
        this.isTooltipVisibleForEducation = true
      }, 500)
    },
    cancelTooltipTimerForEducation() {
      if (this.tooltipTimerForEducation) {
        clearTimeout(this.tooltipTimerForEducation)
        this.tooltipTimerForEducation = null
      }
      this.educationList = []
      this.isTooltipVisibleForEducation = false
    },
    startTooltipTimerForConsult(shopId) {
      this.cancelTooltipTimerForConsult()
      this.tooltipTimerForConsult = setTimeout(() => {
        this.isTooltipVisibleForConsult = true
        this.onShowConsultTooltipAsync(shopId)
      }, 500)
    },
    cancelTooltipTimerForConsult() {
      if (this.tooltipTimerForConsult) {
        clearTimeout(this.tooltipTimerForConsult)
        this.tooltipTimerForConsult = null
      }
      this.consultList = []
      this.isTooltipVisibleForConsult = false
    },
    async onSendTextMessage(){
      this.preLoader()
      this.table_filter.detail_list = this.detail_list
      this.table_filter.country_code = this.shop_data.country
      const filter= Object.assign({}, this.table_filter)
      filter.page_size = -1 // max

      const shop_api = new ShopApi()
      const result = await shop_api.getShopsAsync(filter)
      if(result.is_ok){
        const receivers = []
        result.data.items.forEach(row => {
          if (!this.excludes.find(x => x == row.shop_id))
            receivers.push({receiver_phone: row.owner_mobile_number, receiver_key: row.shop_id, va1: row.shop_name })
        })
        // add test data
        //for(let i =0; i< 30000; i++) receivers.push ({receiver_phone: '01500010001', receiver_key: 600000, var1: 'test shopName' })

        this.preLoader(false)
        this.$router.push(({ name: 'message-send-multi', params: {multi_data: {receivers: receivers}} }))
        return
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    async onShowPopup(){
      this.preLoader()
      this.table_filter.detail_list = this.detail_list
      this.table_filter.country_code = this.shop_data.country
      const filter= Object.assign({}, this.table_filter)
      filter.page_size = -1 // max

      const shop_api = new ShopApi()
      const result = await shop_api.getShopsAsync(filter)
      if(result.is_ok){
        const target_shop = []
        result.data.items.forEach(row => {
          if (!this.excludes.find(x => x == row.shop_id))
            target_shop.push({shopId: row.shop_id })
        })
        // add test data
        //for(let i =0; i< 30000; i++) receivers.push ({receiver_phone: '01500010001', receiver_key: 600000, var1: 'test shopName' })

        this.preLoader(false)
        let popup_action = {
          id:     null,
          action: this.options.form_actions.add,
        }
        this.setPOPUpActionData(popup_action)
        this.$router.push(({ name: 'popup-action', params: {multi_data: {target_popup_shop: target_shop}} }))
        return
      }
      else this.showAlert(result.error_messages)
      this.preLoader(false)
    },
    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone), this.shop_data.format_date)
    },
    formatConvertDateCol(date){
      if(date==null) return ''
      else return formatDateBySetting(convertDateFromUtcToTimezone(date, this.shop_data.timezone), true)
    },
    formatTimeStampCol(time_stamp){
      if(time_stamp == null){
        return ''
      }
      else{
        return moment(convertTimeStampToDate(time_stamp)).format('YYYY-MM-DD HH:mm')
      }
    },
    formatStatusCol(education_status){
      return this.$t(this.options.education_detail_status_select.find(x => x.value == education_status).text)
    },
    formatTimeStampToDate(ts) {
      if (ts == 0) return ''
      return formatDate(convertTimeStampToDate(ts, true), this.shop_data.format_date)
    },
    formatMoneyCol(number) {
      return formatMoney(number, 0)
    },
    formatBillingTypeCol(billing_tyoe){
      return this.options.billing_type_select.find(x => x.value == billing_tyoe).text
    },
    formatNotUsedCid(cid){
      return this.$t('misc-codes.cid-not-used').replace('{cid}', cid)

    },
    onActionAdminSales(shop_id){
      let admin_sales_action = {
        action: this.options.form_actions.add,
      }
      this.setAdminSalesActionDataAsync(admin_sales_action).then(() => {
        this.shop_id = shop_id
        this.is_show_sales_action_modal = true
        this.$nextTick(() => {
          this.showDialogById(this.modal_id4)
        })
      })
    },
    onClickShowLesson(row)
    {
      this.shop_id = row.shop_id
      this.$nextTick(() => {
        this.showDialogById(this.modal_id)
      })
    },
    onFoucsInput() {
      let type = ''
      switch (this.table_filter.radio_type) {
        case options.search_shop_radio_type.shop:
          type = 'shop'
          break

        case options.search_shop_radio_type.phone:
          type = 'phone'
          break

        case options.search_shop_radio_type.id:
          type = 'id'
          break

        case options.search_shop_radio_type.owner_name:
          type = 'owner_name'
          break

        case options.search_shop_radio_type.business_number:
          type = 'business_number'
          break

        default:
          break
      }
      this.$nextTick(() => {
        this.$refs[type].focus()
      })
    },
    // onMouseleave(){
    //   if(this.$refs.shopStatusesMultiselect.isOpen)
    //     this.$refs.shopStatusesMultiselect.toggle()
    // },
    onSelectMultiSelect(option, id){
      let selections = []
      if (id == this.multi_select_ids.shop_status) selections = this.shop_statuses
      else if (id == this.multi_select_ids.solution) selections = this.solutions
      else if (id == this.multi_select_ids.service_type) selections = this.service_types
      else if (id == this.multi_select_ids.business_type) selections = this.business_types
      else if (id == this.multi_select_ids.cid) selections = this.cids

      if(option.value == options.admins_enums.all){
        selections.splice(0, selections.length) // remove all
      }else{
        if(selections.find(x => x.value == options.admins_enums.all)){
          selections.splice(0, 1) // remove first
        }
      }
    },
    onInputMultiSelect(opts){
      if(opts.length == 0){
        opts.push({ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all })
      }
    },
    async onShowConsultTooltipAsync(shopId){
      const query = {
        shop_id:     shopId,
        page_size:   3,
        page_number: 1,
      }
      const consultApi = new ConsultApi()
      const result = await consultApi.getConsultsAsync(query)
      this.consultList = result.data.items
    },
    async onShowEducationTooltipAsync(shopId){
      const query = {
        shop_id:      shopId,
        page_size:    3,
        page_number:  1,
        country_code: this.shop_data.country,
      }
      const educationApi = new EducationApi()
      const resultByShop = await educationApi.getEducationByShopIdAsync(query)
      this.education = resultByShop.data

      const result = await educationApi.getEducationHistoryAsync(query)
      this.educationList = result.data.items
    },
    copyToClipBoard(val) {
      navigator.clipboard.writeText(val)
        .then(()=> {
          //
        })
        .catch(err => {
          this.showAlert([err])
        })
    },
    formatEducationStatus(status){
      if(status != undefined)
        return this.$t(options.education_status_select.find(x => x.value == status).text)
    },
    formatServiceTypeCol(serviceTypeCode) {
      const serviceType = this.service_type_select.find(x => x.value == serviceTypeCode)

      if(serviceType != undefined) return serviceType.text.charAt(0)
      else return serviceTypeCode
    },
    formatBusinessTypeCol(businessTypeCode) {
      const businessType = this.business_type_select.find(x => x.value == businessTypeCode)

      if(businessType != undefined) return businessType.text
      else return businessTypeCode
    },
    formatExternalBookingLinkCol(row){
      return (row.external_system_code == options.booking_external_system_link_code.naver &
            row.external_system_state == options.booking_external_system_link_state.connected) ? 'N' : ''
    },
    formatCidCol(row){
      return (!nullOrEmpty(row.cid) && !nullOrEmpty(row.cid_mobile)) ? '<br>'+ row.cid_mobile : row.cid_mobile
    },

    onCloseSendMessageModal() {
      this.isShowSendMessagemodal = false
    },
  },
}
</script>

<style lang='scss' scoped>
@import './shop.scss';
</style>
