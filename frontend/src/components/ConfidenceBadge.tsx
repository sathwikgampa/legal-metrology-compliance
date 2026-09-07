import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ConfidenceBadgeProps {
  value: number | string | null | undefined
  showLabel?: boolean
  size?: "sm" | "default" | "lg"
  className?: string
}

export default function ConfidenceBadge({
  value,
  showLabel = true,
  size = "default",
  className = "",
}: ConfidenceBadgeProps): React.JSX.Element {
  if (value === null || value === undefined) {
    return (
      <Badge variant="neutral" size={size === "sm" ? "sm" : "default"} className={className}>
        N/A
      </Badge>
    )
  }

  const numeric = typeof value === "number" ? value : parseFloat(value)
  const percentage = Math.round(numeric <= 1.0 ? numeric * 100 : numeric)

  let variant: "compliant" | "warning" | "destructive" = "compliant"
  let labelText = "High"
  let dotColor = "bg-emerald-500"

  if (percentage < 70) {
    variant = "destructive"
    labelText = "Low"
    dotColor = "bg-rose-500"
  } else if (percentage < 90) {
    variant = "warning"
    labelText = "Medium"
    dotColor = "bg-amber-500"
  }

  return (
    <Badge
      variant={variant}
      size={size === "sm" ? "sm" : "default"}
      className={cn("gap-1.5 font-mono font-bold", className)}
      title={`OCR Confidence: ${percentage}% (${labelText})`}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColor)} />
      <span>{percentage}%</span>
      {showLabel && <span className="opacity-80 font-normal">({labelText})</span>}
    </Badge>
  )
}
