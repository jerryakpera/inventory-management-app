import axios from 'axios';

export const publicApiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL as string,
  timeout: 5000,
  withCredentials: true,
});
