/**
 * Authentication Service
 * Handles login, signup, and token management
 */

import axiosInstance from './api';
import { API_ENDPOINTS } from '@/utils/config';
import { storage } from '@/utils/storage';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  username: string;
  password: string;
  company: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    username: string;
    email: string;
    name: string;
  };
}

export const authService = {
  /**
   * Login user
   * POST /token
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.TOKEN,
      payload
    );
    
    if (response.data.token) {
      storage.setToken(response.data.token);
    }
    
    return response.data;
  },

  /**
   * Sign up new user
   * POST /login
   */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      payload
    );
    
    if (response.data.token) {
      storage.setToken(response.data.token);
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT);
    } finally {
      storage.removeToken();
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!storage.getToken();
  },
};
