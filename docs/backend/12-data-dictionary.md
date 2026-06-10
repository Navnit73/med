# 12 · Data Dictionary

Every enum, code, and constant used anywhere in the application. The backend **must** use these exact values to remain compatible with the frontend.

---

## Indian states

Source: `src/pages/patient/Registration.jsx` step 1.

| Value |
|---|
| `Maharashtra` |
| `Delhi` |
| `Karnataka` |
| `Tamil Nadu` |
| `West Bengal` |
| `Gujarat` |
| `Rajasthan` |
| `Uttar Pradesh` |
| `Telangana` |
| `Kerala` |

The backend stores these as free text but validates against this list.

---

## Doctor specialties

Source: `src/pages/admin/hospitals/view/DoctorForm.jsx` and `src/data/mockDoctors.js`.

| Enum value (DB) | Display | Lucide icon | Color |
|---|---|---|---|
| `Cardiology` | Cardiology | `HeartPulse` | `#ef4444` (red) |
| `Neurology` | Neurology | `Brain` | `#8b5cf6` (violet) |
| `Radiology` | Radiology | `Scan` (admin) / `Microscope` (public) | `#06b6d4` (cyan) |
| `Pediatrics` | Pediatrics | `Baby` | `#ec4899` (pink) |
| `Orthopedics` | Orthopedics | `Bone` | `#f59e0b` (amber) |
| `Pathology` | Pathology | `FlaskConical` | `#14b8a6` (teal) |
| `General Surgery` | General Surgery | `Scissors` (public) | slate |
| `General` | General | `Stethoscope` | slate |

> The admin form has 7 specialties (`Cardiology`, `Neurology`, `Radiology`, `Pediatrics`, `Orthopedics`, `Pathology`, `General`).
> The public mock has 8 (`Cardiology`, `Neurology`, `Oncology`, `Orthopedics`, `Pediatrics`, `Dermatology`, `Radiology`, `General Surgery`).
> The patient registration has 12 (adds `Oncology`, `Endocrinology`, `Gastroenterology`, `Pulmonology`, `Nephrology`).
>
> **Recommendation:** Unify the doctor's `specialty` enum to the union of all 12, and the patient `primary_department` enum to the same 12. The Lucide icon/color map should be the same.

### Unified 12-specialty enum

| Value | Display | Lucide icon | Color |
|---|---|---|---|
| `Cardiology` | Cardiology | `HeartPulse` | `#ef4444` |
| `Neurology` | Neurology | `Brain` | `#8b5cf6` |
| `Oncology` | Oncology | `Activity` | `#ec4899` |
| `Orthopedics` | Orthopedics | `Bone` | `#f59e0b` |
| `Pediatrics` | Pediatrics | `Baby` | `#ec4899` |
| `Dermatology` | Dermatology | `Sun` | `#fbbf24` |
| `Radiology` | Radiology | `Scan` | `#06b6d4` |
| `General Surgery` | General Surgery | `Scissors` | `#64748b` |
| `Pathology` | Pathology | `FlaskConical` | `#14b8a6` |
| `Endocrinology` | Endocrinology | `TestTube` | `#3b82f6` |
| `Gastroenterology` | Gastroenterology | `Apple` | `#10b981` |
| `Pulmonology` | Pulmonology | `Wind` | `#0ea5e9` |
| `Nephrology` | Nephrology | `Droplet` | `#a855f7` |

---

## Patient registration fields

Source: `src/pages/patient/Registration.jsx` step 1.

### `gender`

| Value |
|---|
| `male` |
| `female` |
| `other` |

### `symptomDuration`

| Value | Display |
|---|---|
| `under-1-week` | Under 1 week |
| `1-4-weeks` | 1–4 weeks |
| `1-3-months` | 1–3 months |
| `3-6-months` | 3–6 months |
| `over-6-months` | Over 6 months |

### `severity`

| Value | Display |
|---|---|
| `mild` | Mild |
| `moderate` | Moderate |
| `severe` | Severe |

### `intent` (registration step 2)

| Value | Display | Badge |
|---|---|---|
| `expert` | Expert Second Opinion | "Most Popular" |
| `caselet` | Create Medical Summary | — |

> **API mapping:** `expert` → `expert_opinion`, `caselet` → `caselet` in the consultation entity.

### `consultType` (registration step 4)

| Value | Display |
|---|---|
| `single` | Single Expert |
| `multiple` | Panel (Multiple) |

---

## Document types

Source: `src/pages/patient/Registration.jsx` step 3.

