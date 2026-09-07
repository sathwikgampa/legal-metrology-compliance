import React, { useEffect, useState } from 'react';
import DashboardCards from '../components/DashboardCards';
import InspectionTable from '../components/InspectionTable';
import { fetchDashboardMetrics } from '../services/api';

export default function DashboardPage({ onStartNewInspection }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const res = await fetchDashboardMetrics();
      setData(res);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Legal Metrology Officer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Packaged Commodities Rules (2011) Mandatory Declaration Verifier
          </p>
        </div>

        <button className="btn-primary" onClick={onStartNewInspection}>
          ➕ New Inspection Audit
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
          Loading dashboard metrics...
        </div>
      ) : (
        <>
          <DashboardCards metrics={data?.metrics} />
          <InspectionTable inspections={data?.recent_inspections} />
        </>
      )}
    </div>
  );
}
