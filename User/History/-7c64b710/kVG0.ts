/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_SALONADMIN_SOLUTION_ID: string
  readonly VITE_HEADQUARTERADMIN_GATEWAY_BASEURL: string
  readonly VITE_HEADQUARTERADMIN_GATEWAY_VERSION: string
  readonly VITE_NOTIFICATION_READ_API_BASEURL: string
  readonly VITE_LOGIN_URL_DEFAULT: string
  readonly VITE_LOGIN_URL_KR: string
  readonly VITE_ADMINS_SERVICE_NAME: string
  readonly VITE_ADMINS_READ_API_VERSION: string
  readonly VITE_ADMINS_CMD_API_VERSION: string
  readonly VITE_IDENTITIES_SERVICE_NAME: string
  readonly VITE_IDENTITIES_READ_API_VERSION: string
  readonly VITE_IDENTITIES_CMD_API_VERSION: string
  readonly VITE_GOODS_SERVICE_NAME: string
  readonly VITE_GOODS_READ_API_VERSION: string
  readonly VITE_GOODS_CMD_API_VERSION: string
  readonly VITE_BOARDS_SERVICE_NAME: string
  readonly VITE_BOARDS_READ_API_VERSION: string
  readonly VITE_BOARDS_CMD_API_VERSION: string
  readonly VITE_ADMIN_SALES_SERVICE_NAME: string
  readonly VITE_ADMIN_SALES_READ_API_VERSION: string
  readonly VITE_ADMIN_SALES_CMD_API_VERSION: string
  readonly VITE_BOOKINGS_SERVICE_NAME: string
  readonly VITE_BOOKINGS_READ_API_VERSION: string
  readonly VITE_BOOKINGS_CMD_API_VERSION: string
  readonly VITE_SALES_SERVICE_NAME: string
  readonly VITE_SALES_READ_API_VERSION: string
  readonly VITE_SALES_CMD_API_VERSION: string
  readonly VITE_STAFFS_SERVICE_NAME: string
  readonly VITE_STAFFS_READ_API_VERSION: string
  readonly VITE_STAFFS_CMD_API_VERSION: string
  readonly VITE_CLIENTS_SERVICE_NAME: string
  readonly VITE_CLIENTS_READ_API_VERSION: string
  readonly VITE_CLIENTS_CMD_API_VERSION: string
  readonly VITE_AZURE_STORAGE_BOARD_URL: string
  readonly VITE_AZURE_STORAGE_CLIENT_URL: string
  readonly VITE_AZURE_STORAGE_ADMINS_URL: string
  readonly VITE_IAMPORT_KEY: string
  readonly VITE_HEADQUARTER_ADMIN_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
