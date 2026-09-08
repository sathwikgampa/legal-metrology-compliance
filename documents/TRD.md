# TRD — AI-Assisted Legal Metrology Compliance Inspection System
**Companion to PRD.md · Technical spec for a 2-4 person team, 20-hour MVP build**

---

## 1. Architecture

```
React (Vite, Tailwind, React Router, Axios, Lucide)
      ↓  (Clerk session token)
Clerk (auth)
      ↓
FastAPI (Uvicorn) — authorization + business logic
      ↓
┌─────────────┬──────────────┬────────────────┬───────────────┬──────────────┐
│ image_service│ ocr_service  │ extraction_svc │ compliance_svc│ evidence_svc │
│ (OpenCV)    │ (PaddleOCR)  │ (regex+YAML)   │ (rule engine) │ (findings)   │
└─────────────┴──────────────┴────────────────┴───────────────┴──────────────┘
      ↓
report_service (ReportLab / HTML)
      ↓
PyMongo
      ↓
MongoDB Atlas
```

No microservices — one FastAPI app, service modules by responsibility. Images and generated reports live on local filesystem for MVP (`/uploads`, `/reports`); paths only are stored in MongoDB.

### Backend layout
```
backend/
├── main.py
├── api/
│   ├── auth.py
│   ├── inspections.py
│   ├── images.py
│   ├── analysis.py
│   ├── compliance.py
│   ├── reports.py
│   └── dashboard.py
├── services/
│   ├── image_service.py       # OpenCV quality checks
│   ├── ocr_service.py         # PaddleOCR wrapper
│   ├── extraction_service.py  # field_patterns.yaml driven
│   ├── compliance_service.py  # rules.yaml driven engine
│   ├── evidence_service.py    # finding assembly
│   └── report_service.py
├── rules/
│   ├── rules.yaml
│   └── field_patterns.yaml
├── core/
│   ├── config.py              # env vars, thresholds
│   └── security.py            # Clerk token verification
└── db/
    └── mongo.py                # PyMongo client + collection accessors
```

### Person 2 (OCR/CV) scope — explicit boundary
Owns: `image_service.py`, `ocr_service.py`, quality thresholds, PaddleOCR integration, preprocessing (resize/grayscale/contrast/denoise), bounding box output, evidence image generation. **Does not own** `compliance_service.py` or `rules.yaml` — extraction output is a contract (see §3.3) that the rule engine consumes; the two can be built in parallel against that contract.

---

## 2. MongoDB Data Model

Embed where a document is always read/written together; separate collections where things are queried independently or grow unbounded.

