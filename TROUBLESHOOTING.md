# Troubleshooting & Debugging Guide

## Common Issues and Solutions

### 🔴 Module/Import Errors

#### Issue: "Cannot find module '@/components/...'"

**Possible Causes:**
- Wrong path alias
- File doesn't exist
- tsconfig.json paths incorrect

**Solutions:**

1. Verify file exists:
```bash
ls -la src/components/YourComponent.tsx
```

2. Check tsconfig.json paths:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

3. Use correct alias:
```typescript
// ✅ CORRECT
import { Button } from '@/components/common/Button';

// ❌ WRONG
import { Button } from '@/components/Button';
import { Button } from './components/Button';
```

4. Restart dev server:
```bash
npm run dev
# Press Ctrl+C and start again
```

---

### 🔴 Styles Not Applying

#### Issue: CSS Module styles not showing

**Possible Causes:**
- CSS not imported
- Class name mismatch
- CSS Module syntax error

**Solutions:**

1. Verify CSS Module import:
```typescript
// ✅ CORRECT
import styles from './Button.module.css';
<button className={styles.button}>Click</button>

// ❌ WRONG
import './Button.module.css';
<button className="button">Click</button>
```

2. Check class exists in CSS:
```css
/* Button.module.css */
.button {  /* This must exist */
  padding: 0.5rem;
}
```

3. Use template literals for multiple classes:
```typescript
className={`${styles.button} ${styles.primary}`}
```

4. Never use hyphens in CSS class names with modules:
```css
/* ✅ CORRECT */
.primaryButton { }

/* ❌ WRONG - Won't work with styles.primary-button */
.primary-button { }
```

---

### 🔴 Authentication Issues

#### Issue: Login doesn't work / Token not stored

**Debug Steps:**

1. Check token in localStorage:
```javascript
// Browser console
localStorage.getItem('auth_token')
// Should return token string or null
```

2. Verify API URL:
```bash
# Check .env.local
cat .env.local
# Should show: NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Test API connection:
```bash
# Terminal
curl -X POST http://localhost:3001/token \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

4. Check Redux state:
- Install Redux DevTools browser extension
- Open DevTools > Redux tab
- Check auth slice: Should have token and user

5. Check browser console for errors

**Solutions:**

1. Verify backend is running:
```bash
# Check if API server is responding
curl http://localhost:3001
```

2. Verify credentials are correct:
```typescript
// In LoginPage.tsx
console.log('Login attempt:', formData);
```

3. Check Axios interceptor:
```typescript
// In src/services/api.ts - verify token is added
console.log('Authorization header:', config.headers.Authorization);
```

4. Verify storage utility:
```typescript
// Browser console
import { storage } from '@/utils/storage';
storage.getToken();
storage.setToken('test-token');
```

---

### 🔴 Protected Routes Not Working

#### Issue: Public pages show login form, or vice versa

**Debug Steps:**

1. Check ProtectedRoute logic:
```typescript
// In ProtectedRoute.tsx
console.log('Pathname:', pathname);
console.log('IsAuthenticated:', auth.isAuthenticated);
console.log('IsPublicRoute:', PUBLIC_ROUTES.some(route => pathname.startsWith(route)));
```

2. Verify PUBLIC_ROUTES array:
```typescript
const PUBLIC_ROUTES = ['/auth/login', '/auth/signup', '/'];
```

3. Check auth initialization:
```typescript
// useAuth hook should initialize from localStorage
const auth = useAuth();
console.log('Auth state:', auth);
```

**Solutions:**

1. Clear localStorage and restart:
```javascript
// Browser console
localStorage.clear();
location.reload();
```

2. Verify useAuth hook is called:
```typescript
// In any protected page
const auth = useAuth();
if (!auth.isAuthenticated) return <div>Loading...</div>;
```

3. Check Redux initialization:
```typescript
// Browser console
import { store } from '@/store';
console.log('Store state:', store.getState());
```

---

### 🔴 API Requests Failing

