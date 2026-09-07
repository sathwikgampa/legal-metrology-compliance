import React from 'react';

export default function DashboardCards({ metrics }) {
  const data = metrics || {
    total_inspections: 0,
    compliant: 0,
    potential_violations: 0,
    needs_review: 0,
    pending_officer_review: 0
  };

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <div className="metric-header">Total Audits</div>
        <div className="metric-value">{data.total_inspections}</div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Processed Packages</div>
      </div>

      <div className="metric-card">
        <div className="metric-header">Compliant</div>
        <div className="metric-value" style={{ color: '#4ade80' }}>
          {data.compliant}
        </div>
        <div style={{ fontSize: '0.8rem' }}>
          <span className="badge badge-compliant">🟢 COMPLIANT</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">Potential Violations</div>
        <div className="metric-value" style={{ color: '#f87171' }}>
          {data.potential_violations}
        </div>
        <div style={{ fontSize: '0.8rem' }}>
          <span className="badge badge-violation">🔴 POTENTIAL VIOLATION</span>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-header">Needs Officer Review</div>
        <div className="metric-value" style={{ color: '#facc15' }}>
          {data.needs_review}
        </div>
        <div style={{ fontSize: '0.8rem' }}>
          <span className="badge badge-review">🟡 NEEDS REVIEW</span>
        </div>
      </div>
    </div>
  );
}
