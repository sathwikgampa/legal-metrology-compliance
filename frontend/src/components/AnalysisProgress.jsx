import React from 'react';

export const ANALYSIS_STEPS = [
  { id: 'upload', label: 'Images uploaded' },
  { id: 'quality', label: 'Image quality checked' },
  { id: 'ocr', label: 'Extracting text' },
  { id: 'detect', label: 'Detecting declarations' },
  { id: 'rules', label: 'Applying compliance rules' },
  { id: 'results', label: 'Generating results' }
];

/**
 * Sequential analysis progress stepper reflecting the exact backend verification stages:
 * - pending: ○
 * - in-progress: ⟳
 * - done: ✓
 */
export default function AnalysisProgress({ currentStepIndex = 0 }) {
  const getStepStatus = (index) => {
    if (index < currentStepIndex) return 'done';
    if (index === currentStepIndex) return 'in-progress';
    return 'pending';
  };

  return (
    <div className="analysis-stepper-card">
      <div className="stepper-header">
        <h3 className="stepper-title">AI Compliance Engine Pipeline</h3>
        <p className="stepper-sub">Executing mandatory verification sequence under Packaged Commodities Rules, 2011</p>
      </div>

      <div className="stepper-list">
        {ANALYSIS_STEPS.map((step, idx) => {
          const status = getStepStatus(idx);
          return (
            <div key={step.id} className={`stepper-item step-${status}`}>
              <div className="stepper-symbol">
                {status === 'done' && <span className="sym-done">✓</span>}
                {status === 'in-progress' && <span className="sym-progress spin">⟳</span>}
                {status === 'pending' && <span className="sym-pending">○</span>}
              </div>
              <div className="stepper-text-wrap">
                <span className="stepper-label">{step.label}</span>
                {status === 'in-progress' && (
                  <span className="stepper-active-sub">Processing pipeline...</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
