import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ComplianceStatusProps {
  status: string
  size?: "sm" | "default" | "md" | "lg"
  iconOnly?: boolean
  className?: string
}

export default function ComplianceStatus({
  status,
  size = "default",
  iconOnly = false,
  className = "",
}: ComplianceStatusProps): React.JSX.Element {
  const normalized = (status || "").toUpperCase()
  const badgeSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default"

  switch (normalized) {
    case "COMPLIANT":
      return (
        <Badge
          variant="compliant"
          size={badgeSize}
          className={cn("gap-1 font-mono uppercase tracking-wider font-bold", className)}
          title="Fully Compliant with Packaged Commodities Rules"
        >
          <span>🟢</span>
          {!iconOnly && <span>COMPLIANT</span>}
        </Badge>
      )

    case "POTENTIAL_VIOLATION":
      return (
        <Badge
          variant="violation"
          size={badgeSize}
          className={cn("gap-1 font-mono uppercase tracking-wider font-bold", className)}
          title="Potential Non-Compliance Identified"
        >
          <span>🔴</span>
          {!iconOnly && <span>POTENTIAL VIOLATION</span>}
        </Badge>
      )

    case "NEEDS_REVIEW":
    case "POOR_IMAGE_QUALITY":
    case "LOW_CONFIDENCE":
      return (
        <Badge
          variant="warning"
          size={badgeSize}
          className={cn("gap-1 font-mono uppercase tracking-wider font-bold", className)}
          title="Uncertain Evidence — Requires Officer Examination"
        >
          <span>🟡</span>
          {!iconOnly && <span>NEEDS REVIEW</span>}
        </Badge>
      )

    case "NOT_DETECTED":
      return (
        <Badge
          variant="warning"
          size={badgeSize}
          className={cn("gap-1 font-mono uppercase tracking-wider font-bold", className)}
          title="Mandatory declaration was not detected by OCR in scanned surfaces"
        >
          <span>⚠️</span>
          {!iconOnly && <span>NOT DETECTED</span>}
        </Badge>
      )

    default:
      return (
        <Badge
          variant="neutral"
          size={badgeSize}
          className={cn("gap-1 font-mono uppercase tracking-wider font-medium", className)}
        >
          <span>⚪</span>
          {!iconOnly && <span>{status || "PENDING"}</span>}
        </Badge>
      )
  }
}
