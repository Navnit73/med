# 13 · Database Schema (PostgreSQL)

Reference PostgreSQL DDL for the MedExpert backend. Use Alembic to manage migrations in production.

> All IDs are UUIDv4 (Postgres `uuid` type).
> All timestamps are `TIMESTAMPTZ` in UTC.
> All money is `BIGINT` paise.

---

## Enums

```sql
CREATE TYPE user_role AS ENUM ('admin', 'patient');
CREATE TYPE user_status AS ENUM ('active', 'disabled', 'pending_verification');

CREATE TYPE hospital_status AS ENUM ('active', 'pending', 'inactive');
CREATE TYPE doctor_status AS ENUM ('active', 'inactive');
CREATE TYPE department_status AS ENUM ('active', 'inactive');
CREATE TYPE contract_type AS ENUM ('service', 'maintenance');

CREATE TYPE specialty AS ENUM (
  'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics',
  'Dermatology', 'Radiology', 'General Surgery', 'Pathology',
  'Endocrinology', 'Gastroenterology', 'Pulmonology', 'Nephrology'
);

CREATE TYPE gender AS ENUM ('male', 'female', 'other');

CREATE TYPE symptom_duration AS ENUM (
  'under-1-week', '1-4-weeks', '1-3-months', '3-6-months', 'over-6-months'
);

CREATE TYPE severity AS ENUM ('mild', 'moderate', 'severe');

CREATE TYPE patient_status AS ENUM ('admitted', 'outpatient', 'discharged', 'critical');

CREATE TYPE ward AS ENUM ('icu', 'general', 'cardio', 'neuro');

CREATE TYPE consultation_intent AS ENUM ('expert_opinion', 'caselet');
CREATE TYPE consultation_type AS ENUM ('single', 'multiple');
CREATE TYPE consultation_status AS ENUM (
  'pending_payment', 'paid', 'assigned', 'in_progress', 'completed', 'cancelled', 'refunded'
);

CREATE TYPE payment_method AS ENUM ('upi', 'card', 'netbanking');

CREATE TYPE upload_type AS ENUM (
  'prescription', 'discharge_summary', 'blood_report',
  'radiology_scan', 'pathology_report', 'other'
);

CREATE TYPE upload_status AS ENUM ('uploaded', 'processing', 'ready', 'failed');
CREATE TYPE scan_status AS ENUM ('pending', 'clean', 'infected');

CREATE TYPE doc_type AS ENUM (
  'prescription', 'discharge_summary', 'blood_report',
  'radiology_scan', 'pathology_report', 'other'
);
```

---

## 1. `users`

Authentication state. Single table for both admins and patients.

```sql
CREATE TABLE users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone            VARCHAR(20) NOT NULL UNIQUE,
  phone_verified   BOOLEAN NOT NULL DEFAULT false,
  role             user_role NOT NULL,
  status           user_status NOT NULL DEFAULT 'pending_verification',
  name             VARCHAR(200),
  email            VARCHAR(254),
  last_login_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at       TIMESTAMPTZ
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
```

---

## 2. `admin_users`

Profile for admin users.

```sql
CREATE TABLE admin_users (
  user_id          UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email            VARCHAR(254) NOT NULL,
  display_name     VARCHAR(200) NOT NULL,
  is_super_admin   BOOLEAN NOT NULL DEFAULT false,
  hospital_id      UUID,
  avatar_url       TEXT,
  preferences      JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_users_hospital_id ON admin_users(hospital_id);
CREATE INDEX idx_admin_users_email ON admin_users(email);
```

### Admin-hospital assignments (many-to-many)

```sql
CREATE TABLE admin_hospital_assignments (
  admin_user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  hospital_id      UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  PRIMARY KEY (admin_user_id, hospital_id)
);
```

---

## 3. `hospitals`

