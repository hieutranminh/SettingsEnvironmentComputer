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
    function getFunctionName(
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): string | undefined {
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
     * Check if a line is part of destructuring or object declaration
     * @param line - Line content
     * @param lines - All lines array
     * @param lineIndex - Current line index
     * @returns True if line is part of destructuring/object declaration
     */
    function isDestructuringOrObjectLine(line: string, lines: string[], lineIndex: number): boolean {
      const trimmedLine = line.trim()

      // Check for destructuring patterns
      if (trimmedLine.includes('{') || trimmedLine.includes('[')) {
        // Check if this is a destructuring assignment
        if (trimmedLine.includes('=') && (trimmedLine.includes('{') || trimmedLine.includes('['))) {
          return true
        }

        // Check if this is part of a multi-line destructuring/object
        // Look backwards to see if previous line started destructuring
        for (let i = lineIndex - 1; i >= 0; i--) {
          const prevLine = lines[i]?.trim()
          if (!prevLine) continue

          // If we find a line with destructuring start, this is continuation
          if (prevLine.includes('{') || prevLine.includes('[')) {
            return true
          }

          // If we find a line that doesn't end with comma, we're not in destructuring
          if (!prevLine.endsWith(',') && !prevLine.endsWith('{') && !prevLine.endsWith('[')) {
            break
          }
        }
      }

      // Check for object literal patterns
      if (trimmedLine.includes(':') && (trimmedLine.includes('{') || trimmedLine.includes('['))) {
        return true
      }

      // Check if line is continuation of object/destructuring (starts with comma or property)
      if (
        trimmedLine.startsWith(',') ||
        (trimmedLine.includes(':') && !trimmedLine.includes('function') && !trimmedLine.includes('=>'))
      ) {
        // Look backwards to confirm this is part of object/destructuring
        for (let i = lineIndex - 1; i >= 0; i--) {
          const prevLine = lines[i]?.trim()
          if (!prevLine) continue

          if (prevLine.includes('{') || prevLine.includes('[')) {
            return true
          }

          if (!prevLine.endsWith(',') && !prevLine.endsWith('{') && !prevLine.endsWith('[')) {
            break
          }
        }
      }

      return false
    }

    /**
     * Count actual code lines in a function (excluding empty lines, comments, and destructuring/object lines)
     * @param node - Function node
     * @returns Number of actual code lines
     */
    function countCodeLines(
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
    ): number {
      const sourceCode = context.getSourceCode()
      const lines = sourceCode.getLines()

      let codeLines = 0
      const startLine = node.loc.start.line - 1 // Convert to 0-based index
      const endLine = node.loc.end.line - 1 // Convert to 0-based index

      for (let i = startLine; i <= endLine; i++) {
        const line = lines[i]?.trim()

        // Skip empty lines
        if (!line) continue

        // Skip comments
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) continue

        // Skip destructuring and object declaration lines
        if (isDestructuringOrObjectLine(line, lines, i)) continue

        codeLines++
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
