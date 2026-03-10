<template>
  <Dialog
    v-model:visible="dialogVisible"
    modal
    :header="$t('myIssues.createMrModal.title')"
    :closable="!loading"
    :close-on-escape="!loading"
    :draggable="false"
    :breakpoints="DIALOG_BREAKPOINTS"
    :pt="dialogPt"
    @show="onDialogShow"
  >
    <div class="cmr">
      <!-- Branches section -->
      <div class="cmr__group">
        <h4 class="cmr__group-title">
          {{ $t('myIssues.createMrModal.title') }}
        </h4>

        <div class="cmr__section">
          <label class="cmr__label">{{ $t('myIssues.createMrModal.sourceBranch') }}</label>
          <InputGroup>
            <InputText v-model="sourceBranch" readonly fluid class="cmr__branch-input" />
            <Button
              v-tooltip.top="copyTooltip"
              :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
              :severity="copied ? 'success' : 'secondary'"
              variant="outlined"
              :aria-label="$t('myIssues.createMrModal.copyBranch')"
              @click="onCopySourceBranch"
            />
          </InputGroup>
        </div>

        <div class="cmr__section">
          <label class="cmr__label">{{ $t('myIssues.createMrModal.targetBranch') }}</label>
          <AutoComplete
            v-model="targetBranch"
            :suggestions="filteredBranches"
            :placeholder="$t('myIssues.createMrModal.targetBranchPlaceholder')"
            dropdown
            fluid
            @complete="onSearchBranch"
          />
        </div>
      </div>

      <Divider />

      <!-- Linked Issue -->
      <div class="cmr__section">
        <label class="cmr__label">{{ $t('myIssues.createMrModal.linkedIssue') }}</label>
        <div v-if="issue" class="cmr__linked-issue">
          <i class="pi pi-gitlab cmr__linked-issue-icon" />
          <span class="cmr__linked-issue-text">
            Issue #{{ issue.issueNumber }} - {{ issue.title }}
          </span>
          <a
            :href="issue.webUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="cmr__linked-issue-link"
          >
            <i class="pi pi-external-link" />
          </a>
        </div>
      </div>

      <Divider />

      <!-- Collaborators -->
      <div class="cmr__row">
        <div class="cmr__section cmr__section--half">
          <label class="cmr__label">{{ $t('myIssues.createMrModal.reviewer') }}</label>
          <AutoComplete
            v-model="reviewer"
            :suggestions="filteredAssignees"
            :placeholder="$t('myIssues.createMrModal.selectReviewer')"
            option-label="name"
            dropdown
            fluid
            @complete="onSearchAssignee"
          />
        </div>

        <div class="cmr__section cmr__section--half">
          <label class="cmr__label">
            {{ $t('myIssues.createMrModal.assignee') }}
          </label>
          <div class="cmr__assignee-row">
            <AutoComplete
              v-model="assignee"
              :suggestions="filteredAssignees"
              :placeholder="$t('myIssues.createMrModal.selectAssignee')"
              option-label="name"
              dropdown
              fluid
              @complete="onSearchAssignee"
            />
            <Button
              :label="$t('myIssues.createMrModal.assignToMe')"
              severity="secondary"
              text
              size="small"
              class="cmr__assign-me"
              @click="onAssignToMe"
            />
          </div>
        </div>
      </div>

      <Divider />

      <!-- Description -->
      <TextareaField
        v-model="description"
        name="mrDescription"
        :label="$t('myIssues.createMrModal.description')"
        :placeholder="$t('myIssues.createMrModal.descriptionPlaceholder')"
        :rows="4"
        auto-resize
      />
    </div>

    <template #footer>
      <div class="cmr__footer">
        <Button
          :label="$t('myIssues.createMrModal.cancel')"
          severity="secondary"
          :disabled="loading"
          @click="dialogVisible = false"
        />
        <Button
          :label="$t('myIssues.createMrModal.createMrAction')"
          icon="pi pi-git-commit"
          :loading="loading"
          :disabled="!sourceBranch"
          @click="onSubmit"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { TextareaField } from '@/components/common'

import type { GitLabIssue, GitLabUser } from '@/types/gitlab'

