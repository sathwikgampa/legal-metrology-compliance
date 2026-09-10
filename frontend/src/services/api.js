/**
 * Service Layer for Legal Metrology Frontend
 * All API interactions route exclusively through this file.
 * Backed by structured mock datasets with simulated latency and test error modes.
 */

import {
  MOCK_INSPECTIONS,
  HISTORICAL_INSPECTIONS,
  MOCK_DASHBOARD_STATS
} from '../mock/inspectionData';

// Simulated error state controls for testing ErrorState UI
let simulateErrorMode = null; // null | 'network' | 'ocr' | 'analysis'

export function setSimulateErrorMode(mode) {
  simulateErrorMode = mode;
}

export function getSimulateErrorMode() {
  return simulateErrorMode;
}

export function setSimulateNetworkError(isError) {
  simulateErrorMode = isError ? 'network' : null;
}

export function getSimulateNetworkError() {
  return simulateErrorMode === 'network';
}

// In-memory cache for mutations
const inMemoryInspections = { ...MOCK_INSPECTIONS };
const inMemoryHistory = [...HISTORICAL_INSPECTIONS];

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. createInspection(payload)
 * Initializes a new packaging inspection docket
 */
export async function createInspection(payload) {
  await delay(300);
  if (simulateErrorMode === 'network') {
    throw new Error("Backend service unavailable. Inspection docket creation timed out.");
  }

  const nextIndex = Object.keys(inMemoryInspections).length + 1;
  const newId = `INS-2024-${String(nextIndex).padStart(3, '0')}`;
  const newDocket = `LMO/ZN4/2026/${String(890 + nextIndex).padStart(4, '0')}`;

  const newRecord = {
    id: newId,
    docket_number: newDocket,
    timestamp: new Date().toISOString(),
    product: {
      name: payload.name || "Unnamed Pre-Packaged Commodity",
      brand: payload.brand || "General Brand",
      category: payload.category || "General Commodity",
      batch_number: payload.batch_number || "BATCH-001",
      declared_net_quantity: payload.declared_net_quantity || "",
      mrp: payload.mrp || ""
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.94,
      laplacian_variance: 410.0,
      description: "Packaging images verified for clarity."
    },
    uploaded_images: [],
    ocr_results: [],
    extracted_declarations: [],
    compliance_findings: [],
    overall_status: "NEEDS_REVIEW",
    overall_confidence: 0.0,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  };

  inMemoryInspections[newId] = newRecord;
  return newRecord;
}

/**
 * 2. uploadImages(inspectionId, filesWithRoles)
 * Binds uploaded images into labeled panel slots (front, back, side, close-up)
 */
export async function uploadImages(inspectionId, filesWithRoles) {
  await delay(350);
  if (simulateErrorMode === 'network') {
    throw new Error("Network error: Packaging images upload failed. Check connection.");
  }

  const record = inMemoryInspections[inspectionId];
  if (!record) throw new Error(`Inspection docket ${inspectionId} not found.`);

  const images = filesWithRoles.map((item, idx) => ({
    image_id: `IMG${String(idx + 1).padStart(3, '0')}`,
    role: item.role,
    name: item.file.name,
    url: item.previewUrl || URL.createObjectURL(item.file),
    quality: { status: "ACCEPTABLE", score: 0.94 },
    file: item.file
  }));

  record.uploaded_images = images;
  return record;
}

/**
 * 3. analyzeInspection(inspectionId)
 * Runs automated OCR and rule verification pipeline
 */
