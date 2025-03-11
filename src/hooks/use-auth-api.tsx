import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/contexts/AuthContext';

const getCsrfTokenFromCookie = () => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'csrftoken') return value;
  }
  return null;
};

export function useAuthApi() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const authApiClient = axios.create({
    timeout: 5000,
    withCredentials: true,
    baseURL: import.meta.env.PROD
      ? (import.meta.env.VITE_PROD_BASE_API_URL as string)
      : (import.meta.env.VITE_BASE_API_URL as string),
  });

  authApiClient.defaults.headers.common['X-CSRFToken'] =
    getCsrfTokenFromCookie();

  if (token) {
    authApiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  authApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        navigate('/login');
      }

      return Promise.reject(error);
    }
  );

  return authApiClient;
}
