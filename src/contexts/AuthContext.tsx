import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'technician' | 'hospital';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  companyId: number;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isDemo: boolean, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for each role
const DEMO_USERS: Record<UserRole, User> = {
  technician: {
    id: 0,
    name: 'Demo Teknisyen',
    email: 'teknisyen@calimed.com',
    role: 'technician',
    companyId: 0,
    token: 'demo-token-technician'
  },
  hospital: {
    id: 0,
    name: 'Demo Hastane',
    email: 'hospital@calimed.com',
    role: 'hospital',
    companyId: 0,
    token: 'demo-token-hospital'
  },
  admin: {
    id: 0,
    name: 'Demo Yönetici',
    email: 'admin@calimed.com',
    role: 'admin',
    companyId: 0,
    token: 'demo-token-admin'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on app start
    const storedUser = localStorage.getItem('calimed-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, isDemo: boolean = false, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);

    // Check if this is a demo account (auto-detect)
    const isDemoAccount = Object.values(DEMO_USERS).some(user => user.email === email);
    
    if (isDemoAccount && password === 'demo123') {
      // Find the demo user by email
      const demoUser = Object.values(DEMO_USERS).find(user => user.email === email);
      if (demoUser) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        setUser(demoUser);
        localStorage.setItem('calimed-user', JSON.stringify(demoUser));
        setIsLoading(false);
        return true;
      }
    }

    // If not demo or demo failed, try regular login
    try {
      // Use production API URL for deployed version
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : window.location.origin;
        
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setIsLoading(false);
        return false;
      }

      const data = await response.json();
      const loggedInUser: User = {
        id: data.userId,
        name: data.name || email.split('@')[0], // Use name from response or extract from email
        email: email,
        role: data.role,
        companyId: data.companyId,
        token: data.token,
      };

      setUser(loggedInUser);
      localStorage.setItem('calimed-user', JSON.stringify(loggedInUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('calimed-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
