import React, { useState } from 'react';
import BoundingBoxOverlay from './BoundingBoxOverlay';
import ConfidenceBadge from './ConfidenceBadge';

export default function EvidenceViewer({
  images = [],
  ocrResults = [],
  selectedEvidence = null,
  onClose,
  initialImageId = null
}) {
  const [activeImageId, setActiveImageId] = useState(
    initialImageId || selectedEvidence?.image_id || images[0]?.id
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedBox, setSelectedBox] = useState(selectedEvidence || null);

  const currentImage = images.find((img) => img.id === activeImageId) || images[0];

  // Filter OCR boxes for currently active image
  const activeBoxes = ocrResults.filter((r) => r.image_id === activeImageId);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="evidence-viewer-wrapper">
      <div className="viewer-header">
        <div className="viewer-title-group">
          <span className="viewer-badge">🔍 Evidence Artifact Viewer</span>
          <span className="viewer-img-role">Panel: {currentImage?.role?.toUpperCase() || 'PRIMARY'}</span>
          <span className="viewer-img-name">{currentImage?.name}</span>
        </div>

        <div className="viewer-controls">
          <div className="zoom-buttons">
            <button className="btn btn-xs btn-outline" onClick={handleZoomOut} title="Zoom Out">
              ➖
            </button>
            <span className="zoom-readout">{Math.round(zoomLevel * 100)}%</span>
            <button className="btn btn-xs btn-outline" onClick={handleZoomIn} title="Zoom In">
              ➕
            </button>
            <button className="btn btn-xs btn-outline" onClick={handleResetZoom} title="Reset Zoom">
              Reset
            </button>
          </div>

          {onClose && (
            <button className="btn btn-xs btn-outline" onClick={onClose} title="Close Evidence Viewer">
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Image Panel Selector Tabs if multiple images exist */}
      {images.length > 1 && (
        <div className="image-panel-tabs">
          {images.map((img) => (
            <button
              key={img.id}
              className={`panel-tab-btn ${img.id === activeImageId ? 'active' : ''}`}
              onClick={() => {
                setActiveImageId(img.id);
                setSelectedBox(null);
              }}
            >
              📷 {img.role?.toUpperCase() || 'PANEL'} ({img.name})
            </button>
          ))}
        </div>
      )}

      <div className="viewer-body-split">
        {/* Visual canvas area */}
        <div className="viewer-canvas-scroll">
          <div
            className="viewer-image-stage"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {currentImage ? (
              <div className="image-container-relative">
                <img
                  src={currentImage.url}
                  alt={currentImage.name}
                  className="evidence-source-image"
                />
                <BoundingBoxOverlay
                  boxes={activeBoxes}
                  activeBox={selectedBox}
                  onSelectBox={(box) => setSelectedBox(box)}
                />
              </div>
            ) : (
              <div className="no-image-placeholder">No image artifact available</div>
            )}
          </div>
        </div>

        {/* Evidence Inspector Side Panel */}
        <div className="viewer-sidebar-inspector">
          <div className="inspector-card">
            <h4 className="inspector-heading">Detected OCR Evidence</h4>
            <p className="inspector-hint">Click any bounding box or list item to trace declaration evidence</p>

            <div className="ocr-findings-list">
              {activeBoxes.length === 0 ? (
                <div className="text-muted text-sm p-2">No bounding boxes registered for this panel.</div>
              ) : (
                activeBoxes.map((box, idx) => {
                  const isCur =
                    selectedBox &&
                    (selectedBox.text === box.text || (selectedBox.bbox && selectedBox.bbox[0] === box.bbox[0]));

                  return (
                    <div
                      key={idx}
                      className={`ocr-evidence-item ${isCur ? 'active-evidence' : ''}`}
                      onClick={() => setSelectedBox(box)}
                    >
                      <div className="evidence-item-top">
                        <span className="font-mono text-bold text-sm">{box.text}</span>
                        <ConfidenceBadge value={box.confidence} size="sm" showLabel={false} />
                      </div>
                      <div className="evidence-coords">
                        BBox: [{box.bbox?.join(', ')}]
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {selectedBox && (
              <div className="active-selected-box-detail">
                <span className="detail-tag">Active Selection</span>
                <p className="detail-text font-mono">"{selectedBox.text}"</p>
                <div className="detail-meta">
                  <span>Confidence: <b>{Math.round((selectedBox.confidence || 0.95) * 100)}%</b></span>
                  <span>Panel: <b>{currentImage?.role || 'front'}</b></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
