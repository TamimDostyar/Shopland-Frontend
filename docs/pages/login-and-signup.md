# Login & Signup Pages

## Access

Public pages. If already logged in, redirect to home.

---

## Login Page

### URL: `/login`

### Layout

```
┌────────────────────────────────────┐
│           [Shopland Logo]          │
│                                    │
│     Welcome back to Shopland       │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  Email                       │  │
│  └──────────────────────────────┘  │
│  ┌──────────────────────────────┐  │
│  │  Password            [👁]    │  │
│  └──────────────────────────────┘  │
│                                    │
│        Forgot password? →          │
│                                    │
│  ┌──────────────────────────────┐  │
│  │         Log In               │  │
│  └──────────────────────────────┘  │
│                                    │
│  ─────────── or ───────────────    │
│                                    │
│    Don't have an account?          │
│         Create Account →           │
│                                    │
│  Language: [Dari ▼]                │
└────────────────────────────────────┘
```

### Field Details

| Field | Behavior |
|-------|----------|
| Email | Auto-focus on page load. Shows keyboard with @ key on mobile |
| Password | Hidden by default. Eye icon toggles visibility |
| Forgot password | Link to `/forgot-password` |
| Log In button | Disabled until both fields have input. Shows spinner while loading |
| Create Account | Link to `/register` (account type selection) |
| Language toggle | Bottom of form. Persisted to localStorage |

### Error States

| Error | Display |
|-------|---------|
| Wrong credentials | Red banner above form: "Invalid email or password" |
| Account suspended | Red banner: "Your account has been suspended. Contact support." |
| Network error | Red banner: "Unable to connect. Check your internet connection." |
| Field empty on submit | Red border on empty field + "This field is required" |

### After Successful Login

Route based on `verification_status` from the JWT response:

| Status | Route to |
|--------|----------|
| Phone not verified | `/verify-phone` |
| All verified | Home (`/`) or the page they were trying to access before redirect |

Always store the "intended URL" when redirecting to login (e.g., buyer was on `/checkout` -> login -> back to `/checkout`).

---

## Account Type Selection Page

### URL: `/register`

```
┌────────────────────────────────────────────────┐
│              [Shopland Logo]                    │
│                                                 │
│        How do you want to use Shopland?         │
│                                                 │
│  ┌──────────────────────┐  ┌──────────────────┐│
│  │     🛒               │  │     🏪           ││
│  │                      │  │                   ││
│  │   I want to buy      │  │  I want to sell   ││
│  │                      │  │                   ││
│  │  Browse and purchase │  │  List products    ││
│  │  products from local │  │  and manage your  ││
│  │  sellers             │  │  shop             ││
│  │                      │  │                   ││
│  │    [Get Started]     │  │   [Get Started]   ││
│  └──────────────────────┘  └──────────────────┘│
│                                                 │
│         Already have an account? Log In →        │
└─────────────────────────────────────────────────┘
```

| Element | Details |
|---------|---------|
| Buyer card | Routes to `/register/buyer` |
| Seller card | Routes to `/register/seller` |
| Hover/tap | Card elevates or highlights |
| Log In link | Routes to `/login` |

---

## Buyer Registration

### URL: `/register/buyer`

Multi-step wizard with progress indicator at the top.

```
Step 1        Step 2         Step 3        Step 4
Personal ──── Identity ──── Address ──── Review
  [●]           [○]           [○]          [○]
```

### Step 1: Personal Information `/register/buyer?step=1`