```sql
CREATE TABLE hospitals (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                     VARCHAR(200) NOT NULL,
  slug                     VARCHAR(200) NOT NULL UNIQUE,
  address                  TEXT,
  city                     VARCHAR(100) NOT NULL,
  state                    VARCHAR(50),
  pincode                  VARCHAR(6),
  phone                    VARCHAR(20),
  email                    VARCHAR(254),
  website                  TEXT,
  staff_count              INTEGER,
  departments_count        INTEGER NOT NULL DEFAULT 0,
  doctors_count            INTEGER NOT NULL DEFAULT 0,
  network_id               UUID,
  status                   hospital_status NOT NULL DEFAULT 'pending',
  logo_url                 TEXT,
  consultation_fee_default BIGINT NOT NULL DEFAULT 150000, -- ₹1500
  platform_fee             BIGINT NOT NULL DEFAULT 20000,  -- ₹200
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at               TIMESTAMPTZ
);

CREATE INDEX idx_hospitals_status ON hospitals(status);
CREATE INDEX idx_hospitals_city ON hospitals(city);
CREATE INDEX idx_hospitals_state ON hospitals(state);
CREATE INDEX idx_hospitals_name ON hospitals(name);
```

---

## 4. `departments`

```sql
CREATE TABLE departments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  head            VARCHAR(200) NOT NULL,
  head_doctor_id  UUID,
  patients_count  INTEGER NOT NULL DEFAULT 0,
  status          department_status NOT NULL DEFAULT 'active',
  icon            VARCHAR(50),
  color           VARCHAR(7),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  UNIQUE (hospital_id, name)
);

CREATE INDEX idx_departments_hospital_id ON departments(hospital_id);
CREATE INDEX idx_departments_status ON departments(status);
```

### `department_doctors` (join table)

```sql
CREATE TABLE department_doctors (
  department_id   UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  doctor_id       UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  PRIMARY KEY (department_id, doctor_id)
);
```

---

## 5. `doctors`

```sql
CREATE TABLE doctors (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id       UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  name              VARCHAR(200) NOT NULL,
  email             VARCHAR(254),
  phone             VARCHAR(20),
  specialty         specialty NOT NULL,
  degree            VARCHAR(200) NOT NULL,
  bio               TEXT,
  image_url         TEXT,
  experience        INTEGER NOT NULL DEFAULT 0,
  patients_count    INTEGER NOT NULL DEFAULT 0,
  rating            NUMERIC(3, 2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  status            doctor_status NOT NULL DEFAULT 'active',
  consultation_fee  BIGINT NOT NULL DEFAULT 150000,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX idx_doctors_hospital_id ON doctors(hospital_id);
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_status ON doctors(status);
CREATE INDEX idx_doctors_rating ON doctors(rating);
```

### `doctor_schedules`

```sql
CREATE TABLE doctor_schedules (
  doctor_id        UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  day_of_week      SMALLINT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sun
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  PRIMARY KEY (doctor_id, day_of_week)
);
```

### `doctor_slots` (bookable time slots)

```sql
CREATE TABLE doctor_slots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id        UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date        DATE NOT NULL,
  slot_time        TIME NOT NULL,
  status           VARCHAR(20) NOT NULL DEFAULT 'available', -- available, booked, unavailable
  consultation_id  UUID,
  UNIQUE (doctor_id, slot_date, slot_time)
);

CREATE INDEX idx_doctor_slots_doctor_date ON doctor_slots(doctor_id, slot_date);
CREATE INDEX idx_doctor_slots_status ON doctor_slots(status);
```

---

## 6. `patients`

```sql
CREATE SEQUENCE seq_mrn START 10000 INCREMENT 1;

CREATE TABLE patients (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  mrn                  VARCHAR(20) NOT NULL UNIQUE,

  first_name           VARCHAR(100) NOT NULL,
  last_name            VARCHAR(100) NOT NULL,
  phone                VARCHAR(20) NOT NULL,
  email                VARCHAR(254),
  date_of_birth        DATE,
  gender               gender,
  city                 VARCHAR(100),
  state                VARCHAR(50),
  pincode              VARCHAR(6),

  primary_department   specialty,
  chief_complaint      TEXT,
  symptom_duration     symptom_duration,
  severity             severity,
  allergies            TEXT,
  current_medications  TEXT,
  chronic_conditions   TEXT,
  surgical_history     TEXT,
  family_history       TEXT,
  earlier_opinion      TEXT,

  hospital_id          UUID REFERENCES hospitals(id) ON DELETE SET NULL,
  ward                 ward,
  assigned_doctor_id   UUID REFERENCES doctors(id) ON DELETE SET NULL,
  status               patient_status NOT NULL DEFAULT 'outpatient',
  condition            TEXT,

  registered_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  admitted_at          TIMESTAMPTZ,
  discharged_at        TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_patients_hospital_id ON patients(hospital_id);
CREATE INDEX idx_patients_assigned_doctor_id ON patients(assigned_doctor_id);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_patients_primary_department ON patients(primary_department);
CREATE INDEX idx_patients_registered_at ON patients(registered_at DESC);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);
```

