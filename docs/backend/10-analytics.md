# 10 · Analytics

Admin dashboards show revenue, patients, doctors, and specialties over time. Data is aggregated from consultations, doctors, and patients.

> **Frontend mapping:** `src/pages/admin/Dashboard.jsx` (network overview), `src/pages/admin/hospitals/view/DashboardTab.jsx` (per-hospital)

---

## 1. Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| `GET` | `/analytics/overview?period=1Y` | admin | Network-wide analytics. |
| `GET` | `/analytics/hospital/{id}?period=1M` | admin | Per-hospital analytics. |

---

## 2. Overview analytics

```
GET /v1/analytics/overview?period=1Y
```

| Param | Type | Description |
|---|---|---|
| `period` | enum | `1M`, `6M`, `1Y`. Default `1Y`. |

Returns the network-level dashboard data. The frontend `admin/Dashboard.jsx` displays:

- 4 stat cards: Total Patients, Total Revenue, Top Specialty, Active Regions
- 2 charts: Revenue Trend (stacked area) + Specialty Breakdown (donut) + Region-wise Patients (horizontal bar) + Top Doctors

### Response

```
200 OK
```

```json
{
  "period": "1Y",
  "date_from": "2025-06-10T00:00:00Z",
  "date_to": "2026-06-10T23:59:59Z",
  "stats": {
    "total_patients": { "value": 4218, "change": 12.4, "direction": "up" },
    "total_revenue": { "value": 386000000, "change": 18.2, "direction": "up", "formatted": "₹38.6L" },
    "top_specialty": { "value": "Cardiology", "points": 146 },
    "active_regions": { "value": 12, "change": 3, "direction": "up" }
  },
  "revenue_trend": {
    "x_axis": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    "opd": [1800000, 2400000, 1900000, 2800000, 3400000, 2900000, 3800000, 3500000, 4200000, 4800000, 4400000, 5200000],
    "ipd": [1200000, 1600000, 1400000, 2000000, 2400000, 2200000, 2800000, 2600000, 3000000, 3400000, 3200000, 3800000]
  },
  "specialty_breakdown": {
    "total": 509,
    "data": [
      { "specialty": "Cardiology", "patients": 146, "color": "#ef4444" },
      { "specialty": "Orthopedics", "patients": 98, "color": "#f59e0b" },
      { "specialty": "Neurology", "patients": 87, "color": "#8b5cf6" },
      { "specialty": "Oncology", "patients": 73, "color": "#ec4899" },
      { "specialty": "Pediatrics", "patients": 61, "color": "#ec4899" },
      { "specialty": "Radiology", "patients": 44, "color": "#06b6d4" }
    ]
  },
  "region_patients": [
    { "region": "Maharashtra", "patients": 940, "revenue": 92000000, "change": 14 },
    { "region": "Delhi NCR", "patients": 812, "revenue": 81000000, "change": 11 },
    { "region": "Karnataka", "patients": 674, "revenue": 68000000, "change": 19 },
    { "region": "Tamil Nadu", "patients": 531, "revenue": 54000000, "change": 8 },
    { "region": "Gujarat", "patients": 445, "revenue": 46000000, "change": 16 },
    { "region": "West Bengal", "patients": 388, "revenue": 39000000, "change": 7 }
  ],
  "top_doctors": [
    { "rank": 1, "name": "Dr. Priya Sharma", "specialty": "Cardiology", "points": 148, "rating": 4.9, "is_top_performer": true },
    { "rank": 2, "name": "Dr. Arjun Mehta", "specialty": "Neurology", "points": 124, "rating": 4.8 },
    { "rank": 3, "name": "Dr. Kavya Iyer", "specialty": "Orthopedics", "points": 117, "rating": 4.9 },
    { "rank": 4, "name": "Dr. Rohan Gupta", "specialty": "Oncology", "points": 103, "rating": 4.7 },
    { "rank": 5, "name": "Dr. Meena Verma", "specialty": "Pediatrics", "points": 96, "rating": 4.8 }
  ]
}
```

### Calculation SQL (revenue)

```sql
-- Total patients
SELECT COUNT(DISTINCT patient_id) FROM consultations 
WHERE created_at >= ? AND created_at < ? AND status IN ('paid', 'assigned', 'in_progress', 'completed');

-- Total revenue
SELECT SUM(amount) FROM consultations 
WHERE created_at >= ? AND created_at < ? AND status IN ('paid', 'assigned', 'in_progress', 'completed');

-- OPD vs IPD revenue
SELECT 
  EXTRACT(MONTH FROM created_at) AS month,
  SUM(CASE WHEN type = 'opd' THEN amount ELSE 0 END) AS opd,
  SUM(CASE WHEN type = 'ipd' THEN amount ELSE 0 END) AS ipd
FROM consultations
WHERE created_at >= ? AND created_at < ? AND status IN ('paid', 'assigned', 'in_progress', 'completed')
GROUP BY month;
```

---

## 3. Per-hospital analytics

```
GET /v1/analytics/hospital/{id}?period=1M
```

| Param | Type | Description |
|---|---|---|
| `period` | enum | `1W`, `1M`, `3M`, `YTD`. Default `1M`. |

