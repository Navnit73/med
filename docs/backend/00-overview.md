# 00 · Overview

This file defines everything that is **shared** by every endpoint: base URL, headers, error envelope, pagination, idempotency, rate limits, status codes, timestamps, and the conventions every other module assumes.

---

## 1. Base URL

```
Production    https://api.medexpert.in/v1
Staging       https://api-staging.medexpert.in/v1
Local         http://localhost:8000/v1
```

All paths in this spec are relative to `/v1`. The version is part of the path; breaking changes bump to `/v2`.

---

## 2. Transport & content negotiation

- **HTTPS only** in non-local environments. HTTP requests are redirected (308) to HTTPS.
- All requests and responses use `Content-Type: application/json; charset=utf-8` unless the endpoint is multipart (uploads).
- All request and response bodies are **JSON**, UTF-8 encoded, with no trailing whitespace and no comments.
- All `Date` / `DateTime` fields use **ISO 8601 in UTC with explicit `Z` suffix** (e.g. `"2026-06-10T08:14:22.103Z"`). Dates without time use `"YYYY-MM-DD"`.
- All monetary amounts are **integer paise** (1 INR = 100 paise). The frontend may format with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- All IDs are **UUIDv4 strings** unless explicitly stated otherwise. Legacy integer IDs are not used.

---

## 3. Authentication header

Every authenticated request must carry:

```
Authorization: Bearer <access_token>
```

The `access_token` is a JWT (HS256, 15-minute expiry) issued by `/auth/otp/verify` or `/auth/refresh`. The frontend should:

1. Send `Authorization: Bearer <access_token>` on every request.
2. On `401 token_expired`, call `POST /auth/refresh` with the refresh token (HTTP-only cookie or `X-Refresh-Token` header), store the new access token, and retry the original request **once**.
3. On `401 token_revoked` or `401 token_invalid`, drop both tokens and redirect to `/signin`.

### Refresh token transport

Two options — pick one per deployment:

| Option | Transport | Use when |
|---|---|---|
| **HTTP-only cookie** (recommended) | `Set-Cookie: medexpert_refresh=...; HttpOnly; Secure; SameSite=Lax; Path=/v1/auth` | Browser SPAs. Cannot be read by JS, immune to XSS exfiltration. |
| **Header** | `X-Refresh-Token: <jwt>` | Native apps or server-to-server. Not recommended for browser apps. |

---

## 4. Idempotency

For `POST` endpoints that create resources or charge money (`/consultations`, `/uploads`, `/consultations/{id}/payment`), the client **must** send an idempotency key:

```
Idempotency-Key: 01J8ZQ3K2V7N8X4D5Y6W7F8G9H
```

- The key is a client-generated unique string, ideally a UUIDv7.
- The server caches the response for 24 hours; replaying the same key returns the same response with header `Idempotent-Replayed: true`.
- A different request body with the same key returns `409 idempotency_key_conflict`.

---

## 5. Request correlation

Every request should send `X-Request-ID: <uuid>`. The server echoes it in the response and uses it in logs. If absent, the server generates one.

```
X-Request-ID: 01J8ZQ3K2V7N8X4D5Y6W7F8G9H
```

---

## 6. Locale & timezone

