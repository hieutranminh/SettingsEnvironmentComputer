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

interface IUseDeviceReturn {
  deviceInfo: IDeviceInfo
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
  isSmallScreen: boolean
  isMediumScreen: boolean
  isLargeScreen: boolean
  getDeviceClass: () => string
  getDeviceInfo: () => {
    summary: string
    device: string
    screen: string
    type: string
    touch: boolean
  }
  parserResult: any
}

export const useDevice = (): IUseDeviceReturn => {
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

  // Helper functions for device detection
  const getDeviceTypeInfo = (device: any) => {
    const deviceType = device.type ?? 'desktop'
    return {
      deviceType,
      isMobile: deviceType === 'mobile',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType !== 'mobile' && deviceType !== 'tablet',
    }
  }

  const getOSInfo = (os: any) => {
    const osName = os.name?.toLowerCase() ?? ''
    return {
      osName: os.name ?? 'Unknown',
      osVersion: os.version ?? 'Unknown',
      isIOS: osName.includes('ios'),
      isAndroid: osName.includes('android'),
      isWindows: osName.includes('windows'),
      isMacOS: osName.includes('mac'),
      isLinux: osName.includes('linux'),
    }
  }

  const getBrowserInfo = (browser: any) => {
    const browserName = browser.name?.toLowerCase() ?? ''
    return {
      browserName: browser.name ?? 'Unknown',
      browserVersion: browser.version ?? 'Unknown',
      isChrome: browserName.includes('chrome'),
      isFirefox: browserName.includes('firefox'),
      isSafari: browserName.includes('safari') && !browserName.includes('chrome'),
      isEdge: browserName.includes('edge'),
    }
  }

  // Computed properties for device detection
  const deviceInfo = computed<IDeviceInfo>(() => {
    const { device, os, browser, engine, cpu } = result
    const deviceTypeInfo = getDeviceTypeInfo(device)
    const osInfo = getOSInfo(os)
    const browserInfo = getBrowserInfo(browser)
    
    const isLandscape = screenWidth.value > screenHeight.value
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return {
      // Device Types
      ...deviceTypeInfo,

      // Operating Systems
      ...osInfo,

      // Browsers
      ...browserInfo,

      // Screen Info
      screenWidth: screenWidth.value,
      screenHeight: screenHeight.value,
      isLandscape,
      isPortrait: !isLandscape,

      // Touch Support
      isTouchDevice,

      // Detailed Info
      deviceVendor: device.vendor ?? 'Unknown',
      deviceModel: device.model ?? 'Unknown',
      engineName: engine.name ?? 'Unknown',
      cpuArchitecture: cpu.architecture ?? 'Unknown',
    }
  })

  // Breakpoint helpers
  const isSmallScreen = computed(() => screenWidth.value < MOBILE_BREAKPOINT)
  const isMediumScreen = computed(() => screenWidth.value >= MOBILE_BREAKPOINT && screenWidth.value < DESKTOP_BREAKPOINT)
  const isLargeScreen = computed(() => screenWidth.value >= DESKTOP_BREAKPOINT)

  // Utility functions
  const getDeviceClass = (): string => {
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

  const getDeviceInfo = (): {
    summary: string
    device: string
    screen: string
    type: string
    touch: boolean
  } => {
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