Returns per-hospital dashboard data from `src/pages/admin/hospitals/view/DashboardTab.jsx`.

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
      { "name": "Dr. Sharma", "specialty": "Cardiology", "patients": 58, "color": "#ef4444" },
      { "name": "Dr. Mehta", "specialty": "Neurology", "patients": 44, "color": "#8b5cf6" },
      { "name": "Dr. Kapoor", "specialty": "Orthopedics", "patients": 39, "color": "#f59e0b" },
      { "name": "Dr. Verma", "specialty": "Pediatrics", "patients": 35, "color": "#ec4899" },
      { "name": "Dr. Gupta", "specialty": "ICU", "patients": 52, "color": "#ef4444" },
      { "name": "Dr. Iyer", "specialty": "Radiology", "patients": 28, "color": "#06b6d4" },
      { "name": "Dr. Singh", "specialty": "Gynecology", "patients": 46, "color": "#ec4899" }
    ]
  },
  "top_doctors": [
    { "rank": 1, "name": "Dr. Sharma", "specialty": "Cardiology", "patients": 58, "is_top_performer": true },
    { "rank": 2, "name": "Dr. Gupta",  "specialty": "ICU", "patients": 52 },
    { "rank": 3, "name": "Dr. Singh",  "specialty": "Gynecology", "patients": 46 },
    { "rank": 4, "name": "Dr. Mehta",  "specialty": "Neurology", "patients": 44 },
    { "rank": 5, "name": "Dr. Kapoor", "specialty": "Orthopedics", "patients": 39 }
  ]
}
```

---

## 4. Implementation notes

### Time series data

Precompute and cache time series metrics to speed up dashboards. Use Redis or in-memory cache with TTL (5 minutes for freshness).

```python
@cache(ttl=300)
def get_overview_stats(period: str):
    # Precomputed view or query
    pass
```

### Region calculation

The frontend `regions` array is hardcoded from patient `state` fields. The backend maps patient `state` to region names:

```python
STATE_TO_REGION = {
    'Maharashtra': 'Maharashtra',
    'Delhi': 'Delhi NCR',
    'Karnataka': 'Karnataka',
    'Tamil Nadu': 'Tamil Nadu',
    'West Bengal': 'West Bengal',
    'Gujarat': 'Gujarat',
    'Rajasthan': 'Rajasthan',
    'Uttar Pradesh': 'Uttar Pradesh',
    'Telangana': 'Telangana',
    'Kerala': 'Kerala'
}
```

### Top performer logic

A doctor is "top performer" if:
- Top 5 in points AND rating ≥ 4.8
- OR if the frontend badge is shown (the frontend logic, not a backend field)

### Volume thresholds

- `change` < 2%: gray arrow
- `change` ≥ 2% and up: green arrow
- `change` ≤ -2%: red arrow

### Data freshness

For production, the dashboard should:
1. **Cache**: 5 minutes in Redis
2. **Precompute**: Scheduled job nightly at 2 AM
3. **Trigger refresh**: When a consultation status changes, invalidate the relevant cache keys

### Aggregation views

Materialized views for performance:

```sql
CREATE MATERIALIZED VIEW mv_revenue_monthly AS
SELECT
  hospital_id,
  EXTRACT(YEAR FROM created_at) AS year,
  EXTRACT(MONTH FROM created_at) AS month,
  SUM(amount) AS total,
  SUM(CASE WHEN type = 'opd' THEN amount ELSE 0 END) AS opd,
  SUM(CASE WHEN type = 'ipd' THEN amount ELSE 0 END) AS ipd
FROM consultations
GROUP BY hospital_id, year, month;

CREATE MATERIALIZED VIEW mv_specialty_monthly AS
SELECT
  EXTRACT(YEAR FROM created_at) AS year,
  EXTRACT(MONTH FROM created_at) AS month,
  specialty,
  COUNT(*) AS count,
  SUM(amount) AS revenue
FROM consultations
JOIN doctors ON doctor_id = doctors.id
GROUP BY year, month, specialty;
```

---

## 5. Time ranges

### Overview (`analytics/overview`)

| Period | Date range | X axis |
|---|---|---|
| `1M` | Last 30 days | Jan–Dec (days populated) |
| `6M` | Last 180 days | Jan–Dec (months populated) |
| `1Y` | Last 365 days | Jan–Dec (all months) |

### Hospital (`analytics/hospital/{id}`)

| Period | Date range | X axis |
|---|---|---|
| `1W` | Last 7 days | Week days |
| `1M` | Last 30 days | Jan–Dec (last 30 days) |
| `3M` | Last 90 days | Jan–Dec (last 90 days) |
| `YTD` | Jan 1 → today | Jan–Dec (populated to current) |

### Revenue normalization

All revenue is in **paise** (integers). The frontend formats using `Intl.NumberFormat`:
- Network dashboard: ₹LAKH format (e.g., `₹38.6L`)
- Hospital dashboard: ₹LAKH format (e.g., `₹2.4L`)

### Time zone

All timestamps are **UTC**. The frontend converts to user's local time for display.