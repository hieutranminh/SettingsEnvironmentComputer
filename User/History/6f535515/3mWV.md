---
name: MyIssues Filter and Table
overview: "Xay dung trang MyIssues voi 2 phan chinh: (1) MyIssuesFilter - card chua cac bo loc (Project, Release Number, Region, Status), va (2) MyIssuesTable - bang hien thi danh sach issues voi phan trang phia FE. Bao gom viec tao types, API layer, Pinia store, va 2 partial components."
todos:
  - id: update-gitlab-service-config
    content: "Cap nhat GITLAB_SERVICE tu ServiceCmdOnlyConfig sang ServiceConfig (them readVersion: 1) trong src/config/services.ts"
    status: completed
  - id: create-gitlab-types
    content: "Tao file src/types/gitlab.ts voi cac interfaces: GitLabProject, GitLabProjectListResult, GitLabUser, GitLabMilestone, GitLabIssue, GitLabIssueListResult, GitLabIssuesByUserRequest"
    status: completed
  - id: extend-gitlab-api
    content: Them getProjects() va getIssuesByUser() vao src/api/services/gitlab.ts, cap nhat src/api/index.ts
    status: completed
  - id: create-myissues-store
    content: Tao Pinia store src/stores/myIssues.ts voi state (projects, issues, filters, loading), computed (filteredIssues), va actions (fetchProjects, fetchIssues)
    status: completed
  - id: create-myissues-filter
    content: Tao src/views/MyIssues/partials/MyIssuesFilter.vue voi Card chua 4 filter fields (Project, Release Number, Region, Status) su dung SelectField va InputNumberField
    status: in_progress
  - id: create-myissues-table
    content: Tao src/views/MyIssues/partials/MyIssuesTable.vue voi DataTable (client-side pagination), 4 cot (Issue No, Issue, Status, Action) va 3 action buttons
    status: pending
  - id: update-myissues-view
    content: Cap nhat src/views/MyIssues/MyIssuesView.vue de compose MyIssuesFilter + MyIssuesTable, goi store actions khi mounted
    status: pending
isProject: false
---

# My Issues Filter and Table Implementation

## Tong quan hien trang

- [MyIssuesView.vue](src/views/MyIssues/MyIssuesView.vue) hien chi la placeholder (h2 + p).
- Project su dung CQRS gateway pattern voi `gatewayService.read()` / `.command()` ([src/api/services/base.ts](src/api/services/base.ts)).
- `GITLAB_SERVICE` hien tai chi co `cmdVersion: 1` (thieu `readVersion`) ([src/config/services.ts](src/config/services.ts)).
- Form components da co san: `SelectField`, `InputNumberField`, etc. tu `@/components/common` ([src/components/common/form/](src/components/common/form/)).
- DataTable wrapper: `AppDataTable` + composable `useDataTable` hoat dong o che do **lazy/server-side** ([src/composables/useDataTable.ts](src/composables/useDataTable.ts)).

## Trang thai cuoi cung

```mermaid
flowchart TB
  subgraph MyIssuesView ["MyIssuesView.vue"]
    Filter["MyIssuesFilter (Card)"]
    Table["MyIssuesTable (DataTable)"]
  end
  subgraph Store ["useMyIssuesStore (Pinia)"]
    State["filters, projects, issues, loading"]
    Actions["fetchProjects, fetchIssues"]
    Computed["filteredIssues (FE filter + pagination)"]
  end
  subgraph API ["gitlabApi"]
    GetProjects["getProjects() -> read/v1/GitLab/ProjectListed"]
    GetIssues["getIssuesByUser() -> read/v1/GitLab/IssuesByUser"]
  end

  Filter -->|"v-model filters"| State
  State -->|"trigger"| Actions
  Actions --> GetProjects
  Actions --> GetIssues
  GetProjects --> State
  GetIssues --> State
  State --> Computed
  Computed --> Table
```



## Cac thay doi cu the

### 1. Cap nhat `GITLAB_SERVICE` config - [src/config/services.ts](src/config/services.ts)

- Chuyen tu `ServiceCmdOnlyConfig` sang `ServiceConfig` (them `readVersion: 1` ben canh `cmdVersion: 1`).

### 2. Tao TypeScript types - `src/types/gitlab.ts` (file moi)

