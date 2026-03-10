/**
 * User type definitions for example usage
 */

export interface IUserData {
  name: string
  email: string
  id?: number
}

export interface IUserProfile {
  firstName: string
  lastName: string
  avatar?: string
}

export type UserRole = 'admin' | 'user' | 'guest'
