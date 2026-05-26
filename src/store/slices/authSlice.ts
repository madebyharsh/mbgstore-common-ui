/**
 * Auth Slice
 * Redux Toolkit slice for authentication state management
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set authentication state from localStorage on app start
    setAuthFromStorage: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = !!action.payload.token;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success
    loginSuccess: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Login failure
    loginFailure: (state, action: PayloadAction<string>) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },

    // Signup success
    signupSuccess: (state, action: PayloadAction<{ token: string; user?: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    // Signup failure
    signupFailure: (state, action: PayloadAction<string>) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthFromStorage,
  setLoading,
  setError,
  loginSuccess,
  loginFailure,
  signupSuccess,
  signupFailure,
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
