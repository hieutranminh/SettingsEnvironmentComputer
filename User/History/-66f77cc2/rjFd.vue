<template>
  <div class="contents user-command-history">
    <h2>{{ $t('user-command-history.title') }}</h2>

    <div class="condition">
      <ul class="cf">
        <li>
          <span class="fw-bold">{{ $t('user-command-history.label-date-range') }}</span>
          <span>
            <v-date-picker
              v-model="fromDate"
              @input="onChangeFromDate"
            />
            ~
            <v-date-picker
              v-model="toDate"
              @input="onChangeToDate"
            />
          </span>
        </li>
        <li>
          <span class="fw-bold">{{ $t('user-command-history.label-function') }}</span>
          <span>
            <b-form-select
              v-model="filters.functionType"
              :options="functionTypeOptions"
              value-field="value"
              text-field="text"
            />
          </span>
        </li>
        <li>
          <span class="fw-bold">{{ $t('user-command-history.label-business-type') }}</span>
          <span>
            <multiselect
              id="businessType"
              v-model="businessType"
              :options="businessTypeOptions"
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
                v-if="businessType.length && isOpen !== undefined"
                slot="selection"
                slot-scope="{ isOpen }"
              >
                <span
                  v-if="businessType.length > 1"
                  class="selected tac"
                >
                  {{ businessType.length }} {{ $t('general.selected') }}
                </span>
                <span
                  v-else
                  class="selected tac"
                >
                  <span
                    v-for="item in businessType"
                    :key="item.index"
                  >
                    {{ item.text }}
                  </span>
                </span>
              </template>
            </multiselect>
          </span>
        </li>
        <li>
          <span class="fw-bold">{{ $t('user-command-history.label-subscriber-number') }}</span>
          <span>
            <input
              v-model="filters.subscriberNumber"
              type="number"
              autocomplete="nope"
              class="w70"
              @keyup.enter="onSearch"
            >
          </span>
        </li>
        <li>
          <span class="fw-bold">{{ $t('user-command-history.label-failure-code') }}</span>
          <span>
            <input
              v-model="filters.failureCode"
              type="text"
              autocomplete="nope"
              class="w70"
              @keyup.enter="onSearch"
            >
          </span>
        </li>

        <li class="no-margin ml">
          <button
            class="btn2"
            @click="onSearch"
          >
            {{ $t('general.search') }}
          </button>
        </li>
      </ul>
    </div>

    <div class="buttonbox cf por mb10">
      <span><div v-html="$t('user-command-history.label-total-record', { total: table_data.pagination.total_items })" /></span>
    </div>

    <div class="table-box mb5">
      <view-table
        :data="table_data"
        @change-page="onChangePage"
      >
        <template
          slot="registration_date"
          slot-scope="{ row }"
        >
          {{ formatDateCol(row.registration_date) }}
        </template>
        <template
          slot="business_type_code"
          slot-scope="{ row }"
        >
          {{ getBusinessTypeText(row.business_type_code) }}
        </template>
        <template
          slot="function_type"
          slot-scope="{ row }"
        >
          {{ getFunctionTypeText(row.function_type) }}
        </template>
        <template
          slot="result"
          slot-scope="{ row }"
        >
          <b-button
            class="btn1"
            @click="onActionResult(row.result)"
          >
            {{ $t('general.view') }}
          </b-button>
        </template>
      </view-table>
    </div>
  </div>
</template>