```jsonc
// users  (mirrors Clerk identity, minimal)
{
  "_id": "clerk_user_id",
  "name": "Rahul Sharma",
  "role": "inspector",              // "inspector" | "admin"
  "created_at": ISODate
}

// inspections  (top-level document; embeds product + status, references images/findings)
{
  "_id": ObjectId,
  "inspection_code": "INS-2026-0001",
  "inspector_id": "clerk_user_id",
  "product": {
    "name": "ABC Detergent Powder",
    "brand": "ABC",
    "category": "HOUSEHOLD"          // manually selected; drives rule applicability
  },
  "status": "IN_PROGRESS",           // IN_PROGRESS | ANALYZED | REVIEWED | FINALIZED
  "final_status": null,              // COMPLIANT | NON_COMPLIANT | NEEDS_REVIEW | null
  "created_at": ISODate,
  "updated_at": ISODate
}

// product_images
{
  "_id": ObjectId,
  "inspection_id": ObjectId,
  "image_type": "FRONT",             // FRONT | BACK | SIDE
  "filename": "img_001.jpg",
  "path": "/uploads/INS-2026-0001/img_001.jpg",
  "quality": {
    "score": 0.87,
    "blur": false,
    "glare": true,
    "brightness_ok": true,
    "status": "WARNING"              // GOOD | WARNING | RETAKE
  },
  "uploaded_at": ISODate
}

// ocr_results  (raw OCR regions — one doc per image, embedded array of regions)
{
  "_id": ObjectId,
  "image_id": ObjectId,
  "inspection_id": ObjectId,
  "regions": [
    { "text": "MRP Rs. 120", "confidence": 0.96, "bbox": [100,200,300,250] },
    { "text": "Net Qty 500g", "confidence": 0.91, "bbox": [100,260,320,300] }
  ],
  "processed_at": ISODate
}

// declarations  (structured, normalized fields extracted from ocr_results)
{
  "_id": ObjectId,
  "inspection_id": ObjectId,
  "fields": {
    "MRP":            { "raw": "Rs. 120", "normalized": "120 INR", "confidence": 0.96, "image_id": ObjectId, "bbox": [100,200,300,250] },
    "NET_QUANTITY":    { "raw": "500g", "normalized": "500 g", "confidence": 0.91, "image_id": ObjectId, "bbox": [100,260,320,300] },
    "MANUFACTURER":    { "raw": null, "normalized": null, "confidence": 0.0, "image_id": null, "bbox": null },
    "CONSUMER_CARE":   { "raw": "1800-...", "normalized": "1800-...", "confidence": 0.42, "image_id": ObjectId, "bbox": [90,410,310,440] }
  }
}

// findings  (compliance engine output — one doc per inspection, embedded array)
{
  "_id": ObjectId,
  "inspection_id": ObjectId,
  "findings": [
    {
      "rule_id": "MRP",
      "status": "PASS",              // PASS | FAIL | REVIEW | NOT_APPLICABLE
      "explanation": "Detected and valid.",
      "confidence": 0.96,
      "value": "120 INR",
      "evidence": { "image_id": ObjectId, "bbox": [100,200,300,250] }
    },
    {
      "rule_id": "COUNTRY_OF_ORIGIN",
      "status": "NOT_APPLICABLE",
      "explanation": "Category HOUSEHOLD is not IMPORTED.",
      "confidence": null,
      "value": null,
      "evidence": null
    }
  ],
  "generated_at": ISODate
}

// inspector_decisions  (never overwrites findings; append-only per rule_id)
{
  "_id": ObjectId,
  "inspection_id": ObjectId,
  "rule_id": "CONSUMER_CARE",
  "ai_status": "REVIEW",
  "ai_confidence": 0.42,
  "decision": "CONFIRM",             // CONFIRM | REJECT | DEFER
  "inspector_id": "clerk_user_id",
  "comment": "Verified manually, number is correct.",
  "decided_at": ISODate
}

// reports
{
  "_id": ObjectId,
  "inspection_id": ObjectId,
  "path": "/reports/INS-2026-0001.pdf",
  "final_status": "COMPLIANT",
  "generated_at": ISODate
}
```

Index suggestions (create at setup, not an afterthought at hour 18): `inspections.inspection_code`, `inspections.product.name`, `product_images.inspection_id`, `findings.inspection_id`.

---

## 3. AI/CV Pipeline

### 3.1 Image Quality (OpenCV)
- **Blur:** variance of Laplacian below a threshold → flag blur.
- **Brightness:** mean pixel intensity outside an acceptable band → flag poor lighting.
- **Glare/overexposure:** proportion of near-white pixels above a threshold → flag glare.
- Combine into `quality_score` (simple weighted average is fine for MVP) → map to `GOOD` / `WARNING` / `RETAKE` via configured cutoffs (e.g. `≥0.8 GOOD`, `0.5–0.8 WARNING`, `<0.5 RETAKE`). Put cutoffs in `core/config.py`, not inline.
- A `RETAKE` image is stored but **not passed to OCR** unless the inspector explicitly proceeds anyway (store that override).

### 3.2 Preprocessing
Resize → grayscale → contrast enhancement (CLAHE) → denoise → (optional) sharpen/threshold, before PaddleOCR. Original image is always retained untouched for evidence display — preprocessing output is a working copy only.

