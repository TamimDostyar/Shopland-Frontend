# Authentication & Account Screens

## Purpose

This document covers every screen the frontend needs for account creation, login, verification, and profile management. These are the first screens a user sees and the foundation of the entire app experience.

---

## Backend Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/users/register/buyer/` | POST | Buyer registration |
| `/api/users/register/seller/` | POST | Seller registration |
| `/api/users/login/` | POST | Login (returns JWT + verification status) |
| `/api/users/token/refresh/` | POST | Refresh access token |
| `/api/users/logout/` | POST | Blacklist refresh token |
| `/api/users/verify-phone/` | POST | Submit SMS code |
| `/api/users/verify-phone/resend/` | POST | Resend SMS code |
| `/api/users/verify-email/?token=` | GET | Email verification link |
| `/api/users/verify-email/resend/` | POST | Resend email link |
| `/api/users/password-reset/` | POST | Request password reset |
| `/api/users/password-reset/confirm/` | POST | Set new password |
| `/api/users/me/` | GET/PATCH | View/update profile |
| `/api/users/me/addresses/` | GET/POST | Manage addresses |
| `/api/users/account-types/` | GET | Get available account types |

---

## Screens

### 1. Welcome / Landing Screen

The entry point for unauthenticated users.

| Element | Details |
|---------|---------|
| App logo + name | "Amazebid" branding |
| Tagline | Short marketplace description |
| "Create Account" button | Routes to account type selection |
| "Log In" button | Routes to login screen |
| Language toggle | Dari / Pashto / English (persisted in local storage) |

### 2. Account Type Selection

User chooses whether they are a buyer or a seller before seeing the registration form.

| Element | Details |
|---------|---------|
| Buyer card | Icon + short description ("I want to buy products") |
| Seller card | Icon + short description ("I want to sell products") |
| Back button | Return to welcome screen |

Selecting a type routes to the appropriate registration form.

### 3. Buyer Registration (multi-step form)

Buyer registration collects a lot of data (identity verification). Break it into steps so it doesn't feel overwhelming.

**Step 1: Personal Information**

| Field | Type | Validation |
|-------|------|------------|
| First Name | Text input | Required, 2-50 chars, alphabetic |
| Last Name | Text input | Required, 2-50 chars, alphabetic |
| Father's Name | Text input | Required, 2-50 chars |
| Date of Birth | Date picker | Required, must be 18+ |
| Email | Email input | Required, valid email format |
| Phone Number | Phone input | Required, Afghan format (+93 or 07...) |
| Password | Password input | Required, min 8 chars, 1 uppercase, 1 number, 1 special char |
| Confirm Password | Password input | Must match password |

**Step 2: Identity Verification**

| Field | Type | Validation |
|-------|------|------------|
| National ID Number | Text input | Required, unique |
| National ID Photo | Camera / file upload | Required, JPG/PNG, max 5MB |
| Profile Photo | Camera capture | Required, must be a live photo (front camera), JPG/PNG |

On mobile: open the front camera directly for the profile photo. On web/desktop: allow webcam capture or file upload.

**Step 3: Delivery Address**

| Field | Type | Validation |
|-------|------|------------|
| Street Address | Text input | Required |
| District | Text input | Required |
| City | Text input or dropdown | Required |
| Province | Dropdown (34 provinces) | Required |
| Nearby Landmark | Text input | Optional |

**Step 4: Review & Submit**

Show a summary of all entered data. User can go back to any step to edit. On submit:

1. Call `POST /api/users/register/buyer/`
2. On success: receive JWT tokens + `verification_status`
3. Store tokens (see [API Integration](./api-integration.md))
4. Route to phone verification screen

### 4. Seller Registration (multi-step form)

Same steps as buyer, plus business information.

**Steps 1-3:** Identical to buyer registration.

**Step 4: Business Information**

| Field | Type | Validation |
|-------|------|------------|
| Shop Name | Text input | Required, 3-100 chars, unique |
| Shop Category | Dropdown | Required (electronics, clothing, food, etc.) |
| Business Phone | Phone input | Required |
| Business License Number | Text input | Required |
| Business License Photo | Camera / file upload | Required, JPG/PNG, max 5MB |
| Shop Address (Street) | Text input | Required |
| Shop Address (District) | Text input | Required |
| Shop Address (City) | Text input or dropdown | Required |
| Shop Address (Province) | Dropdown | Required |
| Business Description | Textarea | Optional, max 2000 chars |

**Step 5: Review & Submit**

Same as buyer -- summary, edit, submit. On success: JWT tokens + route to phone verification.

### 5. Phone Verification Screen

Shown immediately after registration (user is already logged in with JWT).

| Element | Details |
|---------|---------|
| Instructions | "We sent a 6-digit code to +93XXXXXXXXX" |
| Code input | 6 individual digit boxes (auto-advance on input) |
| Submit button | Calls `POST /api/users/verify-phone/` |
| Resend button | Calls `POST /api/users/verify-phone/resend/`, disabled for 60s cooldown |
| Countdown timer | Shows seconds remaining before resend is available |
| Error display | "Invalid code", "Code expired", "Too many attempts" |

On success: update local `verification_status.phone = true`, route to next pending verification or home.

### 6. Email Verification

This is not a screen the user fills out -- they click a link in their email.

**In-app behavior:**
- Show a banner/card on the home screen: "Please verify your email. Check your inbox."
- "Resend email" button (calls `POST /api/users/verify-email/resend/`)
- When the user clicks the email link, it opens `https://amazebid.com/verify-email?token=...`
- The frontend calls `GET /api/users/verify-email/?token=<token>`
- On success: show "Email verified!" confirmation screen, update `verification_status.email = true`

