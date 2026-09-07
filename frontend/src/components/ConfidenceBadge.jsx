import React from 'react';

/**
 * Reusable confidence badge providing a unified visual scale for OCR and compliance confidence scores.
 * High (>= 90%), Medium (70-89%), Low (< 70%)
 */
export default function ConfidenceBadge({ value, showLabel = true, size = "md" }) {
  if (value === null || value === undefined) {
    return <span className="conf-badge conf-unknown">N/A</span>;
  }

  const numeric = typeof value === "number" ? value : parseFloat(value);
  const percentage = Math.round(numeric <= 1.0 ? numeric * 100 : numeric);

  let bandClass = "conf-high";
  let labelText = "High";

  if (percentage < 70) {
    bandClass = "conf-low";
    labelText = "Low";
  } else if (percentage < 90) {
    bandClass = "conf-med";
    labelText = "Medium";
  }

  return (
    <span className={`conf-badge ${bandClass} conf-size-${size}`} title={`OCR Confidence: ${percentage}%`}>
      <span className="conf-dot" />
      <span className="conf-pct">{percentage}%</span>
      {showLabel && <span className="conf-label">({labelText})</span>}
    </span>
  );
}
