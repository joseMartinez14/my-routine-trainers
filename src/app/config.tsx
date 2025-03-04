'use client'
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MY_APP_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseAuthToken');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default api;
