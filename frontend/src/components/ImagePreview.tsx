import React, { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Trash2, Image as ImageIcon } from "lucide-react"

export interface ImageSlotItem {
  file: File
  previewUrl: string
}

export interface ImagePreviewProps {
  slotKey: string
  slotLabel: string
  imageItem: ImageSlotItem | null
  onRemove: (slotKey: string) => void
  onReplace?: (slotKey: string, file: File) => void
}

export default function ImagePreview({
  slotKey,
  slotLabel,
  imageItem,
  onRemove,
  onReplace,
}: ImagePreviewProps): React.JSX.Element | null {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onReplace) {
      onReplace(slotKey, file)
    }
  }

  if (!imageItem) {
    return null
  }

  return (
    <div className="relative flex flex-col rounded-lg border border-border bg-card overflow-hidden shadow-xs">
      <div className="flex items-center justify-between p-2.5 bg-muted/40 border-b border-border">
        <Badge variant="outline" className="text-[10px] font-semibold bg-background">
          {slotLabel}
        </Badge>
        <span
          className="text-[10px] text-muted-foreground truncate max-w-[120px]"
          title={imageItem.file?.name}
        >
          {imageItem.file?.name || "Uploaded Image"}
        </span>
      </div>

      <div className="relative aspect-4/3 w-full bg-muted/20 flex items-center justify-center overflow-hidden">
        <img
          src={imageItem.previewUrl}
          alt={`${slotLabel} packaging view`}
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex items-center justify-between p-2 border-t border-border bg-muted/20 gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 gap-1 text-[11px]"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Replace</span>
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="xs"
          onClick={() => onRemove(slotKey)}
          className="flex-1 gap-1 text-[11px]"
        >
          <Trash2 className="h-3 w-3" />
          <span>Remove</span>
        </Button>
      </div>
    </div>
  )
}
