# API Integration

## Purpose

This document defines how the frontend communicates with the backend. It covers the API client setup, authentication token handling, error handling, and data fetching patterns. This is the glue between all feature screens and the Django REST backend.

---

## Backend Base URL

```
Development:  http://localhost:8000/api
Production:   https://api.amazebid.com/api   (future)
```

The base URL should be configured via environment variables per platform:
- Web: `import.meta.env.VITE_API_URL`
- Desktop: injected via preload or env
- Mobile: `EXPO_PUBLIC_API_URL`

Centralized in `packages/shared` or a future `packages/api` package:

```typescript
export const API_BASE_URL =
  typeof import.meta !== 'undefined'
    ? import.meta.env.VITE_API_URL
    : process.env.EXPO_PUBLIC_API_URL
    ?? 'http://localhost:8000/api';
```

Better approach: use a `packages/config` package that abstracts environment access per platform.

---

## API Client

Create a shared API client that wraps `fetch` (or `axios`) with:

1. Base URL prefixing
2. JWT token injection
3. Automatic token refresh on 401
4. Consistent error formatting
5. Request/response typing

### Recommended Structure

```
packages/api/
├── src/
│   ├── index.ts           # Re-exports
│   ├── client.ts          # Core HTTP client (fetch wrapper)
│   ├── auth.ts            # Token storage + refresh logic
│   ├── endpoints/
│   │   ├── users.ts       # User/auth API calls
│   │   ├── catalog.ts     # Product/category API calls
│   │   ├── cart.ts        # Cart API calls
│   │   ├── orders.ts      # Order API calls
│   │   ├── inventory.ts   # Stock API calls
│   │   ├── payments.ts    # Earnings/settlement API calls
│   │   ├── shipping.ts    # Shipment/tracking API calls
│   │   └── reviews.ts     # Review API calls
│   └── types/
│       └── responses.ts   # API response types
└── package.json
```

### Core Client

```typescript
interface RequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  path: string;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
  isFormData?: boolean;
}

async function apiRequest<T>(options: RequestOptions): Promise<ApiResponse<T>> {
  const url = buildUrl(options.path, options.params);

  const headers: Record<string, string> = {};

  if (options.requiresAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  if (!options.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    method: options.method,
    headers,
    body: options.isFormData
      ? options.body as FormData
      : options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401 && options.requiresAuth) {
    const refreshed = await attemptTokenRefresh();
    if (refreshed) {
      return apiRequest(options); // retry with new token
    }
    // refresh failed -> logout
    handleLogout();
    throw new AuthError('Session expired');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message, data.code, data.details, response.status);
  }

  return data;
}
```

---

## Authentication Token Flow

### Token Lifecycle

```
Registration/Login
       │
       ▼
  Receive {access, refresh}
       │
       ├── Store access token (memory)
       ├── Store refresh token (secure storage)
       │
       ▼
  Use access token in Authorization header
       │
       ▼
  Access token expires (401 response)
       │
       ▼
  Call /api/users/token/refresh/ with refresh token
       │
       ├── Success: new access token, retry request
       └── Failure: logout user, redirect to login
```

### Token Storage Strategy

| Platform | Access Token | Refresh Token |
|----------|-------------|---------------|
| Web | In-memory variable (not localStorage) | `localStorage` or `httpOnly cookie` |
| Desktop | In-memory | Electron `safeStorage` |
| Mobile | In-memory | `expo-secure-store` |

The access token should NOT be stored in localStorage on web (XSS risk). Keep it in a module-level variable that survives within the session but is lost on page refresh. On refresh, use the stored refresh token to get a new access token.

### Token Refresh Implementation

```typescript
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push((token) => {
        resolve(!!token);
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    setAccessToken(data.access);

    refreshQueue.forEach((cb) => cb(data.access));
    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
    refreshQueue = [];
  }
}
```

This handles concurrent requests that all get 401s -- only one refresh call is made, and all waiting requests retry after.

---

## Data Fetching Pattern

Use **React Query (TanStack Query)** for all server state. It handles caching, refetching, loading/error states, and optimistic updates.

### Setup

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Key Convention

Consistent key patterns for cache management:

```typescript
export const queryKeys = {
  user: {
    me: ['user', 'me'],
    addresses: ['user', 'addresses'],
  },
  cart: {
    current: ['cart'],
  },
  catalog: {
    products: (filters: ProductFilters) => ['products', filters],
    product: (slug: string) => ['product', slug],
    categories: ['categories'],
    search: (query: string) => ['search', query],
  },
  orders: {
    buyerOrders: (status?: string) => ['orders', 'buyer', status],
    sellerOrders: (status?: string) => ['orders', 'seller', status],
    detail: (orderNumber: string) => ['order', orderNumber],
  },
  inventory: {
    stock: ['inventory', 'stock'],
    lowStock: ['inventory', 'low-stock'],
  },
  earnings: {
    list: (filters?: object) => ['earnings', filters],
    summary: ['earnings', 'summary'],
    settlements: ['settlements'],
  },
} as const;
```

### Example: Fetching Products

```typescript
function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: queryKeys.catalog.products(filters),
    queryFn: () => catalogApi.getProducts(filters),
  });
}

function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { productId: string; quantity: number }) =>
      cartApi.addItem(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
    },
  });
}
```

---

## Error Handling

### API Error Format

The backend returns errors in this format:

```json
{
  "error": true,
  "message": "Human-readable error message",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": ["This email is already registered."]
  }
}
```

### Frontend Error Classes

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, string[]>,
    public statusCode?: number,
  ) {
    super(message);
  }
}

class AuthError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 'AUTH_ERROR', undefined, 401);
  }
}
```

### Error Display Strategy

| Error Type | Display Method |
|-----------|---------------|
| Validation errors (400) | Inline under the relevant form field |
| Auth errors (401) | Redirect to login |
| Not found (404) | "Not found" page or toast |
| Server errors (500) | Toast: "Something went wrong. Please try again." |
| Network errors | Toast: "No internet connection" with retry button |

---

## File Uploads

For image uploads (ID photos, product images, profile photos), use `FormData`:

```typescript
async function uploadImage(endpoint: string, file: File | Blob, fieldName: string) {
  const formData = new FormData();
  formData.append(fieldName, file);

  return apiRequest({
    method: 'POST',
    path: endpoint,
    body: formData,
    requiresAuth: true,
    isFormData: true,
  });
}
```

**Platform differences:**
- Web: `File` from `<input type="file">` or webcam `Blob`
- Desktop: `File` from Electron dialog or webcam
- Mobile: URI from Expo ImagePicker, converted to a fetch-compatible format

---

## Pagination Helper

```typescript
interface PaginatedParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

function usePaginatedQuery<T>(
  key: unknown[],
  fetcher: (params: PaginatedParams) => Promise<PaginatedResponse<T>>,
  page: number = 1,
) {
  return useQuery({
    queryKey: [...key, page],
    queryFn: () => fetcher({ page, limit: 20 }),
    placeholderData: keepPreviousData,
  });
}
```

---

## Offline Handling

For mobile specifically, handle offline scenarios:

| Scenario | Behavior |
|----------|----------|
| No network on app launch | Show cached data if available, "offline" banner |
| Network lost mid-session | Queue mutations, show "offline" banner, retry when online |
| Network restored | Flush mutation queue, refetch stale queries |

Web and desktop can show a simpler "No connection" toast.

---

## Dependencies

```
@tanstack/react-query     # Server state management
```

The API client itself should use native `fetch` to avoid platform compatibility issues with axios on React Native. If `axios` is preferred for web/desktop, create a platform-specific adapter in each app that wraps the shared endpoint functions.
