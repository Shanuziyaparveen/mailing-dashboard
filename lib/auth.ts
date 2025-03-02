import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const data = await authApi.login(email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      register: async (name: string, email: string, password: string) => {
        try {
          const data = await authApi.register(name, email, password);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      checkAuth: async () => {
        try {
          // Only check if we have a token
          if (!get().token) {
            return false;
          }
          
          const user = await authApi.getProfile();
          set({
            user,
            isAuthenticated: true,
          });
          return true;
        } catch (error) {
          // If token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);