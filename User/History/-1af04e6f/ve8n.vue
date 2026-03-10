<template>
  <div class="common-style">
    <b-modal
      :id="modal_id"

      ref="modalClient"
      :visible="visible"
      :title="modalTitle"
      :modal-class="modalClass"
      :no-close-on-backdrop="true"

      size="mdl"
      hide-footer
      dialog-class="clien-action-modal-dialog"
      content-class="client-action-modal-content"

      @shown="onShown"
      @hide="onCancel()"
      @show="onLoadForm()"
    >
      <!-- BEGIN CLIENT FROM -->
      <form
        ref="form"
        class="form-wrapper clearfix"
      >
        <div class="setup-field-mobile">
          <span
            class="setup-field-mobile__text"
            @click="onFieldSetup"
          >{{ $t('clients.setup-field') }}</span>
        </div>
        <p class="set-field-btn">
          <a
            class="client-action-img view-pc"
            @click="onFieldSetup"
          >
            <span class="client-setup-big" />
            <span>{{ $t('clients.setup-field') }}</span>
          </a>
        </p>
        <div
          v-if="field_setup.member"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-number') }}</dt>
            <dd>
              <div class="input-box res-non">
                <aha-input-number
                  v-model="client.memberNumber"
                  :disabled="isDisabledClientNumber"
                  :max-length="maxClientNumberLength"

                  accept-empty-string-value
                  class="form-control input-number w100p"
                />
              </div>
              <div class="last-box checkbox-por">
                <a
                  v-if="isAllowEditClient"
                  class="client-action-img"
                  @click="onMemberNumberSetup"
                >
                  <span
                    :id="`${targetAhaTooltip}check-number-setup`"
                    class="client-setup-s"
                  />
                </a>
                <aha-tooltip
                  :target="`${targetAhaTooltip}check-number-setup`"
                  placement="right"
                  boundary="note-tooltip"
                >
                  {{ $t('clients.tooltip-client-number-setup') }}
                </aha-tooltip>
                <b-form-checkbox
                  v-model="client.memberType"
                  :disabled="!isAllowEditClient"
                  :value="options.clients_enums.client_member_type.non_member"
                  :unchecked-value="options.clients_enums.client_member_type.member"

                  class="add-client-check view-pc"
                  checked="options.clients_enums.client_member_type.non_member"

                  @change="getMemberNumber"
                >
                  <span class="text">{{ $t('clients.no-number') }}</span>
                </b-form-checkbox>
              </div>
              <div class="last-box checkbox-por view-mobile">
                <b-form-checkbox
                  v-model="client.memberType"
                  :disabled="!isAllowEditClient"
                  :value="options.clients_enums.client_member_type.non_member"
                  :unchecked-value="options.clients_enums.client_member_type.member"

                  class="add-client-check non-por"
                  checked="options.clients_enums.client_member_type.non_member"

                  @change="getMemberNumber"
                >
                  <span class="text">{{ $t('clients.no-number') }}</span>
                </b-form-checkbox>
              </div>
            </dd>
          </dl>
        </div>
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-name') }} <strong class="color-red">*</strong></dt>
            <dd class="clearfix">
              <div class="input-box">
                <input
                  :ref="selectField"
                  v-model="client.clientName"
                  :maxlength="maxClientNameLength"

                  type="text"
                  class="form-control w100p"
                >
              </div>
              <div class="last-box checkbox-por">
                <a
                  class="client-action-img"
                  @click="onDuplicatedClients(options.clients_enums.duplicated_client_search_type_values.name)"
                >
                  <span
                    :id="`${targetAhaTooltip}check-duplicate-name`"
                    class="duplicate-check"
                  />
                </a>
                <aha-tooltip
                  :target="`${targetAhaTooltip}check-duplicate-name`"
                  placement="right"
                  boundary="note-tooltip"
                >
                  {{ $t('clients.tooltip-duplication') }}
                </aha-tooltip>
              </div>
            </dd>
          </dl>
        </div>
        <!-- Mobile Number new -->
        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.mobile-number') }}</dt>
            <dd class="clearfix mobile-number">
              <div class="input-box res-non">
                <div v-if="!isEditClientMobileNumber">
                  <input
                    v-if="isDisableMobilePhoneNumber"
                    :value="client.mobileNumber"
                    :placeholder="$t('clients.phone-number-only-placeholder')"

                    disabled
                    class="form-control w100p border-radius-0px"
                  >

                  <aha-input-mobile-number
                    v-else
                    v-model="client.mobileNumber"
                    :placeholder="$t('clients.phone-number-only-placeholder')"

                    class="form-control w100p"
                  />
                </div>
                <div v-else>
                  <aha-input-mobile-number
                    ref="mobileNumber"
                    v-model="client.mobileNumber"
                    class="form-control w100p"
                  />
                </div>
                <div class="last-box checkbox-por last-box--padding-top-10">
                  <b-form-checkbox
                    v-model="client.allowedMessageType"
                    :value="options.clients_enums.allowed_message_type.not_message"
                    :unchecked-value="options.clients_enums.allowed_message_type.allow_message"

                    class="add-client-check non-por"
                  >
                    {{ $t('clients.not-any-message') }}
                  </b-form-checkbox>
                </div>
              </div>
              <div class="last-box checkbox-por last-box--flex">
                <a
                  class="client-action-img w-unset"
                  @click="onDuplicatedClients(options.clients_enums.duplicated_client_search_type_values.mobile)"
                >
                  <span
                    :id="`${targetAhaTooltip}check-number-duplicate`"
                    class="duplicate-check"
                  />
                </a>
                <aha-tooltip
                  :target="`${targetAhaTooltip}check-number-duplicate`"
                  placement="right"
                  boundary="note-tooltip"
                >
                  {{ $t('clients.tooltip-duplication') }}
                </aha-tooltip>

                <div
                  v-if="isShowEditMobilePhoneCheckbox"
                  class="checkbox-edit-client"
                >
                  <b-form-checkbox
                    v-model="isEditClientMobileNumber"
                    @change="onEditClientMobileNumber"
                  >
                    {{ $t('general.edit') }}
                  </b-form-checkbox>
                </div>
              </div>
            </dd>
          </dl>
        </div>
        <!-- Mobile Number new -->
        <div
          v-if="field_setup.mobile_number2 && false"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.mobile-number2') }}</dt>
            <dd>
              <div class="input-box">
                <input
                  v-if="isDisableMobilePhoneNumber"
                  :value="client.mobileNumber2"
                  :placeholder="$t('clients.phone-number-only-placeholder')"

                  disabled
                  class="form-control w100p border-radius-0px"
                >
                <aha-input-mobile-number
                  v-else
                  v-model="client.mobileNumber2"
                  :placeholder="$t('clients.phone-number-only-placeholder')"

                  class="form-control w100p"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.phone_number"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.phone-number') }}</dt>
            <dd class="phone-number-group">
              <div class="input-box phone-number">
                <div v-if="!isEditClientPhoneNumber">
                  <input
                    v-if="isDisableMobilePhoneNumber"
                    :value="client.phoneNumber"
                    :placeholder="$t('clients.phone-number-only-placeholder')"

                    disabled
                    class="form-control w100p border-radius-0px"
                  >
                  <aha-input-mobile-number
                    v-else
                    v-model="client.phoneNumber"
                    :max-length="maxClientPhoneNumberLength"
                    :placeholder="$t('clients.phone-number-only-placeholder')"

                    class="form-control w100p"
                  />
                </div>
                <div v-else>
                  <aha-input-mobile-number
                    ref="phoneNumber"
                    v-model="client.phoneNumber"
                    :max-length="maxClientPhoneNumberLength"

                    class="form-control w100p"
                  />
                </div>
              </div>

              <div class="last-box--edit-client">
                <b-form-checkbox
                  v-if="isShowEditMobilePhoneCheckbox"
                  v-model="isEditClientPhoneNumber"
                  @change="onEditPhoneNumber"
                >
                  {{ $t('general.edit') }}
                </b-form-checkbox>
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.email && false"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('general.email') }}</dt>
            <dd>
              <div class="input-box">
                <input
                  v-model="client.email"
                  type="text"
                  class="w100p"
                >
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.sex"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.sex') }}</dt>
            <dd>
              <radio-group
                v-model="client.sex"
                :buttons="false"
                :options="options.clients_enums.sex"
              />
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.birthday"
          class="form-group"
        >
          <dl class="clearfix list">
            <template v-if="isPetSalon">
              <dt>
                {{ $t('clients.age-birthday') }}
              </dt>
            </template>
            <template v-else>
              <dt>
                {{ $t('clients.birthday') }}
              </dt>
            </template>
            <dd>
              <div class="input-box day-option">
                <template v-if="isKrCountry">
                  <template v-if="isPetSalon">
                    <span class="age-first">
                      <aha-input-number
                        v-model="client.years"
                        :min-value="0"
                        :max-length="3"
                        :max-value="MAX_AGE"
                        :placeholder="is_mobile ? $t('clients.years') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='years'"
                        @input="onYearsInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.years') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="currentYear"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthYear'"
                        @input="onBirthYearInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                        @focus="active='birthMonth'"
                        @input="onBirthMonthInput"
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthDD'"
                        @input="onBirthDayInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="2100"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        prevent-input-zero-value
                        class="w70 form-control"
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}{{ $t('clients.optional') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                  </template>
                </template>
                <template v-else-if="isVnCountry">
                  <template v-if="isPetSalon">
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthDD'"
                        @input="onBirthDayInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                        @focus="active='birthMonth'"
                        @input="onBirthMonthInput"
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="currentYear"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthYear'"
                        @input="onBirthYearInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}</template>
                    </span>
                    <span class="age-last">
                      <aha-input-number
                        v-model="client.years"
                        :min-value="0"
                        :max-length="3"
                        :max-value="MAX_AGE"
                        :placeholder="is_mobile ? $t('clients.years') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='years'"
                        @input="onYearsInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.years') }}</template>
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="2100"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        class="w70 form-control"
                        prevent-input-zero-value
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}{{ $t('clients.optional') }}</template>
                    </span>
                  </template>
                </template>
                <template v-else>
                  <template v-if="isPetSalon">
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        prevent-input-zero-value
                        class="w60 form-control"
                        @focus="active='birthMonth'"
                        @input="onBirthMonthInput"
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthDD'"
                        @input="onBirthDayInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="currentYear"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='birthYear'"
                        @input="onBirthYearInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}</template>
                    </span>
                    <span class="age-last">
                      <aha-input-number
                        v-model="client.years"
                        :min-value="0"
                        :max-length="3"
                        :max-value="MAX_AGE"
                        :placeholder="is_mobile ? $t('clients.years') : null"

                        prevent-input-zero-value
                        class="w50 form-control"
                        @focus="active='years'"
                        @input="onYearsInput"
                      /> <template v-if="!is_mobile">{{ $t('clients.years') }}</template>
                    </span>
                  </template>
                  <template v-else>
                    <span>
                      <aha-input-number
                        v-model="client.birthMonth"
                        :max-length="2"
                        :max-value="12"
                        :placeholder="is_mobile ? $t('general.month') : null"

                        class="w60 form-control"
                        prevent-input-zero-value
                      /> <template v-if="!is_mobile">{{ $t('general.month') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthDD"
                        :max-length="2"
                        :max-value="31"
                        :placeholder="is_mobile ? $t('clients.day') : null"

                        class="w60 form-control"
                        prevent-input-zero-value
                      /> <template v-if="!is_mobile">{{ $t('clients.day') }}</template>
                    </span>
                    <span>
                      <aha-input-number
                        v-model="client.birthYear"
                        :max-length="4"
                        :max-value="2100"
                        :placeholder="is_mobile ? $t('clients.year') : null"

                        prevent-input-zero-value
                        class="w70 form-control"
                      /> <template v-if="!is_mobile">{{ $t('clients.year') }}{{ $t('clients.optional') }}</template>
                    </span>
                  </template>
                </template>
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.client_rating"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-rating') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select
                  v-model="client.clientRatingId"
                  :disabled="!isAllowEditClient"
                  :options="client_rating_select"

                  value-field="id"
                  text-field="name"
                  class="custom-select w100p"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.client_group"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.client-group') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select
                  v-model="client.clientGroupId"
                  :options="client_group_select"
                  :disabled="!isAllowEditClient"

                  value-field="id"
                  text-field="name"
                  class="custom-select w100p"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.preferred_staff"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.preferred-staff') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select
                  v-model="client.preferredStaffId"
                  :options="staff_select"
                  :disabled="!isAllowEditClient"

                  value-field="id"
                  text-field="aliasname"
                  class="custom-select w100p"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.referral_source"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.referral-source') }}</dt>
            <dd>
              <div class="input-box">
                <b-form-select
                  v-model="client.clientReferralSourceId"
                  :disabled="!isAllowEditClient"
                  :options="client_referral_source_select"

                  value-field="id"
                  text-field="name"
                  class="custom-select w100p"
                />
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.recommender"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.recommender') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non non2">
                <input
                  v-model="client.recommenderName"

                  disabled
                  type="text"
                  class="w100p"
                >
              </div>
              <div
                v-if="isAllowEditClient"
                class="last-box res-non non2"
              >
                <div class="search-recommender-box">
                  <a
                    v-if="!is_set_recommender"
                    :id="`${targetAhaTooltip}btn-search-recommender`"

                    tabindex="0"
                    class="client-action-img search-img"

                    @click="onRecommender"
                    @keydown.space="onRecommender"
                    @mouseover="showTooltipRecommender = true"
                    @mouseleave="showTooltipRecommender = false"
                  />
                </div>
                <aha-tooltip
                  v-if="!is_set_recommender && showTooltipRecommender"
                  :target="`${targetAhaTooltip}btn-search-recommender`"
                  placement="right"
                  boundary="note-tooltip"
                >
                  {{ $t('clients.tooltip-search-recommender') }}
                </aha-tooltip>
                <a
                  v-if="is_set_recommender"
                  :id="`${targetAhaTooltip}btn-delete-recommender`"
                  tabindex="0"
                  class="btn secondary small client-edit-x"

                  @click="deleteRecommender"
                  @keydown.space="deleteRecommender"
                  @mouseover="showTooltipRecommender = true"
                  @mouseleave="showTooltipRecommender = false"
                >X</a>
                <aha-tooltip
                  v-if="is_set_recommender && showTooltipRecommender"
                  :target="`${targetAhaTooltip}btn-delete-recommender`"

                  placement="right"
                  boundary="note-tooltip"
                >
                  {{ $t('clients.tooltip-delete-recommender') }}
                </aha-tooltip>
              </div>
            </dd>
          </dl>
        </div>
        <div
          v-if="field_setup.address"
          class="form-group"
        >
          <dl class="clearfix list">
            <dt>{{ $t('clients.postcode') }}</dt>
            <dd class="clearfix">
              <div class="input-box res-non">
                <input
                  v-model="client.postcode"

                  :disabled="!isAllowEditClient"
                  :maxlength="maxClientPostCodeLength"

                  type="text"
                  class="form-control w100p"
                >
              </div>
              <div class="last-box res-non">
                <a class="client-action-img">
                  <span
                    v-if="is_korea"
                    class="search-img"
                    @click="onFindPostCodeKR"
                  />
                </a>
              </div>
            </dd>
          </dl>
        </div>

        <template v-if="field_setup.address">
          <div class="form-group">
            <dl class="clearfix list">
              <dt>{{ $t('clients.address') }} 1</dt>
              <dd>
                <div>
                  <input
                    :id="addressId1"

                    v-model="client.address1"
                    :disabled="!isAllowEditClient"
                    :maxlength="maxClientAddressLength"

                    rows="1"
                    cols="30"
                    class="note client-address form-control noresize w100p"
                  >
                </div>
              </dd>
            </dl>
          </div>

          <div class="form-group">
            <dl class="clearfix list">
              <dt>{{ $t('clients.address') }} 2</dt>
              <dd>
                <div>
                  <input
                    :id="addressId2"

                    v-model="client.address2"
                    :disabled="!isAllowEditClient"
                    :maxlength="maxClientAddressLength"

                    rows="1"
                    cols="30"
                    class="note client-address form-control noresize w100p"
                  >
                </div>
              </dd>
            </dl>
          </div>
        </template>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('clients.notes') }}</dt>
            <dd>
              <textarea
                v-model="client.notes"

                cols="30"
                rows="10"
                class="note client-notes form-control noresize w100p"
                @input="handleNotesInput"
              />
            </dd>
          </dl>
        </div>

        <div class="form-group">
          <dl class="clearfix list">
            <dt>{{ $t('general.registered-date') }} <strong class="color-red">*</strong></dt>
            <dd>
              <div class="input-box registered-date-calendar">
                <aha-date-picker
                  :value="client.clientInputDate"
                  popover-direction="top"
                  @input="handleClientInputDateClick"
                />
              </div>
            </dd>
          </dl>
        </div>
      </form>
      <!-- EMD CLIENT FROM -->

      <!-- BEGIN ERRORS -->
      <error-box
        :errors="client_errors"
        class="error-message"
      />
      <!-- END ERRORS -->

      <!-- BEGIN FOOTER -->
      <footer-action-bar class="modal-footer btn-float">
        <btn-action-group
          :data="formOptions"
          @cancel="onCancel"
          @delete="onShowAlertConfirm"
          @confirm="onCheckBeforeConfirmAsync"
        />
      </footer-action-bar>
    <!-- END FOOTER -->
    </b-modal>

    <!-- modal action -->
    <field-setup
      v-if="field_setup_modal_visible"
      :field_setup="field_setup"
      @update-page-fields="updatePageFields"
    />

    <duplicated-clients
      v-if="dulicated_clients_modal_visible"
      :search_value="duplicated_search_value"
      :modal-id="duplicatedModalId"
    />

    <recommender
      v-if="recommender_modal_visible"
      :client_id="client_id"
      :contact-info-to-staff="contact_info_to_staff"
      :contact-info-to-manager="contact_info_to_manager"

      @add-recommender="addRecommender"
    />

    <member-number-setup
      v-if="member_number_setup_visible"
      :data="shop_info.environments.member_number_setup"
      @update-setup="updateMemberNumberSetup"
    />

    <find-postcode-kr
      v-if="is_korea && is_postcode_kr"
      @update-address="setPostCodeKR"
      @hidden="onHiddenPostCodeKR"
    />

    <aha-client-connect-retry-modal
      id="client-connect-retry-modal"
      :connecting-type="x_connecting_type"
      :visible="is_show_connect_retry_modal"

      @ok="onClickRetryConnect"
      @hide="toggleConnectRetryModal"
    />

    <alert-confirm
      :id="alert_id"
      :is-static="false"
      :data_alerts="data_alert"
      :label_no="alert_label_no"
      :label_yes="alert_label_yes"
      :yes-button-variant="alert_btn_color"

      @confirm="onAlertConfirm"
    />
  </div>
</template>
<script>
// Utilities
import cloneDeep from 'lodash/cloneDeep'
import { getDataDeviceInfo } from 'Modules/device/utils'
import {mapGetters, mapActions, mapMutations, mapState} from 'vuex'
import {
  guid,
  checkNull,
  autoSelectInput,
  checkNullAndEmpty,
  clientAddPrivacyLog,
  formatMobileAndPhoneNumber,
  getHideClientInfoPermission,
  convertDateToTimezone,
} from 'CommonHelpers'

import {
  getCurrentTimezoneTS,
  convertDateToTimeStamp,
} from 'DatetimeHelpers'
import moment from 'moment'
import { isPermissionGranted } from 'PermissionHelpers'

//Constant
import { options } from 'OptionsHelpers'
import { CLIENT_DATA_RULES } from 'SystemDataRules'
import { sales_options } from 'Options/sales-options'
import {CONNECT_CLIENT_TYPE, CLIENTS_ENUMS, FORM_ACTIONS, COUNTRY, PERMISSION_TYPE, BUSINESS_TYPE_CODE } from 'Constant'

//View model
import ClientViewModel from 'ViewModels/clients/client-view-model.js'

// Models
import Client from 'Models/client/client.js'

// API
import * as clientApi from 'Modules/api/client/client-api.js'

// Mixins
import StaffMixin from 'Mixins/staff-mixin'
import ClientActionMixin from 'Mixins/client-action-mixin'
import ClientCacheMixin from 'Modules/cache/mixins/client_cache'
import NoteLengthValidatorMixin from 'Mixins/note-length-validator-mixin'

// Components
import Alert from 'CommonComponents/alert/alert.vue'
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ErrorBox from 'CommonComponents/form/error-box/error-box.vue'
import AhaTooltip from 'CommonComponents/aha-tooltip/aha-tooltip.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import RadioGroup from 'CommonComponents/form/radio/radio-group/radio-group.vue'
import FindPostcodeKr from 'CommonComponents/find-postcode/find-postcode-kr.vue'
import AhaDatePicker from 'CommonComponents/aha-date-picker/aha-date-picker.vue'
import AhaInputNumber from 'CommonComponents/aha-input-number/aha-input-number.vue'
import FieldSetup from 'Components/clients/client-action/field-setup/field-setup.vue'
import Recommender from 'Components/clients/client-action/recommender/recommender.vue'
import FooterActionBar from 'Components/common/footer-action-bar/footer-action-bar.vue'
import BtnActionGroup from 'CommonComponents/button/btn-action-group/btn-action-group.vue'
import AhaInputMobileNumber from 'CommonComponents/aha-input-mobile-number/aha-input-mobile-number.vue'
import DuplicatedClients from 'Components/clients/client-action/duplicated-clients/duplicated-clients.vue'
import MemberNumberSetup from 'Components/clients/client-action/member-number-setup/member-number-setup.vue'
import AhaClientConnectRetryModal from 'Components/clients/aha-client-connect-retry-modal/aha-client-connect-retry-modal.vue'

export default {
  components: {
    Alert,
    ErrorBox,
    FieldSetup,
    RadioGroup,
    AhaTooltip,
    Recommender,
    AlertConfirm,
    AhaDatePicker,
    BtnActionGroup,
    FindPostcodeKr,
    AhaInputNumber,
    FooterActionBar,
    DuplicatedClients,
    MemberNumberSetup,
    AhaInputMobileNumber,
    AhaClientConnectRetryModal,
  },

  extends: ComponentBase,

  mixins: [
    StaffMixin,
    ClientCacheMixin,
    ClientActionMixin,
    NoteLengthValidatorMixin,
  ],

  props: {
    modal_id: {
      type:    String,
      default: 'action-client-modal',
    },

    forceHideDelete: {
      type:    Boolean,
      default: false,
    },

    hasUpdateClientNameOrMobile: {
      type:    Boolean,
      default: false,
    },

    visible: {
      type:    Boolean,
      default: false,
    },

    isFromSearchVisitor: {
      type:    Boolean,
      default: false,
    },
  },

  data(){
    return {
      // modal
      options,
      is_korea:       false,
      is_mobile:      false,
      is_postcode_kr: false,

      /**
       * @type { Client }
       */
      client: {},

      MIN_YEAR: 1900,
      MAX_AGE:  convertDateToTimezone(new Date()).getFullYear() - 1900,
      active:   null,
      syncing:  false,

      client_errors:        [],
      client_before_change: {},

      staff_select:                  [],
      client_group_select:           [],
      client_rating_select:          [],
      client_referral_source_select: [],

      recommender_modal_visible:       false,
      field_setup_modal_visible:       false,
      member_number_setup_visible:     false,
      dulicated_clients_modal_visible: false,

      duplicated_search_value: {},

      shop_info:                {},
      field_setup:              {},
      preferred_staff:          {},
      member_number_cache_data: 0,

      select_filter: {
        shop_id:     0,
        page_number: 1,
        page_size:   options.pagination.max,
        status:      options.good_status.active,
      },

      shop_id:   0,
      client_id: 0,

      allow_edit_client:                    sales_options.security_level_enum.master,
      allow_edit_client_registered_today:   sales_options.security_level_enum.master,
      allow_delete_client:                  sales_options.security_level_enum.master,
      allow_delete_client_registered_today: sales_options.security_level_enum.master,

      contact_info_to_staff:   options.clients_enums.contact_info_hiding_type.hideall,
      contact_info_to_manager: options.clients_enums.contact_info_hiding_type.hideall,

      check_original_data: false,

      checkFieldsValidation: {
        phoneValidation:      true,
        mobileValidation:     true,
        mobile2Validation:    true,
        postcodeValidation:   true,
        address1Validation:   true,
        address2Validation:   true,
        isRequiredBirthDd:    false,
        hasYearForBirthday:   false,
        isRequiredBirthMonth: false,
        isPetSalon:           false,
      },

      clients_setup: {},

      is_show_connect_retry_modal: false,

      original_member_type:        0,
      country:                     options.country.kr,
      original_member_field_setup: false,

      showTooltipRecommender: false,

      alerts:                   [],
      data_alert:               [],
      alert_label_no:           '',
      alert_btn_color:          '',
      alert_label_yes:          '',
      is_alert_action_delete:   true,
      isEditClientMobileNumber: false,
      isEditClientPhoneNumber:  false,
      initMobileNumber:         '',
      initPhoneNumber:          '',
    }
  },

  computed: {
    currentYear() { return convertDateToTimezone(new Date()).getFullYear() },

    ...mapGetters('client', {
      action_data: 'getClientAction',
    }),

    ...mapGetters('client_connect', {
      x_connecting_type:      'getConnectingType',
      x_connecting_source:    'getConnectingSource',
      x_is_connecting_client: 'getIsConnectingClient',
    }),

    ...mapState('_calendar/checkoutAction', [
      'booking',
    ]),

    ...mapState('_calendar/bookings', [
      'bookingNaver',
    ]),

    visitorInfo () {
      return this.bookingNaver?.extSystemBookingDescriptionBase?.externalSystemVisitorInfo || {}
    },

    isEditClient(){
      return this.action_data.action === options.form_actions.edit
    },

    isPetSalon() {
      return this.shop_data.business_type_code === BUSINESS_TYPE_CODE.PET_SALON
    },

    modalClass() {
      return ['action-client-modal', 'common-style']
    },

    modalTitle() {
      if(
        this.action_data.action === options.form_actions.add ||
        this.action_data.action === options.cid_enum.cid_client_action
      ) {
        return this.$t('clients.client-add')
      }

      if(this.action_data.action === options.form_actions.edit) {
        return this.$t('clients.client-edit')
      }

      return ''
    },

    is_set_recommender() {
      if (this.client.recommenderName) {
        return true
      }

      return false
    },

    alert_id() {
      const id = 'delete_client_alert_id'

      if(this.modal_id && this.modal_id.length > 0){
        return `${id}_of_${this.modal_id}`
      }

      return id
    },

    maxClientNumberLength() {
      return CLIENT_DATA_RULES.MAX_CLIENT_NUMBER_LENGTH
    },

    maxClientPhoneNumberLength() {
      return CLIENT_DATA_RULES.MAX_PHONE_NUMBER_LENGTH
    },

    maxClientNameLength() {
      return CLIENT_DATA_RULES.MAX_NAME_LENGTH
    },

    maxClientNoteLength() {
      return CLIENT_DATA_RULES.MAX_NOTES_LENGTH
    },

    maxClientPostCodeLength() {
      return CLIENT_DATA_RULES.MAX_POST_CODE_LENGTH
    },

    maxClientAddressLength() {
      return CLIENT_DATA_RULES.MAX_ADDRESS_LENGTH
    },

    targetAhaTooltip() {
      return `${this.modal_id}${this.client?.fields?.id}`
    },

    // New Code From Vu.Le
    isHiddenPrivateInformation() {
      if (this.action_data.action === options.form_actions.add) {
        return false
      }

      return getHideClientInfoPermission(this.contact_info_to_manager, this.contact_info_to_staff, this.action_data?.data?.registration_date)
    },

    isAllowEditClient() {
      // Allow edit form when adding client
      const isAddingForm = this.action_data.action === options.form_actions.add
      const isFromCIDForm = this.action_data.action === options.cid_enum.cid_client_action
      if (isAddingForm || isFromCIDForm) {
        return true
      }

      // Disabled if diffence shop
      if (this.client.shopId !== this.shop_id) {
        return false
      }

      if(this.client.registrationDate) {
        const now = convertDateToTimezone(new Date())
        const registrationDate = new Date(this.client.registrationDate)
        const isSameDay = moment(now).isSame(registrationDate, 'day')
        const environmentSettingChecking = isSameDay ? this.allow_edit_client_registered_today : this.allow_edit_client

        if (this.isStaffRole || this.isManagerRole) {
          const permissionType = this.isStaffRole
            ? PERMISSION_TYPE.STAFF
            : PERMISSION_TYPE.MANAGER

          return isPermissionGranted(permissionType, environmentSettingChecking)
        }

        return true
      }

      return true
    },

    isAllowDeleteClient() {
      // Force hide delete form props
      if (this.forceHideDelete) {
        return false
      }

      const isCurrentShop = this.client.shopId === this.shop_id
      const isEditingForm = this.action_data.action === options.form_actions.edit

      // Don't allow delete when adding or not of current shop
      if (!isEditingForm || !isCurrentShop) {
        return false
      }

      if(this.client.registrationDate) {
        const now = convertDateToTimezone(new Date())
        const registrationDate = new Date(this.client.registrationDate)
        const isSameDay = moment(now).isSame(registrationDate, 'day')
        const environmentSettingChecking = isSameDay ? this.allow_delete_client_registered_today : this.allow_delete_client

        if (this.isStaffRole || this.isManagerRole) {
          const permissionType = this.isStaffRole
            ? PERMISSION_TYPE.STAFF
            : PERMISSION_TYPE.MANAGER

          return isPermissionGranted(permissionType, environmentSettingChecking)
        }

        return true
      }

      return true
    },

    formOptions() {
      return {
        confirm: this.isAllowEditClient,
        delete:  this.isAllowDeleteClient,
      }
    },

    isDisableMobilePhoneNumber() {
      return this.isHiddenPrivateInformation || !this.isAllowEditClient
    },

    isShowEditMobilePhoneCheckbox() {
      return this.isHiddenPrivateInformation && this.isAllowEditClient
    },

    isDisabledClientNumber() {
      return this.client?.memberType === CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.NON_MEMBER || !this.isAllowEditClient
    },

    selectField() {
      return 'name'
    },

    addressId1() {
      return 'address1'
    },

    addressId2() {
      return 'address2'
    },

    isKrCountry() {
      return this.country === COUNTRY.KR
    },

    isVnCountry() {
      return this.country === COUNTRY.VN
    },

    duplicatedModalId() {
      return `duplicated-modal-${guid()}`
    },
  },

  created() {
    window.addEventListener('resize', this.onChangeWindowWidth)
    this.onChangeWindowWidth()
  },

  destroyed() {
    window.removeEventListener('resize', this.onChangeWindowWidth)
  },

  beforeMount() {
    // this.client = new ClientViewModel()
    this.client = new Client()
  },

  mounted() {
    this.is_korea = (() => {
      if(this.shop_data.country === options.country_code.kr) {
        return true
      }

      return false
    })()

    this.country = this.shop_data?.country

    this.select_filter.shop_id = this.shop_data?.shop_id
  },

  methods: {
    ...mapMutations('booking',[
      'updateBooking',
    ]),

    ...mapActions('booking', [
      'setBookingActionData',
    ]),

    ...mapMutations('client_connect', [
      'setConnectingClient',
    ]),

    ...mapActions('client_connect', [
      'connectClientToSale',
      'connectClientToBooking',
    ]),

    ...mapMutations('_calendar/bookings', [
      'setIsUnregisteredClientFromVisitor',
    ]),

    toInt(v) { const n = Number(v); return Number.isFinite(n) ? Math.trunc(n) : NaN },

    onYearsInput(val) {
      if (this.syncing || this.active !== 'years') return
      const age = this.toInt(val)
      if (!Number.isFinite(age)) return
      if (age <= 0) {
        this.syncing = true
        this.client.birthYear = 0
        this.syncing = false
        return
      }

      const y = this.currentYear - age
      this.syncing = true
      this.client.birthYear = y >= this.MIN_YEAR ? y : null
      this.client.birthMonth = 0
      this.client.birthDD = 0
      this.syncing = false
    },

    onBirthYearInput(val) {
      if (this.syncing || this.active !== 'birthYear') return
      const y = this.toInt(val)
      if (!Number.isFinite(y) || y < this.MIN_YEAR || y > this.currentYear) {
        this.syncing = true
        this.client.years = 0
        this.syncing = false
        return
      }

      const age = this.ageFromYMD(y, this.client.birthMonth ?? 1, this.client.birthDD ?? 1)
      this.syncing = true
      this.client.years = age
      this.syncing = false
    },

    onBirthMonthInput(val) {
      if(val === 0 ) val = 1
      if (this.syncing || this.active !== 'birthMonth') return
      const m = this.toInt(val)
      if (!Number.isFinite(m) || m < 1 || m > 12) return
      const y = this.toInt(this.client.birthYear)
      if (!Number.isFinite(y)) return

      const age = this.ageFromYMD(y, m, 1)
      this.syncing = true
      this.client.years = age
      this.syncing = false
    },

    onBirthDayInput(val) {
      if(val === 0 ) val = 1
      if (this.syncing || this.active !== 'birthDD') return
      const d = this.toInt(val)
      const y = this.toInt(this.client.birthYear)
      const m = this.toInt(this.client.birthMonth)
      if (!Number.isFinite(y) || !Number.isFinite(m)) return
      if (!Number.isFinite(d) || d < 1 || d > 31) return

      const age = this.ageFromYMD(y, m, d)
      this.syncing = true
      this.client.years = age
      this.syncing = false
    },

    onFindPostCodeKR() {
      this.is_postcode_kr = true
      this.$nextTick(()=> {
        this.showDialogById('modal-find-postcode-kr')
      })
    },
    onHiddenPostCodeKR(){
      this.is_postcode_kr = false
    },
    setPostCodeKR(postcode, address) {
      this.client.address2 = ''
      this.client.address1 = address
      this.client.postcode = postcode
    },

    hideModal() {
      this.hideDialogById(this.modal_id)
    },

    onCancel() {
      this.$emit('hidden', this.modal_id)
      this.isEditClientPhoneNumber = false
      this.isEditClientMobileNumber = false
      this.hideModal()
    },

    async onLoadForm() {
      this.client_errors = []
      this.client = new Client()

      // Get shop's setting timestamp then parsing to Datetime
      this.client.clientInputDateTimeTS = getCurrentTimezoneTS()
      await this.setClientData()
      this.client_before_change = this.client.clone()
      this.initMobileNumber = this.client.mobileNumber || ''
      this.initPhoneNumber = this.client.phoneNumber || ''

      // Set client data if Booking is Naver Proxy
      this.setClientDataWithNaverProxy()
    },

    async initClientSetup(){
      try {
        this.preLoader()
        this.clients_setup = await this.$clientCacheMixin_getClientShopInfo({
          shopId: this.shop_data?.shop_id,
        })

        if(this.isNullObject(this.clients_setup)) {
          this.showMissingClientsSetupAlert()
        } else {
          this.shop_info = this.clients_setup
          this.field_setup = this.clients_setup?.field_setups
          this.original_member_field_setup = this.field_setup?.member
          this.allow_edit_client = this.clients_setup?.environments?.allow_edit_client
          this.allow_edit_client_registered_today = this.clients_setup?.environments?.allow_edit_client_registered_today
          this.allow_delete_client = this.clients_setup?.environments?.allow_delete_client
          this.allow_delete_client_registered_today = this.clients_setup?.environments?.allow_delete_client_registered_today
          this.contact_info_to_staff = this.clients_setup?.environments?.contact_info_to_staff
          this.contact_info_to_manager = this.clients_setup?.environments?.contact_info_to_manager
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async setClientData() {
      try {
        if(this.action_data.action === options.cid_enum.cid_client_action) {
          this.client_id = 0

          if(this.action_data.is_mobile) {
            this.client.phoneNumber = null
            this.client.mobileNumber = this.action_data?.call_number
          } else {
            this.client.phoneNumber = this.action_data?.call_number
          }
        }

        if(this.action_data.action === options.form_actions.add) {
          const isClientVisitorAndUnregistered = this.booking.clientVisitor && !this.booking.clientVisitor?.clientId
          this.client_id = 0

          if (this.action_data?.client_name) {
            this.client.clientName = isClientVisitorAndUnregistered
              ? this.booking.clientVisitor.clientName
              : this.action_data?.client_name
          }

          if (this.action_data?.mobile_number) {
            this.client.mobileNumber = isClientVisitorAndUnregistered
              ? this.booking.clientVisitor.clientMobileNumber
              : this.action_data?.mobile_number
          }
        }

        if(this.action_data.action === options.form_actions.edit) {
          this.shop_id = this.shop_data?.shop_id
          this.client.assign(ClientViewModel.revert(this.action_data.data))
          this.client.postcode = ''
          this.client.address1 = ''
          this.client.address2 = ''
          this.client.phoneNumber = ''
          this.client.mobileNumber = ''
          this.client.mobileNumber2 = ''

          this.setBirthdayFields()
          this.client_id = this.client?.clientId
          if(this.client.birthYear) {
            this.client.years = this.ageFromYMD(this.client.birthYear, this.client.birthMonth, this.client.birthDD)
          }
        }

        this.original_member_type = this.client?.memberType

        await this.loadData()
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    ageFromYMD(year, month = 1, day = 1) {
      const y = Number(year)
      if (!Number.isFinite(y) || y <= 0) return null

      let m = month == null ? 1 : Math.trunc(month)
      let d = day == null ? 1 : Math.trunc(day)
      m = Math.min(12, Math.max(1, m))
      const daysInMonth = new Date(y, m, 0).getDate()
      d = Math.min(daysInMonth, Math.max(1, d))

      const today = convertDateToTimezone(new Date())
      let age = today.getFullYear() - y

      const hasBirthdayPassed =
        (today.getMonth() + 1 > m) || ((today.getMonth() + 1 === m) && (today.getDate() >= d))

      if (!hasBirthdayPassed) age -= 1
      return Math.max(0, age)
    },

    setClientDataWithNaverProxy() {
      if (this.isFromSearchVisitor && Object.keys(this.visitorInfo).length) {
        const { visitorName, visitorPhone } = this.visitorInfo
        this.client.clientName = visitorName

        // Condition #2766 : If visitorPhone starts with '010', enter it in the Mobile field;
        // otherwise, enter it in the Phone Number field.
        visitorPhone.startsWith('010')
          ? this.client.mobileNumber = visitorPhone
          : this.client.phoneNumber = visitorPhone
      }
    },

    setBirthdayFields() {
      if(this.client?.birthYear === 0) {
        this.client.birthYear = null
      }

      if(this.client?.birthMonth === 0) {
        this.client.birthMonth = null
      }

      if(this.client?.birthDD === 0) {
        this.client.birthDD = null
      }
    },

    async loadData() {
      const [activeStaffResult] = await Promise.all([
        this.getStaffsAsyncMixin(),
        this.initClientSetup(),
      ])

      if(activeStaffResult.is_ok) {
        this.preferred_staff = activeStaffResult.data.items
      } else {
        this._showDialogAlert(activeStaffResult.error_messages)
      }

      // select control
      const addCodes = (data, setup, option) => {
        if(setup){
          if(option === 'staff_select') {
            this[option] = [ { id: null, aliasname: this.$t('general.select') } ]
          } else {
            this[option] = [ { id: null, name: this.$t('general.select') } ]
          }

          for(let i in data){
            this[option].push(data[i])
          }
        }
      }

      if(this.shop_info.field_setups != undefined) {
        addCodes(this.preferred_staff, this.shop_info.field_setups.preferred_staff, 'staff_select')
        addCodes(this.shop_info.client_groups, this.shop_info.field_setups.client_group, 'client_group_select')
        addCodes(this.shop_info.client_ratings, this.shop_info.field_setups.client_rating, 'client_rating_select')
        addCodes(this.shop_info.referral_sources, this.shop_info.field_setups.referral_source, 'client_referral_source_select')

        if(this.shop_info.field_setups.member) {
          this.getMemberNumber()
        } else {
          this.notMemberClient()
        }
      }

      // Add Inactive Codes (if client has inactive codes)
      const addInActiveCodes = (data, id, name, option) => {

        if(data.find(x => x.id === id) == undefined && id != null && id !== 0) {
          if(option === 'staff_select') {
            this[option].push({ id: id, aliasname: name })
          }
          else {
            this[option].push({ id: id, name: name })
          }
        }
      }

      if(this.action_data.action === options.form_actions.edit) {
        addInActiveCodes(
          this.preferred_staff,
          this.action_data.data.preferred_staff_id,
          this.action_data.data.preferred_staff_name,
          'staff_select',
        )
        addInActiveCodes(
          this.shop_info.client_groups,
          this.action_data.data.client_group_id,
          this.action_data.data.client_group_name,
          'client_group_select',
        )
        addInActiveCodes(
          this.shop_info.client_ratings,
          this.action_data.data.client_rating_id,
          this.action_data.data.client_rating_name,
          'client_rating_select',
        )
        addInActiveCodes(
          this.shop_info.referral_sources,
          this.action_data.data.client_referral_source_id,
          this.action_data.data.client_referral_source_name,
          'client_referral_source_select',
        )

        this.client.postcode = this.action_data.data.postcode
        this.client.address1 = this.action_data.data.address1
        this.client.address2 = this.action_data.data.address2
        this.client.phoneNumber = this.action_data.data.phone_number
        this.client.mobileNumber = this.action_data.data.mobile_number
        this.client.mobileNumber2 = this.action_data.data.mobile_number2

        if (this.isHiddenPrivateInformation) {
          this.hideInfoByPermission()
        } else if (!this.isAllowEditClient) {
          this.formatClientPhoneNumber()
        }

        this.$nextTick(() => {
          this.onTextareaAutoHeight(this.addressId1)
          this.onTextareaAutoHeight(this.addressId2)
        })
      }
    },

    formatClientPhoneNumber(isHide = false) {
      this.client.phoneNumber = formatMobileAndPhoneNumber(this.client.phoneNumber, isHide)
      this.client.mobileNumber = formatMobileAndPhoneNumber(this.client.mobileNumber, isHide)
      this.client.mobileNumber2 = formatMobileAndPhoneNumber(this.client.mobileNumber2, isHide)
    },

    hideInfoByPermission() {
      this.formatClientPhoneNumber(this.isHiddenPrivateInformation)

      this.check_original_data = true
    },

    // get next member number
    async getMemberNumber() {
      this.$nextTick(async function() {
        try {
          if(!this.field_setup.member && !this.shop_info.field_setups.member) {
            return
          }

          this.client.memberNumber = ''

          const isEditAction = this.action_data.action === options.form_actions.edit

          if(isEditAction) {
            this.client.memberNumber = this.action_data.data.member_number

            const isNoChangeMemberType = this.client.memberType === this.action_data.data.member_type

            if(isNoChangeMemberType) {
              return
            }
          }

          const isClientMember = this.client.memberType === CLIENTS_ENUMS.CLIENT_MEMBER_TYPE.MEMBER
          const isAutoSetupClientNumber = this.shop_info.environments.member_number_setup === CLIENTS_ENUMS.MEMBER_NUMBER_SETUP_TYPE.AUTO

          if(!isClientMember) { // No tick No number
            this.client.memberNumber = ''
            return
          }

          if(!isAutoSetupClientNumber) { // Choose Client number setup is manual
            return
          }

          const response = await clientApi.getNextMemberNumber({ shopId: this.shop_data.shop_id })

          this.client.memberNumber = response.data?.result
        } catch (error) {
          this._showDialogAlert(error.message)
        }
      })
    },

    async onCheckBeforeConfirmAsync() {
      try {
        this.preLoader()

        const payload = {
          pageNumber:      1,
          shopId:          this.shop_data.shop_id,
          clientId:        this.client.clientId,
          pageSize:        options.pagination.max,
          searchValue:     this.client.clientName,
          searchValue2:    this.client.phoneNumber,
          searchCondition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME_AND_PHONE,
        }

        const response = await clientApi.getDuplicatedClientsByValue(payload)

        if(response?.data?.result?.items?.length > 0) {
          this.onShowAlertConfirm(false)
        } else {
          await this.onConfirm()
        }
      } catch (error) {
        if(error?.isApiError()) {
          this.client_errors = error.message
          return
        }

        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async onConfirm() {
      try {
        const isAddAction = this.action_data.action === options.form_actions.add
        const isCIDAction = this.action_data.action === options.cid_enum.cid_client_action

        if(isAddAction || isCIDAction) {
          this.client.shopId = this.shop_data.shop_id

          if(this.client?.mobileNumber === '') {
            this.client.mobileNumber = null
          }

          if(this.client?.memberNumber === '') {
            this.client.memberNumber = null
          }

          this.check_original_data = false

          await this.addClient()
        } else if (this.action_data.action === options.form_actions.edit) {
          await this.updateClient()
        }

        this.setIsUnregisteredClientFromVisitor(false)
      } catch (error) {
        this._showDialogAlert(error.message)
      }
    },

    async addClient() {
      try {
        const clientUpdated = this.$_clientActionMixin_cloneClient()

        if(this.check_original_data) {
          this.checkSameAsOriginalData(clientUpdated)
        }

        // validate
        this.setBirthdayFields()
        this.$_clientActionMixin_validateBirthDay()

        const validationOptions = { ...this.checkFieldsValidation }
        validationOptions.isRequiredBirthMonth = false
        validationOptions.isRequiredBirthDd = false

        if (this.isPetSalon) {
          if((clientUpdated.birthYear <= 0 || clientUpdated.birthYear === null) && clientUpdated.birthMonth > 0){
            validationOptions.isRequiredBirthDd = true
          }
          if(clientUpdated.birthDD > 0){
            validationOptions.isRequiredBirthMonth = true
          }
        } else {
          if (clientUpdated.birthYear > 0) {
            validationOptions.isRequiredBirthDd = true
            validationOptions.isRequiredBirthMonth = true
          }
          if (clientUpdated.birthMonth > 0) {
            validationOptions.isRequiredBirthDd = true
          }
          if (clientUpdated.birthDD > 0) {
            validationOptions.isRequiredBirthMonth = true
          }
        }

        this.client_errors = this.client.validate(validationOptions)

        if(this.client_errors?.length) {
          this.scrollToElement()
          return
        }

        if(this.isPetSalon && this.currentYear - clientUpdated.birthYear > 120){
          this._showDialogAlert(this.$t('clients.age-invalid'))
          return
        }

        await clientUpdated?.save?.()
        clientAddPrivacyLog(options.clients_enums.privacy_work_type.add_client, null, null)
        const clientData = new ClientViewModel()
        clientData.mapAllFieldFromApi(Client.revert(clientUpdated) || {})

        this.$emit('added-client-successfully', clientData?.fields || {})

        if (this.x_is_connecting_client) {
          this.setConnectingClient(clientData?.fields || {})
          this.connectClientToSourceAsync()
        }

        if(this.action_data.action === options.cid_enum.cid_client_action) {
          this.$emit('reload-page', clientData?.fields, true) // this is for CID receiving history (ture means updateClient for CID history)
        } else {
          if(this.hasUpdateClientNameOrMobile) {
            this.$emit('update-client-name-or-mobile', clientData?.fields, false)
          } else {
            this.$emit('reload-page', clientData?.fields)
          }
        }

        this.hideModal()
      } catch (error) {
        if(error?.isApiError()) {
          this.client_errors = error.message
          return
        }

        this._showDialogAlert(error.message)
      }
    },

    scrollToElement() {
      const modalRefs = this.$refs?.modalClient?.$refs
      if (!modalRefs?.body) return

      const { isMobileDevice } = getDataDeviceInfo()

      if(isMobileDevice) {
        setTimeout(() => {
          modalRefs.body.scrollTo({
            top:      modalRefs.body.scrollHeight,
            behavior: 'smooth',
          })
        }, 0)

      }
    },

    async updateClient() {
      try {
        const clientUpdated = this.$_clientActionMixin_cloneClient()

        if(this.check_original_data) {
          this.checkSameAsOriginalData(clientUpdated)
        }

        // validate
        this.setBirthdayFields()
        this.$_clientActionMixin_validateBirthDay()

        const validationOptions = { ...this.checkFieldsValidation }
        validationOptions.isRequiredBirthMonth = false
        validationOptions.isRequiredBirthDd = false

        if (this.isPetSalon) {
          if((clientUpdated.birthYear <= 0 || clientUpdated.birthYear === null) && clientUpdated.birthMonth > 0){
            validationOptions.isRequiredBirthDd = true
          }
          if(clientUpdated.birthDD > 0){
            validationOptions.isRequiredBirthMonth = true
          }
        } else {
          if (clientUpdated.birthYear > 0) {
            validationOptions.isRequiredBirthDd = true
            validationOptions.isRequiredBirthMonth = true
          }
          if (clientUpdated.birthMonth > 0) {
            validationOptions.isRequiredBirthDd = true
          }
          if (clientUpdated.birthDD > 0) {
            validationOptions.isRequiredBirthMonth = true
          }
        }

        this.client_errors = this.client.validate(validationOptions)

        if(this.client_errors?.length) {
          this.scrollToElement()
          return
        }

        if(this.isPetSalon && this.currentYear - clientUpdated.birthYear > 120){
          this._showDialogAlert(this.$t('clients.age-invalid'))
          return
        }

        await clientUpdated?.update?.()
        clientAddPrivacyLog(options.clients_enums.privacy_work_type.edit_client, null, null )

        const clientData = new ClientViewModel()
        clientData.mapAllFieldFromApi(Client.revert(clientUpdated) || {})
        this.$emit('updated-client-successfully', clientData?.fields || {})

        const isUpdateClientNameOrMobileOrMemberNumber =
                this.client_before_change?.clientName !== clientData?.fields?.client_name ||
                this.client_before_change?.mobileNumber !== clientData?.fields?.mobile_number ||
                this.client_before_change?.memberNumber !== clientData?.fields?.member_number

        if(this.action_data.action === options.cid_enum.cid_client_action) {
          this.$emit('reload-page', clientData?.fields, true) // this is for CID receiving history (ture means updateClient for CID history)
        } else {
          if(this.hasUpdateClientNameOrMobile) {
            this.$emit('update-client-name-or-mobile', clientData?.fields, isUpdateClientNameOrMobileOrMemberNumber)
          } else {
            this.$emit('reload-page', clientData?.fields)
          }
        }

        this.hideModal()
      } catch (error) {
        if(error?.isApiError()) {
          this.client_errors = error.message
          return
        }

        this._showDialogAlert(error.message)
      }
    },

    checkSameAsOriginalData(tmpClient) {
      if(this.client.mobileNumber !== this.action_data.data.mobile_number) {
        if(!this.isEditClientMobileNumber) {
          tmpClient.mobileNumber = this.action_data.data.mobile_number
          this.checkFieldsValidation.mobileValidation = false
        }
      }

      if(this.client.mobileNumber2 !== this.action_data.data.mobile_number2) {
        tmpClient.mobileNumber2 = this.action_data.data.mobile_number2
        this.checkFieldsValidation.mobile2Validation = false
      }

      if(this.client.phoneNumber !== this.action_data.data.phone_number) {
        if(!this.isEditClientPhoneNumber) {
          tmpClient.phoneNumber = this.action_data.data.phone_number
          this.checkFieldsValidation.phoneValidation = false
        }

      }
    },

    async onAlertConfirm() {
      try {
        this.preLoader()

        if(this.is_alert_action_delete) {
          if(this.client?.familyId > 0) {
            this._showDialogAlert(this.$t('clients.warn-you-can-not-delete-client-belong-to-a-family'))
            return
          }

          const payload = {
            shopId:       this.shop_data.shop_id,
            clientId:     this.client.clientId,
            country:      this.shop_data.country,
            sessionToken: this.x_user.session_token,
            shopLocation: this.shop_data.shop_location,
          }

          await clientApi.updateToDeletedClient(payload)

          clientAddPrivacyLog(options.clients_enums.privacy_work_type.delete_client, null, null )

          if(this.action_data.action === options.cid_enum.cid_client_action) {
            this.$emit('reload-page', {}, true) // this is for CID receiving history (ture means updateClient for CID history)
          } else {
            if(this.hasUpdateClientNameOrMobile) {
              this.$emit('update-client-name-or-mobile', {}, false)
            } else {
              this.$emit('reload-page', {})
            }
          }

          this.hideModal()
          this.$emit('deleted')
        } else { // Allow add duplicated ClientName + PhoneNumber client
          await this.onConfirm()
        }
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async updatePageFields(data) {
      this.field_setup_modal_visible = false
      this.shop_info.field_setups = data

      if(!this.original_member_field_setup && this.shop_info.field_setups.member){
        this.client.memberType = options.clients_enums.client_member_type.member
      }

      this.setClientData()

      if(
        !this.shop_info.field_setups.member ||
        this.original_member_type === options.clients_enums.client_member_type.non_member
      ) {
        this.notMemberClient()
      }
    },

    notMemberClient() {
      if(this.action_data.action === FORM_ACTIONS.ADD || this.action_data.action === options.cid_enum.cid_client_action) {
        this.client.memberType = options.clients_enums.client_member_type.non_member
        this.client.memberNumber = ''
      }
    },

    updateMemberNumberSetup(memberNumberSetup) {
      this.shop_info.environments.member_number_setup = memberNumberSetup
      this.getMemberNumber()
    },

    // Add Recommender name in recommender field
    addRecommender(row) {
      this.$set(this.client, 'recommenderId', row.clientId)
      this.$set(this.client, 'recommenderName', row.clientName)
    },

    deleteRecommender() {
      this.$set(this.client, 'recommenderId', null)
      this.$set(this.client, 'recommenderName', null)

      this.$nextTick(() => {
        this.showTooltipRecommender = false
      })
    },

    focusField() {
      this.$nextTick(function(){
        this.$refs.name.focus()
      })
    },

    async onMemberNumberSetup() {
      this.member_number_setup_visible = true

      await this.initClientSetup()

      this.$nextTick(function() {
        this.showDialogById('member-number-setup-modal')
      })
    },

    onDuplicatedClients(condition) {
      if(condition === CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME) {
        if(!checkNullAndEmpty(this.client?.clientName)) {
          this.duplicated_search_value = {
            search_value2:    null,
            client_id:        this.client?.clientId,
            search_value:     this.client?.clientName,
            search_condition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.NAME,
          }
        } else {
          this._showDialogAlert(this.$t('duplicated-clients.empty-name'))
          return
        }
      } else {
        if(
          !checkNullAndEmpty(this.client.mobileNumber) ||
          !checkNullAndEmpty(this.client.mobileNumber2)
        ) {
          this.duplicated_search_value = {
            client_id:        this.client?.clientId,
            search_value:     this.client?.mobileNumber,
            search_value2:    this.client?.mobileNumber2,
            search_condition: CLIENTS_ENUMS.DUPLICATED_CLIENT_SEARCH_TYPE_VALUES.MOBILE,
          }
        } else {
          this._showDialogAlert(this.$t('duplicated-clients.empty-mobile-number'))
          return
        }
      }

      this.dulicated_clients_modal_visible = true

      this.$nextTick(function() {
        this.showDialogById(this.duplicatedModalId)
      })
    },

    onRecommender() {
      this.recommender_modal_visible = true

      this.$nextTick(function(){
        this.showDialogById('search-recommender-modal')
      })
    },

    onFieldSetup() {
      this.field_setup_modal_visible = true

      this.$nextTick(function(){
        this.showDialogById('setup-field-modal')
      })
    },

    toggleConnectRetryModal() {
      this.is_show_connect_retry_modal = !this.is_show_connect_retry_modal
    },

    connectClientToSourceAsync() {
      if (this.x_connecting_type === CONNECT_CLIENT_TYPE.BOOKING) {
        this.onConnectClientToBooking()
      }

      if (this.x_connecting_type === CONNECT_CLIENT_TYPE.SALE) {
        this.onConnectClientToSale()
      }
    },

    async onConnectClientToBooking() {
      try {
        this.preLoader()

        const response = await this.connectClientToBooking()
        if (!response.is_ok) {
          this.onConnectClientToBookingFailed()
          return
        }
        this.$emit('connect-client-successfully')
        this.hideDialogById('booking-connect-client-action-modal')

        // update bookings to booking calendar
        for(let i in response.data.items){
          this.updateBooking(response.data.items[i])
        }

      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onConnectClientToBookingFailed() {
      // show modal connect again
      const failed_connected_booking = cloneDeep(this.x_connecting_source)
      const bookingAction = {
        action:  options.form_actions.edit,
        data:    failed_connected_booking,
        options: {
          booking_resource_setup_id: 0,
          booking_date:              failed_connected_booking.booking_date,
          start_time:                failed_connected_booking.booked_resources[0].start_time,
        },
      }
      this.setBookingActionData(bookingAction)
      this.showDialogById('booking-connect-client-action-modal')

      // show modal retry
      this.toggleConnectRetryModal()
    },

    async onConnectClientToSale() {
      try {
        this.preLoader()

        const response = await this.connectClientToSale()
        if (!response.is_ok) {
          this.onConnectClientToSaleFailed()
          return
        }

        this.hideDialogById('sales-connect-client-action-modal')

        // Update sales table ( sale-today.vue -> sales-table.vue )
        this.$emit('connected-client-sales', response.data)
      } catch(error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onConnectClientToSaleFailed() {
      // show modal connect again
      this.showDialogById('sales-connect-client-action-modal')

      // show modal retry
      this.toggleConnectRetryModal()
    },

    onClickRetryConnect() {
      this.connectClientToSourceAsync()
    },

    onChangeWindowWidth() {
      this.is_mobile = window.innerWidth < 767.98 ? true : false
    },

    onShowAlertConfirm(isDelete = true){
      if(isDelete) {
        this.data_alert = [this.$t('general.warning-delete')]
        this.alert_btn_color = 'red'
        this.alert_label_yes = this.$t('general.delete')
        this.alert_label_no = this.$t('general.cancel')
        this.is_alert_action_delete = true
      } else {
        this.data_alert = [this.$t('clients.duplicate-name-and-phone')]
        this.alert_btn_color = 'blue'
        this.alert_label_yes = this.$t('general.yes')
        this.alert_label_no = this.$t('general.no')
        this.is_alert_action_delete = false
      }

      this.showDialogById(this.alert_id)
    },

    onShown() {
      autoSelectInput(this, this.selectField)
    },

    onTextareaAutoHeight(id) {
      const text_area = document.getElementById(id)

      text_area.style.height = 'auto'

      const height = text_area?.scrollHeight

      text_area.style.height = `${height + 2.2}px`
    },

    handleClientInputDateClick(date) {
      if(checkNull(date)) {
        this.client.clientInputDateTimeTS = null
        return
      }
      this.client.clientInputDateTimeTS = convertDateToTimeStamp(date)
    },

    onEditClientMobileNumber() {
      if(this.isEditClientMobileNumber) {
        this.client.mobileNumber = ''
        this.$nextTick(() => {
          this.$refs.mobileNumber.$el.focus()
        })
      } else {
        this.client.mobileNumber = this.initMobileNumber
      }
    },

    onEditPhoneNumber() {
      if(this.isEditClientPhoneNumber) {
        this.client.phoneNumber = ''
        this.$nextTick(() => {
          this.$refs.phoneNumber.$el.focus()
        })
      } else {
        this.client.phoneNumber = this.initPhoneNumber
      }
    },

    handleNotesInput() {
      this.validateAndTruncateNote('client.notes', this.maxClientNoteLength)
    },
  },
}
</script>
<style lang="scss" scoped>
// Push client input date picker to the left side to avoid calendar is being cut out in mobile
::v-deep .aha-date-picker .popover-origin {
  @media (max-width: 768px) {
    margin-left: -1.25rem;
  }
}
</style>

<style lang="scss">
  @import './client-action.scss';
</style>

<style lang="scss">
  #client-connect-retry-modal___BV_modal_outer_ {
    z-index: 9999 !important;
  }
</style>
