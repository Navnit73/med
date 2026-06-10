# 09 · Documents & Uploads

Files uploaded by patients (prescriptions, discharge summaries, blood reports, radiology scans, pathology reports, other) are stored in object storage (S3) and referenced by `upload_id` from patient records and consultations.

> **Frontend mapping:** `src/pages/patient/Registration.jsx` step 3 (Records), `POST /uploads`.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `POST` | `/uploads` | patient or admin | Upload a file (multipart). |
| `GET` | `/uploads/{id}` | patient or admin | Get upload metadata + download URL. |
| `DELETE` | `/uploads/{id}` | patient or admin | Soft-delete upload. |
| `POST` | `/ai/summarize` | patient or admin | Generate AI summary from upload IDs. |

---

## 2. Upload entity

```ts
Upload {
  id:              UUID         // PK
  owner_user_id:   UUID         // FK -> users.id, the uploader
  patient_id:      UUID | null  // FK -> patients.id, optional

  // File
  file_name:       string       // original name
  title:           string       // user-friendly title (e.g. "ECG Report 2026-05-12")
  type:            "prescription" | "discharge_summary" | "blood_report" | "radiology_scan" | "pathology_report" | "other"
  mime_type:       string       // detected MIME, e.g. "application/pdf"
  size_bytes:      number       // size in bytes
  s3_key:          string       // path in object storage
  s3_bucket:       string

  // Processing
  status:          "uploaded" | "processing" | "ready" | "failed"
  scan_status:     "pending" | "clean" | "infected" // virus scan
  ocr_text:        string | null // extracted text, nullable

  // Timestamps
  uploaded_at:     DateTime
  updated_at:      DateTime
  deleted_at:      DateTime | null
}
```

### Status flow

```
uploaded → processing (virus scan, OCR) → ready
                       ↓
                     failed (retry possible)
```

---

## 3. Upload a file

```
POST /v1/uploads
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | yes | The actual file (PDF, JPG, PNG). |
| `title` | string | yes | User-friendly title (1-200 chars). |
| `type` | enum | yes | One of 6 document types. |
| `patient_id` | UUID | optional | If attaching to a patient; auto-attached if patient is the requester. |

### Allowed MIME types

| Type | Allowed MIMEs | Max size |
|---|---|---|
| PDF | `application/pdf` | 20 MB |
| Image | `image/jpeg`, `image/png`, `image/webp` | 10 MB |
| Document | `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 10 MB |

Total: 20 MB per file.

### Request

```bash
curl -X POST https://api.medexpert.in/v1/uploads \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/prescription.pdf" \
  -F "title=Cardiology consult 2026-05-12" \
  -F "type=prescription" \
  -F "patient_id=550e8400-e29b-41d4-a716-446655440002"
```

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440900",
  "owner_user_id": "550e8400-e29b-41d4-a716-446655440001",
  "patient_id": "550e8400-e29b-41d4-a716-446655440002",
  "file_name": "prescription.pdf",
  "title": "Cardiology consult 2026-05-12",
  "type": "prescription",
  "mime_type": "application/pdf",
  "size_bytes": 142311,
  "status": "uploaded",
  "scan_status": "pending",
  "uploaded_at": "2026-06-10T08:14:22.103Z",
  "download_url": "https://cdn.medexpert.in/uploads/900?X-Amz-Expires=3600"
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Missing `file`, `title`, or `type`. |
| 413 | `payload_too_large` | File > 20MB. |
| 415 | `unsupported_media_type` | MIME not in allowlist. |
| 429 | `rate_limited` | More than 30 uploads per hour. |

---

## 4. Get upload metadata

```
GET /v1/uploads/{id}
```

Returns metadata and a fresh signed download URL.

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440900",
  "title": "Cardiology consult 2026-05-12",
  "type": "prescription",
  "file_name": "prescription.pdf",
  "size_bytes": 142311,
  "status": "ready",
  "scan_status": "clean",
  "uploaded_at": "2026-06-10T08:14:22.103Z",
  "download_url": "https://cdn.medexpert.in/uploads/900?X-Amz-Expires=3600&X-Amz-Signature=..."
}
```

### Errors

| Status | Code | Trigger |
|---|---|---|
| 403 | `forbidden` | Caller not owner or admin. |
| 404 | `not_found` | Upload does not exist. |

---

## 5. Download file

The `download_url` from `GET /uploads/{id}` is a presigned S3 URL valid for 1 hour. Direct download:

```
GET https://cdn.medexpert.in/uploads/900?X-Amz-Expires=3600&...
```

For programmatic access (admin tools, server-to-server), use:

```
GET /v1/uploads/{id}/raw
Authorization: Bearer <token>
```

Returns the file bytes (server-side fetches from S3 and streams).

### Response

```
200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="prescription.pdf"
Content-Length: 142311

