import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

import { publicApiClient } from '@/api';
import { User } from '@/features/admin/types';

export type RefreshTokenResponse = {
  access: string;
};

export type ContextType = {
  loading: boolean;
  user: User | null;
  token: string | null;
  logoutUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
};

type AuthContextProviderType = {
  children: React.ReactNode;
};

const defaultContext: ContextType = {
  user: null,
  token: null,
  loading: true,
  setUser: () => {},
  setToken: () => {},
  login: async () => {},
  logoutUser: async () => {},
};

export const AuthContext = createContext<ContextType>(defaultContext);

export const AuthContextProvider = ({ children }: AuthContextProviderType) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const authApiClient = axios.create({
    timeout: 5000,
    withCredentials: true,
    baseURL: import.meta.env.PROD
      ? (import.meta.env.VITE_PROD_BASE_API_URL as string)
      : (import.meta.env.VITE_BASE_API_URL as string),
  });

  authApiClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const fetchRefreshToken = async (): Promise<RefreshTokenResponse> => {
    const response = await publicApiClient.post('/token/refresh/');
    return response.data;
  };

  const fetchUser = async () => {
    try {
      const response = await authApiClient.get('/v1/users/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    }
  };

  const logoutUser = async () => {
    await authApiClient.post('/token/logout/');
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await publicApiClient.post('/token/', {
        email,
        password,
      });

      setToken(response.data.access);
      localStorage.setItem('token', response.data.access);

      await fetchUser();
    } catch (error) {
      console.error('Failed to login:', error);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (!token) {
      fetchRefreshToken()
        .then((data) => {
          setToken(data.access);
          localStorage.setItem('token', data.access);
        })
        .catch(() => {
          setToken(null);
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUser().finally(() => {
        setLoading(false);
      });
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, token, setUser, loading, setToken, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
