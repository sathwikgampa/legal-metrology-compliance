import React from 'react';

export default function ImagePreview({ slotKey, slotLabel, imageItem, onRemove, onReplace }) {
  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onReplace) {
      onReplace(slotKey, file);
    }
  };

  if (!imageItem) {
    return null;
  }

  return (
    <div className="image-preview-slot">
      <div className="slot-header">
        <span className="slot-badge">{slotLabel}</span>
        <span className="slot-filename text-truncate" title={imageItem.file?.name}>
          {imageItem.file?.name || "Uploaded Image"}
        </span>
      </div>

      <div className="slot-img-container">
        <img
          src={imageItem.previewUrl}
          alt={`${slotLabel} packaging view`}
          className="slot-img"
        />
      </div>

      <div className="slot-footer">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          className="btn btn-xs btn-outline"
          onClick={() => fileInputRef.current?.click()}
        >
          🔄 Replace
        </button>
        <button
          type="button"
          className="btn btn-xs btn-outline-danger"
          onClick={() => onRemove(slotKey)}
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}
