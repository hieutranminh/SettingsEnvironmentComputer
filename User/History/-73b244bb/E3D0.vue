<template>
  <b-modal
    ref="modalAddMyMessage"
    :visible="visible"
    :title="$t('messages.add-my-message')"
    modal-class="modal-add-my-message"

    hide-footer
    size="ssm"
    no-close-on-esc
    no-close-on-backdrop
    @show="onShow"
    @hide="onHide"
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
              v-model="selectedCategoryId"
              :options="categoryOptions"
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
        :data="formOptions"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </div>
  </b-modal>
</template>

<script>
// Components
import ComponentBase from 'Components/common/component-base/component-base.vue'
import SelectControl from 'Components/common/form/select/select-control/select-control2.vue'
import BtnActionGroup from 'Components/common/button/btn-action-group/btn-action-group.vue'
// APIs
import MyMessageCategoryApi from 'API/messages/my-message-category-api'
import { ApiError } from 'HTTPHelpers'
// Constants
import { options } from 'OptionsHelpers'

export default {
  extends: ComponentBase,

  components: {
    SelectControl,
    BtnActionGroup,
  },

  props: {
    visible: {
      type:    Boolean,
      default: false,
    },
  },

  data() {
    return {
      formOptions: {
        delete: false,
      },
      categoryOptions:    [],
      selectedCategoryId: 0,
    }
  },

  methods: {
    async onShow() {
      await this.loadMyMessageCategories()
    },

    onHide() {
      this.$emit('cancel')
    },

    async loadMyMessageCategories() {
      const payload = {
        shop_id:     this.shop_data.shop_id,
        status:      options.common_status.active,
        page_size:   options.pagination.max,
        page_number: 1,
      }

      try {
        this.preLoader()
        const myMessageCategoryApi = new MyMessageCategoryApi()
        const result = await myMessageCategoryApi.getMyMessageCategoriesAsync(payload)

        if (!result.is_ok) {
          throw new ApiError(result.error_messages)
        }

        this.categoryOptions = result.data.items.map(item => ({
          text:  item.category_name,
          value: item.id,
        }))

        if (this.categoryOptions.length === 0) {
          this.$refs.modalAddMyMessage.hide()
          this._showDialogAlert(this.$t('validate_messages.not-exist-my-message-category'))
          return
        }

        this.selectedCategoryId = this.categoryOptions[0].value
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    onCancel() {
      this.$refs.modalAddMyMessage.hide()
    },

    onConfirm() {
      this.$emit('confirm', this.selectedCategoryId)
    },

    reset() {
      this.categoryOptions = []
      this.selectedCategoryId = 0
    },
  },
}
</script>

<style lang="scss">
.modal-add-my-message {
  .custom-select {
    width: 95%;
  }
  .form-group {
    .list {
      display: flex;
    }
  }
}
</style>
