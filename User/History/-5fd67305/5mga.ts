import type { DATE_TYPE } from '@/constants'

export type DateViewMode = 'date' | 'month' | 'year'
export type DateType = (typeof DATE_TYPE)[keyof typeof DATE_TYPE]
export type DateValue = Date | null | undefined | Date[] | (Date | null)[]
