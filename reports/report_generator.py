import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from typing import Dict, Any

def generate_pdf_report(inspection_data: Dict[str, Any], output_path: str = "inspection_report.pdf") -> str:
    """
    Generates a formal PDF Inspection Report for Legal Metrology Officers using ReportLab.
    """
    doc = SimpleDocTemplate(output_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    styles = getSampleStyleSheet()
    story = []

    # Custom Styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Heading1"],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor("#1e293b"),
        alignment=0, # Left-aligned
        spaceAfter=12
    )

    header_style = ParagraphStyle(
        "DocHeader",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#334155"),
        spaceBefore=14,
        spaceAfter=8
    )

    normal_style = styles["Normal"]
    normal_style.fontSize = 10
    normal_style.leading = 14

    # 1. Document Title
    story.append(Paragraph("<b>LEGAL METROLOGY COMPLIANCE INSPECTION REPORT</b>", title_style))
    story.append(Paragraph("Generated under the Legal Metrology (Packaged Commodities) Rules, 2011", normal_style))
    story.append(Spacer(1, 15))

    # 2. Inspection Overview Table
    insp_id = inspection_data.get("inspection_id", "INS-MOCK-001")
    status = inspection_data.get("status", "NEEDS_REVIEW")
    confidence = inspection_data.get("confidence", 0.85)
    officer_dec = inspection_data.get("officer_decision", "PENDING")

    status_color = "#16a34a" if status == "COMPLIANT" else ("#dc2626" if status == "POTENTIAL_VIOLATION" else "#d97706")

    overview_data = [
        [Paragraph("<b>Inspection ID:</b>", normal_style), Paragraph(str(insp_id), normal_style)],
        [Paragraph("<b>Compliance Status:</b>", normal_style), Paragraph(f"<font color='{status_color}'><b>{status}</b></font>", normal_style)],
        [Paragraph("<b>Confidence Score:</b>", normal_style), Paragraph(f"{float(confidence)*100:.1f}%", normal_style)],
        [Paragraph("<b>Officer Decision:</b>", normal_style), Paragraph(str(officer_dec), normal_style)]
    ]

    overview_table = Table(overview_data, colWidths=[150, 380])
    overview_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(overview_table)
    story.append(Spacer(1, 15))

    # 3. Product Declarations Table
    story.append(Paragraph("<b>Extracted Product Profile Declarations</b>", header_style))
    profile = inspection_data.get("product_profile", {})

    product_data = [
        [Paragraph("<b>Declaration Field</b>", normal_style), Paragraph("<b>Extracted Value</b>", normal_style)],
        [Paragraph("Product Name", normal_style), Paragraph(profile.get("product_name", "N/A"), normal_style)],
        [Paragraph("Manufacturer / Packer", normal_style), Paragraph(profile.get("manufacturer", "N/A"), normal_style)],
        [Paragraph("Net Quantity", normal_style), Paragraph(profile.get("net_quantity", "N/A"), normal_style)],
        [Paragraph("MRP (incl. of taxes)", normal_style), Paragraph(profile.get("mrp", "N/A"), normal_style)],
        [Paragraph("Mfg / Packing Date", normal_style), Paragraph(profile.get("date", "N/A"), normal_style)],
        [Paragraph("Consumer Care Details", normal_style), Paragraph(profile.get("consumer_care", "NOT DETECTED"), normal_style)],
        [Paragraph("Country of Origin", normal_style), Paragraph(profile.get("country_of_origin", "N/A"), normal_style)],
    ]

    product_table = Table(product_data, colWidths=[180, 350])
    product_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(product_table)
    story.append(Spacer(1, 15))

    # 4. Identified Violations
    story.append(Paragraph("<b>Identified Compliance Violations</b>", header_style))
    violations = inspection_data.get("violations", [])

    if not violations:
        story.append(Paragraph("<font color='#16a34a'>No rule violations detected. Product packaging conforms to mandatory requirements.</font>", normal_style))
    else:
        v_data = [[Paragraph("<b>Field</b>", normal_style), Paragraph("<b>Issue Description</b>", normal_style), Paragraph("<b>Severity</b>", normal_style), Paragraph("<b>Rule Reference</b>", normal_style)]]
        for v in violations:
            v_data.append([
                Paragraph(v.get("field", ""), normal_style),
                Paragraph(v.get("issue", ""), normal_style),
                Paragraph(f"<font color='#dc2626'><b>{v.get('severity', 'MEDIUM')}</b></font>", normal_style),
                Paragraph(v.get("rule_reference", ""), normal_style)
            ])
        v_table = Table(v_data, colWidths=[90, 210, 70, 160])
        v_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#334155")),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(v_table)

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Officer Remarks / Sign-off:</b>", normal_style))
    remarks = inspection_data.get("officer_remarks", "Pending final officer review and signature.")
    story.append(Paragraph(f"<i>{remarks}</i>", normal_style))

    doc.build(story)
    return output_path

if __name__ == "__main__":
    mock_data = {
        "inspection_id": "INS-TEST-101",
        "status": "POTENTIAL_VIOLATION",
        "confidence": 0.91,
        "officer_decision": "PENDING",
        "officer_remarks": "Consumer care details missing on primary panel.",
        "product_profile": {
            "product_name": "Premium Basmati Rice 5kg",
            "manufacturer": "Global Agro Products Ltd",
            "net_quantity": "5 kg",
            "mrp": "₹450",
            "date": "05/2026",
            "consumer_care": "",
            "country_of_origin": "India"
        },
        "violations": [
            {
                "field": "consumer_care",
                "issue": "Consumer care contact (phone/email) missing from package",
                "severity": "HIGH",
                "confidence": 0.95,
                "rule_reference": "Rule 6(1)(ac) - Consumer Care Details"
            }
        ]
    }
    out = generate_pdf_report(mock_data, "test_inspection_report.pdf")
    print(f"Sample inspection report PDF successfully generated at: {out}")
