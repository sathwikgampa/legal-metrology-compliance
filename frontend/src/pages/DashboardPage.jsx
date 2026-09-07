import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
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
      {/* Page Header with ample breathing room */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Compliance Dashboard</h1>
          <p className="page-subtitle">
            Legal Metrology (Packaged Commodities) Rules, 2011 • Enforcement & Regulatory Analytics
          </p>
        </div>

        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/inspections/new')}
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>New Inspection</span>
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
            <div className="distribution-bar-flat" role="progressbar" aria-label="Compliance Distribution">
              <div
                className="dist-bar-segment seg-emerald"
                style={{ width: `${compliantPct}%` }}
                title={`Compliant: ${compliantPct}%`}
              />
              <div
                className="dist-bar-segment seg-crimson"
                style={{ width: `${violationPct}%` }}
                title={`Potential Violations: ${violationPct}%`}
              />
              <div
                className="dist-bar-segment seg-amber"
                style={{ width: `${reviewPct}%` }}
                title={`Needs Review: ${reviewPct}%`}
              />
            </div>

            {/* Refined Color Legend */}
            <div className="dist-legend-flat">
              <div className="legend-item">
                <span className="legend-dot-refined dot-emerald" />
                <span className="legend-label">Emerald Green (Compliant {compliantPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot-refined dot-crimson" />
                <span className="legend-label">Soft Crimson (Potential Violations {violationPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot-refined dot-amber" />
                <span className="legend-label">Warm Amber (Needs Review {reviewPct}%)</span>
              </div>
            </div>
          </div>

          {/* Elegant Low-Contrast Information Alert Banner */}
          {!alertDismissed && (
            <div className="low-contrast-alert mt-4">
              <div className="low-contrast-icon">
                <Info size={16} />
              </div>
              <div className="low-contrast-content">
                <span className="low-contrast-title">Statutory Compliance Advisory</span>
                <p className="low-contrast-text">
                  Packages flagged with potential violations require formal notice issuance under Section 39. Packages under review warrant secondary visual verification before adjudication.
                </p>
              </div>
              <button
                className="low-contrast-dismiss"
                onClick={() => setAlertDismissed(true)}
                aria-label="Dismiss alert"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Category Audit Breakdown Card */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Category Audit Breakdown</h3>
            <span className="card-subtitle">
              Inspections sorted by commodity domain
            </span>
          </div>

          <div className="category-audit-list">
            {(stats?.category_breakdown || []).map((cat, idx) => {
              const isNonCompliant = cat.violations > 0;
              return (
                <div key={idx} className="category-audit-row">
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
