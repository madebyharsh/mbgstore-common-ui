/**
 * useAuth Hook
 * Custom hook for authentication logic
 */

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAuthFromStorage } from '@/store/slices/authSlice';
import { storage } from '@/utils/storage';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  // Initialize auth from storage on app start
  useEffect(() => {
    const token = storage.getToken();
    if (token) {
      dispatch(setAuthFromStorage({ token }));
    }
  }, [dispatch]);

  return auth;
};
