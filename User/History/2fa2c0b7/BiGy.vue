<template>
  <div class="contents join-send">
    <h2>{{ $t('join-send.title') }}</h2>
    <div class="condition">
      <ul class="cf">
        <li>
          <span class="fw-bold mr10">{{ $t('join-send.period') }}</span>
          <span>
            <v-date-picker v-model="target_date_from" />
            ~
            <v-date-picker v-model="target_date_to" />
          </span>
        </li>
        <li>
          <span class="fw-bold mr10">{{ $t('join-send.subscriber-number') }}</span>
          <input-number
            v-model="table_filter.shop_id"
            class="w40p"
            @keyup.native.enter="onSearch"
          />
          <common-btn
            :data="{ label: 'admin-sales.select-subscriber' }"
            @click-action="onSearchShop"
          />
        </li>
        <li>
          [Top]
          <input-number
            v-model="table_filter.top_size"
            class="w24p"
            @keyup.native.enter="onSearch"
          />
          {{ $t('join-send.show-items') }}
          &nbsp;&nbsp;&nbsp;
          <button
            class="btn2"
            @click="onSearch"
          >
            {{ $t('general.search') }}
          </button>
        </li>
      </ul>
    </div>
    <div class="table-box mb5">
      <table class="type-top">
        <thead>
          <tr>
            <td class="w20p" />
            <td class="w20p">
              {{ $t('join-send.total') }}
            </td>
            <td class="w12p">
              {{ $t('join-send.all') }}
            </td>
            <td class="w12p">
              SMS
            </td>
            <td class="w12p">
              LMS
            </td>
            <td class="w12p">
              MMS
            </td>
            <td class="w12p">
              KAO
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            <td>{{ table_data.sum.total_items }}</td>
            <td>{{ table_data.sum.count_total }}</td>
            <td>{{ table_data.sum.count_sms }}</td>
            <td>{{ table_data.sum.count_lms }}</td>
            <td>{{ table_data.sum.count_mms }}</td>
            <td>{{ table_data.sum.count_kao }}</td>
          </tr>
        </tbody>
      </table>
      <br>
      <table class="type-top">
        <thead>
          <tr>
            <td class="w20p">
              {{ $t('join-send.subscriber-number') }}
            </td>
            <td class="w20p">
              {{ $t('join-send.subscriber-name') }}
            </td>
            <td class="w12p">
              {{ $t('join-send.all') }}
            </td>
            <td class="w12p">
              SMS
            </td>
            <td class="w12p">
              LMS
            </td>
            <td class="w12p">
              MMS
            </td>
            <td class="w12p">
              KAO
            </td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in table_data.rows"
            :key="index"
          >
            <td>{{ row.shop_id }}</td>
            <td>{{ row.shop_name }}</td>
            <td>{{ row.count_total }}</td>
            <td>{{ row.count_sms }}</td>
            <td>{{ row.count_lms }}</td>
            <td>{{ row.count_mms }}</td>
            <td>{{ row.count_kao }}</td>
          </tr>
          <tr v-if="table_data.rows.length == 0">
            <td colspan="6">
              {{ $t('general.table-empty') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <shop-search
      v-if="is_show_shop_search"
      @hidden="onHiddenShopSearch"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { options } from '../../helpers/options'
import component_base from '../../components/common/component-base/component-base'
import shop_search from '../../components/shop/shop-search'
import common_btn from '../../components/common/button/common-btn/common-btn'
import DatePicker from '../../components/common/datepicker/datepicker'
import select_control from '../../components/common/form/select/select-control'

import ReportsApi from '../../api/messages/reports-api'
import ShopApi from '../../api/shops/shop-api'

import { convertDateToTimezone
  , convertDateFromTimezoneToTimestamp } from '../../helpers/common'
import input_number from '../../components/common/form/input/input-number/input-number'

export default {
  components: {
    'select-control': select_control,
    'common-btn':     common_btn,
    'v-date-picker':  DatePicker,
    'shop-search':    shop_search,
    'input-number':   input_number,

  },
  extends: component_base,
  data() {
    return {
      modal_id: 'shop-search-modal',

      options,
      table_data: {
        rows: [],
        sum:  {},
      },
      table_filter: {
        country_code:        null,
        target_date_from_ts: 0,
        target_date_to_ts:   0,
        shop_id:             null,
        top_size:            100,
      },

      target_date_from: null,
      target_date_to:   null,

      is_show_shop_search: false,
    }
  },
  async mounted(){
    await this.onLoadFormAsync()
    await this.loadTableDataAsync()
  },
  methods: {
    async onLoadFormAsync(){
      this.table_filter.country_code = this.shop_data.country

      let today = convertDateToTimezone(new Date())
      this.target_date_from = moment(today).add(-7, 'd').toDate()
      this.target_date_to = today
    },
    async loadTableDataAsync() {
      this.table_filter.target_date_from_ts = convertDateFromTimezoneToTimestamp(this.target_date_from)
      this.table_filter.target_date_to_ts = convertDateFromTimezoneToTimestamp(this.target_date_to)

      // Table Data
      let reports_api = new ReportsApi()
      this.preLoader()
      let result = await reports_api.getReportMessagesByShopsAsync(this.table_filter)
      this.preLoader(false)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        this.table_data.sum = result.data.sum

        // Set ShopName
        if(this.table_data.rows.length > 0){
          let shop_api = new ShopApi()
          let shop_ids = _.map(this.table_data.rows, 'shop_id')
          this.preLoader()
          let shop_name_result = await shop_api.getShopNames(shop_ids)
          this.preLoader(false)
          if(shop_name_result.is_ok){
            shop_name_result.data.items.forEach(e => {
              this.$set(this.table_data.rows.find(x => x.shop_id == e.shop_id), 'shop_name', e.shop_name)
            })
          }
          else this.showAlert(shop_name_result.error_messages)
        }
      }
      else this.showAlert(result.error_messages)
    },
    onSearchShop(){
      this.popShopSearch()
    },
    popShopSearch(){
      this.is_show_shop_search = true
      this.$nextTick(() => {
        this.showDialogById(this.modal_id)
      })
    },
    async onHiddenShopSearch(data){
      this.is_show_shop_search = false
      if (!(data.shop_id > 0)) return
      this.table_filter.shop_id = data.shop_id
      await this.loadTableDataAsync()
    },
    onSearch(){
      let from_ts = convertDateFromTimezoneToTimestamp(this.target_date_from)
      let to_ts = convertDateFromTimezoneToTimestamp(this.target_date_to)

      if ((to_ts - from_ts) > 86400 * 31)
        this.showAlert(new Array(this.$i18n.t('join-send.date-check')))
      else this.loadTableDataAsync()
    },
  },
}
</script>

<style lang="scss">
.join-send {
  .w12p {
    width: 12% !important;
  }
  .w20p {
    width: 20% !important
  }
  .w24p {
    width: 24% !important
  }
  .w40p {
    width: 40% !important
  }
}
</style>
