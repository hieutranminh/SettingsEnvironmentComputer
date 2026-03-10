export interface TableRowData {
  countingBasis: string
  [key: string]: string | number
}

export interface VisitingClientsRowData extends TableRowData {
  new: number
  revisit: number
  total: number
  unregistered: number
  grandTotal: number
}

export interface VisitingMembersRowData extends TableRowData {
  firstPurchase: number
  repurchase: number
  total: number
  deduction: number
}

export interface TableColumnConfig {
  field: string
  header: string
  headerClass?: string
  rowspan?: number
  colspan?: number
}

export interface TableHeaderConfig {
  rows: TableHeaderRowConfig[]
}

export interface TableHeaderRowConfig {
  columns: TableColumnConfig[]
}

export interface TableConfiguration {
  title: string
  headerConfig: TableHeaderConfig
  dataTransformer: (data: any) => TableRowData[]
  printConfigGetter: () => any
  tableRef: string
}

export interface ClientsByPeriodTableConfig {
  visitingClients: TableConfiguration
  visitingMembers: TableConfiguration
}