```
┌────────────────────────────────────────┐
│  ← Back            Step 1 of 4         │
│                                        │
│         Personal Information           │
│                                        │
│  First Name *                          │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Last Name *                           │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Father's Name *                       │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Date of Birth *                       │
│  ┌──────────────────────────────────┐  │
│  │  DD / MM / YYYY          [📅]   │  │
│  └──────────────────────────────────┘  │
│  Email *                               │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Phone Number *                        │
│  ┌────┬────────────────────────────┐   │
│  │+93 │                            │   │
│  └────┴────────────────────────────┘   │
│  Password *                            │
│  ┌──────────────────────────────────┐  │
│  │                          [👁]    │  │
│  └──────────────────────────────────┘  │
│  ░░░░░░░░░░ Weak                       │
│  Confirm Password *                    │
│  ┌──────────────────────────────────┐  │
│  │                          [👁]    │  │
│  └──────────────────────────────────┘  │
│                                        │
│           [Next Step →]                │
└────────────────────────────────────────┘
```

| Detail | Behavior |
|--------|----------|
| Password strength bar | Changes color: red (weak) -> yellow (fair) -> green (strong) |
| Phone number | Country code pre-filled as +93. Validates Afghan format |
| Date picker | Calendar popup or scroll wheels on mobile |
| "Next Step" | Validates all fields. Shows inline errors. Only advances if valid |
| Back button | Returns to account type selection |

### Step 2: Identity Verification `/register/buyer?step=2`

```
┌────────────────────────────────────────┐
│  ← Back            Step 2 of 4         │
│                                        │
│        Identity Verification           │
│                                        │
│  We need to verify your identity to    │
│  keep the platform safe for everyone.  │
│                                        │
│  National ID Number (Tazkira) *        │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  National ID Photo *                   │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │     📷 Take Photo               │  │
│  │     📁 Upload from Gallery      │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Photo of both sides of your ID       │
│                                        │
│  Your Photo *                          │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │       [Camera Preview]           │  │
│  │                                  │  │
│  │        📸 Take Selfie           │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  A clear photo of your face. This      │
│  must match your ID photo.             │
│                                        │
│           [Next Step →]                │
└────────────────────────────────────────┘
```

| Detail | Behavior |
|--------|----------|
| National ID photo | Camera opens or file picker. Shows preview after capture. "Retake" button |
| Profile photo | Front camera opens directly on mobile. Webcam dialog on web/desktop. Must be a live capture, not gallery upload (for fraud prevention) |
| Preview | After capture, show the photo with "Retake" and "Use This Photo" buttons |
| File validation | Max 5MB, JPG/PNG only. Show error if too large or wrong format |

### Step 3: Delivery Address `/register/buyer?step=3`

```
┌────────────────────────────────────────┐
│  ← Back            Step 3 of 4         │
│                                        │
│         Delivery Address               │
│                                        │
│  Province *                            │
│  ┌──────────────────────────────────┐  │
│  │  Select province           [▼]  │  │
│  └──────────────────────────────────┘  │
│  City *                                │
│  ┌──────────────────────────────────┐  │
│  │  Select city               [▼]  │  │
│  └──────────────────────────────────┘  │
│  District *                            │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Street Address *                      │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Nearby Landmark                       │
│  ┌──────────────────────────────────┐  │
│  │  e.g. "Near the blue mosque"    │  │
│  └──────────────────────────────────┘  │
│                                        │
│           [Next Step →]                │
└────────────────────────────────────────┘
```

| Detail | Behavior |
|--------|----------|
| Province dropdown | All 34 Afghan provinces |
| City dropdown | Filtered based on selected province |
| Landmark | Optional but encouraged. Placeholder gives an example |

### Step 4: Review & Submit `/register/buyer?step=4`

```
┌────────────────────────────────────────┐
│  ← Back            Step 4 of 4         │
│                                        │
│         Review Your Information        │
│                                        │
│  Personal Information          [Edit]  │
│  ┌──────────────────────────────────┐  │
│  │  Tamim Dostyar                   │  │
│  │  Father: Ahmad                   │  │
│  │  DOB: 15/06/1995                │  │
│  │  Email: tamim@email.com          │  │
│  │  Phone: +93 70 123 4567         │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Identity                      [Edit]  │
│  ┌──────────────────────────────────┐  │
│  │  ID: 1234567890                  │  │
│  │  [ID Photo Preview] [Selfie]    │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Address                       [Edit]  │
│  ┌──────────────────────────────────┐  │
│  │  District 5, Kabul, Kabul       │  │
│  │  Near the blue mosque           │  │
│  └──────────────────────────────────┘  │
│                                        │
│  □ I agree to the Terms of Service     │
│    and Privacy Policy                  │
│                                        │
│        [Create Account]                │
└────────────────────────────────────────┘
```

