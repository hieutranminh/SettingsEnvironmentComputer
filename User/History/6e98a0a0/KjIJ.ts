import { gatewayService } from './base'
import { IDENTITIES_SERVICE } from '@/config/services'
import type { ApiResponse } from '@/types/api'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export const authApi = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    return gatewayService.command<LoginResponse>(IDENTITIES_SERVICE, 'auth/login', credentials, {
      skipAuth: true,
      skipAuthRedirect: true,
    })
  },
}
