'use client';

/**
 * Sidebar Component
 * Navigation sidebar for authenticated users
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks';
import styles from './Sidebar.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/inventory', label: 'Inventory', icon: '📦' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${
              pathname.startsWith(item.href) ? styles.active : ''
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
