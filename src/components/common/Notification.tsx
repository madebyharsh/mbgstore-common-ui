'use client';

/**
 * Notification Component
 * Displays toast notifications
 */

import styles from './Notification.module.css';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function Notification({ type, message }: NotificationProps) {
  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <span className={styles.icon}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
    </div>
  );
}
