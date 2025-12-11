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
  const [storageToken, setStorageToken] = React.useState<string | null>(null);
  const [checkingStorage, setCheckingStorage] = React.useState(true);

  // Check AsyncStorage on mount and sync to Redux if needed
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        setStorageToken(token);
        
        // If we have a token in storage but not in Redux, initialize auth
        if (token && !access_token) {
          console.log('🔄 AuthContext: Token in storage but not Redux, initializing...');
          await dispatch(initializeAuth() as any);
        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
      } finally {
        setCheckingStorage(false);
      }
    };
    checkStorage();
  }, [dispatch, access_token]);

  // Update storageToken when Redux token changes
  useEffect(() => {
    if (access_token) {
      setStorageToken(access_token);
    }
  }, [access_token]);

  // Treat presence of access_token (from Redux OR AsyncStorage) as authenticated
  const isAuthenticated = !!access_token || !!storageToken;
  
  // Debug: Log auth state
  useEffect(() => {
    console.log('🔑 AuthContext state:', {
      hasReduxToken: !!access_token,
      hasStorageToken: !!storageToken,
      hasUser: !!user,
      isAuthenticated,
      loading,
      checkingStorage,
      timestamp: new Date().toISOString()
    });
  }, [access_token, storageToken, user, isAuthenticated, loading, checkingStorage]);

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
    isLoading: loading || checkingStorage,
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
