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
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <tr>
            <th className="py-3 px-3.5">Docket ID</th>
            <th className="py-3 px-3.5">Commodity / Product</th>
            <th className="py-3 px-3.5">Category</th>
            <th className="py-3 px-3.5">Compliance Status</th>
            <th className="py-3 px-3.5">Confidence</th>
            <th className="py-3 px-3.5">Officer Sign-off</th>
            <th className="py-3 px-3.5">Audit Date</th>
            <th className="py-3 px-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300">
          {inspections.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3 px-3.5 font-mono font-medium">
                <Link to={`/inspections/${item.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold">
                  {item.id}
                </Link>
              </td>
              <td className="py-3 px-3.5">
                <div className="font-semibold text-slate-800 dark:text-slate-100">{item.product_name}</div>
                {item.images_count && (
                  <span className="text-[10px] text-slate-400 block mt-0.5">📷 {item.images_count} image(s)</span>
                )}
              </td>
              <td className="py-3 px-3.5">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                  {item.category}
                </span>
              </td>
              <td className="py-3 px-3.5">
                <ComplianceStatus status={item.status} size="sm" />
              </td>
              <td className="py-3 px-3.5">
                <ConfidenceBadge value={item.confidence} size="sm" showLabel={false} />
              </td>
              <td className="py-3 px-3.5">
                {renderOfficerDecision(item.officer_decision)}
              </td>
              <td className="py-3 px-3.5 text-slate-400 text-[11px]">
                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
              </td>
              <td className="py-3 px-3.5 text-right">
                <Link
                  to={`/inspections/${item.id}`}
                  className="inline-flex items-center px-2.5 py-1 border border-slate-200 text-slate-700 rounded text-[11px] font-semibold bg-white hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 shadow-xs transition-colors"
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
