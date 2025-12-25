import { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'soc-analyst' | 'pentester' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@zerosight.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@zerosight.com',
      name: 'System Administrator',
      role: 'admin',
    },
  },
  'analyst@zerosight.com': {
    password: 'analyst123',
    user: {
      id: '2',
      email: 'analyst@zerosight.com',
      name: 'Sarah Chen',
      role: 'soc-analyst',
    },
  },
  'pentester@zerosight.com': {
    password: 'pentester123',
    user: {
      id: '3',
      email: 'pentester@zerosight.com',
      name: 'Alex Rodriguez',
      role: 'pentester',
    },
  },
  'client@techcorp.com': {
    password: 'client123',
    user: {
      id: '4',
      email: 'client@techcorp.com',
      name: 'John Smith',
      role: 'client',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const userData = MOCK_USERS[email.toLowerCase()];
    
    if (userData && userData.password === password) {
      setUser(userData.user);
      localStorage.setItem('bgs_user', JSON.stringify(userData.user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bgs_user');
  };

  // Check for stored session on mount
  useState(() => {
    const storedUser = localStorage.getItem('bgs_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('bgs_user');
      }
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
