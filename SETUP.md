# Production-Ready Inventory Management Frontend

## Overview

This is a production-ready, scalable frontend application built with:
- **Next.js 16** (App Router)
- **React 19** (Functional Components)
- **Redux Toolkit** (State Management)
- **Axios** (HTTP Client)
- **CSS Modules** (Styling)
- **JWT Authentication** (localStorage)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication routes
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── inventory/         # Inventory management routes
│   │   └── page.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── common/           # Generic UI components
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Input.tsx
│   │   ├── Input.module.css
│   │   ├── Loading.tsx
│   │   ├── Loading.module.css
│   │   ├── Notification.tsx
│   │   ├── Notification.module.css
│   │   └── index.ts
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── Sidebar.tsx
│   │   ├── Sidebar.module.css
│   │   ├── MainLayout.tsx
│   │   └── MainLayout.module.css
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── Providers.tsx      # Redux provider wrapper
├── features/              # Feature-specific modules
│   ├── auth/             # Authentication feature
│   │   ├── AuthPage.module.css
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   └── inventory/        # Inventory feature
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts
│   ├── useNotification.ts
│   └── index.ts
├── services/             # API service layer
│   ├── api.ts           # Axios instance with interceptors
│   └── authService.ts   # Authentication API calls
├── store/                # Redux store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   └── uiSlice.ts
│   ├── hooks.ts         # useAppDispatch, useAppSelector
│   └── index.ts         # Store configuration
├── styles/              # Global and module styles
│   ├── globals.css
│   ├── Home.module.css
│   └── Inventory.module.css
└── utils/               # Utility functions
    ├── config.ts        # Configuration constants
    └── storage.ts       # localStorage utilities

```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

The app will be available at `http://localhost:3000`

## Configuration

### 1. API Configuration

Edit `src/utils/config.ts` to change API endpoints:

```typescript
export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  TOKEN_KEY: 'auth_token',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/login',      // POST - for signup
  TOKEN: '/token',      // POST - for login
  LOGOUT: '/logout',    // POST
  INVENTORY: '/inventory',
  INVENTORY_DETAIL: (id: string) => `/inventory/${id}`,
} as const;
```

### 2. Redux Store

The Redux store is configured in `src/store/index.ts` with two slices:

- **authSlice**: User authentication state
- **uiSlice**: UI state (loading, notifications, sidebar)

### 3. API Service & Interceptors

The Axios instance is configured in `src/services/api.ts`:

- **Request Interceptor**: Automatically adds JWT token to Authorization header
- **Response Interceptor**: Handles 401 errors and redirects to login
- **Error Handling**: Standardized error responses

## Authentication Flow

### Login/Signup Process

```
1. User submits credentials
2. API call to POST /token or POST /login
3. JWT token received and stored in localStorage
4. User state updated in Redux
5. Redirect to /inventory dashboard
```

### Route Protection

The `ProtectedRoute` component in `src/components/ProtectedRoute.tsx`:
- Checks if user is authenticated
- Redirects to `/auth/login` if not authenticated
- Shows loading state while checking auth status

### Token Management

Tokens are stored securely in localStorage:

```typescript
// Store token
storage.setToken(token);

// Retrieve token
const token = storage.getToken();

// Remove token (on logout)
storage.removeToken();
```

## Key Features

### 1. Reusable Components

**Button Component**
```typescript
<Button 
  variant="primary" 
  size="lg" 
  fullWidth
  onClick={handleClick}
>
  Click Me
</Button>
```

**Input Component**
```typescript
<Input
  label="Username"
  type="text"
  error={errors.username}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
```

**Notification Component**
```typescript
<Notification 
  type="success" 
  message="Action completed successfully"
/>
```

### 2. Custom Hooks

**useAuth Hook**
```typescript
const auth = useAuth();
// Returns: { token, user, isAuthenticated, isLoading, error }
```

**useNotification Hook**
```typescript
const { success, error, warning, info } = useNotification();
// Usage
success('Item added successfully');
error('Failed to add item');
```

### 3. API Service Layer

**Authentication Service**
```typescript
// Login
const response = await authService.login({ username, password });

// Signup
const response = await authService.signup({
  name,
  email,
  username,
  password,
  company,
});

// Logout
await authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();
```

## Styling Strategy

All components use CSS Modules for scoped styling:

