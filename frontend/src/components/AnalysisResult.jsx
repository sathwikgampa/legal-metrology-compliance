import React from 'react';

export default function AnalysisResult({ result }) {
  if (!result) return null;

  const { product_profile, compliance_result } = result;
  const status = compliance_result?.status || "NEEDS_REVIEW";
  const confidence = compliance_result?.confidence || 0;
  const violations = compliance_result?.violations || [];

  const getStatusBadge = (st) => {
    switch (st) {
      case "COMPLIANT":
        return <span className="badge badge-compliant">🟢 COMPLIANT</span>;
      case "POTENTIAL_VIOLATION":
        return <span className="badge badge-violation">🔴 POTENTIAL VIOLATION</span>;
      case "NEEDS_REVIEW":
      default:
        return <span className="badge badge-review">🟡 NEEDS REVIEW</span>;
    }
  };

  return (
    <div className="table-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analysis & Compliance Results</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Confidence Score: {(confidence * 100).toFixed(1)}%
          </span>
        </div>
        <div>{getStatusBadge(status)}</div>
      </div>

      {/* Declarations Grid */}
      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
        Extracted Mandatory Declarations (Rule 6)
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {Object.entries(product_profile || {}).map(([key, val]) => {
          if (key === 'other_declarations') return null;
          const displayKey = key.replace(/_/g, ' ').toUpperCase();
          const isMissing = !val || val === '';
          return (
            <div 
              key={key} 
              style={{
                backgroundColor: 'rgba(0,0,0,0.25)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: isMissing ? '1px solid rgba(239,68,68,0.3)' : '1px solid var(--border-color)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{displayKey}</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem', color: isMissing ? '#f87171' : 'var(--text-main)' }}>
                {isMissing ? '⚠️ NOT DETECTED' : val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Violations List */}
      {violations.length > 0 && (
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#f87171', marginBottom: '0.75rem' }}>
            ⚠️ Potential Non-Compliance Items ({violations.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {violations.map((v, idx) => (
              <div 
                key={idx}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '1rem',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                  <span style={{ color: '#f87171' }}>Field: {v.field}</span>
                  <span style={{ fontSize: '0.8rem', color: '#f87171' }}>Severity: {v.severity}</span>
                </div>
                <p style={{ fontSize: '0.85rem', marginTop: '0.3rem', color: 'var(--text-main)' }}>{v.issue}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Rule Reference: {v.rule_reference}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
