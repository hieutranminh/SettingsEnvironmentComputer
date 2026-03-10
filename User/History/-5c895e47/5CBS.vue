<template>
  <div class="app-content board-action">
    <div class="system-question-container">
      <div class="system-question-panel">
        <!-- Header -->
        <div class="panel-header">
          <h2>{{ title }}</h2>
        </div>
        <!-- Content Area -->
        <Card>
          <template #content>
            <div class="panel-content">
              <div class="detail-section">
                <!-- Title Row -->
                <div class="detail-row">
                  <div class="detail-label">{{ $t('boards.title') }}</div>
                  <div class="detail-value">
                    <InputText
                      v-model="boardActionData.title"
                      class="form-input"
                    />
                  </div>
                </div>

                <!-- Writer Row (for non-chain notices) -->
                <div class="detail-row">
                  <div class="detail-label">{{ $t('boards.writer') }}</div>
                  <div class="detail-value">
                    {{ userData.userName }}
                  </div>
                  <template
                    v-if="
                      boardManagement &&
                      boardManagement.allowMasterOnlyReading &&
                      userData.userRoleCode === USER_ROLES.MASTER
                    "
                  >
                    <div
                      v-if="!isMobile"
                      class="detail-label master-only-label"
                    >
                      {{ $t('boards.master-only') }}
                    </div>
                    <div class="detail-value">
                      <div class="checkbox-wrapper">
                        <Checkbox
                          v-model="boardActionData.masterOnlyReading"
                          :binary="true"
                          class="master-checkbox"
                        />
                        <span class="checkbox-text">{{
                          $t('boards.master-only')
                        }}</span>
                      </div>
                    </div>
                  </template>
                </div>

                <!-- Content Area -->
                <div class="content-area">
                  <textarea
                    v-model="boardActionData.contents"
                    class="content-textarea"
                    rows="10"
                  />
                </div>

                <!-- File Attachments -->
                <div
                  v-if="boardManagement && boardManagement.allowFileAttachment"
                  class="file-attachments"
                >
                  <div class="detail-label">
                    {{ $t('boards.attached-files') }}
                  </div>
                  <div class="file-section">
                    <!-- File List Table -->
                    <div class="file-table">
                      <!-- Table Header -->
                      <div class="file-header">
                        <div class="file-name-col">
                          {{ $t('boards.file-name') }}
                        </div>
                        <div class="file-size-col">
                          {{ $t('boards.file-size') }}
                        </div>
                        <div class="file-action-col">
                          {{ $t('general.delete') }}
                        </div>
                      </div>

                      <!-- File Items -->
                      <div
                        v-if="
                          boardActionData.fileAttachments &&
                          boardActionData.fileAttachments.length > 0
                        "
                        class="file-items"
                      >
                        <div
                          v-for="(
                            file, index
                          ) in boardActionData.fileAttachments"
                          :key="index"
                          class="file-item"
                        >
                          <div class="file-name-col">{{ file.name }}</div>
                          <div class="file-size-col">
                            {{ formatSize(file.size) }}
                          </div>
                          <div class="file-action-col">
                            <button
                              class="delete-file-btn"
                              @click="onRemoveFile(file)"
                            >
                              {{ $t('boards.delete-file') }}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- File Upload Section -->
                    <div class="file-upload-section">
                      <div class="file-info">
                        <span class="file-info-text">{{
                          $t('boards.file-info')
                        }}</span>
                      </div>
                      <div class="file-upload-button">
                        <FileUpload
                          mode="basic"
                          :multiple="true"
                          :maxFileSize="3145728"
                          :maxFileCount="3"
                          :fileLimi="3"
                          :auto="true"
                          :customUpload="true"
                          :chooseLabel="$t('boards.search-file')"
                          @select="onFileSelect"
                          @error="onFileError"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <!-- Action Buttons -->
        <div class="panel-actions">
          <Button
            class="action-btn"
            severity="primary"
            @click="onSave"
          >
            {{ $t('general.save') }}
          </Button>
          <Button
            class="action-btn"
            severity="info"
            @click="onCancel"
          >
            {{ $t('general.cancel') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FileUploadErrorEvent } from 'primevue/fileupload'
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useBranchBoardAction } from '@/composables/boards/chain-board/useBranchBoardAction'
import { useDevice } from '@/composables/useDevice'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useTranslation } from '@/composables/useTranslation'
import {
  FORM_ACTION,
  PAGINATION,
  SEARCH_BOARD_TYPE,
  USER_ROLES,
} from '@/constants'
import { BOARD_ROUTES } from '@/constants/routeNames'
import { useAuthStore } from '@/stores/auth/auth'
import { useBoardStore } from '@/stores/common/board'
import { formatSize } from '@/utils/common'