```typescript
// Button.tsx
import styles from './Button.module.css';

export function Button({ variant, size, children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

### CSS Variables

Global CSS variables are defined in `src/styles/globals.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  /* ... more variables ... */
}
```

## State Management with Redux Toolkit

### Auth State
```typescript
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Dispatching Actions
```typescript
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess, logout } from '@/store/slices/authSlice';

const dispatch = useAppDispatch();
dispatch(loginSuccess({ token, user }));
dispatch(logout());
```

## Error Handling

### API Error Handling

Errors from API calls are handled through:

1. **Response Interceptor**: Catches 401 errors (unauthorized)
2. **Try-Catch Blocks**: In components for specific handling
3. **Redux Error State**: Stored and displayed to users

### Example Error Handling

```typescript
try {
  const response = await authService.login(credentials);
  dispatch(loginSuccess(response));
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'Login failed';
  dispatch(loginFailure(errorMessage));
  showError(errorMessage);
}
```

## Loading States

Loading states are managed through:

1. **Local Component State**: For individual component loading
2. **Redux UI Slice**: For global loading indicators
3. **Loading Component**: For consistent loading display

## Responsive Design

All components are mobile-responsive using CSS media queries:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

## Best Practices

### 1. Component Structure
- Functional components only
- Hooks for state management
- Props interface for type safety

### 2. API Calls
- Use service layer (src/services/)
- Centralized configuration
- Consistent error handling

### 3. State Management
- Redux for global state
- Local state for component-specific data
- Redux hooks for accessing state

### 4. Styling
- CSS Modules for all components
- Global variables for consistency
- Mobile-first responsive design

### 5. Type Safety
- Full TypeScript support
- Interfaces for API responses
- Redux types included

## API Endpoints Reference

### Authentication

**Login**
```
POST /token
Body: { username: string, password: string }
Response: { token: string, user?: User }
```

**Signup**
```
POST /login
Body: { name, email, username, password, company }
Response: { token: string, user?: User }
```

**Logout**
```
POST /logout
Headers: Authorization: Bearer <token>
```

### Inventory (Examples)

**Get All Items**
```
GET /inventory
Headers: Authorization: Bearer <token>
```

**Get Item Details**
```
GET /inventory/:id
Headers: Authorization: Bearer <token>
```

## Common Tasks

### Adding a New Page

1. Create folder: `src/app/feature-name/`
2. Create `page.tsx`:
```typescript
'use client';

export default function FeaturePage() {
  return <MainLayout>Content here</MainLayout>;
}
```

### Adding a New Component

1. Create folder: `src/components/feature-name/`
2. Create component file: `ComponentName.tsx`
3. Create styles: `ComponentName.module.css`

### Adding Redux State

1. Create slice in `src/store/slices/featureSlice.ts`
2. Add to store configuration in `src/store/index.ts`
3. Use `useAppSelector` and `useAppDispatch` in components

### Adding API Service

1. Create service in `src/services/featureService.ts`
2. Use `axiosInstance` for requests
3. Define interfaces for request/response types

## Troubleshooting

### Issue: "Module not found" errors

**Solution**: Check import paths use `@/` alias and point to `src/` folder

### Issue: Styles not applying

**Solution**: Ensure CSS Module is imported and class names are used from the import

### Issue: Authentication not persisting on page reload

**Solution**: Check that `useAuth` hook is called and localStorage is not cleared

### Issue: API requests not authenticated

**Solution**: Verify token is stored in localStorage with key from `CONFIG.TOKEN_KEY`

## Performance Optimization

- CSS Modules for automatic code splitting
- Server Components where possible
- Image optimization with Next.js Image component
- Lazy loading for routes

## Security Considerations

1. **Token Storage**: Using localStorage (consider adding secure cookie option in future)
2. **Axios Interceptor**: Automatically handles token attachment to requests
3. **401 Handling**: Redirects to login on token expiration
4. **CORS**: Configure on backend as needed
5. **Environment Variables**: API URL in NEXT_PUBLIC_* for client-side access

## Next Steps for Production

1. Add form validation library (e.g., React Hook Form + Zod)
2. Implement API data caching (React Query or SWR)
3. Add logging service
4. Implement analytics
5. Add E2E testing (Cypress/Playwright)
6. Setup CI/CD pipeline
7. Add rate limiting on client side
8. Implement refresh token rotation

## Support & Documentation

- Next.js Docs: https://nextjs.org/docs
- Redux Toolkit: https://redux-toolkit.js.org
- Axios Docs: https://axios-http.com
- React Documentation: https://react.dev

---

**Version**: 1.0.0  
**Last Updated**: 2026-05-26
