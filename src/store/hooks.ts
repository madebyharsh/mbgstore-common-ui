/**
 * Redux Hooks
 * Custom typed hooks for Redux
 */

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

/**
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector = <TSelected,>(
  selector: (state: RootState) => TSelected
): TSelected => useSelector<RootState, TSelected>(selector);
