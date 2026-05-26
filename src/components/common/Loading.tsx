'use client';

/**
 * Loading Component
 * Displays a loading spinner
 */

import styles from './Loading.module.css';

interface LoadingProps {
  text?: string;
}

export function Loading({ text = 'Loading...' }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