const DIALOG_WIDTH = '50rem'
const DIALOG_BREAKPOINTS = { '960px': '75vw', '575px': '95vw' } as const
const BASE_BRANCH_OPTIONS = ['develop', 'main'] as const
const dialogPt = { root: { style: { width: DIALOG_WIDTH } } } as const

export interface CreateMrPayload {
  sourceBranch: string
  targetBranch: string
  issueNumber: number
  reviewer: GitLabUser | null
  assignee: GitLabUser | null
  description: string
}

interface Props {
  visible: boolean
  issue: GitLabIssue | null
  sourceBranchName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void
  (event: 'submit', payload: CreateMrPayload): void
}>()

const { t } = useI18n()

const loading = ref(false)
const sourceBranch = ref('')
const targetBranch = ref<string>(BASE_BRANCH_OPTIONS[0])
const filteredBranches = ref<string[]>([...BASE_BRANCH_OPTIONS])
const reviewer = ref<GitLabUser | null>(null)
const assignee = ref<GitLabUser | null>(null)
const filteredAssignees = ref<GitLabUser[]>([])
const description = ref('')
const copied = ref(false)

const dialogVisible = computed({
  get: (): boolean => props.visible,
  set: (value: boolean): void => {
    emit('update:visible', value)
  },
})

const copyTooltip = computed((): string =>
  copied.value ? t('myIssues.createMrModal.copied') : t('myIssues.createMrModal.copyBranch'),
)

const onDialogShow = (): void => {
  sourceBranch.value = props.sourceBranchName
  targetBranch.value = BASE_BRANCH_OPTIONS[0]
  reviewer.value = null
  assignee.value = null
  description.value = ''
  copied.value = false
}

const onSearchBranch = (event: { query: string }): void => {
  const query = event.query.toLowerCase()
  if (!query) {
    filteredBranches.value = [...BASE_BRANCH_OPTIONS]
    return
  }
  filteredBranches.value = BASE_BRANCH_OPTIONS.filter((b) => b.toLowerCase().includes(query))
}

const onSearchAssignee = (event: { query: string }): void => {
  const allAssignees = props.issue?.assignees ?? []
  const query = event.query.toLowerCase()
  if (!query) {
    filteredAssignees.value = [...allAssignees]
    return
  }
  filteredAssignees.value = allAssignees.filter(
    (u) => u.name.toLowerCase().includes(query) || u.username.toLowerCase().includes(query),
  )
}

const onAssignToMe = (): void => {
  const currentUser = props.issue?.assignees.find((a) => a.id === props.issue?.userId)
  if (currentUser) {
    assignee.value = currentUser
    return
  }
  if (props.issue?.author) {
    assignee.value = props.issue.author
  }
}

const onCopySourceBranch = (): void => {
  if (!sourceBranch.value) {
    return
  }
  void navigator.clipboard.writeText(sourceBranch.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const onSubmit = (): void => {
  if (!sourceBranch.value || !props.issue) {
    return
  }
  emit('submit', {
    sourceBranch: sourceBranch.value,
    targetBranch: targetBranch.value,
    issueNumber: props.issue.issueNumber,
    reviewer: reviewer.value,
    assignee: assignee.value,
    description: description.value,
  })
}
</script>

<style scoped lang="scss">
.cmr {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__group-title {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--p-text-muted-color);
    text-transform: uppercase;
    letter-spacing: 0.025em;
    margin: 0;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    &--half {
      flex: 1;
      min-width: 0;
    }
  }

  &__row {
    display: flex;
    gap: 1rem;

    @include respond-below(sm) {
      flex-direction: column;
    }
  }

  &__label {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--p-text-color);
  }

  &__branch-input {
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.8125rem;
    background: var(--p-content-background);
  }

  &__linked-issue {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.625rem 0.875rem;
    background: var(--p-content-background);
    border: 1px solid var(--p-content-border-color);
    border-radius: var(--p-content-border-radius);
  }

  &__linked-issue-icon {
    font-size: 1rem;
    color: var(--p-primary-color);
    flex-shrink: 0;
  }

  &__linked-issue-text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--p-text-color);
  }

  &__linked-issue-link {
    color: var(--p-text-muted-color);
    flex-shrink: 0;

    &:hover {
      color: var(--p-primary-color);
    }
  }

  &__assignee-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__assign-me {
    white-space: nowrap;
    flex-shrink: 0;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
}
</style>
