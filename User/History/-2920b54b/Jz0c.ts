import type { Rule } from 'eslint'

interface RuleOptions {
  prefix?: string
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require variables holding arrow/function expressions to be prefixed with "handle"',
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
      missingPrefix: "Function variable '{{name}}' should be prefixed with '{{prefix}}'.",
    },
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const options = context.options as [RuleOptions?]
    const [{ prefix = 'handle' } = {}] = options || []

    /**
     * Check if a function name should be prefixed
     * @param name - The function name to check
     * @returns true if the name should be prefixed
     */
    const shouldBePrefixed = (name: string): boolean => {
      // Skip if already has the prefix
      if (name.startsWith(prefix)) return false

      // Skip common non-action functions
      const skipPatterns = [
        'use', // Composables like useAuth, useRouter
        'is', // Boolean functions like isVisible, isActive
        'has', // Boolean functions like hasPermission, hasData
        'get', // Getter functions like getData, getUser
        'set', // Setter functions like setData, setUser
        'create', // Creator functions like createUser, createData
        'update', // Updater functions like updateUser, updateData
        'delete', // Deleter functions like deleteUser, deleteData
        'fetch', // Fetcher functions like fetchData, fetchUser
        'load', // Loader functions like loadData, loadUser
        'save', // Saver functions like saveData, saveUser
        'validate', // Validator functions like validateData, validateUser
        'format', // Formatter functions like formatDate, formatCurrency
        'parse', // Parser functions like parseData, parseUser
        'transform', // Transformer functions like transformData, transformUser
        'filter', // Filter functions like filterData, filterUser
        'sort', // Sort functions like sortData, sortUser
        'find', // Finder functions like findData, findUser
        'search', // Search functions like searchData, searchUser
        'calculate', // Calculator functions like calculateTotal, calculatePrice
        'compute', // Computer functions like computeTotal, computePrice
        'generate', // Generator functions like generateId, generateToken
        'build', // Builder functions like buildQuery, buildUrl
        'render', // Renderer functions like renderTemplate, renderView
        'show', // Show functions like showModal, showDialog
        'hide', // Hide functions like hideModal, hideDialog
        'toggle', // Toggle functions like toggleModal, toggleDialog
        'open', // Open functions like openModal, openDialog
        'close', // Close functions like closeModal, closeDialog
        'reset', // Reset functions like resetForm, resetData
        'clear', // Clear functions like clearForm, clearData
        'refresh', // Refresh functions like refreshData, refreshView
        'reload', // Reload functions like reloadData, reloadView
        'init', // Initializer functions like initData, initView
        'setup', // Setup functions like setupData, setupView
        'configure', // Configure functions like configureData, configureView
        'prepare', // Prepare functions like prepareData, prepareView
        'process', // Process functions like processData, processView
        'execute', // Execute functions like executeQuery, executeCommand
        'run', // Run functions like runQuery, runCommand
        'start', // Start functions like startProcess, startTimer
        'stop', // Stop functions like stopProcess, stopTimer
        'pause', // Pause functions like pauseProcess, pauseTimer
        'resume', // Resume functions like resumeProcess, resumeTimer
        'cancel', // Cancel functions like cancelProcess, cancelTimer
        'abort', // Abort functions like abortProcess, abortTimer
        'destroy', // Destroy functions like destroyData, destroyView
        'dispose', // Dispose functions like disposeData, disposeView
        'cleanup', // Cleanup functions like cleanupData, cleanupView
        'initialize', // Initialize functions like initializeData, initializeView,
        'emit', // Emit functions like emitEvent, emitData,
      ]

      return !skipPatterns.some((pattern) => name.startsWith(pattern))
    }

    return {
      VariableDeclarator(node: any) {
        // Chỉ quan tâm biến có init là arrow/function expression
        if (node.id?.type !== 'Identifier') return
        const init = node.init
        if (!init) return
        const isFn = init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression'
        if (!isFn) return

        const name = node.id.name
        if (shouldBePrefixed(name)) {
          context.report({
            node: node.id,
            messageId: 'missingPrefix',
            data: { name, prefix },
          })
        }
      },
    }
  },
}

export default rule
