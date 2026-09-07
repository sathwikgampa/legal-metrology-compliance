import React from 'react';

/**
 * Reusable zero-state presentation for empty lists, search no-results, etc.
 */
export default function EmptyState({
  icon = "🔍",
  title = "No Records Found",
  message = "No packaging inspections match your current search or filter criteria.",
  actionLabel,
  onAction
}) {
  return (
    <div className="state-card empty-state">
      <div className="state-icon">{icon}</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-subtext">{message}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
