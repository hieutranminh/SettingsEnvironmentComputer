import type { RuntimeConfig } from "@/types/config";


export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  const hostname = window.location.hostname;

  // Try to load from server first


  // Fallback to domain-based configuration
  return getDomainBasedConfig(hostname);
}