#### Issue: API calls return 401 or 403

**Debug Steps:**

1. Check Authorization header:
```javascript
// Browser DevTools > Network tab
// Click API request > Headers
// Look for: Authorization: Bearer <token>
```

2. Verify token exists:
```javascript
// Browser console
localStorage.getItem('auth_token');
```

3. Check API response:
```javascript
// Network tab > Response
// Should return error message
```

4. Test with curl:
```bash
TOKEN=$(curl -X POST http://localhost:3001/token \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' | jq -r '.token')

curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/inventory
```

**Solutions:**

1. Verify request interceptor is working:
```typescript
// In src/services/api.ts
console.log('Adding token to request:', token);
```

2. Check token format:
```javascript
// Should be: Bearer <token>
// Not: token <token> or just <token>
```

3. Verify backend accepts Authorization header:
```bash
# Backend logs should show Authorization header
```

4. Check CORS settings on backend

---

### 🔴 Components Not Rendering

#### Issue: Page shows blank or component doesn't appear

**Debug Steps:**

1. Check browser console for errors:
```javascript
// Look for red error messages
```

2. Check component render:
```typescript
console.log('Component rendered');

export default function MyComponent() {
  console.log('MyComponent rendering');
  return <div>Content</div>;
}
```

3. Check children prop:
```typescript
interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  console.log('Children:', children);
  return <>{children}</>;
}
```

4. Verify imports:
```typescript
// Check all imports exist
import { MyComponent } from '@/components/MyComponent';
```

**Solutions:**

1. Add error boundary:
```typescript
'use client';
import { ReactNode } from 'react';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  try {
    return <>{children}</>;
  } catch (error) {
    return <div>Error: {String(error)}</div>;
  }
}
```

2. Check if component is marked as client component:
```typescript
'use client';  // Add at top for client components
```

3. Log component lifecycle:
```typescript
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);
```

---

### 🔴 Redux State Not Updating

#### Issue: Dispatch doesn't update state

**Debug Steps:**

1. Check Redux DevTools:
- Install browser extension
- Open DevTools > Redux tab
- Look for dispatched actions

2. Verify dispatch is called:
```typescript
const dispatch = useAppDispatch();
console.log('Dispatching:', loginSuccess);
dispatch(loginSuccess({ token, user }));
```

3. Check reducer logic:
```typescript
// In authSlice.ts
loginSuccess: (state, action) => {
  console.log('Reducer called with:', action.payload);
  state.token = action.payload.token;
}
```

4. Verify selector:
```typescript
const auth = useAppSelector(state => {
  console.log('Auth state:', state.auth);
  return state.auth;
});
```

**Solutions:**

1. Check slice is added to store:
```typescript
// In src/store/index.ts
reducer: {
  auth: authReducer,  // Must be here
  ui: uiReducer,
}
```

2. Verify action types:
```typescript
// Use exported actions
import { loginSuccess } from '@/store/slices/authSlice';
```

3. Ensure immutable updates:
```typescript
// ✅ CORRECT - Redux Toolkit auto-handles
state.token = action.payload.token;

// ❌ WRONG - Never mutate directly in vanilla Redux
// state = { ...state, token };
```

---

### 🔴 TypeScript Errors

#### Issue: "Type 'X' is not assignable to type 'Y'"

**Debug Steps:**

1. Check type definitions:
```typescript
interface User {
  id: string;
  username: string;
}

// Verify all properties match
```

2. Use type assertion carefully:
```typescript
// ✅ CORRECT
const user = response.data as User;

// ❌ WRONG
const user: User = response.data; // May fail validation
```

3. Check API response types:
```typescript
interface AuthResponse {
  token: string;
  user?: User;
}

const response = await authService.login(credentials);
// response should match AuthResponse
```

**Solutions:**

1. Use typeof for debugging:
```typescript
type Response = typeof response.data;
```

