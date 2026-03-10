import { TSESLint, TSESTree } from '@typescript-eslint/utils'

type MessageIds = 'tooLong'
type Options = []

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow functions longer than 30 lines, except ones starting with use',
    },
    schema: [],
    messages: {
      tooLong: "Function '{{name}}' has too many lines ({{lines}}). Maximum allowed is 30.",
    },
  },

  create(context) {
    /**
     * Get function name from different node types
     * @param node - Function node
     * @returns Function name or undefined
     */
    function getFunctionName(node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression): string | undefined {
      // FunctionDeclaration has id property
      if (node.type === 'FunctionDeclaration' && node.id) {
        return node.id.name
      }

      // For FunctionExpression and ArrowFunctionExpression, check parent
      const parent = node.parent
      
      if (parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
        return parent.id.name
      }
      
      if (parent?.type === 'Property' && parent.key.type === 'Identifier') {
        return parent.key.name
      }
      
      if (parent?.type === 'MethodDefinition' && parent.key.type === 'Identifier') {
        return parent.key.name
      }

      return undefined
    }

    /**
     * Count actual code lines in a function (excluding empty lines and comments)
     * @param node - Function node
     * @returns Number of actual code lines
     */
    function countCodeLines(node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression): number {
      const sourceCode = context.getSourceCode()
      const lines = sourceCode.getLines()
      
      let codeLines = 0
      const startLine = node.loc.start.line - 1 // Convert to 0-based index
      const endLine = node.loc.end.line - 1 // Convert to 0-based index
      
      for (let i = startLine; i <= endLine; i++) {
        const line = lines[i]?.trim()
        // Count non-empty lines that are not comments
        if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
          codeLines++
        }
      }
      
      return codeLines
    }

    /**
     * Check if function exceeds line limit
     * @param node - Function node
     * @param name - Function name
     */
    function checkFunction(
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
      name?: string,
    ) {
      const functionName = name ?? getFunctionName(node) ?? '(anonymous)'

      // Skip functions starting with 'use' (Vue composables)
      if (functionName.startsWith('use')) return

      const codeLines = countCodeLines(node)
      
      if (codeLines > 30) {
        context.report({
          node,
          messageId: 'tooLong',
          data: { name: functionName, lines: codeLines },
        })
      }
    }

    return {
      FunctionDeclaration(node) {
        checkFunction(node)
      },
      FunctionExpression(node) {
        checkFunction(node)
      },
      ArrowFunctionExpression(node) {
        checkFunction(node)
      },
    }
  },
}

export default rule
