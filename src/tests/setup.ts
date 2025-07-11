import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000
    }
  }
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: componentWillReceiveProps') ||
       args[0].includes('Warning: componentWillUpdate'))
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  // Wait for a condition to be true
  waitFor: (condition: () => boolean, timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  },

  // Mock user interactions
  user: {
    click: (element: HTMLElement) => {
      element.click();
    },
    type: (element: HTMLInputElement, text: string) => {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    },
    select: (element: HTMLSelectElement, value: string) => {
      element.value = value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },

  // Mock API responses
  mockApiResponse: (url: string, response: any) => {
    (fetch as jest.Mock).mockImplementation((requestUrl: string) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
      });
    });
  },

  // Reset all mocks
  resetMocks: () => {
    jest.clearAllMocks();
    localStorageMock.clear();
    sessionStorageMock.clear();
  }
};

// Custom matchers for testing
expect.extend({
  toHaveBeenCalledWithMatch(received: jest.Mock, expected: any) {
    const pass = received.mock.calls.some(call => 
      JSON.stringify(call[0]) === JSON.stringify(expected)
    );
    return {
      pass,
      message: () => 
        `expected ${received.getMockName()} to have been called with ${JSON.stringify(expected)}`,
    };
  },

  toBeInViewport(received: HTMLElement) {
    const rect = received.getBoundingClientRect();
    const pass = rect.top >= 0 && rect.left >= 0 && 
                 rect.bottom <= window.innerHeight && 
                 rect.right <= window.innerWidth;
    return {
      pass,
      message: () => 
        `expected element to be in viewport, but it's not`,
    };
  }
});

// Type declarations for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveBeenCalledWithMatch(expected: any): R;
      toBeInViewport(): R;
    }
  }

  var testUtils: {
    waitFor: (condition: () => boolean, timeout?: number) => Promise<void>;
    user: {
      click: (element: HTMLElement) => void;
      type: (element: HTMLInputElement, text: string) => void;
      select: (element: HTMLSelectElement, value: string) => void;
    };
    mockApiResponse: (url: string, response: any) => void;
    resetMocks: () => void;
  };
} 