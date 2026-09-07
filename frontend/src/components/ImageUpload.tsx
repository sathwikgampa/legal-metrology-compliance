import React, { useState, useRef } from 'react';
import ImagePreview from './ImagePreview';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BorderBeam } from '@/components/react-bits/BorderBeam';
import { Camera, AlertCircle, UploadCloud } from 'lucide-react';

export interface UploadedSlotItem {
  slotKey: string;
  file: File;
  previewUrl: string;
}

export interface SlotDefinition {
  key: string;
  label: string;
  required: boolean;
}

const SLOTS: SlotDefinition[] = [
  { key: 'front', label: 'Front Panel (Primary Display)', required: true },
  { key: 'back', label: 'Back Panel (Declarations)', required: true },
  { key: 'side', label: 'Side Panel (Barcode / Net Wt)', required: false },
  { key: 'close-up', label: 'Close-Up (MRP / Batch / Date)', required: false }
];

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

interface ImageUploadProps {
  uploadedSlots: Record<string, UploadedSlotItem>;
  setUploadedSlots: React.Dispatch<React.SetStateAction<Record<string, UploadedSlotItem>>>;
  error: string | null;
  setError: (err: string | null) => void;
}

export default function ImageUpload({ uploadedSlots, setUploadedSlots, error, setError }: ImageUploadProps) {
  const [activeDragSlot, setActiveDragSlot] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const validateAndAddFile = (slotKey: string, file?: File) => {
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

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    setActiveDragSlot(slotKey);
  };

  const handleDragLeave = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    if (activeDragSlot === slotKey) {
      setActiveDragSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    setActiveDragSlot(null);
    const file = e.dataTransfer.files?.[0];
    validateAndAddFile(slotKey, file);
  };

  const handleRemove = (slotKey: string) => {
    setUploadedSlots((prev) => {
      const next = { ...prev };
      if (next[slotKey]?.previewUrl) {
        URL.revokeObjectURL(next[slotKey].previewUrl);
      }
      delete next[slotKey];
      return next;
    });
  };

  const handleReplace = (slotKey: string, newFile: File) => {
    validateAndAddFile(slotKey, newFile);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-foreground tracking-tight">Upload Package Evidence Images</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Provide high-resolution photos of packaging panels. Mandatory front and back panels are required for comprehensive rule evaluation.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2.5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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
            <Card
              key={slot.key}
              onClick={() => fileInputRefs.current[slot.key]?.click()}
              onDragOver={(e) => handleDragOver(e, slot.key)}
              onDragLeave={(e) => handleDragLeave(e, slot.key)}
              onDrop={(e) => handleDrop(e, slot.key)}
              className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 group overflow-hidden ${
                isDragging
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.01]'
                  : 'border-border/80 hover:border-primary/60 hover:bg-accent/40 bg-card/60'
              }`}
            >
              {isDragging && <BorderBeam size={100} duration={4} colorFrom="#2563eb" colorTo="#38bdf8" />}
              
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[slot.key] = el;
                }}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  validateAndAddFile(slot.key, file);
                }}
              />

              <CardContent className="p-4 flex flex-col items-center justify-center text-center min-h-[180px] gap-2.5">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  {isDragging ? <UploadCloud className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {slot.label} {slot.required && <span className="text-rose-500 font-bold">*</span>}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Click to browse or drop file here
                  </p>
                </div>

                <Badge
                  variant={slot.required ? 'default' : 'outline'}
                  className={`text-[10px] font-medium py-0 px-2 h-5 ${
                    slot.required
                      ? 'bg-blue-600/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900/50'
                      : 'text-muted-foreground'
                  }`}
                >
                  {slot.required ? 'Required Panel' : 'Optional Reference'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
