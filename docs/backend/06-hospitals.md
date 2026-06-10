# 06 · Hospitals

The `Hospital` entity is the network's top-level resource. Public visitors browse them; admins manage them; everything else (departments, doctors, patients, contracts) hangs off a hospital.

> **Frontend mapping:** Public `src/pages/Hospitals.jsx` (6-row directory), `src/pages/admin/hospitals/HospitalList.jsx` (admin table), `src/pages/admin/hospitals/HospitalEdit.jsx` (create/edit form), `src/pages/admin/hospitals/view/*` (per-hospital tabs).

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/hospitals` | — | Public + admin list of hospitals. |
| `GET` | `/hospitals/{id}` | — | Hospital detail. |
| `POST` | `/hospitals` | admin | Create hospital. |
| `PATCH` | `/hospitals/{id}` | admin | Update hospital. |
| `DELETE` | `/hospitals/{id}` | admin | Soft-delete hospital. |
| `GET` | `/hospitals/{id}/dashboard` | admin | Per-hospital analytics. |

---

## 2. Hospital entity

```ts
Hospital {
  id:             UUID         // PK
  name:           string       // required
  slug:           string       // unique URL slug, derived from name
  address:        string | null
  city:           string       // required
  state:          string | null
  pincode:        string | null
  phone:          string | null
  email:          string | null
  website:        string | null // URL
  staff_count:    number | null // current staff count
  departments_count: number    // calculated, set by triggers
  doctors_count:    number     // calculated, set by triggers

  // Network
  network_id:     UUID | null   // multi-tenant support, optional
  status:         "active" | "pending" | "inactive"
  logo_url:       string | null

  // Settings
  consultation_fee_default: number // default ₹1500 in paise
  platform_fee:             number // default ₹200 in paise

  created_at:     DateTime
  updated_at:     DateTime
  deleted_at:     DateTime | null
}
```

### Public response shape (from `GET /hospitals`)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Apollo Medical Center",
  "address": "120 Wellness Blvd",
  "city": "Mumbai",
  "phone": "+91 22 5555 0101",
  "staff_count": 420,
  "doctors_count": 87,
  "status": "active",
  "logo_url": "https://cdn.medexpert.in/hospitals/apollo.png"
}
```

### Admin response shape (with metrics)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Apollo Medical Center",
  "address": "120 Wellness Blvd",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400053",
  "phone": "+91 22 5555 0101",
  "email": "info@apollomed.com",
  "website": "https://apollomed.com",
  "staff_count": 420,
  "departments_count": 12,
  "doctors_count": 87,
  "status": "active",
  "logo_url": "https://cdn.medexpert.in/hospitals/apollo.png",
  "consultation_fee_default": 150000,
  "platform_fee": 20000,
  "created_at": "2026-01-15T08:14:22.103Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

---

## 3. List hospitals (public + admin)

```
GET /v1/hospitals?status=active&q=mumbai&page=1&per_page=20&sort=name:asc
```

| Filter | Type | Description |
|---|---|---|
| `status` | enum | `active`, `pending`, or `inactive`. |
| `q` | string | Free-text on name, city, address. |
| `sort` | string | `name`, `created_at`, `staff_count`. Default `name:asc`. |
| `city` | string | Filter by city. |
| `state` | string | One of 10 Indian states. |

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Apollo Medical Center",
      "address": "120 Wellness Blvd",
      "city": "Mumbai",
      "phone": "+91 22 5555 0101",
      "staff_count": 420,
      "doctors_count": 87,
      "status": "active",
      "logo_url": "https://cdn.medexpert.in/hospitals/apollo.png"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 6, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

The frontend public `Hospitals.jsx` displays 6 hardcoded hospital cards. The admin `HospitalList.jsx` displays the same data with edit/delete actions.

---

## 4. Get one hospital

```
GET /v1/hospitals/{id}
```

### Response

```
200 OK
```

Returns full hospital object (admin or public shape based on auth).

---

## 5. Create hospital (admin)

```
POST /v1/hospitals
```

The frontend `HospitalEdit.jsx` sends this payload.

### Request

```json
{
  "name": "Apollo Medical Center",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "120 Wellness Blvd",
  "pincode": "400053",
  "phone": "+91 22 5555 0101",
  "email": "info@apollomed.com",
  "website": "https://apollomed.com",
  "staff_count": 420,
  "status": "active",
  "logo": { /* multipart file */ }
}
```

### Response

```
201 Created
```

Returns the created hospital.

### Validation

| Field | Rule |
|---|---|
| `name` | 1–200 chars, required, unique. |
| `city` | 1–100 chars, required. |
| `state` | one of 10 Indian states, optional. |
| `address` | 1–500 chars, optional. |
| `pincode` | 6 digits, optional. |
| `phone` | E.164 format, optional. |
| `email` | RFC 5322, optional. |
| `website` | URL format, optional. |
| `staff_count` | integer ≥ 0, optional. |
| `status` | one of `active`, `pending`, `inactive`, required. |

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Any field fails validation. |
| 403 | `forbidden` | Caller is not admin. |
| 409 | `conflict` | Hospital with this name + city already exists. |

---

## 6. Update hospital (admin)

```
PATCH /v1/hospitals/{id}
```

### Request

```json
{
  "staff_count": 450,
  "status": "inactive"
}
```

### Response

```
200 OK
```

Returns updated hospital.

---

## 7. Soft-delete hospital (admin)

```
DELETE /v1/hospitals/{id}
```

### Response

