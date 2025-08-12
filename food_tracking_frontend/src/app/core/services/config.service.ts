import { Injectable } from '@angular/core';

/**
 * PUBLIC_INTERFACE
 */
@Injectable({ providedIn: 'root' })
export class ConfigService {
  /**
   * Returns the backend base URL used for API calls.
   * Resolution order:
   * 1. window.__env.API_BASE_URL (from public/env.js)
   * 2. <meta name="api-base-url" content="..."> in index.html
   * 3. Default '/api'
   */
  getApiBaseUrl(): string {
    // SSR-safe access guards
    const hasWindow = typeof window !== 'undefined';
    const fromWindow = hasWindow && (window as any).__env && (window as any).__env.API_BASE_URL;
    if (fromWindow && String(fromWindow).trim().length > 0) {
      return String(fromWindow);
    }

    if (hasWindow && typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="api-base-url"]') as HTMLMetaElement | null;
      if (meta?.content && meta.content.trim().length > 0) {
        return meta.content;
      }
    }
    // Default to '/api' which can be proxied or nginx-routed to the backend
    return '/api';
  }
}
