// .eslintrc.cjs
module.exports = {
  root: true, // Xác định đây là cấu hình ESLint gốc cho project
  env: {
    browser: true, // Môi trường trình duyệt (có các biến window, document)
    node: true, // Môi trường NodeJS (nếu dùng trong config, dev)
    es2021: true, // Sử dụng tính năng ES2021 (hoặc có thể dùng "es2020")
  },
  parser: 'vue-eslint-parser', // Parser chuyên biệt cho file .vue
  parserOptions: {
    ecmaVersion: 'latest', // Phân tích cú pháp ES mới nhất
    sourceType: 'module',
    parser: '@typescript-eslint/parser', // Parser để hiểu code TypeScript bên trong <script>
    extraFileExtensions: ['.vue'], // Để parser hiểu được file .vue
    ecmaFeatures: { jsx: false }, // (Không dùng React JSX)
    // Nếu muốn bật các rule cần type-checking: thêm thuộc tính "project" trỏ đến tsconfig.json
    // và "tsconfigRootDir": __dirname
  },
  extends: [
    'eslint:recommended', // Bộ rule ESLint cơ bản, bắt những lỗi JS phổ biến
    'plugin:vue/vue3-recommended', // Bộ rule khuyến nghị cho Vue 3 (style guide Priority A, B, C)
    'plugin:@typescript-eslint/recommended', // Bộ rule khuyến nghị cho TypeScript
    'prettier', // Đặt cuối cùng để vô hiệu hóa các rule xung đột với Prettier
  ],
  plugins: [
    'vue',
    '@typescript-eslint',
    'prettier', // Plugin để tích hợp Prettier với ESLint
  ],

  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    'coverage/**',
    'public/**',
    '**/*.d.ts',
    'scripts/**',
    'src/utils/test-eslint-rules/**',
  ],

  rules: {
    /* ===== Lỗi & best-practices chung ===== */
    'no-console': 'warn', // Chuyển thành warn để không block development
    'no-debugger': 'error',
    eqeqeq: 'error',
    'no-useless-catch': 'error',
    'no-useless-escape': 'error',
    'no-return-assign': 'off', // Tắt để tránh xung đột với TypeScript rules

    /* ===== A) Quy tắc TypeScript & JavaScript ===== */
    // Bắt buộc khai báo return type cho mọi function (kể cả arrow function)
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: false, // Bắt buộc arrow function cũng phải khai báo return type
        allowTypedFunctionExpressions: true, // Cho phép bỏ return type khi function đã được gán type qua interface/type/func signature
        allowHigherOrderFunctions: true, // Không bắt buộc khi function trả về function
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        allowFunctionsWithoutTypeParameters: false,
      },
    ],
    '@typescript-eslint/explicit-arrow-function-return-type': 'off', // Tắt vì đã có rule trên

    // Function/biến đặt tên theo camelCase (TS) - Naming Convention
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'function',
        format: ['camelCase'],
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],

    // Biến phải có ít nhất 2 ký tự (không cho i, x, a, ...)
    'id-length': ['error', { min: 2 }],

    // C) Quy tắc "unused" - Cho phép unused function params, nhưng vẫn báo lỗi unused variables
    'no-unused-vars': 'off', // Tắt core rule để tránh xung đột
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'none', // Không báo lỗi unused function parameters
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_', // Bỏ qua parameters bắt đầu bằng _
      },
    ],

    // Các rule TypeScript khác
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/no-inferrable-types': 'off', // Tắt để bắt buộc explicit types
    '@typescript-eslint/typedef': [
      'error',
      {
        arrayDestructuring: false,
        arrowParameter: false,
        memberVariableDeclaration: true,
        objectDestructuring: false,
        parameter: true,
        propertyDeclaration: true,
        variableDeclaration: false,
        variableDeclarationIgnoreFunction: true,
      },
    ],

    /* ===== B) Quy tắc Vue ===== */
    // Chặn mutate props trong Vue
    'vue/no-mutating-props': 'error',

    // Cấm khai báo trùng key trong data() hoặc props
    'vue/no-dupe-keys': 'error',

    // Biến khai báo trong template mà không dùng
    'vue/no-unused-vars': 'error',

    // Import component mà không dùng
    'vue/no-unused-components': [
      'error',
      {
        ignoreWhenBindingPresent: true,
      },
    ],

    // If lồng tối đa 2 cấp
    'max-depth': ['error', 2],

    // Function tối đa 30 dòng
    'max-lines-per-function': [
      'error',
      {
        max: 30,
        skipComments: true,
        skipBlankLines: true,
      },
    ],

    // Các hàm trong Vue script setup phải có tiền tố "handle" (trừ các hàm đặc biệt)
    'vue/component-api-style': [
      'error',
      ['script-setup'],
    ],
    /* ===== Vue rules khác ===== */
    'vue/multi-word-component-names': 'off', // bật 'error' nếu team muốn bắt buộc tên nhiều từ
    'vue/require-default-prop': 'off', // bật 'warn' nếu muốn props non-required phải có default
    'vue/attribute-hyphenation': 'off', // Tắt rule hyphenation cho attributes
    'vue/v-on-event-hyphenation': 'off', // Tắt rule hyphenation cho events
    'vue/no-template-shadow': 'off', // Tắt rule template shadow

    // Không được hard code trên template - sử dụng rule để bắt literal strings
    'vue/no-literal-string': [
      'error',
      {
        ignore: [
          '^[.,:;!?]+$', // Bỏ qua các ký tự dấu câu
          '^\\s*$', // Bỏ qua chuỗi chỉ có khoảng trắng
          '^[0-9]+$', // Bỏ qua số
          '^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z]{2,}$', // Bỏ qua email
          '^https?://', // Bỏ qua URL
          '^data:', // Bỏ qua data URLs
          '^[A-Z_]+$', // Bỏ qua constants (UPPER_CASE)
        ],
        ignoreAttribute: [
          'id',
          'class',
          'style',
          'data-*',
          'aria-*',
          'role',
          'type',
          'name',
          'value',
          'placeholder',
          'alt',
          'title',
        ],
        ignoreCallee: ['i18n', 't', '$t'], // Bỏ qua i18n functions
        ignorePattern: '^[.,:;!?\\s]*$', // Pattern cho dấu câu và khoảng trắng
      },
    ],

    /* ===== Prettier rules ===== */
    'prettier/prettier': 'error', // Báo lỗi khi code không tuân theo Prettier format

    /* ===== Các rule format khác đã được Prettier quản lý ===== */
    // 'semi': 'off',          // Prettier quản lý
    // 'quotes': 'off',        // Prettier quản lý
    // 'indent': 'off',        // Prettier quản lý
  },
}
