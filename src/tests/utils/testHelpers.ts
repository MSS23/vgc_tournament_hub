import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { User } from '../../types';

// Test wrapper component for providing context
interface TestWrapperProps {
  children: React.ReactNode;
  user?: User;
  isAuthenticated?: boolean;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  user = null, 
  isAuthenticated = false 
}) => {
  return (
    <div data-testid="test-wrapper">
      {children}
    </div>
  );
};

// Custom render function with providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    user?: User;
    isAuthenticated?: boolean;
  }
) => {
  const { user, isAuthenticated, ...renderOptions } = options || {};
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper user={user} isAuthenticated={isAuthenticated}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Mock data generators
export const generateMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  division: 'master',
  age: 25,
  location: 'Test City',
  achievements: ['Regional Champion 2023'],
  isVerified: true,
  isGuardianApprovalRequired: false,
  guardianEmail: null,
  createdAt: '2023-01-01',
  updatedAt: '2024-01-01',
  ...overrides
});

export const generateMockTournament = (overrides: any = {}) => ({
  id: 'tournament-1',
  name: 'Test Tournament',
  date: '2024-03-15',
  location: 'Test Location',
  totalPlayers: 100,
  status: 'registration',
  maxCapacity: 200,
  currentRegistrations: 50,
  waitlistEnabled: true,
  waitlistCapacity: 20,
  currentWaitlist: 0,
  registrationType: 'first-come-first-served',
  isRegistered: false,
  ...overrides
});

export const generateMockPairing = (overrides: any = {}) => ({
  round: 1,
  table: 1,
  player1: { id: 'p1', name: 'Player 1', record: '0-0' },
  player2: { id: 'p2', name: 'Player 2', record: '0-0' },
  result: null,
  ...overrides
});

export const generateMockPokemon = (overrides: any = {}) => ({
  id: 'pokemon-1',
  name: 'Charizard',
  item: 'Focus Sash',
  ability: 'Blaze',
  teraType: 'Fire',
  moves: ['Flamethrower', 'Air Slash', 'Dragon Claw', 'Earthquake'],
  evs: {
    hp: 252,
    attack: 0,
    defense: 0,
    specialAttack: 252,
    specialDefense: 0,
    speed: 4
  },
  ...overrides
});

export const generateMockBlogPost = (overrides: any = {}) => ({
  id: 'post-1',
  title: 'Test Blog Post',
  content: 'This is a test blog post content.',
  author: generateMockUser(),
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  likes: 10,
  comments: 5,
  isFlagged: false,
  ...overrides
});

// Mock functions
export const mockOnLogin = jest.fn();
export const mockOnSignUp = jest.fn();
export const mockOnSave = jest.fn();
export const mockOnDelete = jest.fn();
export const mockOnUpdate = jest.fn();

// Async test helpers
export const waitForElementToBeRemoved = (element: HTMLElement) => {
  return new Promise<void>((resolve) => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect();
        resolve();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

export const waitForCondition = (condition: () => boolean, timeout = 5000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now();
    
    const checkCondition = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Condition not met within timeout'));
      } else {
        setTimeout(checkCondition, 100);
      }
    };
    
    checkCondition();
  });
};

// Form testing helpers
export const fillForm = async (formData: Record<string, string>) => {
  const { fireEvent } = await import('@testing-library/react');
  
  for (const [name, value] of Object.entries(formData)) {
    const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (input) {
      fireEvent.change(input, { target: { value } });
    }
  }
};

export const submitForm = async (formSelector = 'form') => {
  const { fireEvent } = await import('@testing-library/react');
  
  const form = document.querySelector(formSelector) as HTMLFormElement;
  if (form) {
    fireEvent.submit(form);
  }
};

// Validation testing helpers
export const expectValidationError = (errorMessage: string) => {
  const errorElement = document.querySelector(`[data-testid="error-${errorMessage}"]`) ||
                      document.querySelector(`[role="alert"]`) ||
                      document.querySelector(`.error`);
  
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveTextContent(errorMessage);
};

