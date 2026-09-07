import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import AnalysisProgress, { ANALYSIS_STEPS } from '../components/AnalysisProgress';
import ErrorState from '../components/ErrorState';
import { createInspection, uploadImages, analyzeInspection } from '../services/api';

const CATEGORIES = [
  'Food & Grains',
  'Snacks & Confectionery',
  'Beverages',
  'Oils & Vinegars',
  'Household Cleaners',
  'Cosmetics & Personal Care',
  'General Commodity'
];

export default function NewInspectionPage() {
  const navigate = useNavigate();

  // Form State
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [batchNumber, setBatchNumber] = useState('');
  const [declaredNetQty, setDeclaredNetQty] = useState('');

  // Uploaded Slots State: { front: { file, previewUrl }, back: { ... } }
  const [uploadedSlots, setUploadedSlots] = useState({});
  const [uploadError, setUploadError] = useState(null);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [generalError, setGeneralError] = useState(null);

  const handleStartAnalysis = async (e) => {
    e.preventDefault();

    // 1. Validate Form & Required Slots
    if (!productName.trim()) {
      setUploadError("Product / Commodity Name is required.");
      return;
    }

    if (!uploadedSlots.front) {
      setUploadError("Primary Front Panel image is mandatory for inspection.");
      return;
    }

    if (!uploadedSlots.back) {
      setUploadError("Information / Back Panel image is mandatory to audit mandatory declarations.");
      return;
    }

    setUploadError(null);
    setGeneralError(null);
    setIsAnalyzing(true);

    try {
      // Step 0: Images uploaded
      setCurrentStepIndex(0);
      const newRecord = await createInspection({
        name: productName,
        brand: brand || 'Unspecified Brand',
        category,
        batch_number: batchNumber || 'BATCH-001',
        declared_net_quantity: declaredNetQty
      });

      // Prepare files with roles
      const filesWithRoles = Object.entries(uploadedSlots).map(([role, item]) => ({
        role,
        file: item.file,
        previewUrl: item.previewUrl
      }));

      await uploadImages(newRecord.id, filesWithRoles);

      // Sequentially animate the 6 pipeline steps matching Section 5.3
      for (let i = 1; i < ANALYSIS_STEPS.length; i++) {
        setCurrentStepIndex(i);
        await new Promise((res) => setTimeout(res, 450));
      }

      const analyzedRecord = await analyzeInspection(newRecord.id);

      // Short delay so officer sees the final checkmark
      setTimeout(() => {
        navigate(`/inspections/${analyzedRecord.id}`);
      }, 500);
    } catch (err) {
      setIsAnalyzing(false);
      setGeneralError(err.message || "Failed to execute compliance analysis.");
    }
  };

  return (
    <div className="page-container new-inspection-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Initiate New Packaging Audit</h1>
          <p className="page-subtitle">
            Enter commodity metadata and upload package images for OCR declaration extraction & compliance scoring.
          </p>
        </div>
      </div>

      {generalError && (
        <ErrorState
          title="Analysis Execution Halted"
          message={generalError}
          onRetry={() => setGeneralError(null)}
          retryLabel="Dismiss and Edit"
        />
      )}

      {isAnalyzing ? (
        <div className="analyzing-progress-stage">
          <AnalysisProgress currentStepIndex={currentStepIndex} />
        </div>
      ) : (
        <form onSubmit={handleStartAnalysis} className="new-inspection-form">
          {/* Commodity Details Card */}
          <div className="content-card mb-4">
            <div className="card-header">
              <h3 className="card-title">1. Pre-Packaged Commodity Information</h3>
              <span className="card-subtitle">Official product identification metadata</span>
            </div>

            <div className="form-grid-2col">
              <div className="form-field">
                <label className="field-label">Commodity / Product Name *</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Pure Desi Ghee 1L, Basmati Rice 5kg"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Brand / Trademark *</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. Royal Harvest, Vedic Naturals"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="field-label">Commodity Regulatory Category *</label>
                <select
                  className="select-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Declared Net Quantity (Reference)</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. 500 g, 1 kg, 750 ml, 10 N"
                  value={declaredNetQty}
                  onChange={(e) => setDeclaredNetQty(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Batch Code / Lot Identifier</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="e.g. LOT-2026-X9"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="content-card mb-4">
            <div className="card-header">
              <h3 className="card-title">2. Packaging Panels & Photo Upload</h3>
              <span className="card-subtitle">Upload clear evidence images for OCR parsing</span>
            </div>

            <ImageUpload
              uploadedSlots={uploadedSlots}
              setUploadedSlots={setUploadedSlots}
              error={uploadError}
              setError={setUploadError}
            />
          </div>

          {/* Form Action Buttons */}
          <div className="form-bottom-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-primary btn-lg">
              🚀 Start Compliance Analysis
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
