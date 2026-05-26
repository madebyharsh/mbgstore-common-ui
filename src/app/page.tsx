'use client';

/**
 * Home Page
 */

import Link from 'next/link';
import { useAuth } from '@/hooks';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const auth = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>📦 Inventory</h1>
        <p className={styles.subtitle}>
          A simple inventory management system for your business
        </p>

        {auth.isAuthenticated ? (
          <Link href="/inventory" className={styles.button}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className={styles.button}>
              Sign In
            </Link>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>
              or{' '}
              <Link href="/auth/signup" style={{ color: '#667eea' }}>
                Create Account
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
