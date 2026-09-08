# PRD — AI-Assisted Legal Metrology Compliance Inspection System
**SIH 2026 · Problem Statement 34 · MVP scope: ~20 hours**

---

## 1. Executive Summary

Legal Metrology enforcement officers manually inspect packaged commodities for mandatory declarations (MRP, net quantity, manufacturer details, consumer care info, etc.) required under the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011. This is slow, inconsistent, and hard to audit.

This system lets an inspector photograph a package, and the system extracts declarations via OCR, checks them against a configurable, category-aware rule engine, and surfaces **PASS / FAIL / REVIEW** findings — each backed by the exact image region and confidence score that produced it. The inspector confirms or overrides every finding before any compliance status is finalized. The AI never issues a legal verdict; it produces evidence and a recommendation.

## 2. Problem Statement

- Manual label inspection is slow and doesn't scale across the volume of packaged goods in circulation.
- Findings are inconsistent between inspectors and hard to audit after the fact (what did the inspector actually check, and why?).
- Declarations required vary by product/category — a flat checklist misrepresents the law.
- Poor photo quality (blur, glare) is currently indistinguishable from an actual missing declaration.

## 3. Product Vision

An evidence-driven inspection assistant, not a verdict machine. Perception (OCR/CV) is separated from legal reasoning (deterministic rule engine), and legal reasoning is separated from enforcement (the human inspector). Every finding a judge or supervisor looks at can be traced back to a pixel region on a specific image.

## 4. Goals (MVP)

- End-to-end pipeline: upload → quality check → OCR → extraction → rule-based compliance → evidence → inspector review → report → history.
- Evidence-linked findings (image + bounding box + confidence) for every declaration checked.
- Confidence-aware `REVIEW` state — never force uncertain extraction into `FAIL`.
- Category-aware rule applicability (not a single static checklist).
- A working demo on real photographed products, not synthetic samples.

## 5. Non-Goals (explicitly out of MVP scope)

- Physical font-size / character-height measurement (needs calibration reference objects).
- Live e-commerce scraping or physical↔online listing comparison.
- Automatic product categorization (ML classification) — category is manually selected.
- Barcode lookup / product fingerprinting / repeat-violation intelligence across inspections.
- Advanced analytics, manufacturer risk trends, maps.
- Custom model training, RAG, vector DB, chatbot interface.
- Complex role/permission management, microservices, real-time collaboration.

These are listed in the Future Roadmap (§13) and should be named explicitly in the pitch as deliberate scope decisions.

## 6. Target Users

**Primary:** Legal Metrology enforcement officer / inspector — performs field or desk inspections, needs a fast way to check a package and produce a defensible report.

**Secondary:** Department supervisors / senior officers — consume inspection summaries and reports, don't operate the extraction pipeline directly.

**Indirect beneficiary:** The consumer, protected by more consistent enforcement — not a system user in the MVP.

## 7. User Persona

**Inspector — Rahul, Legal Metrology field officer**
Visits retail outlets, checks 15-20 products per visit today by eye and manual note-taking. Needs: fast capture, clear PASS/FAIL/REVIEW per declaration, ability to override the system when it's wrong, and a report he can hand to his supervisor or use as enforcement evidence. Doesn't want to be told "illegal" by a black box — wants to see *why*.

## 8. User Journey (MVP)

1. Rahul logs in (Clerk).
2. Opens dashboard — sees today's inspections, pending reviews, quick "New Inspection."
3. Starts a new inspection: enters product name/brand, **manually selects category** (e.g. Food, Household/Cleaning, Imported), gets an inspection ID.
4. Captures/uploads front + back (+ side if needed) images.
5. System runs image quality check per image — flags blur/glare, prompts retake if unusable.
6. System runs OCR, extracts MRP / Net Quantity / Manufacturer / Consumer Care (+ Country of Origin if category = Imported).
7. Rule engine filters applicable rules for the selected category and evaluates each: PASS / FAIL / REVIEW.
8. Rahul reviews the findings table — each row shows extracted value, confidence, status, and "View Evidence" (image + bounding box).
9. Rahul confirms, rejects, or defers each finding. His decision is stored alongside — not over — the AI result.
10. System computes a final status: `COMPLIANT` / `NON_COMPLIANT` / `NEEDS_REVIEW`, clearly separate from the AI's raw recommendation.
11. Rahul generates a PDF report and it's saved to inspection history, searchable later.

## 9. Functional Requirements

Each MVP feature below: description, user story, requirements, inputs/outputs, edge cases, acceptance criteria. (Full technical detail — schemas, endpoints, pipeline internals — is in the TRD.)

