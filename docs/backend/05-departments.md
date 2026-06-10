# 05 · Departments / Specialities

A `Department` (or "Speciality") belongs to a hospital and groups doctors with the same specialty.

> **Frontend mapping:** `src/pages/admin/hospitals/view/DepartmentsTab.jsx` and the "Speciality" tab inside a hospital view.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/hospitals/{hospital_id}/departments` | — | List all departments for a hospital. |
| `GET` | `/departments/{id}` | — | Get one department. |
| `POST` | `/hospitals/{hospital_id}/departments` | admin | Create department. |
| `PATCH` | `/departments/{id}` | admin | Update department. |
| `DELETE` | `/departments/{id}` | admin | Soft-delete department. |
| `GET` | `/departments/{id}/doctors` | — | List doctors in this department. |

---

## 2. Department entity

```ts
Department {
  id:              UUID        // PK
  hospital_id:     UUID        // FK -> hospitals.id, required
  name:            string      // required, e.g. "Cardiology"
  head:            string      // required, doctor name (display only)
  head_doctor_id:  UUID | null // FK -> doctors.id (preferred over name)
  patients_count:  number      // required, total patients (admin input)
  status:          "active" | "inactive"
  doctors:         string[]    // optional, parsed from comma-separated input
  icon:            string | null // one of: cardiology, neurology, orthopedics, ophthalmology, pediatrics, pathology, general
  color:           string | null // hex color for icon background

  created_at:      DateTime
  updated_at:      DateTime
  deleted_at:      DateTime | null
}
```

### Icon mapping

| `icon` value | Lucide component | Color |
|---|---|---|
| `cardiology` | `HeartPulse` | red-500 |
| `neurology` | `Brain` | violet-500 |
| `orthopedics` | `Bone` | amber-500 |
| `ophthalmology` | `Eye` | cyan-500 |
| `pediatrics` | `Baby` | pink-500 |
| `pathology` | `FlaskConical` | teal-500 |
| `general` | `Stethoscope` | slate-500 |
| `other` | `Stethoscope` | slate-500 |

The frontend's `DEPT_ICONS` map hardcodes these. The backend stores the icon name; the frontend maps to the Lucide component.

### Display name vs doctor link

The frontend form has a `head` text field. The backend stores both:
- `head` — display string (free text, what admin types)
- `head_doctor_id` — proper FK to doctors table (nullable, may be missing)

When listing, prefer `head_doctor_id` if set, otherwise `head`.

---

## 3. List departments for a hospital

```
GET /v1/hospitals/{hospital_id}/departments?status=active&q=cardio
```

| Filter | Type | Description |
|---|---|---|
| `status` | enum | `active` or `inactive`. |
| `q` | string | Free-text on name, head, doctor names. |

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440300",
      "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Cardiology",
      "head": "Dr. Sarah Johnson",
      "head_doctor_id": "550e8400-e29b-41d4-a716-446655440200",
      "patients_count": 146,
      "status": "active",
      "doctors": ["Dr. Sarah Johnson", "Dr. Aisha Khan"],
      "icon": "cardiology",
      "color": "#ef4444",
      "created_at": "2026-01-15T08:14:22.103Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

The frontend `DepartmentsTab` displays:
- 3 summary cards: Total Specialities, Assigned Doctors, Total Patients
- Search box + All/Active/Inactive toggle
- Grid of department cards with icon, name, HOD, status pill, assigned-doctor chips, total patients

### Errors

| Status | Code | Trigger |
|---|---|---|
| 404 | `not_found` | Hospital does not exist. |

---

## 4. Get one department

```
GET /v1/departments/{id}
```

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440300",
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Cardiology",
  "head": "Dr. Sarah Johnson",
  "head_doctor_id": "550e8400-e29b-41d4-a716-446655440200",
  "patients_count": 146,
  "status": "active",
  "doctors": ["Dr. Sarah Johnson", "Dr. Aisha Khan"],
  "icon": "cardiology",
  "color": "#ef4444",
  "created_at": "2026-01-15T08:14:22.103Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

---

## 5. Create department (admin)

```
POST /v1/hospitals/{hospital_id}/departments
```

The frontend's `DepartmentForm.jsx` sends this payload.

### Request

```json
{
  "name": "Cardiology",
  "head": "Dr. Sarah Johnson",
  "head_doctor_id": "550e8400-e29b-41d4-a716-446655440200",
  "patients_count": 0,
  "status": "active",
  "doctors": ["Dr. Sarah Johnson", "Dr. Aisha Khan"],
  "icon": "cardiology"
}
```

### Response

```
201 Created
```

Returns the created department object.

### Validation

| Field | Rule |
|---|---|
| `name` | 1–100 chars, required, unique within hospital. |
| `head` | 1–100 chars, required (display name). |
| `head_doctor_id` | UUID, optional, must reference a doctor in same hospital. |
| `patients_count` | integer ≥ 0, required, default 0. |
| `status` | one of `active`, `inactive`, required. |
| `doctors` | array of strings, optional, max 50 items. |
| `icon` | one of icon enum values, optional. |

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Any field fails validation. |
| 403 | `forbidden` | Admin not in hospital's scope. |
| 409 | `conflict` | Department with this name already exists in hospital. |

---

## 6. Update department

```
PATCH /v1/departments/{id}
```

### Request

```json
{
  "patients_count": 150,
  "status": "inactive"
}
```

### Response

```
200 OK
```

Returns updated department.

---

## 7. Soft-delete department

```
DELETE /v1/departments/{id}
```

### Response

```
204 No Content
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Admin not in hospital's scope. |
| 404 | `not_found` | Department does not exist. |
| 422 | `business_rule_violated` | Cannot delete department with active assigned doctors. |

