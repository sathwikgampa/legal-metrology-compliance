/**
 * Mock data for AI-Assisted Legal Metrology Inspection System
 * Covers all 7 required inspection scenarios + historical audit dataset
 * Strictly adheres to data contract and hard constraints.
 */

// SVG packaging illustration generator for realistic evidence inspection
const createPackageIllustration = (title, panelSubtitle, color = "#111827") => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <rect width="600" height="800" fill="${color}"/>
    <rect x="15" y="15" width="570" height="770" rx="4" fill="#090d16" stroke="#2a3850" stroke-width="2"/>
    <rect x="35" y="35" width="530" height="50" rx="3" fill="#151e32" stroke="#24324f" stroke-width="1"/>
    <text x="50" y="66" font-family="monospace" font-size="14" font-weight="bold" fill="#60a5fa">GOVT. OF INDIA • LEGAL METROLOGY DOCKET</text>
    <text x="545" y="66" font-family="monospace" font-size="12" fill="#94a3b8" text-anchor="end">SCH-II / R-6</text>
    
    <circle cx="300" cy="200" r="60" fill="#3b82f6" opacity="0.1"/>
    <text x="300" y="215" font-family="sans-serif" font-size="44" text-anchor="middle">📦</text>
    <text x="300" y="295" font-family="sans-serif" font-size="22" font-weight="800" fill="#f8fafc" text-anchor="middle">${title}</text>
    <text x="300" y="325" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">${panelSubtitle}</text>
    
    <line x1="45" y1="360" x2="555" y2="360" stroke="#24324f" stroke-width="1" stroke-dasharray="4"/>
    
    <!-- Legal Declaration Panel Box -->
    <rect x="45" y="380" width="510" height="340" rx="4" fill="#0d1424" stroke="#1f2c44" stroke-width="1"/>
    <rect x="45" y="380" width="510" height="30" fill="#141d30"/>
    <text x="60" y="401" font-family="monospace" font-size="12" font-weight="bold" fill="#cbd5e1">MANDATORY STATUTORY DECLARATIONS PANEL</text>
    <text x="535" y="401" font-family="monospace" font-size="11" fill="#64748b" text-anchor="end">OCR TARGET ZONE</text>
    
    <text x="65" y="445" font-family="monospace" font-size="13" fill="#cbd5e1">• Commodity: ${title}</text>
    <text x="65" y="485" font-family="monospace" font-size="13" fill="#cbd5e1">• Maximum Retail Price (MRP): ₹ Display Area</text>
    <text x="65" y="525" font-family="monospace" font-size="13" fill="#cbd5e1">• Net Quantity: Standard Metric Units (g/kg/ml/l/N)</text>
    <text x="65" y="565" font-family="monospace" font-size="13" fill="#cbd5e1">• Month &amp; Year of Manufacture / Pre-Packing</text>
    <text x="65" y="605" font-family="monospace" font-size="13" fill="#cbd5e1">• Name &amp; Complete Address of Manufacturer / Packer</text>
    <text x="65" y="645" font-family="monospace" font-size="13" fill="#cbd5e1">• Consumer Grievance Care: Email, Helpline &amp; Address</text>
    <text x="65" y="685" font-family="monospace" font-size="13" fill="#cbd5e1">• Country of Origin Declaration</text>
    
    <!-- Footer Stamp -->
    <rect x="45" y="735" width="510" height="30" rx="2" fill="#082f49" opacity="0.3" stroke="#0284c7" stroke-width="1"/>
    <text x="300" y="755" font-family="monospace" font-size="11" fill="#38bdf8" text-anchor="middle">OFFICIAL PHOTOGRAPHIC EVIDENCE ARTIFACT • VERIFICATION ARCHIVE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const MOCK_INSPECTIONS = {
  // 1. Fully Compliant Inspection
  "INS-2024-001": {
    id: "INS-2024-001",
    docket_number: "LMO/ZN4/2026/0891",
    timestamp: "2026-09-07T14:30:00Z",
    product: {
      name: "Heritage Select Basmati Rice",
      brand: "Heritage Agro Foods Ltd",
      category: "Food & Grains",
      batch_number: "HAR-2026-B8",
      declared_net_quantity: "5 kg",
      mrp: "₹450.00"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.94,
      laplacian_variance: 420.5,
      description: "Image clarity and illumination conform to verification standards."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "front",
        name: "basmati_rice_front.jpg",
        url: createPackageIllustration("Heritage Select Basmati Rice", "Front Primary Display Panel"),
        quality: { status: "ACCEPTABLE", score: 0.95 }
      },
      {
        image_id: "IMG002",
        role: "back",
        name: "basmati_rice_back.jpg",
        url: createPackageIllustration("Heritage Select Basmati Rice", "Back Statutory Information Panel"),
        quality: { status: "ACCEPTABLE", score: 0.93 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG002",
        text: "MRP ₹450.00 (Incl. of all taxes)",
        confidence: 0.98,
        bbox: [100, 250, 400, 300]
      },
      {
        image_id: "IMG002",
        text: "Net Quantity: 5 kg",
        confidence: 0.97,
        bbox: [80, 510, 260, 35]
      },
      {
        image_id: "IMG002",
        text: "Mfg Date: 05/2026",
        confidence: 0.95,
        bbox: [80, 550, 220, 35]
      },
      {
        image_id: "IMG002",
        text: "Manufactured By: Heritage Agro Foods Ltd, Plot 42, Karnal, Haryana",
        confidence: 0.94,
        bbox: [80, 590, 440, 45]
      },
      {
        image_id: "IMG002",
        text: "Consumer Care: care@heritageagro.in | Toll-free: 1800-200-4455",
        confidence: 0.96,
        bbox: [80, 635, 430, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "Heritage Select Basmati Rice",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [100, 270, 400, 50], text: "Heritage Select Basmati Rice" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹450.00 (Incl. of all taxes)",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [100, 250, 400, 300], text: "MRP ₹450.00 (Incl. of all taxes)" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity Declaration",
        detected_value: "5 kg",
        is_detected: true,
        confidence: 0.97,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [80, 510, 260, 35], text: "Net Quantity: 5 kg" }
      },
      {
        field: "mfg_date",
        label: "Month & Year of Manufacture",
        detected_value: "05/2026",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [80, 550, 220, 35], text: "Mfg Date: 05/2026" }
      },
      {
        field: "manufacturer",
        label: "Manufacturer / Packer Details",
        detected_value: "Heritage Agro Foods Ltd, Plot 42, Karnal, Haryana",
        is_detected: true,
        confidence: 0.94,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [80, 590, 440, 45], text: "Manufactured By: Heritage Agro Foods Ltd" }
      },
      {
        field: "consumer_care",
        label: "Consumer Care & Grievance Contact",
        detected_value: "care@heritageagro.in | 1800-200-4455",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [80, 635, 430, 40], text: "Consumer Care: care@heritageagro.in" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.96,
    officer_decision: {
      decision: "APPROVED",
      remarks: "Sample package inspected under Section 18. Mandatory declarations present in standard unit font heights.",
      reviewed_at: "2026-09-07T15:00:00Z",
      finding_decisions: {}
    }
  },

  // 2. Potential Violation Inspection
  "INS-2024-002": {
    id: "INS-2024-002",
    docket_number: "LMO/ZN4/2026/0892",
    timestamp: "2026-09-07T12:15:00Z",
    product: {
      name: "Crispy Masala Namkeen 200g",
      brand: "Desi Flavours Pvt Ltd",
      category: "Snacks & Confectionery",
      batch_number: "DF-SNK-904",
      declared_net_quantity: "200 g",
      mrp: "₹40.00"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.91,
      laplacian_variance: 380.2,
      description: "Packaging text is legible for OCR parsing."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "front",
        name: "namkeen_front.jpg",
        url: createPackageIllustration("Crispy Masala Namkeen", "Front Primary Display Panel"),
        quality: { status: "ACCEPTABLE", score: 0.92 }
      },
      {
        image_id: "IMG002",
        role: "back",
        name: "namkeen_back.jpg",
        url: createPackageIllustration("Crispy Masala Namkeen", "Back Information Panel (Missing Helpline)"),
        quality: { status: "ACCEPTABLE", score: 0.90 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG002",
        text: "MRP ₹40.00",
        confidence: 0.96,
        bbox: [100, 250, 400, 300]
      },
      {
        image_id: "IMG002",
        text: "Net Wt: 200 g",
        confidence: 0.94,
        bbox: [80, 510, 200, 35]
      },
      {
        image_id: "IMG002",
        text: "Packed: 07/2026",
        confidence: 0.93,
        bbox: [80, 555, 210, 35]
      },
      {
        image_id: "IMG002",
        text: "Mfd by: Desi Flavours Pvt Ltd, Baddi, HP",
        confidence: 0.91,
        bbox: [80, 600, 410, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "Crispy Masala Namkeen",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [100, 270, 380, 50], text: "Crispy Masala Namkeen" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹40.00",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [100, 250, 400, 300], text: "MRP ₹40.00" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity Declaration",
        detected_value: "200 g",
        is_detected: true,
        confidence: 0.94,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [80, 510, 200, 35], text: "Net Wt: 200 g" }
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
    ],
    compliance_findings: [
      {
        id: "FND-002-1",
        issue: "Consumer care details not detected on scanned packaging surfaces",
        related_declaration: "Consumer Care & Grievance Contact",
        status: "POTENTIAL_VIOLATION",
        explanation: "Mandatory telephone number, email, or physical address for consumer complaints was not detected on scanned package surfaces.",
        confidence: 0.92,
        evidence: {
          image_id: "IMG002",
          bbox: [60, 640, 490, 60],
          text: "[Region scanned: No phone or email detected]"
        },
        source_image: "IMG002",
        rule_reference: "Rule 6(1)(ac) - Consumer Grievance Redressal Mechanism",
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
    docket_number: "LMO/ZN4/2026/0893",
    timestamp: "2026-09-07T10:45:00Z",
    product: {
      name: "Artisan Dark Cocoa Nibs 150g",
      brand: "ChocoCraft Confections",
      category: "Snacks & Confectionery",
      batch_number: "CC-DK-44",
      declared_net_quantity: "150 g",
      mrp: "₹280.00"
    },
    image_quality_status: {
      status: "MARGINAL",
      score: 0.72,
      laplacian_variance: 165.4,
      description: "Reflective metallic pouch wrapper creates specular glare across net quantity declaration panel."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "back",
        name: "cocoa_nibs_foil.jpg",
        url: createPackageIllustration("Artisan Dark Cocoa Nibs", "Metallic Foil - Glare Warning"),
        quality: { status: "MARGINAL", score: 0.72 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG001",
        text: "MRP ₹280.00",
        confidence: 0.88,
        bbox: [100, 250, 400, 300]
      },
      {
        image_id: "IMG001",
        text: "Net Qty: ~150g [glare detected]",
        confidence: 0.62,
        bbox: [80, 510, 260, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "Artisan Dark Cocoa Nibs",
        is_detected: true,
        confidence: 0.90,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [100, 270, 380, 45], text: "Artisan Dark Cocoa Nibs" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity Declaration",
        detected_value: "150 g (Partially obscured by glare)",
        is_detected: true,
        confidence: 0.62,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG001", bbox: [80, 510, 260, 40], text: "Net Qty: ~150g" }
      }
    ],
    compliance_findings: [
      {
        id: "FND-003-1",
        issue: "Ambiguous Net Quantity declaration due to specular glare",
        related_declaration: "Net Quantity Declaration",
        status: "NEEDS_REVIEW",
        explanation: "OCR confidence on numeric net quantity digits is 62% due to reflective foil glare. Requires manual officer verification under Rule 6(1)(c).",
        confidence: 0.62,
        evidence: {
          image_id: "IMG001",
          bbox: [80, 510, 260, 40],
          text: "Net Qty: ~150g"
        },
        source_image: "IMG001",
        rule_reference: "Rule 6(1)(c) - Net Quantity Legibility Requirements",
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
    docket_number: "LMO/ZN4/2026/0894",
    timestamp: "2026-09-07T09:10:00Z",
    product: {
      name: "Organic Almond Drink 1L",
      brand: "NutriLife Organics",
      category: "Beverages",
      batch_number: "NLO-AL-012",
      declared_net_quantity: "1 L",
      mrp: "₹180.00"
    },
    image_quality_status: {
      status: "POOR",
      score: 0.38,
      laplacian_variance: 42.1,
      description: "Image quality is insufficient for reliable analysis. Please upload a clearer image."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "front",
        name: "almond_milk_blurry.jpg",
        url: createPackageIllustration("Organic Almond Drink", "Low Quality - Motion Blur", "#2b1010"),
        quality: { status: "POOR", score: 0.38 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG001",
        text: "Orga... Alm... [Uncertain OCR]",
        confidence: 0.41,
        bbox: [100, 250, 400, 300]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "Organic Almond Drink (Incomplete text)",
        is_detected: true,
        confidence: 0.41,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG001", bbox: [100, 250, 400, 300], text: "Orga... Alm..." }
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
        issue: "Poor image quality precludes reliable automated analysis",
        related_declaration: "All Mandatory Declarations",
        status: "NEEDS_REVIEW",
        explanation: "Image sharpness variance (42.1) is below acceptable threshold. Officer must request physical packaging or high-resolution rescan.",
        confidence: 0.38,
        evidence: {
          image_id: "IMG001",
          bbox: [20, 20, 560, 760],
          text: "[Full panel blur detected: variance 42.1]"
        },
        source_image: "IMG001",
        rule_reference: "Inspection Verification Standard - Minimum Image Fidelity Protocol",
        severity: "HIGH"
      }
    ],
    overall_status: "NEEDS_REVIEW",
    overall_confidence: 0.40,
    officer_decision: {
      decision: "FURTHER_INSPECTION",
      remarks: "Image blur prevents verification of Rule 6 mandatory declarations. Notice sent to distributor for physical product submission.",
      reviewed_at: "2026-09-07T11:00:00Z",
      finding_decisions: {}
    }
  },

  // 5. Low OCR Confidence Inspection
  "INS-2024-005": {
    id: "INS-2024-005",
    docket_number: "LMO/ZN4/2026/0895",
    timestamp: "2026-09-06T17:20:00Z",
    product: {
      name: "Imported Extra Virgin Olive Oil 500ml",
      brand: "Mediterraneo Fine Oils",
      category: "Oils & Vinegars",
      batch_number: "MED-EVOO-88",
      declared_net_quantity: "500 ml",
      mrp: "₹650.00"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.85,
      laplacian_variance: 290.0,
      description: "Overall lighting acceptable, cylindrical bottle curvature induces perspective distortion."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "front",
        name: "olive_oil_curved.jpg",
        url: createPackageIllustration("Olive Oil 500ml", "Cylindrical Bottle Curvature"),
        quality: { status: "ACCEPTABLE", score: 0.85 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG001",
        text: "MRP ₹650.00",
        confidence: 0.94,
        bbox: [100, 250, 400, 300]
      },
      {
        image_id: "IMG001",
        text: "Imp: Gre... Trd... Ltd, Mumbai",
        confidence: 0.48,
        bbox: [80, 590, 340, 40]
      }
    ],
    extracted_declarations: [
      {
        field: "importer",
        label: "Importer Name & Address",
        detected_value: "Gre... Trd... Ltd, Mumbai (Low confidence token)",
        is_detected: true,
        confidence: 0.48,
        status: "NEEDS_REVIEW",
        evidence: { image_id: "IMG001", bbox: [80, 590, 340, 40], text: "Imp: Gre... Trd... Ltd" }
      }
    ],
    compliance_findings: [
      {
        id: "FND-005-1",
        issue: "Low OCR confidence on Importer Name & Address",
        related_declaration: "Importer Name & Address",
        status: "NEEDS_REVIEW",
        explanation: "Bottle curvature degraded OCR character recognition to 48%. Requires manual officer confirmation of registered Indian importer address.",
        confidence: 0.48,
        evidence: {
          image_id: "IMG001",
          bbox: [80, 590, 340, 40],
          text: "Imp: Gre... Trd... Ltd"
        },
        source_image: "IMG001",
        rule_reference: "Rule 6(1)(b) - Mandatory Importer Registration Declarations",
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
    docket_number: "LMO/ZN4/2026/0896",
    timestamp: "2026-09-06T15:00:00Z",
    product: {
      name: "Ultra Clean Detergent Powder 1kg",
      brand: "Sparkle Chemical Care",
      category: "Household Cleaners",
      batch_number: "SC-DP-301",
      declared_net_quantity: "1 kg",
      mrp: "₹185.00"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.96,
      laplacian_variance: 450.0,
      description: "High-contrast multi-panel packaging back surface."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "back",
        name: "detergent_multi_bbox.jpg",
        url: createPackageIllustration("Ultra Clean Detergent Powder", "Back Panel with 7 OCR Bounding Boxes"),
        quality: { status: "ACCEPTABLE", score: 0.96 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG001",
        text: "Product: Ultra Clean Detergent Powder",
        confidence: 0.98,
        bbox: [60, 410, 420, 35]
      },
      {
        image_id: "IMG001",
        text: "MRP ₹185.00 (Inclusive of all taxes)",
        confidence: 0.96,
        bbox: [100, 250, 400, 300]
      },
      {
        image_id: "IMG001",
        text: "Unit Sale Price: ₹0.185 / g",
        confidence: 0.95,
        bbox: [60, 495, 260, 30]
      },
      {
        image_id: "IMG001",
        text: "Net Quantity: 1000 g (1 kg)",
        confidence: 0.96,
        bbox: [60, 535, 290, 35]
      },
      {
        image_id: "IMG001",
        text: "Month & Year of Pkg: 08/2026",
        confidence: 0.94,
        bbox: [60, 575, 300, 35]
      },
      {
        image_id: "IMG001",
        text: "Mfd by: Sparkle Care Ltd, Phase II, Vapi, Gujarat",
        confidence: 0.92,
        bbox: [60, 615, 430, 35]
      },
      {
        image_id: "IMG001",
        text: "Toll-free Care: 1800-889-1122 | feedback@sparkle.co.in",
        confidence: 0.95,
        bbox: [60, 655, 450, 35]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "Ultra Clean Detergent Powder",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [60, 410, 420, 35], text: "Ultra Clean Detergent Powder" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹185.00 (Inclusive of all taxes)",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [100, 250, 400, 300], text: "MRP ₹185.00" }
      },
      {
        field: "usp",
        label: "Unit Sale Price (USP)",
        detected_value: "₹0.185 / g",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [60, 495, 260, 30], text: "Unit Sale Price: ₹0.185 / g" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity Declaration",
        detected_value: "1000 g (1 kg)",
        is_detected: true,
        confidence: 0.96,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [60, 535, 290, 35], text: "Net Quantity: 1000 g (1 kg)" }
      },
      {
        field: "consumer_care",
        label: "Consumer Care Details",
        detected_value: "1800-889-1122 | feedback@sparkle.co.in",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [60, 655, 450, 35], text: "Toll-free Care: 1800-889-1122" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.96,
    officer_decision: {
      decision: "APPROVED",
      remarks: "Verified USP calculation and declaration font sizes under 2021/2022 amendments.",
      reviewed_at: "2026-09-06T16:00:00Z",
      finding_decisions: {}
    }
  },

  // 7. Multiple Package Images (Front, Back, Side, Close-up)
  "INS-2024-007": {
    id: "INS-2024-007",
    docket_number: "LMO/ZN4/2026/0897",
    timestamp: "2026-09-06T11:00:00Z",
    product: {
      name: "NutriCrunch Rolled Oats 1kg",
      brand: "NutriCrunch Organics",
      category: "Cereals & Breakfast",
      batch_number: "NC-RO-55",
      declared_net_quantity: "1 kg",
      mrp: "₹210.00"
    },
    image_quality_status: {
      status: "ACCEPTABLE",
      score: 0.93,
      laplacian_variance: 410.0,
      description: "Full 4-panel photographic evidence package provided."
    },
    uploaded_images: [
      {
        image_id: "IMG001",
        role: "front",
        name: "oats_front.jpg",
        url: createPackageIllustration("NutriCrunch Rolled Oats", "Role: FRONT Panel"),
        quality: { status: "ACCEPTABLE", score: 0.95 }
      },
      {
        image_id: "IMG002",
        role: "back",
        name: "oats_back.jpg",
        url: createPackageIllustration("NutriCrunch Rolled Oats", "Role: BACK Nutritional Panel"),
        quality: { status: "ACCEPTABLE", score: 0.92 }
      },
      {
        image_id: "IMG003",
        role: "side",
        name: "oats_side.jpg",
        url: createPackageIllustration("NutriCrunch Rolled Oats", "Role: SIDE Helpline Panel"),
        quality: { status: "ACCEPTABLE", score: 0.91 }
      },
      {
        image_id: "IMG004",
        role: "close-up",
        name: "oats_mrp_stamp.jpg",
        url: createPackageIllustration("NutriCrunch Rolled Oats", "Role: CLOSE-UP MRP & Date Stamp"),
        quality: { status: "ACCEPTABLE", score: 0.97 }
      }
    ],
    ocr_results: [
      {
        image_id: "IMG001",
        text: "NutriCrunch 100% Whole Grain Rolled Oats",
        confidence: 0.98,
        bbox: [60, 270, 480, 50]
      },
      {
        image_id: "IMG002",
        text: "Country of Origin: Australia. Packed in India.",
        confidence: 0.95,
        bbox: [60, 460, 420, 35]
      },
      {
        image_id: "IMG003",
        text: "Customer Helpline: care@nutricrunch.in",
        confidence: 0.94,
        bbox: [60, 520, 380, 35]
      },
      {
        image_id: "IMG004",
        text: "MRP ₹210.00 Net Wt: 1 kg PKD: 08/2026",
        confidence: 0.99,
        bbox: [100, 250, 400, 300]
      }
    ],
    extracted_declarations: [
      {
        field: "product_name",
        label: "Name / Description of Commodity",
        detected_value: "NutriCrunch Rolled Oats",
        is_detected: true,
        confidence: 0.98,
        status: "COMPLIANT",
        evidence: { image_id: "IMG001", bbox: [60, 270, 480, 50], text: "NutriCrunch Rolled Oats" }
      },
      {
        field: "country_of_origin",
        label: "Country of Origin",
        detected_value: "Australia (Packed in India)",
        is_detected: true,
        confidence: 0.95,
        status: "COMPLIANT",
        evidence: { image_id: "IMG002", bbox: [60, 460, 420, 35], text: "Country of Origin: Australia" }
      },
      {
        field: "consumer_care",
        label: "Consumer Care Helpline",
        detected_value: "care@nutricrunch.in",
        is_detected: true,
        confidence: 0.94,
        status: "COMPLIANT",
        evidence: { image_id: "IMG003", bbox: [60, 520, 380, 35], text: "Customer Helpline: care@nutricrunch.in" }
      },
      {
        field: "mrp",
        label: "Maximum Retail Price (MRP)",
        detected_value: "₹210.00",
        is_detected: true,
        confidence: 0.99,
        status: "COMPLIANT",
        evidence: { image_id: "IMG004", bbox: [100, 250, 400, 300], text: "MRP ₹210.00" }
      },
      {
        field: "net_quantity",
        label: "Net Quantity Declaration",
        detected_value: "1 kg",
        is_detected: true,
        confidence: 0.99,
        status: "COMPLIANT",
        evidence: { image_id: "IMG004", bbox: [100, 250, 400, 300], text: "Net Wt: 1 kg" }
      }
    ],
    compliance_findings: [],
    overall_status: "COMPLIANT",
    overall_confidence: 0.97,
    officer_decision: {
      decision: "APPROVED",
      remarks: "Four-panel photographic evidence verifies imported commodity declarations in full.",
      reviewed_at: "2026-09-06T12:00:00Z",
      finding_decisions: {}
    }
  }
};

// Historical Inspections array for History Page
export const HISTORICAL_INSPECTIONS = [
  {
    id: "INS-2024-001",
    docket_number: "LMO/ZN4/2026/0891",
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
    docket_number: "LMO/ZN4/2026/0892",
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
    docket_number: "LMO/ZN4/2026/0893",
    product_name: "Artisan Dark Cocoa Nibs 150g",
    category: "Snacks & Confectionery",
    timestamp: "2026-09-07T10:45:00Z",
    status: "NEEDS_REVIEW",
    confidence: 0.65,
    officer_decision: "PENDING",
    images_count: 1
  },
  {
    id: "INS-2024-004",
    docket_number: "LMO/ZN4/2026/0894",
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
    docket_number: "LMO/ZN4/2026/0895",
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
    docket_number: "LMO/ZN4/2026/0896",
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
    docket_number: "LMO/ZN4/2026/0897",
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
    docket_number: "LMO/ZN4/2026/0898",
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
