<!-- Fix eslint Bug for spacings + css pre, pre-line after upgrade Node v20.18.1 : https://gitlab.com/ahasoft-leaders1/ahaplus-shop/-/issues/67 -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<!-- eslint-disable vue/multiline-html-element-content-newline -->
<template>
  <main class="app-content">
    <section
      :class="{'spacing-content': !isKorean}"
      class="contents-style consent-action"
    >
      <!-- TITLE -->
      <article class="consent-action__title">
        <h3>{{ title }}</h3>
      </article>

      <!-- FORM -->
      <div class="consent-action__form">
        <div class="consent-action__form-wrapper">
          <!-- Consent Form Title -->
          <div class="consent-action__form-group">
            <label class="consent-action__form-label required">{{ $t('consent.consent-form-title') }}</label>

            <b-form-input
              v-model="consentForm.title"
              :maxlength="CONSENT_INPUT.MAX_LENGTH_TITLE"
              type="text"
            />
          </div>

          <!-- Select Additional Client Information -->
          <div class="consent-action__form-group">
            <label class="consent-action__form-label">
              {{ $t('consent.select-additional-client-information') }}
              <span class="consent-action__note">{{ $t('consent.select-additional-client-information-note') }}</span>
            </label>

            <div class="consent-action__form-checkbox">
              <b-form-checkbox
                v-model="isClientNameShown"
                @change="isClientNameShown = DEFAULT_CHECKBOX"
              >{{ $t('clients.client-name') }}</b-form-checkbox>
              <b-form-checkbox
                v-model="isClientMobileShown"
                @change="isClientMobileShown = DEFAULT_CHECKBOX"
              >{{ $t('clients.mobile') }}</b-form-checkbox>
              <b-form-checkbox v-model="consentForm.isClientNumberShown">{{ $t('clients.client-number') }}</b-form-checkbox>
              <b-form-checkbox v-model="consentForm.isClientRatingShown">{{ $t('clients.client-rating') }}</b-form-checkbox>
              <b-form-checkbox v-model="consentForm.isClientGroupShown">{{ $t('clients.client-group') }}</b-form-checkbox>
              <b-form-checkbox v-model="consentForm.isClientBirthdayShown">{{ $t('clients.birthday') }}</b-form-checkbox>
              <b-form-checkbox v-model="consentForm.isClientAddressShown">{{ $t('clients.address') }}</b-form-checkbox>
            </div>
          </div>

          <!-- Button actions -->
          <div class="consent-action__btn-add">
            <aha-button
              variant="blue"
              class="btn-default consent-action__btn-preview"
              @click="isShowConsentFormPreview = true"
            >
              {{ $t('consent.preview') }}
            </aha-button>

            <aha-button
              variant="blue"
              @click="handleAddQuestions(CONSENT_TARGET_TYPE.STORE)"
            >
              {{ $t('consent.add-store-inputs') }}
            </aha-button>

            <aha-button
              variant="blue"
              @click="handleAddQuestions(CONSENT_TARGET_TYPE.CLIENT)"
            >
              {{ $t('consent.add-client-questions') }}
            </aha-button>

            <aha-button
              variant="blue"
              @click="handleAddContents"
            >
              {{ $t('consent.add-contents') }}
            </aha-button>
          </div>

          <!-- Contents & Client Questions & Store Inputs -->
          <div class="consent-action__form-supplements">
            <template v-for="(consentArea, indexArea) in consentForm.consentSupplements">
              <!-- Contents -->
              <div
                v-if="!consentArea.supplementType"
                :key="indexArea"
                :class="checkLineGroup(indexArea)"
                class="consent-action__form-group"
              >
                <div class="consent-action__form-label">
                  {{ $t('consent.content') }}
                  <span class="consent-action__note">{{ $t('consent.contents-note') }}</span>

                  <!-- Order & Delete -->
                  <consent-action-area
                    :index-area="indexArea"
                    :length-area="consentForm.consentSupplements.length"
                    @on-change-order="handleOnChangeOrder($event, indexArea)"
                    @on-delete-area="handleOnDeleteArea(indexArea)"
                  />
                </div>

                <b-form-textarea
                  v-model="consentArea.supplementText"
                  :rows="CONSENT_INPUT.MAX_ROW_TEXTAREA"
                  :maxlength="CONSENT_INPUT.MAX_LENGTH_CONTENT"
                  @input="handleContentInput($event, indexArea)"
                />
                <pre>length default : {{ consentArea.supplementText.length }}</pre>
                <pre>length Segmenter : {{ getGraphemeLength(consentArea.supplementText) }}</pre>

              </div>

              <!-- Client Questions & Store Inputs -->
              <div
                v-else
                :key="indexArea"
                :class="checkLineGroup(indexArea)"
                class="consent-action__form-group"
              >
                <div class="consent-action__form-label">
                  {{ consentArea.targetType === CONSENT_TARGET_TYPE.CLIENT ? $t('consent.client-questions') : $t('consent.shop-inputs') }}
                  <span class="consent-action__note">
                    {{ consentArea.targetType === CONSENT_TARGET_TYPE.CLIENT ? $t('consent.client-questions-note') : $t('consent.shop-inputs-note') }}
                  </span>

                  <!-- Order & Delete -->
                  <consent-action-area
                    :index-area="indexArea"
                    :length-area="consentForm.consentSupplements.length"
                    @on-change-order="handleOnChangeOrder($event, indexArea)"
                    @on-delete-area="handleOnDeleteArea(indexArea)"
                  />
                </div>

                <div class="consent-action__block">
                  <!-- Type -->
                  <div class="consent-action__block-field">
                    <div class="consent-action__block-label">
                      {{ $t('consent.type') }}
                    </div>
                    <div class="consent-action__block-input">
                      <div class="consent-action__block-input-type">
                        <b-form-select
                          v-model="consentArea.supplementType"
                          :options="consentArea.targetType === CONSENT_TARGET_TYPE.CLIENT ? supplementTypeOptionsClient : supplementTypeOptionsShop"
                          value-field="value"
                          text-field="text"
                          @change="handleChangeType(indexArea)"
                        />

                        <b-form-checkbox
                          v-model="consentArea.isRequired"
                        >
                          {{ $t('consent.required') }}
                        </b-form-checkbox>
                      </div>
                    </div>
                  </div>

                  <!-- Question -->
                  <div class="consent-action__block-field">
                    <div class="consent-action__block-label">
                      {{ consentArea.targetType === CONSENT_TARGET_TYPE.CLIENT ? $t('consent.question') : $t('consent.title') }}
                    </div>
                    <div class="consent-action__block-input">
                      <b-form-input
                        v-model="consentArea.supplementText"
                        :maxlength="CONSENT_INPUT.MAX_LENGTH_QUESTION"
                        type="text"
                      />
                    </div>
                  </div>

                  <!-- Select List -->
                  <div
                    v-if="consentArea.supplementType !== CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED"
                    class="consent-action__block-field"
                  >
                    <div class="consent-action__block-label">
                      {{ $t('consent.select-list') }}

                      <b-form-checkbox
                        v-if="consentArea.supplementType !== CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED"
                        v-model="consentArea.isLineByLineShown"
                      >
                        {{ $t('consent.line-by-line') }}
                      </b-form-checkbox>
                    </div>

                    <div class="consent-action__block-input">
                      <div
                        v-for="(questionChoice, indexQuestionChoice) in consentArea.consentQuestionChoices"
                        :key="indexQuestionChoice"
                        class="consent-action__block-input-item"
                      >
                        <b-form-input
                          v-model="questionChoice.choiceText"
                          :maxlength="CONSENT_INPUT.MAX_LENGTH_QUESTION_CHOICE"
                          type="text"
                        />

                        <button
                          v-if="indexQuestionChoice !== FIRST_INDEX"
                          @click="handleDeleteQuestionChoice(indexArea, indexQuestionChoice)"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <line
                              x1="10"
                              y1="10"
                              x2="90"
                              y2="90"
                              stroke="#81878d"
                              stroke-width="8"
                            />
                            <line
                              x1="90"
                              y1="10"
                              x2="10"
                              y2="90"
                              stroke="#81878d"
                              stroke-width="8"
                            />
                          </svg>
                        </button>
                      </div>

                      <!-- Add a list -->
                      <div
                        v-if="consentArea.supplementType !== CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED"
                        class="consent-action__block-action"
                        @click="handleAddAList(indexArea)"
                      >
                        <button>+</button>{{ $t('consent.add-a-list') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Additional Options -->
          <div class="consent-action__form-group">
            <div class="consent-action__form-label mb-2">
              {{ $t('consent.additional-options') }}
            </div>
            <div class="consent-action__form-label">
              <b-form-checkbox v-model="consentForm.isOtherSignerAllowed">{{ $t('consent.add-signer') }}</b-form-checkbox>
              <span class="consent-action__note">{{ $t('consent.add-signer-note') }}</span>
            </div>
            <div class="consent-action__form-label">
              <b-form-checkbox v-model="consentForm.allowDownloadAfterSign">{{ $t('consent.download') }}</b-form-checkbox>
              <span class="consent-action__note">{{ $t('consent.download-note') }}</span>
            </div>
          </div>

          <!-- Status -->
          <div
            v-if="isEdit"
            class="consent-action__form-group"
          >
            <div class="d-flex">
              <div class="consent-action__form-label">
                {{ $t('consent.status') }}
              </div>

              <div class="consent-action__form-checkbox ml-3">
                <switch-checkbox
                  v-model="consentForm.isActive"
                  :options="consentStatusOptions"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="consent-action__btn-group">
          <aha-button
            variant="blue"
            class="btn-default"
            @click="handleSubmitAction"
          >
            {{ $t('general.save') }}
          </aha-button>
          <aha-button
            variant="blue-light"
            class="btn-default"
            @click="handleCancelAction"
          >
            {{ $t('general.cancel') }}
          </aha-button>
        </div>
      </div>
    </section>

    <!-- MODAL - Consent Form Preview -->
    <consent-form-preview
      :visible="isShowConsentFormPreview"
      :modal-title="$t('consent.consent-form-preview')"
      :modal-data="consentForm"
      @hide="isShowConsentFormPreview = false"
    />

    <!-- MODAL - Alert delete area -->
    <alert-confirm
      :id="modalConfirmDelete"
      :data_alerts="[$t('consent.confirm-delete-area')]"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.confirm')"
      @confirm="handleConfirmDeleteArea"
    />

    <!-- MODAL - Alert validate -->
    <alert-confirm
      :id="modalValidateTitle"
      :data_alerts="errorMessages"
      :label_no="$t('general.close')"
      hide_yes
    />

    <!-- MODAL - Alert confirm -->
    <alert-confirm
      :id="modalConfirmUpdate"
      :data_alerts="dataAlerts"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.confirm')"
      @confirm="handleConfirmUpdateConsentForm"
    />

    <!-- MODAL - Alert content truncate -->
    <alert-confirm
      :id="modalContentTruncate"
      :data_alerts="[$t('consent.confirm-truncate-content')]"
      :label_no="$t('general.cancel')"
      :label_yes="$t('general.confirm')"
      @confirm="handleConfirmTruncateContent"
    />
  </main>
</template>

<script>
// Util
import { mapState } from 'vuex'

// API
import {
  createConsentForm,
  updateConsentForm,
  getConsentHistoryDetail,
} from 'Modules/api/consent/consent-api'

// Components
import AlertConfirm from 'CommonComponents/alert/alert-confirm.vue'
import ComponentBase from 'CommonComponents/component-base/component-base.vue'
import ConsentActionArea from 'Modules/consent/components/consent-action/consent-action-area.vue'
import ConsentFormPreview from 'Modules/consent/components/consent-form-preview/consent-form-preview.vue'

// Constants
import {
  CONSENT_INPUT,
  CONSENT_STATUS,
  CONSENT_ACTION_AREA,
  CONSENT_TARGET_TYPE,
  CONSENT_SUPPLEMENT_TYPE,
} from 'Constant'
import { options } from 'OptionsHelpers'
import SwitchCheckbox from 'CommonComponents/form/checkbox/switch-checkbox/switch-checkbox.vue'
import { document } from 'C:/Users/PC14/AppData/Local/Microsoft/TypeScript/5.9/node_modules/postcss/lib/postcss'

const FIRST_INDEX = 0
const DEFAULT_CHECKBOX = true

export default {
  components: {
    SwitchCheckbox,
    AlertConfirm,
    ConsentActionArea,
    ConsentFormPreview,
  },

  extends: ComponentBase,

  data() {
    return {
      FIRST_INDEX,
      DEFAULT_CHECKBOX,
      CONSENT_INPUT,
      CONSENT_TARGET_TYPE,
      CONSENT_SUPPLEMENT_TYPE,
      dataAlerts:               [],
      errorMessages:            [],
      modalConfirmDelete:       'modal-confirm-delete',
      modalValidateTitle:       'modal-validate-title',
      modalConfirmUpdate:       'modal-confirm-update',
      modalContentTruncate:     'modal-content-truncate',
      isShowConsentFormPreview: false,
      indexArea:                0,
      currentContentAreaIndex:  null,
      isClientNameShown:        true,
      isClientMobileShown:      true,

      consentForm: {
        shopId:                 0,
        isActive:               true,
        isOtherSignerAllowed:   false,
        isClientNumberShown:    false,
        isClientRatingShown:    false,
        isClientGroupShown:     false,
        isClientBirthdayShown:  false,
        isClientAddressShown:   false,
        isHasChangeConsentForm: false,
        allowDownloadAfterSign: false,
        title:                  '',
        consentSupplements:     [
          {
            targetType:             null,
            supplementType:         CONSENT_SUPPLEMENT_TYPE.CONTENT,
            supplementText:         '',
            status:                 1,
            consentQuestionChoices: [],
          },
        ],
      },
      initialConsentFormAdd:  {},
      initialConsentFormEdit: {},
    }
  },

  computed: {
    ...mapState('consent', [
      'consentDetail',
      'defaultClientEnSetup',
      'defaultClientKrSetup',
    ]),

    isKorean () {
      return this.app_language === options.language.korean
    },

    title() {
      if(this.isEdit) {
        return this.$t('consent.edit-consent-form')
      }
      return this.$t('consent.add-consent-form')
    },

    isEdit () {
      return this.$route.query?.consentFormId
    },

    consentStatusOptions () {
      return [
        {
          value: true,
          text:  'consent.active',
        },
        {
          value: false,
          text:  'consent.in-active',
        },
      ]
    },

    supplementTypeOptionsClient () {
      return [
        { text: this.$t('consent.open-ended'), value: CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED },
        { text: this.$t('consent.optional-questions-single'), value: CONSENT_SUPPLEMENT_TYPE.SINGLE_CHOICE },
        { text: this.$t('consent.optional-questions-multiple'), value: CONSENT_SUPPLEMENT_TYPE.MULTIPLE_CHOICE },
      ]
    },

    supplementTypeOptionsShop () {
      return [
        { text: this.$t('consent.open-ended-shop-input'), value: CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED },
        { text: this.$t('consent.optional-input-single'), value: CONSENT_SUPPLEMENT_TYPE.SINGLE_CHOICE },
        { text: this.$t('consent.optional-input-multiple'), value: CONSENT_SUPPLEMENT_TYPE.MULTIPLE_CHOICE },
      ]
    },
  },

  created() {
    this.isEdit
      ? this.initEditConsent()
      : this.initAddConsent()
  },

  methods: {
    initAddConsent () {
      this.consentForm.shopId = this.shop_data.shop_id
      this.consentForm.consentSupplements = this.consentForm.consentSupplements.map(supplement => ({
        shopId: this.shop_data.shop_id,
        ...supplement,
      }))
      this.initialConsentFormAdd = JSON.parse(JSON.stringify(this.consentForm))
    },

    async initEditConsent () {
      const consentFormId = Number(this.$route.query?.consentFormId)

      try {
        this.preLoader()

        const payload = {
          shopId:               this.shop_data.shop_id,
          consentFormId:        consentFormId,
          consentFormHistoryId: -1,
        }
        const result = await getConsentHistoryDetail(payload)
        const resultData = result.data.result

        delete resultData?.consentForm?.title

        this.consentForm = {
          shopId:        resultData.shopId,
          title:         resultData.title,
          consentFormId: resultData.consentFormId,
          isActive:      resultData.isActive,
          ...resultData.consentForm,
        }

        // Initialize initialConsentFormEdit when accessing the consent edit
        // for the purpose of checking the isHasChangeConsentForm case
        this.initialConsentFormEdit = JSON.parse(JSON.stringify(this.consentForm))
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    handleAddContents () {
      const objectContentArea = {
        shopId:                 this.shop_data.shop_id,
        targetType:             null,
        supplementText:         '',
        supplementType:         CONSENT_SUPPLEMENT_TYPE.CONTENT,
        status:                 CONSENT_STATUS.ACTIVE,
        consentQuestionChoices: [],
      }

      this.consentForm.consentSupplements.push(objectContentArea)

      this.handleScrollToNewlyAddedBlock()
    },

    handleAddQuestions (targetType) {
      const objectQuestionArea = {
        shopId:                 this.shop_data.shop_id,
        targetType:             targetType,
        supplementText:         '',
        supplementType:         CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED,
        status:                 CONSENT_STATUS.ACTIVE,
        isRequired:             true,
        isLineByLineShown:      false,
        consentQuestionChoices: [],
      }

      this.consentForm.consentSupplements.push(objectQuestionArea)

      this.handleScrollToNewlyAddedBlock()
    },

    handleScrollToNewlyAddedBlock () {
      this.$nextTick(() => {
        const newIndex = this.consentForm.consentSupplements.length - 1
        const newBlockElement = document.querySelector(`.consent-action__form-supplements > div:nth-child(${newIndex + 1})`)

        if (newBlockElement) {
          newBlockElement.scrollIntoView({
            behavior: 'smooth',
            block:    'start',
          })

          newBlockElement.classList.add('newly-added')

          setTimeout(() => {
            newBlockElement.classList.remove('newly-added')
          }, 1000)
        }
      })
    },

    handleAddAList (indexArea) {
      const objectQuestionChoice = {
        choiceText: '',
        status:     CONSENT_STATUS.ACTIVE,
      }

      this.consentForm.consentSupplements[indexArea].consentQuestionChoices.push(objectQuestionChoice)
    },

    handleDeleteQuestionChoice (indexArea, indexQuestionChoice) {
      this.consentForm.consentSupplements[indexArea].consentQuestionChoices.splice(indexQuestionChoice, 1)
    },

    /**
     * Using this.$set helps Vue detect changes in arrays and ensures the reactivity of the data
     * (indexArea - 1) : is the index before the current indexArea
     * (indexArea + 1) : is the index after the current indexArea
     * @param action
     * @param indexArea
     */
    handleOnChangeOrder (action, indexArea) {
      const temp = this.consentForm.consentSupplements[indexArea]
      const swapIndex = action === CONSENT_ACTION_AREA.UP ? indexArea - 1 : indexArea + 1

      this.$set(this.consentForm.consentSupplements, indexArea, this.consentForm.consentSupplements[swapIndex])
      this.$set(this.consentForm.consentSupplements, swapIndex, temp)
    },

    /**
     * If no characters are entered in the content or selection list, it will be deleted immediately
     * If there are characters entered, display a delete confirmation popup
     * @param indexArea
     */
    handleOnDeleteArea (indexArea) {
      this.indexArea = indexArea

      const supplement = this.consentForm.consentSupplements[indexArea]
      const hasTargetType = supplement.targetType !== null
      const hasSupplementText = Boolean(supplement.supplementText)
      const hasNonEmptyChoices = this.hasNonEmptyChoiceText(indexArea)
      const needsConfirmation = (hasTargetType && (hasSupplementText || hasNonEmptyChoices)) || (!hasTargetType && hasSupplementText)

      needsConfirmation
        ? this.showDialogById(this.modalConfirmDelete)
        : this.consentForm.consentSupplements.splice(indexArea, 1)
    },

    handleChangeType (indexArea) {
      const objectQuestionChoice = {
        choiceText: '',
        status:     CONSENT_STATUS.ACTIVE,
      }

      this.consentForm.consentSupplements[indexArea].isLineByLineShown = false
      this.consentForm.consentSupplements[indexArea].consentQuestionChoices
        = this.consentForm.consentSupplements[indexArea].supplementType === CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED
          ? []
          : [objectQuestionChoice]
    },

    handleConfirmDeleteArea () {
      this.consentForm.consentSupplements.splice(this.indexArea, 1)
    },

    handleMapOrderNo () {
      return {
        ...this.consentForm,
        consentSupplements: this.consentForm.consentSupplements.map((consentArea, indexArea) => {
          return {
            ...consentArea,
            orderNo:                indexArea + 1,
            consentQuestionChoices: consentArea.consentQuestionChoices.map((choiceItem, choiceIndex) => ({
              ...choiceItem,
              orderNo: choiceIndex + 1,
            })),
          }
        }),
      }
    },

    handleSubmitAction () {
      // Handle validate consent form before submit
      if (!this.isValidTitle() || !this.isValidConsentSupplements() || !this.isValidContentSupplements()) {
        return this.showDialogById(this.modalValidateTitle)
      }

      this.isEdit
        ? this.handleUpdateConsentForm()
        : this.handleCreateConsentForm()
    },

    async handleCreateConsentForm () {
      try {
        this.preLoader()

        const payload = this.handleMapOrderNo()
        await createConsentForm(payload)

        this.$router.push({ name: 'consent-management' })
      } catch (error) {
        this._showDialogAlert(error.message)
      } finally {
        this.preLoader(false)
      }
    },

    async handleUpdateConsentForm (isPreVersionSentChecking = true) {
      try {
        this.preLoader()
        this.checkHasChangeConsentForm()

        const payload = this.handleMapOrderNo()
        payload.isPreVersionSentChecking = payload.isActive ? isPreVersionSentChecking : false
        await updateConsentForm(payload)

        this.$router.push({ name: 'consent-management' })
      } catch (error) {
        if(error.isApiError() && error.codes.includes('CFS12C')) {
          this.dataAlerts = error.message
          this.showDialogById(this.modalConfirmUpdate)
        }
      } finally {
        this.preLoader(false)
      }
    },

    checkHasChangeConsentForm () {
      const newDataConsentForm = { ...this.consentForm }

      delete newDataConsentForm.isActive
      delete newDataConsentForm.isOtherSignerAllowed
      delete newDataConsentForm.allowDownloadAfterSign

      delete this.initialConsentFormEdit.isActive
      delete this.initialConsentFormEdit.isOtherSignerAllowed
      delete this.initialConsentFormEdit.allowDownloadAfterSign

      this.consentForm.isHasChangeConsentForm = JSON.stringify(newDataConsentForm) !== JSON.stringify(this.initialConsentFormEdit)
    },

    checkLineGroup (indexArea) {
      if(indexArea > 0) {
        return this.consentForm.consentSupplements[indexArea].targetType === this.consentForm.consentSupplements[indexArea -1].targetType ? 'not-top-line' : ''
      }
      return ''
    },

    async handleCancelAction () {
      const hasModifiedConsentForm = this.isEdit
        ? JSON.stringify(this.initialConsentFormEdit) !== JSON.stringify(this.consentForm)
        : JSON.stringify(this.initialConsentFormAdd) !== JSON.stringify(this.consentForm)

      const messageConfirmCancel = this.isEdit
        ? this.$t('consent.confirm-cancel-form-edit')
        : this.$t('consent.confirm-cancel-form-add')

      if (hasModifiedConsentForm) {
        const isConfirmed = await this._showDialogConfirm(messageConfirmCancel, {
          confirmBtnText: this.$t('general.confirm'),
          cancelBtnText:  this.$t('general.cancel'),
        })

        isConfirmed && this.$router.push({ name: 'consent-management' })
      } else {
        this.$router.push({ name: 'consent-management' })
      }
    },

    hasNonEmptyChoiceText (indexArea) {
      const consentQuestionChoices = this.consentForm.consentSupplements[indexArea].consentQuestionChoices || []

      return consentQuestionChoices.some(questionChoice => questionChoice.choiceText)
    },

    handleConfirmUpdateConsentForm () {
      this.handleUpdateConsentForm(false)
    },

    isValidTitle () {
      this.errorMessages = [this.$t('consent.validate-consent-title')]
      this.consentForm.title = this.consentForm.title.trim()
      return !!this.consentForm.title.length
    },

    isValidConsentSupplements () {
      this.errorMessages = [this.$t('consent.validate-contents-required')]
      return !!this.consentForm.consentSupplements.length
    },

    /**
     * Filter supplements with different targetType
     * Check empty supplementText in each supplement to add an error message based on targetType
     * Check empty consentQuestionChoices in each supplement to add an error message based on targetType
     * @returns {boolean}
     */
    isValidContentSupplements () {
      this.errorMessages = []

      const supplementContents = this.filterSupplementsByTargetType(CONSENT_TARGET_TYPE.CONTENT)
      const supplementClientQuestions = this.filterSupplementsByTargetType(CONSENT_TARGET_TYPE.CLIENT)
      const supplementShopInputs = this.filterSupplementsByTargetType(CONSENT_TARGET_TYPE.STORE)

      const hasEmptyContent = this.checkAndHandleEmptySupplementsText(supplementContents, this.$t('consent.validate-contents-required'))
      const hasEmptyClientQuestionWithOpenEnded = this.checkAndHandleEmptySupplementsTextWithOpenEnded(supplementClientQuestions, this.$t('consent.validate-client-question-required'))
      const hasEmptyShopInputWithOpenEnded = this.checkAndHandleEmptySupplementsTextWithOpenEnded(supplementShopInputs, this.$t('consent.validate-shop-input-required'))
      const hasEmptySelectList = this.checkAndHandleEmptyQuestionChoices(this.$t('consent.validate-select-list'))

      return !hasEmptyContent
        && !hasEmptyClientQuestionWithOpenEnded
        && !hasEmptyShopInputWithOpenEnded
        && !hasEmptySelectList
    },

    filterSupplementsByTargetType (targetType) {
      return this.consentForm.consentSupplements.filter(supplement => supplement.targetType === targetType) || []
    },

    checkAndHandleEmptySupplementsText (supplements, errorMessage) {
      if (supplements.length && supplements.some(supplement => !supplement.supplementText.trim().length)) {
        this.errorMessages.push(errorMessage)
        return true
      }
      return false
    },

    checkAndHandleEmptySupplementsTextWithOpenEnded (supplements, errorMessage) {
      if (supplements.length && supplements.some(supplement => supplement.supplementType === CONSENT_SUPPLEMENT_TYPE.OPEN_ENDED && !supplement.supplementText.trim().length)) {
        this.errorMessages.push(errorMessage)
        return true
      }
      return false
    },

    checkAndHandleEmptyQuestionChoices (errorMessage) {
      if (this.consentForm.consentSupplements.length && this.consentForm.consentSupplements.some(supplement => supplement.consentQuestionChoices.some(choice => !choice.choiceText))) {
        this.errorMessages.push(errorMessage)
        return true
      }
      return false
    },

    /**
     * Count grapheme length using Intl.Segmenter for accurate counting of Korean, emoji, full-width characters
     * @param {string} text - The text to count
     * @returns {number} - The grapheme count
     */
    getGraphemeLength (text) {
      if (!text) {
        return 0
      }

      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' })
        const segments = segmenter.segment(text)
        return Array.from(segments).length
      }

      return text.length
    },

    /**
     * Truncate text to specified grapheme length
     * @param {string} text - The text to truncate
     * @param {number} maxLength - Maximum grapheme length
     * @returns {string} - Truncated text
     */
    truncateToGraphemeLength (text, maxLength) {
      if (!text) {
        return ''
      }

      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' })
        const segments = Array.from(segmenter.segment(text))

        if (segments.length <= maxLength) {
          return text
        }

        const truncatedSegments = segments.slice(0, maxLength)
        return truncatedSegments.map(segment => segment.segment).join('')
      }

      return text.substring(0, maxLength)
    },

    /**
     * Handle content input and check if length exceeds 50 graphemes
     * @param {string} value - The input value
     * @param {number} indexArea - The index of the content area
     */
    handleContentInput (value, indexArea) {
      const graphemeLength = this.getGraphemeLength(value)
      const element = document.querySelector('textarea')

      console.log(element)
      if (graphemeLength > 50) {
        element.blur()
        this.currentContentAreaIndex = indexArea
        this.showDialogById(this.modalContentTruncate)
      }
    },

    /**
     * Handle confirm truncate content to 50 graphemes
     */
    handleConfirmTruncateContent () {
      if (this.currentContentAreaIndex !== null) {
        const currentText = this.consentForm.consentSupplements[this.currentContentAreaIndex].supplementText
        const truncatedText = this.truncateToGraphemeLength(currentText, 50)
        this.consentForm.consentSupplements[this.currentContentAreaIndex].supplementText = truncatedText
        this.currentContentAreaIndex = null
      }
    },
  },
}

</script>

<style lang="scss" scoped>
  @import './consent-action.scss';
</style>