| Detail | Behavior |
|--------|----------|
| Edit buttons | Each section's "Edit" returns to that specific step |
| Photo previews | Small thumbnails of ID and profile photos |
| Terms checkbox | Required. Links to Terms and Privacy pages |
| "Create Account" | Disabled until terms are agreed. Shows spinner. Calls register API |
| On success | Receive JWT, route to `/verify-phone` |

---

## Seller Registration

Same steps 1-4 as buyer, plus Step 4 becomes "Business Information" and Step 5 is "Review."

### Extra Step: Business Information

```
┌────────────────────────────────────────┐
│  ← Back            Step 4 of 5         │
│                                        │
│        Business Information            │
│                                        │
│  Shop Name *                           │
│  ┌──────────────────────────────────┐  │
│  │  e.g. "Tech Kabul"              │  │
│  └──────────────────────────────────┘  │
│  Shop Category *                       │
│  ┌──────────────────────────────────┐  │
│  │  Select category           [▼]  │  │
│  └──────────────────────────────────┘  │
│  Business Phone *                      │
│  ┌────┬────────────────────────────┐   │
│  │+93 │                            │   │
│  └────┴────────────────────────────┘   │
│  Business License Number *             │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  Business License Photo *              │
│  ┌──────────────────────────────────┐  │
│  │     📷 Take Photo               │  │
│  │     📁 Upload from Gallery      │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Shop Address                          │
│  (same fields as delivery address)     │
│                                        │
│  Business Description                  │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│  0/2000 characters                     │
│                                        │
│           [Next Step →]                │
└────────────────────────────────────────┘
```

---

## Phone Verification Page

### URL: `/verify-phone`

```
┌────────────────────────────────────────┐
│                                        │
│           [Phone Icon 📱]              │
│                                        │
│      Verify Your Phone Number          │
│                                        │
│   We sent a 6-digit code to            │
│   +93 70 *** **67                      │
│                                        │
│       ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐       │
│       │ │ │ │ │ │ │ │ │ │ │ │       │
│       └─┘ └─┘ └─┘ └─┘ └─┘ └─┘       │
│                                        │
│          [Verify Code]                 │
│                                        │
│   Didn't receive the code?             │
│   Resend code (available in 47s)       │
│                                        │
│   Wrong phone number? Contact support  │
└────────────────────────────────────────┘
```

| Detail | Behavior |
|--------|----------|
| Code input | 6 individual boxes. Auto-advance cursor. Auto-submit on 6th digit |
| Phone number | Partially masked for security |
| Resend | Disabled with countdown (60s). After 5 resends: "Maximum attempts reached. Try again in 1 hour." |
| Auto-read SMS (mobile) | Android: auto-fill from SMS. iOS: suggest from clipboard |
| Success | Green checkmark animation, then route to home |

---

## Forgot Password Page

### URL: `/forgot-password`

```
┌────────────────────────────────────────┐
│  ← Back to Login                       │
│                                        │
│         Reset Your Password            │
│                                        │
│  Enter the email address you used      │
│  to create your account.               │
│                                        │
│  Email *                               │
│  ┌──────────────────────────────────┐  │
│  │                                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│       [Send Reset Link]               │
│                                        │
│  ─────── After submit ─────────────    │
│                                        │
│         ✉️ Check Your Email            │
│                                        │
│  We sent a password reset link to      │
│  t****@email.com                       │
│                                        │
│  Didn't receive it? Resend →           │
└────────────────────────────────────────┘
```
