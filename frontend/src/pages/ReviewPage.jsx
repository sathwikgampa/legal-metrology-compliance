import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import OfficerReview from '../components/OfficerReview';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getInspection, submitOfficerDecision } from '../services/api';

export default function ReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspection(id);
      setInspection(res);
    } catch (err) {
      setError(err.message || `Failed to retrieve inspection ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecord();
  }, [id]);

  const handleSubmitDecision = async (decisionPayload) => {
    try {
      setIsSubmitting(true);
      await submitOfficerDecision(id, decisionPayload);
      // Reload or navigate
      setTimeout(() => {
        navigate(`/inspections/${id}`);
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to submit officer decision.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message={`Preparing Officer Review Form for ${id}...`} />;
  }

  if (error || !inspection) {
    return <ErrorState message={error || 'Record not found.'} onRetry={loadRecord} />;
  }

  return (
    <div className="page-container officer-review-page">
      {/* Breadcrumbs & Header */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-line">
            <Link to="/" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to={`/inspections/${inspection.id}`} className="breadcrumb-link">{inspection.id}</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">Officer Statutory Review</span>
          </div>
          <h1 className="page-title">Legal Metrology Officer Review & Sign-Off</h1>
          <p className="page-subtitle">
            Auditing Commodity: <b>{inspection.product?.name}</b> ({inspection.product?.brand})
          </p>
        </div>

        <div className="header-actions">
          <Link to={`/inspections/${inspection.id}`} className="btn btn-outline">
            ← Back to Inspection Results
          </Link>
        </div>
      </div>

      {/* Statutory Authority Notice */}
      <div className="statutory-authority-alert">
        <div className="authority-icon">⚖️</div>
        <div className="authority-text">
          <h4 className="authority-title">Legal Authority Notice</h4>
          <p className="authority-desc">
            Under Section 18 and Section 36 of the Legal Metrology Act, 2009, computer vision and automated OCR findings serve solely as investigative aids. The final determination, evidentiary sign-off, and enforcement orders rest exclusively with the designated Legal Metrology Officer.
          </p>
        </div>
      </div>

      {/* Two-Pane Review Component */}
      <OfficerReview
        inspection={inspection}
        onSubmitDecision={handleSubmitDecision}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
