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
    // 'prettier' // (Tùy chọn: nếu dùng eslint-plugin-prettier để lint format)
  ],

  ignorePatterns: ['dist/**', 'node_modules/**', 'coverage/**', 'public/**', '**/*.d.ts'],

  rules: {
    /* ===== Lỗi & best-practices chung ===== */
    'no-console': 'error', // có thể chuyển 'error' trong CI/prod
    'no-debugger': 'error',
    eqeqeq: 'error',

    /* ===== Ưu tiên rule của TypeScript thay thế rule JS tương đương ===== */
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'error', // cân nhắc nâng lên 'error' nếu team muốn nghiêm ngặt

    /* ===== Vue rules ===== */
    'vue/multi-word-component-names': 'off', // bật 'error' nếu team muốn bắt buộc tên nhiều từ
    'vue/require-default-prop': 'off', // bật 'warn' nếu muốn props non-required phải có default
    'vue/attribute-hyphenation': 'off', // Tắt rule hyphenation cho attributes
    'vue/v-on-event-hyphenation': 'off', // Tắt rule hyphenation cho events
    /* ===== Một số style an toàn nếu không dùng eslint-plugin-prettier ===== */
    // 'semi': ['error', 'always'],          // Prettier sẽ quản lý nếu cấu hình trong .prettierrc
    // 'quotes': ['error', 'single'],        // Prettier sẽ quản lý
    // 'indent': ['error', 2],               // Prettier sẽ quản lý
  },
}
