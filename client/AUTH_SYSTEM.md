# Authentication System Documentation

## Overview

Lunága's authentication system provides a production-ready, modular, and secure authentication flow for the Next.js frontend. It integrates seamlessly with the Express backend, handling user login, registration, JWT token management, and protected routes.

---

## Architecture

### Key Components

1. **Types** (`lib/auth/types.ts`)
   - TypeScript interfaces for all auth-related data structures
   - User, credentials, responses, and context types

2. **API Client** (`lib/auth/client.ts`)
   - Communicates with backend auth endpoints
   - Manages JWT token storage in localStorage
   - Handles login, registration, and logout

3. **Context Provider** (`lib/auth/context.tsx`)
   - Global state management using React Context API
   - Tracks user, loading state, and errors
   - Provides auth methods to entire application

4. **Hooks** (`lib/auth/hooks.ts`)
   - `useAuth()` - Access full auth context
   - `useIsAuthenticated()` - Check if user is logged in
   - `useCurrentUser()` - Get current user object
   - `useIsDoctor()` / `useIsPatient()` - Role-based checks

5. **Protected Routes** (`lib/components/ProtectedRoute.tsx`)
   - Component wrapper for pages requiring authentication
   - Redirects unauthenticated users to login
   - Shows loading state during auth check

---

## Usage Examples

### 1. Setup (Already Done in Layout)

The `AuthProvider` is wrapped around your entire app in `src/app/layout.tsx`:

```tsx
import { AuthProvider } from '@/lib/auth/context';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Login Page

```tsx
'use client';

import { useAuth } from '@/lib/auth/hooks';

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Automatically redirects on success
    } catch (err) {
      // Error is captured in auth context
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### 3. Protected Page

```tsx
'use client';

import { ProtectedRoute } from '@/lib/components/ProtectedRoute';
import { useCurrentUser } from '@/lib/auth/hooks';

export default function Dashboard() {
  const user = useCurrentUser();

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome, {user?.email}</h1>
        <p>Role: {user?.role}</p>
      </div>
    </ProtectedRoute>
  );
}
```

### 4. Role-Based Content

```tsx
'use client';

import { useIsDoctor, useIsPatient } from '@/lib/auth/hooks';

export default function Dashboard() {
  const isDoctor = useIsDoctor();
  const isPatient = useIsPatient();

  return (
    <div>
      {isPatient && <PatientDashboard />}
      {isDoctor && <DoctorDashboard />}
    </div>
  );
}
```

### 5. Logout

```tsx
'use client';

import { useAuth } from '@/lib/auth/hooks';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## Token Management

### Storage

- JWT tokens are stored in **localStorage** under the key `lunaga_auth_token`
- User data is stored under `lunaga_user`
- Tokens are automatically included in all API requests via the `Authorization: Bearer <token>` header

### Token Flow

1. **Login/Register**: Backend returns token → Stored in localStorage
2. **API Requests**: Token automatically attached to all requests
3. **Logout**: Token removed from localStorage
4. **Page Reload**: Token retrieved from localStorage on app initialization

### Security Notes

- Tokens are stored in localStorage (not httpOnly for frontend access)
- For production, consider using httpOnly cookies with a backend proxy
- Implement token refresh logic if backend supports it
- Clear tokens on logout and on 401 responses

---

## Error Handling

Errors are captured and stored in the auth context:

```tsx
const { error, clearError } = useAuth();

// Display error
if (error) {
  return <div className="text-red-500">{error}</div>;
}

// Clear error manually
button onClick={() => clearError()}>Clear Error</button>
```

Common error scenarios:
- Invalid email/password → "Login failed"
- Email already exists → "Email already registered"
- Network errors → "Network error. Please try again."
- Server errors → Backend error message passed through

---

## API Integration

### Backend Endpoints Required

**Register**: `POST /api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "role": "PATIENT"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "PATIENT",
    "createdAt": "2026-05-27T..."
  }
}
```

**Login**: `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response**: Same as register

---

## Implementation Checklist

- [x] Auth types defined
- [x] API client with token management
- [x] Context provider with global state
- [x] Custom hooks for easy access
- [x] Protected route wrapper
- [x] Login page component
- [x] Register page component
- [x] Layout wrapped with AuthProvider
- [x] Error handling and loading states
- [x] Documentation

---

## Next Steps

1. **Create dashboard pages** for patients and doctors
2. **Implement logout button** in navigation header
3. **Add password reset flow** (forgot password)
4. **Implement email verification** (optional)
5. **Add JWT refresh token logic** (for longer sessions)
6. **Create user profile management** pages
7. **Add role-based redirects** (doctor signup → doctor dashboard)

---

## File Structure

```
src/
├── lib/
│   ├── auth/
│   │   ├── types.ts         # TypeScript types
│   │   ├── client.ts        # API client & token management
│   │   ├── context.tsx      # React Context Provider
│   │   ├── hooks.ts         # Custom hooks
│   │   └── index.ts         # Barrel export
│   ├── components/
│   │   └── ProtectedRoute.tsx
│   └── api.ts               # Generic API client
├── app/
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── login/
│   │   └── page.tsx         # Login page
│   └── register/
│       └── page.tsx         # Registration page
```

---

## Production Considerations

1. **JWT_SECRET**: Change backend JWT secret to a strong random string
2. **HTTPS**: Use HTTPS in production (required for secure token transmission)
3. **CORS**: Configure CORS properly on backend
4. **Token Expiry**: Current expiry is 7 days (backend configurable)
5. **Refresh Tokens**: Consider implementing refresh token flow for better security
6. **HttpOnly Cookies**: For maximum security, use httpOnly cookies instead of localStorage
7. **Rate Limiting**: Implement rate limiting on auth endpoints to prevent brute force attacks
8. **Monitoring**: Log auth failures for security monitoring
9. **2FA**: Consider adding two-factor authentication for sensitive users

---

## Troubleshooting

### "useAuth must be used within AuthProvider"

**Problem**: Using auth hooks outside AuthProvider

**Solution**: Ensure AuthProvider wraps the entire app in `layout.tsx`

### Token not persisting after refresh

**Problem**: Token lost on page reload

**Solution**: Token should be restored from localStorage on app init. Check browser storage in DevTools.

### 401 Unauthorized errors

**Problem**: API requests failing with 401

**Solution**: 
- Token might be expired
- Implement token refresh logic
- Or require user to login again

### CORS errors

**Problem**: API calls blocked by CORS

**Solution**: 
- Check backend CORS configuration
- Ensure `NEXT_PUBLIC_API_URL` matches backend URL
- Backend should allow requests from frontend origin

---

## Support

For questions or issues with the authentication system, refer to:
- Backend API documentation: `server/src/routes/auth.ts`
- TypeScript types: `src/lib/auth/types.ts`
- Example pages: `src/app/login/page.tsx`, `src/app/register/page.tsx`
