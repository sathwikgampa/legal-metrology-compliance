import React from 'react';

/**
 * Reusable error presentation for API failures, network dropouts, and OCR errors
 */
export default function ErrorState({
  title = "Service Communication Error",
  message = "Unable to process compliance inspection. Please verify your connection.",
  onRetry,
  retryLabel = "Retry Operation"
}) {
  return (
    <div className="state-card error-state" role="alert">
      <div className="state-icon error-icon">⚠️</div>
      <h3 className="state-title">{title}</h3>
      <p className="state-subtext">{message}</p>
      {onRetry && (
        <button className="btn btn-outline-danger" onClick={onRetry}>
          🔄 {retryLabel}
        </button>
      )}
    </div>
  );
}
