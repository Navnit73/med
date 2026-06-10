# 04 · Doctors

The `Doctor` table represents medical professionals — both the public-facing doctors in the `/find-doctors` directory and the internal doctors managed in the admin "Doctors" tab.

> **Frontend mapping:** `src/data/mockDoctors.js` (public directory), `src/pages/admin/hospitals/view/DoctorsTab.jsx` (admin grid), and the doctor booking widget on public profiles.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/doctors` | — | Public or admin list of doctors. |
| `GET` | `/doctors/{id}` | — | Public doctor profile or admin detail. |
| `POST` | `/doctors` | admin | Create new doctor (admin). |
| `PATCH` | `/doctors/{id}` | admin | Update doctor. |
| `DELETE` | `/doctors/{id}` | admin | Soft-delete doctor. |
| `GET` | `/doctors/{id}/booking-options` | — | Bookable time slots for a doctor. |

---

## 2. Doctor entity

```ts
Doctor {
  id:               UUID        // PK
  hospital_id:      UUID        // FK -> hospitals.id, required
  user_id:          UUID        // FK -> users.id (optional; can be null initially)

  // Profile
  name:             string      // required
  email:            string | null
  phone:            string | null
  specialty:        "Cardiology" | "Neurology" | "Radiology" | "Pediatrics" | "Orthopedics" | "Pathology" | "General Surgery"
  degree:           string      // required, e.g. "MBBS, MD (Cardiology)"
  bio:              string | null // long textarea, up to 5000 chars
  image_url:        string | null // profile picture URL
  experience:       number      // years, required, min 0

  // Metrics (calculated, updated periodically)
  patients_count:   number      // total unique patients seen
  rating:           number      // 0–5, 0.1 steps, default 0

  // Operational
  status:           "active" | "inactive"
  consultation_fee: number      // in paise (int), default 150000 = ₹1500

  // Timestamps
  created_at:       DateTime
  updated_at:       DateTime
  deleted_at:       DateTime | null
}
```

### Fee normalization

The frontend mixes ₹1,500 (doctor) + ₹200 (platform). The backend only stores **doctor fee in paise**. The frontend is responsible for adding platform fee during checkout.

---

## 3. List doctors (public or admin)

```
GET /v1/doctors?specialty=Cardiology,Neurology&status=active&q=sarah&min_rating=4.5&page=1&per_page=20&sort=rating:desc
```

| Filter | Type | Description |
|---|---|---|
| `specialty` | CSV | Filter by one or more specialties. |
| `status` | enum | `active` or `inactive`. |
| `q` | string | Free-text search across name, specialty, degree, hospital name. |
| `min_rating` | float | Doctors with rating ≥ X. |
| `sort` | string | One of `name`, `patients_count`, `rating`, `experience`, `consultation_fee`. Default `relevance`. |

Public endpoints (no auth) return a **simplified shape** without internal fields. Admin endpoints include all fields.

### Public response shape

```
200 OK
```

```json
{
  "data": [
    {
      "id": "dr-sarah-johnson",
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiology",
      "hospital": "Apollo Medical Center",
      "degree": "MBBS, MD (Cardiology)",
      "experience": "14 years",
      "rating": 4.6,
      "patients": "5k+",
      "reviews": 215,
      "consultation_fee": 150000
    }
  ],
  "pagination": { ... }
}
```

The frontend `/find-doctors` uses this shape: avatar icon (specialty color), name, specialty, exp, qual, rating, reviews, patients, hospital. The `id` here is a URL-friendly slug (see "Slug generation" below).

### Admin response shape

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
      "user_id": "550e8400-e29b-41d4-a716-446655440201",
      "name": "Dr. Sarah Johnson",
      "email": "sarah@apollomed.com",
      "phone": "+919876512345",
      "specialty": "Cardiology",
      "degree": "MBBS, MD (Cardiology)",
      "experience": 14,
      "patients_count": 215,
      "rating": 4.6,
      "status": "active",
      "consultation_fee": 150000,
      "bio": "Cardiologist with 14 years of experience in interventional cardiology. Specializes in angioplasty and stenting...",
      "image_url": "https://cdn.medexpert.in/doctors/sarah-johnson.jpg",
      "created_at": "2026-01-15T08:14:22.103Z",
      "updated_at": "2026-06-10T08:14:22.103Z"
    }
  ],
  "pagination": { ... }
}
```

