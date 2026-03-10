import type { DATE_RANGE_MODE, DATE_TYPE } from '@/constants'

export type DateViewMode = 'date' | 'month' | 'year'
export type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
export type DateValue = Date | null | undefined | Date[] | (Date | null)[]
export type DateRangeMode = (typeof DATE_RANGE_MODE)[keyof typeof DATE_RANGE_MODE]
