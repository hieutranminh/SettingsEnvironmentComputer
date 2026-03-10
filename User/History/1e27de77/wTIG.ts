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
    function checkFunction(
      node: TSESTree.FunctionDeclaration | TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
      name?: string,
    ) {
      const functionName = name ?? '(anonymous)'

      if (functionName.startsWith('use')) return // skip function use*

      const lines = node.loc.end.line - node.loc.start.line + 1
      if (lines > 30) {
        context.report({
          node,
          messageId: 'tooLong',
          data: { name: functionName, lines },
        })
      }
    }

    return {
      FunctionDeclaration(node) {
        const name = node.id?.name
        checkFunction(node, name)
      },
      FunctionExpression(node) {
        const parent = node.parent as TSESTree.VariableDeclarator
        const name =
          parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier' ? parent.id.name : undefined
        checkFunction(node, name)
      },
      ArrowFunctionExpression(node) {
        const parent = node.parent as TSESTree.VariableDeclarator
        const name =
          parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier' ? parent.id.name : undefined
        checkFunction(node, name)
      },
    }
  },
}

export default rule
