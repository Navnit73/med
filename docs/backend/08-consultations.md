# 08 · Consultations

A `Consultation` is the core booking entity. It's created when a patient completes the registration wizard and pays. One consultation may involve one or more doctors (single expert vs. panel).

> **Frontend mapping:** Patient registration wizard (`src/pages/patient/Registration.jsx`), patient dashboard (`/patient`), admin consultation list (`/hospitals/:id/consultations` or `/consultations`).

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `POST` | `/consultations` | patient | Create consultation (pay → book). |
| `GET` | `/consultations/me` | patient | List own consultations. |
| `GET` | `/consultations` | admin | List all consultations (network or hospital-scoped). |
| `GET` | `/consultations/{id}` | — | Get one consultation. |
| `PATCH` | `/consultations/{id}` | admin | Update consultation status/details. |
| `POST` | `/consultations/{id}/cancel` | patient or admin | Cancel a consultation. |
| `POST` | `/consultations/{id}/payment` | patient | Initiate payment (Razorpay order). |
| `POST` | `/consultations/{id}/payment/verify` | patient | Verify payment webhook signature. |
| `GET` | `/consultations/{id}/summary-pdf` | patient or admin | Generate/download case summary PDF. |

---

## 2. Consultation entity

```ts
Consultation {
  id:                     UUID          // PK
  patient_id:            UUID          // FK -> patients.id
  hospital_id:           UUID          // FK -> hospitals.id

  // Intent & type
  intent:                 "expert_opinion" | "caselet"
  consult_type:           "single" | "multiple"
  status:                 "pending_payment" | "paid" | "assigned" | "in_progress" | "completed" | "cancelled" | "refunded"

  // Doctors
  doctor_ids:             UUID[]        // 1 for single, N for panel
  primary_doctor_id:      UUID | null   // whichever is treating
  assigned_at:            DateTime | null

  // Documents
  document_ids:           UUID[]        // FK -> uploads.id

  // Timeline
  next_action_due_at:     DateTime | null
  completed_at:           DateTime | null

  // Payment
  amount:                 number        // total in paise (doctor_fees + platform_fee)
  doctor_fees:             number        // in paise (doctor_fee × doctor_count)
  platform_fee:           number        // in paise (default ₹200)
  payment_method:         "upi" | "card" | "netbanking" | null
  payment_id:             string | null // Razorpay order_id/payment_id

  // AI summary
  ai_summary:              string | null
  ai_summary_generated_at: DateTime | null

  // Timestamps
  created_at:            DateTime
  updated_at:            DateTime
  deleted_at:            DateTime | null
}
```

### Intent and consult type

| Intent | Meaning |
|---|---|
| `expert_opinion` | Patient wants a second opinion from a specialist. |
| `caselet` | Patient wants a medical summary created from uploaded records. |

| Consult type | Meaning |
|---|---|
| `single` | 1 doctor. |
| `multiple` | Panel, 2–5 doctors. |

The frontend shows `expert_opinion` = "Expert Second Opinion" (with "Most Popular" badge) and `caselet` = "Create Medical Summary". The pay screen shows the breakdown: `doctor_fees = 1500 × doctor_count`, `platform_fee = 200`, `total = doctor_fees + platform_fee`.

---

## 3. Create consultation

```
POST /v1/consultations
```

Called after the patient selects doctors and clicks "Pay" on step 5 of the wizard. The body contains the full wizard state (compressed for the API — the backend saves the parts it needs).

### Request (patient wizard step 5)

```json
{
  "patient_id": "550e8400-e29b-41d4-a716-446655440002",
  "intent": "expert_opinion",
  "consult_type": "multiple",
  "doctor_ids": [
    "550e8400-e29b-41d4-a716-446655440200",
    "550e8400-e29b-41d4-a716-446655440201"
  ],
  "document_ids": [
    "550e8400-e29b-41d4-a716-446655440900"
  ],
  "ai_summary_requested": true
}
```

The frontend wizard state has:

- Step 2 (`intent`): "expert" (→ `expert_opinion`) or "caselet" (→ `caselet`)
- Step 3 (`document_ids`): Uploaded document IDs from `/uploads`
- Step 4 (`doctor_ids`, `consult_type`): Selected doctor IDs from the hardcoded `indianDoctors` array in the frontend

### Response

