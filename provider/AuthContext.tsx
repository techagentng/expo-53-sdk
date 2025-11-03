import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../Redux/store';
import { initializeAuth, logout, login } from '../Redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { user, access_token, loading } = useSelector((state: RootState) => state.auth);

  // Treat presence of access_token as authenticated; user may hydrate shortly after
  const isAuthenticated = !!access_token;

  // Remove the useEffect that calls initializeAuth since AppInitializer already handles this
  // useEffect(() => {
  //   const initAuth = async () => {
  //     try {
  //       await dispatch(initializeAuth() as any);
  //     } catch (error) {
  //       console.error('Failed to initialize auth:', error);
  //     }
  //   };
  //
  //   initAuth();
  // }, [dispatch]);

  const loginFunction = async (email: string, password: string) => {
    try {
      const result = await dispatch(login({ email, password }) as any);
      return result.payload;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout() as any);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      const storedUser = await AsyncStorage.getItem('user_details');

      if (storedToken && storedUser) {
        await dispatch(initializeAuth() as any);
      }
    } catch (error) {
      console.error('Failed to refresh auth:', error);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    isLoading: loading,
    login: loginFunction,
    logout: handleLogout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
