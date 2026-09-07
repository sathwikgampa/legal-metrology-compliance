import React from 'react';

/**
 * Reusable loading indicator for async operations
 */
export default function LoadingState({ message = "Loading inspection data...", subtext = "Connecting to Legal Metrology compliance service..." }) {
  return (
    <div className="state-card loading-state" role="status">
      <div className="spinner-orbit">
        <div className="spinner-core" />
      </div>
      <h3 className="state-title">{message}</h3>
      {subtext && <p className="state-subtext">{subtext}</p>}
    </div>
  );
}
