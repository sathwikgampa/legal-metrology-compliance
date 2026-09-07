import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Plus, Search, Bell, ChevronDown, AlertCircle } from 'lucide-react';
import { setSimulateNetworkError, getSimulateNetworkError } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const [errorSimulated, setErrorSimulated] = useState(getSimulateNetworkError());
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleError = () => {
    const next = !errorSimulated;
    setErrorSimulated(next);
    setSimulateNetworkError(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="app-navbar" role="banner">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <div className="brand-badge-box">
            <Scale className="brand-icon-svg" size={20} />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">Legal Metrology Inspection System</span>
            <span className="brand-sub">Department of Consumer Affairs • Packaged Commodities (2011)</span>
          </div>
        </Link>
      </div>

      <div className="navbar-center">
        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
          <Search size={15} className="navbar-search-icon" />
          <input
            type="text"
            className="navbar-search-input"
            placeholder="Search inspections, dockets, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
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

        {/* Notifications Icon Button */}
        <button className="nav-icon-btn" title="Statutory Alerts & Notifications" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        {/* User Profile Info */}
        <div className="officer-profile-badge">
          <div className="officer-avatar" aria-hidden="true">SS</div>
          <div className="officer-info">
            <span className="officer-name">Inspector S. Sharma</span>
            <span className="officer-role">Zone 4 • Enforcement</span>
          </div>
          <ChevronDown size={14} className="officer-dropdown-caret" />
        </div>

        {/* High-priority "+ New Inspection" Action Button */}
        <button
          className="btn btn-primary btn-navbar-action"
          onClick={() => navigate('/inspections/new')}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Inspection</span>
        </button>
      </div>
    </header>
  );
}
