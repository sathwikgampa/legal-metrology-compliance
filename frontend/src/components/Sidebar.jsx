import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  History,
  FlaskConical,
  Settings,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      {/* Primary Navigation */}
      <div className="sidebar-section">
        <span className="sidebar-heading">Navigation</span>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} className="sidebar-nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/inspections/new"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <FilePlus2 size={17} className="sidebar-nav-icon" />
            <span>New Inspection</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <History size={17} className="sidebar-nav-icon" />
            <span>Inspection History</span>
          </NavLink>
        </nav>
      </div>

      {/* Elegant Hairline Divider separating main navigation from test scenarios */}
      <div className="sidebar-divider" role="separator" />

      {/* Test Scenarios Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <FlaskConical size={14} className="sidebar-section-icon" />
          <span className="sidebar-heading">Test Scenarios</span>
        </div>
        <div className="scenario-links-list">
          <NavLink to="/inspections/INS-2024-001" className="scenario-item">
            <span className="scenario-dot dot-compliant" />
            <span className="scenario-title">1. Fully Compliant</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-002" className="scenario-item">
            <span className="scenario-dot dot-violation" />
            <span className="scenario-title">2. Potential Violation</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-003" className="scenario-item">
            <span className="scenario-dot dot-review" />
            <span className="scenario-title">3. Needs Review</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-004" className="scenario-item">
            <span className="scenario-dot dot-review" />
            <span className="scenario-title">4. Poor Image Quality</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-005" className="scenario-item">
            <span className="scenario-dot dot-review" />
            <span className="scenario-title">5. Low OCR Confidence</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-006" className="scenario-item">
            <span className="scenario-dot dot-compliant" />
            <span className="scenario-title">6. Multiple Bounding Boxes</span>
          </NavLink>
          <NavLink to="/inspections/INS-2024-007" className="scenario-item">
            <span className="scenario-dot dot-compliant" />
            <span className="scenario-title">7. Multiple Package Images</span>
          </NavLink>
        </div>
      </div>

      {/* Sidebar Footer & System Status */}
      <div className="sidebar-footer">
        <div className="sidebar-settings-link">
          <Settings size={16} className="sidebar-settings-icon" />
          <span>Rules & Thresholds</span>
        </div>

        <div className="system-status-indicator mt-3">
          <ShieldCheck size={14} className="status-shield-icon" />
          <span>Engine: Active (Rules 2011)</span>
        </div>

        <p className="sidebar-disclaimer">
          Statutory inspection assistant. Officer determination is legally binding.
        </p>
      </div>
    </aside>
  );
}