The admin `DoctorsTab` displays: doctor card with avatar, name, status pill, specialty pill, degree, experience, patients count, star rating.

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | `min_rating` > 5, `experience` < 0, etc. |

---

## 4. Get doctor profile

```
GET /v1/doctors/{id}
```

Returns detailed doctor profile. The public profile (`/find-doctors/{id}`) uses this endpoint with query `?include=clinic_info` to return hospital address, hours, and fee.

### Request

Query params optional:
- `include=clinic_info` — includes hospital address, clinic hours.
- `include=performance` — includes metrics: patients this month, revenue, etc.

### Response (public with `include=clinic_info`)

```
200 OK
```

```json
{
  "id": "dr-sarah-johnson",
  "name": "Dr. Sarah Johnson",
  "specialty": "Cardiology",
  "degree": "MBBS, MD (Cardiology)",
  "experience": "14 years",
  "rating": 4.6,
  "patients": "5k+",
  "reviews": 215,
  "hospital": "Apollo Medical Center",
  "hospital_address": "120 Wellness Blvd, Mumbai",
  "clinic_hours": "Mon–Sat 09:00 AM – 05:00 PM",
  "consultation_fee": 150000,
  "clinic_url": "https://medexpert.in/hospital/apollo-medical-center",
  "profile_url": "https://medexpert.in/doctors/dr-sarah-johnson"
}
```