### 3.3 OCR contract
`ocr_service.run(image_path) → List[{text: str, confidence: float, bbox: [x1,y1,x2,y2]}]`. This is the interface extraction and compliance are built against — keep it stable so CV work and rule-engine work can proceed in parallel.

### 3.4 Extraction — `field_patterns.yaml`
```yaml
fields:
  - id: MRP
    patterns:
      - '(?:MRP|Rs\.?|₹|INR)\s*[:\-]?\s*(\d+(?:\.\d{1,2})?)'
    normalize: currency

  - id: NET_QUANTITY
    patterns:
      - '(\d+(?:\.\d+)?)\s*(g|kg|ml|l|gm)\b'
    normalize: weight_volume

  - id: MANUFACTURER
    patterns:
      - '(?:Mktd\.?|Marketed|Packed|Manufactured)\s*by\s*[:\-]?\s*(.+)'
    normalize: none

  - id: CONSUMER_CARE
    patterns:
      - '(?:Customer|Consumer)\s*Care.*?(\d{4,}[\d\-\s]*)'
    normalize: none
```
`extraction_service.py` loads this generically — one loop over `fields`, applying each field's `patterns` against every OCR region's `text`, keeping the highest-confidence match with its source region (for the bbox). **Adding a field = adding a YAML block, not new code.** This is the concrete test of "config-driven, not hardcoded."

### 3.5 Normalization
- Currency: strip `Rs.`/`₹`/`INR`/whitespace variants → `"<amount> INR"`.
- Weight/volume: normalize unit casing/spacing (`0.5 kg` and `500g` both → grams representation) using a small fixed lookup — not a general conversion engine (per PRD Non-Goals).

---

## 4. Rule Engine — `rules.yaml`

```yaml
requirements:
  - id: MRP
    name: Maximum Retail Price
    required: true
    applies_to: [ALL]

  - id: NET_QUANTITY
    name: Net Quantity
    required: true
    applies_to: [ALL]

  - id: MANUFACTURER
    name: Manufacturer/Packer
    required: true
    applies_to: [ALL]

  - id: CONSUMER_CARE
    name: Consumer Care Information
    required: true
    applies_to: [ALL]

  - id: COUNTRY_OF_ORIGIN
    name: Country of Origin
    required: true
    applies_to: [IMPORTED]
```

**Categories seeded for MVP demo:** `ALL` (matches every inspection), `IMPORTED`, and optionally one more (e.g. `FOOD`) if time allows a second applicability example.

> All `required`/`applies_to` values above are **prototype placeholders**, not verified legal text. Flag clearly in the PRD/pitch that final field lists and applicability must be checked against the Legal Metrology (Packaged Commodities) Rules, 2011 and current Department of Consumer Affairs notifications before any real-world use.

## 5. Compliance Engine — `compliance_service.py`

```
rules.yaml + inspection.category
       ↓
applicable_rules = [r for r in rules if inspection.category in r.applies_to or "ALL" in r.applies_to]
       ↓
for each applicable_rule:
    declaration = declarations.fields.get(rule.id)
    if declaration is None or declaration.confidence == 0:
        status = FAIL   (required and simply not detected at all)
    elif declaration.confidence < REVIEW_THRESHOLD:
        status = REVIEW (detected but not confidently)
    else:
        status = PASS
for each non-applicable_rule:
    status = NOT_APPLICABLE
```

`REVIEW_THRESHOLD = 0.75` — a named constant in `core/config.py`, not inline. **Never** collapse low confidence into FAIL — that's the whole point of the REVIEW state (PRD §9.9, Innovation #3).

Each evaluation produces a `finding` per PRD §9.10's shape, written to the `findings` collection.

---

## 6. API Specification