---

## 8. List doctors in department

```
GET /v1/departments/{id}/doctors
```

Returns the list of doctors assigned to this department. Doctors are linked via the `doctors.specialty` field (matching the department's `name` or via a join table `department_doctors`).

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440200",
      "name": "Dr. Sarah Johnson",
      "specialty": "Cardiology",
      "experience": 14,
      "rating": 4.6,
      "patients_count": 215,
      "image_url": "https://cdn.medexpert.in/doctors/sarah-johnson.jpg"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

### Linking doctors to departments

Two ways (backend chooses):

**Option A — by specialty string match (simple):**
```sql
SELECT d.* FROM doctors d
WHERE d.hospital_id = ? AND d.specialty = ?;
```

The frontend's `DepartmentForm` provides `doctors` as a string array (free text), but the database also matches via `specialty` field on `doctors`.

**Option B — explicit join table (recommended for production):**
```sql
CREATE TABLE department_doctors (
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  doctor_id     UUID REFERENCES doctors(id) ON DELETE CASCADE,
  PRIMARY KEY (department_id, doctor_id)
);
```

**Recommendation:** Use option B. It allows a doctor to be in multiple departments and supports explicit assignments that don't depend on the doctor's specialty string.

---

## 9. Implementation notes

### Patient count auto-calculation

The `patients_count` field on a department can be auto-calculated:

```sql
UPDATE departments
SET patients_count = (
  SELECT COUNT(DISTINCT p.id)
  FROM patients p
  JOIN consultations c ON c.patient_id = p.id
  JOIN doctors d ON c.doctor_id = d.id
  WHERE d.department_id = departments.id
);
```

The admin input field becomes a manual override; if not provided, the backend auto-calculates.

### Hospital-scoped uniqueness

Department name is unique within a hospital, not globally. Create a unique index:
```sql
CREATE UNIQUE INDEX idx_departments_hospital_name ON departments(hospital_id, name) WHERE deleted_at IS NULL;
```

### Speciality ↔ Doctor specialty alignment

The 8 doctor specialties match the 8 specialities in the registration wizard's `primary_department` enum:
- Cardiology, Neurology, Radiology, Pediatrics, Orthopedics, Pathology, General Surgery, plus Endocrinology, Oncology, Gastroenterology, Pulmonology, Nephrology (all 12 are in registration; only 7 are in `doctors.specialty`).

The backend's `doctors.specialty` enum is the **admin-tracked set**; the registration's `primary_department` is the **patient's need** (a Cardiology doctor serves a patient whose primary_department is Cardiology). Mapping happens via the `doctors.specialty` field.

### Validation rules

The `name` field in the form should match one of the 8 specialities (or "other" / custom). To be flexible, the backend accepts any string but logs a warning if it's not in the standard 8.