<template>
  <div class="contents ai-setup">
    <h2>{{ $t('ai-setup.title') }}</h2>

    <div class="table-box mb5">
      <view-table
        :key="tableKey"
        :data="table_data"
      >
        <template
          slot="functionType"
          slot-scope="{ row }"
        >
          {{ getFunctionTypeText(row.functionType) }}
        </template>
        <template
          slot="aiModel"
          slot-scope="{ row }"
        >
          <b-form-select
            :value="row.aiModel"
            :options="aiModelOptions"
            value-field="value"
            text-field="text"
            class="select-ai-model w200"
            @change="onChangeAIModelConfirm($event, row)"
          />
        </template>
        <template
          slot="promptKO"
          slot-scope="{ row }"
        >
          <b-button
            class="btn1"
            @click="onActionEditPrompt(row, 'KO')"
          >
            {{ $t('general.edit') }}
          </b-button>
        </template>
        <template
          slot="promptEN"
          slot-scope="{ row }"
        >
          <b-button
            class="btn1"
            @click="onActionEditPrompt(row, 'EN')"
          >
            {{ $t('general.edit') }}
          </b-button>
        </template>
      </view-table>
    </div>

    <modal-edit-prompt
      :modal-id="modalEditPromptId"
      :prompt="selectedRow.prompt"
      :prompt-type="selectedRow.promptType"
      @save="onSavePrompt"
    />

    <alert-confirm
      :id="alertConfirmChangeAIModelId"
      :data_alerts="[$t('ai-setup.message-confirm-change')]"
      :show_as_html="true"
      :label_yes="$t('general.confirm')"
      :label_no="$t('general.cancel')"
      @confirm="onChangeAIModel"
      @cancel="onCancelChangeAIModel"
    />
  </div>
</template>

<script>
import view_table from '../../components/common/view-table/view-table.vue'
import modal_edit_prompt from '../../components/solution/modal-edit-prompt.vue'
import alert_confirm from '../../components/common/alert/alert-confirm.vue'
import component_base from '../../components/common/component-base/component-base'
import AISetupApi from 'API/solutions/ai-setup-api'
import { FUNCTION_TYPE } from '../../config/constant'

export default {
  components: {
    'view-table':        view_table,
    'modal-edit-prompt': modal_edit_prompt,
    'alert-confirm':     alert_confirm,
  },

  extends: component_base,

  data() {
    return {
      table_data: {
        fields: [
          { field: 'functionType', label: 'ai-setup.label-function', tdClass: 'tal', expand: true },
          { field: 'aiModel', label: 'ai-setup.label-ai-model', expand: true },
          { field: 'promptKO', label: 'ai-setup.label-prompt-ko', expand: true },
          { field: 'promptEN', label: 'ai-setup.label-prompt-en', expand: true },
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
      tableKey:            0,

      modalEditPromptId:           'modal-edit-prompt-id',
      alertConfirmChangeAIModelId: 'alert-confirm-change-ai-model-id',
    }
  },

  async created() {
    await this.loadModelsData()
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

    async loadModelsData() {
      try {
        this.preLoader(true)

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.getAISetupModels()

        if (!result.is_ok) {
          this.showAlert(result.error_messages)
          return
        }

        // Map data from API to options format
        this.aiModelOptions = result.data.items.map(item => ({
          value: item.modelId,
          text:  item.model,
        }))
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

    onActionEditPrompt(row, promptType) {
      this.selectedRow = {
        functionType: row.functionType,
        aiModel:      row.aiModel,
        promptKO:     row.promptKO,
        promptEN:     row.promptEN,
        prompt:       promptType === 'KO' ? row.promptKO : row.promptEN,
        promptType:   promptType,
      }
      this.$nextTick(() => {
        this.showDialogById(this.modalEditPromptId)
      })
    },

    onChangeAIModelConfirm(value, row) {
      this.selectedRow = {
        functionType: row.functionType,
        aiModel:      value,
        promptKO:     row.promptKO,
        promptEN:     row.promptEN,
      }
      this.$nextTick(() => {
        this.showDialogById(this.alertConfirmChangeAIModelId)
      })
    },

    async onCancelChangeAIModel() {
      this.tableKey += 1
    },

    async onChangeAIModel() {
      try {
        this.preLoader(true)

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.updateAISetupAsync({
          functionType: this.selectedRow.functionType,
          aiModel:      this.selectedRow.aiModel,
          promptKO:     this.selectedRow.promptKO,
          promptEN:     this.selectedRow.promptEN,
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

        const promptKO = this.selectedRow.promptType === 'KO' ? newPrompt : this.selectedRow.promptKO
        const promptEN = this.selectedRow.promptType === 'EN' ? newPrompt : this.selectedRow.promptEN

        const aiSetupApi = new AISetupApi()
        const result = await aiSetupApi.updateAISetupAsync({
          functionType: this.selectedRow.functionType,
          aiModel:      this.selectedRow.aiModel,
          promptKO:     promptKO,
          promptEN:     promptEN,
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
