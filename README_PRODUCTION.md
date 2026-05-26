# Inventory Management - Frontend

A production-ready inventory management frontend application built with Next.js, React, and Redux Toolkit.

## ✨ Features

- 🔐 **JWT Authentication** with login/signup
- 🎯 **Protected Routes** with automatic redirects
- 🏗️ **Redux Toolkit** for state management
- 📡 **Axios** with interceptors for API calls
- 🎨 **CSS Modules** only (no Tailwind/styled-components)
- 📱 **Responsive Design** for all devices
- ⚡ **Next.js 16** with App Router
- 🔧 **TypeScript** for type safety
- 🧩 **Reusable Components** with clean architecture

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js pages
├── components/          # Reusable components
├── features/            # Feature modules
├── services/            # API layer
├── store/               # Redux configuration
├── hooks/               # Custom hooks
├── utils/               # Utilities
└── styles/              # CSS modules
```

## 🔧 Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[SETUP.md](./SETUP.md)** - Detailed setup and feature guide
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flows

## 🔐 Authentication

### Signup
```
POST /login
{
  name: string
  email: string
  username: string
  password: string
  company: string
}
```

### Login
```
POST /token
{
  username: string
  password: string
}
```

### API Requests
```
Authorization: Bearer <token>
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **React**: 19.2.4 (Functional components)
- **State**: Redux Toolkit 2.0
- **HTTP**: Axios 1.6.5
- **Styling**: CSS Modules
- **Language**: TypeScript

## 📦 NPM Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run linter
```

## 🎯 Key Features

### Protected Routes
- Automatic redirect to login for unauthenticated users
- Token-based authentication
- Automatic token refresh in headers

### State Management
- Centralized Redux store
- Auth slice for user state
- UI slice for notifications and loading

### API Integration
- Axios interceptors for authentication
- Automatic error handling
- Token attachment to requests

### Components
- Reusable Button, Input, Notification, Loading
- Layout components (Header, Sidebar, MainLayout)
- CSS Modules for all styles

## 🏗️ Architecture Highlights

- **Service Layer**: Centralized API calls
- **Custom Hooks**: useAuth, useNotification
- **Redux Store**: Global state management
- **Type Safety**: Full TypeScript support
- **Error Handling**: Comprehensive error strategies
- **Responsive Design**: Mobile-first approach

## 🔒 Security

- JWT stored in localStorage
- Automatic token attachment to requests
- 401 error handling with redirect
- Protected routes by default
- Type-safe API responses

## 📖 Example: Adding a New Feature

```typescript
// 1. Create service (src/services/featureService.ts)
import axiosInstance from './api';

export const featureService = {
  getItems: async () => {
    return await axiosInstance.get('/feature');
  },
};

// 2. Create Redux slice (src/store/slices/featureSlice.ts)
import { createSlice } from '@reduxjs/toolkit';

export const featureSlice = createSlice({
  name: 'feature',
  initialState: { items: [] },
  reducers: { setItems: (state, action) => { state.items = action.payload; } },
});

// 3. Use in component
'use client';
import { featureService } from '@/services/featureService';

export function MyFeature() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    featureService.getItems().then(setItems);
  }, []);

  return <div>{items.length} items</div>;
}
```

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t inventory-app .
docker run -p 3000:3000 inventory-app
```

## 🆘 Troubleshooting

### Import Path Errors
- Ensure paths use `@/` prefix
- Check `tsconfig.json` path aliases

### Styles Not Applying
- Verify CSS Module import in component
- Check class name is from imported module

### Authentication Issues
- Check `.env.local` has correct API URL
- Verify token stored in localStorage
- Check browser DevTools Network tab

## 📝 Code Examples

### Using Redux State
```typescript
const auth = useAppSelector(state => state.auth);
const dispatch = useAppDispatch();

dispatch(loginSuccess({ token, user }));
```

### API Calls
```typescript
import { authService } from '@/services/authService';

const response = await authService.login({ username, password });
```

### Custom Hooks
```typescript
const { success, error, warning } = useNotification();
success('Operation completed!');
```

## 📞 Support

- Read SETUP.md for detailed documentation
- Check ARCHITECTURE.md for system design
- Review component implementations for patterns

## 📄 License

This project is open source and available for use.

---

**Built with ❤️ for production**