---

## 7. `uploads`

```sql
CREATE TABLE uploads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id      UUID REFERENCES patients(id) ON DELETE SET NULL,
  consultation_id UUID, -- FK added after consultations table

  file_name       VARCHAR(500) NOT NULL,
  title           VARCHAR(200) NOT NULL,
  type            upload_type NOT NULL,
  mime_type       VARCHAR(100) NOT NULL,
  size_bytes      BIGINT NOT NULL CHECK (size_bytes > 0),
  s3_key          VARCHAR(500) NOT NULL,
  s3_bucket       VARCHAR(100) NOT NULL,
  status          upload_status NOT NULL DEFAULT 'uploaded',
  scan_status     scan_status NOT NULL DEFAULT 'pending',
  ocr_text        TEXT,

  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_uploads_owner_user_id ON uploads(owner_user_id);
CREATE INDEX idx_uploads_patient_id ON uploads(patient_id);
CREATE INDEX idx_uploads_status ON uploads(status);
CREATE INDEX idx_uploads_scan_status ON uploads(scan_status);
```

---

## 8. `consultations`

```sql
CREATE TABLE consultations (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id               UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  hospital_id              UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,

  intent                   consultation_intent NOT NULL,
  consult_type             consultation_type NOT NULL,
  status                   consultation_status NOT NULL DEFAULT 'pending_payment',

  primary_doctor_id        UUID REFERENCES doctors(id) ON DELETE SET NULL,
  assigned_at              TIMESTAMPTZ,

  next_action_due_at       TIMESTAMPTZ,
  completed_at             TIMESTAMPTZ,
  cancelled_at             TIMESTAMPTZ,
  cancellation_reason      TEXT,

  amount                   BIGINT NOT NULL,
  doctor_fees              BIGINT NOT NULL,
  platform_fee             BIGINT NOT NULL,

  payment_method           payment_method,
  payment_id               VARCHAR(100),
  paid_at                  TIMESTAMPTZ,
  refunded_at              TIMESTAMPTZ,
  refund_amount            BIGINT,

  ai_summary               TEXT,
  ai_summary_generated_at  TIMESTAMPTZ,

  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at               TIMESTAMPTZ
);

CREATE INDEX idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX idx_consultations_hospital_id ON consultations(hospital_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_consultations_intent ON consultations(intent);
CREATE INDEX idx_consultations_created_at ON consultations(created_at DESC);
```

### `consultation_doctors` (many-to-many)

```sql
CREATE TABLE consultation_doctors (
  consultation_id  UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  doctor_id        UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
  is_primary       BOOLEAN NOT NULL DEFAULT false,
  assigned_at      TIMESTAMPTZ,
  PRIMARY KEY (consultation_id, doctor_id)
);
```

### `consultation_documents` (many-to-many)

```sql
CREATE TABLE consultation_documents (
  consultation_id  UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  upload_id        UUID NOT NULL REFERENCES uploads(id) ON DELETE RESTRICT,
  PRIMARY KEY (consultation_id, upload_id)
);

ALTER TABLE uploads
  ADD CONSTRAINT fk_uploads_consultation_id
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL;
```

---

## 9. `contracts`

```sql
CREATE TABLE contracts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id     UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name            VARCHAR(200) NOT NULL,
  type            contract_type NOT NULL,
  vendor_name     VARCHAR(200),
  start_date      DATE NOT NULL,
  end_date        DATE NOT NULL,
  value           BIGINT,
  terms           TEXT,
  document_url    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ,
  CHECK (end_date > start_date)
);

CREATE INDEX idx_contracts_hospital_id ON contracts(hospital_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_contracts_type ON contracts(type);
```

---

## 10. `audit_log`

```sql
CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id   UUID REFERENCES users(id) ON DELETE SET NULL,
  action          VARCHAR(100) NOT NULL,
  entity_type     VARCHAR(50) NOT NULL,
  entity_id       UUID,
  before          JSONB,
  after           JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_actor ON audit_log(actor_user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at DESC);
```

---

## 11. `webhook_log`