export async function analyzeInspection(inspectionId) {
  await delay(500);
  if (simulateErrorMode === 'ocr') {
    throw new Error("OCR Engine Failure: Character segmentation failed on package surfaces.");
  }
  if (simulateErrorMode === 'analysis') {
    throw new Error("Analysis Failure: Legal Metrology rule engine encountered a parsing error.");
  }

  const record = inMemoryInspections[inspectionId];
  if (!record) throw new Error(`Inspection docket ${inspectionId} not found.`);

  // Attempt live integration with CV Service (8001) & Backend API (8000)
  try {
    const uploadedImages = record.uploaded_images || [];
    const ocrPayloads = [];

    for (const uploadedImage of uploadedImages) {
      if (!uploadedImage.file) continue;

      const formData = new FormData();
      formData.append("file", uploadedImage.file);
      formData.append("product_id", `${inspectionId}-${uploadedImage.image_id}`);

      const ocrRes = await fetch("http://localhost:8001/ocr/extract", {
        method: "POST",
        body: formData
      });

      if (ocrRes.ok) {
        const payload = await ocrRes.json();
        ocrPayloads.push({
          image_id: uploadedImage.image_id,
          role: uploadedImage.role,
          payload
        });
      }
    }

    const combinedExtractedText = ocrPayloads.flatMap(({ image_id, payload }) =>
      (payload?.ocr_result?.extracted_text || []).map((item) => ({
        ...item,
        image_id
      }))
    );

    const combinedOcrResult = {
      extracted_text: combinedExtractedText,
      image_count: combinedExtractedText.length,
      sources: ocrPayloads.map(({ image_id, role, payload }) => ({
        image_id,
        role,
        quality: payload?.image_quality || null
      }))
    };

    const combinedConfidence = ocrPayloads.length > 0
      ? ocrPayloads.reduce((sum, { payload }) => sum + (payload?.image_quality?.score || 0.95), 0) / ocrPayloads.length
      : 0.95;

    // Call backend analyze route to evaluate rules & persist to SQLite DB
    const backendRes = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: record.product.name,
        ocr_result: combinedOcrResult,
        confidence: combinedConfidence,
        product_profile: {
          product_name: record.product.name,
          manufacturer: record.product.brand,
          net_quantity: record.product.declared_net_quantity || "500 g",
          mrp: record.product.mrp || "₹199",
          country_of_origin: "India",
          consumer_care: ""
        }
      })
    });

    if (backendRes.ok) {
      const dbData = await backendRes.json();
      record.db_inspection_id = dbData.inspection_id;
      if (dbData.compliance_result) {
        record.overall_status = dbData.compliance_result.overall_status || "POTENTIAL_VIOLATION";
        record.overall_confidence = dbData.compliance_result.overall_confidence || 0.91;
      }
    }
  } catch (err) {
    console.warn("Live backend/cv-service not reachable. Operating in fallback mock mode.", err);
  }

  // If already populated from a mock preset, return as is
  if (record.extracted_declarations && record.extracted_declarations.length > 0) {
    return record;
  }

  const uploadedImages = record.uploaded_images || [];
  const fallbackImageIds = uploadedImages.length > 0
    ? uploadedImages.map((img) => img.image_id)
    : ["IMG001"];
  const defaultImgId = fallbackImageIds[0];

  // Build realistic OCR tokens matching exact format
  record.ocr_results = [
    {
      image_id: defaultImgId,
      text: `${record.product.name}`,
      confidence: 0.98,
      bbox: [100, 250, 400, 300]
    },
    {
      image_id: defaultImgId,
      text: "MRP ₹199.00 (Incl. of all taxes)",
      confidence: 0.96,
      bbox: [80, 480, 340, 35]
    },
    {
      image_id: defaultImgId,
      text: `Net Quantity: ${record.product.declared_net_quantity || "500 g"}`,
      confidence: 0.95,
      bbox: [80, 525, 260, 35]
    },
    {
      image_id: defaultImgId,
      text: "Mfg Date: 08/2026",
      confidence: 0.93,
      bbox: [80, 570, 210, 35]
    },
    {
      image_id: defaultImgId,
      text: `Manufactured By: ${record.product.brand}, Industrial Area Phase I`,
      confidence: 0.92,
      bbox: [80, 615, 420, 40]
    }
  ];

  record.extracted_declarations = [
    {
      field: "product_name",
      label: "Name / Description of Commodity",
      detected_value: record.product.name,
      is_detected: true,
      confidence: 0.98,
      status: "COMPLIANT",
      evidence: { image_id: defaultImgId, bbox: [100, 250, 400, 300], text: record.product.name }
    },
    {
      field: "mrp",
      label: "Maximum Retail Price (MRP)",
      detected_value: "₹199.00 (Incl. of all taxes)",
      is_detected: true,
      confidence: 0.96,
      status: "COMPLIANT",
      evidence: { image_id: defaultImgId, bbox: [80, 480, 340, 35], text: "MRP ₹199.00" }
    },
    {
      field: "net_quantity",
      label: "Net Quantity Declaration",
      detected_value: record.product.declared_net_quantity || "500 g",
      is_detected: true,
      confidence: 0.95,
      status: "COMPLIANT",
      evidence: { image_id: defaultImgId, bbox: [80, 525, 260, 35], text: "Net Quantity" }
    },
    {
      field: "consumer_care",
      label: "Consumer Care & Grievance Contact",
      detected_value: "",
      is_detected: false,
      confidence: 0.0,
      status: "NOT_DETECTED",
      evidence: null
    }
  ];

  record.compliance_findings = [
    {
      id: `FND-${inspectionId}-1`,
      issue: "Consumer care details not detected on package",
      related_declaration: "Consumer Care & Grievance Contact",
      status: "POTENTIAL_VIOLATION",
      explanation: "Mandatory telephone number, email, or postal address for consumer complaints was not detected in OCR tokens.",
      confidence: 0.91,
      evidence: {
        image_id: defaultImgId,
        bbox: [60, 660, 480, 50],
        text: "[Region scanned: No care details detected]"
      },
      source_image: defaultImgId,
      rule_reference: "Rule 6(1)(ac) - Consumer Care Details",
      severity: "HIGH"
    }
  ];

  record.overall_status = "POTENTIAL_VIOLATION";
  record.overall_confidence = 0.91;

  // Add to history registry
  if (!inMemoryHistory.find((h) => h.id === record.id)) {
    inMemoryHistory.unshift({
      id: record.id,
      docket_number: record.docket_number,
      product_name: record.product.name,
      category: record.product.category,
      timestamp: record.timestamp,
      status: record.overall_status,
      confidence: record.overall_confidence,
      officer_decision: record.officer_decision.decision,
      images_count: record.uploaded_images.length
    });
  }

  return record;
}

