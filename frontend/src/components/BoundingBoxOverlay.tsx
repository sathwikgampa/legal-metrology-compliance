import React from 'react';

export interface BBoxItem {
  text: string;
  confidence?: number;
  bbox?: number[];
  image_id?: string;
}

interface BoundingBoxOverlayProps {
  boxes?: BBoxItem[];
  activeBox?: BBoxItem | null;
  onSelectBox?: (box: BBoxItem) => void;
  imageNaturalWidth?: number;
  imageNaturalHeight?: number;
}

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
}: BoundingBoxOverlayProps) {
  if (!boxes || boxes.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {boxes.map((boxItem, idx) => {
        const raw = boxItem.bbox || [0, 0, 0, 0];
        const [x, y, w, h] = raw;

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
            className={`absolute pointer-events-auto cursor-pointer rounded-sm transition-all duration-150 group ${
              isSelected
                ? 'border-2 border-blue-500 bg-blue-500/25 ring-2 ring-blue-400/40 z-20 shadow-sm'
                : 'border border-sky-400/80 bg-sky-500/10 hover:border-blue-500 hover:bg-blue-500/20 z-10'
            }`}
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
            <span
              className={`absolute -top-5 left-0 whitespace-nowrap px-1.5 py-0.5 rounded text-[10px] font-mono font-medium shadow-xs transition-opacity ${
                isSelected
                  ? 'bg-blue-600 text-white opacity-100'
                  : 'bg-slate-900/90 text-white opacity-0 group-hover:opacity-100'
              }`}
            >
              {boxItem.text ? boxItem.text.slice(0, 24) : 'Region'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
