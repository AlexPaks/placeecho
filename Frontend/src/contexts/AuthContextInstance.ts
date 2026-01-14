import { createContext } from 'react';
import { User } from '../types';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Create and export the AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);