'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Input, Button, Loading } from '@/components/common';
import { authService, SignupPayload } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import {
  signupSuccess,
  signupFailure,
  setLoading,
} from '@/store/slices/authSlice';

import { useNotification } from '@/hooks';

import styles from './AuthPage.module.css';

interface AddressRequest {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  password?: string;
  submit?: string;
}

export function SignupPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { error: showError } = useNotification();

  const [formData, setFormData] = useState<SignupPayload>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    addresses: [],
    status: 'ACTIVE',
    roleNames: ['CUSTOMER'],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password =
        'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    dispatch(setLoading(true));

    try {
      const response = await authService.signup(formData);

      dispatch(
        signupSuccess({
          token: response.token,
          user: response.user,
        })
      );

      router.push('/inventory');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Signup failed';

      setErrors({
        submit: errorMessage,
      });

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
            <h1 className={styles.title}>
              📦 Inventory
            </h1>

            <p className={styles.subtitle}>
              Create your account
            </p>
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit}
          >
            {errors.submit && (
              <div className={styles.errorMessage}>
                {errors.submit}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                })
              }
              error={errors.fullName}
              disabled={isLoading}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              error={errors.email}
              disabled={isLoading}
            />

            <Input
              label="Phone"
              type="text"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: e.target.value,
                })
              }
              error={errors.phone}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
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
              {isLoading ? (
                <Loading text="Creating account..." />
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className={styles.footer}>
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className={styles.link}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}