```
201 Created
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440500",
  "patient_id": "550e8400-e29b-41d4-a716-446655440002",
  "hospital_id": "550e8400-e29b-41d4-a716-446655440003",
  "intent": "expert_opinion",
  "consult_type": "multiple",
  "status": "pending_payment",
  "doctor_ids": [
    "550e8400-e29b-41d4-a716-446655440200",
    "550e8400-e29b-41d4-a716-446655440201"
  ],
  "amount": 320000,
  "doctor_fees": 300000,
  "platform_fee": 20000,
  "created_at": "2026-06-10T08:14:22.103Z"
}
```

The response includes `amount`, `doctor_fees`, `platform_fee`. The frontend displays these for the patient to confirm, then calls `/consultation/{id}/payment` to get a Razorpay order.

### Validation

- `patient_id`: must belong to the authenticated user.
- `intent`: one of `expert_opinion`, `caselet`.
- `consult_type`: one of `single`, `multi`.
- `doctor_ids`:
  - For `single`: exactly 1 UUID.
  - For `multi`: 2–5 UUIDs.
- All `doctor_ids` must exist in the hospital (selected from the wizard, but validated server-side).
- At least one of `doctor_ids` or `document_ids` must be present.
- For `caselet`, documents are required.

### Flow

1. **Patient creates consultation** (`POST /consultations`) → returns `pending_payment`.
2. **Patient initiates payment** (`POST /consultations/{id}/payment`) → returns Razorpay order.
3. **Patient pays on Razorpay** (UI) → Razorpay webhook fires (`POST /webhooks/razorpay`).
4. **Patient optionally verifies** (`POST /consultations/{id}/payment/verify`) — rare, most flow is webhook-based.
5. On webhook verify → status → `paid` → assign doctors → status → `assigned`.

---

## 4. Initiate payment

```
POST /v1/consultations/{id}/payment
```

Creates a Razorpay order and returns the checkout payload. The frontend uses Razorpay Checkout (UI/JS) to display the payment modal.

### Request

(no body — auth determines patient)

### Response

```
200 OK
```

```json
{
  "consultation_id": "550e8400-e29b-41d4-a716-446655440500",
  "order_id": "order_1a2b3c4d5e6f",
  "amount": 320000,
  "currency": "INR",
  "key": "rzp_live_...",
  "checkout_url": "https://rzp.io/live/...",
  "notes": {
    "consultation_id": "550e8400-e29b-41d4-a716-446655440500",
    "patient_id": "550e8400-e29b-41d4-a716-446655440002",
    "intent": "expert_opinion"
  }
}
```

The frontend opens `checkout_url` in a modal or iframe, or uses Razorpay.js to embed. On payment completion, Razorpay triggers a webhook to `/webhooks/razorpay`.

---

## 5. Verify payment

```
POST /v1/consultations/{id}/payment/verify
```

Client-side verification after successful payment (optional, webhook is the source of truth). Used by apps that can't receive webhooks reliably.

### Request

```json
{
  "razorpay_payment_id": "pay_1a2b3c4d5e6f",
  "razorpay_order_id": "order_1a2b3c4d5e6f",
  "razorpay_signature": "..."
}
```

### Response

```
200 OK
```

```json
{
  "status": "paid",
  "payment_id": "pay_1a2b3c4d5e6f",
  "message": "Payment verified. Consultation assigned to doctors."
}
```

---

## 6. List own consultations (patient)

```
GET /v1/consultations/me?status=in_progress&q=cardio
```

### Response

```
200 OK
```

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440500",
      "intent": "expert_opinion",
      "consult_type": "multiple",
      "status": "in_progress",
      "doctors": [
        { "id": "dr-rajesh-kumar", "name": "Dr. Rajesh Kumar", "specialty": "Oncology" },
        { "id": "dr-priya-sharma", "name": "Dr. Priya Sharma", "specialty": "Cardiology" }
      ],
      "ai_summary": "Elevated lipids detected. Statins 10mg recommended...",
      "amount": 320000,
      "created_at": "2026-06-10T08:14:22.103Z",
      "next_action_due_at": "2026-06-12T08:14:22.103Z"
    }
  ],
  "pagination": { "page": 1, "per_page": 20, "total": 1, "total_pages": 1, "has_next": false, "has_prev": false }
}
```

---

## 7. List consultations (admin)

```
GET /v1/consultations?hospital_id=...&status=pending_payment&page=1&per_page=20
```

Returns network-wide or hospital-scoped list based on admin's scope. Filters: `hospital_id`, `patient_id`, `doctor_id`, `status`, `intent`, `date_from`, `date_to`, `q` (on patient name, doctor, intent).

### Response (admin)

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440500",
      "patient": { "mrn": "MRN-10000", "name": "John Doe", "phone": "+919876543210" },
      "hospital": { "id": "...", "name": "Apollo" },
      "intent": "expert_opinion",
      "consult_type": "multiple",
      "status": "in_progress",
      "doctor_ids": [...],
      "amount": 320000,
      "payment_method": "upi",
      "created_at": "2026-06-10T08:14:22.103Z"
    }
  ],
  "pagination": { ... }
}
```

