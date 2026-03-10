import type { Rule } from 'eslint'

interface RuleOptions {
  prefix?: string
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require v-html to use a function with "serialize" prefix for security',
    },
    schema: [
      {
        type: 'object',
        properties: {
          prefix: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      requireSerializeFunction:
        'v-html must use a function with "{{prefix}}" prefix for security. Use {{prefix}}Html(content) instead of direct content.',
      invalidExpression:
        'v-html expression must be a function call with "{{prefix}}" prefix.',
    },
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options as [RuleOptions?]
    const [{ prefix = 'serialize' } = {}] = options || []

    /**
     * Check if a function name has the required prefix
     * @param name - The function name to check
     * @returns true if the name has the required prefix
     */
    const hasRequiredPrefix = (name: string): boolean => {
      return name.startsWith(prefix)
    }

    /**
     * Check if a node is a function call with the required prefix
     * @param node - The AST node to check
     * @returns true if it's a valid function call
     */
    const isValidFunctionCall = (node: any): boolean => {
      // Check if it's a CallExpression (function call)
      if (node.type !== 'CallExpression') return false

      // Check if the callee is an Identifier (function name)
      if (node.callee?.type !== 'Identifier') return false

      // Check if the function name has the required prefix
      return hasRequiredPrefix(node.callee.name)
    }

    /**
     * Check if a node is a member expression with the required prefix
     * @param node - The AST node to check
     * @returns true if it's a valid member expression
     */
    const isValidMemberExpression = (node: any): boolean => {
      // Check if it's a MemberExpression (object.method)
      if (node.type !== 'MemberExpression') return false

      // Check if the property is an Identifier
      if (node.property?.type !== 'Identifier') return false

      // Check if the property name has the required prefix
      return hasRequiredPrefix(node.property.name)
    }

    /**
     * Check if a node is a valid expression for v-html
     * @param node - The AST node to check
     * @returns true if it's a valid expression
     */
    const isValidVHtmlExpression = (node: any): boolean => {
      // Allow function calls with required prefix
      if (isValidFunctionCall(node)) return true

      // Allow member expressions with required prefix
      if (isValidMemberExpression(node)) return true

      // Allow conditional expressions if both branches are valid
      if (node.type === 'ConditionalExpression') {
        return (
          isValidVHtmlExpression(node.consequent) &&
          isValidVHtmlExpression(node.alternate)
        )
      }

      // Allow logical expressions if both sides are valid
      if (node.type === 'LogicalExpression') {
        return (
          isValidVHtmlExpression(node.left) &&
          isValidVHtmlExpression(node.right)
        )
      }

      // Allow array expressions if all elements are valid
      if (node.type === 'ArrayExpression') {
        return node.elements.every((element: any) =>
          element ? isValidVHtmlExpression(element) : true,
        )
      }

      return false
    }

    return {
      VElement(node: any) {
        // Find v-html directive
        const vHtmlDirective = node.directives?.find(
          (directive: any) => directive.name.name === 'html',
        )

        if (!vHtmlDirective) return

        // Check if the expression is valid
        if (!isValidVHtmlExpression(vHtmlDirective.value)) {
          context.report({
            node: vHtmlDirective,
            messageId: 'requireSerializeFunction',
            data: { prefix },
          })
        }
      },
    }
  },
}

export default rule
