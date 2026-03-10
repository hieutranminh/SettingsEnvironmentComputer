<template>
  <div class="text-my-message-modal">
    <b-modal
      :id="id"
      :modal-class="id"
      :title="$t('messages.add-my-message')"
      :no-close-on-backdrop="true"
      hide-footer
      size="ssm"
      static
      @show="onLoadForm()"
    >
      <form class="form-wrapper clearfix">
        <div class="form-group ">
          {{ $t('messages.my-message-info') }}
          <br>
          <br>
          <dl class="clearfix list">
            <dt>{{ $t('general.category') }}</dt>
            <dd>
              <select-control
                v-model="my_message_category_id"
                :options="my_message_category_select"
                :not-translate="true"
                text-field="text"
                value-field="value"
              />
            </dd>
          </dl>
        </div>
      </form>
      <div class="modal-footer">
        <btn-action-group
          :data="form_options"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { options } from '../../../helpers/options'
import component_base from '../../../components/common/component-base/component-base'
import MyMessageCategoryApi from '../../../api/messages/my-message-category-api'

import select_control from '../../../components/common/form/select/select-control/select-control2'
import btn_action_group from '../../../components/common/button/btn-action-group/btn-action-group'

export default {
  components: {
    'select-control':   select_control,
    'btn-action-group': btn_action_group,
  },
  extends: component_base,
  props:   {
    id: {
      type:    String,
      default: null,
    },
  },
  data () {
    return {
      options:                    options,
      my_message_category_select: [],
      form_options:               {
        delete: false,
      },
      my_message_category_id: 0,
    }
  },
  methods: {
    async onLoadForm(){
      await this.onLoadMyMessageCategories()
    },
    async onLoadMyMessageCategories() {
      let data_send = {
        shop_id:     this.shop_data.shop_id,
        status:      options.common_status.active,
        page_size:   options.pagination.max,
        page_number: 1,
      }

      let my_message_category_api = new MyMessageCategoryApi()
      this.preLoader()
      let result = await my_message_category_api.getMyMessageCategoriesAsync(data_send)
      this.preLoader(false)

      if(result.is_ok) {
        this.my_message_category_select = []
        result.data.items.forEach(e => {
          this.my_message_category_select.push({ text: e.category_name, value: e.id })
        })
        if(this.my_message_category_select.length > 0) this.my_message_category_id = this.my_message_category_select[0].value
        else {
          this.showAlert(new Array(this.$i18n.t('validate_messages.not-exist-my-message-category')))
          this.hideModal()
        }
      }
      else this.showAlert(result.error_messages)
    },
    onCancel(){
      this.$emit('cancel')
      this.hideModal()
    },
    onConfirm(){
      this.$emit('confirm', this.my_message_category_id)
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById(this.id)
    },
  },
}
</script>

<style lang="scss">
.text-my-message-modal {
  .custom-select {
    width: 95%;
  }
}
</style>
