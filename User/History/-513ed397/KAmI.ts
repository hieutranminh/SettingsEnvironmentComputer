/**
 * Static service configuration
 * These values are identical across all environments (local, dev, staging, production)
 * and do not need to be in .env files
 */

// ---- Solution & Gateway ----

export const SOLUTION_ID = 3002
export const GATEWAY_VERSION = 1

// ---- Third-party Authentication Keys ----

// ---- Service API Version Pair ----

export interface ServiceApiVersions {
  readonly readVersion: number
  readonly cmdVersion: number
}

export interface ServiceConfig {
  readonly name: string
  readonly api: ServiceApiVersions
}

export interface ServiceReadOnlyConfig {
  readonly name: string
  readonly api: {
    readonly readVersion: number
  }
}

export interface ServiceCmdOnlyConfig {
  readonly name: string
  readonly api: {
    readonly cmdVersion: number
  }
}

// ---- Service Definitions ----

export const GITLAB_SERVICE: ServiceConfig = {
  name: 'GitLab',
  api: { readVersion: 1, cmdVersion: 1 },
} as const
