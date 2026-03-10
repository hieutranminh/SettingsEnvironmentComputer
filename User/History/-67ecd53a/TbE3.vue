<template>
  <div class="contents ai-setup">
    <h2>{{ $t('ai-setup.title') }}</h2>

    <div class="table-box mb5">
      <view-table :data="table_data">
        <template
          slot="function_type"
          slot-scope="{ row }"
        >
          {{ getFunctionTypeText(row.function_type) }}
        </template>
        <template
          slot="ai_model"
          slot-scope="{ row }"
        >
          <b-form-select
            :value="row.ai_model"
            :options="AI_MODEL_OPTIONS"
            value-field="value"
            text-field="text"
            class="select-ai-model w200"
            @change="onChangeAIModel($event, row)"
          />
        </template>
        <template
          slot="prompt"
          slot-scope="{ row }"
        >
          <b-button
            class="btn1"
            @click="onActionEditPrompt(row)"
          >
            {{ $t('general.edit') }}
          </b-button>
        </template>
      </view-table>
    </div>

    <modal-edit-prompt
      :modal-id="modalEditPromptId"
      :prompt="selectedRow.prompt"
      @save="onSavePrompt"
    />

    <alert-confirm
      :id="alertConfirmChangePromptId"
      :data_alerts="[$t('ai-setup.message-confirm-change')]"
      :show_as_html="true"
      :label_yes="$t('general.confirm')"
      :label_no="$t('general.cancel')"
      @confirm="onSavePrompt"
    />
  </div>
</template>

<script>
import view_table from '../../components/common/view-table/view-table.vue'
import modal_edit_prompt from '../../components/solution/modal-edit-prompt.vue'
import alert_confirm from '../../components/common/alert/alert-confirm.vue'
import component_base from '../../components/common/component-base/component-base'
import AISetupApi from 'API/solutions/ai-setup-api'
import { FUNCTION_TYPE, AI_MODEL_OPTIONS } from '../../config/constant'

export default {
  components: {
    'view-table':        view_table,
    'modal-edit-prompt': modal_edit_prompt,
    'alert-confirm':     alert_confirm,
  },

  extends: component_base,

  data() {
    return {
      AI_MODEL_OPTIONS,

      table_data: {
        fields: [
          { field: 'function_type', label: 'ai-setup.label-function', tdClass: 'tal', expand: true },
          { field: 'ai_model', label: 'ai-setup.label-ai-model', expand: true },
          { field: 'prompt', label: 'ai-setup.label-prompt', expand: true },
        ],
        rows:       [],
        pagination: {},
        options:    {
          pagination: false,
        },
        style: 'type-top',
      },
      functionTypeOptions: [],
      aiModelOptions:      [],
      selectedRow:         {},

      modalEditPromptId:          'modal-edit-prompt-id',
      alertConfirmChangePromptId: 'alert-confirm-change-prompt-id',
    }
  },

  async created() {
    await this.loadTableData()
  },

  methods: {
    async loadTableData() {
      try {
        this.preLoader(true)

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.getAISetupListAsync()

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        this.table_data.rows = result.data.items
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },

    getFunctionTypeText(functionType) {
      const functionTypeMap = {
        [FUNCTION_TYPE.BOOK]:              this.$t('ai-setup.label-booking-assistant'),
        [FUNCTION_TYPE.BOOK_SERVICE_ITEM]: `- ${this.$t('ai-setup.label-service-and-booking-item')}`,
        [FUNCTION_TYPE.CRM]:               this.$t('ai-setup.label-crm-assistant'),
        [FUNCTION_TYPE.MESSAGE]:           this.$t('ai-setup.label-message-creator'),
        [FUNCTION_TYPE.REPORT]:            this.$t('ai-setup.label-report-analyzer'),
      }
      return functionTypeMap[functionType] || functionType
    },

    onActionEditPrompt(row) {
      this.selectedRow = {
        function_type: row.function_type,
        ai_model:      row.ai_model,
        prompt:        row.prompt,
      }
      this.$nextTick(() => {
        this.showDialogById(this.modalEditPromptId)
      })
    },

    async onChangeAIModel(value, row) {
      try {
        this.preLoader(true)

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.updateAISetupAsync({
          ai_model:      value,
          function_type: row.function_type,
          prompt:        row.prompt,
        })

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        await this.loadTableData()
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },

    async onSavePrompt(newPrompt) {
      try {
        this.preLoader(true)

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.updateAISetupAsync({
          function_type: this.selectedRow.function_type,
          ai_model:      this.selectedRow.ai_model,
          prompt:        newPrompt,
        })

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        await this.loadTableData()
      } catch (error) {
        this.showAlert([error.message])
      } finally {
        this.preLoader(false)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ai-setup.scss';
</style>
