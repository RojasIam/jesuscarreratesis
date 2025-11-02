import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('isAuthenticated').then((value) => {
      if (value === 'true') {
        setIsAuthenticated(true);
      }
    });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email && password) {
      setIsAuthenticated(true);
      await AsyncStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