// Composables
const { t } = useTranslation()
const boardStore = useBoardStore()
const router = useRouter()
const route = useRoute()
const { showError } = useMessageDialog()
const authStore = useAuthStore()
const { isMobile } = useDevice()

// Reactives
const title = ref<string>('')

// Computed
const userData = computed(() => {
  return {
    userName: authStore.user.userID,
    userRoleCode: authStore.user.userRoleCode,
  }
})

// Methods
const onFileError = (event: FileUploadErrorEvent) => {
  showError(event.xhr?.responseText || t('boards.file-upload-error'))
}

onMounted(async () => {
  if (boardStore.boardAction?.action === null) {
    boardStore.setPageFilter({
      searchType: SEARCH_BOARD_TYPE.TITLE,
      contents: null,
      pageNumber: PAGINATION.DEFAULT_PAGE_NUMBER,
    })
    router.push({
      name: BOARD_ROUTES.BRANCH_BOARD,
      params: { type: route.params.board_code },
    })
    return
  }

  await getBoardManagement()
  if (boardStore.boardAction.action === FORM_ACTION.EDIT) {
    await getBoardData()
  }
  title.value = t(`boards.KR-${boardCode.value}`)
})

const {
  boardCode,
  boardActionData,
  boardManagement,
  onSave,
  getBoardData,
  onFileSelect,
  onRemoveFile,
  onCancel,
  getBoardManagement,
} = useBranchBoardAction()
</script>