- All timestamps in responses are UTC with `Z` suffix.
- Patient-supplied `state` must be one of the 10 Indian states listed in [`12-data-dictionary.md`](./12-data-dictionary.md#indian-states).
- Currency is always INR.
- The frontend is in `en-IN`; the backend does not localize strings. All human-readable strings in responses (e.g. validation messages) are in English.

---

## 7. Standard error envelope

Every error response uses the same shape:

```json
{
  "error": {
    "code": "validation_failed",
    "message": "One or more fields failed validation.",
    "details": [
      { "field": "phone", "code": "invalid_format", "message": "Phone must be 10 digits." }
    ],
    "request_id": "01J8ZQ3K2V7N8X4D5Y6W7F8G9H"
  }
}
```

| Field | Type | Notes |
|---|---|---|
| `error.code` | string (snake_case) | Machine-readable, stable. See error code table below. |
| `error.message` | string | Human-readable, English, may be shown to user. |
| `error.details` | array | Optional. Per-field errors, or context (e.g. payment gateway response). |
| `error.request_id` | string | Echoes `X-Request-ID` for support. |

### Standard error codes

| HTTP | `code` | When |
|---|---|---|
| 400 | `validation_failed` | Body or query param failed validation. `details[]` lists offending fields. |
| 400 | `bad_request` | Generic malformed request. |
| 401 | `unauthenticated` | Missing/invalid `Authorization` header. |
| 401 | `token_expired` | Access token expired; client should refresh. |
| 401 | `token_invalid` | Token signature wrong or malformed. |
| 401 | `token_revoked` | Token explicitly revoked (logout). |
| 403 | `forbidden` | Authenticated but lacks permission for this resource. |
| 403 | `account_disabled` | User is suspended. |
| 404 | `not_found` | Resource does not exist. |
| 409 | `conflict` | Optimistic concurrency or state-machine violation. |
| 409 | `idempotency_key_conflict` | Same key reused with a different body. |
| 410 | `gone` | Resource permanently deleted (soft-deleted). |
| 413 | `payload_too_large` | Upload exceeds size limit. |
| 415 | `unsupported_media_type` | Upload MIME not in allowlist. |
| 422 | `business_rule_violated` | E.g. trying to discharge a patient who is not admitted. |
| 429 | `rate_limited` | Too many requests. `Retry-After` header present. |
| 500 | `internal_error` | Server fault. Never expose stack trace. |
| 502 | `upstream_unavailable` | SMS / payment / AI provider failure. |
| 503 | `maintenance` | Scheduled maintenance window. |
| 504 | `upstream_timeout` | SMS / payment / AI provider timeout. |

---

## 8. Status codes used by this API

| Code | Meaning |
|---|---|
| 200 | OK with body. |
| 201 | Resource created. `Location` header points to the new resource. |
| 202 | Accepted, processing async (used by `/ai/summarize`, `/consultations/{id}/summary-pdf`). |
| 204 | No content (e.g. successful `DELETE`, `PATCH` with no return). |
| 304 | Not modified (ETag / `If-None-Match`). |
| 400 / 401 / 403 / 404 / 409 / 422 / 429 / 500 | See error table. |

---

## 9. Pagination

List endpoints return a paginated envelope:

```json
{
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 137,
    "total_pages": 7,
    "has_next": true,
    "has_prev": false
  }
}
```

Query parameters:

| Param | Default | Notes |
|---|---|---|
| `page` | `1` | 1-based. |
| `per_page` | `20` | Max 100. |
| `sort` | varies | `field` or `field:asc` / `field:desc`. |
| `q` | — | Free-text search. Fields searched documented per endpoint. |
| Filter params | — | E.g. `?status=active&specialty=Cardiology` |

`Link` header (HATEOAS) is **not** used; the body envelope is the source of truth.

---

## 10. Filtering & search

Filters are passed as query parameters with the same name as the field. Comma-separated values mean OR within a field; multiple params mean AND across fields:

```
GET /v1/doctors?specialty=Cardiology,Neurology&status=active&min_rating=4.5
```

Free-text search uses `q=`. Searched fields are documented per endpoint.

---

## 11. Rate limiting

| Bucket | Default | Window | Scope |
|---|---|---|---|
| Anonymous | 60 req | 1 min | Per IP. |
| Authenticated | 600 req | 1 min | Per `user_id`. |
| OTP request | 3 req | 10 min | Per phone. |
| OTP verify | 10 req | 10 min | Per phone. |
| Login | 10 req | 10 min | Per phone. |
| Payment | 30 req | 1 min | Per user. |
| Uploads | 30 req | 1 hour | Per user. |

When exceeded, the server returns `429 rate_limited` with `Retry-After: <seconds>` and these headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718002800
```

---

## 12. ETag & caching

Read-only `GET` endpoints set `ETag: "<sha256-of-body>"`. Clients send `If-None-Match: "<etag>"` to get `304 Not Modified`. `Cache-Control: private, max-age=0, must-revalidate` is the default; list endpoints are not cacheable.

---

## 13. Soft delete & audit

- All entities use soft delete (`deleted_at` timestamp, nullable). `DELETE` returns `204` and sets `deleted_at = now()`.
- All mutations are recorded in an `audit_log` table: `actor_user_id`, `action`, `entity_type`, `entity_id`, `before_json`, `after_json`, `created_at`.

---

## 14. Health & version

| Endpoint | Purpose |
|---|---|
| `GET /healthz` | Liveness — returns `200 {"status":"ok"}` if process is up. |
| `GET /readyz` | Readiness — returns `200 {"status":"ok","db":"ok","redis":"ok"}` after all dependencies respond. |
| `GET /version` | Returns build info: `{"version":"1.4.2","commit":"a1b2c3d","built_at":"2026-06-01T08:00:00Z"}`. |

These are **outside** `/v1` and do not require auth.

---

## 15. CORS

```
Access-Control-Allow-Origin: https://medexpert.in
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Authorization, Content-Type, Idempotency-Key, X-Request-ID
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600
```

`OPTIONS` is handled by FastAPI's `CORSMiddleware` and returns `204`.

---

## 16. Schema versioning & deprecation

- Breaking changes bump the path version (`/v1` → `/v2`). The previous version runs in parallel for at least 6 months.
- Non-breaking additions (new optional fields, new endpoints) are added to the current version.
- Deprecation is signalled 90 days in advance via the `Deprecation` and `Sunset` response headers and a `Deprecation` notice in the OpenAPI `description`.

---

## 17. Environment variables the backend will read

| Var | Example | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql+asyncpg://medexpert:…@db:5432/medexpert` | SQLAlchemy async URL. |
| `REDIS_URL` | `redis://redis:6379/0` | Caching, rate limits, OTP store. |
| `JWT_SECRET` | `change-me-in-prod` | HS256 signing key. |
| `JWT_ALG` | `HS256` | Algorithm. |
| `JWT_ACCESS_TTL` | `900` | Access token TTL in seconds. |
| `JWT_REFRESH_TTL` | `2592000` | Refresh token TTL in seconds. |
| `OTP_TTL` | `300` | OTP validity in seconds (5 min). |
| `OTP_LENGTH` | `6` | Number of digits. |
| `OTP_MAX_ATTEMPTS` | `5` | Lock after this many failed verifies. |
| `OTP_LOCKOUT_SECONDS` | `900` | Lockout duration. |
| `SMS_PROVIDER` | `twilio` | One of `twilio`, `msg91`, `plivo`. |
| `SMS_FROM` | `MEDEXP` | Sender ID. |
| `RAZORPAY_KEY_ID` | `rzp_live_…` | Payment gateway. |
| `RAZORPAY_KEY_SECRET` | `…` | Payment gateway. |
| `RAZORPAY_WEBHOOK_SECRET` | `…` | Signature verification. |
| `S3_BUCKET` | `medexpert-uploads` | Object storage. |
| `S3_REGION` | `ap-south-1` | Region. |
| `S3_ACCESS_KEY` / `S3_SECRET_KEY` | — | Credentials. |
| `OPENAI_API_KEY` | `…` | (Optional) AI summary. |
| `LOG_LEVEL` | `INFO` | `DEBUG` in dev. |
| `ENV` | `production` | One of `local`, `staging`, `production`. |
