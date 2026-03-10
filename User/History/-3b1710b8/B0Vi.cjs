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

    /* ===== Ưu tiên rule của TypeScript thay thế rule JS tương đương ===== */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn', // Chuyển thành warn để không block development
    '@typescript-eslint/ban-ts-comment': 'warn',

    /* ===== TypeScript Function Return Types ===== */
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true, // Cho phép arrow function expressions
        allowTypedFunctionExpressions: true, // Cho phép function expressions có type annotation
        allowHigherOrderFunctions: true, // Cho phép higher-order functions
        allowDirectConstAssertionInArrowFunctions: true, // Cho phép const assertions
        allowConciseArrowFunctionExpressionsStartingWithVoid: true, // Cho phép void arrow functions
        allowFunctionsWithoutTypeParameters: false, // Bắt buộc type parameters cho generic functions
      },
    ],
    /* ===== Vue rules ===== */
    'vue/multi-word-component-names': 'off', // bật 'error' nếu team muốn bắt buộc tên nhiều từ
    'vue/require-default-prop': 'off', // bật 'warn' nếu muốn props non-required phải có default
    'vue/attribute-hyphenation': 'off', // Tắt rule hyphenation cho attributes
    'vue/v-on-event-hyphenation': 'off', // Tắt rule hyphenation cho events
    'vue/no-duplicate-attributes': 'off', // Tắt rule duplicate attributes
    'vue/no-template-shadow': 'off', // Tắt rule template shadow
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
