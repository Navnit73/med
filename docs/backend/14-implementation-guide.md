# 14 · Implementation Guide

FastAPI project setup, dependencies, development workflow, deployment, and running instructions for the MedExpert backend.

---

## 1. Project layout

```
medexpert-backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app factory + CORS, JWT
│   ├── config.py         # Pydantic settings
│   ├── dependencies.py   # auth: verify_token, JWT dependency
│   ├── security.py       # password hashing, OTP handling
│   ├── api/              # API module grouping
│   │   ├── __init__.py
│   │   ├── auth.py       # auth endpoints (/auth/*)
│   │   ├── patients.py   # /patients
│   │   ├── doctors.py    # /doctors
│   │   ├── hospitals.py  # /hospitals
│   │   ├── consultations.py
│   │   ├── departments.py
│   │   ├── contracts.py
│   │   ├── uploads.py
│   │   ├── analytics.py
│   │   ├── webhooks.py
│   │   └── public/       # public routes (no auth)
│   ├── core/             # DB, Redis, AI, SMS, payments
│   │   ├── __init__.py
│   │   ├── database.py   # SQLAlchemy, sessionmaker
│   │   ├── redis.py      # redis client
│   │   ├── sms.py        # Twilio/MSG91 integration
│   │   ├── ai.py         # OpenAI integration
│   │   └── payments.py   # Razorpay client
│   ├── crud/             # Data access layer (queries)
│   │   ├── __init__.py
│   │   ├── base.py       # BaseCRUD
│   │   ├── users.py
│   │   ├── patients.py
│   │   ├── doctors.py
│   │   ├── hospitals.py
│   │   ├── departments.py
│   │   ├── contracts.py
│   │   ├── uploads.py
│   │   └── consultations.py
│   ├── schemas/           # Pydantic schemas per model
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── auth.py
│   │   ├── users.py
│   │   ├── patients.py
│   │   ├── doctors.py
│   │   ├── hospitals.py
│   │   ├── departments.py
│   │   ├── contracts.py
│   │   ├── uploads.py
│   │   └── consultations.py
│   └── models/           # SQLAlchemy models (database.py)
│       ├── __init__.py
│       ├── base.py
│       ├── user.py
│       ├── patient.py
│       ├── doctor.py
│       ├── hospital.py
│       ├── department.py
│       ├── contract.py
│       ├── upload.py
│       └── consultation.py
├── alembic/              # DB migrations
│   ├── versions/
│   ├── env.py
│   ├── script.py.mako
│   └── alembic.ini
├── tests/                # pytest
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   └── integration/
├── scripts/              # utils
│   └── seed.py           # populate DB with test data
├── .env.example
├── .env.local
├── requirements.txt
├── uvicorn.conf.py       # Uvicorn config (gunicorn in prod)
└── main.py               # entry point
```

---

## 2. Dependencies

### `requirements.txt`

```txt
# Core
fastapi==0.104.1
uvicorn[standard]==0.24.0
gunicorn==21.2.0

# DB & ORM
sqlalchemy[asyncio]==2.0.23
alembic==1.13.0
psycopg2-binary==2.9.9  # for local dev

# Auth
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6

# Utilities
pydantic==2.5.0
pydantic-settings==2.1.0
pydantic[email-validator]==2.5.0
python-dateutil==2.8.2
PyJWT==2.8.0
jinja2==3.1.2  # for email templates

# External services
twilio==8.11.0
msg91-python==0.0.10
boto3==1.34.0  # S3
openai==1.3.7  # AI summaries
razorpay==2.9.1

# Rate limiting
slowapi==0.1.9
fastapi-limiter==0.1.5

# Monitoring
prometheus-client==0.19.0
structlog==23.2.0

# Dev
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0
httpx==0.25.2
pre-commit==3.5.0

# Typing
typing-extensions==4.9.0
```

---

## 3. Environment setup

### `.env.example`

```env
# Config
ENV=development
DEBUG=true

# Database
DATABASE_URL=postgresql+asyncpg://medexpert:password@localhost:5432/medexpert

# Redis
REDIS_URL=redis://localhost:6379/0

# Auth
JWT_SECRET=change-me-in-prod-jwt-secret-at-least-256-bits-long
JWT_ALG=HS256
JWT_ACCESS_TTL=900
JWT_REFRESH_TTL=2592000

# OTP
OTP_TTL=300
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=5
OTP_LOCKOUT_SECONDS=900

# SMS provider
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+919999999999
# Or for MSG91:
MSG91_AUTH_KEY=xxx
MSG91_SENDER_ID=MEDEXP
MSG91_ROUTE=4

# S3 storage
S3_BUCKET=medexpert-uploads
S3_REGION=ap-south-1
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_ENDPOINT_URL=https://s3.amazonaws.com

# Payments
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# AI
OPENAI_API_KEY=sk-xxx  # Optional; if not set, returns mock summaries

# Logging
LOG_LEVEL=INFO
```

