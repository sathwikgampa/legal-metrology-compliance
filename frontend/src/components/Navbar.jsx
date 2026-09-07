import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="brand-icon">⚖️</div>
        <div>
          <span>Legal Metrology Compliance</span>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 400 }}>
            Packaged Commodities Rules (2011) Assistant
          </div>
        </div>
      </div>

      <div className="nav-links">
        <button
          className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>

        <button
          className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 Inspection History
        </button>

        <button
          className="btn-primary"
          onClick={() => setActiveTab('new-inspection')}
        >
          <span>➕ New Inspection</span>
        </button>
      </div>
    </nav>
  );
}