All routes except `/health` require a valid Clerk session (verified in `core/security.py`); return `401` otherwise. `inspector_id` is always taken from the verified token, never from the request body.

| Method | Path | Body | Response | Notes |
|---|---|---|---|---|
| GET | `/health` | — | `{status: "ok"}` | No auth |
| GET | `/api/me` | — | `{id, name, role}` | Resolves Clerk identity |
| POST | `/api/inspections` | `{product: {name, brand, category}}` | `{inspection_id, inspection_code, status}` | 400 if category missing |
| GET | `/api/inspections/{id}` | — | Full inspection incl. images/declarations/findings | 404 if not found or not owned |
| GET | `/api/inspections` | query: `search, status, page` | List for history screen | |
| POST | `/api/inspections/{id}/images` | multipart file + `image_type` | `{image_id, quality}` | Validates MIME + size; runs quality check synchronously |
| POST | `/api/inspections/{id}/analyze` | — | `{ocr_status, declarations, findings}` | Runs OCR → extraction → normalization → compliance in sequence; skips RETAKE images unless `force=true` |
| GET | `/api/inspections/{id}/ocr` | — | Raw OCR regions per image | Debug/evidence support |
| GET | `/api/inspections/{id}/declarations` | — | Structured fields | |
| GET | `/api/inspections/{id}/compliance` | — | Findings array | |
| POST | `/api/inspections/{id}/findings/{rule_id}/review` | `{decision, comment?}` | Updated `inspector_decisions` doc | `decision ∈ {CONFIRM, REJECT, DEFER}`; never mutates the original finding |
| POST | `/api/inspections/{id}/finalize` | — | `{final_status}` | Computed only once all required findings have a decision (or explicit override) |
| POST | `/api/inspections/{id}/report` | — | `{report_path}` | Generates PDF from stored data; regenerable |
| GET | `/api/dashboard` | — | `{total, pending_reviews, violations, compliance_rate, recent[]}` | Simple aggregates only |

**Error cases (apply across endpoints):** unsupported image format → 415; oversized upload → 413; inspection not found / not owned by requester → 404; analyze called before any images uploaded → 400; finalize called before all required findings reviewed → 409 with list of unresolved rule IDs; DB unavailable → 503 with generic message (never leak connection strings/stack traces to the client).

---

## 7. Frontend Screens (technical notes)