| Value | Display |
|---|---|
| `prescription` | Prescription |
| `discharge_summary` | Discharge Summary |
| `blood_report` | Blood Report |
| `radiology_scan` | Radiology Scan |
| `pathology_report` | Pathology Report |
| `other` | Other |

---

## Hospital status

Source: `src/pages/admin/hospitals/HospitalList.jsx` and `src/pages/Hospitals.jsx`.

| Value | Display | Color |
|---|---|---|
| `active` | Active | emerald-500 |
| `pending` | Pending | amber-500 |
| `inactive` | Inactive | slate-500 |

---

## Doctor status

Source: `src/pages/admin/hospitals/view/DoctorForm.jsx`.

| Value | Display |
|---|---|
| `active` | Active |
| `inactive` | Inactive |

---

## Department / Speciality status

Source: `src/pages/admin/hospitals/view/DepartmentForm.jsx`.

| Value |
|---|
| `active` |
| `inactive` |

---

## Department icons

Source: `src/pages/admin/hospitals/view/DepartmentsTab.jsx` (DEPT_ICONS map).

| Icon name | Lucide component | Color |
|---|---|---|
| `cardiology` | `HeartPulse` | red-500 |
| `neurology` | `Brain` | violet-500 |
| `orthopedics` | `Bone` | amber-500 |
| `ophthalmology` | `Eye` | cyan-500 |
| `pediatrics` | `Baby` | pink-500 |
| `pathology` | `FlaskConical` | teal-500 |
| `general` | `Stethoscope` | slate-500 |
| `other` | `Stethoscope` | slate-500 |

---

## Patient status

Source: `src/pages/admin/hospitals/view/PatientsTab.jsx`.

| Value | Display | Color |
|---|---|---|
| `admitted` | Admitted | blue-500 |
| `outpatient` | Outpatient | violet-500 |
| `discharged` | Discharged | slate-500 |
| `critical` | Critical | red-500 |

---

## Patient ward

Source: `src/pages/admin/hospitals/view/PatientsTab.jsx`.

| Value | Display | Color |
|---|---|---|
| `icu` | ICU | red-500 |
| `general` | General | slate-500 |
| `cardio` | Cardio | pink-500 |
| `neuro` | Neuro | violet-500 |

---

## Contract status

Source: `src/pages/admin/hospitals/view/ContractsTab.jsx`.

| Value | Logic |
|---|---|
| `active` | `end_date > today + 90 days` |
| `expiring` | `end_date <= today + 90 days` AND `end_date > today` |
| `expired` | `end_date <= today` |

### Contract type

| Value | Display |
|---|---|
| `service` | Service |
| `maintenance` | Maintenance |

---

## Consultation status

Source: `src/pages/patient/Registration.jsx` step 5 and 6.

| Value | Display | Meaning |
|---|---|---|
| `pending_payment` | Awaiting payment | Created, no payment yet |
| `paid` | Payment received | Razorpay webhook received |
| `assigned` | Doctor assigned | Doctors notified, awaiting response |
| `in_progress` | In progress | Doctor reviewing records |
| `completed` | Completed | Doctor opinion delivered |
| `cancelled` | Cancelled | User/admin cancelled, refund processed |
| `refunded` | Refunded | Refund completed |

### Consultation intent

| Value | Display |
|---|---|
| `expert_opinion` | Expert Second Opinion |
| `caselet` | Create Medical Summary |

### Consultation type

| Value | Display |
|---|---|
| `single` | Single Expert |
| `multiple` | Panel (Multiple) |

### Payment method

| Value |
|---|
| `upi` |
| `card` |
| `netbanking` |

---

## User roles

| Value | Description |
|---|---|
| `admin` | Hospital or super-admin user |
| `patient` | Patient user |

---

## User status

| Value | Description |
|---|---|
| `active` | Verified, can authenticate |
| `disabled` | Manually disabled |
| `pending_verification` | Created but phone not yet verified |

---

## Sort options per endpoint

| Endpoint | Allowed `sort` values |
|---|---|
| `GET /doctors` | `name`, `experience`, `rating`, `patients_count`, `consultation_fee`, `relevance` (default) |
| `GET /patients` | `mrn`, `first_name`, `registered_at` (default), `status` |
| `GET /hospitals` | `name` (default), `created_at`, `staff_count` |
| `GET /contracts` | `end_date` (default), `start_date`, `name`, `created_at` |
| `GET /consultations` | `created_at` (default), `amount`, `status` |

---

