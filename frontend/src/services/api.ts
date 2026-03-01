import axios from 'axios';
import { supabaseClient } from './auth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabaseClient.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      supabaseClient.auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
