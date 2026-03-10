import { GITLAB_SERVICE } from '@/config/services'

import type { ApiResponse } from '@/types/api'
import type {
  GitLabAuthenticateUserRequest,
  GitLabLoginRequest,
  GitLabLoginResult,
} from '@/types/auth'
import type {
  CreateBranchRequest,
  CreateBranchResult,
  GenerateBranchNameRequest,
  GenerateBranchNameResult,
  GitLabIssueListResult,
  GitLabIssuesByUserRequest,
  GitLabProjectListResult,
  ProjectUserRequest,
  ProjectUserResult,
  StartIssueRequest,
  StartIssueResult,
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
    return gatewayService.read<GitLabIssueListResult>(GITLAB_SERVICE, 'IssuesByUser', request, {
      skipLoading: true,
    })
  },

  /**
   * Generate a branch name from issue metadata.
   * Endpoint: POST api/cmd/v1/GitLab/GenerateBranchName
   */
  async generateBranchName(
    request: GenerateBranchNameRequest,
  ): Promise<ApiResponse<GenerateBranchNameResult>> {
    return gatewayService.command<GenerateBranchNameResult>(
      GITLAB_SERVICE,
      'GenerateBranchName',
      request,
      { skipLoading: true },
    )
  },

  /**
   * Start working on an issue (changes status to Doing).
   * Endpoint: POST api/cmd/v1/GitLab/StartIssue
   */
  async startIssue(request: StartIssueRequest): Promise<ApiResponse<StartIssueResult>> {
    return gatewayService.command<StartIssueResult>(GITLAB_SERVICE, 'StartIssue', request)
  },

  /**
   * Create a new branch in a GitLab project.
   * Endpoint: POST api/cmd/v1/GitLab/CreateBranch
   */
  async createBranch(request: CreateBranchRequest): Promise<ApiResponse<CreateBranchResult>> {
    return gatewayService.command<CreateBranchResult>(GITLAB_SERVICE, 'CreateBranch', request)
  },

  /**
   * Fetch project users (members) for a GitLab project.
   * Endpoint: POST api/read/v1/GitLab/ProjectUser
   */
  async getProjectUsers(request: ProjectUserRequest): Promise<ApiResponse<ProjectUserResult>> {
    return gatewayService.read<ProjectUserResult>(GITLAB_SERVICE, 'ProjectUser', request)
  },
}
