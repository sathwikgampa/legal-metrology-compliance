import React from 'react';

export default function DashboardCards({ stats }) {
  const data = stats || {
    total_inspections: 0,
    compliant: 0,
    potential_violations: 0,
    needs_review: 0,
    pending_officer_review: 0
  };

  return (
    <div className="metrics-cards-grid">
      <div className="metric-box total-box">
        <div className="metric-box-top">
          <span className="metric-box-label">Total Inspections</span>
          <span className="metric-box-icon">📦</span>
        </div>
        <div className="metric-box-val">{data.total_inspections}</div>
        <div className="metric-box-sub">Processed packages across all zones</div>
      </div>

      <div className="metric-box compliant-box">
        <div className="metric-box-top">
          <span className="metric-box-label">Compliant Packages</span>
          <span className="metric-box-icon">🟢</span>
        </div>
        <div className="metric-box-val text-compliant">{data.compliant}</div>
        <div className="metric-box-sub">Verified mandatory declarations</div>
      </div>

      <div className="metric-box violation-box">
        <div className="metric-box-top">
          <span className="metric-box-label">Potential Violations</span>
          <span className="metric-box-icon">🔴</span>
        </div>
        <div className="metric-box-val text-violation">{data.potential_violations}</div>
        <div className="metric-box-sub">Non-compliant declarations detected</div>
      </div>

      <div className="metric-box review-box">
        <div className="metric-box-top">
          <span className="metric-box-label">Needs Officer Review</span>
          <span className="metric-box-icon">🟡</span>
        </div>
        <div className="metric-box-val text-review">{data.needs_review}</div>
        <div className="metric-box-sub">Uncertain OCR / Marginal clarity</div>
      </div>
    </div>
  );
}
