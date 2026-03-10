/**
 * Custom ESLint Rule: enforce-handle-prefix
 * 
 * This rule enforces that event handler functions must be named with a "handle" prefix.
 * This follows the project's coding standards for better code readability and consistency.
 * 
 * Examples:
 * ✅ Good: const handleClick = () => { ... }
 * ✅ Good: const handleKeyDown = (event: KeyboardEvent) => { ... }
 * ❌ Bad: const onClick = () => { ... }
 * ❌ Bad: const onKeyDown = (event: KeyboardEvent) => { ... }
 * 
 * @fileoverview Custom rule to enforce handle prefix for event handlers
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import type { Rule } from 'eslint'

/**
 * Rule configuration interface
 */
interface RuleOptions {
  /** List of allowed prefixes for event handlers */
  allowedPrefixes?: string[]
  /** List of function name patterns that should be checked */
  functionNamePatterns?: RegExp[]
  /** Whether to check arrow functions */
  checkArrowFunctions?: boolean
  /** Whether to check function declarations */
  checkFunctionDeclarations?: boolean
  /** Whether to check function expressions */
  checkFunctionExpressions?: boolean
}

/**
 * Default rule options
 */
const defaultOptions: Required<RuleOptions> = {
  allowedPrefixes: ['handle'],
  functionNamePatterns: [
    /^on[A-Z]/, // onClick, onKeyDown, etc.
    /^on[A-Z][a-z]/, // onInput, onSubmit, etc.
  ],
  checkArrowFunctions: true,
  checkFunctionDeclarations: true,
  checkFunctionExpressions: true,
}

/**
 * Check if a function name matches the event handler pattern
 * 
 * @param functionName - The name of the function to check
 * @param patterns - Array of regex patterns to match against
 * @returns True if the function name matches any pattern
 */
const isEventHandlerFunction = (functionName: string, patterns: RegExp[]): boolean => {
  return patterns.some(pattern => pattern.test(functionName))
}

/**
 * Check if a function name has an allowed prefix
 * 
 * @param functionName - The name of the function to check
 * @param allowedPrefixes - Array of allowed prefixes
 * @returns True if the function name starts with an allowed prefix
 */
const hasAllowedPrefix = (functionName: string, allowedPrefixes: string[]): boolean => {
  return allowedPrefixes.some(prefix => functionName.startsWith(prefix))
}

/**
 * Get the suggested function name with handle prefix
 * 
 * @param functionName - The original function name
 * @returns The suggested function name with handle prefix
 */
const getSuggestedName = (functionName: string): string => {
  // Remove 'on' prefix and convert to handle prefix
  if (functionName.startsWith('on')) {
    const withoutOn = functionName.slice(2)
    return `handle${withoutOn}`
  }
  
  // If it doesn't start with 'on', just add handle prefix
  return `handle${functionName.charAt(0).toUpperCase()}${functionName.slice(1)}`
}

/**
 * Main rule implementation
 */
const enforceHandlePrefixRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce handle prefix for event handler functions',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/ahasoft/vue3-typescript-eslint-rules',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          allowedPrefixes: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          functionNamePatterns: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
          checkArrowFunctions: { type: 'boolean' },
          checkFunctionDeclarations: { type: 'boolean' },
          checkFunctionExpressions: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingHandlePrefix: 'Event handler function "{{functionName}}" should be prefixed with "handle". Suggested name: "{{suggestedName}}"',
      invalidPrefix: 'Event handler function "{{functionName}}" should use one of the allowed prefixes: {{allowedPrefixes}}',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = { ...defaultOptions, ...context.options[0] }
    const { allowedPrefixes, functionNamePatterns, checkArrowFunctions, checkFunctionDeclarations, checkFunctionExpressions } = options

    /**
     * Check function name and report if it doesn't follow the naming convention
     */
    const checkFunctionName = (node: any, functionName: string, functionType: string): void => {
      // Skip if function name doesn't match event handler patterns
      if (!isEventHandlerFunction(functionName, functionNamePatterns)) {
        return
      }

      // Check if function has allowed prefix
      if (!hasAllowedPrefix(functionName, allowedPrefixes)) {
        const suggestedName = getSuggestedName(functionName)
        
        context.report({
          node,
          messageId: 'missingHandlePrefix',
          data: {
            functionName,
            suggestedName,
          },
          fix(fixer) {
            // Only provide fix if the function is a simple arrow function or function declaration
            if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionDeclaration') {
              return fixer.replaceText(node.id || node, suggestedName)
            }
            return null
          },
        })
      }
    }

    return {
      // Check arrow function expressions
      ...(checkArrowFunctions && {
        ArrowFunctionExpression(node: any) {
          if (node.id && node.id.type === 'Identifier') {
            checkFunctionName(node, node.id.name, 'arrow function')
          }
        },
      }),

      // Check function declarations
      ...(checkFunctionDeclarations && {
        FunctionDeclaration(node: any) {
          if (node.id && node.id.type === 'Identifier') {
            checkFunctionName(node, node.id.name, 'function declaration')
          }
        },
      }),

      // Check function expressions
      ...(checkFunctionExpressions && {
        FunctionExpression(node: any) {
          if (node.id && node.id.type === 'Identifier') {
            checkFunctionName(node, node.id.name, 'function expression')
          }
        },
      }),

      // Check variable declarations with function assignments
      VariableDeclarator(node: any) {
        if (node.id && node.id.type === 'Identifier' && node.init) {
          const init = node.init
          
          // Check arrow function assignments
          if (checkArrowFunctions && init.type === 'ArrowFunctionExpression') {
            checkFunctionName(node, node.id.name, 'arrow function assignment')
          }
          
          // Check function expression assignments
          if (checkFunctionExpressions && init.type === 'FunctionExpression') {
            checkFunctionName(node, node.id.name, 'function expression assignment')
          }
        }
      },
    }
  },
}

export default enforceHandlePrefixRule
