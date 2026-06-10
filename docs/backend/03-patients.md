# 03 · Patients

The `Patient` is the medical record of a person receiving care. It is **separate from** the `User` authentication record — a user becomes a patient either by completing the registration wizard or by being registered by an admin.

> **Frontend mapping:** `src/pages/patient/Registration.jsx` (6-step wizard), `src/pages/admin/hospitals/view/PatientsTab.jsx` (admin table), and the patient dashboard greeting.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `POST` | `/patients` | patient (self) or admin | Create patient profile. |
| `GET` | `/patients` | admin | List patients (admin). |
| `GET` | `/patients/{id}` | admin or self | Get one patient. |
| `GET` | `/patients/me` | patient | Get the current patient's own record. |
| `PATCH` | `/patients/{id}` | admin or self | Update patient. |
| `DELETE` | `/patients/{id}` | admin | Soft-delete patient. |
| `POST` | `/patients/{id}/documents` | patient or admin | Attach a previously-uploaded document. |
| `DELETE` | `/patients/{id}/documents/{document_id}` | patient or admin | Detach a document. |

---

## 2. Patient entity

```ts
Patient {
  id:                     UUID          // PK
  user_id:                UUID          // FK -> users.id (one-to-one)
  mrn:                    string        // unique, "MRN-10000" format

  // Demographics
  first_name:             string        // required
  last_name:              string        // required
  phone:                  string        // required, +91XXXXXXXXXX (denormalized from user)
  email:                  string | null
  date_of_birth:          string | null // "YYYY-MM-DD"
  gender:                 "male" | "female" | "other" | null
  city:                   string | null
  state:                  string | null // one of 10 Indian states
  pincode:                string | null // 6 digits

  // Medical context (from registration wizard step 1)
  primary_department:     string | null // one of 8 specialities
  chief_complaint:        string | null // textarea
  symptom_duration:       string | null // enum, see 12-data-dictionary.md
  severity:               "mild" | "moderate" | "severe" | null

  // History (all optional textareas)
  allergies:              string | null
  current_medications:    string | null
  chronic_conditions:     string | null
  surgical_history:       string | null
  family_history:         string | null
  earlier_opinion:        string | null

  // Operational (admin-managed)
  hospital_id:            UUID | null   // assigned hospital
  ward:                   "icu" | "general" | "cardio" | "neuro" | null
  assigned_doctor_id:     UUID | null   // FK -> doctors.id
  status:                 "admitted" | "outpatient" | "discharged" | "critical"
  condition:              string | null // free text for admin's quick view

  // Timestamps
  registered_at:          DateTime      // first time patient was created
  admitted_at:            DateTime | null
  discharged_at:          DateTime | null
  created_at:             DateTime
  updated_at:             DateTime
  deleted_at:             DateTime | null
}
```

### MRN format

`MRN-<n>` where `<n>` is a server-assigned zero-padded integer starting at `10000` and incrementing by **1** (not 6 as the frontend mock; the backend standardizes this). Sequence is per-tenant (a `seq_mrn` Postgres sequence handles this).

Example: `MRN-10000`, `MRN-10001`, …, `MRN-12345`.

---

## 3. Create patient (patient self-registration)

```
POST /v1/patients
```

The 6-step patient wizard produces a single `POST /patients` after payment is complete. The full wizard state is submitted as the body (the backend stores it and breaks it into patient + consultation records — see [`08-consultations.md`](./08-consultations.md)).

The frontend may also call `POST /patients` mid-wizard (after step 1) to create the patient record early so the consultation has a stable `patient_id`. The recommended flow:

1. **Step 1** (Patient Details) → `POST /patients` with demographics only. Returns `patient.id`. If the user is a fresh patient, this also creates the `User` account (or links to an existing one by phone).
2. **Steps 2–5** (Intent, Records, Doctors, Payment) → `POST /consultations` with `patient_id` and selected doctors.
3. **Step 6** (Done) → just UI confirmation, no API call needed.

