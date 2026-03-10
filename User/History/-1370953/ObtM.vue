<template>
  <div class="user-list">
    <Card>
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <h2>Users</h2>
          <Button
            label="Add User"
            icon="pi pi-plus"
            @click="showCreateDialog = true"
          />
        </div>
      </template>

      <template #content>
        <!-- Search and Filters -->
        <div class="mb-4">
          <div class="grid">
            <div class="col-12 md:col-6">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters.search"
                  placeholder="Search users..."
                  @input="loadUsers"
                />
              </span>
            </div>
            <div class="col-12 md:col-3">
              <Dropdown
                v-model="filters.role"
                :options="roleOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Filter by role"
                @change="loadUsers"
              />
            </div>
            <div class="col-12 md:col-3">
              <Button
                label="Clear Filters"
                severity="secondary"
                @click="clearFilters"
              />
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <DataTable
          :value="users"
          :loading="loading"
          :paginator="true"
          :rows="pagination.limit"
          :totalRecords="pagination.total"
          :lazy="true"
          @page="onPageChange"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Name" sortable>
            <template #body="{ data }">
              <div class="flex align-items-center">
                <Avatar :label="data.name.charAt(0)" class="mr-2" />
                {{ data.name }}
              </div>
            </template>
          </Column>

          <Column field="email" header="Email" sortable />

          <Column field="role" header="Role" sortable>
            <template #body="{ data }">
              <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
            </template>
          </Column>

          <Column field="created_at" header="Created" sortable>
            <template #body="{ data }">
              {{ formatDate(data.created_at) }}
            </template>
          </Column>

          <Column header="Actions" :exportable="false" style="min-width:8rem">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-eye"
                  severity="info"
                  text
                  @click="viewUser(data)"
                />
                <Button
                  icon="pi pi-pencil"
                  severity="warning"
                  text
                  @click="editUser(data)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="deleteUser(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Error Message -->
        <div v-if="error" class="mt-4">
          <Message severity="error" :closable="false">
            {{ error.message }}
          </Message>
        </div>
      </template>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <Dialog
      v-model:visible="showDeleteDialog"
      modal
      header="Confirm Delete"
      :style="{ width: '450px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete user "{{ selectedUser?.name }}"?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="showDeleteDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          severity="danger"
          @click="confirmDelete"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { userApi, type User, type UserFilters } from '@/api'
import { formatDate } from '@/utils/dateUtils'

const router = useRouter()

// State
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const showDeleteDialog = ref(false)

// Pagination
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
})

// Filters
const filters = reactive<UserFilters>({
  search: '',
  role: '',
})

// Role options for filter dropdown
const roleOptions = [
  { label: 'All Roles', value: '' },
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
  { label: 'Manager', value: 'manager' },
]

// API composable
const { loading, error, execute } = useApi()

// Load users
const loadUsers = async (): Promise<void> => {
  await execute(() =>
    userApi.getUsers(pagination.page, pagination.limit, filters)
  )

  if (error.value === null) {
    // Update pagination and users from response
    // This would be handled by the actual API response structure
  }
}

// Pagination change
const onPageChange = (event: { page: number }): void => {
  pagination.page = event.page + 1
  loadUsers()
}

// Clear filters
const clearFilters = (): void => {
  filters.search = ''
  filters.role = ''
  pagination.page = 1
  loadUsers()
}

// User actions
const viewUser = (user: User): void => {
  router.push(`/users/${user.id}`)
}

const editUser = (user: User): void => {
  router.push(`/users/${user.id}/edit`)
}

const deleteUser = (user: User): void => {
  selectedUser.value = user
  showDeleteDialog.value = true
}

const confirmDelete = async (): Promise<void> => {
  if (!selectedUser.value) return

  await execute(() => userApi.deleteUser(selectedUser.value!.id))

  if (error.value === null) {
    showDeleteDialog.value = false
    selectedUser.value = null
    loadUsers() // Reload the list
  }
}

// Helper function for role tag severity
const getRoleSeverity = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'danger'
    case 'manager':
      return 'warning'
    default:
      return 'info'
  }
}

// Load users on mount
onMounted(() => {
  loadUsers()
})
</script>

<style scoped lang="scss">
.user-list {
  padding: 1rem;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
</style>
