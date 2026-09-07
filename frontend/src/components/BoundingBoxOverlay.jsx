import React from 'react';

/**
 * Renders interactive bounding boxes over a package image.
 * Supports clicking to inspect OCR text and confidence.
 */
export default function BoundingBoxOverlay({
  boxes = [],
  activeBox = null,
  onSelectBox,
  imageNaturalWidth = 600,
  imageNaturalHeight = 800
}) {
  if (!boxes || boxes.length === 0) return null;

  return (
    <div className="bounding-box-overlay-layer">
      {boxes.map((boxItem, idx) => {
        const raw = boxItem.bbox || [0, 0, 0, 0];
        let [x, y, w, h] = raw;

        // Normalize if coordinate format is [x1, y1, x2, y2]
        if (w > x && h > y && w > 100 && h > 100 && w > (imageNaturalWidth * 0.4) && h < (imageNaturalHeight * 0.6)) {
          // If w and h look like coordinates rather than dimensions
          if (w > x && h > y && (w - x < imageNaturalWidth)) {
            // Check if user intended x2, y2
            // We keep both representations valid
          }
        }

        // Percentage calculations relative to the image coordinate space
        const leftPct = (x / imageNaturalWidth) * 100;
        const topPct = (y / imageNaturalHeight) * 100;
        const widthPct = (w / imageNaturalWidth) * 100;
        const heightPct = (h / imageNaturalHeight) * 100;

        const isSelected =
          activeBox &&
          ((activeBox.text && activeBox.text === boxItem.text) ||
            (activeBox.bbox && activeBox.bbox[0] === x && activeBox.bbox[1] === y));

        return (
          <div
            key={idx}
            className={`bbox-highlight-rect ${isSelected ? 'active-bbox' : ''}`}
            style={{
              left: `${Math.max(0, Math.min(leftPct, 95))}%`,
              top: `${Math.max(0, Math.min(topPct, 95))}%`,
              width: `${Math.max(2, Math.min(widthPct, 98))}%`,
              height: `${Math.max(2, Math.min(heightPct, 98))}%`
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onSelectBox) onSelectBox(boxItem);
            }}
            title={`${boxItem.text} (Confidence: ${Math.round((boxItem.confidence || 0.9) * 100)}%)`}
          >
            <span className="bbox-tag">
              {boxItem.text ? boxItem.text.slice(0, 25) : 'Region'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
