/**
 * Service Layer for Legal Metrology Frontend
 * All API interactions must route through this file.
 * Backed by mock datasets with simulated latency and optional error simulation.
 */

import {
  MOCK_INSPECTIONS,
  HISTORICAL_INSPECTIONS,
  MOCK_DASHBOARD_STATS
} from '../mock/inspectionData';

// Global error simulation flag (can be toggled in dev/testing)
let simulateNetworkError = false;

export function setSimulateNetworkError(shouldError) {
  simulateNetworkError = shouldError;
}

export function getSimulateNetworkError() {
  return simulateNetworkError;
}

// In-memory inspection cache so mutations during a session (new inspections, officer reviews) persist
const inMemoryInspections = { ...MOCK_INSPECTIONS };
const inMemoryHistory = [...HISTORICAL_INSPECTIONS];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a new inspection draft
 */
export async function createInspection(payload) {
  await delay(350);
  if (simulateNetworkError) throw new Error("Network error: Failed to create inspection draft.");

  const newId = `INS-2024-${String(Object.keys(inMemoryInspections).length + 1).padStart(3, '0')}`;
  const newRecord = {
    id: newId,
    timestamp: new Date().toISOString(),
    product: {
      name: payload.name || "Unnamed Commodity",
      brand: payload.brand || "General Brand",
      category: payload.category || "General Commodity",
      batch_number: payload.batch_number || "BATCH-NEW",
      declared_net_quantity: payload.declared_net_quantity || ""
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.92,
      laplacian_variance: 390.0,
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
 * Attaches uploaded image slots to an inspection record
 */
export async function uploadImages(inspectionId, filesWithRoles) {
  await delay(400);
  if (simulateNetworkError) throw new Error("Network error: Failed to upload commodity images.");

  const record = inMemoryInspections[inspectionId];
  if (!record) throw new Error(`Inspection ${inspectionId} not found.`);

  const images = filesWithRoles.map((item, idx) => ({
    id: `IMG-${inspectionId}-${idx + 1}`,
    role: item.role,
    name: item.file.name,
    url: item.previewUrl || URL.createObjectURL(item.file),
    quality: { status: "ACCEPTABLE", score: 0.94 }
  }));

  record.uploaded_images = images;
  return record;
}

/**
 * Triggers compliance analysis pipeline and returns synthesized findings
 */
export async function analyzeInspection(inspectionId) {
  await delay(600);
  if (simulateNetworkError) throw new Error("Analysis failed: Backend AI service unavailable.");

  const record = inMemoryInspections[inspectionId];
  if (!record) throw new Error(`Inspection ${inspectionId} not found.`);

  // If inspection already has declarations populated (e.g. from mock presets), return it
  if (record.extracted_declarations && record.extracted_declarations.length > 0) {
    return record;
  }

  // Generate standard declarations and mock OCR results adhering to data contract
  const defaultImageId = record.uploaded_images[0]?.id || `IMG-${inspectionId}-FRONT`;

  record.ocr_results = [
    {
      image_id: defaultImageId,
      text: `${record.product.name}`,
      confidence: 0.98,
      bbox: [80, 240, 440, 45]
    },
    {
      image_id: defaultImageId,
      text: "MRP ₹199.00 (Incl. of all taxes)",
      confidence: 0.96,
      bbox: [80, 460, 320, 35]
    },
    {
      image_id: defaultImageId,
      text: `Net Quantity: ${record.product.declared_net_quantity || "500 g"}`,
      confidence: 0.95,
      bbox: [80, 510, 240, 35]
    },
    {
      image_id: defaultImageId,
      text: "Mfg Date: 08/2026",
      confidence: 0.93,
      bbox: [80, 560, 200, 35]
    },
    {
      image_id: defaultImageId,
      text: `Mfd by: ${record.product.brand}, Industrial Area, Phase I`,
      confidence: 0.91,
      bbox: [80, 610, 420, 40]
    }
  ];

  record.extracted_declarations = [
    {
      field: "product_name",
      label: "Name of Commodity",
      detected_value: record.product.name,
      is_detected: true,
      confidence: 0.98,
      status: "COMPLIANT",
      evidence: { image_id: defaultImageId, bbox: [80, 240, 440, 45], text: record.product.name }
    },
    {
      field: "mrp",
      label: "Maximum Retail Price (MRP)",
      detected_value: "₹199.00 (Incl. of all taxes)",
      is_detected: true,
      confidence: 0.96,
      status: "COMPLIANT",
      evidence: { image_id: defaultImageId, bbox: [80, 460, 320, 35], text: "MRP ₹199.00" }
    },
    {
      field: "net_quantity",
      label: "Net Quantity",
      detected_value: record.product.declared_net_quantity || "500 g",
      is_detected: true,
      confidence: 0.95,
      status: "COMPLIANT",
      evidence: { image_id: defaultImageId, bbox: [80, 510, 240, 35], text: "Net Quantity" }
    },
    {
      field: "consumer_care",
      label: "Consumer Care Details",
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
      issue: "Consumer care details not detected on packaging",
      related_declaration: "Consumer Care Details",
      status: "POTENTIAL_VIOLATION",
      explanation: "Mandatory telephone number, email, or postal address for consumer grievances was not detected by OCR.",
      confidence: 0.91,
      evidence: {
        image_id: defaultImageId,
        bbox: [60, 660, 480, 50],
        text: "[Region scanned: No care details detected]"
      },
      source_image: defaultImageId,
      rule_reference: "Legal Metrology (Packaged Commodities) Rules 2011, Rule 6(1)(ac)",
      severity: "HIGH"
    }
  ];

  record.overall_status = "POTENTIAL_VIOLATION";
  record.overall_confidence = 0.91;

  // Add to in-memory history if not present
  if (!inMemoryHistory.find(h => h.id === record.id)) {
    inMemoryHistory.unshift({
      id: record.id,
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
 * Retrieves full inspection record by ID
 */
export async function getInspection(inspectionId) {
  await delay(250);
  if (simulateNetworkError) throw new Error("Network error: Unable to retrieve inspection record.");

  const record = inMemoryInspections[inspectionId];
  if (!record) {
    // If not in cache, fallback to first mock item for preview
    const fallback = MOCK_INSPECTIONS["INS-2024-001"];
    return { ...fallback, id: inspectionId };
  }
  return record;
}

/**
 * Retrieves filtered inspection history
 */
export async function getInspectionHistory(filters = {}) {
  await delay(250);
  if (simulateNetworkError) throw new Error("Network error: Failed to fetch inspection history.");

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
        item.product_name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }

  return results;
}

/**
 * Retrieves aggregated dashboard stats
 */
export async function getDashboardStats() {
  await delay(200);
  if (simulateNetworkError) throw new Error("Network error: Failed to fetch dashboard statistics.");

  // Calculate live counts from history
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
 * Records officer's legal review decision
 */
export async function submitOfficerDecision(inspectionId, decisionData) {
  await delay(400);
  if (simulateNetworkError) throw new Error("Network error: Failed to record officer decision.");

  const record = inMemoryInspections[inspectionId];
  if (record) {
    record.officer_decision = {
      decision: decisionData.decision || "CONFIRMED",
      remarks: decisionData.remarks || "",
      reviewed_at: new Date().toISOString(),
      finding_decisions: decisionData.finding_decisions || {}
    };
  }

  // Update history record
  const hist = inMemoryHistory.find((h) => h.id === inspectionId);
  if (hist) {
    hist.officer_decision = decisionData.decision || "CONFIRMED";
  }

  return {
    success: true,
    inspection_id: inspectionId,
    officer_decision: record?.officer_decision
  };
}
