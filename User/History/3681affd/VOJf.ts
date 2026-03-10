/**
 * Test file for enforce-handle-prefix custom ESLint rule
 * 
 * This file contains comprehensive tests for the enforce-handle-prefix rule
 * to ensure it correctly identifies and reports violations.
 * 
 * @fileoverview Test suite for enforce-handle-prefix rule
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import { RuleTester } from 'eslint'
import enforceHandlePrefix from '../enforce-handle-prefix'

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('enforce-handle-prefix', () => {
  ruleTester.run('enforce-handle-prefix', enforceHandlePrefix, {
    valid: [
      // Valid arrow functions with handle prefix
      {
        code: 'const handleClick = () => { console.log("clicked") }',
        filename: 'test.ts',
      },
      {
        code: 'const handleKeyDown = (event: KeyboardEvent) => { console.log(event) }',
        filename: 'test.ts',
      },
      {
        code: 'const handleSubmit = (data: FormData) => { console.log(data) }',
        filename: 'test.ts',
      },
      
      // Valid function declarations with handle prefix
      {
        code: 'function handleClick() { console.log("clicked") }',
        filename: 'test.ts',
      },
      {
        code: 'function handleKeyDown(event: KeyboardEvent) { console.log(event) }',
        filename: 'test.ts',
      },
      
      // Valid function expressions with handle prefix
      {
        code: 'const handleClick = function() { console.log("clicked") }',
        filename: 'test.ts',
      },
      
      // Non-event handler functions (should not be checked)
      {
        code: 'const getUserData = () => { return userData }',
        filename: 'test.ts',
      },
      {
        code: 'const calculateTotal = (items: Item[]) => { return items.reduce((sum, item) => sum + item.price, 0) }',
        filename: 'test.ts',
      },
      {
        code: 'const validateEmail = (email: string) => { return email.includes("@") }',
        filename: 'test.ts',
      },
    ],
    
    invalid: [
      // Invalid arrow functions without handle prefix
      {
        code: 'const onClick = () => { console.log("clicked") }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onClick',
              suggestedName: 'handleClick',
            },
          },
        ],
        output: 'const handleClick = () => { console.log("clicked") }',
      },
      {
        code: 'const onKeyDown = (event: KeyboardEvent) => { console.log(event) }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onKeyDown',
              suggestedName: 'handleKeyDown',
            },
          },
        ],
        output: 'const handleKeyDown = (event: KeyboardEvent) => { console.log(event) }',
      },
      {
        code: 'const onSubmit = (data: FormData) => { console.log(data) }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onSubmit',
              suggestedName: 'handleSubmit',
            },
          },
        ],
        output: 'const handleSubmit = (data: FormData) => { console.log(data) }',
      },
      
      // Invalid function declarations without handle prefix
      {
        code: 'function onClick() { console.log("clicked") }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onClick',
              suggestedName: 'handleClick',
            },
          },
        ],
        output: 'function handleClick() { console.log("clicked") }',
      },
      {
        code: 'function onKeyDown(event: KeyboardEvent) { console.log(event) }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onKeyDown',
              suggestedName: 'handleKeyDown',
            },
          },
        ],
        output: 'function handleKeyDown(event: KeyboardEvent) { console.log(event) }',
      },
      
      // Invalid function expressions without handle prefix
      {
        code: 'const onClick = function() { console.log("clicked") }',
        filename: 'test.ts',
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onClick',
              suggestedName: 'handleClick',
            },
          },
        ],
        output: 'const handleClick = function() { console.log("clicked") }',
      },
    ],
  })
})

describe('enforce-handle-prefix with custom options', () => {
  ruleTester.run('enforce-handle-prefix', enforceHandlePrefix, {
    valid: [
      // Valid with custom allowed prefixes
      {
        code: 'const processClick = () => { console.log("clicked") }',
        filename: 'test.ts',
        options: [
          {
            allowedPrefixes: ['handle', 'process'],
            functionNamePatterns: [/^on[A-Z]/],
          },
        ],
      },
    ],
    
    invalid: [
      // Invalid with custom allowed prefixes
      {
        code: 'const onClick = () => { console.log("clicked") }',
        filename: 'test.ts',
        options: [
          {
            allowedPrefixes: ['handle', 'process'],
            functionNamePatterns: [/^on[A-Z]/],
          },
        ],
        errors: [
          {
            messageId: 'missingHandlePrefix',
            data: {
              functionName: 'onClick',
              suggestedName: 'handleClick',
            },
          },
        ],
      },
    ],
  })
})
