// Performance optimization utilities

/**
 * Debounce function to limit how often a function can be called
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

/**
 * Throttle function to limit function execution rate
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
};

/**
 * Memoization helper for expensive calculations
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

/**
 * Deep comparison for objects and arrays
 */
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i])) return false;
      }
      return true;
    }
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!deepEqual(a[key], b[key])) return false;
    }
    
    return true;
  }
  
  return false;
};

/**
 * Batch DOM updates for better performance
 */
export const batchDOMUpdates = (updates: (() => void)[]): void => {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    requestAnimationFrame(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
};

/**
 * Lazy load images with intersection observer
 */
export const lazyLoadImage = (img: HTMLImageElement, src: string): void => {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    observer.observe(img);
  } else {
    // Fallback for older browsers
    img.src = src;
  }
};

/**
 * Virtual scrolling helper for large lists
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  totalItems: number;
  overscan?: number;
}

export interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleItems: number;
}

export const calculateVirtualScroll = (
  scrollTop: number,
  config: VirtualScrollConfig
): VirtualScrollResult => {
  const { itemHeight, containerHeight, totalItems, overscan = 5 } = config;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + overscan * 2);
  const offsetY = startIndex * itemHeight;
  
  return {
    startIndex,
    endIndex,
    offsetY,
    visibleItems
  };
};

/**
 * Optimized array operations
 */
export const arrayUtils = {
  /**
   * Efficiently remove items from array by index
   */
  removeByIndex: <T>(arr: T[], index: number): T[] => {
    if (index < 0 || index >= arr.length) return arr;
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  },
  
  /**
   * Efficiently insert item at specific index
   */
  insertAtIndex: <T>(arr: T[], index: number, item: T): T[] => {
    if (index < 0) return [item, ...arr];
    if (index >= arr.length) return [...arr, item];
    return [...arr.slice(0, index), item, ...arr.slice(index)];
  },
  
  /**
   * Efficiently update item at specific index
   */
  updateAtIndex: <T>(arr: T[], index: number, item: T): T[] => {
    if (index < 0 || index >= arr.length) return arr;
    return [...arr.slice(0, index), item, ...arr.slice(index + 1)];
  },
  
  /**
   * Efficiently find and replace item
   */
  findAndReplace: <T>(arr: T[], predicate: (item: T) => boolean, newItem: T): T[] => {
    const index = arr.findIndex(predicate);
    if (index === -1) return arr;
    return arrayUtils.updateAtIndex(arr, index, newItem);
  }
};

/**
 * Memory management utilities
 */
export const memoryUtils = {
  /**
   * Clear object references to help garbage collection
   */
  clearReferences: (obj: any): void => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        obj[key] = null;
      });
    }
  },
  
  /**
   * Weak map for caching without memory leaks
   */
  createWeakCache: <K extends object, V>() => new WeakMap<K, V>(),
  
  /**
   * LRU Cache implementation
   */
  createLRUCache: <K, V>(maxSize: number = 100) => {
    const cache = new Map<K, V>();
    
    return {
      get: (key: K): V | undefined => {
        if (cache.has(key)) {
          const value = cache.get(key)!;
          cache.delete(key);
          cache.set(key, value);
          return value;
        }
        return undefined;
      },
      
      set: (key: K, value: V): void => {
        if (cache.has(key)) {
          cache.delete(key);
        } else if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(key, value);
      },
      
      clear: (): void => cache.clear(),
      
      size: (): number => cache.size
    };
  }
};

/**
 * Performance monitoring utilities
 */
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  measureTime: <T>(fn: () => T): { result: T; time: number } => {
    const start = performance.now();
    const result = fn();
    const time = performance.now() - start;
    return { result, time };
  },
  
  /**
   * Create a performance mark
   */
  mark: (name: string): void => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },
  
  /**
   * Measure between two marks
   */
  measure: (name: string, startMark: string, endMark: string): void => {
    if (typeof performance !== 'undefined' && performance.measure) {
      performance.measure(name, startMark, endMark);
    }
  },
  
  /**
   * Get performance metrics
   */
  getMetrics: () => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      return performance.getEntriesByType('measure');
    }
    return [];
  }
};

/**
 * Event handling optimizations
 */
export const eventUtils = {
  /**
   * Add event listener with passive option for better scroll performance
   */
  addPassiveListener: (
    element: EventTarget,
    event: string,
    handler: EventListener,
    options: AddEventListenerOptions = {}
  ): void => {
    element.addEventListener(event, handler, {
      passive: true,
      ...options
    });
  },
  
  /**
   * Remove event listener
   */
  removeListener: (
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ): void => {
    element.removeEventListener(event, handler, options);
  }
};

/**
 * Storage optimization utilities
 */
export const storageUtils = {
  /**
   * Safely get item from localStorage with error handling
   */
  getItem: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  /**
   * Safely set item in localStorage with error handling
   */
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  /**
   * Remove item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }
};

export default {
  debounce,
  throttle,
  memoize,
  deepEqual,
  batchDOMUpdates,
  lazyLoadImage,
  calculateVirtualScroll,
  arrayUtils,
  memoryUtils,
  performanceUtils,
  eventUtils,
  storageUtils
}; 