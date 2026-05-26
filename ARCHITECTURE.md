# Architecture Overview

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Redux Provider                         │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │          Protected Route Component             │ │   │
│  │  │  ┌──────────────────────────────────────────┐ │ │   │
│  │  │  │         Page Components                  │ │ │   │
│  │  │  │  ┌────────────────────────────────────┐ │ │ │   │
│  │  │  │  │  Layout Components                │ │ │ │   │
│  │  │  │  │  - Header                         │ │ │ │   │
│  │  │  │  │  - Sidebar                        │ │ │ │   │
│  │  │  │  │  - MainLayout                     │ │ │ │   │
│  │  │  │  └────────────────────────────────────┘ │ │ │   │
│  │  │  │  ┌────────────────────────────────────┐ │ │ │   │
│  │  │  │  │  Common Components                │ │ │ │   │
│  │  │  │  │  - Button, Input, Notification   │ │ │ │   │
│  │  │  │  │  - Loading, etc.                 │ │ │ │   │
│  │  │  │  └────────────────────────────────────┘ │ │ │   │
│  │  │  └──────────────────────────────────────────┘ │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                     Redux Store Layer                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Auth Slice     │  UI Slice      │  [Future Slices]│   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                  Custom Hooks Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  useAuth  │  useNotification  │  useAppDispatch    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│              Services & Utils Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │     Axios Instance (api.ts)                 │   │   │
│  │  │  - Request Interceptor (add auth header)   │   │   │
│  │  │  - Response Interceptor (handle errors)    │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │   Service Layer (authService.ts)           │   │   │
│  │  │  - login()   │  - signup()  │  - logout()  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │   Utils (config.ts, storage.ts)            │   │   │
│  │  │  - Configuration constants                 │   │   │
│  │  │  - localStorage utilities                  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│              Backend API Layer                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  POST /token        │  POST /login   │  POST /logout│   │
│  │  GET  /inventory    │  GET /inventory/:id           │   │
│  │  POST /inventory    │  PUT /inventory/:id           │   │
│  │  DELETE /inventory/:id                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
┌──────────────┐
│  Login Form  │
└──────┬───────┘
       │ (credentials)
       ▼
┌──────────────────────────────┐
│ authService.login()          │
└──────┬───────────────────────┘
       │ (HTTP request with axios)
       ▼
┌──────────────────────────────┐
│ Axios Interceptor            │
│ - Add Authorization header   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Backend API                  │
│ POST /token                  │
└──────┬───────────────────────┘
       │ ({ token, user })
       ▼
┌──────────────────────────────┐
│ localStorage.setItem()       │
│ (store token)                │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Redux Action: loginSuccess   │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Auth State Updated           │
│ - token                      │
│ - user                       │
│ - isAuthenticated: true      │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Router.push('/inventory')    │
│ (redirect to dashboard)      │
└──────────────────────────────┘
```

### Protected Route Flow

```
┌─────────────────────────┐
│ User visits /inventory  │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ProtectedRoute Component            │
├─────────────────────────────────────┤
│ ✓ Check if route is public          │
│ ✓ Check if user is authenticated    │
│ ✓ Initialize auth from localStorage │
└────────────┬────────────────────────┘
             │
        ┌────┴─────────────────┐
        │                      │
    (YES)                   (NO)
        │                      │
        ▼                      ▼
  ┌────────────┐      ┌──────────────────────┐
  │ Show Page  │      │ Redirect to /auth... │
  └────────────┘      │ (show loading)       │
                      └──────────────────────┘
```

## Component Structure

### Layout Components

```
MainLayout
├── Header
│   ├── Logo
│   ├── Navigation
│   └── User Menu (username + logout)
├── Sidebar
│   └── Navigation Links
│       ├── Inventory
│       ├── Dashboard
│       └── Settings
└── Content
    └── Children
```

### Page Structure

```
Page (e.g., /inventory)
└── MainLayout
    ├── Header
    ├── Sidebar
    └── Content
        └── InventoryContent
            ├── Statistics Cards
            ├── Filters/Search
            └── Data Table
