'use client';

/**
 * MainLayout Component
 * Main layout wrapper for authenticated pages
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Notification } from '@/components/common/Notification';
import { useAuth } from '@/hooks';
import { useAppSelector } from '@/store/hooks';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const auth = useAuth();
  const notifications = useAppSelector((state) => state.ui.notifications);

  if (!auth.isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebarContainer}>
        <Sidebar />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <Header />
        </div>

        <main className={styles.content}>{children}</main>

        {notifications.length > 0 && (
          <div className={styles.notificationContainer}>
            {notifications.map((notification) => (
              <Notification
                key={notification.id}
                type={notification.type}
                message={notification.message}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
