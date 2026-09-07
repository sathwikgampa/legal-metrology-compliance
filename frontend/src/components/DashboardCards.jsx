import React from 'react';

export default function DashboardCards({ stats }) {
  const data = stats || {
    total_inspections: 8,
    compliant: 3,
    potential_violations: 2,
    needs_review: 3
  };

  const cards = [
    {
      id: 'total',
      title: 'Total Inspections',
      value: data.total_inspections,
      helperText: 'Processed packages across all active zones',
      dotColor: 'bg-blue-500'
    },
    {
      id: 'compliant',
      title: 'Compliant Packages',
      value: data.compliant,
      helperText: 'Verified mandatory declarations',
      dotColor: 'bg-emerald-500'
    },
    {
      id: 'violations',
      title: 'Potential Violations',
      value: data.potential_violations,
      helperText: 'Non-compliant statutory declarations detected',
      dotColor: 'bg-rose-500'
    },
    {
      id: 'review',
      title: 'Needs Officer Review',
      value: data.needs_review,
      helperText: 'Uncertain OCR reading or marginal quality',
      dotColor: 'bg-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs dark:bg-slate-900 dark:border-slate-800/80 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
            <span>{card.title}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${card.dotColor}`} />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {card.value}
          </div>
          <p className="text-[10px] text-slate-400 mt-1 leading-normal">
            {card.helperText}
          </p>
        </div>
      ))}
    </div>
  );
}
