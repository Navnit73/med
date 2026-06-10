# 02 · Users & Roles

Defines the unified **User** table, the two role-based profiles (`admin_users` and `patients`), and the **RBAC matrix** that determines which role can call which endpoint.

---

## 1. Concept

A single `users` table holds authentication state (phone, hashed OTP, JWT identifiers, status). The user's `role` is fixed at creation: `admin` or `patient`. Each role optionally joins to a profile table:

- `admin_users` — display name, email, super-admin flag, hospital assignment (if any)
- `patients` — registration wizard data, MRN, status, demographics, medical history

A user **cannot be both admin and patient** in this product — the auth verify endpoint enforces this.

---

## 2. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/users/{id}` | admin | Get any user (admin only). |
| `GET` | `/admin/users` | admin | List admin users. |
| `POST` | `/admin/users` | super-admin | Create new admin user. |
| `PATCH` | `/admin/users/{id}` | super-admin | Update admin user. |
| `DELETE` | `/admin/users/{id}` | super-admin | Soft-delete admin user. |
| `POST` | `/admin/users/{id}/disable` | super-admin | Disable admin user. |
| `POST` | `/admin/users/{id}/enable` | super-admin | Re-enable disabled admin user. |

---

## 3. User entity

```ts
User {
  id:                 UUID          // PK
  phone:              string        // unique, E.164 (+91XXXXXXXXXX)
  phone_verified:     boolean
  role:               "admin" | "patient"
  status:             "active" | "disabled" | "pending_verification"
  name:               string | null // display name, may be null for pending patients
  email:              string | null
  created_at:         DateTime
  updated_at:         DateTime
  last_login_at:      DateTime | null
  deleted_at:         DateTime | null
}
```

### Status meanings

| Status | Meaning |
|---|---|
| `active` | Verified phone, can authenticate, can call role-permitted endpoints. |
| `disabled` | Manually disabled by super-admin. Cannot authenticate. |
| `pending_verification` | Account exists but phone is not yet verified (transient — used during patient self-registration before first OTP). |

---

## 4. Admin user entity

```ts
AdminUser {
  user_id:            UUID          // PK, FK -> users.id
  email:              string        // business email, required
  display_name:       string        // required
  is_super_admin:     boolean       // super-admins can create other admins
  hospital_id:        UUID | null   // optional, hospital scoping
  avatar_url:         string | null
  preferences:        object        // JSON, e.g. {"theme":"light","locale":"en-IN"}
  created_at:         DateTime
  updated_at:         DateTime
}
```

The hardcoded admin in the frontend (`"Admin User"`, `"admin@medexpert.com"`) is replaced by a real seeded admin user with phone `+910000000000` (or whatever the operator configures) and `is_super_admin = true`.

