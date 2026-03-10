<template>
  <a-config-provider
    :locale="$i18n.locale === 'en' ? enUS : viVN"
    :theme="{
      token: appStore.themeConfigToken
    }"
  >
    <router-view />

    <!-- Loading Global -->
    <Loading />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'
import enUS from 'ant-design-vue/es/locale/en_US'
import viVN from 'ant-design-vue/es/locale/vi_VN'
import Loading from '@/views/components/Loading.vue'
import { usePermission } from '@vueuse/core'
import { useFCM } from './composables'
import { isSupported } from 'firebase/messaging'

const appStore = useAppStore()
const router = useRouter()
const notificationAccess = usePermission('notifications')
const { getFcmToken, showConfirmRequestPermissionModal, showPermissionModalWhenDenied } = useFCM()
const counter = ref(1)

onMounted(() => {
  isSupported().then((supported) => {
    if (!supported) return

    navigator.serviceWorker?.addEventListener('message', (event) => {
      if (event.data && event.data.action === 'navigate') {
        router.push(event.data.url)
      }
    })
  })
})

watch(
  notificationAccess,
  (value: any) => {
    isSupported()
      .then((supported) => { 
        if (!supported) return

        if (counter.value > 1) return

        if (value) counter.value++   
 
        if (value === 'granted') {
          getFcmToken()
        }

        if (value === 'prompt') {
          showConfirmRequestPermissionModal()
        }

        if (value === 'denied') {
          showPermissionModalWhenDenied()
        }
      })
      .catch(() => {})
  },
  { immediate: true }
)
</script>

<style lang="scss">
/* Define variables for all of application */
:root {
  --bg-layout-header: #ffffff;
  --bg-layout-footer: #ffffff;
}
body {
  &.sidebar-open {
    overflow: hidden;
  }
}
</style>