<script>
import DatePicker from '../../components/common/datepicker/datepicker'
import multiselect from 'vue-multiselect'
import view_table from '../../components/common/view-table/view-table.vue'
import component_base from '../../components/common/component-base/component-base'
import { FUNCTION_TYPE } from '../../config/constant'
import { options } from '../../helpers/options'
import { convertDateToTimezone, convertDateFromTimezoneToTimestamp } from '../../helpers/common'
import SolutionsDropdwonListApi from 'API/solutions/dropdown-list-api'
import UserCommandHistoryApi from 'API/solutions/user-command-history-api'
import {
  formatDate,
  convertDateFromUtcToTimezone,
} from 'CommonHelpers'
export default {
  components: {
    multiselect,
    'view-table':    view_table,
    'v-date-picker': DatePicker,
  },

  extends: component_base,

  data() {
    return {
      fromDate:             convertDateToTimezone(new Date()),
      toDate:               convertDateToTimezone(new Date()),
      businessType:         [{ text: this.$t('general.all-select'), value: options.admins_enums.all }],
      businessTypeResponse: [],
      filters:              {
        pageNumber:       1,
        pageSize:         options.pagination.default,
        fromDateTS:       0,
        toDateTS:         0,
        functionType:     -1,
        businessTypeCode: '',
        failureCode:      '',
        subscriberNumber: '',
      },
      table_data: {
        fields: [
          { field: 'registration_date', label: 'user-command-history.label-date', width: '8%', expand: true },
          { field: 'subscriber_number', label: 'user-command-history.label-subscriber-number', width: '8%' },
          { field: 'subscriber_name', label: 'user-command-history.label-subscriber-name', width: '8%' },
          { field: 'business_type_code', label: 'user-command-history.label-business-type', width: '8%', expand: true },
          { field: 'function_type', label: 'user-command-history.label-function', width: '8%', expand: true },
          { field: 'command', label: 'user-command-history.label-command', width: '44%', tdClass: 'tal' },
          { field: 'failure_code', label: 'user-command-history.label-failure-code', width: '8%' },
          { field: 'result', label: 'user-command-history.label-result', width: '8%', expand: true },
        ],
        rows:       [],
        pagination: {
          total_items: 0,
          total_pages: 1,
          page_size:   options.pagination.default,
          page_number: 1,
        },
        options: {
          pagination: true,
        },
        style: 'type-top',
      },
    }
  },

  async created() {
    this.filters.fromDateTS = convertDateFromTimezoneToTimestamp(this.fromDate)
    this.filters.toDateTS = convertDateFromTimezoneToTimestamp(this.toDate)

    await this.onLoadSelectBusinessType()
    await this.loadTableData()
  },

  computed: {
    functionTypeOptions() {
      return [
        { value: FUNCTION_TYPE.ALL, text: this.$t('general.all-select') },
        { value: FUNCTION_TYPE.BOOK, text: this.$t('user-command-history.label-option-book') },
        { value: FUNCTION_TYPE.CRM, text: this.$t('user-command-history.label-option-crm') },
        { value: FUNCTION_TYPE.MESSAGE, text: this.$t('user-command-history.label-option-message') },
        { value: FUNCTION_TYPE.REPORT, text: this.$t('user-command-history.label-option-report') },
      ]
    },

    businessTypeOptions() {
      const defaultOptions = [
        { text: this.$t('general.select-info'), $isDisabled: true },
        { text: this.$t('general.all-select'), value: options.admins_enums.all },
      ]

      return [
        ...defaultOptions,
        ...this.businessTypeResponse.map(item => ({
          value: item.id,
          text:  item.name,
        })),
      ]
    },
  },

  methods: {
    async onSearch() {
      this.filters.pageNumber = 1
      await this.loadTableData()
    },

    async loadTableData() {
      try {
        this.preLoader(true)

        const userCommandHistoryApi = new UserCommandHistoryApi()
        const result = await userCommandHistoryApi.getUserCommandHistoryListAsync(this.filters)

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(
          this.table_data.pagination.total_items / this.table_data.pagination.page_size,
        )
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },

    onChangePage(page_num) {
      this.filters.pageNumber = page_num
      this.loadTableData()
    },

    onChangeFromDate() {
      this.filters.fromDateTS = convertDateFromTimezoneToTimestamp(this.fromDate)
    },

    onChangeToDate() {
      this.filters.toDateTS = convertDateFromTimezoneToTimestamp(this.toDate)
    },

    getFunctionTypeText(functionType) {
      const option = this.functionTypeOptions.find(opt => opt.value === functionType)
      return option ? option.text : functionType
    },

    getBusinessTypeText(businessTypeCode) {
      if (!businessTypeCode) {
        return this.$t('general.all-select')
      }
      const businessType = this.businessTypeResponse.find(item => item.id === businessTypeCode)
      return businessType ? businessType.name : businessTypeCode
    },

    updateBusinessTypeCode() {
      if (!this.businessType || this.businessType.length === 0) {
        this.filters.businessTypeCode = ''
        return
      }

      const hasAll = this.businessType.some(item => item.value === options.admins_enums.all)
      if (hasAll) {
        this.filters.businessTypeCode = ''
        return
      }

      const codes = this.businessType
        .map(item => item.value)
        .filter(value => value !== options.admins_enums.all)
      this.filters.businessTypeCode = codes.length > 0 ? codes.join(',') : ''
    },

    onSelectMultiSelect(option) {
      if (option.value === options.admins_enums.all) {
        this.businessType.splice(0, this.businessType.length)
      } else {
        const allOptionIndex = this.businessType.findIndex(x => x.value === options.admins_enums.all)
        if (allOptionIndex !== -1) {
          this.businessType.splice(allOptionIndex, 1)
        }
      }
      this.updateBusinessTypeCode()
    },

    onInputMultiSelect(opts) {
      if (opts.length === 0) {
        opts.push({ text: this.$i18n.t('general.all-select'), value: options.admins_enums.all })
      }
      this.updateBusinessTypeCode()
    },

    async onLoadSelectBusinessType() {
      try {
        this.preLoader(true)

        const payload = {
          item_types:   [ options.dropdown_list_type.business_type ],
          country_code: this.shop_data.country,
          solution_id:  this.shop_data.solution_id,
        }

        const dropdownListApi = new SolutionsDropdwonListApi()
        const result = await dropdownListApi.getDropdownListAsync(payload)

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        this.businessTypeResponse = result.data.items[0].items
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },

    formatDateCol(date){
      return formatDate(convertDateFromUtcToTimezone(date, this.shop_data.timezone), this.shop_data.format_date + ' HH:mm:ss')
    },
  },
}
</script>

<style lang="scss">
@import './user-command-history.scss';
</style>
