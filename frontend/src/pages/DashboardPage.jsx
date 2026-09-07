import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardCards from '../components/DashboardCards';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getDashboardStats, getInspectionHistory } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentInspections, setRecentInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <LoadingState message="Loading Enforcement Dashboard..." subtext="Retrieving inspection metrics from Legal Metrology service..." />;
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
      {/* Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Legal Metrology Compliance Overview</h1>
          <p className="page-subtitle">
            Statutory Packaged Commodities Rules (2011) Enforcement & Auditing Dashboard
          </p>
        </div>

        <div className="header-actions">
          <Link to="/inspections/new" className="btn btn-primary">
            ➕ Start New Audit
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <DashboardCards stats={stats} />

      {/* Compliance Distribution Bar & Category Breakdown */}
      <div className="dashboard-grid-2col">
        {/* Compliance Distribution Card */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Compliance Status Distribution</h3>
            <span className="card-subtitle">Aggregate audits across active jurisdiction</span>
          </div>

          <div className="distribution-bar-wrap">
            <div className="distribution-bar">
              <div
                className="dist-segment dist-compliant"
                style={{ width: `${compliantPct}%` }}
                title={`Compliant: ${compliantPct}%`}
              />
              <div
                className="dist-segment dist-violation"
                style={{ width: `${violationPct}%` }}
                title={`Potential Violations: ${violationPct}%`}
              />
              <div
                className="dist-segment dist-review"
                style={{ width: `${reviewPct}%` }}
                title={`Needs Review: ${reviewPct}%`}
              />
            </div>

            <div className="dist-legend">
              <div className="legend-item">
                <span className="legend-dot dot-compliant" />
                <span>Compliant ({compliantPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-violation" />
                <span>Potential Violations ({violationPct}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot dot-review" />
                <span>Needs Review ({reviewPct}%)</span>
              </div>
            </div>
          </div>

          <div className="notice-banner mt-3">
            <span className="notice-icon">ℹ️</span>
            <span className="notice-text">
              Under Legal Metrology Rules, packaging lacking mandatory declarations requires notice issuance or re-inspection.
            </span>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">Category Audit Breakdown</h3>
            <span className="card-subtitle">Inspections sorted by commodity domain</span>
          </div>

          <div className="category-stats-list">
            {(stats?.category_breakdown || []).map((cat, idx) => (
              <div key={idx} className="category-stat-row">
                <div className="cat-info">
                  <span className="cat-name font-bold">{cat.category}</span>
                  <span className="cat-sub">{cat.count} packages audited</span>
                </div>
                <div className="cat-badge-wrap">
                  {cat.violations > 0 ? (
                    <span className="badge-violation-sm">⚠️ {cat.violations} Non-Compliant</span>
                  ) : (
                    <span className="badge-compliant-sm">✓ 100% Compliant</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="content-card mt-4">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Recent Inspection Audits</h3>
            <span className="card-subtitle">Last 5 packaging verifications conducted</span>
          </div>
          <Link to="/history" className="link-view-all">
            View All Inspections History →
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
