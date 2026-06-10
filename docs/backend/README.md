# MedExpert — Backend API Specification

Comprehensive backend API specification for the **MedExpert** React SPA at the repository root. This document is the contract that any backend implementation must satisfy to be compatible with the existing frontend.

> **Stack target:** Python 3.11+ · FastAPI · SQLAlchemy 2.x (async) · PostgreSQL 15+ · Alembic · Pydantic v2 · JWT (python-jose / PyJWT) · Twilio / MSG91 (or any SMS provider) for OTP delivery
> **Auth model:** Phone + OTP for both patients and admins. JWT access token (15 min) + refresh token (30 days). Role-based access control: `admin` vs `patient`.
> **Spec format:** Markdown per module + a single OpenAPI 3.1 YAML at `openapi/openapi.yaml`.

---

## Document Map

| File | Purpose |
|---|---|
| [`00-overview.md`](./00-overview.md) | Architecture, base URL, versioning, headers, common conventions, error model, pagination, rate limiting, idempotency |
| [`01-auth.md`](./01-auth.md) | Phone + OTP request/verify, JWT issuance, refresh, logout, `/auth/me` |
| [`02-users-and-roles.md`](./02-users-and-roles.md) | User accounts, roles, RBAC matrix |
| [`03-patients.md`](./03-patients.md) | Patient entity, registration wizard payload, MRN generation, admin patient list |
| [`04-doctors.md`](./04-doctors.md) | Doctor entity, admin CRUD, public doctor directory, doctor profile, booking options |
| [`05-departments.md`](./05-departments.md) | Speciality / Department entity, scoped under hospital |
| [`06-hospitals.md`](./06-hospitals.md) | Hospital entity, public listing, admin CRUD, scoped sub-resources |
| [`07-contracts.md`](./07-contracts.md) | Hospital contracts |
| [`08-consultations.md`](./08-consultations.md) | Consultations / bookings created from the patient wizard |
| [`09-documents-and-uploads.md`](./09-documents-and-uploads.md) | Document uploads (prescriptions, reports, etc.) |
| [`10-analytics.md`](./10-analytics.md) | Admin dashboard analytics, per-hospital analytics |
| [`11-webhooks.md`](./11-webhooks.md) | Outbound webhooks (payment provider, SMS delivery) |
| [`12-data-dictionary.md`](./12-data-dictionary.md) | Every enum, every code, every constant referenced anywhere |
| [`13-database-schema.md`](./13-database-schema.md) | SQL DDL — PostgreSQL schema reference |
| [`14-implementation-guide.md`](./14-implementation-guide.md) | FastAPI project layout, dependencies, runbook, seeding, testing |
| [`openapi/openapi.yaml`](./openapi/openapi.yaml) | OpenAPI 3.1 machine-readable spec — feed into Swagger UI / Redoc / Stoplight |

---

## What this spec covers

The MedExpert frontend (React 19 + Vite + Tailwind) currently ships with **no real backend** — all data is hardcoded in `src/`, and "auth" is a localStorage flag flipped after a phone-number length check. The frontend code reveals every entity, field, validation, status enum, chart series, and action the backend must support. This spec is reverse-engineered from the UI to be the authoritative contract a real backend must fulfil.

### Feature coverage

- Public marketing site (`/`, `/find-doctors`, `/find-doctors/:id`, `/hospitals`)
- Phone + OTP sign-in for both admins and patients
- Admin network dashboard with revenue, specialty, region, top-doctors analytics
- Hospital CRUD (admin) + public hospital directory
- Per-hospital tabs: Dashboard, Contracts, Patients, Specialities, Doctors
- Doctor CRUD (admin) + public doctor directory + public doctor profile + booking-slot lookup
- Patient registration wizard (6 steps) that produces a consultation
- Document upload (prescription / discharge summary / blood report / radiology / pathology / other)
- AI summary generation (placeholder endpoint, real provider can be plugged in)
- Payments (UPI / card via Razorpay) — see `08-consultations.md`

---

## How to read this spec

1. Start with `00-overview.md` for base URL, auth header, error envelope, and pagination.
2. Read `01-auth.md` and `02-users-and-roles.md` before anything else — almost every endpoint requires a JWT.
3. Read entities in dependency order: users → hospitals → departments → doctors → patients → consultations → documents.
4. Cross-reference `12-data-dictionary.md` for enum values.
5. Use `13-database-schema.md` as the canonical SQL DDL if you need a ground-truth schema.
6. Use `14-implementation-guide.md` only when you are ready to scaffold the FastAPI project.
7. The OpenAPI YAML is the single source of truth for HTTP shapes — every Markdown example is also expressed as a schema there.

---

## Quick endpoint index (≥ 60 endpoints)

```
POST   /auth/otp/request
POST   /auth/otp/verify
POST   /auth/refresh
POST   /auth/logout
GET    /auth/me

GET    /public/specialties
GET    /public/states
GET    /public/departments

GET    /hospitals                              (public + admin)
GET    /hospitals/{id}                         (public + admin)
POST   /hospitals                              (admin)
PATCH  /hospitals/{id}                         (admin)
DELETE /hospitals/{id}                         (admin)
GET    /hospitals/{id}/dashboard               (admin)

GET    /hospitals/{hospital_id}/departments
POST   /hospitals/{hospital_id}/departments     (admin)
PATCH  /departments/{id}                       (admin)
DELETE /departments/{id}                       (admin)

GET    /hospitals/{hospital_id}/doctors        (admin)
GET    /doctors                                (public + admin)
GET    /doctors/{id}                           (public + admin)
POST   /doctors                                (admin)
PATCH  /doctors/{id}                           (admin)
DELETE /doctors/{id}                           (admin)
GET    /doctors/{id}/booking-options

GET    /hospitals/{hospital_id}/contracts      (admin)
POST   /hospitals/{hospital_id}/contracts      (admin)
PATCH  /contracts/{id}                         (admin)
DELETE /contracts/{id}                         (admin)
GET    /contracts/{id}/pdf

GET    /hospitals/{hospital_id}/patients       (admin)
GET    /patients                               (admin)
GET    /patients/{id}                          (admin)
GET    /patients/me                            (patient)
POST   /patients                               (admin + patient self-registration)
PATCH  /patients/{id}                          (admin)
DELETE /patients/{id}                          (admin)

POST   /consultations                          (patient)
GET    /consultations                          (admin)
GET    /consultations/me                       (patient)
GET    /consultations/{id}
PATCH  /consultations/{id}                     (admin)
POST   /consultations/{id}/cancel
POST   /consultations/{id}/payment
POST   /consultations/{id}/payment/verify
GET    /consultations/{id}/summary-pdf

POST   /uploads                                (multipart)
GET    /uploads/{id}
DELETE /uploads/{id}

POST   /ai/summarize                           (records → AI medical summary)

GET    /analytics/overview                     (admin)
GET    /analytics/hospital/{id}                (admin)

GET    /webhooks/razorpay
POST   /webhooks/razorpay
POST   /webhooks/sms-status
```

See each module file for full request/response schemas, status codes, and worked examples.
