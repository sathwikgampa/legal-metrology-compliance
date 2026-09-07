import React from 'react';

export default function InspectionTable({ inspections }) {
  const items = inspections || [];

  const renderBadge = (status) => {
    switch (status) {
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
    <div className="table-card">
      <div className="table-header">
        <h2>Recent Inspection Audits</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Total items: {items.length}
        </span>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Inspection ID</th>
            <th>Product Name</th>
            <th>Compliance Status</th>
            <th>Confidence</th>
            <th>Officer Decision</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                No inspection records found. Click "New Inspection" to analyze packaging.
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.id}</td>
                <td>{item.product_name}</td>
                <td>{renderBadge(item.status)}</td>
                <td>{((item.confidence || 0) * 100).toFixed(0)}%</td>
                <td>
                  <span style={{ 
                    fontWeight: 600, 
                    color: item.officer_decision === 'APPROVED' ? '#4ade80' : (item.officer_decision === 'REJECTED' ? '#f87171' : '#facc15') 
                  }}>
                    {item.officer_decision || 'PENDING'}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