```

## State Management Architecture

### Redux Store Structure

```
store
├── auth (authSlice)
│   ├── token: string | null
│   ├── user: User | null
│   ├── isAuthenticated: boolean
│   ├── isLoading: boolean
│   └── error: string | null
│
├── ui (uiSlice)
│   ├── isLoading: boolean
│   ├── notifications: Notification[]
│   └── sidebarOpen: boolean
│
└── [Future Slices]
    ├── inventory
    ├── products
    └── ...
```

## Request/Response Flow

### API Request Flow

```
Component
  │
  ├─ useAuth() / useNotification()
  │
  ├─ authService.login()
  │
  ├─ axiosInstance.post('/token', payload)
  │
  ├─ Request Interceptor
  │  └─ Add Authorization header
  │
  ├─ HTTP POST Request
  │
  ├─ Backend Response
  │
  ├─ Response Interceptor
  │  ├─ Success: return response
  │  └─ 401: redirect to login
  │
  ├─ Try-Catch in component
  │
  └─ Dispatch Redux action (success/failure)
```

## Type Safety Flow

```
Backend API Response
  │
  ▼
Interface Definition (AuthResponse)
  │
  ▼
Service Function (authService.login())
  │
  ▼
Redux Action (loginSuccess)
  │
  ▼
Redux State (authSlice.token, authSlice.user)
  │
  ▼
Component (useAppSelector)
```

## Error Handling Flow

```
API Request Error
  │
  ├─ Response Interceptor
  │  ├─ 401: Unauthorized
  │  │  └─ Clear token + Redirect to login
  │  │
  │  └─ Other: Return error
  │
  ├─ Catch in Component
  │  ├─ Log error
  │  ├─ Dispatch Redux failure action
  │  ├─ Update local state
  │  └─ Show notification
  │
  └─ User sees error message
```

## CSS Styling Architecture

```
Global Styles (globals.css)
  ├─ CSS Variables (--color-*, --spacing-*, etc.)
  ├─ CSS Reset
  ├─ Base Typography
  └─ Scrollbar Styling

Component CSS Modules
  ├─ Button.module.css
  │  ├─ .button (base)
  │  ├─ .primary (variant)
  │  ├─ .secondary (variant)
  │  └─ .lg, .md, .sm (sizes)
  │
  ├─ Layout Modules
  │  ├─ Header.module.css
  │  ├─ Sidebar.module.css
  │  └─ MainLayout.module.css
  │
  └─ Page Modules
     ├─ Home.module.css
     ├─ Inventory.module.css
     └─ AuthPage.module.css
```

## Scalability Considerations

### Adding New Features

1. **Create Feature Folder**: `src/features/feature-name/`
2. **Create Redux Slice**: `src/store/slices/featureSlice.ts`
3. **Create Service Layer**: `src/services/featureService.ts`
4. **Create Components**: `src/components/feature-name/`
5. **Create Routes**: `src/app/feature-name/page.tsx`

### Adding New API Endpoints

1. Add to `API_ENDPOINTS` in `src/utils/config.ts`
2. Create service functions in relevant service file
3. Create Redux actions if needed
4. Use in components with proper error handling

## Performance Optimization

1. **Code Splitting**: Automatic with Next.js
2. **CSS Modules**: Scoped styles, no conflicts
3. **Lazy Loading**: Can be added for routes
4. **API Caching**: Can add with React Query
5. **Image Optimization**: Use Next.js Image component

## Security Layers

```
User Input
  │
  ├─ Form validation (client-side)
  │
  ├─ API request
  │  ├─ Token in Authorization header
  │  └─ Content-Type application/json
  │
  ├─ Backend validation
  │
  ├─ Token verification
  │
  └─ API response
     └─ Redux state updated
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test each layer
- ✅ Scalable for large applications
- ✅ Consistent patterns throughout
- ✅ Type-safe implementation
- ✅ Proper error handling
- ✅ Security best practices
