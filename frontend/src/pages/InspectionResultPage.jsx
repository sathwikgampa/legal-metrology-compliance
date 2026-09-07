import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ComplianceStatus from '../components/ComplianceStatus';
import ConfidenceBadge from '../components/ConfidenceBadge';
import DeclarationTable from '../components/DeclarationTable';
import ViolationCard from '../components/ViolationCard';
import EvidenceViewer from '../components/EvidenceViewer';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { getInspection } from '../services/api';

export default function InspectionResultPage() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Evidence Viewer State
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getInspection(id);
      setInspection(res);
    } catch (err) {
      setError(err.message || `Failed to retrieve inspection audit ${id}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecord();
  }, [id]);

  const handleOpenEvidence = (evidenceItem) => {
    setSelectedEvidence(evidenceItem);
    setShowEvidenceModal(true);
  };

  if (loading) {
    return <LoadingState message={`Retrieving Inspection ${id}...`} subtext="Synthesizing OCR evidence and rule evaluation logs..." />;
  }

  if (error || !inspection) {
    return <ErrorState message={error || 'Inspection record not found.'} onRetry={loadRecord} />;
  }

  const { product, image_quality_status, extracted_declarations, compliance_findings, uploaded_images, ocr_results } = inspection;
  const isPoorQuality = image_quality_status?.status === "POOR";

  return (
    <div className="page-container inspection-results-page">
      {/* Top Banner Navigation & Status */}
      <div className="page-header-row">
        <div>
          <div className="breadcrumb-line">
            <Link to="/" className="breadcrumb-link">Dashboard</Link>
            <span className="breadcrumb-sep">/</span>
            <Link to="/history" className="breadcrumb-link">Inspections</Link>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{inspection.id}</span>
          </div>
          <h1 className="page-title">{product?.name || "Packaged Commodity"}</h1>
          <p className="page-subtitle">
            Brand: <b>{product?.brand}</b> • Category: <b>{product?.category}</b> • Batch: <b>{product?.batch_number}</b>
          </p>
        </div>

        <div className="header-status-group">
          <div className="status-hero-card">
            <span className="hero-status-title">System Compliance Verdict</span>
            <div className="hero-status-pill">
              <ComplianceStatus status={inspection.overall_status} size="lg" />
            </div>
          </div>

          <Link to={`/inspections/${inspection.id}/review`} className="btn btn-primary btn-lg">
            🧑‍⚖️ Proceed to Officer Review →
          </Link>
        </div>
      </div>

      {/* Poor Image Quality Caution Alert */}
      {isPoorQuality && (
        <div className="alert alert-warning-critical" role="alert">
          <div className="alert-content-wrap">
            <span className="alert-icon-lg">⚠️</span>
            <div>
              <h4 className="alert-heading">Critical Image Quality Degradation</h4>
              <p className="alert-text">
                {image_quality_status.description || "Image quality is insufficient for reliable analysis. Please upload a clearer image."}
              </p>
              <p className="alert-sub">
                Laplacian Variance: <b>{image_quality_status.laplacian_variance}</b> (Threshold: &gt; 100.0). Results have been marked <b>NEEDS REVIEW</b>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Meta Cards Overview Row */}
      <div className="inspection-meta-summary-grid">
        <div className="summary-card">
          <span className="sum-label">Aggregate OCR Confidence</span>
          <div className="sum-val-row">
            <ConfidenceBadge value={inspection.overall_confidence} size="lg" />
          </div>
          <span className="sum-foot">Calculated across all detected label tokens</span>
        </div>

        <div className="summary-card">
          <span className="sum-label">Image Quality Assessment</span>
          <div className="sum-val-row">
            <span className={`quality-pill quality-${(image_quality_status?.status || 'acceptable').toLowerCase()}`}>
              {image_quality_status?.status || 'ACCEPTABLE'} ({image_quality_status?.score || 0.9} Sharpness)
            </span>
          </div>
          <span className="sum-foot">{uploaded_images?.length || 1} panel image(s) processed</span>
        </div>

        <div className="summary-card">
          <span className="sum-label">Non-Compliance Findings</span>
          <div className="sum-val-row">
            <span className={`count-pill ${compliance_findings?.length > 0 ? 'count-warning' : 'count-ok'}`}>
              {compliance_findings?.length || 0} Flagged Item(s)
            </span>
          </div>
          <span className="sum-foot">Subject to Legal Metrology Officer determination</span>
        </div>

        <div className="summary-card">
          <span className="sum-label">Officer Final Determination</span>
          <div className="sum-val-row">
            <span className="decision-pill">
              {inspection.officer_decision?.decision || 'PENDING REVIEW'}
            </span>
          </div>
          <span className="sum-foot">
            <Link to={`/inspections/${inspection.id}/review`} className="link-inline">
              Sign off now →
            </Link>
          </span>
        </div>
      </div>

      {/* Evidence Viewer Launch Bar */}
      <div className="evidence-launcher-card content-card mb-4">
        <div className="launcher-text">
          <h3 className="card-title">🔍 Visual Packaging Evidence & OCR Bounding Boxes</h3>
          <p className="card-subtitle">
            Inspect raw camera captures, toggle detected OCR regions, and zoom in on small declarations.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            setSelectedEvidence(null);
            setShowEvidenceModal(true);
          }}
        >
          📷 Open Evidence Artifact Viewer
        </button>
      </div>

      {/* Embedded Evidence Viewer (Collapsible or Modal) */}
      {showEvidenceModal && (
        <div className="evidence-modal-backdrop" onClick={() => setShowEvidenceModal(false)}>
          <div className="evidence-modal-window" onClick={(e) => e.stopPropagation()}>
            <EvidenceViewer
              images={uploaded_images}
              ocrResults={ocr_results}
              selectedEvidence={selectedEvidence}
              onClose={() => setShowEvidenceModal(false)}
            />
          </div>
        </div>
      )}

      {/* Extracted Declarations Table */}
      <div className="content-card mb-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Mandatory Packaging Declarations (Rule 6)</h3>
            <span className="card-subtitle">
              Declarations required under Legal Metrology (Packaged Commodities) Rules, 2011
            </span>
          </div>
        </div>

        <DeclarationTable
          declarations={extracted_declarations}
          onViewEvidence={handleOpenEvidence}
        />
      </div>

      {/* Violation Cards Section */}
      <div className="content-card mb-4">
        <div className="card-header">
          <div>
            <h3 className="card-title">Identified Potential Violations & Risk Analysis</h3>
            <span className="card-subtitle">
              System-flagged non-compliance issues requiring statutory officer evaluation
            </span>
          </div>
        </div>

        {compliance_findings && compliance_findings.length > 0 ? (
          <div className="violations-grid">
            {compliance_findings.map((fnd) => (
              <ViolationCard
                key={fnd.id}
                finding={fnd}
                onViewEvidence={handleOpenEvidence}
              />
            ))}
          </div>
        ) : (
          <div className="no-violations-box">
            <span className="check-icon">✓</span>
            <div>
              <h4 className="font-bold text-compliant">No Non-Compliance Items Detected</h4>
              <p className="text-muted text-sm">
                All mandatory declaration fields were extracted with high OCR confidence and conform to statutory presence rules.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA to Review Page */}
      <div className="content-card review-cta-card">
        <div className="cta-left">
          <h3 className="card-title">Ready for Statutory Determination?</h3>
          <p className="card-subtitle">
            Recorded findings must be confirmed, rejected, or marked for physical sample testing by the authorized officer.
          </p>
        </div>
        <Link to={`/inspections/${inspection.id}/review`} className="btn btn-primary btn-lg">
          🧑‍⚖️ Enter Officer Sign-Off Form
        </Link>
      </div>
    </div>
  );
}