## Pagination defaults

| Endpoint | Default `per_page` | Max `per_page` |
|---|---|---|
| `GET /doctors` | 20 | 100 |
| `GET /patients` | 20 | 100 |
| `GET /hospitals` | 20 | 100 |
| `GET /contracts` | 20 | 100 |
| `GET /consultations` | 20 | 100 |
| `GET /uploads` | 20 | 100 |

---

## Currency & money

| Field | Type | Unit | Example |
|---|---|---|---|
| `consultation.amount` | int | paise (1 INR = 100 paise) | `320000` (₹3,200) |
| `consultation.doctor_fees` | int | paise | `300000` (₹3,000) |
| `consultation.platform_fee` | int | paise | `20000` (₹200) |
| `doctor.consultation_fee` | int | paise | `150000` (₹1,500) |
| `hospital.consultation_fee_default` | int | paise | `150000` |
| `hospital.platform_fee` | int | paise | `20000` |
| `contract.value` | int | paise | `50000000` (₹5,00,000) |
| `analytics.total_revenue.value` | int | paise | `386000000` (₹38.6L) |

The frontend formats with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })` for display.

---

## MRN format

`MRN-<5+ digit zero-padded integer>`. Generated by a Postgres sequence starting at 10000.

Examples: `MRN-10000`, `MRN-10001`, `MRN-12345`.

---

## Time and date

| Field | Format | Example |
|---|---|---|
| `created_at`, `updated_at` | ISO 8601 UTC with Z | `2026-06-10T08:14:22.103Z` |
| `start_date`, `end_date` (contracts) | ISO date `YYYY-MM-DD` | `2026-12-31` |
| `date_of_birth` (patient) | ISO date `YYYY-MM-DD` | `1985-04-22` |
| Booking slot `time` | HH:MM 24h | `09:30` |

---

## Allowed phone format

- E.164: `+91<10 digits>` for Indian numbers
- Validation: `^\+91[1-9]\d{9}$`
- Examples: `+919876543210`, `+910000000001` (super-admin)

---

## Allowed email format

- RFC 5322 standard
- Max 254 chars
- Examples: `john.doe@example.com`, `ops@medexpert.in`

---

## Allowed pincode format

- 6 digits, first digit 1-9
- Examples: `400053` (Mumbai), `110001` (Delhi)

---

## File MIME allowlist (uploads)

| Type | MIMEs | Max size |
|---|---|---|
| PDF | `application/pdf` | 20 MB |
| Image | `image/jpeg`, `image/png`, `image/webp` | 10 MB |
| Word | `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 10 MB |
| DICOM (radiology) | `application/dicom` | 50 MB |

---

## Time slots (booking)

Frontend's hardcoded 6 slots on the doctor profile page:
- 10:00, 10:30, 11:00, 11:30, 14:00, 14:30

The backend should generate these from a doctor's `schedule.availability` (array of days + 30-min slots).

---

## Hospital fees defaults

| Fee | Default | Notes |
|---|---|---|
| Doctor consultation fee | ₹1,500 (150000 paise) | Per doctor |
| Platform fee | ₹200 (20000 paise) | Per consultation, total not per doctor |

The frontend shows `total = doctor_count * 1500 + 200`.

---

## Region name (analytics)

The frontend `regions` array uses display names; the backend maps patient `state` to region display names:

| State (DB) | Region (Display) |
|---|---|
| `Maharashtra` | `Maharashtra` |
| `Delhi` | `Delhi NCR` |
| `Karnataka` | `Karnataka` |
| `Tamil Nadu` | `Tamil Nadu` |
| `West Bengal` | `West Bengal` |
| `Gujarat` | `Gujarat` |
| `Rajasthan` | `Rajasthan` |
| `Uttar Pradesh` | `Uttar Pradesh` |
| `Telangana` | `Telangana` |
| `Kerala` | `Kerala` |

---

## Status colors (frontend display only)

| Status | Color |
|---|---|
| `active` | emerald-500 |
| `pending` | amber-500 |
| `inactive` | slate-500 |
| `admitted` | blue-500 |
| `outpatient` | violet-500 |
| `discharged` | slate-500 |
| `critical` | red-500 |
| `paid` | emerald-500 |
| `assigned` | blue-500 |
| `in_progress` | amber-500 |
| `completed` | emerald-500 |
| `cancelled` | red-500 |
| `refunded` | slate-500 |
| `pending_payment` | amber-500 |

These are **frontend concerns only** — the backend should not encode color values in API responses.