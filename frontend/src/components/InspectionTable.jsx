import React from 'react';
import { Link } from 'react-router-dom';
import ComplianceStatus from './ComplianceStatus';
import ConfidenceBadge from './ConfidenceBadge';

export default function InspectionTable({ inspections = [], emptyMessage = "No inspections recorded yet." }) {
  if (!inspections || inspections.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const renderOfficerDecision = (decision) => {
    const val = (decision || "PENDING").toUpperCase();
    if (val === "APPROVED" || val === "CONFIRMED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
          Approved
        </span>
      );
    }
    if (val === "REJECTED") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
          Notice Issued
        </span>
      );
    }
    if (val === "FURTHER_INSPECTION") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
          Further Inspection
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
        Pending Review
      </span>
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/60 dark:border-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <tr>
            <th className="py-2.5 px-3">Docket ID</th>
            <th className="py-2.5 px-3">Commodity / Product</th>
            <th className="py-2.5 px-3">Category</th>
            <th className="py-2.5 px-3">Compliance Status</th>
            <th className="py-2.5 px-3">Confidence</th>
            <th className="py-2.5 px-3">Officer Sign-off</th>
            <th className="py-2.5 px-3">Audit Date</th>
            <th className="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
          {inspections.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
              <td className="py-2.5 px-3 font-mono font-medium">
                <Link to={`/inspections/${item.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold">
                  {item.id}
                </Link>
              </td>
              <td className="py-2.5 px-3">
                <div className="font-medium text-slate-800 dark:text-slate-200">{item.product_name}</div>
                {item.images_count && (
                  <span className="text-[10px] text-slate-400 block">📷 {item.images_count} image(s)</span>
                )}
              </td>
              <td className="py-2.5 px-3">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {item.category}
                </span>
              </td>
              <td className="py-2.5 px-3">
                <ComplianceStatus status={item.status} size="sm" />
              </td>
              <td className="py-2.5 px-3">
                <ConfidenceBadge value={item.confidence} size="sm" showLabel={false} />
              </td>
              <td className="py-2.5 px-3">
                {renderOfficerDecision(item.officer_decision)}
              </td>
              <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
              </td>
              <td className="py-2.5 px-3 text-right">
                <Link
                  to={`/inspections/${item.id}`}
                  className="inline-flex items-center px-2 py-1 border border-slate-200 text-slate-600 rounded text-[11px] font-medium bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                >
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
