import { useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { AuthState, AuthCredentials, SignupCredentials, User } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: Boolean(localStorage.getItem('token')),
    isLoading: true,
    error: null,
  });

  const resetState = () => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const handleAuthError = (error: Error) => {
    setAuthState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message || 'Authentication failed',
    }));
    return null;
  };

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!authState.token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        setAuthState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        localStorage.removeItem('token');
        resetState();
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: AuthCredentials): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authApi.login(credentials);
      
      localStorage.setItem('token', response.token);
      
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return response.user;
    } catch (error: unknown) {
      return handleAuthError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  const signup = async (credentials: SignupCredentials): Promise<User | null> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authApi.signup(credentials);
      
      localStorage.setItem('token', response.token);
      
      setAuthState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return response.user;
    } catch (error: unknown) {
      return handleAuthError(error instanceof Error ? error : new Error('Unknown error'));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    resetState();
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    login,
    signup,
    logout,
    clearError,
  };
};
