import { apiEndpoint, apiRead, apiAggr, apiCmd, apiPostWithType } from '@/services/api'
import type { Goods } from '@/services/goods/goods.read'

// Example 1: Using the endpoint builder directly
const example1 = async () => {
  // Build endpoint with specific type and version
  const endpoint = apiEndpoint.withType('cmd').withVersion('v1').build('goods')
  console.log(endpoint) // Output: /api/cmd/v1/goods
}

// Example 2: Using pre-configured builders
const example2 = async () => {
  // Using cmd builder (defaults to v1)
  await apiCmd.post<Goods>('goods', { name: 'Test Product' })

  // Using read builder with specific version
  await apiRead.get<Goods[]>('goods', 'v2')

  // Using aggr builder
  await apiAggr.get<{ total: number }>('goods/stats')
}

// Example 3: Using the enhanced API methods with explicit type and version
const example3 = async () => {
  // Create goods using cmd v1
  const newGoods = await apiPostWithType<Goods>('goods', { name: 'Product' }, 'cmd', 'v1')

  // Read goods using read v2
  const goods = await apiPostWithType<Goods>('goods/search', { category: 'electronics' }, 'read', 'v2')
}

// Example 4: Dynamic endpoint building in components
const example4 = () => {
  // In a Vue component, you can use the composable
  const { cmd, read, aggr } = apiEndpoint

  // Use in async functions
  const handleCreateGoods = async (data: any) => {
    return await cmd().post<Goods>('goods', data)
  }

  const handleGetGoods = async () => {
    return await read('v2').get<Goods[]>('goods')
  }

  const handleGetStats = async () => {
    return await aggr().get<{ total: number }>('goods/stats')
  }
}

// Example 5: Changing default configuration
const example5 = () => {
  // Set default type to 'read' and version to 'v2'
  apiEndpoint.setConfig({ type: 'read', version: 'v2' })

  // Now all calls will use read/v2 by default
  const endpoint = apiEndpoint.build('goods') // Output: /api/read/v2/goods

  // Reset to defaults
  apiEndpoint.resetConfig()
}

export {
  example1,
  example2,
  example3,
  example4,
  example5
}
