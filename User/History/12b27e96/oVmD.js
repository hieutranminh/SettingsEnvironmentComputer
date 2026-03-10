/**
 * Custom ESLint rule để bắt buộc các hàm trong Vue script setup phải có tiền tố "handle"
 * Trừ các hàm đặc biệt như: use*, get*, set*, is*, has*, can*, should*, will*, did*
 */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce "handle" prefix for functions in Vue script setup',
      category: 'Vue',
      recommended: false,
    },
    fixable: null,
    schema: [],
    messages: {
      missingHandlePrefix:
        'Functions in Vue script setup must start with "handle" prefix (except: use*, get*, set*, is*, has*, can*, should*, will*, did*)',
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode()

    // Kiểm tra xem có phải file Vue không
    const isVueFile = context.getFilename().endsWith('.vue')
    if (!isVueFile) {
      return {}
    }

    // Kiểm tra xem có phải trong script setup không
    let inScriptSetup = false
    let scriptSetupStart = null
    let scriptSetupEnd = null

    const ast = sourceCode.ast
    if (ast && ast.body) {
      for (const node of ast.body) {
        if (
          node.type === 'ExpressionStatement' &&
          node.expression &&
          node.expression.type === 'CallExpression' &&
          node.expression.callee &&
          node.expression.callee.name === 'defineComponent'
        ) {
          // Tìm script setup
          const scriptSetupNode = node.expression.arguments[0]
          if (scriptSetupNode && scriptSetupNode.type === 'ObjectExpression') {
            inScriptSetup = true
            scriptSetupStart = scriptSetupNode.range[0]
            scriptSetupEnd = scriptSetupNode.range[1]
            break
          }
        }
      }
    }

    if (!inScriptSetup) {
      return {}
    }

    // Danh sách các prefix được phép (không cần "handle")
    const allowedPrefixes = [
      'use',
      'get',
      'set',
      'is',
      'has',
      'can',
      'should',
      'will',
      'did',
      'on',
      'off',
      'add',
      'remove',
      'update',
      'delete',
      'create',
      'find',
      'search',
      'filter',
      'map',
      'reduce',
      'forEach',
      'some',
      'every',
      'includes',
    ]

    return {
      FunctionDeclaration(node) {
        if (node.id && node.id.name) {
          const functionName = node.id.name

          // Kiểm tra xem có phải trong script setup không
          if (node.range[0] >= scriptSetupStart && node.range[1] <= scriptSetupEnd) {
            const hasAllowedPrefix = allowedPrefixes.some((prefix) => functionName.startsWith(prefix))

            if (!hasAllowedPrefix && !functionName.startsWith('handle')) {
              context.report({
                node: node.id,
                messageId: 'missingHandlePrefix',
              })
            }
          }
        }
      },

      VariableDeclarator(node) {
        if (node.id && node.id.type === 'Identifier' && node.init && node.init.type === 'ArrowFunctionExpression') {
          const functionName = node.id.name

          // Kiểm tra xem có phải trong script setup không
          if (node.range[0] >= scriptSetupStart && node.range[1] <= scriptSetupEnd) {
            const hasAllowedPrefix = allowedPrefixes.some((prefix) => functionName.startsWith(prefix))

            if (!hasAllowedPrefix && !functionName.startsWith('handle')) {
              context.report({
                node: node.id,
                messageId: 'missingHandlePrefix',
              })
            }
          }
        }
      },
    }
  },
}
