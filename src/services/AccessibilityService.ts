import { 
  AccessibilitySettings, 
  Theme, 
  ApiResponse, 
  AppError 
} from '../types';

/**
 * Service for managing accessibility features
 * Handles screen reader support, keyboard navigation, themes, and other accessibility features
 */
export class AccessibilityService {
  private static instance: AccessibilityService;
  private currentSettings: AccessibilitySettings;
  private themes: Map<string, Theme> = new Map();
  private subscribers: Map<string, (settings: AccessibilitySettings) => void> = new Map();
  private focusableElements: Set<HTMLElement> = new Set();
  private currentFocusIndex: number = 0;

  private constructor() {
    this.initializeDefaultSettings();
    this.initializeThemes();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
  }

  static getInstance(): AccessibilityService {
    if (!AccessibilityService.instance) {
      AccessibilityService.instance = new AccessibilityService();
    }
    return AccessibilityService.instance;
  }

  /**
   * Initialize default accessibility settings
   */
  private initializeDefaultSettings(): void {
    this.currentSettings = {
      screenReader: false,
      highContrast: false,
      dyslexiaFriendly: false,
      fontSize: 'medium',
      reducedMotion: false,
      keyboardNavigation: true,
      colorBlindSupport: false,
    };

    // Load saved settings from localStorage
    this.loadSettings();
  }

  /**
   * Initialize accessibility themes
   */
  private initializeThemes(): void {
    // Default theme
    this.themes.set('default', {
      name: 'Default',
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
        error: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        info: '#3B82F6',
      },
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    });