### `.env.local` (gitignored)

```env
# Override for local dev
DATABASE_URL=postgresql+asyncpg://medexpert:password@localhost:5432/medexpert
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=local-dev-secret-123
```

---

## 4. Implementation checklist

### Database setup

```bash
# Install dependencies
pip install -r requirements.txt

# Create DB
createdb medexpert

# Run migrations
alembic upgrade head

# Seed test data
python scripts/seed.py
```

### Run dev server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access docs at http://localhost:8000/docs

### Test

```bash
# Run unit tests
pytest tests/unit/

# Run integration tests (with live DB)
pytest tests/integration/

# Run all with coverage
pytest --cov=app --cov-report=html
```

---

## 5. Key files walkthrough

### `app/config.py`

```python
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    env: str = "development"
    debug: bool = False
    
    # Database
    database_url: str
    redis_url: str
    
    # Auth
    jwt_secret: str = "change-me-in-prod"
    jwt_alg: str = "HS256"
    jwt_access_ttl: int = 900  # 15 min
    jwt_refresh_ttl: int = 2592000  # 30 days
    
    # External
    sms_provider: str = "twilio"
    razorpay_key_id: str
    razorpay_key_secret: str
    razorpay_webhook_secret: str
    
    @lru_cache()
    def get_redis(self) -> redis.Redis:
        import redis
        return redis.Redis.from_url(self.redis_url)
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### `app/security.py`

```python
from passlib.context import CryptContext
from datetime import timedelta

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def generate_otp(length: int = 6) -> str:
    import secrets
    digits = "0123456789"
    return ''.join(secrets.choice(digits) for _ in range(length))

def store_otp(phone: str, otp: str, ttl: int):
    redis = settings.get_redis()
    redis.set(f"otp:{phone}", hash_password(otp), ex=ttl)
    redis.set(f"otp:{phone}:lock", "0", ex=ttl)  # reset lock
    redis.set(f"otp:{phone}:failures", "0", ex=ttl)

def verify_otp(phone: str, otp: str) -> bool:
    redis = settings.get_redis()
    stored_hash = redis.get(f"otp:{phone}")
    if not stored_hash:
        return False
    
    # Check lock
    if redis.get(f"otp:{phone}:lock") == "1":
        return False
    
    return verify_password(otp, stored_hash)
```

### `app/dependencies.py`

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from .config import settings
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/otp/verify")

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_alg]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return {"user_id": user_id, "role": payload.get("role")}
    except JWTError:
        raise credentials_exception

async def require_patient(user = Depends(get_current_user)):
    if user["role"] != "patient":
        raise HTTPException(403, detail={"code": "forbidden", "message": "Patient access required"})
    return user

async def require_admin(user = Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(403, detail={"code": "forbidden", "message": "Admin access required"})
    return user

async def require_super_admin(user = Depends(require_admin)):
    if not is_super_admin(user["user_id"]):  # check in DB
        raise HTTPException(403, detail={"code": "forbidden", "message": "Super admin required"})
    return user
```

### `app/api/auth.py`

```python
from fastapi import APIRouter, Depends, HTTPException, status
from ...schemas.auth import OTPRequest, OTPVerify, UserResponse
from ...crud.users import create_user, get_user_by_phone
from ...security import hash_password, generate_otp, store_otp

router = APIRouter()

@router.post("/otp/request")
async def request_otp(request: OTPRequest):
    # Validate phone format
    if not re.match(r'^\+91[1-9]\d{9}$', request.phone):
        raise HTTPException(400, detail={"code": "invalid_phone", "message": "Phone must be +91 followed by 10 digits"})
    
    # Generate and store OTP
    otp = generate_otp(6)
    store_otp(request.phone, otp, settings.otp_ttl)
    
    # Send via Twilio/MSG91
    await send_otp(request.phone, otp)
    
    return {"ok": True, "message": "OTP sent successfully", "expires_in_seconds": settings.otp_ttl}

@router.post("/otp/verify")
async def verify_otp(request: OTPVerify):
    phone, otp = request.phone, request.otp
    
    # Verify OTP
    if not verify_otp(phone, otp):
        # Increment failure count
        handle_otp_failure(phone)
        raise HTTPException(400, detail={"code": "invalid_code", "message": "Invalid OTP code"})
    
    # Get or create user
    user = await get_user_by_phone(phone)
    if not user:
        user = await create_user(phone, request.role)
    
    # Issue tokens
    access_token = create_access_token({"sub": user.id, "role": user.role})
    refresh_token = create_refresh_token({"sub": user.id, "role": user.role})
    
    return {
        "user": UserResponse.from_orm(user),
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "Bearer"
    }
```

---

## 6. Testing

### `tests/conftest.py`

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.database import database, engine
from alembic import command
import os

