/**
 * useNotification Hook
 * Custom hook for showing notifications
 */

import { useAppDispatch } from '@/store/hooks';
import {
  addNotification,
  removeNotification,
} from '@/store/slices/uiSlice';

export const useNotification = () => {
  const dispatch = useAppDispatch();

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    dispatch(addNotification({ message, type }));

    // Auto remove after duration
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, duration);
  };

  return {
    success: (message: string) => showNotification(message, 'success'),
    error: (message: string) => showNotification(message, 'error'),
    warning: (message: string) => showNotification(message, 'warning'),
    info: (message: string) => showNotification(message, 'info'),
  };
};