**Mobile/Desktop:** The email link should use a deep link or universal link to open the app directly. Fallback: open in browser, which redirects back to the app.

### 7. Waiting for ID Verification

After phone and email are verified, the user waits for an admin to verify their national ID + profile photo.

| Element | Details |
|---------|---------|
| Status card | "Your identity is being reviewed by our team" |
| Estimated wait | "This usually takes 24-48 hours" |
| What they submitted | Show thumbnail of ID photo and profile photo |
| Contact support | Link/button to reach support if it's taking too long |

The user can still browse the catalog while waiting, but cannot place orders or (for sellers) list products.

### 8. Login Screen

| Element | Details |
|---------|---------|
| Email input | Required |
| Password input | Required, with show/hide toggle |
| "Log In" button | Calls `POST /api/users/login/` |
| "Forgot Password?" link | Routes to password reset |
| "Create Account" link | Routes to account type selection |
| Error display | "Invalid credentials", "Account suspended" |

On success:
1. Receive `{access, refresh, user, verification_status}`
2. Store tokens
3. Route based on `verification_status`:
   - Phone not verified -> phone verification screen
   - Email not verified -> home with email banner
   - ID not verified -> home with ID pending banner
   - Seller not approved -> seller waiting screen
   - Everything verified -> home screen

### 9. Password Reset

**Step 1: Request reset**

| Element | Details |
|---------|---------|
| Email input | Required |
| Submit button | Calls `POST /api/users/password-reset/` |
| Success message | "Check your email for reset instructions" |

**Step 2: Set new password** (user arrives via email link)

| Element | Details |
|---------|---------|
| New password input | Required, same strength rules as registration |
| Confirm password input | Must match |
| Submit button | Calls `POST /api/users/password-reset/confirm/` |
| Success message | "Password reset. You can now log in." |

### 10. Profile Screen

Accessible from the main navigation. Shows current user info with edit capability.

**Buyer profile shows:**
- Profile photo (editable)
- Full name, father's name
- Email, phone number
- Verification badges (phone, email, ID)
- Saved addresses (link to address management)
- Language preference

**Seller profile shows (in addition):**
- Shop name, shop category
- Business phone, business description
- Business license info
- Approval status
- Commission rate

Editing calls `PATCH /api/users/me/`.

### 11. Address Management

Accessible from profile or during checkout.

| Element | Details |
|---------|---------|
| Address list | All saved addresses, default marked with a badge |
| Add button | Opens address form |
| Edit button (per address) | Inline edit or modal |
| Delete button (per address) | Confirm dialog before deletion |
| "Set as default" toggle | Only one address can be default |

---

## Auth State Management

The frontend must track:

```typescript
interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'buyer' | 'seller' | 'admin';
    profilePhoto: string | null;
  } | null;
  verificationStatus: {
    phone: boolean;
    email: boolean;
    id: boolean;
    sellerApproved?: boolean;
  } | null;
}
```

**Token storage:**
- Web: `localStorage` for refresh token, memory for access token (more secure)
- Desktop: Electron `safeStorage` or encrypted file for refresh token
- Mobile: `expo-secure-store` for refresh token

**Token refresh:** Intercept 401 responses, call `/api/users/token/refresh/`, retry the original request. If refresh fails, log the user out.

---

## Route Protection

| Route pattern | Access rule |
|---------------|------------|
| `/login`, `/register/*` | Public only (redirect to home if logged in) |
| `/verify-phone` | Logged in + phone not verified |
| `/verify-email` | Public (link from email) |
| `/` (home), `/products/*` | Everyone (logged in or not) |
| `/cart`, `/checkout` | Logged in buyer |
| `/orders/*` | Logged in + fully verified |
| `/seller/*` | Logged in + approved seller |
| `/admin/*` | Logged in + admin role |
| `/profile`, `/settings` | Logged in |

---

## Platform-Specific Notes

| Feature | Web | Desktop | Mobile |
|---------|-----|---------|--------|
| Profile photo capture | Webcam or file upload | Webcam or file upload | Front camera (native) |
| ID photo upload | File picker | File picker | Camera or gallery |
| Phone input | Standard input | Standard input | Native phone keyboard |
| SMS auto-fill | Not available | Not available | Auto-read SMS code (Android) |
| Email deep link | Browser redirect | Custom protocol handler | Universal/deep link |
| Token storage | localStorage | Electron safeStorage | expo-secure-store |
| Biometric login | Not available | Not available | FaceID / fingerprint (future) |

---

## Shared Package Updates Needed

The `@amazebid/shared` types need to be updated to match the backend:

```typescript
// packages/shared/src/types.ts additions

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  phoneNumber: string;
  role: 'buyer' | 'seller' | 'admin' | 'driver';
  profilePhoto: string | null;
  dateOfBirth: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isIdVerified: boolean;
  dateJoined: string;
}

export interface VerificationStatus {
  phone: boolean;
  email: boolean;
  id: boolean;
  sellerApproved?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  verificationStatus: VerificationStatus;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  district: string;
  city: string;
  province: string;
  country: string;
  nearbyLandmark?: string;
  isDefault: boolean;
}
```

The `CURRENCY` constant should be updated to AFN:

```typescript
export const CURRENCY = {
  DEFAULT: "AFN",
  SYMBOL: "؋",
} as const;
```

The `ROUTES` constant should be expanded:

```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER_TYPE: "/register",
  REGISTER_BUYER: "/register/buyer",
  REGISTER_SELLER: "/register/seller",
  VERIFY_PHONE: "/verify-phone",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  PROFILE: "/profile",
  ADDRESSES: "/profile/addresses",
  SETTINGS: "/settings",
  // ... more routes added by other feature docs
} as const;
```