<style lang="scss" scoped>
// Layout
.app-content {
  .system-question-container {
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;

    .system-question-panel {
      border-radius: 8px;
      overflow: hidden;

      .panel-header {
        margin-bottom: 20px;
        border-bottom: 2px solid var(--p-gray-300);

        @include mobile {
          margin-bottom: 10px;
        }

        h2 {
          font-size: 24px;
          font-weight: 600;
          color: var(--p-gray-800);
          margin: 0;
          padding: 0 1.5rem;
        }

        &::after {
          content: '';
          display: block;
          background-color: $black;
          width: 100%;
          height: 1px;
          color: var(--p-gray-300);
          margin-top: 1rem;
        }
      }

      .panel-content {
        .detail-section {
          border: 1px solid var(--p-gray-400);
          overflow: hidden;

          .detail-row {
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--p-gray-400);
            background-color: $white;
            transition: background-color 0.2s ease;

            &:last-of-type {
              border-bottom: none;
            }

            .detail-label {
              font-weight: 600;
              color: var(--p-gray-600);
              min-width: 160px;
              padding: 13px 20px;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: var(--p-gray-200);
              border-right: 1px solid var(--p-gray-400);
            }

            .detail-value {
              flex: 1;
              color: var(--p-gray-600);
              line-height: 1.5;
              padding: 0 10px;
              display: flex;
              align-items: center;
              font-size: 14px;

              input {
                width: 100%;
              }
            }

            .master-only-label {
              border-left: 1px solid var(--p-gray-400);
              font-size: 14px;
            }

            .checkbox-wrapper {
              display: flex;
              align-items: center;
              gap: 8px;
              margin-right: 10px;

              .master-checkbox {
                width: 16px;
                height: 16px;
                accent-color: var(--p-indigo);
              }

              .checkbox-text {
                color: var(--p-gray-600);
                font-size: 14px;
              }
            }
          }

          .content-area {
            margin: 0;
            padding: 5px;
            min-height: 120px;

            .content-textarea {
              width: 100%;
              min-height: 200px;
              padding: 5px;
              border: 1px solid var(--p-gray-300);
              font-size: 14px;
              line-height: 1.6;
              resize: vertical;
              font-family: inherit;
              background-color: $white;
              transition: all 0.2s ease;

              &:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgb(0 123 255 / 15%);
              }

              &:hover {
                border-color: var(--p-gray-400);
              }
            }
          }

          .file-attachments {
            display: flex;
            align-items: stretch;
            border-top: 1px solid var(--p-gray-400);

            @include mobile {
              flex-direction: column;
            }

            .detail-label {
              font-weight: 600;
              color: var(--p-gray-600);
              padding: 16px 20px;
              background-color: var(--p-gray-200);
              border-right: 1px solid var(--p-gray-400);
              font-size: 14px;
              text-align: center;
              display: flex;
              align-items: center;

              @include mobile {
                justify-content: center;
                border-bottom: 1px solid var(--p-gray-400);
              }
            }

            .file-section {
              flex: 1;
              background-color: $white;

              .file-table {
                overflow: hidden;
                margin-bottom: 16px;
                background-color: $white;

                .file-header {
                  display: grid;
                  grid-template-columns: 60% 26% 14%;
                  background-color: var(--p-gray-200);
                  padding: 12px 16px;
                  font-weight: 600;
                  color: var(--p-gray-600);
                  border-bottom: 1px solid var(--p-gray-400);
                  font-size: 14px;
                }

                .file-items {
                  overflow: auto;

                  .file-item {
                    display: grid;
                    grid-template-columns: 60% 26% 14%;
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--gray-200);
                    align-items: center;
                    transition: background-color 0.2s ease;

                    &:hover {
                      background-color: var(--p-gray-100);
                    }

                    &:last-child {
                      border-bottom: none;
                    }

                    .file-name-col {
                      color: var(--p-gray-600);
                    }

                    .file-size-col {
                      font-size: 14px;
                    }

                    .file-action-col {
                      .delete-file-btn {
                        padding: 6px 12px;
                        background-color: var(--p-sky-500);
                        color: $white;
                        border: none;
                        border-radius: 4px;
                        font-size: 12px;
                        white-space: nowrap;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                          background-color: var(--p-sky-600);
                          transform: translateY(-1px);
                          box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
                        }
                      }
                    }
                  }
                }
              }

              .file-upload-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                background-color: var(--p-gray-200);
                border-top: 1px solid var(--p-gray-400);

                @include mobile {
                  flex-direction: column;
                  align-items: flex-end;
                  gap: 5px;
                }

                .file-info-text {
                  font-size: 14px;
                }

                .file-input {
                  display: none;
                }
              }
            }
          }
        }
      }

      .panel-actions {
        padding: 24px 32px;
        display: flex;
        justify-content: flex-end;
        gap: 12px;

        @include mobile {
          padding: 10px;
        }

        .action-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
        }
      }
    }
  }

  @media (width <= 768px) {
    padding: 16px;

    .system-question-container {
      .system-question-panel {
        .panel-content {
          .detail-section {
            .detail-row {
              flex-direction: row;
              align-items: stretch;

              .detail-label {
                background-color: var(--p-gray-200);
                padding: 10px 14px;
                border-right: 1px solid var(--p-gray-400);
                border-bottom: 1px solid var(--p-gray-300);

                @include mobile {
                  min-width: 80px;
                }
              }

              .detail-value {
                padding: 2px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