### 9.1 Authentication
- **Story:** As an inspector, I log in with my department identity so my findings and decisions are attributable to me.
- **Requirements:** Clerk-based login; basic inspector/admin role flag.
- **Edge cases:** No account → blocked with a clear message; expired session → redirect to login without losing in-progress inspection data.
- **Acceptance criteria:** Unauthenticated requests to any API route return 401; every stored decision carries a user ID.

### 9.2 Inspector Dashboard
- **Story:** As an inspector, I want an at-a-glance view of my inspection activity.
- **Requirements:** Total inspections, pending reviews, violations found, compliance rate, recent inspections list, "New Inspection" CTA. No charts/analytics in MVP.
- **Acceptance criteria:** Dashboard loads from real stored data (not hardcoded), even if the dataset is small.

### 9.3 Create Inspection
- **Story:** As an inspector, I start an inspection by naming the product and picking its category, so the system knows which rules apply.
- **Requirements:** Product name, brand, manually-selected category, auto-generated inspection ID.
- **Edge cases:** Category left blank → block submission with inline validation, not a silent default.
- **Acceptance criteria:** Every inspection has exactly one category at creation time; category is immutable after evidence has been generated (or requires explicit re-evaluation if changed).

### 9.4 Image Upload
- **Story:** As an inspector, I upload/capture front, back, and (if needed) side images of the package.
- **Requirements:** Store image ID, inspection ID, filename, image type, timestamp, quality info.
- **Edge cases:** Unsupported format, oversized file, zero images submitted.
- **Acceptance criteria:** Rejects non-image MIME types and files over the configured size limit with a clear error, not a silent failure.

### 9.5 Image Quality Analysis
- **Story:** As an inspector, I'm told immediately if a photo is unusable, instead of getting a false "missing declaration."
- **Requirements:** OpenCV-based blur, brightness, glare/overexposure checks → `GOOD` / `WARNING` / `RETAKE`.
- **Acceptance criteria:** A `RETAKE`-flagged image never silently proceeds into OCR as if it were `GOOD`; the UI must prompt for a new capture or explicit inspector override.

### 9.6 OCR
- **Story:** As the system, I extract raw text with location and confidence so every later claim is traceable.
- **Requirements:** PaddleOCR run per image; store text, confidence, bounding box, image ID for every detected region.
- **Acceptance criteria:** Every declaration finding traces back to at least one stored OCR region (or explicitly has none, in the case of `FAIL: not detected`).

### 9.7 Declaration Detection & Extraction
- **Story:** As the system, I turn raw OCR text into structured fields (MRP, Net Quantity, Manufacturer, Consumer Care, Country of Origin).
- **Requirements:** Configuration-driven extraction (`field_patterns.yaml`), not hardcoded per-field logic — see TRD §3.
- **Edge cases:** Multiple candidate matches on one package (e.g. two prices — MRP vs a discounted price); partial/garbled OCR text.
- **Acceptance criteria:** Adding a 5th declaration field requires only a YAML entry, not new extraction code (validated by actually adding one during testing).

### 9.8 Normalization
- **Story:** As the system, I convert equivalent representations (₹120 / Rs.120 / INR 120) to one comparable form.
- **Requirements:** Currency and unit normalization for the 4 MVP fields only — not a general unit-conversion engine.
- **Acceptance criteria:** All observed currency/unit variants in the test dataset normalize to a single canonical form.

### 9.9 Rule Applicability & Compliance Engine
- **Story:** As an inspector, I want the system to check only the declarations that actually apply to this product's category.
- **Requirements:** `rules.yaml` with `id`, `name`, `required`, `applies_to`; engine filters by the inspection's category before validation. See TRD §4-5 for schema and engine logic.
- **Acceptance criteria:** A rule with `applies_to: [IMPORTED]` is not evaluated (shows `NOT_APPLICABLE`) for a non-imported product.

### 9.10 Evidence-Linked Findings — primary innovation
- **Story:** As an inspector, for every finding I can see exactly which image and which region produced it.
- **Requirements:** Each finding = rule ID, status, explanation, confidence, image ID, bounding box, extracted value.
- **Acceptance criteria:** Every `PASS`/`FAIL` finding (not `NOT_APPLICABLE`) renders a viewable evidence image with the region highlighted.

### 9.11 Human-in-the-Loop Review
- **Story:** As an inspector, I confirm, reject, or defer each AI finding — my decision is recorded, not the AI's overwritten.
- **Requirements:** Store AI status/confidence separately from inspector decision/ID/timestamp/comment.
- **Acceptance criteria:** Querying a finding after review still returns the original AI status alongside the inspector's decision — nothing is overwritten.

