import React, { useState } from 'react';
import BoundingBoxOverlay, { BBoxItem } from './BoundingBoxOverlay';
import ConfidenceBadge from './ConfidenceBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BorderBeam } from '@/components/react-bits/BorderBeam';
import { ZoomIn, ZoomOut, RotateCcw, X, Layers, Crosshair, Camera } from 'lucide-react';

export interface EvidenceImage {
  id: string;
  name: string;
  role?: string;
  url: string;
}

export interface OcrResultItem extends BBoxItem {
  id?: string;
  image_id?: string;
}

interface EvidenceViewerProps {
  images?: EvidenceImage[];
  ocrResults?: OcrResultItem[];
  selectedEvidence?: BBoxItem | null;
  onClose?: () => void;
  initialImageId?: string | null;
}

export default function EvidenceViewer({
  images = [],
  ocrResults = [],
  selectedEvidence = null,
  onClose,
  initialImageId = null
}: EvidenceViewerProps) {
  const [activeImageId, setActiveImageId] = useState<string>(
    initialImageId || selectedEvidence?.image_id || images[0]?.id || ''
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedBox, setSelectedBox] = useState<BBoxItem | null>(selectedEvidence || null);

  const currentImage = images.find((img) => img.id === activeImageId) || images[0];

  // Filter OCR boxes for currently active image
  const activeBoxes = ocrResults.filter((r) => r.image_id === activeImageId);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="flex flex-col h-[85vh] max-h-[850px] w-full bg-card text-foreground rounded-xl border border-border shadow-xl overflow-hidden">
      {/* Viewer Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1 rounded-md text-xs font-semibold">
            <Layers className="h-3.5 w-3.5" />
            Evidence Artifact Viewer
          </div>
          <Badge variant="outline" className="text-[11px] font-mono">
            PANEL: {currentImage?.role?.toUpperCase() || 'PRIMARY'}
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[200px]">
            {currentImage?.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs font-mono font-medium px-2 min-w-[48px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              onClick={handleResetZoom}
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>

          {onClose && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 ml-2 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              title="Close Evidence Viewer"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Multi-image panel tabs */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 px-5 py-2 border-b border-border/60 bg-muted/10 overflow-x-auto">
          {images.map((img) => (
            <Button
              key={img.id}
              variant={img.id === activeImageId ? 'secondary' : 'ghost'}
              size="sm"
              className={`h-7 text-xs gap-1.5 rounded-md ${
                img.id === activeImageId
                  ? 'bg-primary/10 text-primary border border-primary/20 font-semibold'
                  : 'text-muted-foreground'
              }`}
              onClick={() => {
                setActiveImageId(img.id);
                setSelectedBox(null);
              }}
            >
              <Camera className="h-3 w-3" />
              {img.role?.toUpperCase() || 'PANEL'} ({img.name})
            </Button>
          ))}
        </div>
      )}

      {/* Main Split Body: Image Stage + Findings Inspector */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Visual Canvas Area */}
        <div className="flex-1 bg-slate-950/90 overflow-auto p-4 flex items-center justify-center min-h-[300px]">
          <div
            className="transition-transform duration-200 ease-out"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            {currentImage ? (
              <div className="relative inline-block max-w-full shadow-2xl rounded-lg overflow-hidden border border-slate-700/50">
                <img
                  src={currentImage.url}
                  alt={currentImage.name}
                  className="max-h-[65vh] w-auto object-contain block select-none pointer-events-none"
                />
                <BoundingBoxOverlay
                  boxes={activeBoxes}
                  activeBox={selectedBox}
                  onSelectBox={(box) => setSelectedBox(box)}
                />
              </div>
            ) : (
              <div className="text-muted-foreground text-sm flex items-center gap-2">
                <Camera className="h-5 w-5" />
                No image artifact available
              </div>
            )}
          </div>
        </div>

        {/* Evidence Inspector Side Panel */}
        <div className="w-full lg:w-80 lg:min-w-[320px] border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col min-h-0">
          <div className="p-4 border-b border-border">
            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <Crosshair className="h-3.5 w-3.5 text-primary" />
              Detected OCR Evidence ({activeBoxes.length})
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Click any bounding box or list item to trace declaration evidence.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
            {activeBoxes.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No bounding boxes registered for this panel.
              </div>
            ) : (
              activeBoxes.map((box, idx) => {
                const isCur =
                  selectedBox &&
                  (selectedBox.text === box.text || (selectedBox.bbox && selectedBox.bbox[0] === box.bbox?.[0]));

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedBox(box)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isCur
                        ? 'border-primary bg-primary/10 shadow-xs'
                        : 'border-border/60 hover:border-primary/40 hover:bg-accent/40 bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono font-medium text-foreground text-xs leading-snug break-words">
                        {box.text}
                      </span>
                      <ConfidenceBadge value={box.confidence} size="sm" showLabel={false} />
                    </div>
                    {box.bbox && (
                      <div className="text-[10px] font-mono text-muted-foreground mt-1">
                        BBox: [{box.bbox.join(', ')}]
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Active Selection Detail Card */}
          {selectedBox && (
            <div className="p-3 border-t border-border bg-muted/20 relative overflow-hidden">
              <BorderBeam size={80} duration={3} colorFrom="#3b82f6" colorTo="#06b6d4" />
              <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">
                Active Selection
              </div>
              <p className="text-xs font-mono font-medium text-foreground bg-background/80 p-2 rounded border border-border/80 break-words">
                "{selectedBox.text}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                <span>
                  Confidence: <b className="text-foreground">{Math.round((selectedBox.confidence || 0.95) * 100)}%</b>
                </span>
                <span>
                  Panel: <b className="text-foreground uppercase">{currentImage?.role || 'front'}</b>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
