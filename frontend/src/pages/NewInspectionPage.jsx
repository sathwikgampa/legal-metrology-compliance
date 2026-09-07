import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import AnalysisResult from '../components/AnalysisResult';
import OfficerReview from '../components/OfficerReview';
import { submitPackageAnalysis } from '../services/api';

export default function NewInspectionPage({ onFinish }) {
  const [analysisData, setAnalysisData] = useState(null);

  const handleAnalysis = async (payload) => {
    const res = await submitPackageAnalysis(payload);
    setAnalysisData(res);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>New Package Compliance Audit</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Upload product packaging image to run mandatory rule extraction and record officer decision.
        </p>
      </div>

      <ImageUpload onAnalysisComplete={handleAnalysis} />

      {analysisData && (
        <div style={{ marginTop: '2rem' }}>
          <AnalysisResult result={analysisData} />
          <OfficerReview 
            inspectionId={analysisData.inspection_id} 
            onReviewSubmitted={() => {
              setTimeout(() => {
                if (onFinish) onFinish();
              }, 1500);
            }}
          />
        </div>
      )}
    </div>
  );
}
