/**
 * Custom ESLint Rule: enforce-typescript-strict
 *
 * This rule enforces strict TypeScript patterns and prevents common anti-patterns
 * that can lead to type safety issues or poor code quality.
 *
 * Examples:
 * ✅ Good: const user: User = getUser()
 * ❌ Bad: const user: any = getUser()
 * ✅ Good: const handleClick = (): void => { ... }
 * ❌ Bad: const handleClick = () => { ... }
 *
 * @fileoverview Custom rule to enforce strict TypeScript patterns
 * @author Ahasoft Development Team
 * @version 1.0.0
 */

import type { Rule } from 'eslint'

/**
 * Rule configuration interface
 */
interface RuleOptions {
  /** Whether to enforce explicit return types */
  enforceExplicitReturnTypes?: boolean
  /** Whether to prevent 'any' type usage */
  preventAnyType?: boolean
  /** Whether to enforce interface naming convention */
  enforceInterfaceNaming?: boolean
  /** Whether to enforce type imports */
  enforceTypeImports?: boolean
  /** List of allowed 'any' usage patterns */
  allowedAnyPatterns?: string[]
}

/**
 * Default rule options
 */
const defaultOptions: Required<RuleOptions> = {
  enforceExplicitReturnTypes: true,
  preventAnyType: true,
  enforceInterfaceNaming: true,
  enforceTypeImports: true,
  allowedAnyPatterns: [],
}

/**
 * Check if a type annotation uses 'any'
 *
 * @param node - The AST node to check
 * @returns True if the node uses 'any' type
 */
const hasAnyType = (node: any): boolean => {
  if (!node.typeAnnotation) return false

  const typeAnnotation = node.typeAnnotation.typeAnnotation
  return typeAnnotation && typeAnnotation.type === 'TSAnyKeyword'
}

/**
 * Check if a function has explicit return type
 *
 * @param node - The AST node to check
 * @returns True if the function has explicit return type
 */
const hasExplicitReturnType = (node: any): boolean => {
  return node.returnType && node.returnType.typeAnnotation
}

/**
 * Check if an interface follows naming convention (starts with 'I')
 *
 * @param node - The AST node to check
 * @returns True if the interface follows naming convention
 */
const followsInterfaceNaming = (node: any): boolean => {
  if (node.type !== 'TSInterfaceDeclaration') return true
  return node.id.name.startsWith('I')
}

/**
 * Check if an import is a type import
 *
 * @param node - The AST node to check
 * @returns True if the import is a type import
 */
const isTypeImport = (node: any): boolean => {
  return node.importKind === 'type'
}

/**
 * Check if a type should be imported as type
 *
 * @param node - The AST node to check
 * @returns True if the import should be a type import
 */
const shouldBeTypeImport = (node: any): boolean => {
  if (!node.specifiers) return false

  return node.specifiers.some((spec: any) => {
    if (spec.type === 'ImportDefaultSpecifier') return false
    if (spec.type === 'ImportNamespaceSpecifier') return false

    // Check if the imported name looks like a type
    const importedName = spec.imported?.name || spec.local?.name
    return (
      importedName &&
      (importedName.startsWith('I') || // Interface
        importedName.endsWith('Type') || // Type alias
        importedName.endsWith('Interface') || // Interface
        importedName.endsWith('Props') || // Props type
        importedName.endsWith('Config')) // Config type
    )
  })
}

/**
 * Main rule implementation
 */
const enforceTypeScriptStrictRule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce strict TypeScript patterns and prevent common anti-patterns',
      category: 'Best Practices',
      recommended: true,
      url: 'https://github.com/ahasoft/vue3-typescript-eslint-rules',
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          enforceExplicitReturnTypes: { type: 'boolean' },
          preventAnyType: { type: 'boolean' },
          enforceInterfaceNaming: { type: 'boolean' },
          enforceTypeImports: { type: 'boolean' },
          allowedAnyPatterns: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      explicitReturnType: 'Function "{{functionName}}" should have explicit return type annotation.',
      avoidAnyType: 'Avoid using "any" type. Use specific types instead.',
      interfaceNaming: 'Interface "{{interfaceName}}" should start with "I" prefix.',
      useTypeImport: 'Import "{{importName}}" should be a type import.',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = { ...defaultOptions, ...context.options[0] }
    const { enforceExplicitReturnTypes, preventAnyType, enforceInterfaceNaming, enforceTypeImports } = options

    return {
      // Check function declarations
      ...(enforceExplicitReturnTypes && {
        FunctionDeclaration(node: any) {
          if (node.id && !hasExplicitReturnType(node)) {
            context.report({
              node,
              messageId: 'explicitReturnType',
              data: {
                functionName: node.id.name,
              },
            })
          }
        },
      }),

      // Check arrow function expressions
      ...(enforceExplicitReturnTypes && {
        ArrowFunctionExpression(node: any) {
          if (node.parent && node.parent.type === 'VariableDeclarator' && !hasExplicitReturnType(node)) {
            const functionName = node.parent.id?.name
            if (functionName) {
              context.report({
                node,
                messageId: 'explicitReturnType',
                data: {
                  functionName,
                },
              })
            }
          }
        },
      }),

      // Check for 'any' type usage
      ...(preventAnyType && {
        TSAnyKeyword(node: any) {
          context.report({
            node,
            messageId: 'avoidAnyType',
          })
        },
      }),

      // Check interface naming
      ...(enforceInterfaceNaming && {
        TSInterfaceDeclaration(node: any) {
          if (!followsInterfaceNaming(node)) {
            context.report({
              node,
              messageId: 'interfaceNaming',
              data: {
                interfaceName: node.id.name,
              },
            })
          }
        },
      }),

      // Check import statements
      ...(enforceTypeImports && {
        ImportDeclaration(node: any) {
          if (shouldBeTypeImport(node) && !isTypeImport(node)) {
            const importName = node.source.value
            context.report({
              node,
              messageId: 'useTypeImport',
              data: {
                importName,
              },
              fix(fixer) {
                return fixer.insertTextBefore(node, 'type ')
              },
            })
          }
        },
      }),
    }
  },
}

export default enforceTypeScriptStrictRule
