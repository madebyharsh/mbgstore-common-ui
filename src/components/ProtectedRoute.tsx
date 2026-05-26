'use client';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import { Loading } from '@/components/common';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  useEffect(() => {
    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    );

    // If route is public, allow access
    if (isPublicRoute) {
      return;
    }

    // If route is private and user is not authenticated, redirect to login
    if (!auth.isAuthenticated) {
      router.push('/auth/login');
    }
  }, [auth.isAuthenticated, pathname, router]);

  // Show loading while checking authentication
  if (!auth.isAuthenticated && !PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Loading />
      </div>
    );
  }

  return <>{children}</>;
}
