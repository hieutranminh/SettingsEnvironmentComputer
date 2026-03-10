import { describe, it, expect, vi } from 'vitest'
import {
  useModelBinding,
  useStringModelBinding,
  useNumberModelBinding,
  useBooleanModelBinding,
} from '../useModelBinding'

// Mock Vue's computed
vi.mock('vue', () => ({
  computed: (fn: any) => fn,
}))

describe('useModelBinding', () => {
  interface TestModel {
    name: string
    age: number
    isActive: boolean
    items: string[]
  }

  const mockProps = {
    modelValue: {
      name: 'John',
      age: 30,
      isActive: true,
      items: ['item1', 'item2'],
    } as TestModel,
  }

  const mockEmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create model binding for any property', () => {
    const nameModel = useModelBinding(mockProps, mockEmit, 'name')

    expect(nameModel.get()).toBe('John')

    nameModel.set('Jane')
    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
      name: 'Jane',
      age: 30,
      isActive: true,
      items: ['item1', 'item2'],
    })
  })

  it('should create string model binding with type safety', () => {
    const nameModel = useStringModelBinding(mockProps, mockEmit, 'name')

    expect(nameModel.get()).toBe('John')

    nameModel.set('Jane')
    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
      name: 'Jane',
      age: 30,
      isActive: true,
      items: ['item1', 'item2'],
    })
  })

  it('should create number model binding with type safety', () => {
    const ageModel = useNumberModelBinding(mockProps, mockEmit, 'age')

    expect(ageModel.get()).toBe(30)

    ageModel.set(25)
    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
      name: 'John',
      age: 25,
      isActive: true,
      items: ['item1', 'item2'],
    })
  })

  it('should create boolean model binding with type safety', () => {
    const isActiveModel = useBooleanModelBinding(mockProps, mockEmit, 'isActive')

    expect(isActiveModel.get()).toBe(true)

    isActiveModel.set(false)
    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
      name: 'John',
      age: 30,
      isActive: false,
      items: ['item1', 'item2'],
    })
  })

  it('should handle additional updates', () => {
    const nameModel = useModelBinding(mockProps, mockEmit, 'name', { isActive: false })

    nameModel.set('Jane')
    expect(mockEmit).toHaveBeenCalledWith('update:modelValue', {
      name: 'Jane',
      age: 30,
      isActive: false, // Additional update
      items: ['item1', 'item2'],
    })
  })

  it('should handle undefined values gracefully', () => {
    const propsWithUndefined = {
      modelValue: {
        name: undefined,
        age: null,
        isActive: false,
        items: [],
      } as any,
    }

    const nameModel = useStringModelBinding(propsWithUndefined, mockEmit, 'name')
    expect(nameModel.get()).toBe('')

    const ageModel = useNumberModelBinding(propsWithUndefined, mockEmit, 'age')
    expect(ageModel.get()).toBe(0)
  })
})