### Admin user response shape (from `GET /v1/admin/users/{id}`)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "phone": "+910000000000",
  "email": "admin@medexpert.com",
  "display_name": "Admin User",
  "is_super_admin": true,
  "hospital_id": null,
  "avatar_url": null,
  "preferences": { "theme": "light" },
  "status": "active",
  "last_login_at": "2026-06-10T08:14:22.103Z",
  "created_at": "2026-01-01T00:00:00Z"
}
```

---

## 5. RBAC matrix

`✓` = allowed · `✗` = forbidden · `△` = allowed with conditions

| Endpoint | Public | Patient | Admin | Super-admin |
|---|---|---|---|---|
| `POST /auth/otp/request` | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/otp/verify` | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/refresh` | ✓ | ✓ | ✓ | ✓ |
| `POST /auth/logout` | — | ✓ | ✓ | ✓ |
| `GET /auth/me` | — | ✓ | ✓ | ✓ |
| `GET /public/*` | ✓ | ✓ | ✓ | ✓ |
| `GET /hospitals` | ✓ | ✓ | ✓ | ✓ |
| `GET /hospitals/{id}` | ✓ | ✓ | ✓ | ✓ |
| `POST /hospitals` | — | — | ✓ | ✓ |
| `PATCH /hospitals/{id}` | — | — | △ (own hospital) | ✓ |
| `DELETE /hospitals/{id}` | — | — | ✗ | ✓ |
| `GET /hospitals/{id}/dashboard` | — | — | △ (own hospital) | ✓ |
| `GET /hospitals/{hospital_id}/departments` | — | — | △ (own hospital) | ✓ |
| `POST /hospitals/{hospital_id}/departments` | — | — | △ (own hospital) | ✓ |
| `PATCH /departments/{id}` | — | — | △ (own hospital) | ✓ |
| `DELETE /departments/{id}` | — | — | △ (own hospital) | ✓ |
| `GET /hospitals/{hospital_id}/doctors` | — | — | △ (own hospital) | ✓ |
| `GET /doctors` | ✓ | ✓ | ✓ | ✓ |
| `GET /doctors/{id}` | ✓ | ✓ | ✓ | ✓ |
| `POST /doctors` | — | — | △ (own hospital) | ✓ |
| `PATCH /doctors/{id}` | — | — | △ (own hospital) | ✓ |
| `DELETE /doctors/{id}` | — | — | △ (own hospital) | ✓ |
| `GET /hospitals/{hospital_id}/contracts` | — | — | △ (own hospital) | ✓ |
| `POST /hospitals/{hospital_id}/contracts` | — | — | △ (own hospital) | ✓ |
| `PATCH /contracts/{id}` | — | — | △ (own hospital) | ✓ |
| `DELETE /contracts/{id}` | — | — | △ (own hospital) | ✓ |
| `GET /hospitals/{hospital_id}/patients` | — | — | △ (own hospital) | ✓ |
| `GET /patients` | — | — | △ (own hospital) | ✓ |
| `GET /patients/{id}` | — | — | △ (own hospital) | ✓ |
| `GET /patients/me` | — | ✓ | ✗ | ✗ |
| `POST /patients` | — | △ (self only) | △ (own hospital) | ✓ |
| `PATCH /patients/{id}` | — | △ (self only) | △ (own hospital) | ✓ |
| `DELETE /patients/{id}` | — | — | △ (own hospital) | ✓ |
| `POST /consultations` | — | ✓ | ✗ | ✗ |
| `GET /consultations/me` | — | ✓ | ✗ | ✗ |
| `GET /consultations` | — | — | △ (own hospital) | ✓ |
| `GET /consultations/{id}` | — | △ (own) | △ (own hospital) | ✓ |
| `POST /consultations/{id}/cancel` | — | △ (own) | △ (own hospital) | ✓ |
| `POST /uploads` | — | ✓ | ✓ | ✓ |
| `GET /uploads/{id}` | — | △ (own) | △ (own hospital) | ✓ |
| `DELETE /uploads/{id}` | — | △ (own) | △ (own hospital) | ✓ |
| `POST /ai/summarize` | — | ✓ | ✓ | ✓ |
| `GET /analytics/overview` | — | — | ✓ | ✓ |
| `GET /analytics/hospital/{id}` | — | — | △ (own hospital) | ✓ |

### Hospital scoping for admins

Non-super-admin admin users may be assigned to one or more hospitals via `admin_users.hospital_id` (or a join table `admin_hospital_assignments` for many-to-many). Endpoints marked `△ (own hospital)` enforce that the resource's `hospital_id` is in the admin's assigned hospitals. If the admin has no assignments, they only see network-wide data (`/analytics/overview`, etc.).

### Implementation

Use a FastAPI dependency that:
1. Extracts the JWT and resolves the current user.
2. Loads the user's role.
3. Loads the resource's `hospital_id` (or uses the `hospital_id` path param).
4. Returns a `Principal` object with `user_id`, `role`, `hospital_ids[]`.
5. Per-endpoint guard checks `Principal.can(action, resource)`.

### Example

```python
async def require_hospital_member(hospital_id: UUID, principal: Principal = Depends(get_principal)) -> Principal:
    if principal.role == "super_admin":
        return principal
    if hospital_id not in principal.hospital_ids:
        raise HTTPException(status_code=403, detail={"code": "forbidden", "message": "..."})
    return principal
```

---

## 6. Create admin user

```
POST /v1/admin/users
```

Super-admin only. Creates a new admin user. The phone is associated with the new account; the user will receive an OTP on first login.

### Request

```json
{
  "phone": "+919876543210",
  "email": "ops@medexpert.in",
  "display_name": "Ops Manager",
  "is_super_admin": false,
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003"
}
```

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440099",
  "phone": "+919876543210",
  "email": "ops@medexpert.in",
  "display_name": "Ops Manager",
  "is_super_admin": false,
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "status": "active",
  "created_at": "2026-06-10T08:14:22.103Z"
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Phone/email format wrong. |
| 403 | `forbidden` | Caller is not super-admin. |
| 409 | `conflict` | Phone already registered. |

---

## 7. Disable / enable admin user

```
POST /v1/admin/users/{id}/disable
POST /v1/admin/users/{id}/enable
```

Sets the user's `status` to `disabled` or back to `active`. Disabled users cannot authenticate. Used for off-boarding and re-instating admin accounts.

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440099",
  "status": "disabled"
}
```

---

## 8. List admin users

```
GET /v1/admin/users?page=1&per_page=20&status=active&q=ops
```

Super-admin only. Supports pagination and search across phone, email, and display name.

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440099",
      "phone": "+919876543210",
      "email": "ops@medexpert.in",
      "display_name": "Ops Manager",
      "is_super_admin": false,
      "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
      "status": "active",
      "last_login_at": "2026-06-10T08:14:22.103Z",
      "created_at": "2026-06-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

---

## 9. Audit log

Every write to `users`, `admin_users`, or RBAC-changing endpoints records an entry in `audit_log`:

```ts
AuditLog {
  id:              UUID
  actor_user_id:   UUID          // the admin who performed the action
  action:          string        // "user.create", "user.disable", "user.enable", etc.
  entity_type:     string        // "user", "admin_user"
  entity_id:       UUID
  before:          object | null
  after:           object | null
  ip_address:      string
  user_agent:      string
  created_at:      DateTime
}
```

The audit log is **append-only** and **not exposed** to the frontend by default. Future feature: `/admin/audit-log` for super-admin viewing.