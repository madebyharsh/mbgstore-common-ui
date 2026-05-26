'use client';

/**
 * Login Page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, Loading } from '@/components/common';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, loginFailure, setLoading } from '@/store/slices/authSlice';
import { useNotification } from '@/hooks';
import styles from './AuthPage.module.css';

interface FormErrors {
  username?: string;
  password?: string;
  submit?: string;
}

export function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: showError } = useNotification();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    dispatch(setLoading(true));

    try {
      const response = await authService.login(formData);
      dispatch(loginSuccess({ token: response.token, user: response.user }));
      router.push('/inventory');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      setErrors({ submit: errorMessage });
      dispatch(loginFailure(errorMessage));
      showError(errorMessage);
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>📦 Inventory</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {errors.submit && (
              <div className={styles.errorMessage}>{errors.submit}</div>
            )}

            <Input
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              error={errors.username}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? <Loading text="Signing in..." /> : 'Sign In'}
            </Button>
          </form>

          <div className={styles.footer}>
            Don't have an account?{' '}
            <Link href="/auth/signup" className={styles.link}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
