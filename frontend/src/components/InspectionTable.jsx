import React from 'react';
import { Link } from 'react-router-dom';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';

export default function InspectionTable({ inspections = [], emptyMessage = "No inspections recorded yet." }) {
  if (!inspections || inspections.length === 0) {
    return (
      <div className="table-empty-box">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const renderOfficerDecision = (decision) => {
    const val = (decision || "PENDING").toUpperCase();
    if (val === "APPROVED" || val === "CONFIRMED") {
      return <span className="decision-tag decision-approved">Approved</span>;
    }
    if (val === "REJECTED") {
      return <span className="decision-tag decision-rejected">Notice Issued</span>;
    }
    if (val === "FURTHER_INSPECTION") {
      return <span className="decision-tag decision-further">Further Inspection</span>;
    }
    return <span className="decision-tag decision-pending">Pending Review</span>;
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th>Inspection ID</th>
            <th>Commodity / Product</th>
            <th>Category</th>
            <th>Compliance Status</th>
            <th>Confidence</th>
            <th>Officer Sign-off</th>
            <th>Audit Date</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((item) => (
            <tr key={item.id} className="table-row-hover">
              <td className="font-mono text-bold">
                <Link to={`/inspections/${item.id}`} className="link-table-id">
                  {item.id}
                </Link>
              </td>
              <td>
                <div className="product-cell-name">{item.product_name}</div>
                {item.images_count && (
                  <span className="product-cell-sub">📷 {item.images_count} image(s)</span>
                )}
              </td>
              <td>
                <span className="category-pill">{item.category}</span>
              </td>
              <td>
                <ComplianceStatus status={item.status} size="sm" />
              </td>
              <td>
                <ConfidenceBadge value={item.confidence} size="sm" showLabel={false} />
              </td>
              <td>
                {renderOfficerDecision(item.officer_decision)}
              </td>
              <td className="text-muted text-sm">
                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
              </td>
              <td className="text-right">
                <Link to={`/inspections/${item.id}`} className="btn btn-outline btn-xs">
                  View Audit →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
