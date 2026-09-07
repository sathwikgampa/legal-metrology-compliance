import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="app-sidebar" aria-label="Main Navigation">
      <div className="sidebar-section">
        <span className="sidebar-heading">Navigation</span>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/inspections/new"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">📸</span>
            <span>New Inspection</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">📜</span>
            <span>Inspection History</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-heading">Test Scenarios (Mock Cases)</span>
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

      <div className="sidebar-footer">
        <div className="system-status-indicator">
          <span className="status-pulse" />
          <span>Local Engine: Mock v1.0</span>
        </div>
        <p className="sidebar-disclaimer">
          Inspection Assistant Mode. Final judgment rests with the Officer.
        </p>
      </div>
    </aside>
  );
}
