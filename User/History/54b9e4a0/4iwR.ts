import type { AxiosRequestConfig } from 'axios'

export class RequestCancellation {
  private static controllers = new Map<string, AbortController>()

  static createController(requestId: string): AbortController {
    // Cancel any existing request with the same ID
    this.cancelRequest(requestId)

    const controller = new AbortController()
    this.controllers.set(requestId, controller)
    return controller
  }

  static cancelRequest(requestId: string): void {
    const controller = this.controllers.get(requestId)
    if (controller) {
      controller.abort()
      this.controllers.delete(requestId)
    }
  }

  static cancelAllRequests(): void {
    this.controllers.forEach(controller => controller.abort())
    this.controllers.clear()
  }

  static addSignalToConfig(config: AxiosRequestConfig, requestId: string): AxiosRequestConfig {
    const controller = this.createController(requestId)
    return {
      ...config,
      signal: controller.signal,
    }
  }

  static generateRequestId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
