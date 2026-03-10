export type StatusSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary'

export interface StatusOption {
  label: string
  value: string
  severity: StatusSeverity
}

export const DEFAULT_PROJECT_ID = 64741346

export const REGION_OPTIONS = [
  { label: 'VN', value: 'VN' },
  { label: 'KR', value: 'KR' },
] as const

export const DOING_STATUS_LABEL = 'Doing'
export const MERGING_STATUS_LABEL = 'Merging'

export const STATUS_OPTIONS: readonly StatusOption[] = [
  { label: 'Todo', value: 'Todo', severity: 'info' },
  { label: 'Doing', value: 'Doing', severity: 'success' },
  { label: 'Verifying', value: 'Verifying', severity: 'warn' },
  { label: 'Merging', value: 'Merging', severity: 'danger' },
] as const

export const STATUS_VALUES: Set<string> = new Set(STATUS_OPTIONS.map((opt) => opt.value))

export const STATUS_SEVERITY_MAP: Record<string, StatusSeverity> = Object.fromEntries(
  STATUS_OPTIONS.map((opt) => [opt.value, opt.severity]),
) as Record<string, StatusSeverity>

export const PAGINATOR_TEMPLATE =
  'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport'
