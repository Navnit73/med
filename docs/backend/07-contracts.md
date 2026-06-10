# 07 · Contracts

A `Contract` represents a legal or service agreement between a hospital and a vendor (e.g., equipment supplier, maintenance provider).

> **Frontend mapping:** `src/pages/admin/hospitals/view/ContractsTab.jsx`

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/hospitals/{hospital_id}/contracts` | admin | List contracts for a hospital. |
| `GET` | `/contracts/{id}` | admin | Get one contract. |
| `POST` | `/hospitals/{hospital_id}/contracts` | admin | Create contract. |
| `PATCH` | `/contracts/{id}` | admin | Update contract. |
| `DELETE` | `/contracts/{id}` | admin | Soft-delete contract. |
| `GET` | `/contracts/{id}/pdf` | admin | Download contract terms as PDF. |

---

## 2. Contract entity

```ts
Contract {
  id:              UUID        // PK
  hospital_id:     UUID        // FK -> hospitals.id, required
  name:            string      // required, e.g. "Service Agreement 2023"
  type:             "service" | "maintenance"
  vendor_name:      string | null // provider name
  start_date:      date        // required
  end_date:        date        // required
  value:            number | null // contract value in paise
  status:          "active" | "expiring" | "expired"

  // Text
  terms:            string | null // raw text or HTML of contract terms
  document_url:     string | null // S3 URL of uploaded contract PDF

  // Timestamps
  created_at:       DateTime
  updated_at:       DateTime
  deleted_at:       DateTime | null
}
```

### Status calculation

| State | Logic |
|---|---|
| `active` | `end_date > today + 90 days` |
| `expiring` | `end_date <= today + 90 days` AND `end_date > today` |
| `expired` | `end_date <= today` |

The server auto-calculates the status on read; it's not stored.

---

## 3. List contracts

```
GET /v1/hospitals/{hospital_id}/contracts?status=active&type=service&q=maintenance
```

| Filter | Type | Description |
|---|---|---|
| `status` | enum | `active`, `expiring`, `expired`. |
| `type` | enum | `service` or `maintenance`. |
| `q` | string | Free-text on name, vendor. |
| `sort` | string | `end_date`, `start_date`, `name`. Default `created_at:desc`. |

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440400",
      "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
      "name": "Service Agreement 2023",
      "type": "service",
      "vendor_name": "MedTech Solutions",
      "start_date": "2023-01-01",
      "end_date": "2026-12-31",
      "value": 50000000,
      "status": "active",
      "days_remaining": 574,
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 2, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

The frontend `ContractsTab` displays these fields in the table: Contract (name + id), Type pill, Start, End, Days left (amber if < 90), Status, Actions.

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Admin not in hospital scope. |

---

## 4. Get contract

```
GET /v1/contracts/{id}
```

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440400",
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "name": "Service Agreement 2023",
  "type": "service",
  "vendor_name": "MedTech Solutions",
  "start_date": "2023-01-01",
  "end_date": "2026-12-31",
  "value": 50000000,
  "status": "active",
  "days_remaining": 574,
  "terms": "...",
  "document_url": "https://cdn.medexpert.in/contracts/400.pdf",
  "created_at": "2023-01-01T00:00:00Z",
  "updated_at": "2026-06-10T08:14:22.103Z"
}
```

---

## 5. Create contract

```
POST /v1/hospitals/{hospital_id}/contracts
```

### Request

```json
{
  "name": "Maintenance Contract 2026",
  "type": "maintenance",
  "vendor_name": "EquipCare Ltd",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "value": 25000000,
  "terms": "<p>Maintenance terms...</p>",
  "document": { /* multipart PDF */ }
}
```

### Response

```
201 Created
```

Returns created contract.

### Validation

- `name`: 1–200 chars.
- `type`: `service` or `maintenance`.
- `start_date`, `end_date`: ISO date strings, required.
- `end_date` must be > `start_date`.
- `value`: integer ≥ 0.
- `terms`: optional HTML or plain text, max 10000 chars.
- `document`: optional PDF, max 10MB.

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Date range invalid. |
| 403 | `forbidden` | Admin not in hospital scope. |

---

## 6. Update contract

```
PATCH /v1/contracts/{id}
```

### Request

```json
{
  "end_date": "2027-06-30",
  "status": "renewed"
}
```

Status can be manually overridden for edge cases.

### Response

```
200 OK
```

---

## 7. Get PDF

```
GET /v1/contracts/{id}/pdf
```

Returns a signed S3 URL or the PDF as a file download. The frontend's "Download PDF" button triggers this.

### Response

```
200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="Contract-ServiceAgreement2023.pdf"

<PDF bytes>
```

Returns `302` redirect to S3 presigned URL:

```
200 OK
X-Signed-Url: https://cdn.medexpert.in/contracts/400.pdf?X-Amz-Expires=3600&...
```

**Or**, serve directly if PDF was uploaded as binary.

---

## 8. Implementation notes

### Days remaining calculation

```python
from datetime import date

def get_days_remaining(end_date: date) -> int:
    return (end_date - date.today()).days
```

- If < 90, the frontend shows the "amber" style.
- Negative (expired) should return a client-facing status field instead of negative days.

### PDF storage

Upload PDF to S3 at `/contracts/{contract_id}/terms.pdf`. Store URL in `document_url`.

### Soft delete

Soft-delete removes ability to select the contract in dropdowns but keeps the record for audit.

### Indexes

```sql
CREATE INDEX idx_contracts_hospital_id ON contracts(hospital_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_contracts_type ON contracts(type);
```

### Webhook for expiration

Use a scheduled job (cron) to detect contracts expiring in 30 days and notify admin via email/Push:

```python
# Pseudocode
for contract in contracts.filter(
    end_date__lte=date.today() + timedelta(days=30),
    end_date__gt=date.today(),
    status='active'
):
    send_notification(
        to=contract.hospital.admins,
        subject=f"Contract '{contract.name}' expiring in {get_days_remaining(contract.end_date)} days"
    )
```

This keeps the expiry check server-side so the frontend doesn't have to calculate.