```sql
CREATE TABLE webhook_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider        VARCHAR(50) NOT NULL,
  event_type      VARCHAR(50) NOT NULL,
  payload         JSONB NOT NULL,
  status          VARCHAR(50) NOT NULL,
  error_message   TEXT,
  retries         INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  retried_at      TIMESTAMPTZ
);

CREATE INDEX idx_webhook_log_provider ON webhook_log(provider);
CREATE INDEX idx_webhook_log_status ON webhook_log(status);
CREATE INDEX idx_webhook_log_created_at ON webhook_log(created_at DESC);
```

---

## 12. `otp_codes` (audit only; live storage is Redis)

```sql
CREATE TABLE otp_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           VARCHAR(20) NOT NULL,
  code_hash       VARCHAR(255) NOT NULL,
  attempts        INTEGER NOT NULL DEFAULT 0,
  verified        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ NOT NULL,
  consumed_at     TIMESTAMPTZ
);

CREATE INDEX idx_otp_codes_phone ON otp_codes(phone);
CREATE INDEX idx_otp_codes_expires ON otp_codes(expires_at);
```

> **Note:** Live OTP storage is in Redis with 5-minute TTL. This table is for audit/analytics only.

---

## 13. Seed data

```sql
-- Super-admin
INSERT INTO users (phone, role, status, phone_verified, name, email)
VALUES ('+910000000000', 'admin', 'active', true, 'Super Admin', 'admin@medexpert.com');

INSERT INTO admin_users (user_id, email, display_name, is_super_admin)
SELECT id, 'admin@medexpert.com', 'Super Admin', true FROM users WHERE phone = '+910000000000';

-- Default hospital
INSERT INTO hospitals (name, slug, city, status, staff_count, departments_count, doctors_count)
VALUES
  ('Apollo Medical Center', 'apollo-medical-center', 'Mumbai', 'active', 420, 12, 87),
  ('Fortis Hospital', 'fortis-hospital', 'Bangalore', 'active', 380, 10, 65),
  ('Max Hospital', 'max-hospital', 'Delhi', 'active', 510, 14, 102),
  ('Medanta Hospital', 'medanta-hospital', 'Gurgaon', 'active', 600, 16, 120),
  ('Manipal Hospital', 'manipal-hospital', 'Bangalore', 'pending', 350, 8, 55),
  ('AIIMS', 'aiims', 'Delhi', 'active', 1200, 25, 350);

-- Sample doctor
INSERT INTO doctors (hospital_id, name, email, phone, specialty, degree, experience, status, consultation_fee)
VALUES
  ((SELECT id FROM hospitals WHERE slug = 'apollo-medical-center'),
   'Dr. Sarah Johnson', 'sarah@apollomed.com', '+919876512345',
   'Cardiology', 'MBBS, MD (Cardiology)', 14, 'active', 150000);
```

---

## 14. Useful queries

### Total revenue per hospital per month

```sql
SELECT
  h.name AS hospital,
  DATE_TRUNC('month', c.created_at) AS month,
  SUM(c.amount) AS total_revenue
FROM consultations c
JOIN hospitals h ON c.hospital_id = h.id
WHERE c.status IN ('paid', 'assigned', 'in_progress', 'completed')
GROUP BY h.id, h.name, month
ORDER BY month DESC, total_revenue DESC;
```

### Top doctors by patients

```sql
SELECT
  d.name,
  d.specialty,
  COUNT(DISTINCT c.patient_id) AS unique_patients
FROM doctors d
LEFT JOIN consultations c ON c.id = ANY(
  SELECT consultation_id FROM consultation_doctors WHERE doctor_id = d.id
)
WHERE d.status = 'active'
GROUP BY d.id
ORDER BY unique_patients DESC
LIMIT 10;
```

### Patients by region

```sql
SELECT
  state,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'admitted' THEN 1 ELSE 0 END) AS admitted,
  SUM(CASE WHEN status = 'outpatient' THEN 1 ELSE 0 END) AS outpatient
FROM patients
WHERE deleted_at IS NULL
GROUP BY state
ORDER BY total DESC;
```

### Specialty breakdown (donut chart data)

```sql
SELECT
  primary_department,
  COUNT(*) AS patients
FROM patients
WHERE deleted_at IS NULL
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY primary_department
ORDER BY patients DESC;
```

### Active regions (last 30 days)

```sql
SELECT COUNT(DISTINCT state) AS active_regions
FROM patients
WHERE created_at >= NOW() - INTERVAL '30 days'
  AND state IS NOT NULL;
```
