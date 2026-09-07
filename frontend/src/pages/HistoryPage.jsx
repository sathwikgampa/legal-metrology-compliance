import React, { useEffect, useState } from 'react';
import InspectionTable from '../components/InspectionTable';
import { fetchDashboardMetrics } from '../services/api';

export default function HistoryPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const res = await fetchDashboardMetrics();
      setInspections(res?.recent_inspections || []);
      setLoading(false);
    }
    loadHistory();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Inspection Audit History</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Historical record of all packaging compliance audits and officer review decisions.
        </p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
          Loading inspection records...
        </div>
      ) : (
        <InspectionTable inspections={inspections} />
      )}
    </div>
  );
}
