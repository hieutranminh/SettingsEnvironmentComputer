<template>
  <div class="text-my-message-modal">
    <b-modal
      :id="id"
      :modal-class="id"
      :title="$t('messages.add-my-message')"
      :no-close-on-backdrop="true"
      hide-footer
      size="ssm"
      @show="onLoadForm"
    >
      <form class="form-wrapper clearfix">
        <div class="form-group">
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
import ComponentBase from '../../../components/common/component-base/component-base'
import MyMessageCategoryApi from '../../../api/messages/my-message-category-api'
import SelectControl from '../../../components/common/form/select/select-control/select-control2'
import BtnActionGroup from '../../../components/common/button/btn-action-group/btn-action-group'

export default {
  components: {
    SelectControl,
    BtnActionGroup,
  },
  extends: ComponentBase,
  props:   {
    id: {
      type:     String,
      required: true,
    },
  },
  data() {
    return {
      options,
      my_message_category_select: [],
      my_message_category_id:     0,
      form_options:               { delete: false },
    }
  },
  methods: {
    async onLoadForm() {
      console.log('onLoadForm')
      await this.loadMyMessageCategories()
    },

    async loadMyMessageCategories() {
      const data_send = {
        shop_id:     this.shop_data.shop_id,
        status:      options.common_status.active,
        page_size:   options.pagination.max,
        page_number: 1,
      }

      const my_message_category_api = new MyMessageCategoryApi()
      this.preLoader()
      const result = await my_message_category_api.getMyMessageCategoriesAsync(data_send)
      this.preLoader(false)

      if (!result.is_ok) {
        this.showAlert(result.error_messages)
        return
      }

      this.my_message_category_select = result.data.items.map(item => ({
        text:  item.category_name,
        value: item.id,
      }))

      if (this.my_message_category_select.length > 0) {
        this.my_message_category_id = this.my_message_category_select[0].value
      } else {
        this.showAlert([this.$i18n.t('validate_messages.not-exist-my-message-category')])
        this.hideModal()
      }
    },

    onCancel() {
      this.$emit('cancel')
      this.hideModal()
    },

    onConfirm() {
      this.$emit('confirm', this.my_message_category_id)
      this.hideModal()
    },

    hideModal() {
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
