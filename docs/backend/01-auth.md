# 01 · Authentication

The MedExpert backend authenticates users via **phone + OTP**, matching the frontend's existing SignIn component (`/signin`). The same flow works for both **admin** and **patient** roles — role is resolved from the user's account after OTP verification.

> **Flow recap from frontend:** Phone + OTP → "Login" → navigates to `/admin` or `/patient` based on role.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `POST` | `/auth/otp/request` | No | Request OTP for a phone number. |
| `POST` | `/auth/otp/verify` | No | Verify OTP, issue JWT. |
| `POST` | `/auth/refresh` | No (refresh token) | Issue new access token. |
| `POST` | `/auth/logout` | Yes | Revoke tokens. |
| `GET` | `/auth/me` | Yes | Return current user. |

All paths are relative to `/v1`.

---

## 2. Request OTP

```
POST /v1/auth/otp/request
```

Sends a 6-digit OTP to the phone number. Rate-limited to 3 requests per phone in 10 minutes.

### Request

```json
{
  "phone": "+919876543210"
}
```

### Response

```
200 OK
```

```json
{
  "ok": true,
  "message": " OTP sent successfully. Please enter the 6-digit code.",
  "expires_in_seconds": 300
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `invalid_phone` | Phone does not match `+91` followed by 10 digits. |
| 429 | `rate_limited` | More than 3 OTP requests in 10 min for this phone. |
| 422 | `business_rule_violated` | Phone number not registered for admin role (admin-only accounts are created by admins, not self-registered; see error message). |

The frontend uses `+91` prefix automatically on submit — clients must include the country code.

---

## 3. Verify OTP

```
POST /v1/auth/otp/verify
```

Verifies the OTP and issues a **JWT access token** (15-min expiry) and a **JWT refresh token** (30-day expiry). If the phone does not yet have an account for the requested role, the endpoint creates a **pending user** (role-dependent):

- `role=patient` → a new `patient` account is created in pending state (user must complete registration wizard to become active).
- `role=admin` → the phone must already exist in the `admin_users` table (created by the super-admin), otherwise `422 business_rule_violated`.

### Request

```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "role": "patient" | "admin"
}
```

### Response

```
200 OK
```

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "phone": "+919876543210",
    "role": "patient",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "status": "active",
    "created_at": "2026-01-15T08:14:22.103Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token_expires_in": 900,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token_expires_in": 2592000,
  "token_type": "Bearer"
}
```

If `role=patient` and the user has already completed a registrationWizard and has a `patient` profile, the `patient` profile is embedded:

```json
{
  "user": { ... },
  "patient": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "mrn": "MRN-10000",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active"
  },
  "access_token": "...",
  "refresh_token": "..."
}
```

### Token payload

Access token:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440001",
  "role": "patient",
  "type": "access",
  "exp": 1718027662,
  "iat": 1718026762
}
```

Refresh token:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440001",
  "role": "patient",
  "type": "refresh",
  "exp": 1749562762,
  "iat": 1718026762
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `invalid_phone` | Phone format wrong. |
| 400 | `invalid_otp` | OTP format wrong (not 6 digits). |
| 400 | `invalid_code` | OTP code mismatch. |
| 404 | `user_not_found` | `role=admin` and phone not in admin_users. |
| 422 | `business_rule_violated` | Phone already has a role that does not match requested role (a user cannot be both admin and patient). |
| 429 | `rate_limited` | More than 10 OTP verifications in 10 min for this phone. |
| 423 | `account_locked` | Phone locked due to too many failed attempts. |

---

## 4. Refresh token

```
POST /v1/auth/refresh
```

Exchanges the refresh token (HTTP-only cookie or `X-Refresh-Token` header) for a fresh access token. The refresh token rotates after each use (new token issued, old one is invalidates after 30 days of idle or after `JWT_REFRESH_TTL`).

### Request (header style)

```
X-Refresh-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response

```
200 OK
```

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access_token_expires_in": 900,
  "token_type": "Bearer"
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 401 | `token_invalid` | Refresh token missing, malformed, or revoked. |
| 401 | `token_expired` | Refresh token expired. |

---

## 5. Logout

```
POST /v1/auth/logout
```

Revokes the current access token and refresh token. Marks the refresh token as used in a redis set to prevent reuse (rotation).

### Request (none)

No body is sent. The `Authorization` header carries the current access token.

### Response

```
204 No Content
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 401 | `unauthenticated` | Missing `Authorization` header. |

---

## 6. Get current user

```
GET /v1/auth/me
```

Returns the authenticated user. Used by the frontend `AuthGuard` to hydrate the user after page load (replaces `localStorage` reads).

### Response

```
200 OK
```

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "phone": "+919876543210",
    "role": "patient",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "status": "active",
    "created_at": "2026-01-15T08:14:22.103Z"
  }
}
```

If the user is a patient with a registered profile:

```json
{
  "user": { ... },
  "patient": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "mrn": "MRN-10000",
    "first_name": "John",
    "last_name": "Doe",
    "status": "active",
    "registered_at": "2026-01-16T10:30:00Z"
  }
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 401 | `unauthenticated` | Token missing or invalid. |

---

## 7. Implementation notes for this module

### OTP generation

- Generate a cryptographically random 6-digit string, not a sequence like `123456`.
- Store hashed with bcrypt/argon2, not plaintext. Do not expose the OTP in logs.
- Store one active OTP per phone in Redis (`otp:{phone}` → hashed value + TTL 300s). Overwrite any existing OTP.
- On successful verify: delete the key from Redis. If verify fails, increment a failure counter (`otp:{phone}:failures`). After 5 failures, lock the phone for 15 minutes (Redis `SETNX` with TTL 900).

### JWT signing

- Use HS256 for symmetric signing with `JWT_SECRET`. `JWT_SECRET` must be at least 256 bits.
- Algorithm in token header must match `JWT_ALG` (default `HS256`).
- Access tokens are short-lived (15 min) for security. Refresh tokens are long (30 days) but rotate on each use.
- Store revoked refresh tokens in Redis (set of jti) for instant revocation (database is too slow).

### Admin user creation

- Admin users are created by the super-admin via `/admin/users` (see [`02-users-and-roles.md`](./02-users-and-roles.md)).
- Phone verification for admin role checks existence in `admin_users` table before issuing tokens.
- The default admin user (`+91` as configured) should be seeded.

### Phone number normalization

- Strip all characters except `0-9` and leading `+`.
- If it starts with `91` without `+`, prepend `+`.
- Must be exactly 12 characters after normalization: `+91<10 digits>`.
- Validate with a regex like `^\+91[1-9]\d{9}$`.

### Frontend integration

- The frontend sends `phone` (with `+91` prefix added before submission) + `otp` + `role: 'patient' | 'admin'`.
- On `200`, store `access_token` in memory (do not store in localStorage — XSS risk) and `refresh_token` in an HTTP-only cookie (or fallback to `localStorage` encrypted).
- The `role` field is used only on the login screen — after login, the role is determined by the `user.role` from the token, not the UI.
- The frontend's `logout()` must call this endpoint on sign-out, not just clear `localStorage`.