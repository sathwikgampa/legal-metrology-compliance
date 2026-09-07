import React from 'react';

/**
 * Single source of truth for rendering compliance statuses across dashboard, results, and history.
 * Strictly adheres to prompt constraints:
 * - 🟢 COMPLIANT
 * - 🔴 POTENTIAL VIOLATION
 * - 🟡 NEEDS REVIEW
 * - Never renders "not detected" as "not present"
 */
export default function ComplianceStatus({ status, size = "md", iconOnly = false }) {
  const normalized = (status || "").toUpperCase();

  switch (normalized) {
    case "COMPLIANT":
      return (
        <span className={`status-badge status-compliant status-${size}`} title="Fully Compliant with Packaged Commodities Rules">
          <span className="status-indicator">🟢</span>
          {!iconOnly && <span className="status-text">COMPLIANT</span>}
        </span>
      );

    case "POTENTIAL_VIOLATION":
      return (
        <span className={`status-badge status-violation status-${size}`} title="Potential Non-Compliance Identified">
          <span className="status-indicator">🔴</span>
          {!iconOnly && <span className="status-text">POTENTIAL VIOLATION</span>}
        </span>
      );

    case "NEEDS_REVIEW":
      return (
        <span className={`status-badge status-review status-${size}`} title="Uncertain Evidence — Requires Officer Examination">
          <span className="status-indicator">🟡</span>
          {!iconOnly && <span className="status-text">NEEDS REVIEW</span>}
        </span>
      );

    case "NOT_DETECTED":
      return (
        <span className={`status-badge status-not-detected status-${size}`} title="Mandatory declaration was not detected by OCR in scanned surfaces">
          <span className="status-indicator">⚠️</span>
          {!iconOnly && <span className="status-text">NOT DETECTED ON PACKAGE</span>}
        </span>
      );

    default:
      return (
        <span className={`status-badge status-unknown status-${size}`}>
          <span className="status-indicator">⚪</span>
          {!iconOnly && <span className="status-text">{status || "PENDING"}</span>}
        </span>
      );
  }
}
