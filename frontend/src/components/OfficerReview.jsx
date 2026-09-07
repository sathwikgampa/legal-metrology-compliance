import React, { useState } from 'react';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';

export default function OfficerReview({
  inspection,
  onSubmitDecision,
  isSubmitting = false
}) {
  const findings = inspection?.compliance_findings || [];
  const existingDecision = inspection?.officer_decision || {};

  // Store per-finding decisions: findingId -> 'CONFIRMED' | 'REJECTED' | 'FURTHER_INSPECTION'
  const [findingDecisions, setFindingDecisions] = useState(
    existingDecision.finding_decisions || {}
  );

  const [overallDecision, setOverallDecision] = useState(
    existingDecision.decision && existingDecision.decision !== 'PENDING'
      ? existingDecision.decision
      : 'APPROVED'
  );

  const [remarks, setRemarks] = useState(existingDecision.remarks || '');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleFindingAction = (findingId, action) => {
    setFindingDecisions((prev) => ({
      ...prev,
      [findingId]: action
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      decision: overallDecision,
      remarks,
      finding_decisions: findingDecisions
    };

    if (onSubmitDecision) {
      await onSubmitDecision(payload);
      setSubmittedSuccess(true);
    }
  };

  return (
    <div className="officer-review-component">
      <div className="review-split-columns">
        {/* LEFT COLUMN: SYSTEM / AI ASSESSMENT */}
        <div className="review-pane system-assessment-pane">
          <div className="pane-header">
            <span className="pane-badge badge-ai">🤖 SYSTEM / AI ASSESSMENT</span>
            <h3 className="pane-title">Preliminary OCR & Rule Engine Findings</h3>
            <p className="pane-desc">
              Algorithmic verification under Legal Metrology Rules, 2011. Non-binding inspection assistance.
            </p>
          </div>

          <div className="system-summary-box">
            <div className="summary-row">
              <span className="summary-label">Automated System Verdict:</span>
              <ComplianceStatus status={inspection?.overall_status} size="md" />
            </div>
            <div className="summary-row">
              <span className="summary-label">Aggregate Detection Confidence:</span>
              <ConfidenceBadge value={inspection?.overall_confidence} size="md" />
            </div>
            <div className="summary-row">
              <span className="summary-label">Image Quality Assessment:</span>
              <span className={`quality-chip quality-${(inspection?.image_quality_status?.status || 'acceptable').toLowerCase()}`}>
                {inspection?.image_quality_status?.status || 'ACCEPTABLE'} (Sharpness: {inspection?.image_quality_status?.score || 0.9})
              </span>
            </div>
          </div>

          <div className="findings-evaluation-list">
            <h4 className="findings-list-title">Identified Potential Findings ({findings.length})</h4>

            {findings.length === 0 ? (
              <div className="no-violations-alert">
                <span>🟢 All mandatory packaging declarations were successfully detected with high confidence.</span>
              </div>
            ) : (
              findings.map((fnd) => (
                <div key={fnd.id} className="finding-assessment-card">
                  <div className="fnd-top">
                    <span className="fnd-issue font-bold">{fnd.issue}</span>
                    <ConfidenceBadge value={fnd.confidence} size="sm" />
                  </div>
                  <p className="fnd-reason text-sm">{fnd.explanation}</p>
                  <div className="fnd-statute text-xs font-mono text-muted">
                    Rule Ref: {fnd.rule_reference}
                  </div>

                  {fnd.evidence && (
                    <div className="fnd-evidence-box text-xs font-mono">
                      Evidence: {fnd.evidence.text}
                    </div>
                  )}

                  {/* Officer action buttons per finding */}
                  <div className="fnd-action-row">
                    <span className="action-row-label">Officer Finding Action:</span>
                    <div className="btn-group-segmented">
                      <button
                        type="button"
                        className={`seg-btn ${findingDecisions[fnd.id] === 'CONFIRMED' ? 'seg-active-danger' : ''}`}
                        onClick={() => handleFindingAction(fnd.id, 'CONFIRMED')}
                      >
                        Confirm Finding
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${findingDecisions[fnd.id] === 'REJECTED' ? 'seg-active-success' : ''}`}
                        onClick={() => handleFindingAction(fnd.id, 'REJECTED')}
                      >
                        Reject Finding
                      </button>
                      <button
                        type="button"
                        className={`seg-btn ${findingDecisions[fnd.id] === 'FURTHER_INSPECTION' ? 'seg-active-warning' : ''}`}
                        onClick={() => handleFindingAction(fnd.id, 'FURTHER_INSPECTION')}
                      >
                        Further Inspection
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICER FINAL DECISION */}
        <div className="review-pane officer-decision-pane">
          <div className="pane-header">
            <span className="pane-badge badge-officer">🧑‍⚖️ OFFICER FINAL DECISION</span>
            <h3 className="pane-title">Statutory Audit Sign-off & Orders</h3>
            <p className="pane-desc">
              Final legal determination authorized by the Legal Metrology Officer. Supersedes AI assessments.
            </p>
          </div>

          {submittedSuccess && (
            <div className="alert alert-success" role="status">
              <span>✅ Official legal determination recorded successfully in the audit log.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="officer-decision-form">
            <div className="form-field">
              <label className="field-label font-bold">Official Statutory Decision *</label>
              <select
                className="select-input"
                value={overallDecision}
                onChange={(e) => setOverallDecision(e.target.value)}
                required
              >
                <option value="APPROVED">✅ APPROVED — Packaging Compliant with Rules</option>
                <option value="REJECTED">❌ REJECTED — Non-Compliance Notice / Seizure Order</option>
                <option value="FURTHER_INSPECTION">⚠️ FURTHER INSPECTION — Physical Sample Verification Required</option>
              </select>
              <span className="field-help">
                Select final enforcement determination under Section 18 of Legal Metrology Act, 2009.
              </span>
            </div>

            <div className="form-field">
              <label className="field-label font-bold">Official Remarks & Evidence Justification *</label>
              <textarea
                className="textarea-input"
                rows="6"
                placeholder="Enter mandatory inspection notes, packaging panel observations, manufacturer notice references, or sample dispatch notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>

            <div className="officer-signature-block">
              <div className="sig-details">
                <span className="sig-name">Officer: S. Sharma, ID: LMO-ZONE4-88</span>
                <span className="sig-time">Timestamp: {new Date().toLocaleString()}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting ? '🔒 Recording Legal Decision...' : '🔒 Submit Official Decision'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
