import { createContext, useContext, useState, type ReactNode } from 'react';

import { loginAdmin } from '../../services/api';

const ADMIN_TOKEN_STORAGE_KEY = 'bga-cartography.admin-token';

interface AuthContextValue {
  isAdmin: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const nextToken = await loginAdmin(username, password);
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, nextToken);
      setToken(nextToken);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      setErrorMessage(message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setToken(null);
    setErrorMessage(null);
  };

  const clearError = () => setErrorMessage(null);

  const value: AuthContextValue = {
    isAdmin: token !== null,
    isSubmitting,
    errorMessage,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
