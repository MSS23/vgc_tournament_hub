import React, { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { UserSession } from '../types';
import sessionStorage from '../utils/sessionStorage';

interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOADING' }
  | { type: 'LOGIN_SUCCESS'; payload: UserSession }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<UserSession> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SESSION_LOADED'; payload: UserSession | null };

interface AuthContextType {
  state: AuthState;
  login: (user: UserSession) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserSession>) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_USER':
      if (!state.user) return state;
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SESSION_LOADED':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        dispatch({ type: 'LOADING' });
        const savedSession = sessionStorage.loadSession();
        dispatch({ type: 'SESSION_LOADED', payload: savedSession });
      } catch (error) {
        console.error('Failed to load session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load session' });
      }
    };

    loadSession();
  }, []);

  // Persist session changes
  useEffect(() => {
    if (!state.isLoading) {
      if (state.user && state.isAuthenticated) {
        sessionStorage.saveSession(state.user);
      } else {
        sessionStorage.clearSession();
      }
    }
  }, [state.user, state.isAuthenticated, state.isLoading]);

  const login = (user: UserSession) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (updates: Partial<UserSession>) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
  };

  const setError = (error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    updateUser,
    setError,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;