'use client';

/**
 * Header Component
 * Main navigation header with user menu
 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks';
import { authService } from '@/services/authService';
import styles from './Header.module.css';

export function Header() {
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo}>
          📦 Inventory
        </Link>
      </div>

      {auth.isAuthenticated && (
        <nav className={styles.nav}>
          <Link href="/inventory">Dashboard</Link>
        </nav>
      )}

      {auth.isAuthenticated && (
        <div className={styles.userMenu}>
          <span className={styles.userMenuButton}>
            {auth.user?.username || 'User'}
          </span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
