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
    <div className="page-container dashboard-page">
      {/* Page Header with ample whitespace & secondary action button replacing duplicate */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="page-subtitle">
            Legal Metrology (Packaged Commodities) Rules, 2011 • Enforcement & Regulatory Analytics
          </p>
        </div>

        {/* Secondary action buttons with outline & subtle gray text */}
        <div className="header-actions">
          <button
            className={`btn btn-outline btn-secondary-action ${dateFilterActive ? 'active-filter' : ''}`}
            onClick={() => setDateFilterActive(!dateFilterActive)}
            title="Filter dashboard records by date range"
          >
            <Calendar size={15} className="btn-icon-subtle" />
            <span>{dateFilterActive ? "Last 30 Days (Active)" : "Filter Date Range"}</span>
          </button>

          <button
            className="btn btn-outline btn-secondary-action"
            onClick={handleExportCSV}
            title="Export audit records to CSV spreadsheet"
          >
            <Download size={15} className="btn-icon-subtle" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <DashboardCards stats={stats} />

      {/* Analytics Grid: Compliance Status Distribution & Category Audit Breakdown */}
      <div className="dashboard-grid-2col">
        {/* Compliance Status Distribution Card */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Compliance Status Distribution</h3>
            <span className="card-subtitle">
              Aggregate statutory packaging audits across active jurisdiction
            </span>
          </div>

          <div className="distribution-bar-wrap">
            {/* Modern flat horizontal stacked progress bar */}
            <div
              className="distribution-bar-flat"
              role="progressbar"
              aria-label="Compliance Status Distribution"
            >
              <div
                className="dist-bar-segment seg-emerald"
                style={{ width: `${compliantPct}%` }}
                title={`Emerald Green: Compliant ${compliantPct}%`}
              />
              <div
                className="dist-bar-segment seg-crimson"
                style={{ width: `${violationPct}%` }}
                title={`Soft Crimson: Potential Violations ${violationPct}%`}
              />
              <div
                className="dist-bar-segment seg-amber"
                style={{ width: `${reviewPct}%` }}
                title={`Warm Amber: Needs Review ${reviewPct}%`}
              />
            </div>

            {/* Refined Color Legend: Distributed evenly across card width in a single horizontal row */}
            <div className="dist-legend-distributed" role="list">
              <div className="legend-dist-col" role="listitem">
                <div className="legend-dot-refined dot-emerald" aria-hidden="true" />
                <div className="legend-dist-meta">
                  <span className="legend-dist-name">Emerald Green</span>
                  <span className="legend-dist-val">Compliant ({compliantPct}%)</span>
                </div>
              </div>

              <div className="legend-dist-col" role="listitem">
                <div className="legend-dot-refined dot-crimson" aria-hidden="true" />
                <div className="legend-dist-meta">
                  <span className="legend-dist-name">Soft Crimson</span>
                  <span className="legend-dist-val">Violations ({violationPct}%)</span>
                </div>
              </div>

              <div className="legend-dist-col" role="listitem">
                <div className="legend-dot-refined dot-amber" aria-hidden="true" />
                <div className="legend-dist-meta">
                  <span className="legend-dist-name">Warm Amber</span>
                  <span className="legend-dist-val">Needs Review ({reviewPct}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elegant Low-Contrast Information Alert Banner */}
          {!alertDismissed && (
            <div className="low-contrast-alert mt-4" role="status">
              <div className="low-contrast-icon">
                <Info size={16} />
              </div>
              <div className="low-contrast-content">
                <span className="low-contrast-title">Statutory Enforcement Advisory</span>
                <p className="low-contrast-text">
                  Packages flagged with non-compliant declarations require notice issuance under Rule 32. Packages under review warrant secondary visual verification before formal compounding.
                </p>
              </div>
              <button
                className="low-contrast-dismiss"
                onClick={() => setAlertDismissed(true)}
                aria-label="Dismiss alert"
                title="Dismiss statutory advisory"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Category Audit Breakdown Card */}
        <div className="content-card category-audit-card">
          <div className="card-header">
            <h3 className="card-title">Category Audit Breakdown</h3>
            <span className="card-subtitle">
              Commodity inspection records categorized by product sector
            </span>
          </div>

          {/* Clean product rows with subtle light-gray horizontal dividers */}
          <div className="category-audit-list" role="list">
            {(stats?.category_breakdown || []).map((cat, idx) => {
              const isNonCompliant = cat.violations > 0;
              return (
                <div key={idx} className="category-audit-row" role="listitem">
                  <div className="cat-row-info">
                    <span className="cat-row-name">{cat.category}</span>
                    <span className="cat-row-count">{cat.count} packages audited</span>
                  </div>

                  <div className="cat-row-badge">
                    {isNonCompliant ? (
                      <span className="badge-audit-warning">
                        <AlertTriangle size={13} className="badge-icon-warning" />
                        <span>{cat.violations} Non-Compliant</span>
                      </span>
                    ) : (
                      <span className="badge-audit-compliant">
                        <CheckCircle2 size={13} className="badge-icon-compliant" />
                        <span>Compliant</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Inspections Ledger Table */}
      <div className="content-card mt-4">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Recent Inspection Audits</h3>
            <span className="card-subtitle">
              Latest packaging verifications conducted in Zone 4
            </span>
          </div>
          <Link to="/history" className="link-view-all">
            <span>View All Inspections History</span>
            <ArrowRight size={14} />
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