    // High contrast theme
    this.themes.set('high-contrast', {
      name: 'High Contrast',
      colors: {
        primary: '#FFFFFF',
        secondary: '#CCCCCC',
        accent: '#FFFF00',
        background: '#000000',
        surface: '#1A1A1A',
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#FFFFFF',
        error: '#FF0000',
        warning: '#FFFF00',
        success: '#00FF00',
        info: '#00FFFF',
      },
      fonts: {
        primary: 'Arial, sans-serif',
        secondary: 'Arial, sans-serif',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    });

    // Dyslexia-friendly theme
    this.themes.set('dyslexia-friendly', {
      name: 'Dyslexia Friendly',
      colors: {
        primary: '#2E86AB',
        secondary: '#A23B72',
        accent: '#F18F01',
        background: '#F8F9FA',
        surface: '#FFFFFF',
        text: '#2C3E50',
        textSecondary: '#5A6C7D',
        border: '#E9ECEF',
        error: '#E74C3C',
        warning: '#F39C12',
        success: '#27AE60',
        info: '#3498DB',
      },
      fonts: {
        primary: 'OpenDyslexic, Arial, sans-serif',
        secondary: 'OpenDyslexic, Arial, sans-serif',
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1.25rem',
        lg: '1.75rem',
        xl: '2.25rem',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    });

    // Color blind friendly theme
    this.themes.set('colorblind-friendly', {
      name: 'Color Blind Friendly',
      colors: {
        primary: '#1F77B4',
        secondary: '#FF7F0E',
        accent: '#2CA02C',
        background: '#FFFFFF',
        surface: '#F8F9FA',
        text: '#2C3E50',
        textSecondary: '#5A6C7D',
        border: '#E9ECEF',
        error: '#D62728',
        warning: '#9467BD',
        success: '#8C564B',
        info: '#E377C2',
      },
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    });
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      if (!this.currentSettings.keyboardNavigation) return;

      switch (event.key) {
        case 'Tab':
          this.handleTabNavigation(event);
          break;
        case 'Escape':
          this.handleEscapeKey(event);
          break;
        case 'Enter':
        case ' ':
          this.handleEnterKey(event);
          break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowKeys(event);
          break;
      }
    });
  }

  /**
   * Setup screen reader support
   */
  private setupScreenReaderSupport(): void {
    if (this.currentSettings.screenReader) {
      // Add ARIA labels and roles
      this.addAriaLabels();
      
      // Announce dynamic content changes
      this.setupLiveRegions();
    }
  }

  /**
   * Get current accessibility settings
   */
  getSettings(): AccessibilitySettings {
    return { ...this.currentSettings };
  }

  /**
   * Update accessibility settings
   */
  async updateSettings(settings: Partial<AccessibilitySettings>): Promise<ApiResponse<AccessibilitySettings>> {
    try {
      const newSettings = { ...this.currentSettings, ...settings };
      
      // Apply settings
      await this.applySettings(newSettings);
      
      // Save settings
      this.saveSettings(newSettings);
      
      // Notify subscribers
      this.notifySubscribers(newSettings);

      return {
        success: true,
        data: newSettings,
        timestamp: new Date().toISOString(),
        requestId: this.generateId(),
      };
    } catch (error) {
      return this.handleError('Failed to update accessibility settings', error);
    }
  }

  /**
   * Apply accessibility settings
   */
  private async applySettings(settings: AccessibilitySettings): Promise<void> {
    this.currentSettings = settings;

    // Apply theme
    if (settings.highContrast) {
      this.applyTheme('high-contrast');
    } else if (settings.dyslexiaFriendly) {
      this.applyTheme('dyslexia-friendly');
    } else if (settings.colorBlindSupport) {
      this.applyTheme('colorblind-friendly');
    } else {
      this.applyTheme('default');
    }

    // Apply font size
    this.applyFontSize(settings.fontSize);

    // Apply reduced motion
    this.applyReducedMotion(settings.reducedMotion);

    // Apply screen reader support
    this.applyScreenReaderSupport(settings.screenReader);

    // Apply keyboard navigation
    this.applyKeyboardNavigation(settings.keyboardNavigation);
  }

  /**
   * Apply theme to the document
   */
  private applyTheme(themeName: string): void {
    const theme = this.themes.get(themeName);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Add theme class to body
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .trim();
    document.body.classList.add(`theme-${themeName}`);
  }

  /**
   * Apply font size
   */
  private applyFontSize(size: AccessibilitySettings['fontSize']): void {
    const root = document.documentElement;
    const sizeMap = {
      'small': '0.875rem',
      'medium': '1rem',
      'large': '1.125rem',
      'extra-large': '1.25rem',
    };

    root.style.setProperty('--font-size-base', sizeMap[size]);
  }

  /**
   * Apply reduced motion
   */
  private applyReducedMotion(reduced: boolean): void {
    const root = document.documentElement;
    if (reduced) {
      root.style.setProperty('--motion-reduce', '1');
      document.body.classList.add('motion-reduce');
    } else {
      root.style.setProperty('--motion-reduce', '0');
      document.body.classList.remove('motion-reduce');
    }
  }

  /**
   * Apply screen reader support
   */
  private applyScreenReaderSupport(enabled: boolean): void {
    if (enabled) {
      this.addAriaLabels();
      this.setupLiveRegions();
    } else {
      this.removeAriaLabels();
    }
  }

  /**
   * Apply keyboard navigation
   */
  private applyKeyboardNavigation(enabled: boolean): void {
    if (enabled) {
      document.body.classList.add('keyboard-navigation');
    } else {
      document.body.classList.remove('keyboard-navigation');
    }
  }

  /**
   * Add ARIA labels to elements
   */
  private addAriaLabels(): void {
    // Add labels to buttons without text
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      if (!button.textContent?.trim()) {
        const icon = button.querySelector('svg, img');
        if (icon) {
          button.setAttribute('aria-label', this.getIconDescription(icon));
        }
      }
    });

    // Add labels to form inputs
    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) {
        input.setAttribute('aria-labelledby', label.id);
      }
    });

    // Add roles to interactive elements
    document.querySelectorAll('[role]').forEach(element => {
      // Ensure proper ARIA attributes for roles
      const role = element.getAttribute('role');
      switch (role) {
        case 'button':
          if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
          }
          break;
        case 'tab':
          if (!element.hasAttribute('aria-selected')) {
            element.setAttribute('aria-selected', 'false');
          }
          break;
      }
    });
  }

  /**
   * Remove ARIA labels
   */
  private removeAriaLabels(): void {
    // Remove custom ARIA labels added by this service
    document.querySelectorAll('[data-accessibility-added]').forEach(element => {
      element.removeAttribute('aria-label');
      element.removeAttribute('data-accessibility-added');
    });
  }

  /**
   * Setup live regions for dynamic content
   */
  private setupLiveRegions(): void {
    // Create live region for announcements
    let liveRegion = document.getElementById('accessibility-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'accessibility-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.currentSettings.screenReader) return;

    const liveRegion = document.getElementById('accessibility-live-region');
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear the message after a short delay
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Handle tab navigation
   */
  private handleTabNavigation(event: KeyboardEvent): void {
    const focusableElements = this.getFocusableElements();
    
    if (focusableElements.length === 0) return;

    if (event.shiftKey) {
      // Shift+Tab: move backwards
      event.preventDefault();
      this.currentFocusIndex = this.currentFocusIndex > 0 
        ? this.currentFocusIndex - 1 
        : focusableElements.length - 1;
    } else {
      // Tab: move forwards
      event.preventDefault();
      this.currentFocusIndex = this.currentFocusIndex < focusableElements.length - 1 
        ? this.currentFocusIndex + 1 
        : 0;
    }

    focusableElements[this.currentFocusIndex]?.focus();
  }

  /**
   * Handle escape key
   */
  private handleEscapeKey(event: KeyboardEvent): void {
    // Close modals, dropdowns, etc.
    const activeElement = document.activeElement;
    if (activeElement && activeElement.getAttribute('role') === 'dialog') {
      const closeButton = activeElement.querySelector('[aria-label*="close"], [aria-label*="Close"]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    }
  }

  /**
   * Handle enter key
   */
  private handleEnterKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.getAttribute('role') === 'button' || target.tagName === 'BUTTON') {
      event.preventDefault();
      target.click();
    }
  }

  /**
   * Handle arrow keys
   */
  private handleArrowKeys(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    // Handle arrow keys for custom components
    if (target.getAttribute('role') === 'tab') {
      this.handleTabArrowKeys(event);
    } else if (target.getAttribute('role') === 'listbox') {
      this.handleListboxArrowKeys(event);
    }
  }

  /**
   * Handle arrow keys for tabs
   */
  private handleTabArrowKeys(event: KeyboardEvent): void {
    const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(event.target as HTMLElement);
    
    if (currentIndex === -1) return;

    let newIndex: number;
    
    if (event.key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else if (event.key === 'ArrowRight') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    } else {
      return;
    }

    event.preventDefault();
    (tabs[newIndex] as HTMLElement).focus();
    (tabs[newIndex] as HTMLElement).click();
  }

  /**
   * Handle arrow keys for listboxes
   */
  private handleListboxArrowKeys(event: KeyboardEvent): void {
    const options = Array.from(document.querySelectorAll('[role="option"]'));
    const currentIndex = options.indexOf(event.target as HTMLElement);
    
    if (currentIndex === -1) return;

    let newIndex: number;
    
    if (event.key === 'ArrowUp') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
    } else if (event.key === 'ArrowDown') {
      newIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
    } else {
      return;
    }

    event.preventDefault();
    (options[newIndex] as HTMLElement).focus();
    (options[newIndex] as HTMLElement).click();
  }

  /**
   * Get all focusable elements
   */
  private getFocusableElements(): HTMLElement[] {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]',
      '[role="tab"]',
      '[role="option"]',
    ];

    return Array.from(document.querySelectorAll(focusableSelectors.join(','))) as HTMLElement[];
  }

  /**
   * Get icon description for ARIA labels
   */
  private getIconDescription(icon: Element): string {
    // This would be a comprehensive mapping of icons to descriptions
    const iconDescriptions: { [key: string]: string } = {
      'home': 'Go to home page',
      'settings': 'Open settings',
      'close': 'Close',
      'menu': 'Open menu',
      'search': 'Search',
      'notifications': 'Notifications',
      'profile': 'User profile',
      'logout': 'Log out',
      'edit': 'Edit',
      'delete': 'Delete',
      'save': 'Save',
      'cancel': 'Cancel',
      'add': 'Add',
      'remove': 'Remove',
      'play': 'Play',
      'pause': 'Pause',
      'stop': 'Stop',
      'next': 'Next',
      'previous': 'Previous',
    };

    // Try to get description from icon class or data attribute
    const className = icon.className.baseVal || icon.className;
    const dataDescription = icon.getAttribute('data-description');
    
    if (dataDescription) {
      return dataDescription;
    }

    // Try to match class name
    for (const [key, description] of Object.entries(iconDescriptions)) {
      if (className.includes(key)) {
        return description;
      }
    }

    return 'Icon';
  }

  /**
   * Subscribe to settings changes
   */
  subscribe(callback: (settings: AccessibilitySettings) => void): string {
    const subscriptionId = this.generateId();
    this.subscribers.set(subscriptionId, callback);
    return subscriptionId;
  }

  /**
   * Unsubscribe from settings changes
   */
  unsubscribe(subscriptionId: string): boolean {
    return this.subscribers.delete(subscriptionId);
  }

  /**
   * Notify subscribers of settings changes
   */
  private notifySubscribers(settings: AccessibilitySettings): void {
    this.subscribers.forEach(callback => {
      try {
        callback(settings);
      } catch (error) {
        console.error('Error in accessibility subscriber:', error);
      }
    });
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('accessibility-settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.currentSettings = { ...this.currentSettings, ...parsed };
        this.applySettings(this.currentSettings);
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
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
      code: 'ACCESSIBILITY_ERROR',
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

export default AccessibilityService.getInstance(); 