---

## 8. Cancel consultation

```
POST /v1/consultations/{id}/cancel
```

Patient cancels their own consultation, or admin cancels any in scope.

### Request

```json
{
  "reason": "Patient requested cancellation"
}
```

### Response

```
200 OK
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440500",
  "status": "cancelled",
  "cancelled_at": "2026-06-10T09:00:00Z",
  "refund_amount": 320000
}
```

- Cancellation is allowed **only** if status is `pending_payment`, `paid`, or `assigned`. Not allowed after `in_progress` or `completed`.
- If paid, a refund is triggered via Razorpay (async). The `refund_amount` field indicates partial or full.

---

## 9. Get summary PDF

```
GET /v1/consultations/{id}/summary-pdf
```

Generates a PDF summary of the consultation and associated records. Matches the static asset `public/patient_summary.pdf` in the frontend.

### Response

```
200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="Caselet-MRN-10000.pdf"

<PDF bytes>
```

Or redirects to a generated presigned S3 URL:

```
200 OK
X-Signed-Url: https://cdn.medexpert.in/summaries/500.pdf?X-Amz-Expires=3600
```

### PDF contents

The PDF contains:
- Patient demographics (name, MRN, DOB, gender)
- Chief complaint and history
- Doctor opinions (each doctor's response)
- Document list + AI summary (if generated)
- Timestamp and MedExpert branding

---

## 10. AI summary generation

Called by `POST /ai/summarize` (see [`09-documents-and-uploads.md`](./09-documents-and-uploads.md)), or automatically after payment if `ai_summary_requested: true` on the consultation:

```python
async def generate_ai_summary(consultation_id: UUID):
    docs = await get_uploads(consultation.document_ids)
    response = await openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a medical summary assistant..."},
            {"role": "user", "content": f"Documents: {docs}"}
        ]
    )
    summary = response.choices[0].message.content
    await db.consultations.update(
        id=consultation_id,
        ai_summary=summary,
        ai_summary_generated_at=datetime.utcnow()
    )
    return summary
```

The frontend's "Generate AI Summary" button triggers this on step 3 of the wizard. The summary is stored in `consultation.ai_summary`.

---

## 11. Implementation notes

### Payment flow with Razorpay

1. **Create order** (`POST /consultations/{id}/payment`):
   ```python
   order = razorpay.order.create({
       "amount": amount,
       "currency": "INR",
       "notes": {"consultation_id": id}
   })
   ```

2. **Webhook** (`POST /webhooks/razorpay`):
   ```python
   # Verify signature
   razorpay.utility.verify_webhook_signature(
       request.body,
       webhook_signature,
       RAZORPAY_WEBHOOK_SECRET
   )
   # Update consultation status
   await db.consultations.update(
       id=payload["notes"]["consultation_id"],
       status="paid",
       payment_id=payload["payment_id"]
   )
   ```

3. **Assign doctors** (on status=paid):
   ```python
   # Notify assigned_doctor_ids via SMS/email
   # Set next_action_due_at = now() + 48h
   ```

### Idempotency

All payment endpoints must include `Idempotency-Key` header. The order creation is idempotent.

### Refund

If consultation is cancelled after payment:
```python
refund = razorpay.refund.create({
    "payment_id": payment_id,
    "amount": amount  # full or partial
})
```

### Doctor ID alignment

The frontend's `indianDoctors` array (5 hardcoded doctors in step 4) is different from the backend's `doctors` table. The backend must map:

- Frontend doctor ID → backend doctor ID (by matching name, or by creating stub doctor records)
- Or: On consultation create, the backend resolves name-based doctors to real `doctors` table entries

**Recommendation:** The registration wizard's doctors should come from `/doctors` not hardcoded, so there's a 1:1 mapping. The backend can fallback to creating stub doctors if needed.

### Schedule calculation

```python
async def assign_doctor(consultation):
    for doctor_id in consultation.doctor_ids:
        await notify_doctor(doctor_id, consultation)
        await update_doctor_availability(doctor_id, booking_date)
    # next_action_due_at defaults to 48h from now()
```

### Status lifecycle

```
pending_payment → paid → assigned → in_progress → completed
                  ↘ cancelled / refunded
```

No transitions to `completed` are allowed from `pending_payment`. The backend enforces this in `PATCH`.