2. Create proper interfaces:
```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

---

### 🔴 Performance Issues

#### Issue: App slow, lots of re-renders

**Debug Steps:**

1. Check for unnecessary re-renders:
```typescript
// Add logging to component
const MyComponent = React.memo(() => {
  console.log('Re-rendered');
  return <div>Component</div>;
});
```

2. Check Redux selector efficiency:
```typescript
// Bad - creates new object on every render
const auth = useAppSelector(state => ({
  token: state.auth.token,
  user: state.auth.user,
}));

// Good - only changes when auth slice changes
const auth = useAppSelector(state => state.auth);
```

3. Use React DevTools Profiler:
- Open DevTools > Profiler tab
- Record renders
- Look for unexpected re-renders

**Solutions:**

1. Use React.memo for expensive components:
```typescript
export const Button = React.memo(({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
});
```

2. Use useCallback for callbacks:
```typescript
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

3. Use useMemo for computed values:
```typescript
const memoizedValue = useMemo(() => {
  return expensiveComputation(dependency);
}, [dependency]);
```

---

### 🔴 Notification Not Showing

#### Issue: useNotification() doesn't display message

**Debug Steps:**

1. Check hook is called:
```typescript
const { success, error } = useNotification();
console.log('Notification hook:', { success, error });
```

2. Verify dispatch works:
```typescript
// In useNotification hook
console.log('Dispatching notification:', message);
```

3. Check notification in Redux:
```typescript
// Browser console > Redux tab
// Look for addNotification action
```

4. Verify MainLayout renders Notification:
```typescript
// Check src/components/layout/MainLayout.tsx
// Should map over notifications
```

**Solutions:**

1. Ensure MainLayout is used:
```typescript
// All pages with notifications need:
<MainLayout>
  <YourContent />
</MainLayout>
```

2. Check notification component:
```typescript
// Verify Notification component renders
{notifications.map(n => (
  <Notification key={n.id} type={n.type} message={n.message} />
))}
```

3. Test manually:
```typescript
import { useNotification } from '@/hooks';

const { success } = useNotification();
success('Test message');  // Should appear
```

---

## Debugging Tools

### 1. Browser DevTools
```javascript
// Console
console.log('Value:', value);
console.table(arrayOfObjects);
console.trace('Stack trace');

// Network tab
// Check API requests, headers, responses

// Redux DevTools
// Track action dispatches and state changes
```

### 2. VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Thunder Client (API testing)
- Better Comments

### 3. Command Line
```bash
# Check running processes
lsof -i :3000  # Check port 3000

# Test API
curl -X GET http://localhost:3001/inventory \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check environment
npm ls
npm audit
```

### 4. Add Logging
```typescript
// Create logging utility
export const logger = {
  log: (component, message, data) => {
    console.log(`[${component}] ${message}`, data);
  },
  error: (component, error) => {
    console.error(`[${component}] Error:`, error);
  }
};
```

---

## Quick Checklist for Debugging

- [ ] Restart dev server
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check browser console for errors
- [ ] Verify `.env.local` is correct
- [ ] Check localStorage for token
- [ ] Open Redux DevTools
- [ ] Check Network tab for API calls
- [ ] Verify backend is running
- [ ] Check tsconfig.json paths
- [ ] Verify imports use @/ prefix

---

## Getting More Help

1. **Read Documentation:**
   - SETUP.md - Full setup guide
   - ARCHITECTURE.md - Design patterns
   - Component files - See implementation

2. **Check Existing Code:**
   - LoginPage.tsx - Authentication example
   - MainLayout.tsx - Layout pattern
   - useAuth.ts - Hook example

3. **Debug in Browser:**
   - Redux DevTools extension
   - React DevTools extension
   - Network tab for API calls
   - Console for errors

4. **Test Manually:**
   - Visit pages directly
   - Test with curl commands
   - Check localStorage
   - Monitor console logs

---

**Remember:** Most issues can be solved by:
1. Reading error messages carefully
2. Checking the browser console
3. Verifying file paths and imports
4. Ensuring backend is running
5. Clearing cache and restarting dev server
