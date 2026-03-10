<template>
  <Card>
    <template #content>
      <div class="table-container">
        <div class="table-left">
          <ClientsByPeriodDataTable
            ref="visitingClientsTableRef"
            :title="$t('clients-by-period.title-table-visiting-clients')"
            :data="visitingClientsTableData"
            :headerRows="visitingClientsHeaderConfig"
            :bodyFields="visitingClientsBodyFields"
            tableRefName="visitingClientsTable"
          />
        </div>

        <div class="table-right">
          <ClientsByPeriodDataTable
            ref="visitingMembersTableRef"
            :title="$t('clients-by-period.title-table-visiting-members')"
            :data="visitingMembersTableData"
            :headerRows="visitingMembersHeaderConfig"
            :bodyFields="visitingMembersBodyFields"
            tableRefName="visitingMembersTable"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

// Components
import ClientsByPeriodDataTable from '@/components/common/ClientsByPeriodDataTable.vue'

// Composables
import { useI18n } from 'vue-i18n'
import { useClientsByPeriodTableData } from '@/composables/report-by-branch/useClientsByPeriodTableData'
import { useClientsByPeriodTableConfig } from '@/composables/report-by-branch/useClientsByPeriodTableConfig'

// Constants
import { PRINT_TYPE } from '@/constants'

// Types
import type { ClientSummary, MemberSummary } from '@/types/client-report/ClientsByPeriod'
import type { PrintSection } from '@/types/print'

interface Props {
  clientSummary: ClientSummary
  memberSummary: MemberSummary
}

const props = withDefaults(defineProps<Props>(), {
  clientSummary: () => ({}) as ClientSummary,
  memberSummary: () => ({}) as MemberSummary,
})

// Composables
const { t } = useI18n()
const { transformVisitingClientsData, transformVisitingMembersData } = useClientsByPeriodTableData()
const {
  getVisitingClientsHeaderConfig,
  getVisitingMembersHeaderConfig,
  getVisitingClientsBodyFields,
  getVisitingMembersBodyFields,
} = useClientsByPeriodTableConfig()

// Component refs with improved naming
const visitingClientsTableRef = ref<InstanceType<typeof ClientsByPeriodDataTable>>()
const visitingMembersTableRef = ref<InstanceType<typeof ClientsByPeriodDataTable>>()

// Computed data using composable
const visitingClientsTableData = computed(() => transformVisitingClientsData(props.clientSummary))
const visitingMembersTableData = computed(() => transformVisitingMembersData(props.memberSummary))

// Table configurations
const visitingClientsHeaderConfig = computed(() => getVisitingClientsHeaderConfig())
const visitingMembersHeaderConfig = computed(() => getVisitingMembersHeaderConfig())
const visitingClientsBodyFields = computed(() => getVisitingClientsBodyFields())
const visitingMembersBodyFields = computed(() => getVisitingMembersBodyFields())

// Print functionality with improved naming
const getVisitingClientsTableElement = (): HTMLElement | null => {
  const tableRef = visitingClientsTableRef.value?.$refs?.visitingClientsTable as any
  if (tableRef) {
    return tableRef.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getVisitingClientsPrintConfig = (): PrintSection => {
  const tableElement = getVisitingClientsTableElement()
  if (!tableElement) {
    throw new Error('Visiting clients table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('clients-by-period.title-table-visiting-clients'),
  }
}

const getVisitingMembersTableElement = (): HTMLElement | null => {
  const tableRef = visitingMembersTableRef.value?.$refs?.visitingMembersTable as any
  if (tableRef) {
    return tableRef.$el.querySelector('.p-datatable-table')
  }
  return null
}

const getVisitingMembersPrintConfig = (): PrintSection => {
  const tableElement = getVisitingMembersTableElement()
  if (!tableElement) {
    throw new Error('Visiting members table element not found')
  }

  return {
    refType: PRINT_TYPE.TABLE,
    sectionRef: tableElement,
    title: t('clients-by-period.title-table-visiting-members'),
  }
}

defineExpose({
  getPrintConfigurationVisitingClients: getVisitingClientsPrintConfig,
  getPrintConfigurationVisitingMembers: getVisitingMembersPrintConfig,
})
</script>

<style lang="scss" scoped>
.p-card {
  margin-bottom: 1rem;
}

.table-container {
  display: flex;
  gap: 1rem;

  @include maxResponsive(mobile) {
    display: block;
  }

  h4 {
    margin-bottom: 0.5rem;
  }

  .table-left,
  .table-right {
    flex: 1;
    min-width: 0;
  }

  .table-left {
    @include maxResponsive(mobile) {
      margin-bottom: 2rem;
    }
  }
}

:deep(.clients-by-period-table) {
  .bg-gray {
    background-color: var(--p-gray-100);
  }

  .border-bottom-0 {
    border-bottom: none;
  }

  .p-datatable-thead {
    & > tr {
      & > th {
        .p-datatable-column-header-content {
          justify-content: center;
          text-align: center;
        }
      }
    }
  }

  .p-datatable-tbody,
  .p-datatable-tfoot {
    & > tr {
      & > td {
        text-align: center;
      }
    }

    .p-datatable-empty-message {
      & > td {
        text-align: center;
      }
    }
  }
}
</style>
