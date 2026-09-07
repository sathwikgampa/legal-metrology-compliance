import React from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';

export default function DeclarationTable({ declarations = [], onViewEvidence }) {
  if (!declarations || declarations.length === 0) {
    return (
      <div className="table-empty-box">
        <p>No declaration data available for this package.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table declarations-table">
        <thead>
          <tr>
            <th>Mandatory Declaration (Rule 6)</th>
            <th>Extracted Detected Value</th>
            <th>System Status</th>
            <th>Confidence</th>
            <th className="text-right">Evidence Traceability</th>
          </tr>
        </thead>
        <tbody>
          {declarations.map((decl, idx) => {
            const isDetected = decl.is_detected !== false && decl.detected_value && decl.detected_value.trim() !== "";
            const isNotDetected = !isDetected || decl.status === "NOT_DETECTED";

            return (
              <tr key={idx} className={isNotDetected ? 'row-not-detected' : ''}>
                <td>
                  <div className="decl-label font-bold">{decl.label || decl.field}</div>
                  <div className="decl-field-code font-mono text-xs text-muted">{decl.field}</div>
                </td>
                <td>
                  {isDetected ? (
                    <span className="detected-val font-mono">{decl.detected_value}</span>
                  ) : (
                    <div className="not-detected-cell">
                      <span className="badge-warning-soft">⚠️ NOT DETECTED IN SCAN</span>
                      <span className="not-detected-disclaimer">
                        (Not detected by OCR does not confirm absence from physical package)
                      </span>
                    </div>
                  )}
                </td>
                <td>
                  <ComplianceStatus status={decl.status} size="sm" />
                </td>
                <td>
                  {isDetected ? (
                    <ConfidenceBadge value={decl.confidence} size="sm" />
                  ) : (
                    <span className="text-muted text-xs">N/A (0%)</span>
                  )}
                </td>
                <td className="text-right">
                  {decl.evidence ? (
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      onClick={() => onViewEvidence && onViewEvidence(decl.evidence)}
                      title="Inspect bounding box and panel evidence"
                    >
                      🔎 View Evidence
                    </button>
                  ) : (
                    <span className="text-muted text-xs">No BBox Reference</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