- `GitLabProject`: `{ id: number; name: string; path: string }`
- `GitLabProjectListResult`: `{ projects: GitLabProject[] }`
- `GitLabUser`: `{ id: number; name: string; username: string; avatarUrl: string; webUrl: string }`
- `GitLabMilestone`: `{ id: number; title: string; dueDate: string | null; startDate: string | null; releaseNumber: string; ... }`
- `GitLabIssue`: `{ id: number; title: string; issueNumber: number; description: string; dueDate: string | null; projectId: string; user: GitLabUser | null; assignees: GitLabUser[]; author: GitLabUser; labels: string[]; milestone: GitLabMilestone | null; webUrl: string }`
- `GitLabIssueListResult`: `{ issues: GitLabIssue[] }`
- `GitLabIssuesByUserRequest`: `{ projectId: number; issueState: number }`

### 3. Mo rong API layer - [src/api/services/gitlab.ts](src/api/services/gitlab.ts)

Them 2 methods vao `gitlabApi`:

- `getProjects()` -> `gatewayService.read<GitLabProjectListResult>(GITLAB_SERVICE, 'ProjectListed')`
- `getIssuesByUser(request)` -> `gatewayService.read<GitLabIssueListResult>(GITLAB_SERVICE, 'IssuesByUser', request)`

Cap nhat [src/api/index.ts](src/api/index.ts) de re-export cac types moi.

### 4. Tao Pinia store - `src/stores/myIssues.ts` (file moi)

- **State**: `projects`, `issues`, `loading`, `filters` (projectId, releaseNumber, region, status)
- **Computed**: `filteredIssues` - loc issues theo labels (region, status) va milestone (releaseNumber) o phia FE
- **Actions**: `fetchProjects()`, `fetchIssues()`, `applyFilters()`
- Pattern: Composition API (`defineStore('myIssues', () => { ... })`) giong [src/stores/auth.ts](src/stores/auth.ts)

### 5. Tao component `MyIssuesFilter` - `src/views/MyIssues/partials/MyIssuesFilter.vue` (file moi)

Su dung PrimeVue `Card` voi `#content` slot, ben trong la grid 4 cot:

- **Project Name**: `SelectField` voi `filter`, `show-clear`, options tu store `projects` (map sang `{ label: name, value: id }`)
- **Release Number**: `InputNumberField` voi `precision: 0`
- **Region**: `SelectField` voi options static `[{ label: 'VN', value: 'VN' }, { label: 'KR', value: 'KR' }]`
- **Status**: `SelectField` voi options static `[Todo, Verifying, Merging, ...]`

Component emit filter changes len parent hoac bind truc tiep voi store.

### 6. Tao component `MyIssuesTable` - `src/views/MyIssues/partials/MyIssuesTable.vue` (file moi)

- Su dung PrimeVue `DataTable` truc tiep (KHONG dung `AppDataTable` vi no force `lazy` mode, trong khi ta can **client-side pagination**)
- 4 cot: Issue No (`issueNumber`), Issue (`title`), Status (extract tu `labels`), Action
- **Action column**: 3 Button (Generate Branch, Start Coding, Create MR) - tam thoi chi emit event, chua xu ly logic
- Paginator built-in cua PrimeVue cho FE pagination
- Nhan data tu prop `issues` (da duoc filter tu store)

### 7. Cap nhat `MyIssuesView` - [src/views/MyIssues/MyIssuesView.vue](src/views/MyIssues/MyIssuesView.vue)

- Import va su dung `useMyIssuesStore`
- Goi `fetchProjects()` va `fetchIssues()` khi mounted
- Render `MyIssuesFilter` va `MyIssuesTable`
- Truyen `filteredIssues` tu store xuong `MyIssuesTable`

## Luu y quan trong

- **FE Pagination**: Vi API tra ve toan bo issues, pagination duoc xu ly hoan toan o client-side bang PrimeVue DataTable built-in (khong dung `lazy` mode).
- **Filter logic**: Region va Status duoc extract tu `labels[]` cua moi issue. Release Number duoc lay tu `milestone.releaseNumber`.
- **issueState mapping**: Can xac nhan mapping so (0, 1, 2...) tuong ung voi trang thai nao. Tam thoi su dung `0` nhu trong payload mau.

