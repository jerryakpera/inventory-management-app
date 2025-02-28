import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthToken } from './use-auth-token';

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

  const authApiClient = axios.create({
    // timeout: 5000,
    timeout: 20000,
    withCredentials: true,
    baseURL: import.meta.env.VITE_BASE_API_URL as string,
  });

  authApiClient.defaults.headers.common['X-CSRFToken'] =
    getCsrfTokenFromCookie();

  const queryClient = useQueryClient();

  const { data } = useAuthToken();

  if (data && data.access) {
    authApiClient.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${data.access}`;
      return config;
    });
  }

  authApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await queryClient.invalidateQueries({ queryKey: ['refreshToken'] });

        navigate('/login');
      }
      return Promise.reject(error);
    }
  );

  return authApiClient;
}
