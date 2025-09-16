import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'candidate' | 'admin') => Promise<boolean>;
  register: (email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
  }, []);

  const login = async (email: string, password: string, role: 'candidate' | 'admin'): Promise<boolean> => {
    try {
      if (role === 'admin') {
        // Static admin credentials
        if (email === 'admin@sholas.io' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin-1',
            email: 'admin@sholas.io',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };
          
          setUser(adminUser);
          setIsAuthenticated(true);
          localStorage.setItem('auth_token', 'admin-token-123');
          localStorage.setItem('user_data', JSON.stringify(adminUser));
          return true;
        }
        return false;
      } else {
        // Candidate login
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(u => 
          (u.email === email || u.phone === email) && 
          u.password === password && 
          u.role === 'candidate'
        );
        
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
          localStorage.setItem('auth_token', `candidate-token-${foundUser.id}`);
          localStorage.setItem('user_data', JSON.stringify(foundUser));
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === email || (phone && u.phone === phone));
      if (existingUser) {
        return false;
      }
      
      const newUser: User = {
        id: `candidate-${Date.now()}`,
        email,
        phone,
        password,
        role: 'candidate',
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  );
};