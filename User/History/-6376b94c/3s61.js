const disabledRules = [
  'no-async-promise-executor',
  'no-dupe-class-members',
  'no-loss-of-precision',
  'no-prototype-builtins',
  'no-self-assign',
  'no-shadow-restricted-names',
  'no-unsafe-optional-chaining',
  'no-useless-catch',
  'vue/multi-word-component-names',
  'vue/no-mutating-props',
  'vue/no-unused-components',
  'vue/no-unused-vars',
  'vue/require-prop-type-constructor',
  'vue/require-valid-default-prop',
  'vue/return-in-computed-property',
  'vue/no-v-html',
  'vue/prop-name-casing',
  'vue/no-lone-template',
  'vue/no-template-shadow',
  'vue/one-component-per-file',
  'vue/order-in-components',
]

const mappedDisabledRules = Object.fromEntries(
  disabledRules.map(rule => [rule, 0]),
)

module.exports = {
  'env': {
    'browser':  true,
    'commonjs': true,
    'es6':      true,
    'jest':     true,
    'node':     true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:import/recommended',
  ],
  'parser':        'vue-eslint-parser',
  'parserOptions': {
    'parser':            '@babel/eslint-parser',
    'requireConfigFile': false,
    'ecmaFeatures':      {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType':  'module',
  },
  'rules': {
    ...mappedDisabledRules,
    'indent': [
      'error',
      2,
      {
        'SwitchCase':   1,
        'ignoredNodes': ['TemplateLiteral'],
      },
    ],
    'linebreak-style': ['off', 'windows'],
    'quotes':          [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'never',
    ],
    'no-empty-function': 'error',
    'no-void':           'error',
    'init-declarations': [
      'error',
      'always',
    ],
    'no-console':                 'warn',
    'vue/no-use-v-if-with-v-for': 'warn',
    'vue/valid-template-root':    'warn',
    'eslint linebreak-style':     [0, 'error', 'windows'],
    'no-trailing-spaces':         [2, { 'skipBlankLines': true }],
    'no-multiple-empty-lines':    [1, { 'max': 1, 'maxEOF': 1 }],//https://eslint.org/docs/latest/rules/no-multiple-empty-lines#version
    'import/no-unresolved':       'off',
    'no-lonely-if':               0,//https://eslint.org/docs/latest/rules/no-lonely-if#rule-details (currently disabled)
    'no-unused-vars':             1,//https://eslint.org/docs/latest/rules/no-unused-vars#rule-details
    'no-multi-spaces':            [1, { exceptions: { 'VariableDeclarator': false, 'ImportDeclaration': false } }],//https://eslint.org/docs/latest/rules/no-multi-spaces#rule-details
    'key-spacing':                ['error', {
      'align': {
        'beforeColon': false,
        'afterColon':  true,
        'on':          'value',
      },
    }],//https://eslint.org/docs/latest/rules/key-spacing#rule-details
    'comma-dangle': [1, {//https://eslint.org/docs/latest/rules/comma-dangle
      'arrays':    'always-multiline',
      'objects':   'always-multiline',
      'imports':   'always-multiline',
      'exports':   'always-multiline',
      'functions': 'always-multiline',
    }],
  },
  'settings': {
    'import/resolver': {
      alias: {
        map: [
          ['API', './src/api'],
          ['Pages', './src/pages'],
          ['Store', './src/store'],
          ['Models', './src/models'],
          ['Modules', './src/modules'],
          ['Workers', './src/workers'],
          ['Utils', './src/helpers/utils'],
          ['Caches', './src/helpers/cache'],
          ['Validators', './src/validators'],
          ['ViewModels', './src/view-model'],
          ['Mixins', './src/helpers/mixins'],
          ['Components', './src/components'],
          ['HocHelpers', './src/helpers/hoc'],
          ['Router', './src/config/router.js'],
          ['Options', './src/helpers/options'],
          ['VuexStore', './src/store/store.js'],
          ['Constant', './src/config/constant.js'],
          ['HTTPHelpers', './src/helpers/http.js'],
          ['Sprites', './src/template/_sprites.scss'],
          ['CommonHelpers', './src/helpers/common.js'],
          ['Translate', './src/translate/translate.js'],
          ['OptionsHelpers', './src/helpers/options.js'],
          ['CommonComponents', './src/components/common'],
          ['DatetimeHelpers', './src/helpers/datetime-common.js'],
          ['SystemDataRules', './src/helpers/system-data-rules.js'],
          ['PermissionHelpers', './src/helpers/permission-utils.js'],
          ['SpeechRecognitionHelpers', './src/helpers/speech-recognition.js'],
          ['APIURLGeneratorHelpers', './src/helpers/api-url-generator.js'],
        ],
        extensions: ['.ts', '.js', '.jsx', '.json', '.vue'],
      },
    },
  },
}
