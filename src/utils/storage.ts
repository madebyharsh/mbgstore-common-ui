/**
 * Local Storage Utilities
 * Secure token storage and retrieval
 */

import { CONFIG } from './config';

export const storage = {
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CONFIG.TOKEN_KEY, token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CONFIG.TOKEN_KEY);
    }
    return null;
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CONFIG.TOKEN_KEY);
    }
  },

  clear: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  },
};