### 9.12 Final Compliance Status
- **Story:** As a supervisor reading a report, I can tell the AI's recommendation apart from the officer's actual decision.
- **Requirements:** `COMPLIANT` / `NON_COMPLIANT` / `NEEDS_REVIEW`, computed only after inspector review, displayed distinctly from raw AI findings.
- **Acceptance criteria:** The report UI never presents the AI recommendation and the final decision as the same field.

### 9.13 Compliance Report
- **Story:** As an inspector, I generate a report I can hand to a supervisor or use as inspection evidence.
- **Requirements:** PDF/printable HTML with inspection details, product info, findings, evidence images, inspector decisions, final status.
- **Acceptance criteria:** Report is regenerable from stored data at any later time (not a one-shot snapshot that can't be reproduced).

### 9.14 Inspection History
- **Story:** As an inspector, I can find and reopen a past inspection.
- **Requirements:** List, search by ID/product, reopen an inspection, view its findings and report. No fingerprinting/cross-inspection intelligence in MVP.
- **Acceptance criteria:** Searching by product name returns all matching past inspections with correct status badges.

## 10. Innovation & Differentiation

1. **Evidence-linked compliance** — every finding cites an image region, not just a text claim.
2. **Human-in-the-loop enforcement** — AI recommends, inspector decides; both are stored, neither overwrites the other.
3. **Confidence-aware REVIEW state** — uncertainty is surfaced, not silently forced into PASS or FAIL.
4. **Category-aware rule applicability** — a real (if small) rule engine, not one static checklist.
5. **Deterministic legal reasoning after AI extraction** — the LLM/CV layer never issues a legal verdict directly.
6. **Config-driven extensibility** — new declaration fields and rules are YAML edits, not code changes.

## 11. Demo Story

Dashboard → New Inspection → select category → upload a **clean** product photo → quality: GOOD → OCR runs → declaration table (MRP/Qty/Manufacturer/Consumer Care, mostly PASS) → open evidence on one field, show the bounding box on the actual photo → confirm findings → final status COMPLIANT → generate report.

Second pass, same flow with a **deliberately blurry/glare photo**: quality check flags WARNING/RETAKE, or a field extracts at low confidence → status REVIEW instead of a false FAIL → narrate why this matters (a bad photo should never look like a legal violation).

Close with category-based applicability: show a rule that's `NOT_APPLICABLE` for a non-imported product, to demonstrate it isn't a flat checklist.

## 12. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| OCR quality on real packaging (glare, curved surfaces, small text) is unpredictable | Test against real photographed products *before* writing extraction regex, not after |
| Legal rule content is asserted without verification | Explicitly label MVP rules as "prototype / to be verified" against Legal Metrology Rules 2011 and current DCA notifications; never present as legal advice |
| Scope creep toward Phase-2 features eating the 20-hour budget | Non-Goals (§5) are fixed; any additional feature requires dropping something else, not extending hours |
| Demo-day OCR/network failure | Rehearse offline; keep PaddleOCR/local processing so the demo doesn't depend on external API uptime |

## 13. Future Roadmap (explicitly Phase 2+)

- Calibrated physical font-size / character-height measurement.
- Physical package vs. e-commerce listing comparison (screenshot-based first, live scraping later).
- Automatic product categorization, barcode/product identification.
- Repeat-violation intelligence and manufacturer risk trends across inspection history.
- Advanced department dashboards, filters, analytics.
- Active learning from inspector corrections (stored AI-prediction-vs-correction data enables this later).
- Cloud object storage, production deployment, expanded role/audit management.

## 14. Success Metrics (for demo/evaluation, not production KPIs)

- End-to-end pipeline completes on real photographed products without manual intervention.
- Extraction accuracy measured against manually recorded ground truth for the 4 MVP fields (report actual numbers — do not fabricate).
- REVIEW state correctly triggers on the deliberately poor-quality test images.
- At least one rule correctly shows `NOT_APPLICABLE` for a category it doesn't apply to.

## 15. Open Questions / Decisions Required

- Exact current Legal Metrology Rules 2011 field requirements and any recent amendments — needs verification against DCA/India Code before the rule set is treated as anything beyond a prototype.
- Which categories to seed for the applicability demo (recommend: `ALL`, `IMPORTED`, plus one more for contrast).
- Whether admin role distinction is needed for the demo or can be deferred entirely.
