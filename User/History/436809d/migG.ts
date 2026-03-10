import { GITLAB_SERVICE } from '@/config/services'

import type { ApiResponse } from '@/types/api'
import type {
  GitLabAuthenticateUserRequest,
  GitLabLoginRequest,
  GitLabLoginResult,
} from '@/types/auth'
import type {
  GitLabIssueListResult,
  GitLabIssuesByUserRequest,
  GitLabProjectListResult,
} from '@/types/gitlab'

import { gatewayService } from './base'

export const gitlabApi = {
  /**
   * Exchange GitLab OAuth authorization code for access tokens.
   * Endpoint: POST api/cmd/v1/GitLab/Login
   */
  async login(request: GitLabLoginRequest): Promise<ApiResponse<GitLabLoginResult>> {
    return gatewayService.command<GitLabLoginResult>(GITLAB_SERVICE, 'Login', request, {
      skipAuth: true,
      skipAuthRedirect: true,
      skipLoading: true,
    })
  },

  /**
   * Refresh GitLab OAuth tokens using the current refresh token.
   * Endpoint: POST api/cmd/v1/GitLab/AuthenticateUser
   *
   * NOTE: This method is not called directly by application code.
   * Token refresh is handled by src/api/interceptors/tokenRefresh.ts,
   * which calls the endpoint via the raw axios instance to avoid
   * circular module dependencies (gitlab.ts -> base.ts -> interceptors -> gitlab.ts).
   * Kept here as the canonical API surface for this endpoint.
   */
  async authenticateUser(
    request: GitLabAuthenticateUserRequest,
  ): Promise<ApiResponse<GitLabLoginResult>> {
    return gatewayService.command<GitLabLoginResult>(GITLAB_SERVICE, 'AuthenticateUser', request, {
      skipAuth: true,
      skipAuthRedirect: true,
      skipLoading: true,
    })
  },

  /**
   * Fetch all GitLab projects.
   * Endpoint: POST api/read/v1/GitLab/ProjectListed
   */
  async getProjects(): Promise<ApiResponse<GitLabProjectListResult>> {
    return gatewayService.read<GitLabProjectListResult>(GITLAB_SERVICE, 'ProjectListed')
  },

  /**
   * Fetch issues assigned to the current user for a given project.
   * Endpoint: POST api/read/v1/GitLab/IssuesByUser
   */
  async getIssuesByUser(
    request: GitLabIssuesByUserRequest,
  ): Promise<ApiResponse<GitLabIssueListResult>> {
    return gatewayService.read<GitLabIssueListResult>(GITLAB_SERVICE, 'IssuesByUser', request)
  },
}