/**
 * 4. getInspection(inspectionId)
 * Fetches full docket record by ID
 */
export async function getInspection(inspectionId) {
  await delay(200);
  if (simulateErrorMode === 'network') {
    throw new Error("Network connection error: Unable to retrieve inspection record from server.");
  }

  const record = inMemoryInspections[inspectionId];
  if (!record) {
    const fallback = MOCK_INSPECTIONS["INS-2024-001"];
    return { ...fallback, id: inspectionId };
  }
  return record;
}

/**
 * 5. getInspectionHistory(filters)
 * Returns filtered, searchable inspection registry
 */
export async function getInspectionHistory(filters = {}) {
  await delay(200);
  if (simulateErrorMode === 'network') {
    throw new Error("Network error: Failed to fetch inspection ledger archives.");
  }

  let results = [...inMemoryHistory];

  if (filters.status && filters.status !== "ALL") {
    results = results.filter((item) => item.status === filters.status);
  }

  if (filters.category && filters.category !== "ALL") {
    results = results.filter((item) => item.category === filters.category);
  }

  if (filters.search && filters.search.trim() !== "") {
    const q = filters.search.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.id.toLowerCase().includes(q) ||
        (item.docket_number && item.docket_number.toLowerCase().includes(q)) ||
        item.product_name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * 6. getDashboardStats()
 * Returns aggregated jurisdiction metrics
 */
export async function getDashboardStats() {
  await delay(150);
  if (simulateErrorMode === 'network') {
    throw new Error("Network error: Failed to retrieve dashboard metrics.");
  }

  const total = inMemoryHistory.length;
  const compliant = inMemoryHistory.filter((i) => i.status === "COMPLIANT").length;
  const violations = inMemoryHistory.filter((i) => i.status === "POTENTIAL_VIOLATION").length;
  const needsReview = inMemoryHistory.filter((i) => i.status === "NEEDS_REVIEW").length;
  const pendingOfficer = inMemoryHistory.filter((i) => i.officer_decision === "PENDING").length;

  return {
    total_inspections: total,
    compliant,
    potential_violations: violations,
    needs_review: needsReview,
    pending_officer_review: pendingOfficer,
    category_breakdown: MOCK_DASHBOARD_STATS.category_breakdown
  };
}

/**
 * 7. submitOfficerDecision(inspectionId, decisionData)
 * Records official Legal Metrology Officer statutory order
 */
export async function submitOfficerDecision(inspectionId, decisionData) {
  await delay(350);
  if (simulateErrorMode === 'network') {
    throw new Error("Submission Failed: Legal Metrology Officer order could not be committed.");
  }

  const record = inMemoryInspections[inspectionId];
  if (record) {
    record.officer_decision = {
      decision: decisionData.decision || "APPROVED",
      remarks: decisionData.remarks || "",
      reviewed_at: new Date().toISOString(),
      finding_decisions: decisionData.finding_decisions || {}
    };
  }

  const hist = inMemoryHistory.find((h) => h.id === inspectionId);
  if (hist) {
    hist.officer_decision = decisionData.decision || "APPROVED";
  }

  return {
    success: true,
    inspection_id: inspectionId,
    officer_decision: record?.officer_decision
  };
}