### Response (admin detail)

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@apollomed.com",
  "phone": "+919876512345",
  "specialty": "Cardiology",
  "degree": "MBBS, MD (Cardiology)",
  "bio": "Cardiologist with 14 years of experience...",
  "experience": 14,
  "patients_count": 215,
  "rating": 4.6,
  "status": "active",
  "consultation_fee": 150000,
  "performance": {
    "patients_this_month": 32,
    "appointments_this_month": 28,
    "no_show_rate": 0.05
  },
  "schedule": {
    "availability": [
      { "day": "monday", "slots": ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30"] },
      { "day": "tuesday", "slots": ["09:00", "09:30", "10:00", "10:30", "14:00", "14:30"] }
    ],
    "booking_lead_time_days": 7
  },
  "created_at": "2026-01-15T08:14:22.103Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 404 | `not_found` | Doctor does not exist. |

---

## 5. Create doctor (admin)

```
POST /v1/doctors
```

Hospital-scoped (admin users can only create doctors for their hospital). The frontend's `DoctorForm.jsx` sends this payload.

### Request

```json
{
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@apollomed.com",
  "phone": "+919876512345",
  "specialty": "Cardiology",
  "degree": "MBBS, MD (Cardiology)",
  "bio": "Cardiologist with 14 years of experience...",
  "experience": 14,
  "status": "active",
  "consultation_fee": 150000,
  "image": { /* multipart file */ }
}
```

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440200",
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Dr. Sarah Johnson",
  "email": "sarah@apollomed.com",
  "phone": "+919876512345",
  "specialty": "Cardiology",
  "degree": "MBBS, MD (Cardiology)",
  "bio": "Cardiologist with 14 years of experience...",
  "experience": 14,
  "patients_count": 0,
  "rating": 0,
  "status": "active",
  "consultation_fee": 150000,
  "image_url": "https://cdn.medexpert.in/doctors/sarah-johnson.jpg",
  "created_at": "2026-06-10T08:14:22.103Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

### Validation

| Field | Rule |
|---|---|
| `hospital_id` | Required, must be valid hospital in admin's scope. |
| `name` | 1–100 chars, required. |
| `email` | RFC 5322, optional, max 254 chars. |
| `phone` | E.164 format, optional. |
| `specialty` | one of 7 enum values, required. |
| `degree` | 1–100 chars, required. |
| `bio` | 1–5000 chars, optional. |
| `experience` | integer ≥ 0, required. |
| `status` | one of `active`, `inactive`, required. |
| `consultation_fee` | integer ≥ 0, optional, default 150000 (₹1500). |

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Any field fails validation. |
| 403 | `forbidden` | Admin not in the doctor's hospital scope. |
| 409 | `conflict` | Email or phone already in use by another doctor in this hospital. |

---

## 6. Update doctor

```
PATCH /v1/doctors/{id}
```

### Request

```json
{
  "experience": 15,
  "status": "inactive"
}
```

### Response

```
200 OK
```

Returns the updated doctor object.

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller not in doctor's hospital scope. |
| 404 | `not_found` | Doctor does not exist. |

---

## 7. Get booking options

```
GET /v1/doctors/{id}/booking-options?date=2026-06-15
```

Returns available 30-minute slots for a given date. The frontend booking widget displays the slots from `/find-doctors/{id}`.

### Response

```
200 OK
```

```json
{
  "date": "2026-06-15",
  "doctor_name": "Dr. Sarah Johnson",
  "timezone": "Asia/Kolkata",
  "slots": [
    { "time": "09:00", "status": "available" },
    { "time": "09:30", "status": "available" },
    { "time": "10:00", "status": "booked" },
    { "time": "10:30", "status": "available" },
    { "time": "11:00", "status": "unavailable" },
    { "time": "11:30", "status": "available" }
  ],
  "available_slots": 5
}
```

### Slot status

- `available` — open for booking
- `booked` — already scheduled consultation
- `unavailable` — doctor on leave or unavailable

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `invalid_date` | Date format wrong or in the past. |
| 404 | `not_found` | Doctor does not exist. |

---

## 8. Implementation notes

### Image upload

The `POST /doctors` endpoint accepts `multipart/form-data` with `image` field. On success:

1. Upload to S3 (or object store) with path `/doctors/{doctor_id}/profile.jpg`.
2. Generate signed URL (expiring in 1 hour) for frontend upload.
3. Store S3 URL in `image_url` column.
4. Run image processing: resize to 400×400, convert to WebP, compress to ≤ 100KB.

### Slug generation

For public URLs, convert `name` to a URL-friendly slug:
```
"Dr. Sarah Johnson" → "dr-sarah-johnson"
"Dr. Ananya Patel" → "dr-ananya-patel"
```

If slug conflict, append `-{n}`:
```
"Dr. Priya Patel" already exists → "dr-priya-patel-1"
```

### Rating calculation

Recalculate nightly using a scheduled job:

```sql
-- Count reviews with 5 stars = 5 points, 4.5 = 4.5 points
UPDATE doctors
SET rating = 
  (SELECT AVG(rating) 
   FROM consultations 
   WHERE doctor_id = doctors.id 
   AND status = 'completed'
   AND rating IS NOT NULL),
  patients_count = 
  (SELECT COUNT(DISTINCT patient_id) 
   FROM consultations 
   WHERE doctor_id = doctors.id)
WHERE status = 'active';
```

### Performance metrics

For admin profiles (`include=performance`):

```sql
SELECT
  COUNT(CASE WHEN EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW()) THEN 1 END) patients_this_month,
  COUNT(CASE WHEN EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW()) THEN 1 END) appointments_this_month,
  SUM(CASE WHEN status = 'no_show' THEN 1 ELSE 0 END) * 1.0 / COUNT(*) no_show_rate
FROM consultations
WHERE doctor_id = ? AND created_at >= DATE_TRUNC('month', NOW());
```

### Search optimization

Index the doctor table for fast search:
```sql
CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_name ON doctors(name);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_doctors_rating ON doctors(rating);
```

For public list use Postgres full-text search with `to_tsvector('english', name || ' ' || specialty || ' ' || degree || ' ' || (SELECT name FROM hospitals WHERE id = doctors.hospital_id))`.