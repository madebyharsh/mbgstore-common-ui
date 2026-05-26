# Quick Start Guide

## 5-Minute Setup

### 1. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000`

### 2. Test the Application

**Home Page** (unauthenticated):
- Navigate to `http://localhost:3000`
- See options to "Sign In" or "Create Account"

**Sign Up** (create test account):
- Click "Create Account" or go to `/auth/signup`
- Fill in the form:
  - Full Name: John Doe
  - Email: john@example.com
  - Username: johndoe
  - Password: password123
  - Company: Acme Corp
- Click "Sign Up"

**Login** (existing account):
- Go to `/auth/login`
- Username: johndoe
- Password: password123
- Click "Sign In"

**Inventory Dashboard** (protected):
- After login, automatically redirected to `/inventory`
- See mock inventory data
- View header with logout button
- View sidebar navigation

### 3. Environment Configuration

Edit `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Linting
npm run lint
```

## Folder Navigation

| Folder | Purpose |
|--------|---------|
| `src/app/` | Next.js pages and routes |
| `src/components/` | Reusable React components |
| `src/services/` | API integration layer |
| `src/store/` | Redux state management |
| `src/hooks/` | Custom React hooks |
| `src/utils/` | Helper utilities |
| `src/styles/` | CSS modules and global styles |
| `src/features/` | Feature-specific modules |

## Key Files to Know

### Authentication
- **Login Page**: `src/features/auth/LoginPage.tsx`
- **Signup Page**: `src/features/auth/SignupPage.tsx`
- **Auth Service**: `src/services/authService.ts`

### Layout
- **Main Layout**: `src/components/layout/MainLayout.tsx`
- **Header**: `src/components/layout/Header.tsx`
- **Sidebar**: `src/components/layout/Sidebar.tsx`

### State Management
- **Auth Slice**: `src/store/slices/authSlice.ts`
- **Store Setup**: `src/store/index.ts`

### Utilities
- **Config**: `src/utils/config.ts`
- **API Client**: `src/services/api.ts`

## Common Modifications

### Change API URL

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-api.com
```

### Add New Navigation Item

Edit `src/components/layout/Sidebar.tsx`:

```typescript
const NAV_ITEMS: NavItem[] = [
  { href: '/inventory', label: 'Inventory', icon: '📦' },
  { href: '/new-page', label: 'New Page', icon: '✨' },  // Add this
];
```

### Create New Protected Page

1. Create folder: `src/app/new-page/`
2. Create file: `src/app/new-page/page.tsx`

```typescript
'use client';
import { MainLayout } from '@/components/layout/MainLayout';

export default function NewPage() {
  return (
    <MainLayout>
      <h1>New Page</h1>
    </MainLayout>
  );
}
```

### Add API Endpoint

1. Add to `src/utils/config.ts`:
```typescript
export const API_ENDPOINTS = {
  // ... existing
  NEW_FEATURE: '/new-feature',
};
```

2. Create service in `src/services/featureService.ts`:
```typescript
import axiosInstance from './api';
import { API_ENDPOINTS } from '@/utils/config';

export const featureService = {
  getItems: async () => {
    return await axiosInstance.get(API_ENDPOINTS.NEW_FEATURE);
  },
};
```

3. Use in component:
```typescript
import { featureService } from '@/services/featureService';

const response = await featureService.getItems();
```

## Understanding the Auth Flow

### When User Logs In

1. User submits login form
2. `authService.login()` sends request to `/token`
3. Token received and stored in localStorage
4. Redux state updated with token and user
5. User redirected to `/inventory`
6. Token automatically added to all API requests

### When User Logs Out

1. User clicks logout button
2. `authService.logout()` called
3. Token removed from localStorage
4. Redux state cleared
5. User redirected to `/auth/login`
6. All subsequent requests go back to 401

### Protected Routes

Any route NOT in this list requires authentication:
- `/` (home)
- `/auth/login`
- `/auth/signup`

All other routes redirect to login if not authenticated.

## API Integration Example

### Call an API Endpoint

```typescript
'use client';
import { useState, useEffect } from 'react';
import { useNotification } from '@/hooks';
import axiosInstance from '@/services/api';

export function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/inventory');
        setItems(response.data);
        success('Items loaded');
      } catch (err) {
        error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

## Debugging Tips

### Check localStorage
```javascript
// In browser console
localStorage.getItem('auth_token');
```

### Check Redux State
Install Redux DevTools browser extension to debug state changes

### Check API Requests
1. Open Network tab in DevTools
2. Look for Authorization header in requests
3. Verify token is being sent

### Check Component Props
```typescript
// Temporarily log props
console.log('Auth state:', auth);
```

## Deployment

### Vercel (Recommended)

```bash
# Push to GitHub
git push

# Vercel auto-deploys from GitHub
# Set environment variables in Vercel dashboard:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Tips

1. **Lazy load images**: Use Next.js Image component
2. **Code split pages**: Automatic with Next.js
3. **Cache API responses**: Can add React Query
4. **Optimize bundles**: Check build output

## Security Checklist

- ✅ JWT stored securely in localStorage
- ✅ HTTPS in production
- ✅ CORS configured on backend
- ✅ No sensitive data in localStorage
- ✅ Token auto-removed on 401
- ✅ Refresh tokens (TODO: implement)

## Getting Help

1. Check `SETUP.md` for detailed documentation
2. Check `ARCHITECTURE.md` for design patterns
3. Check component files for examples
4. Read Next.js documentation: https://nextjs.org/docs

## What's Next?

After initial setup:

1. ✅ Install dependencies
2. ✅ Configure `.env.local` with your API URL
3. ✅ Test login/signup flows
4. ✅ Connect to your backend APIs
5. ✅ Add more features using existing patterns
6. ✅ Deploy to production

---

Happy coding! 🚀
