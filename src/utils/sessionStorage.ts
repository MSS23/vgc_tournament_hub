import { UserSession } from '../types';

const SESSION_KEY = 'vgc-hub-session';

export const sessionStorage = {
  /**
   * Save user session to localStorage
   */
  saveSession: (session: UserSession): void => {
    try {
      const sessionData = {
        ...session,
        timestamp: Date.now(),
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  },

  /**
   * Load user session from localStorage
   */
  loadSession: (): UserSession | null => {
    try {
      const sessionData = localStorage.getItem(SESSION_KEY);
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);
      
      // Check if session is expired (24 hours)
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      // Remove timestamp before returning session
      const { timestamp, ...session } = parsed;
      return session as UserSession;
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  /**
   * Clear user session from localStorage
   */
  clearSession: (): void => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return sessionStorage.loadSession() !== null;
  },

  /**
   * Update specific session properties
   */
  updateSession: (updates: Partial<UserSession>): void => {
    const currentSession = sessionStorage.loadSession();
    if (currentSession) {
      const updatedSession = { ...currentSession, ...updates };
      sessionStorage.saveSession(updatedSession);
    }
  },
};

export default sessionStorage;