### Request (after Step 1)

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+919876543210",
  "email": "john.doe@example.com",
  "date_of_birth": "1985-04-22",
  "gender": "male",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400053",
  "primary_department": "Cardiology",
  "chief_complaint": "Recurring chest pain on exertion for the past 3 weeks.",
  "symptom_duration": "1-4-weeks",
  "severity": "moderate",
  "allergies": "Penicillin",
  "current_medications": "Atorvastatin 10mg",
  "chronic_conditions": "Hypertension (since 2019)",
  "surgical_history": "Appendectomy 2010",
  "family_history": "Father - CAD",
  "earlier_opinion": "Seen by local cardiologist, advised angiography."
}
```

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "mrn": "MRN-10000",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+919876543210",
  "email": "john.doe@example.com",
  "date_of_birth": "1985-04-22",
  "gender": "male",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400053",
  "primary_department": "Cardiology",
  "chief_complaint": "Recurring chest pain on exertion for the past 3 weeks.",
  "symptom_duration": "1-4-weeks",
  "severity": "moderate",
  "allergies": "Penicillin",
  "current_medications": "Atorvastatin 10mg",
  "chronic_conditions": "Hypertension (since 2019)",
  "surgical_history": "Appendectomy 2010",
  "family_history": "Father - CAD",
  "earlier_opinion": "Seen by local cardiologist, advised angiography.",
  "status": "outpatient",
  "registered_at": "2026-06-10T08:14:22.103Z",
  "created_at": "2026-06-10T08:14:22.103Z"
}
```

### Validation

| Field | Rule |
|---|---|
| `first_name` | 1-100 chars, required. |
| `last_name` | 1-100 chars, required. |
| `phone` | E.164 `+91[1-9]\d{9}`, required. |
| `email` | RFC 5322, optional, max 254 chars. |
| `date_of_birth` | ISO `YYYY-MM-DD`, must be in the past, age ≤ 130. |
| `gender` | one of `male`, `female`, `other`, optional. |
| `city` | 1-100 chars, optional but recommended. |
| `state` | one of 10 Indian states, optional. |
| `pincode` | 6 digits, optional. |
| `primary_department` | one of 8 specialities, **required for self-registration** (gates the wizard Next button). |
| `chief_complaint` | 1-2000 chars, **required for self-registration**. |
| `symptom_duration` | one of 5 enum values, optional. |
| `severity` | one of 3 enum values, optional. |
| `allergies`, `current_medications`, `chronic_conditions`, `surgical_history`, `family_history`, `earlier_opinion` | ≤ 4000 chars each, optional. |

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Any field fails validation. |
| 409 | `conflict` | Patient already exists for this user. |

---

## 4. Get current patient

```
GET /v1/patients/me
```

Returns the patient record for the authenticated user. Used by `Patient/Dashboard` to display greeting + status pill.

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "mrn": "MRN-10000",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+919876543210",
  "email": "john.doe@example.com",
  "status": "outpatient",
  "primary_department": "Cardiology",
  "registered_at": "2026-06-10T08:14:22.103Z",
  "created_at": "2026-06-10T08:14:22.103Z"
}
```

If the user has no patient record (registration wizard not completed), returns `404 patient_not_found` with a body that the frontend can use to redirect to `/patient/registration`.

### Errors

| Status | Code | Trigger |
|---|---|---|
| 404 | `patient_not_found` | User has no patient record. |

---

## 5. Get one patient (admin or self)

```
GET /v1/patients/{id}
```

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "user_id": "550e8400-e29b-41d4-a716-446655440001",
  "mrn": "MRN-10000",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+919876543210",
  "email": "john.doe@example.com",
  "date_of_birth": "1985-04-22",
  "gender": "male",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400053",
  "primary_department": "Cardiology",
  "chief_complaint": "Recurring chest pain on exertion for the past 3 weeks.",
  "symptom_duration": "1-4-weeks",
  "severity": "moderate",
  "allergies": "Penicillin",
  "current_medications": "Atorvastatin 10mg",
  "chronic_conditions": "Hypertension (since 2019)",
  "surgical_history": "Appendectomy 2010",
  "family_history": "Father - CAD",
  "earlier_opinion": "Seen by local cardiologist, advised angiography.",
  "hospital_id": null,
  "ward": null,
  "assigned_doctor_id": null,
  "status": "outpatient",
  "condition": null,
  "registered_at": "2026-06-10T08:14:22.103Z",
  "admitted_at": null,
  "discharged_at": null,
  "created_at": "2026-06-10T08:14:22.103Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller is not admin or self. |
| 404 | `not_found` | Patient does not exist. |

---

## 6. List patients (admin)

```
GET /v1/patients?page=1&per_page=20&status=admitted&hospital_id=...&q=alex&ward=icu
```

| Filter | Description |
|---|---|
| `status` | One of `admitted`, `outpatient`, `discharged`, `critical`. |
| `hospital_id` | UUID. |
| `ward` | One of `icu`, `general`, `cardio`, `neuro`. |
| `assigned_doctor_id` | UUID. |
| `primary_department` | One of 8 specialities. |
| `q` | Free-text on name, MRN, phone, condition, assigned doctor name. |
| `sort` | One of `mrn`, `first_name`, `registered_at`, `status`. Default `registered_at:desc`. |

The frontend's `PatientsTab` displays: Patient name, MRN, Gender, Ward, Assigned Doctor, Condition, Status.

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440050",
      "mrn": "MRN-10006",
      "first_name": "Alex",
      "last_name": "Smith",
      "phone": "+919876501001",
      "gender": "male",
      "date_of_birth": "1972-08-12",
      "ward": "icu",
      "status": "admitted",
      "condition": "Acute MI",
      "assigned_doctor": {
        "id": "550e8400-e29b-41d4-a716-446655440200",
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiology"
      },
      "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
      "registered_at": "2026-06-01T11:00:00Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller is not admin. |

---

## 7. Update patient

```
PATCH /v1/patients/{id}
```

Any field except `id`, `mrn`, `user_id`, `created_at` may be updated. Patients can only update their own record. Admins can update any record in their hospital scope.

### Request (admin updating operational fields)

```json
{
  "ward": "cardio",
  "assigned_doctor_id": "550e8400-e29b-41d4-a716-446655440200",
  "status": "admitted",
  "condition": "Awaiting angio"
}
```

### Request (patient updating own demographics)

```json
{
  "city": "Pune",
  "pincode": "411014"
}
```

### Response

```
200 OK
```

Returns the updated `Patient` object (same shape as `GET /patients/{id}`).

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller lacks permission. |
| 404 | `not_found` | Patient does not exist. |
| 422 | `business_rule_violated` | E.g. setting `status=discharged` without `discharged_at`. |

---

## 8. Soft-delete patient

```
DELETE /v1/patients/{id}
```

Admin only. Soft-deletes the record. Associated consultations and documents are preserved for audit.

### Response

```
204 No Content
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller is not admin. |
| 404 | `not_found` | Patient does not exist. |

