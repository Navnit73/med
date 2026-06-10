# 11 · Webhooks

Webhooks allow external systems to notify MedExpert of events. Currently supported: Razorpay payments and SMS delivery status.

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `POST` | `/webhooks/razorpay` | None (sign-verified) | Payment status updates. |
| `POST` | `/webhooks/sms-status` | None (sign-verified) | SMS delivery receipts. |
| `GET` | `/webhooks` | super-admin | List active webhooks. |

---

## 2. Razorpay Webhook

```
POST /v1/webhooks/razorpay
```

Razorpay sends webhook events when payment states change: `payment.captured`, `payment.failed`, `payment.refunded`, etc.

### Event payloads

```json
// payment.captured (successful payment)
{
  "event": "payment.captured",
  "payload": {
    "payment_id": "pay_1a2b3c4d5e6f",
    "order_id": "order_1a2b3c4d5e6f",
    "amount": 320000,
    "currency": "INR",
    "status": "captured",
    "notes": {
      "consultation_id": "550e8400-e29b-41d4-a716-446655440500"
    }
  }
}

// payment.failed
{
  "event": "payment.failed",
  "payload": {
    "payment_id": "pay_fail_1x2y3z4w5v",
    "order_id": "order_1a2b3c4d5e6f",
    "amount": 320000,
    "currency": "INR",
    "status": "failed",
    "error_code": "905", // Insufficient funds
    "error_description": "Card Declined: Insufficient funds",
    "notes": {
      "consultation_id": "550e8400-e29b-41d4-a716-446655440500"
    }
  }
}

// payment.refunded
{
  "event": "payment.refunded",
  "payload": {
    "payment_id": "pay_1a2b3c4d5e6f",
    "order_id": "order_1a2b3c4d5e6f",
    "refund_id": "refund_1a2b3c4d5e6f",
    "amount": 320000,
    "currency": "INR",
    "status": "refunded",
    "notes": {
      "consultation_id": "550e8400-e29b-41d4-a716-446655440500"
    }
  }
}
```

### Signature verification

```python
import razorpay

def verify_signature(request_body, razorpay_signature):
    razorpay_key = os.getenv("RAZORPAY_KEY_ID")
    razorpay_instance = razorpay.Client(auth=(razorpay_key, os.getenv("RAZORPAY_KEY_SECRET")))
    razorpay.utility.verify_webhook_signature(
        request_body,
        razorpay_signature,
        os.getenv("RAZORPAY_WEBHOOK_SECRET")
    )
```

### Response

```
200 OK
```

Always return `200 OK` immediately to prevent retry. Process events asynchronously.

---

## 3. SMS Status Webhook

```
POST /v1/webhooks/sms-status
```

Used by SMS providers (Twilio, MSG91, Plivo) to send delivery status: `delivered`, `failed`, `undelivered`.

### Event payload

```json
{
  "provider": "twilio",
  "message_id": "SM1234567890abcdef1234567890abcdef",
  "to": "+919876543210",
  "status": "delivered",
  "timestamp": "2026-06-10T08:14:22.103Z",
  "error_code": null,
  "error_message": null,
  "original_request": {
    "consultation_id": "550e8400-e29b-41d4-a716-446655440500",
    "template": "consultation_booked",
    "recipients": ["+919876543210"]
  }
}
```

### Verification

Different providers have different signature verification. Twilio uses `X-Twilio-Signature` and `X-Twilio-Timestamp`.

```python
def verify_twilio_signature(request_body, twilio_signature):
    from twilio.util import build_validate_request_url
    url = build_validate_request_url(
        os.getenv("TWILIO_BASE_URL"),
        request_body,
        os.getenv("TWILIO_AUTH_TOKEN")
    )
    computed_signature = base64.b64encode(
        hmac.new(os.getenv("TWILIO_AUTH_TOKEN").encode(), url.encode(), hashlib.sha1).digest()
    ).decode()
    return computed_signature == twilio_signature
```

### Response

```
200 OK
```

---

## 4. Error handling and retries

- **Don't process if signature is wrong:** Return `403 Forbidden` but don't retry.
- **Log all events:** Store webhook events in `webhook_log` table:
  ```sql
  CREATE TABLE webhook_log (
    id UUID PRIMARY KEY,
    provider VARCHAR(32),
    event_type VARCHAR(32),
    payload JSONB,
    status VARCHAR(32), -- 'success', 'failed', 'retrying'
    error_message TEXT,
    created_at TIMESTAMP,
    retried_at TIMESTAMP,
    retries INT DEFAULT 0
  );
  ```
- **Retrying:** If processing fails (consultation not found), mark as `retrying` and retry after exponential backoff (30s, 1m, 5m, 10m, 30m, max). Stop after 6 retries and notify admins.

---

## 5. Implementation notes

### Order ID format

Razorpay `order_id` must include a prefix for the entity type:
```
order_medexpert_consultation_{consultation_id}
```

This allows lookup in the webhook.

### Consultation state machine

On `payment.captured`:
```python
# Find consultation by notes['consultation_id']
consultation = Consultation.get_by_id(payload['notes']['consultation_id'])
consultation.status = 'paid'
consultation.payment_id = payload['payment_id']
consultation.payment_method = 'upi'  # infer from order payment_method
consultation.assigned_at = datetime.utcnow()
db.session.commit()

# Notify doctor(s)
for doctor_id in consultation.doctor_ids:
    notify_doctor(doctor_id, consultation)

# Notify patient
notify_patient(consultation.patient_id, "consultation_booked")
```

On `payment.failed`:
```python
consultation.status = 'pending_payment'
notify_patient(consultation.patient_id, "payment_failed")
```

On `payment.refunded`:
```python
consultation.status = 'refunded'
notify_patient(consultation.patient_id, "consultation_refunded")
```

### Asynchronous processing

Use a task queue (Celery, RQ) for webhook processing to avoid blocking. Example task:

```python
@celery_app.task
def process_razorpay_webhook(event_type, payload, signature):
    try:
        if event_type == "payment.captured":
            handle_payment_captured(payload)
        elif event_type == "payment.failed":
            handle_payment_failed(payload)
        # ...
    except Exception as e:
        record_webhook_failure(event_type, payload, str(e))
        raise
```

### Monitoring

- Grafana dashboard showing webhook events/sec, failure rates, retry rates.
- Alert if webhook failures > 5% in 1h.
- Slack notification on webhook signature validation failures or excessive retries.