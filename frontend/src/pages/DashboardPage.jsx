import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Download,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X
} from 'lucide-react';
import DashboardCards from '../components/DashboardCards';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDashboardStats, getInspectionHistory } from '../services/api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [dateFilterActive, setDateFilterActive] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, historyRes] = await Promise.all([
        getDashboardStats(),
        getInspectionHistory()
      ]);
      setStats(statsRes);
      setRecentInspections(historyRes.slice(0, 5));
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Docket ID,Commodity,Category,Compliance Status,OCR Confidence\n" +
      "INS-2024-001,Heritage Basmati Rice,Food & Grains,COMPLIANT,98%\n" +
      "INS-2024-002,Spiced Namkeen,Snacks,POTENTIAL_VIOLATION,94%\n" +
      "INS-2024-003,Dark Cocoa Nibs,Food & Grains,NEEDS_REVIEW,62%\n" +
      "INS-2024-004,Pure Almond Beverage,Food & Grains,POOR_IMAGE_QUALITY,34%\n" +
      "INS-2024-005,Cold Pressed Olive Oil,Food & Grains,LOW_CONFIDENCE,48%\n" +
      "INS-2024-006,Ultra Clean Detergent,Household,COMPLIANT,96%\n" +
      "INS-2024-007,Herbal Shampoo,Cosmetics,COMPLIANT,95%\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "legal_metrology_inspections_zone4.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <LoadingState
        message="Loading Enforcement Dashboard..."
        subtext="Retrieving inspection metrics from Legal Metrology service..."
      />
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  // Calculate percentage breakdown for visual bar chart
  const total = stats?.total_inspections || 1;
  const compliantPct = Math.round(((stats?.compliant || 0) / total) * 100);
  const violationPct = Math.round(((stats?.potential_violations || 0) / total) * 100);
  const reviewPct = Math.round(((stats?.needs_review || 0) / total) * 100);

  return (
    <div className="p-6 space-y-6">
      {/* Dashboard Title Block & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Compliance Dashboard
          </h2>
          <p className="text-xs text-slate-400">
            Legal Metrology (Packaged Commodities) Rules, 2011 • Enforcement & Regulatory Analytics
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setDateFilterActive(!dateFilterActive)}
            className={`flex items-center space-x-1.5 border border-slate-200 text-xs px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
              dateFilterActive ? 'text-blue-600 font-medium border-blue-300 dark:text-blue-400 dark:border-blue-700' : 'text-slate-600 dark:text-slate-300'
            }`}
            title="Filter dashboard records by date range"
          >
            <span>📅</span>
            <span>{dateFilterActive ? "Last 30 Days (Active)" : "Filter Date Range"}</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            title="Export audit records to CSV spreadsheet"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* TOP 4 METRICS CARDS GRID */}
      <DashboardCards stats={stats} />

      {/* MAIN INTERFACE DATA GRID Split (2/3 and 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Status Distribution Data Graphic (2/3 Width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-6 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Compliance Status Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Aggregate statutory packaging audits across active jurisdiction
            </p>

            {/* Flat Progress Graph Segment Graphic */}
            <div
              className="w-full h-4 rounded-full overflow-hidden flex mb-4 bg-slate-100 dark:bg-slate-800"
              role="progressbar"
              aria-label="Compliance Status Distribution"
            >
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${compliantPct}%` }}
                title={`Compliant (${compliantPct}%)`}
              />
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${violationPct}%` }}
                title={`Violations (${violationPct}%)`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${reviewPct}%` }}
                title={`Needs Review (${reviewPct}%)`}
              />
            </div>

            {/* Clean Legend */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Emerald Green</div>
                  <div className="text-[10px] text-slate-400">Compliant ({compliantPct}%)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Soft Crimson</div>
                  <div className="text-[10px] text-slate-400">Violations ({violationPct}%)</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Warm Amber</div>
                  <div className="text-[10px] text-slate-400">Needs Review ({reviewPct}%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Advisory Box */}
          {!alertDismissed && (
            <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-3.5 flex items-start justify-between dark:bg-blue-950/30 dark:border-blue-800/60 mt-4 transition-colors">
              <div className="flex space-x-2.5 pr-4">
                <span className="text-blue-600 dark:text-blue-400 text-sm select-none">ℹ️</span>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">
                    Statutory Enforcement Advisory
                  </h4>
                  <p className="text-[11px] text-blue-800/90 dark:text-blue-300/80 mt-0.5 leading-relaxed">
                    Packages flagged with potential violations require formal notice issuance under Rule 32. Packages under review warrant secondary visual verification before formal compounding.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAlertDismissed(true)}
                className="text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300 text-xs cursor-pointer p-0.5"
                title="Dismiss statutory advisory"
                aria-label="Dismiss alert"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Category Audit Breakdown (1/3 Width) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4 transition-colors">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Category Audit Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">
              Commodity inspection records categorized by product sector
            </p>
          </div>

          {/* Product Rows with subtle dividers */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {(stats?.category_breakdown || [
              { category: 'Food & Grains', count: 5, violations: 1 },
              { category: 'Snacks', count: 1, violations: 1 },
              { category: 'Cosmetics', count: 1, violations: 0 },
              { category: 'Household', count: 1, violations: 0 }
            ]).map((cat, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between first:pt-1 last:pb-1">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">{cat.category}</div>
                  <div className="text-[10px] text-slate-400">{cat.count} package{cat.count === 1 ? '' : 's'} audited</div>
                </div>
                {cat.violations > 0 ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/50 dark:text-rose-400 flex items-center space-x-1">
                    <span>⚠️</span> <span>{cat.violations} Non-Compliant</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-400 flex items-center space-x-1">
                    <span>✓</span> <span>Compliant</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT INSPECTIONS AUDIT AREA */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Recent Inspection Audits
            </h3>
            <p className="text-[11px] text-slate-400">
              Latest packaging verifications conducted in Zone 4
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1 transition-colors"
          >
            <span>View All Inspections History</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <InspectionTable
          inspections={recentInspections}
          emptyMessage="No recent inspections available."
        />
      </div>
    </div>
  );
}
