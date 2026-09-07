import React from 'react';

export default function DashboardCards({ stats }) {
  const data = stats || {
    total_inspections: 0,
    compliant: 0,
    potential_violations: 0,
    needs_review: 0
  };

  const cards = [
    {
      id: 'total',
      title: 'Total Inspections',
      value: data.total_inspections,
      helperText: 'Processed packages across all active zones',
      dotClass: 'dot-neutral'
    },
    {
      id: 'compliant',
      title: 'Compliant Packages',
      value: data.compliant,
      helperText: 'Verified mandatory declarations',
      dotClass: 'dot-green'
    },
    {
      id: 'violations',
      title: 'Potential Violations',
      value: data.potential_violations,
      helperText: 'Non-compliant statutory declarations detected',
      dotClass: 'dot-red'
    },
    {
      id: 'review',
      title: 'Needs Officer Review',
      value: data.needs_review,
      helperText: 'Uncertain OCR reading or marginal quality',
      dotClass: 'dot-yellow'
    }
  ];

  return (
    <div className="metrics-cards-grid">
      {cards.map((card) => (
        <div key={card.id} className="metric-box">
          <div className="metric-box-top">
            <span className="metric-box-title">{card.title}</span>
            <span
              className={`metric-indicator-dot ${card.dotClass}`}
              aria-hidden="true"
            />
          </div>
          <div className="metric-box-val">{card.value}</div>
          <div className="metric-box-sub">{card.helperText}</div>
        </div>
      ))}
    </div>
  );
}