---

## 9. Documents on a patient

A patient's documents are accessed via the consultation that produced them (see [`08-consultations.md`](./08-consultations.md#documents)). For convenience, a patient can also list/attach/detach documents directly:

```
GET    /v1/patients/{id}/documents
POST   /v1/patients/{id}/documents     { "document_id": "..." }
DELETE /v1/patients/{id}/documents/{document_id}
```

### Request — attach

```json
{ "document_id": "550e8400-e29b-41d4-a716-446655440900" }
```

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440900",
  "title": "ECG Report 2026-05-12",
  "type": "radiology_scan",
  "file_name": "ecg.pdf",
  "size_bytes": 142311,
  "uploaded_at": "2026-05-12T09:00:00Z",
  "download_url": "https://api.medexpert.in/v1/uploads/550e8400-e29b-41d4-a716-446655440900"
}
```

---

## 10. Notes for backend implementers

### MRN sequence

Use a Postgres sequence `seq_mrn` with `START 10000 INCREMENT 1`. Each insert selects `nextval('seq_mrn')` and formats `MRN-{:05d}`. Use a unique index on the `mrn` column for safety.

### The "verified" badge bug

The frontend `Patient/Dashboard` checks `patientData.firstName || patientData.name`. The registration form saves `firstName`/`lastName` only. The backend **always** populates both: `firstName` from the form field and `name = first_name + " " + last_name` as a denormalized convenience. The frontend can read either; both will be present.

### Status lifecycle

```
outpatient ─► admitted ─► discharged
     │           │
     │           └─► critical ─► admitted
     │
     └─► critical ─► admitted
```

Transitions are validated server-side. PATCHing `status` to an invalid transition returns `422 business_rule_violated`. Setting `status=admitted` sets `admitted_at = now()` if not already set. Setting `status=discharged` requires `discharged_at` (auto-set to `now()`).

### Indexes

```sql
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX idx_patients_assigned_doctor_id ON patients(assigned_doctor_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_primary_department ON patients(primary_department);
CREATE INDEX idx_patients_registered_at ON patients(registered_at DESC);
```

### Search (the `q` param)

Use Postgres `to_tsvector('english', first_name || ' ' || last_name || ' ' || mrn || ' ' || phone || ' ' || condition)` with a GIN index, falling back to `ILIKE '%q%'` for short queries.