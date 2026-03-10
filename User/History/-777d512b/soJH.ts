export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('vi-VN')
}

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    cancelled: 'Đã hủy',
    active: 'Hoạt động',
    expired: 'Hết hạn',
    used: 'Đã sử dụng',
  }
  return statusMap[status] || status
}
