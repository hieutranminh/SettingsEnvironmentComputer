import { UAParser } from 'ua-parser-js'
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Constants for magic numbers
const MOBILE_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1024

interface IDeviceInfo {
  // Device Types
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean

  // Operating Systems
  isIOS: boolean
  isAndroid: boolean
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean

  // Browsers
  isChrome: boolean
  isFirefox: boolean
  isSafari: boolean
  isEdge: boolean

  // Screen Info
  screenWidth: number
  screenHeight: number
  isLandscape: boolean
  isPortrait: boolean

  // Touch Support
  isTouchDevice: boolean

  // Detailed Info
  browserName: string
  browserVersion: string
  osName: string
  osVersion: string
  deviceType: string
  deviceVendor: string
  deviceModel: string
  engineName: string
  cpuArchitecture: string
}

export const useDevice = (): {
  deviceInfo: any
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isIOS: boolean
  isAndroid: boolean
  isWindows: boolean
  isMacOS: boolean
  isLinux: boolean
  isChrome: boolean
  isFirefox: boolean
  isSafari: boolean
  isEdge: boolean
  screenWidth: number
  screenHeight: number
  isLandscape: boolean
  isPortrait: boolean
  isTouchDevice: boolean
  browserName: string
  browserVersion: string
  osName: string
  osVersion: string
  deviceType: string
  deviceVendor: string
  deviceModel: string
  engineName: string
  cpuArchitecture: string
  isSmallScreen: any
  isMediumScreen: any
  isLargeScreen: any
  getDeviceClass: () => string
  getDeviceInfo: () => any
  parserResult: any
} => {
  // Reactive screen dimensions
  const screenWidth = ref(0)
  const screenHeight = ref(0)

  // Initialize UAParser
  const parser = new UAParser()
  const result = parser.getResult()

  // Update screen dimensions
  const updateScreenInfo = (): void => {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
  }

  // Computed properties for device detection
  const deviceInfo = computed<IDeviceInfo>(() => {
    const { device } = result
    const { os } = result
    const { browser } = result
    const { engine } = result
    const { cpu } = result

    // Device type detection
    const deviceType = device.type || 'desktop'
    const isMobile = deviceType === 'mobile'
    const isTablet = deviceType === 'tablet'
    const isDesktop = !isMobile && !isTablet

    // OS detection
    const osName = os.name?.toLowerCase() || ''
    const isIOS = osName.includes('ios')
    const isAndroid = osName.includes('android')
    const isWindows = osName.includes('windows')
    const isMacOS = osName.includes('mac')
    const isLinux = osName.includes('linux')

    // Browser detection
    const browserName = browser.name?.toLowerCase() || ''
    const isChrome = browserName.includes('chrome')
    const isFirefox = browserName.includes('firefox')
    const isSafari = browserName.includes('safari') && !isChrome
    const isEdge = browserName.includes('edge')

    // Screen orientation
    const isLandscape = screenWidth.value > screenHeight.value
    const isPortrait = !isLandscape

    // Touch support detection
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return {
      // Device Types
      isMobile,
      isTablet,
      isDesktop,

      // Operating Systems
      isIOS,
      isAndroid,
      isWindows,
      isMacOS,
      isLinux,

      // Browsers
      isChrome,
      isFirefox,
      isSafari,
      isEdge,

      // Screen Info
      screenWidth: screenWidth.value,
      screenHeight: screenHeight.value,
      isLandscape,
      isPortrait,

      // Touch Support
      isTouchDevice,

      // Detailed Info
      browserName: browser.name || 'Unknown',
      browserVersion: browser.version || 'Unknown',
      osName: os.name || 'Unknown',
      osVersion: os.version || 'Unknown',
      deviceType: deviceType,
      deviceVendor: device.vendor || 'Unknown',
      deviceModel: device.model || 'Unknown',
      engineName: engine.name || 'Unknown',
      cpuArchitecture: cpu.architecture || 'Unknown',
    }
  })

  // Breakpoint helpers
  const isSmallScreen = computed(() => screenWidth.value < 768)
  const isMediumScreen = computed(() => screenWidth.value >= 768 && screenWidth.value < 1024)
  const isLargeScreen = computed(() => screenWidth.value >= 1024)

  // Utility functions
  const getDeviceClass = () => {
    const info = deviceInfo.value
    const classes = []

    if (info.isMobile) classes.push('mobile')
    if (info.isTablet) classes.push('tablet')
    if (info.isDesktop) classes.push('desktop')
    if (info.isTouchDevice) classes.push('touch')
    if (info.isLandscape) classes.push('landscape')
    if (info.isPortrait) classes.push('portrait')

    return classes.join(' ')
  }

  const getDeviceInfo = () => {
    const info = deviceInfo.value
    return {
      summary: `${info.browserName} ${info.browserVersion} on ${info.osName} ${info.osVersion}`,
      device: `${info.deviceVendor} ${info.deviceModel}`.trim() || 'Unknown Device',
      screen: `${info.screenWidth}x${info.screenHeight}`,
      type: info.deviceType,
      touch: info.isTouchDevice,
    }
  }

  // Lifecycle hooks
  onMounted(() => {
    updateScreenInfo()
    window.addEventListener('resize', updateScreenInfo)
    window.addEventListener('orientationchange', updateScreenInfo)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScreenInfo)
    window.removeEventListener('orientationchange', updateScreenInfo)
  })

  return {
    // Device info object
    deviceInfo,

    // Individual properties for convenience
    ...deviceInfo.value,

    // Breakpoint helpers
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,

    // Utility functions
    getDeviceClass,
    getDeviceInfo,

    // Raw UAParser result for advanced usage
    parserResult: result,
  }
}