<file bytes>
```

---

## 6. Soft-delete upload

```
DELETE /v1/uploads/{id}
```

### Response

```
204 No Content
```

The S3 object is marked for deletion (async job, 30 days retention). Soft-delete in DB is immediate.

---

## 7. AI summarize

```
POST /v1/ai/summarize
```

Generates a clinical AI summary from one or more uploaded documents. Frontend's "Generate AI Summary" button on step 3 of the registration wizard.

### Request

```json
{
  "upload_ids": [
    "550e8400-e29b-41d4-a716-446655440900",
    "550e8400-e29b-41d4-a716-446655440901"
  ],
  "patient_id": "550e8400-e29b-41d4-a716-446655440002",
  "consultation_id": null
}
```

### Response (sync if quick, async if slow)

```
200 OK
```

```json
{
  "summary": "Elevated lipids detected across recent blood reports (LDL 165 mg/dL). Patient currently on Statins 10mg. Past cardiac event noted in 2023. Recommend cardiology follow-up and possible dose adjustment.",
  "disclaimer": "AI-generated to assist physicians. Not a diagnosis.",
  "key_findings": [
    "Elevated LDL cholesterol (165 mg/dL)",
    "Statin therapy ongoing (10mg)",
    "Prior cardiac event in 2023"
  ],
  "referenced_uploads": [
    "550e8400-e29b-41d4-a716-446655440900",
    "550e8400-e29b-41d4-a716-446655440901"
  ],
  "generated_at": "2026-06-10T08:14:22.103Z"
}
```

If the call is slow (large files, network issues), the response is `202 Accepted`:

```
202 Accepted
```

```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655441000",
  "status": "processing",
  "estimated_wait_seconds": 30
}
```

The frontend polls `GET /v1/ai/summarize/{job_id}` until status is `ready`:

```
GET /v1/ai/summarize/{job_id}
```

```json
{
  "job_id": "...",
  "status": "ready",
  "summary": "...",
  "generated_at": "..."
}
```

If `consultation_id` is provided, the summary is **auto-attached** to the consultation (`consultation.ai_summary`).

### Errors

| Status | Code | Trigger |
|---|---|---|
| 400 | `validation_failed` | Empty `upload_ids`. |
| 502 | `upstream_unavailable` | OpenAI/AI provider error. |

---

## 8. Implementation notes

### S3 upload pattern

Two strategies:

**Direct browser-to-S3 (recommended):**

1. Client calls `POST /v1/uploads/initiate` (returns presigned PUT URL + s3_key + upload_id).
2. Client `PUT`s file to S3 directly.
3. Client calls `POST /v1/uploads/finalize { id, size, checksum }`.
4. Server triggers virus scan and OCR async.

**Server-proxied (simpler):**

1. Client calls `POST /v1/uploads` with multipart.
2. Server validates, streams to S3, saves metadata, triggers scan/OCR.
3. Returns 201 immediately.

For the MedExpert frontend (React + Vite SPA), **server-proxied** is simpler and works with any storage backend.

### Virus scan

Use ClamAV (open source) or AWS S3 Malware Detection. On `scan_status=infected`:
- Move file to quarantine
- Soft-delete the upload
- Notify uploader via email/SMS
- 422 error returned to client if scan completes during upload

### OCR (optional, for text-based documents)

Use AWS Textract or Tesseract. Extract text and store in `ocr_text` for search and AI summarization.

### File path convention

```
s3://medexpert-uploads/
  /patients/{patient_id}/{upload_id}.{ext}
  /doctors/{doctor_id}/profile.jpg
  /hospitals/{hospital_id}/logo.png
  /consultations/{consultation_id}/summary-{n}.pdf
  /contracts/{contract_id}/terms.pdf
```

### Allowlist

Server-side MIME detection (don't trust client MIME):
```python
import magic

def detect_mime(file: UploadFile) -> str:
    header = file.file.read(2048)
    file.file.seek(0)
    return magic.from_buffer(header, mime=True)
```

### Patient attachment

The frontend's `patient_id` field is optional. If not provided, the upload is owned by the user but not attached to a specific patient. The patient self-registration uses `POST /uploads` in step 3, where the user is auto-attached.

### File type check

```python
ALLOWED_TYPES = {
    "prescription":        ["application/pdf", "image/jpeg", "image/png"],
    "discharge_summary":   ["application/pdf", "image/jpeg", "image/png"],
    "blood_report":        ["application/pdf", "image/jpeg", "image/png"],
    "radiology_scan":      ["application/pdf", "image/jpeg", "image/png", "image/webp", "application/dicom"],
    "pathology_report":    ["application/pdf", "image/jpeg", "image/png"],
    "other":               ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
}
```

### AI summarization flow

1. Frontend calls `POST /ai/summarize` with `upload_ids`.
2. Server fetches uploads, extracts text (OCR or PDF parse).
3. Server calls OpenAI `gpt-4o` (or similar) with the medical context.
4. Server returns summary, saves to consultation if `consultation_id` provided.

The frontend's mock is a hardcoded 3-line text. The backend should:
- If `OPENAI_API_KEY` is set: call real LLM.
- Otherwise: return deterministic placeholder (so dev environments work without a key).
- Always include the disclaimer `"AI-generated to assist physicians. Not a diagnosis."`.

### Rate limit

30 uploads per hour per user. Use Redis `INCR uploads:{user_id}:hour` with TTL 3600.