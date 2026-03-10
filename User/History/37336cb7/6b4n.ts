/**
 * Test file for enforce-typescript-strict custom ESLint rule
 * 
 * This file contains comprehensive tests for the enforce-typescript-strict rule
 * to ensure it correctly identifies and reports violations.
 * 
 * @fileoverview Test suite for enforce-typescript-strict rule
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import { RuleTester } from 'eslint'
import enforceTypeScriptStrict from '../enforce-typescript-strict'

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
})

describe('enforce-typescript-strict', () => {
  ruleTester.run('enforce-typescript-strict', enforceTypeScriptStrict, {
    valid: [
      // Valid function declarations with explicit return types
      {
        code: 'function getUserData(): UserData { return userData }',
        filename: 'test.ts',
      },
      {
        code: 'function handleClick(): void { console.log("clicked") }',
        filename: 'test.ts',
      },
      
      // Valid arrow functions with explicit return types
      {
        code: 'const getUserData = (): UserData => { return userData }',
        filename: 'test.ts',
      },
      {
        code: 'const handleClick = (): void => { console.log("clicked") }',
        filename: 'test.ts',
      },
      
      // Valid interface declarations with I prefix
      {
        code: 'interface IUserData { name: string; email: string }',
        filename: 'test.ts',
      },
      {
        code: 'interface IApiResponse<T> { data: T; status: number }',
        filename: 'test.ts',
      },
      
      // Valid type imports
      {
        code: 'import type { UserData } from "./types"',
        filename: 'test.ts',
      },
      {
        code: 'import type { IApiResponse } from "./types"',
        filename: 'test.ts',
      },
      
      // Valid regular imports (non-type)
      {
        code: 'import { getUserData } from "./services"',
        filename: 'test.ts',
      },
      {
        code: 'import { UserService } from "./services"',
        filename: 'test.ts',
      },
    ],
    
    invalid: [
      // Invalid function declarations without explicit return types
      {
        code: 'function getUserData() { return userData }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'explicitReturnType',
            data: {
              functionName: 'getUserData',
            },
          },
        ],
      },
      {
        code: 'function handleClick() { console.log("clicked") }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'explicitReturnType',
            data: {
              functionName: 'handleClick',
            },
          },
        ],
      },
      
      // Invalid arrow functions without explicit return types
      {
        code: 'const getUserData = () => { return userData }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'explicitReturnType',
            data: {
              functionName: 'getUserData',
            },
          },
        ],
      },
      {
        code: 'const handleClick = () => { console.log("clicked") }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'explicitReturnType',
            data: {
              functionName: 'handleClick',
            },
          },
        ],
      },
      
      // Invalid interface declarations without I prefix
      {
        code: 'interface UserData { name: string; email: string }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'interfaceNaming',
            data: {
              interfaceName: 'UserData',
            },
          },
        ],
      },
      {
        code: 'interface ApiResponse<T> { data: T; status: number }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'interfaceNaming',
            data: {
              interfaceName: 'ApiResponse',
            },
          },
        ],
      },
      
      // Invalid type imports (should be type imports)
      {
        code: 'import { UserData } from "./types"',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'useTypeImport',
            data: {
              importName: './types',
            },
          },
        ],
        output: 'import type { UserData } from "./types"',
      },
      {
        code: 'import { IApiResponse } from "./types"',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'useTypeImport',
            data: {
              importName: './types',
            },
          },
        ],
        output: 'import type { IApiResponse } from "./types"',
      },
    ],
  })
})

describe('enforce-typescript-strict with custom options', () => {
  ruleTester.run('enforce-typescript-strict', enforceTypeScriptStrict, {
    valid: [
      // Valid with disabled explicit return types
      {
        code: 'function getUserData() { return userData }',
        filename: 'test.ts',
        options: [
          {
            enforceExplicitReturnTypes: false,
            preventAnyType: true,
            enforceInterfaceNaming: true,
            enforceTypeImports: true,
          },
        ],
      },
      
      // Valid with disabled interface naming
      {
        code: 'interface UserData { name: string; email: string }',
        filename: 'test.ts',
        options: [
          {
            enforceExplicitReturnTypes: true,
            preventAnyType: true,
            enforceInterfaceNaming: false,
            enforceTypeImports: true,
          },
        ],
      },
      
      // Valid with disabled type imports
      {
        code: 'import { UserData } from "./types"',
        filename: 'test.ts',
        options: [
          {
            enforceExplicitReturnTypes: true,
            preventAnyType: true,
            enforceInterfaceNaming: true,
            enforceTypeImports: false,
          },
        ],
      },
    ],
    
    invalid: [
      // Invalid with custom options (some rules still enabled)
      {
        code: 'function getUserData() { return userData }',
        filename: 'test.ts',
        options: [
          {
            enforceExplicitReturnTypes: true,
            preventAnyType: false,
            enforceInterfaceNaming: false,
            enforceTypeImports: false,
          },
        ],
        errors: [
          {
            messageId: 'explicitReturnType',
            data: {
              functionName: 'getUserData',
            },
          },
        ],
      },
    ],
  })
})