```
204 No Content
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller is not super-admin. |
| 422 | `business_rule_violated` | Hospital has active consultations. |

---

## 8. Per-hospital dashboard

```
GET /v1/hospitals/{id}/dashboard?period=1M
```

| Param | Type | Description |
|---|---|---|
| `period` | enum | `1W`, `1M`, `3M`, `YTD`. Default `1M`. |

Returns aggregate analytics for the hospital's "Dashboard" tab. The frontend's `DashboardTab.jsx` displays:

- 4 stat cards: OPD Consultations, IPD Conversions, Tests Booked, Revenue Today
- 1 area chart: OPD vs IPD monthly
- 1 donut: Doctor patient distribution
- 1 horizontal bar: Top 5 doctors

### Response

```
200 OK
```

```json
{
  "hospital": {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Apollo Medical Center"
  },
  "period": "1M",
  "date_from": "2026-05-10T00:00:00Z",
  "date_to":   "2026-06-10T23:59:59Z",
  "stats": {
    "opd_consultations": { "value": 312, "change": 18, "direction": "up" },
    "ipd_conversions":   { "value": 47,  "change": 5,  "direction": "up" },
    "tests_booked":      { "value": 189, "change": -12, "direction": "down" },
    "revenue_today":     { "value": 24000000, "change": 3000000, "direction": "up" }
  },
  "consultation_trend": {
    "x_axis": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "opd":   [210, 240, 195, 280, 260, 310, 295, 320, 312, 340, 318, 305],
    "ipd":   [32, 38, 28, 44, 40, 47, 43, 51, 47, 54, 49, 46]
  },
  "doctor_distribution": {
    "total": 302,
    "data": [
      { "name": "Dr. Sharma",  "specialty": "Cardiology", "patients": 58 },
      { "name": "Dr. Mehta",   "specialty": "Neurology",  "patients": 44 },
      { "name": "Dr. Kapoor",  "specialty": "Orthopedics", "patients": 39 },
      { "name": "Dr. Verma",   "specialty": "Pediatrics", "patients": 35 },
      { "name": "Dr. Gupta",   "specialty": "ICU",        "patients": 52 },
      { "name": "Dr. Iyer",    "specialty": "Radiology",  "patients": 28 },
      { "name": "Dr. Singh",   "specialty": "Gynecology", "patients": 46 }
    ]
  },
  "top_doctors": [
    { "rank": 1, "name": "Dr. Sharma", "specialty": "Cardiology", "patients": 58, "is_top_performer": true },
    { "rank": 2, "name": "Dr. Gupta",  "specialty": "ICU",        "patients": 52, "is_top_performer": false },
    { "rank": 3, "name": "Dr. Singh",  "specialty": "Gynecology", "patients": 46, "is_top_performer": false },
    { "rank": 4, "name": "Dr. Mehta",  "specialty": "Neurology",  "patients": 44, "is_top_performer": false },
    { "rank": 5, "name": "Dr. Kapoor", "specialty": "Orthopedics", "patients": 39, "is_top_performer": false }
  ]
}
```

### Period semantics

- `1W` — last 7 days
- `1M` — last 30 days
- `3M` — last 90 days
- `YTD` — January 1 of current year to today

For the `consultation_trend` chart, the x-axis is always 12 months (Jan–Dec) but only months within the `period` window are populated; older months return 0.

### Calculation SQL

```sql
-- OPD vs IPD monthly
SELECT
  EXTRACT(MONTH FROM c.created_at) AS month,
  SUM(CASE WHEN c.type = 'opd' THEN 1 ELSE 0 END) AS opd,
  SUM(CASE WHEN c.type = 'ipd' THEN 1 ELSE 0 END) AS ipd
FROM consultations c
WHERE c.hospital_id = ? 
  AND c.created_at >= ?
  AND c.created_at < ?
  AND c.status = 'completed'
GROUP BY month
ORDER BY month;
```

---

## 9. Implementation notes

### Slug generation

```python
import re

def make_slug(name: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return slug
```

Ensure unique by appending `-{n}` if conflict. Store in `slug` column with unique index.

### Departments and doctors count

Update via Postgres triggers on `doctors` and `departments` insert/update/delete:

```sql
CREATE OR REPLACE FUNCTION update_hospital_counts() RETURNS TRIGGER AS $$
BEGIN
  UPDATE hospitals
  SET doctors_count = (SELECT COUNT(*) FROM doctors WHERE hospital_id = NEW.hospital_id AND deleted_at IS NULL),
      departments_count = (SELECT COUNT(*) FROM departments WHERE hospital_id = NEW.hospital_id AND deleted_at IS NULL)
  WHERE id = NEW.hospital_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_doctor_count
AFTER INSERT OR UPDATE OR DELETE ON doctors
FOR EACH ROW EXECUTE FUNCTION update_hospital_counts();
```

### Logo upload

Same pattern as doctor images: multipart upload to S3 at `/hospitals/{hospital_id}/logo.png`. Resize to 256×256, WebP, ≤ 50KB.

### Hospital scoping for admins

The admin's `hospital_id` (or `admin_hospital_assignments` join table) determines which hospital the admin can see. Endpoints must enforce this:

```python
async def get_hospital_or_403(hospital_id: UUID, principal: Principal) -> Hospital:
    if principal.is_super_admin:
        return await Hospital.get(hospital_id)
    if hospital_id not in principal.hospital_ids:
        raise HTTPException(403, detail={"code": "forbidden", "message": "..."})
    return await Hospital.get(hospital_id)
```

### Network vs hospital

For multi-tenant deployments, the `network_id` field groups hospitals into a network. The MedExpert frontend doesn't expose this; it's a backend concern for B2B clients (e.g., "MedExpert Network — South India"). For v1, treat all hospitals as belonging to a single default network.