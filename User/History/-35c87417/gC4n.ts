import { TSESLint, TSESTree } from '@typescript-eslint/utils'

type MessageIds = 'templateTooLong' | 'scriptTooLong'
type Options = [
  {
    templateMaxLines?: number
    scriptMaxLines?: number
  }
]

const rule: TSESLint.RuleModule<MessageIds, Options> = {
  defaultOptions: [
    {
      templateMaxLines: 200,
      scriptMaxLines: 300,
    },
  ],
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce maximum lines for template and script blocks in Vue SFC files, excluding style blocks',
    },
    schema: [
      {
        type: 'object',
        properties: {
          templateMaxLines: {
            type: 'number',
            minimum: 1,
          },
          scriptMaxLines: {
            type: 'number',
            minimum: 1,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      templateTooLong:
        "Template block has too many lines ({{lines}}). Maximum allowed is {{maxLines}}.",
      scriptTooLong:
        "Script block has too many lines ({{lines}}). Maximum allowed is {{maxLines}}.",
    },
  },

  create(context, [options]) {
    const templateMaxLines = options.templateMaxLines ?? 200
    const scriptMaxLines = options.scriptMaxLines ?? 300

    /**
     * Count lines in a Vue SFC block, excluding empty lines and comments
     * @param node - Vue SFC block node
     * @returns Number of actual code lines
     */
    function countBlockLines(node: TSESTree.Node): number {
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
        if (
          line.startsWith('//') ||
          line.startsWith('/*') ||
          line.startsWith('*')
        )
          continue

        codeLines++
      }

      return codeLines
    }

    /**
     * Check template block line count
     * @param node - Template block node
     */
    function checkTemplateBlock(node: TSESTree.Node): void {
      const lines = countBlockLines(node)

      if (lines > templateMaxLines) {
        context.report({
          node,
          messageId: 'templateTooLong',
          data: { lines, maxLines: templateMaxLines },
        })
      }
    }

    /**
     * Check script block line count
     * @param node - Script block node
     */
    function checkScriptBlock(node: TSESTree.Node): void {
      const lines = countBlockLines(node)

      if (lines > scriptMaxLines) {
        context.report({
          node,
          messageId: 'scriptTooLong',
          data: { lines, maxLines: scriptMaxLines },
        })
      }
    }

    return {
      // Check template blocks
      'VElement[rawName="template"]'(node: TSESTree.VElement) {
        checkTemplateBlock(node)
      },

      // Check script blocks
      'VElement[rawName="script"]'(node: TSESTree.VElement) {
        checkScriptBlock(node)
      },
    }
  },
}

export default rule