export const expectNoValidationErrors = () => {
  const errorElements = document.querySelectorAll('[role="alert"], .error');
  expect(errorElements).toHaveLength(0);
};

// Accessibility testing helpers
export const expectAccessible = (element: HTMLElement) => {
  expect(element).toHaveAttribute('role');
  expect(element).toHaveAttribute('aria-label');
};

export const expectKeyboardNavigable = (element: HTMLElement) => {
  expect(element).toHaveAttribute('tabindex');
  expect(element).toHaveAttribute('onKeyDown');
};

// Performance testing helpers
export const measurePerformance = async (fn: () => void | Promise<void>) => {
  const startTime = performance.now();
  await fn();
  const endTime = performance.now();
  return endTime - startTime;
};

export const expectPerformanceThreshold = (duration: number, threshold: number) => {
  expect(duration).toBeLessThan(threshold);
};

// Network testing helpers
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    } as Response)
  );
};

export const mockFetchError = (error: string, status = 500) => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error(error))
  );
};

// Local storage helpers
export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorage = (key: string) => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const clearLocalStorage = () => {
  localStorage.clear();
};

// Session storage helpers
export const setSessionStorage = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSessionStorage = (key: string) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

export const clearSessionStorage = () => {
  sessionStorage.clear();
};

// URL helpers
export const mockLocation = (pathname: string) => {
  Object.defineProperty(window, 'location', {
    value: {
      pathname,
      href: `http://localhost:3000${pathname}`,
      search: '',
      hash: '',
    },
    writable: true,
  });
};

export const mockHistory = () => {
  const history = {
    push: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
  };
  
  Object.defineProperty(window, 'history', {
    value: history,
    writable: true,
  });
  
  return history;
};

// Event helpers
export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
};

// Timer helpers
export const mockTimers = () => {
  jest.useFakeTimers();
};

export const restoreTimers = () => {
  jest.useRealTimers();
};

export const advanceTimers = (ms: number) => {
  jest.advanceTimersByTime(ms);
};

// Console helpers
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });
  
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });
};

// Test data cleanup
export const cleanupTestData = () => {
  clearLocalStorage();
  clearSessionStorage();
  jest.clearAllMocks();
  jest.clearAllTimers();
};

// Custom matchers
export const customMatchers = {
  toBeValidEmail: (received: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
  
  toBeValidPassword: (received: string) => {
    const hasMinLength = received.length >= 8;
    const hasUpperCase = /[A-Z]/.test(received);
    const hasLowerCase = /[a-z]/.test(received);
    const hasNumber = /\d/.test(received);
    
    const pass = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid password`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid password`,
        pass: false,
      };
    }
  },
  
  toBeValidDate: (received: string) => {
    const date = new Date(received);
    const pass = !isNaN(date.getTime());
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
};

// Export everything
export {
  customRender as render,
  TestWrapper,
  generateMockUser,
  generateMockTournament,
  generateMockPairing,
  generateMockPokemon,
  generateMockBlogPost,
  mockOnLogin,
  mockOnSignUp,
  mockOnSave,
  mockOnDelete,
  mockOnUpdate,
  waitForElementToBeRemoved,
  waitForCondition,
  fillForm,
  submitForm,
  expectValidationError,
  expectNoValidationErrors,
  expectAccessible,
  expectKeyboardNavigable,
  measurePerformance,
  expectPerformanceThreshold,
  mockFetch,
  mockFetchError,
  setLocalStorage,
  getLocalStorage,
  clearLocalStorage,
  setSessionStorage,
  getSessionStorage,
  clearSessionStorage,
  mockLocation,
  mockHistory,
  mockResizeObserver,
  mockIntersectionObserver,
  mockTimers,
  restoreTimers,
  advanceTimers,
  mockConsole,
  cleanupTestData,
  customMatchers,
};

// Re-export testing library utilities
export * from '@testing-library/react';
export * from '@testing-library/jest-dom'; 