import { FILTER_VALUES } from '@/constants'
export interface ISelectOption {
  id: number
  name: string
}

export interface ICreateSelectOptionsConfig<T> {
  items: T[]
  labelKey: keyof T
  valueKey: keyof T
  allLabel?: string
  includeAll?: boolean
  transform?: (item: T) => Partial<ISelectOption>
}

export const createSelectOptions = <T>({
  items,
  labelKey,
  valueKey,
  allLabel = 'All',
  includeAll = true,
  transform,
}: ICreateSelectOptionsConfig<T>): ISelectOption[] => {
  if (!items || items.length === 0)
    return includeAll ? [{ id: FILTER_VALUES.ALL, name: allLabel }] : ([] as ISelectOption[])

  const options: ISelectOption[] = items.map((item: T) => {
    const baseOption: ISelectOption = {
      id: Number(item[valueKey]),
      name: String(item[labelKey]),
    }

    return transform ? { ...baseOption, ...transform(item) } : baseOption
  })

  return includeAll
    ? [{ id: FILTER_VALUES.ALL, name: allLabel }, ...options]
    : (options as ISelectOption[])
}
