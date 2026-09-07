import React from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';

export default function ViolationCard({ finding, onViewEvidence }) {
  if (!finding) return null;

  const severityClass = `severity-${(finding.severity || 'MEDIUM').toLowerCase()}`;

  return (
    <div className={`violation-card ${severityClass}`}>
      <div className="violation-card-header">
        <div className="violation-header-left">
          <span className={`severity-tag ${severityClass}`}>
            {finding.severity || 'MEDIUM'} SEVERITY
          </span>
          <h4 className="violation-issue-title">{finding.issue}</h4>
        </div>

        <div className="violation-header-right">
          <ComplianceStatus status={finding.status} size="sm" />
          <ConfidenceBadge value={finding.confidence} size="sm" />
        </div>
      </div>

      <p className="violation-explanation">{finding.explanation}</p>

      <div className="violation-meta-grid">
        <div className="meta-item">
          <span className="meta-label">Related Declaration:</span>
          <span className="meta-value">{finding.related_declaration}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">Statutory Reference:</span>
          <span className="meta-value font-mono text-xs">{finding.rule_reference}</span>
        </div>

        {finding.source_image && (
          <div className="meta-item">
            <span className="meta-label">Source Panel:</span>
            <span className="meta-value font-mono text-xs">{finding.source_image}</span>
          </div>
        )}
      </div>

      {finding.evidence && (
        <div className="violation-card-footer">
          <div className="evidence-snippet">
            <span className="snippet-label">Evidence Snippet:</span>
            <code className="snippet-text">"{finding.evidence.text || 'Region flagged'}"</code>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onViewEvidence && onViewEvidence(finding.evidence)}
          >
            🔍 Highlight in Evidence Viewer
          </button>
        </div>
      )}
    </div>
  );
}
