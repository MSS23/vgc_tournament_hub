import { 
  PWAConfig, 
  PWAIcon, 
  PWAScreenshot, 
  ApiResponse, 
  AppError 
} from '../types';

/**
 * Service for managing Progressive Web App features
 * Handles installation, offline functionality, push notifications, and app updates
 */
export class PWAService {
  private static instance: PWAService;
  private config: PWAConfig;
  private deferredPrompt: any = null;
  private isInstalled: boolean = false;
  private isOnline: boolean = navigator.onLine;
  private updateAvailable: boolean = false;
  private subscribers: Map<string, (event: string, data?: any) => void> = new Map();

  private constructor() {
    this.initializeConfig();
    this.setupEventListeners();
    this.checkInstallationStatus();
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialize PWA configuration
   */
  private initializeConfig(): void {
    this.config = {
      name: 'VGC Hub',
      shortName: 'VGC Hub',
      description: 'Pokémon VGC Tournament Tracker and Community Platform',
      themeColor: '#3B82F6',
      backgroundColor: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      startUrl: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
      screenshots: [
        {
          src: '/screenshot-wide.png',
          sizes: '1280x720',
          type: 'image/png',
          formFactor: 'wide',
          label: 'VGC Hub Dashboard',
        },
        {
          src: '/screenshot-narrow.png',
          sizes: '750x1334',
          type: 'image/png',
          formFactor: 'narrow',
          label: 'VGC Hub Mobile View',
        },
      ],
      categories: ['games', 'sports', 'social'],
      lang: 'en',
    };
  }

  /**
   * Setup event listeners for PWA features
   */
  private setupEventListeners(): void {
    // Before install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifySubscribers('install-available');
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.notifySubscribers('installed');
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifySubscribers('online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifySubscribers('offline');
    });

    // Service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.notifySubscribers('controller-change');
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        this.handleServiceWorkerMessage(event.data);
      });
    }
  }

  /**
   * Check if app is installed
   */
  private async checkInstallationStatus(): Promise<void> {
    if ('getInstalledRelatedApps' in navigator) {
      try {
        const relatedApps = await (navigator as any).getInstalledRelatedApps();
        this.isInstalled = relatedApps.length > 0;
      } catch (error) {
        console.error('Failed to check installation status:', error);
      }
    }

    // Check if running in standalone mode (installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }
  }

  /**
   * Get PWA configuration
   */
  getConfig(): PWAConfig {
    return { ...this.config };
  }

  /**
   * Check if PWA can be installed
   */
  canInstall(): boolean {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  /**
   * Show install prompt
   */
  async showInstallPrompt(): Promise<ApiResponse<boolean>> {
    try {
      if (!this.canInstall()) {
        throw new Error('Install prompt not available');
      }

      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        return {
          success: true,
          data: true,
          timestamp: new Date().toISOString(),
          requestId: this.generateId(),
        };
      } else {
        throw new Error('Installation was declined');
      }
    } catch (error) {
      return this.handleError('Failed to show install prompt', error);
    }
  }

  /**
   * Check if app is installed
   */
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Check online status
   */
  isAppOnline(): boolean {
    return this.isOnline;
  }

  /**
   * Check if update is available
   */
  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ApiResponse<ServiceWorkerRegistration>> {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }

      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: this.config.scope,
      });

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.updateAvailable = true;
              this.notifySubscribers('update-available');
            }
          });
        }
      });

      return {
        success: true,
        data: registration,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to register service worker', error);
    }
  }

  /**
   * Update service worker
   */
  async updateServiceWorker(): Promise<ApiResponse<boolean>> {
    try {
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        throw new Error('No service worker registration found');
      }

      await registration.update();
      this.updateAvailable = false;

      return {
        success: true,
        data: true,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to update service worker', error);
    }
  }

  /**
   * Request push notification permission
   */
  async requestPushPermission(): Promise<ApiResponse<boolean>> {
    try {
      if (!('Notification' in window)) {
        throw new Error('Push notifications not supported');
      }

      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      if (granted) {
        await this.subscribeToPushNotifications();
      }

      return {
        success: true,
        data: granted,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to request push permission', error);
    }
  }

  /**
   * Subscribe to push notifications
   */
  private async subscribeToPushNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(process.env.VAPID_PUBLIC_KEY || ''),
      });

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
    }
  }

  /**
   * Send push subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      // This would send the subscription to your backend
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  /**
   * Handle service worker messages
   */
  private handleServiceWorkerMessage(data: any): void {
    switch (data.type) {
      case 'PUSH_RECEIVED':
        this.notifySubscribers('push-received', data.payload);
        break;
      case 'BACKGROUND_SYNC':
        this.notifySubscribers('background-sync', data.payload);
        break;
      case 'CACHE_UPDATED':
        this.notifySubscribers('cache-updated', data.payload);
        break;
      default:
        console.log('Unknown service worker message:', data);
    }
  }

  /**
   * Cache data for offline use
   */
  async cacheData(key: string, data: any): Promise<ApiResponse<boolean>> {
    try {
      if ('caches' in window) {
        const cache = await caches.open('vgc-hub-data');
        const response = new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
        });
        await cache.put(key, response);

        return {
          success: true,
          data: true,
          timestamp: new Date().toISOString(),
          requestId: this.generateId(),
        };
      } else {
        // Fallback to localStorage
        localStorage.setItem(`pwa-cache-${key}`, JSON.stringify(data));
        return {
          success: true,
          data: true,
          timestamp: new Date().toISOString(),
          requestId: this.generateId(),
        };
      }
    } catch (error) {
      return this.handleError('Failed to cache data', error);
    }
  }

  /**
   * Get cached data
   */
  async getCachedData(key: string): Promise<ApiResponse<any>> {
    try {
      if ('caches' in window) {
        const cache = await caches.open('vgc-hub-data');
        const response = await cache.match(key);
        
        if (response) {
          const data = await response.json();
          return {
            success: true,
            data,
            timestamp: new Date().toISOString(),
            requestId: this.generateId(),
          };
        }
      } else {
        // Fallback to localStorage
        const data = localStorage.getItem(`pwa-cache-${key}`);
        if (data) {
          return {
            success: true,
            data: JSON.parse(data),
            timestamp: new Date().toISOString(),
            requestId: this.generateId(),
          };
        }
      }

      throw new Error('Cached data not found');
    } catch (error) {
      return this.handleError('Failed to get cached data', error);
    }
  }

  /**
   * Clear cached data
   */
  async clearCachedData(key?: string): Promise<ApiResponse<boolean>> {
    try {
      if ('caches' in window) {
        if (key) {
          const cache = await caches.open('vgc-hub-data');
          await cache.delete(key);
        } else {
          await caches.delete('vgc-hub-data');
        }
      } else {
        // Fallback to localStorage
        if (key) {
          localStorage.removeItem(`pwa-cache-${key}`);
        } else {
          Object.keys(localStorage)
            .filter(k => k.startsWith('pwa-cache-'))
            .forEach(k => localStorage.removeItem(k));
        }
      }

      return {
        success: true,
        data: true,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to clear cached data', error);
    }
  }

  /**
   * Get app usage statistics
   */
  async getAppUsageStats(): Promise<ApiResponse<any>> {
    try {
      if ('getInstalledRelatedApps' in navigator) {
        const relatedApps = await (navigator as any).getInstalledRelatedApps();
        
        const stats = {
          isInstalled: this.isInstalled,
          isOnline: this.isOnline,
          updateAvailable: this.updateAvailable,
          relatedApps: relatedApps.length,
          displayMode: this.getDisplayMode(),
          platform: this.getPlatform(),
          userAgent: navigator.userAgent,
        };

        return {
          success: true,
          data: stats,
          timestamp: new Date().toISOString(),
          requestId: this.generateId(),
        };
      } else {
        throw new Error('App usage statistics not supported');
      }
    } catch (error) {
      return this.handleError('Failed to get app usage stats', error);
    }
  }

  /**
   * Get display mode
   */
  private getDisplayMode(): string {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return 'standalone';
    } else if (window.matchMedia('(display-mode: fullscreen)').matches) {
      return 'fullscreen';
    } else if (window.matchMedia('(display-mode: minimal-ui)').matches) {
      return 'minimal-ui';
    } else {
      return 'browser';
    }
  }

  /**
   * Get platform
   */
  private getPlatform(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
      return 'android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return 'ios';
    } else if (userAgent.includes('windows')) {
      return 'windows';
    } else if (userAgent.includes('mac')) {
      return 'macos';
    } else if (userAgent.includes('linux')) {
      return 'linux';
    } else {
      return 'unknown';
    }
  }

  /**
   * Subscribe to PWA events
   */
  subscribe(callback: (event: string, data?: any) => void): string {
    const subscriptionId = this.generateId();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  /**
   * Unsubscribe from PWA events
   */
  unsubscribe(subscriptionId: string): boolean {
    return this.subscribers.delete(subscriptionId);
  }

  /**
   * Notify subscribers of events
   */
  private notifySubscribers(event: string, data?: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in PWA subscriber:', error);
      }
    });
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Handle errors
   */
  private handleError(message: string, error: any): ApiResponse<any> {
    const appError: AppError = {
      code: 'PWA_ERROR',
      message,
      details: error.message,
      timestamp: new Date().toISOString(),
    };

    return {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
      requestId: this.generateId(),
    };
  }
}

export default PWAService.getInstance(); 