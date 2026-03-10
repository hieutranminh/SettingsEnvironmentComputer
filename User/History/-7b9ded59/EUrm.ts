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

  const options = items.map((item) => {
    const baseOption = {
      id: item[valueKey],
      name: item[labelKey],
    }

    return transform ? { ...baseOption, ...transform(item) } : baseOption
  })

  return includeAll ? [{ id: FILTER_VALUES.ALL, name: allLabel }, ...options] : (options as SelectOption[])
}
