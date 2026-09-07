import React, { useState } from 'react';
import { submitOfficerReview } from '../services/api';

export default function OfficerReview({ inspectionId, onReviewSubmitted }) {
  const [decision, setDecision] = useState("APPROVED");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitOfficerReview({
      inspection_id: inspectionId,
      decision,
      remarks
    });
    setIsSubmitting(false);
    setSubmittedMessage(`Officer decision recorded: ${decision}`);
    if (onReviewSubmitted) onReviewSubmitted(res);
  };

  return (
    <div className="table-card" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🧑‍⚖️ Legal Metrology Officer Audit & Sign-Off</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
        Note: The automated OCR engine acts as an inspection assistant. Human officer review constitutes final legal authority.
      </p>

      {submittedMessage ? (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #4ade80', color: '#4ade80', padding: '1rem', borderRadius: '8px' }}>
          ✅ {submittedMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Officer Audit Decision</label>
            <select 
              className="form-select"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
            >
              <option value="APPROVED">✅ APPROVED - Packaging Compliant</option>
              <option value="REJECTED">❌ REJECTED - Violation Notice Issued</option>
              <option value="FLAGGED">⚠️ FLAGGED - Requires Re-inspection / Physical Verification</option>
            </select>
          </div>

          <div className="form-group">
            <label>Officer Audit Remarks & Evidence Notes</label>
            <textarea 
              className="form-textarea"
              rows="3"
              placeholder="Enter official remarks, seizure notes, or compliance remediation notice details..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Record...' : '🔒 Submit Official Decision'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
