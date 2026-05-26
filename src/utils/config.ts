/**
 * Application Configuration
 * Centralized configuration for API endpoints and environment variables
 */

export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TOKEN_KEY: 'auth_token',
} as const;

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: 'http://localhost:8080/auth/signup',
  TOKEN: 'http://localhost:8080/auth/login',
  LOGOUT: 'http://localhost:8080/auth/logout',
  
  // Inventory endpoints (examples)
  INVENTORY: '/inventory',
  INVENTORY_DETAIL: (id: string) => `/inventory/${id}`,
} as const;