1. **Login** — Clerk-hosted or embedded component.
2. **Dashboard** — 4 stat cards + recent inspections table + "New Inspection" button. Pull from `/api/dashboard`.
3. **New Inspection** — form (name, brand, category dropdown — hardcode category list from `rules.yaml` categories at build time or a small static list).
4. **Image Upload** — capture/upload front/back/side, show per-image quality badge immediately after upload (don't wait for full analyze).
5. **Analysis/Processing** — trigger `/analyze`, show a simple progress state (OCR running → extracting → checking rules).
6. **Inspection Results** — table: Declaration | Extracted Value | Confidence | Status | [View Evidence]. Status badge colors: PASS green, FAIL red, REVIEW amber, NOT_APPLICABLE grey.
7. **Evidence Review** — modal/panel showing the source image with bbox overlay (draw a rectangle on a `<canvas>` over the image using stored coordinates); Confirm/Reject/Defer buttons here.
8. **Report** — preview + download link.
9. **Inspection History** — searchable table, opens back into Inspection Results (read-only if finalized).

---

## 8. Security (MVP)

- Clerk verifies identity; FastAPI middleware checks the token on every non-health route and attaches `inspector_id`.
- File upload validation: allow-list MIME types (`image/jpeg`, `image/png`), max size (e.g. 10MB), sanitize filenames (strip path components, generate server-side UUID filenames).
- Every inspection/image/finding query filters by ownership or role — an inspector cannot fetch another's inspection by guessing an ID unless `role == admin`.
- No secrets in frontend code; `.env` for `MONGODB_URI`, `CLERK_SECRET_KEY`, any OCR/API keys — never committed.

## 9. Error Handling Summary

| Condition | Behavior |
|---|---|
| Unreadable/corrupt image | Reject at upload with 415, don't store |
| Blur / glare / poor lighting | Quality = RETAKE, block auto-analyze, prompt retake or explicit override |
| OCR returns nothing for an image | Declarations from that image stay null/0-confidence; doesn't crash the pipeline |
| Low OCR confidence on a required field | `REVIEW`, never auto-`FAIL` |
| Declaration not found at all | `FAIL` (required + genuinely absent) |
| Malformed extracted value (fails normalization) | `REVIEW` with explanation `"detected but could not be parsed"` |
| Unsupported image format | 415 at upload |
| DB write failure mid-pipeline | Partial results are not silently discarded — return 503, keep whatever was already committed, allow retry of the failed stage only |

## 10. Non-Functional Requirements (MVP-appropriate, not production SLAs)

- Analyze pipeline (quality→OCR→extraction→compliance) should complete in well under 30s per image on demo hardware.
- Every finding must be traceable to its source image/bbox (auditability = core requirement, not a nice-to-have).
- Basic input validation on every endpoint; no unhandled exceptions surfaced as raw tracebacks to the client.
- UI usable one-handed on a phone-sized viewport is a stretch goal, not required for demo.

## 11. Testing Strategy

- **Dataset:** 8-10 real packaged products, front/back/side, including 2-3 deliberately blurry/glare shots and 1-2 controlled cases (declaration covered/removed) — clearly labeled as controlled, not real violations.
- **Extraction accuracy:** manually record ground truth for MRP/Qty/Manufacturer/Consumer Care per product; compare against system output; report actual precision, not estimates.
- **Rule applicability:** confirm `COUNTRY_OF_ORIGIN` shows `NOT_APPLICABLE` for non-imported test products and evaluates correctly for a labeled-imported one.
- **Confidence threshold:** confirm at least one test image produces `REVIEW`, not `FAIL`, due to low confidence.
- **API:** smoke-test each endpoint in §6 for both success and at least one error case.
- **Report generation:** confirm a report can be regenerated from stored data after the fact (not just at first generation).

## 12. 20-Hour Implementation Plan

| Hours | Work |
|---|---|
| 0–2 | Repo setup: React+Vite+Tailwind scaffold, FastAPI scaffold, Clerk wired on both ends, MongoDB Atlas connected, `/health` round-trip working |
| 2–4 | Inspection creation + image upload endpoints and screens, Mongo writes for `inspections`/`product_images` |
| 4–7 | OpenCV quality checks; PaddleOCR integration; store `ocr_results` with bounding boxes; verify against real photographed products |
| 7–10 | `field_patterns.yaml` + generic extraction loop; normalization for currency/weight; verify against real photos, iterate on regex |
| 10–13 | `rules.yaml` + category applicability filter; `compliance_service.py`; PASS/FAIL/REVIEW/NOT_APPLICABLE; `REVIEW_THRESHOLD` in config |
| 13–16 | Evidence viewer (bbox overlay), inspector review UI + `inspector_decisions` writes, finalize endpoint |
| 16–18 | Report generation (PDF/HTML), basic history screen, dashboard stat cards |
| 18–20 | Buffer: bug fixing, demo rehearsal (clean-photo pass + blurry-photo pass), do not schedule new features here |

## 13. Acceptance Criteria (build-complete definition)

- A real photographed product can go through the full flow (create → upload → analyze → review → finalize → report) without manual DB edits.
- At least one finding demonstrably shows `REVIEW` due to low confidence, not forced `FAIL`.
- At least one finding demonstrably shows `NOT_APPLICABLE` due to category filtering.
- Adding a new declaration field to `field_patterns.yaml` and `rules.yaml` (no code change) is verified to work before demo day.
- Every finding has viewable evidence (image + bbox).
- Report is regenerable from stored data.
