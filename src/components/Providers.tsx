'use client';

/**
 * Provider Component
 * Wraps the app with Redux provider and other necessary providers
 */

import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ProviderProps {
  children: ReactNode;
}

export function Providers({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
