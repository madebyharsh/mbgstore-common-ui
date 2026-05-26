'use client';

/**
 * Signup Page
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input, Button, Loading } from '@/components/common';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { signupSuccess, signupFailure, setLoading } from '@/store/slices/authSlice';
import { useNotification } from '@/hooks';
import styles from './AuthPage.module.css';

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  company?: string;
  submit?: string;
}

export function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { error: showError } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    company: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
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
      const response = await authService.signup(formData);
      dispatch(signupSuccess({ token: response.token, user: response.user }));
      router.push('/inventory');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Signup failed';
      setErrors({ submit: errorMessage });
      dispatch(signupFailure(errorMessage));
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
            <p className={styles.subtitle}>Create your account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {errors.submit && (
              <div className={styles.errorMessage}>{errors.submit}</div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Username"
              type="text"
              placeholder="Choose a username"
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
              placeholder="Enter a password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
              disabled={isLoading}
            />

            <Input
              label="Company"
              type="text"
              placeholder="Enter your company name"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              error={errors.company}
              disabled={isLoading}
            />

            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={isLoading}
              variant="primary"
            >
              {isLoading ? <Loading text="Creating account..." /> : 'Sign Up'}
            </Button>
          </form>

          <div className={styles.footer}>
            Already have an account?{' '}
            <Link href="/auth/login" className={styles.link}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
