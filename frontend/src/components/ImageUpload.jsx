import React, { useState, useRef } from 'react';
import ImagePreview from './ImagePreview';

const SLOTS = [
  { key: 'front', label: 'Front Panel (Primary Display)', required: true },
  { key: 'back', label: 'Back Panel (Declarations)', required: true },
  { key: 'side', label: 'Side Panel (Barcode / Net Wt)', required: false },
  { key: 'close-up', label: 'Close-Up (MRP / Batch / Date)', required: false }
];

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUpload({ uploadedSlots, setUploadedSlots, error, setError }) {
  const [activeDragSlot, setActiveDragSlot] = useState(null);
  const fileInputRefs = useRef({});

  const validateAndAddFile = (slotKey, file) => {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Invalid format (${file.type || 'unknown'}). Only JPG, PNG, and WebP images are permitted.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload an optimized image.`);
      return;
    }

    setError(null);
    const previewUrl = URL.createObjectURL(file);

    setUploadedSlots((prev) => ({
      ...prev,
      [slotKey]: {
        slotKey,
        file,
        previewUrl
      }
    }));
  };

  const handleDragOver = (e, slotKey) => {
    e.preventDefault();
    setActiveDragSlot(slotKey);
  };

  const handleDragLeave = (e, slotKey) => {
    e.preventDefault();
    if (activeDragSlot === slotKey) {
      setActiveDragSlot(null);
    }
  };

  const handleDrop = (e, slotKey) => {
    e.preventDefault();
    setActiveDragSlot(null);
    const file = e.dataTransfer.files?.[0];
    validateAndAddFile(slotKey, file);
  };

  const handleRemove = (slotKey) => {
    setUploadedSlots((prev) => {
      const next = { ...prev };
      if (next[slotKey]?.previewUrl) {
        URL.revokeObjectURL(next[slotKey].previewUrl);
      }
      delete next[slotKey];
      return next;
    });
  };

  const handleReplace = (slotKey, newFile) => {
    validateAndAddFile(slotKey, newFile);
  };

  return (
    <div className="upload-section">
      <div className="upload-header">
        <h3 className="section-title">Upload Package Evidence Images</h3>
        <p className="section-subtext">
          Provide high-resolution photos of packaging panels. Mandatory front and back panels are required for comprehensive rule evaluation.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="slots-grid">
        {SLOTS.map((slot) => {
          const hasImage = !!uploadedSlots[slot.key];
          const isDragging = activeDragSlot === slot.key;

          if (hasImage) {
            return (
              <ImagePreview
                key={slot.key}
                slotKey={slot.key}
                slotLabel={slot.label}
                imageItem={uploadedSlots[slot.key]}
                onRemove={handleRemove}
                onReplace={handleReplace}
              />
            );
          }

          return (
            <div
              key={slot.key}
              className={`upload-slot-box ${isDragging ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, slot.key)}
              onDragLeave={(e) => handleDragLeave(e, slot.key)}
              onDrop={(e) => handleDrop(e, slot.key)}
              onClick={() => fileInputRefs.current[slot.key]?.click()}
            >
              <input
                type="file"
                ref={(el) => (fileInputRefs.current[slot.key] = el)}
                accept="image/png, image/jpeg, image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  validateAndAddFile(slot.key, file);
                }}
              />

              <div className="slot-empty-content">
                <div className="slot-empty-icon">📷</div>
                <div className="slot-empty-title">
                  {slot.label} {slot.required && <span className="req-asterisk">*</span>}
                </div>
                <p className="slot-empty-help">
                  Click to select or drag image here
                </p>
                <span className="slot-empty-tag">
                  {slot.required ? "Required Panel" : "Optional Reference"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