@pytest.fixture(scope="session")
def client():
    # Run migrations
    command.upgrade('head')
    
    with TestClient(app) as c:
        yield c
    
    # Cleanup on session end
    command.downgrade('base')
```

### `tests/test_auth.py`

```python
def test_login_flow(client):
    # Request OTP
    resp = client.post("/v1/auth/otp/request", json={"phone": "+919876543210"})
    assert resp.status_code == 200
    
    # Verify (mock)
    resp = client.post("/v1/auth/otp/verify", json={"phone": "+919876543210", "otp": "123456", "role": "patient"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()

def test_refresh_token(client):
    # ... 
```

### `tests/integration/test_consultations.py`

```python
async def test_create_consultation(client, patient_id, doctor_id):
    resp = client.post("/v1/consultations", json={
        "patient_id": patient_id,
        "intent": "expert_opinion",
        "consult_type": "single",
        "doctor_ids": [doctor_id]
    }, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 201
    assert resp.json()["status"] == "pending_payment"
```

---

## 7. Deployment

### Production settings (`.env.production`)

```env
ENV=production
DEBUG=false
DATABASE_URL=postgresql+asyncpg://user:pass@db:5432/medexpert
REDIS_URL=redis://redis:6379/0
JWT_SECRET=prod-long-secret-256-bits-min
RAZORPAY_KEY_ID=rzp_live_xxx
S3_ENDPOINT_URL=https://s3.amazonaws.com
LOG_LEVEL=INFO
```

### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "-c", "uvicorn.conf.py", "app.main:app"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis
    environment:
      - DATABASE_URL=postgresql+asyncpg://medexpert:password@db:5432/medexpert
      - REDIS_URL=redis://redis:6379/0
  
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: medexpert
      POSTGRES_PASSWORD: password
      POSTGRES_DB: medexpert
    volumes:
      - pgdata:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

### Uvicorn config (`uvicorn.conf.py`)

```python
from gunicorn.app.base import BaseApplication
from gunicorn.config import Config

class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.options = options or {}
        self.application = app
        super().__init__(options)

    def load_config(self):
        config = {
            key: value
            for key, value in self.options.items()
            if key in Config and value is not None
        }
        for key, value in config.items():
            self.set(key, value)

    def load(self):
        return self.application

if __name__ == "__main__":
    options = {
        "bind": "0.0.0.0:8000",
        "workers": 4,
        "worker_class": "uvicorn.workers.UvicornWorker",
        "accesslog": "-",
        "errorlog": "-",
    }
    StandaloneApplication(app.main.app, options).run()
```

---

## 8. Monitoring and logging

### Structured logging

```python
import structlog

logger = structlog.get_logger()
logger.info("Created user", user_id=user.id, phone=user.phone)
```

### Prometheus metrics

```python
from prometheus_client import Counter, Histogram

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests')
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    REQUEST_COUNT.inc()
    start_time = time.time()
    response = await call_next(request)
    REQUEST_DURATION.observe(time.time() - start_time)
    return response
```

---

## 9. Post-launch checklist

### Security
- [ ] Change all default secrets
- [ ] Set up rate limiting in production
- [ ] Implement HTTPS with proper certs
- [ ] Set up audit logging for admin actions
- [ ] Configure firewall rules

### Performance
- [ ] Set up Redis for session/caching
- [ ] Add database connection pooling
- [ ] Implement CDN for static assets
- [ ] Set up async background workers (Celery/RQ)
- [ ] Precompute analytics in batches

### Monitoring
- [ ] Set up Grafana dashboard
- [ ] Configure alerts (Sentry, Datadog)
- [ ] Set up log aggregation (ELK)
- [ ] Track error rates and P99 response times

### Backup and recovery
- [ ] Configure automated database backups
- [ ] Set up daily backups to S3
- [ ] Document recovery procedures
- [ ] Test restore process

### User feedback
- [ ] Track user sign-ins via analytics
- [ ] Log front-end errors (Sentry)
- [ ] Monitor payment failure rates
- [ ] Track API usage quotas per customer

### Maintenance
- [ ] Schedule regular DB maintenance
- [ ] Plan major version upgrades
- [ ] Create runbook for critical failures
- [ ] Document all external service dependencies

---

## 10. Scaling considerations

### Read replicas
```sql
-- Read-only replica for analytics
CREATE DATABASE medexpert_replica;
ALTER USER medexpert REPLICATION;
```

### Database partitioning
```sql
-- Partition consultations by month
CREATE TABLE consultations_2026_01 PARTITION OF consultations
  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### Caching strategy
- Redis TTLs:
  - OTP keys: 5 min
  - API responses: 5 min (dashboards), 1 min (patient data)
  - Rate limits: 1 min
- Background jobs clear cache on write
- Use `fastapi-limiter` for HTTP rate limiting

### Horizontal scaling
- Stateless: Add more web workers
- Stateful: Use Redis cluster
- Database: Read replicas, sharding by hospital_id