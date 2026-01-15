import { useEffect, useState, ReactNode } from 'react';
import { AuthContext } from './AuthContextInstance';
import { User } from '../types';
import config from '../config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export function AuthProvider({
  children
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem('story_explorer_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data');
        localStorage.removeItem('story_explorer_user');
      }
    }
    setLoading(false);
  }, []);
  const API_BASE = import.meta.env.DEV ? "/api" : config.API_BASE_URL;
  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      if (config.TEST_MODE) {
        // Dummy API response for test mode
        const dummyUser: User = {
          id: 'test-user',
          name: 'Test User',
          email: 'testuser@example.com',
          photoURL: 'https://via.placeholder.com/150',
        };
        setUser(dummyUser);
        localStorage.setItem('story_explorer_user', JSON.stringify(dummyUser));
      } else {
        // Real API call
        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Failed to log in');
        }

        const user: User = await response.json();
        setUser(user);
        localStorage.setItem('story_explorer_user', JSON.stringify(user));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('story_explorer_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
    } as AuthContextType}>
      {children}
    </AuthContext.Provider>
  );
}
