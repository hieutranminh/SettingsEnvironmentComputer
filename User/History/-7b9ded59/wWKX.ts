import { FILTER_VALUES } from '@/constants'
export interface SelectOption {
  id: number
  name: string
}

export interface CreateSelectOptionsConfig<T> {
  items: T[]
  labelKey: keyof T
  valueKey: keyof T
  allLabel?: string
  includeAll?: boolean
  transform?: (item: T) => Partial<SelectOption>
}

export const createSelectOptions = <T>({
  items,
  labelKey,
  valueKey,
  allLabel = 'All',
  includeAll = true,
  transform,
}: CreateSelectOptionsConfig<T>): SelectOption[] => {
  if (!items || items.length === 0) return []

  const options: SelectOption[] = items.map((item) => {
    const baseOption: SelectOption = {
      id: Number(item[valueKey]),
      name: String(item[labelKey]),
    }

    return transform ? { ...baseOption, ...transform(item) } : baseOption
  })

  console.log('options', options, includeAll)
  return includeAll ? [{ id: FILTER_VALUES.ALL, name: allLabel }, ...options] : options
}
