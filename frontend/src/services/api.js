const API_BASE_URL = "http://localhost:8000";

export async function fetchDashboardMetrics() {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline, using mock dashboard data", err);
    return {
      metrics: {
        total_inspections: 14,
        compliant: 8,
        potential_violations: 4,
        needs_review: 2,
        pending_officer_review: 3
      },
      recent_inspections: [
        {
          id: "INS-1001",
          "product_name": "Fresh Cow Milk 1L",
          status: "COMPLIANT",
          confidence: 0.98,
          officer_decision: "APPROVED",
          created_at: new Date().toISOString()
        },
        {
          id: "INS-1002",
          product_name: "Premium Almond Butter 250g",
          status: "POTENTIAL_VIOLATION",
          confidence: 0.92,
          officer_decision: "PENDING",
          created_at: new Date().toISOString()
        },
        {
          id: "INS-1003",
          product_name: "Imported Dark Chocolate 100g",
          status: "NEEDS_REVIEW",
          confidence: 0.74,
          officer_decision: "PENDING",
          created_at: new Date().toISOString()
        }
      ]
    };
  }
}

export async function submitPackageAnalysis(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Analysis failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline, returning mock analysis result", err);
    return {
      inspection_id: "INS-MOCK-" + Math.floor(Math.random() * 1000),
      product_id: "PROD-99",
      product_profile: payload.product_profile || {
        product_name: "Mock Organic Packaged Food",
        manufacturer: "Quality Foods Ltd",
        packer: "",
        importer: "",
        net_quantity: "500 g",
        mrp: "₹199",
        date: "08/2026",
        consumer_care: "",
        country_of_origin: "India",
        other_declarations: []
      },
      compliance_result: {
        status: "POTENTIAL_VIOLATION",
        confidence: 0.88,
        violations: [
          {
            field: "consumer_care",
            issue: "Mandatory declaration 'Consumer Care Details' is not detected on packaging.",
            severity: "HIGH",
            confidence: 0.92,
            rule_reference: "Rule 6(1)(ac) - Consumer Care Details"
          }
        ]
      },
      created_at: new Date().toISOString()
    };
  }
}

export async function submitOfficerReview(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/officer-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Officer review submission failed");
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline, returning mock review response", err);
    return {
      message: "Officer review recorded successfully (mock)",
      inspection_id: payload.inspection_id,
      status: "POTENTIAL_VIOLATION",
      officer_decision: payload.decision,
      officer_remarks: payload.remarks
    };
  }
}
