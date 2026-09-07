/**
 * Mock data for AI-Assisted Legal Metrology Inspection System
 * Covers 7 core test scenarios + historical inspections dataset
 * Follows exact data contracts and hard constraints.
 */

// Sample packaging image SVG data URLs so the UI renders clear, crisp mock package illustrations
const createSampleImage = (title, subtitle, color = "#1e293b") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <rect width="600" height="800" fill="${color}"/>
    <rect x="20" y="20" width="560" height="760" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
    <circle cx="300" cy="180" r="70" fill="#3b82f6" opacity="0.15"/>
    <text x="300" y="190" font-family="sans-serif" font-size="40" fill="#60a5fa" text-anchor="middle">📦</text>
    <text x="300" y="280" font-family="sans-serif" font-size="24" font-weight="bold" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="300" y="315" font-family="sans-serif" font-size="16" fill="#94a3b8" text-anchor="middle">${subtitle}</text>
    <line x1="60" y1="360" x2="540" y2="360" stroke="#334155" stroke-width="1.5" stroke-dasharray="4"/>
    <rect x="60" y="390" width="480" height="320" rx="8" fill="#1e293b" opacity="0.6"/>
    <text x="80" y="430" font-family="monospace" font-size="15" fill="#cbd5e1">Commodity Packaging Panel</text>
    <text x="80" y="465" font-family="monospace" font-size="13" fill="#94a3b8">Legal Metrology Declarations Area</text>
    <text x="80" y="510" font-family="monospace" font-size="12" fill="#64748b">• MRP (incl. of all taxes)</text>
    <text x="80" y="540" font-family="monospace" font-size="12" fill="#64748b">• Net Quantity &amp; Standard Units</text>
    <text x="80" y="570" font-family="monospace" font-size="12" fill="#64748b">• Manufacturer / Packer / Importer Details</text>
    <text x="80" y="600" font-family="monospace" font-size="12" fill="#64748b">• Month &amp; Year of Manufacture</text>
    <text x="80" y="630" font-family="monospace" font-size="12" fill="#64748b">• Consumer Care Email &amp; Phone</text>
    <rect x="60" y="730" width="480" height="30" rx="4" fill="#0284c7" opacity="0.2"/>
    <text x="300" y="750" font-family="sans-serif" font-size="12" fill="#38bdf8" text-anchor="middle">Official Inspection Evidence Artifact</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MOCK_INSPECTIONS = {
  // 1. Fully Compliant Inspection
  "INS-2024-001": {
    id: "INS-2024-001",
    timestamp: "2026-09-07T14:30:00Z",
    product: {
      name: "Heritage Select Basmati Rice",
      brand: "Heritage Agro Foods",
      category: "Food & Grains",
      batch_number: "HAR-2026-B8",
      declared_net_quantity: "5 kg"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.94,
      laplacian_variance: 420.5,
      description: "Image clarity and sharpness meet regulatory inspection standards."
    },
    uploaded_images: [
      {
        id: "IMG-001-FRONT",
        role: "front",
        name: "basmati_rice_front.jpg",
        url: createSampleImage("Heritage Basmati Rice", "Front Primary Panel"),
        quality: { status: "ACCEPTABLE", score: 0.95 }
      },
      {
        id: "IMG-001-BACK",
        role: "back",
        name: "basmati_rice_back.jpg",
        url: createSampleImage("Heritage Basmati Rice", "Back Declaration Panel"),
        quality: { status: "ACCEPTABLE", score: 0.93 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-001-BACK",
        text: "MRP ₹450.00 (Incl. of all taxes)",
        confidence: 0.98,
        bbox: [80, 480, 360, 40]
      },
      {
        image_id: "IMG-001-BACK",
        text: "Net Quantity: 5 kg",
        confidence: 0.97,
        bbox: [80, 530, 220, 35]
      },
      {
        image_id: "IMG-001-BACK",
        text: "Mfg Date: 05/2026",
        confidence: 0.95,
        bbox: [80, 580, 200, 35]
      },
      {
        image_id: "IMG-001-BACK",
        text: "Manufactured By: Heritage Agro Foods Ltd, Plot 42, Karnal, Haryana",
        confidence: 0.94,
        bbox: [80, 625, 420, 45]
      },
      {
        image_id: "IMG-001-BACK",
        text: "Consumer Care: care@heritageagro.in | 1800-200-4455",
        confidence: 0.96,
        bbox: [80, 680, 400, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name of Commodity",
        detected_value: "Heritage Select Basmati Rice",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-FRONT", bbox: [120, 260, 360, 50], text: "Heritage Select Basmati Rice" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹450.00 (Incl. of all taxes)",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-BACK", bbox: [80, 480, 360, 40], text: "MRP ₹450.00 (Incl. of all taxes)" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity",
        detected_value: "5 kg",
        is_detected: true,
        confidence: 0.97,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-BACK", bbox: [80, 530, 220, 35], text: "Net Quantity: 5 kg" }
      },
      {
        field: "mfg_date",
        label: "Month & Year of Manufacture",
        detected_value: "05/2026",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-BACK", bbox: [80, 580, 200, 35], text: "Mfg Date: 05/2026" }
      },
      {
        field: "manufacturer",
        label: "Manufacturer / Packer",
        detected_value: "Heritage Agro Foods Ltd, Plot 42, Karnal, Haryana",
        is_detected: true,
        confidence: 0.94,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-BACK", bbox: [80, 625, 420, 45], text: "Manufactured By: Heritage Agro Foods Ltd" }
      },
      {
        field: "consumer_care",
        label: "Consumer Care Details",
        detected_value: "care@heritageagro.in | 1800-200-4455",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-001-BACK", bbox: [80, 680, 400, 40], text: "Consumer Care: care@heritageagro.in | 1800-200-4455" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.96,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 2. Potential Violation Inspection
  "INS-2024-002": {
    id: "INS-2024-002",
    timestamp: "2026-09-07T12:15:00Z",
    product: {
      name: "Crispy Masala Namkeen 200g",
      brand: "Desi Flavours Pvt Ltd",
      category: "Snacks & Confectionery",
      batch_number: "DF-SNK-904",
      declared_net_quantity: "200 g"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.91,
      laplacian_variance: 380.2,
      description: "Packaging text is legible for OCR parsing."
    },
    uploaded_images: [
      {
        id: "IMG-002-FRONT",
        role: "front",
        name: "namkeen_front.jpg",
        url: createSampleImage("Crispy Masala Namkeen", "Front Display Panel"),
        quality: { status: "ACCEPTABLE", score: 0.92 }
      },
      {
        id: "IMG-002-BACK",
        role: "back",
        name: "namkeen_back.jpg",
        url: createSampleImage("Crispy Masala Namkeen", "Back Panel - Missing Care Info"),
        quality: { status: "ACCEPTABLE", score: 0.90 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-002-BACK",
        text: "MRP ₹40.00",
        confidence: 0.96,
        bbox: [80, 480, 200, 35]
      },
      {
        image_id: "IMG-002-BACK",
        text: "Net Wt: 200 g",
        confidence: 0.94,
        bbox: [80, 530, 180, 35]
      },
      {
        image_id: "IMG-002-BACK",
        text: "Packed: 07/2026",
        confidence: 0.93,
        bbox: [80, 580, 190, 35]
      },
      {
        image_id: "IMG-002-BACK",
        text: "Mfd by: Desi Flavours Pvt Ltd, Baddi, HP",
        confidence: 0.91,
        bbox: [80, 625, 390, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name of Commodity",
        detected_value: "Crispy Masala Namkeen",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-002-FRONT", bbox: [120, 260, 360, 50], text: "Crispy Masala Namkeen" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹40.00",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-002-BACK", bbox: [80, 480, 200, 35], text: "MRP ₹40.00" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity",
        detected_value: "200 g",
        is_detected: true,
        confidence: 0.94,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-002-BACK", bbox: [80, 530, 180, 35], text: "Net Wt: 200 g" }
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
    ],
    compliance_findings: [
      {
        id: "FND-002-1",
        issue: "Consumer care contact details not detected",
        related_declaration: "Consumer Care Details",
        status: "POTENTIAL_VIOLATION",
        explanation: "Mandatory telephone/email or address for consumer complaints was not detected on scanned package surfaces.",
        confidence: 0.92,
        evidence: {
          image_id: "IMG-002-BACK",
          bbox: [60, 670, 480, 60],
          text: "[Region scanned: No phone or email detected]"
        },
        source_image: "IMG-002-BACK",
        rule_reference: "Legal Metrology (Packaged Commodities) Rules 2011, Rule 6(1)(ac)",
        severity: "HIGH"
      }
    ],
    overall_status: "POTENTIAL_VIOLATION",
    overall_confidence: 0.91,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 3. Needs Review Inspection
  "INS-2024-003": {
    id: "INS-2024-003",
    timestamp: "2026-09-07T10:45:00Z",
    product: {
      name: "Artisan Dark Cocoa Nibs 150g",
      brand: "ChocoCraft Confections",
      category: "Confectionery",
      batch_number: "CC-DK-44",
      declared_net_quantity: "150 g"
    },
    image_quality_status: {
      status: "MARGINAL",
      score: 0.72,
      laplacian_variance: 165.4,
      description: "Reflective wrapper creates specular glare across net quantity declaration panel."
    },
    uploaded_images: [
      {
        id: "IMG-003-BACK",
        role: "back",
        name: "cocoa_nibs_foil.jpg",
        url: createSampleImage("Dark Cocoa Nibs", "Metallic Foil - Glare Warning"),
        quality: { status: "MARGINAL", score: 0.72 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-003-BACK",
        text: "MRP ₹280",
        confidence: 0.88,
        bbox: [80, 480, 180, 35]
      },
      {
        image_id: "IMG-003-BACK",
        text: "Net Qty: ~150g [glare detected]",
        confidence: 0.62,
        bbox: [80, 530, 240, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name of Commodity",
        detected_value: "Artisan Dark Cocoa Nibs",
        is_detected: true,
        confidence: 0.90,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-003-BACK", bbox: [100, 260, 380, 45], text: "Artisan Dark Cocoa Nibs" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity",
        detected_value: "150 g (Partially obscured)",
        is_detected: true,
        confidence: 0.62,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG-003-BACK", bbox: [80, 530, 240, 40], text: "Net Qty: ~150g" }
      }
    ],
    compliance_findings: [
      {
        id: "FND-003-1",
        issue: "Ambiguous Net Quantity declaration due to glare",
        related_declaration: "Net Quantity",
        status: "NEEDS_REVIEW",
        explanation: "OCR confidence on numeric net quantity digits is 62% due to reflective foil glare. Requires manual officer verification.",
        confidence: 0.62,
        evidence: {
          image_id: "IMG-003-BACK",
          bbox: [80, 530, 240, 40],
          text: "Net Qty: ~150g"
        },
        source_image: "IMG-003-BACK",
        rule_reference: "Rule 6(1)(c) - Net Quantity Legibility",
        severity: "MEDIUM"
      }
    ],
    overall_status: "NEEDS_REVIEW",
    overall_confidence: 0.65,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 4. Poor Image Quality Inspection
  "INS-2024-004": {
    id: "INS-2024-004",
    timestamp: "2026-09-07T09:10:00Z",
    product: {
      name: "Organic Almond Drink 1L",
      brand: "NutriLife Organics",
      category: "Beverages",
      batch_number: "NLO-AL-012",
      declared_net_quantity: "1 L"
    },
    image_quality_status: {
      status: "POOR",
      score: 0.38,
      laplacian_variance: 42.1,
      description: "Severe motion blur detected. Image quality is insufficient for reliable analysis. Please upload a clearer image."
    },
    uploaded_images: [
      {
        id: "IMG-004-BLUR",
        role: "front",
        name: "almond_milk_blurry.jpg",
        url: createSampleImage("Organic Almond Drink", "Low Quality - Motion Blur", "#331515"),
        quality: { status: "POOR", score: 0.38 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-004-BLUR",
        text: "Orga... Alm... [Uncertain]",
        confidence: 0.41,
        bbox: [100, 270, 300, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name of Commodity",
        detected_value: "Organic Almond Drink (Incomplete)",
        is_detected: true,
        confidence: 0.41,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG-004-BLUR", bbox: [100, 270, 300, 40], text: "Orga... Alm..." }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "",
        is_detected: false,
        confidence: 0.0,
        status: "NOT_DETECTED",
        evidence: null
      }
    ],
    compliance_findings: [
      {
        id: "FND-004-1",
        issue: "Poor image quality precludes reliable legal audit",
        related_declaration: "All Mandatory Declarations",
        status: "NEEDS_REVIEW",
        explanation: "Image sharpness score (0.38) falls below minimum inspection threshold. Officer should request physical package or high-resolution rescan.",
        confidence: 0.38,
        evidence: {
          image_id: "IMG-004-BLUR",
          bbox: [20, 20, 560, 760],
          text: "[Full image blur variance: 42.1]"
        },
        source_image: "IMG-004-BLUR",
        rule_reference: "Verification Standard - Image Quality Protocols",
        severity: "HIGH"
      }
    ],
    overall_status: "NEEDS_REVIEW",
    overall_confidence: 0.40,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 5. Low OCR Confidence Inspection
  "INS-2024-005": {
    id: "INS-2024-005",
    timestamp: "2026-09-06T17:20:00Z",
    product: {
      name: "Imported Extra Virgin Olive Oil 500ml",
      brand: "Mediterraneo Fine Oils",
      category: "Oils & Vinegars",
      batch_number: "MED-EVOO-88",
      declared_net_quantity: "500 ml"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.85,
      laplacian_variance: 290.0,
      description: "Overall lighting acceptable, curved glass bottle causes localized distortion."
    },
    uploaded_images: [
      {
        id: "IMG-005-BOTTLE",
        role: "front",
        name: "olive_oil_curved.jpg",
        url: createSampleImage("Olive Oil 500ml", "Cylindrical Bottle Distortion"),
        quality: { status: "ACCEPTABLE", score: 0.85 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-005-BOTTLE",
        text: "MRP ₹650.00",
        confidence: 0.94,
        bbox: [80, 480, 200, 35]
      },
      {
        image_id: "IMG-005-BOTTLE",
        text: "Imp: Gre... Trd... Ltd",
        confidence: 0.48,
        bbox: [80, 620, 320, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "importer",
        label: "Importer Details",
        detected_value: "Gre... Trd... Ltd (Uncertain characters)",
        is_detected: true,
        confidence: 0.48,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG-005-BOTTLE", bbox: [80, 620, 320, 40], text: "Imp: Gre... Trd... Ltd" }
      }
    ],
    compliance_findings: [
      {
        id: "FND-005-1",
        issue: "Low OCR confidence on Importer Name & Address",
        related_declaration: "Importer Details",
        status: "NEEDS_REVIEW",
        explanation: "Curved label surface resulted in 48% OCR confidence. Legal Metrology rules require clear, legible importer declarations.",
        confidence: 0.48,
        evidence: {
          image_id: "IMG-005-BOTTLE",
          bbox: [80, 620, 320, 40],
          text: "Imp: Gre... Trd... Ltd"
        },
        source_image: "IMG-005-BOTTLE",
        rule_reference: "Rule 6(1)(b) - Importer Name & Complete Address",
        severity: "MEDIUM"
      }
    ],
    overall_status: "NEEDS_REVIEW",
    overall_confidence: 0.58,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 6. Multiple OCR Bounding Boxes on One Image
  "INS-2024-006": {
    id: "INS-2024-006",
    timestamp: "2026-09-06T15:00:00Z",
    product: {
      name: "Ultra Clean Detergent Powder 1kg",
      brand: "Sparkle Chemical Care",
      category: "Household Cleaners",
      batch_number: "SC-DP-301",
      declared_net_quantity: "1 kg"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.96,
      laplacian_variance: 450.0,
      description: "High-resolution multi-declaration back panel."
    },
    uploaded_images: [
      {
        id: "IMG-006-MULTI",
        role: "back",
        name: "detergent_multi_bbox.jpg",
        url: createSampleImage("Detergent Powder 1kg", "Back Panel with 7 OCR Bounding Boxes"),
        quality: { status: "ACCEPTABLE", score: 0.96 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-006-MULTI",
        text: "Product: Ultra Clean Detergent Powder",
        confidence: 0.98,
        bbox: [80, 400, 380, 35]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "MRP ₹185.00 (Inclusive of all taxes)",
        confidence: 0.97,
        bbox: [80, 450, 340, 35]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "Unit Sale Price: ₹0.185/g",
        confidence: 0.95,
        bbox: [80, 495, 250, 30]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "Net Quantity: 1000 g (1 kg)",
        confidence: 0.96,
        bbox: [80, 535, 280, 35]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "Month & Year of Pkg: 08/2026",
        confidence: 0.94,
        bbox: [80, 580, 290, 35]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "Mfd by: Sparkle Care Ltd, Phase II, Vapi, Gujarat",
        confidence: 0.92,
        bbox: [80, 625, 410, 40]
      },
      {
        image_id: "IMG-006-MULTI",
        text: "Toll-free Care: 1800-889-1122 | feedback@sparkle.co.in",
        confidence: 0.95,
        bbox: [80, 675, 430, 35]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Commodity Name",
        detected_value: "Ultra Clean Detergent Powder",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-006-MULTI", bbox: [80, 400, 380, 35], text: "Ultra Clean Detergent Powder" }
      },
      {
        field: "mrp",
        label: "MRP",
        detected_value: "₹185.00",
        is_detected: true,
        confidence: 0.97,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-006-MULTI", bbox: [80, 450, 340, 35], text: "MRP ₹185.00" }
      },
      {
        field: "usp",
        label: "Unit Sale Price",
        detected_value: "₹0.185/g",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-006-MULTI", bbox: [80, 495, 250, 30], text: "Unit Sale Price: ₹0.185/g" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity",
        detected_value: "1000 g (1 kg)",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-006-MULTI", bbox: [80, 535, 280, 35], text: "Net Quantity: 1000 g (1 kg)" }
      },
      {
        field: "consumer_care",
        label: "Consumer Care",
        detected_value: "1800-889-1122 | feedback@sparkle.co.in",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-006-MULTI", bbox: [80, 675, 430, 35], text: "Toll-free Care: 1800-889-1122" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.96,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  },

  // 7. Multiple Package Images (Front, Back, Side, Close-up)
  "INS-2024-007": {
    id: "INS-2024-007",
    timestamp: "2026-09-06T11:00:00Z",
    product: {
      name: "NutriCrunch Rolled Oats 1kg",
      brand: "NutriCrunch Organics",
      category: "Cereals & Breakfast",
      batch_number: "NC-RO-55",
      declared_net_quantity: "1 kg"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.93,
      laplacian_variance: 410.0,
      description: "Comprehensive 4-panel package image set available."
    },
    uploaded_images: [
      {
        id: "IMG-007-FRONT",
        role: "front",
        name: "oats_front.jpg",
        url: createSampleImage("NutriCrunch Rolled Oats", "Role: FRONT Panel"),
        quality: { status: "ACCEPTABLE", score: 0.95 }
      },
      {
        id: "IMG-007-BACK",
        role: "back",
        name: "oats_back.jpg",
        url: createSampleImage("NutriCrunch Rolled Oats", "Role: BACK Nutritional & Origin Panel"),
        quality: { status: "ACCEPTABLE", score: 0.92 }
      },
      {
        id: "IMG-007-SIDE",
        role: "side",
        name: "oats_side.jpg",
        url: createSampleImage("NutriCrunch Rolled Oats", "Role: SIDE Barcode & Certifications"),
        quality: { status: "ACCEPTABLE", score: 0.91 }
      },
      {
        id: "IMG-007-CLOSEUP",
        role: "close-up",
        name: "oats_mrp_stamp.jpg",
        url: createSampleImage("NutriCrunch Rolled Oats", "Role: CLOSE-UP Net Qty & Batch Code"),
        quality: { status: "ACCEPTABLE", score: 0.97 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG-007-FRONT",
        text: "NutriCrunch 100% Whole Grain Rolled Oats",
        confidence: 0.98,
        bbox: [80, 260, 440, 50]
      },
      {
        image_id: "IMG-007-BACK",
        text: "Country of Origin: Australia. Packed in India.",
        confidence: 0.95,
        bbox: [80, 460, 380, 35]
      },
      {
        image_id: "IMG-007-SIDE",
        text: "Customer Helpline: care@nutricrunch.in",
        confidence: 0.94,
        bbox: [80, 520, 360, 35]
      },
      {
        image_id: "IMG-007-CLOSEUP",
        text: "MRP ₹210.00 Net Wt: 1 kg PKD: 08/2026",
        confidence: 0.99,
        bbox: [80, 400, 440, 45]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Commodity Name",
        detected_value: "NutriCrunch Rolled Oats",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-007-FRONT", bbox: [80, 260, 440, 50], text: "NutriCrunch Rolled Oats" }
      },
      {
        field: "country_of_origin",
        label: "Country of Origin",
        detected_value: "Australia (Packed in India)",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-007-BACK", bbox: [80, 460, 380, 35], text: "Country of Origin: Australia" }
      },
      {
        field: "mrp",
        label: "MRP",
        detected_value: "₹210.00",
        is_detected: true,
        confidence: 0.99,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-007-CLOSEUP", bbox: [80, 400, 440, 45], text: "MRP ₹210.00" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity",
        detected_value: "1 kg",
        is_detected: true,
        confidence: 0.99,
        status: "COMPLIANT",
        evidence: { image_id: "IMG-007-CLOSEUP", bbox: [80, 400, 440, 45], text: "Net Wt: 1 kg" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.97,
    officer_decision: {
      decision: "PENDING",
      remarks: "",
      reviewed_at: null,
      finding_decisions: {}
    }
  }
};

// Historical Inspections array for History Page
export const HISTORICAL_INSPECTIONS = [
  {
    id: "INS-2024-001",
    product_name: "Heritage Select Basmati Rice",
    category: "Food & Grains",
    timestamp: "2026-09-07T14:30:00Z",
    status: "COMPLIANT",
    confidence: 0.96,
    officer_decision: "APPROVED",
    images_count: 2
  },
  {
    id: "INS-2024-002",
    product_name: "Crispy Masala Namkeen 200g",
    category: "Snacks & Confectionery",
    timestamp: "2026-09-07T12:15:00Z",
    status: "POTENTIAL_VIOLATION",
    confidence: 0.91,
    officer_decision: "PENDING",
    images_count: 2
  },
  {
    id: "INS-2024-003",
    product_name: "Artisan Dark Cocoa Nibs 150g",
    category: "Confectionery",
    timestamp: "2026-09-07T10:45:00Z",
    status: "NEEDS_REVIEW",
    confidence: 0.65,
    officer_decision: "PENDING",
    images_count: 1
  },
  {
    id: "INS-2024-004",
    product_name: "Organic Almond Drink 1L",
    category: "Beverages",
    timestamp: "2026-09-07T09:10:00Z",
    status: "NEEDS_REVIEW",
    confidence: 0.40,
    officer_decision: "FURTHER_INSPECTION",
    images_count: 1
  },
  {
    id: "INS-2024-005",
    product_name: "Imported Extra Virgin Olive Oil 500ml",
    category: "Oils & Vinegars",
    timestamp: "2026-09-06T17:20:00Z",
    status: "NEEDS_REVIEW",
    confidence: 0.58,
    officer_decision: "PENDING",
    images_count: 1
  },
  {
    id: "INS-2024-006",
    product_name: "Ultra Clean Detergent Powder 1kg",
    category: "Household Cleaners",
    timestamp: "2026-09-06T15:00:00Z",
    status: "COMPLIANT",
    confidence: 0.96,
    officer_decision: "APPROVED",
    images_count: 1
  },
  {
    id: "INS-2024-007",
    product_name: "NutriCrunch Rolled Oats 1kg",
    category: "Cereals & Breakfast",
    timestamp: "2026-09-06T11:00:00Z",
    status: "COMPLIANT",
    confidence: 0.97,
    officer_decision: "APPROVED",
    images_count: 4
  },
  {
    id: "INS-2024-008",
    product_name: "Glow & Radiance Herbal Face Wash 100ml",
    category: "Cosmetics & Personal Care",
    timestamp: "2026-09-05T16:40:00Z",
    status: "POTENTIAL_VIOLATION",
    confidence: 0.89,
    officer_decision: "REJECTED",
    images_count: 2
  }
];

export const MOCK_DASHBOARD_STATS = {
  total_inspections: 18,
  compliant: 10,
  potential_violations: 5,
  needs_review: 3,
  pending_officer_review: 4,
  category_breakdown: [
    { category: "Food & Grains", count: 7, violations: 1 },
    { category: "Snacks & Confectionery", count: 4, violations: 2 },
    { category: "Cosmetics & Care", count: 3, violations: 1 },
    { category: "Household Cleaners", count: 2, violations: 0 },
    { category: "Beverages", count: 2, violations: 1 }
  ]
};
