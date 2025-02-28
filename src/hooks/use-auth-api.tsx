import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthToken } from './use-auth-token';

export function useAuthApi() {
  const navigate = useNavigate();

  const authApiClient = axios.create({
    timeout: 5000,
    withCredentials: true,
    baseURL: import.meta.env.VITE_BASE_API_URL as string,
  });

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
