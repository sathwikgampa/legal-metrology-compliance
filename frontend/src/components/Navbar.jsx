import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setSimulateNetworkError, getSimulateNetworkError } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [errorSimulated, setErrorSimulated] = useState(getSimulateNetworkError());

  const handleToggleError = () => {
    const next = !errorSimulated;
    setErrorSimulated(next);
    setSimulateNetworkError(next);
  };

  return (
    <header className="app-navbar" role="banner">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <span className="brand-badge">⚖️</span>
          <div className="brand-text-block">
            <span className="brand-title">Legal Metrology Inspection System</span>
            <span className="brand-sub">Department of Consumer Affairs • Packaged Commodities (2011)</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Testing switch for simulated network errors */}
        <div className="sim-toggle-block" title="Toggle simulated network failure to verify ErrorState component">
          <label className="sim-toggle-label">
            <input
              type="checkbox"
              checked={errorSimulated}
              onChange={handleToggleError}
            />
            <span className="sim-text">Simulate API Failure</span>
          </label>
        </div>

        <div className="officer-profile-badge">
          <div className="officer-avatar">LM</div>
          <div className="officer-info">
            <span className="officer-name">Inspector S. Sharma</span>
            <span className="officer-role">Legal Metrology Officer (Zone 4)</span>
          </div>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => navigate('/inspections/new')}
        >
          ➕ New Inspection
        </button>
      </div>
    </header>
  );
}
